import React, {useState} from "react";
import Battery from "./Battery";
import {
    House,
    Panel,
    WindTurbine,
    Grid,
    GridManager,
    stopAnimation,
    startAnimation,
    EnergyMarker
} from "./wind-turbine";
import {Clock, updateClock} from "./Clock";
import $ from "jquery";
import Plot from "react-plotly.js";

export function Visualiser() {

    let [charge, setCharge] = useState(0);
    let fromGrid = 0;
    let stored = 0;
    let interval = 0;
    let days = 0;

    function addItemToList(itemText, listName) {
        const list = document.getElementById(listName);
        const newItem = document.createElement("li");
        const textNode = document.createTextNode(itemText);
        newItem.appendChild(textNode);
        list.appendChild(newItem);
    }

    function clearList(listName) {
        const list = document.getElementById(listName);
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
    }

    function getSimData() {
        try {
            document.getElementById("toggle-btn").disabled = true;
            document.getElementById("turbines").disabled = true;
            document.getElementById("duration").disabled = true;
            document.getElementById("panels").disabled = true;
            document.getElementById("houses").disabled = true;
            document.getElementById("month").disabled = true;
            let duration = document.getElementById("duration").value
            let turbineCount = document.getElementById("turbines").value
            let panelCount = document.getElementById("panels").value
            let houseCount = document.getElementById("houses").value
            let monthOfYear = document.getElementById("month").value.substring(0, 3)
            interval = parseFloat(document.getElementById("seconds").innerText)

            if (turbineCount != null && panelCount != null && houseCount > 0 && interval > 0) {
                $.getJSON("https://localhost:44314/api/Simulation?duration=" + duration + "&turbineCount=" + turbineCount + "&panelCount=" + panelCount + "&houseCount=" + houseCount + "&monthOfTheYear=" + monthOfYear, function () {

                })
                    .done(function (data) {
                        alert("Beginning Simulation")
                        runSim(data, turbineCount, panelCount, houseCount, false)
                    })
                    .fail(function () {
                        alert("Web api not currently active, please try again later.")
                        document.getElementById("toggle-btn").disabled = false;
                        document.getElementById("turbines").disabled = false;
                        document.getElementById("duration").disabled = false;
                        document.getElementById("panels").disabled = false;
                        document.getElementById("houses").disabled = false;
                        document.getElementById("month").disabled = false;
                    });
            } 
            
            else {
                alert("All fields must be filled (house count exceed 0)")
                document.getElementById("toggle-btn").disabled = false;
                document.getElementById("turbines").disabled = false;
                document.getElementById("duration").disabled = false;
                document.getElementById("panels").disabled = false;
                document.getElementById("houses").disabled = false;
                document.getElementById("month").disabled = false;
            }
            
        } catch (error) {
            let turbineCount = parseInt(document.getElementById("turbines").innerText)
            let panelCount = parseInt(document.getElementById("panels").innerText)
            let houseCount = parseInt(document.getElementById("houses").innerText)
            let id = document.getElementById("simData").value
            interval = parseFloat(document.getElementById("seconds").innerText)

            if(turbineCount != null && panelCount != null && houseCount > 0 && interval > 0) {
                $.getJSON("https://localhost:44314/api/GetSimData/GetData/" + id, function () {

                })
                    .done(function (data) {
                        alert("Data received starting simulation")
                        runSim(data, turbineCount, panelCount, houseCount, true)
                    })
                    .fail(function () {
                        alert("Web api not active please try again later")
                    });
            }
            else {
                alert("Interval must exceed 0")
                document.getElementById("toggle-btn").disabled = false;
            }

        }

    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async function runSim(json, turbineCount, panelCount, houseCount, previousSim) {
        let hours = 0;
        let duration = 0;
        if (previousSim) {
            duration = document.getElementById("duration").innerText
        }
        else {
            duration = document.getElementById("duration").value
        }
        days = duration
        document.getElementById("days-remaining").innerText = "Days Remaining: " + duration

        startAnimation()

        let count = 0
        let totalAgents = parseInt(turbineCount) + parseInt(panelCount) + parseInt(houseCount)
        let houseList = [];
        let turbineList = [];
        let panelList = [];
        let data = eval(json)

        for (let i = 0; i < data.length; i++) {

            if (document.getElementById("houses").disabled || previousSim) {

                if (data[i].Sender.includes("houseAgent") || data[i].Sender.includes("solarPanel") || data[i].Sender.includes("turbine")) {
                    if (data[i].Sender.includes("houseAgent")) {
                        houseList.push(data[i])
                    }

                    if (data[i].Sender.includes("solarPanel")) {
                        panelList.push(data[i])
                    }

                    if (data[i].Sender.includes("turbine")) {
                        turbineList.push(data[i])
                    }
                    count++;
                }

                if (count === totalAgents) {
                    interval = parseFloat(document.getElementById("seconds").innerText)
                    count = 0
                    let houseDemand = 0;
                    let turbineSupply = 0;
                    let solarSupply = 0;
                    interval = parseFloat(document.getElementById("seconds").innerText)
                    await sleep(interval * 1000);
                    
                    clearList("house-list")
                    for (let h = 0; h < houseList.length; h++) {
                        houseDemand += parseFloat(houseList[h].Message)
                        addItemToList((houseList[h].Sender + " : " + houseList[h].Message + " KW/h\n"), "house-list")
                        if (h === houseList.length - 1) {

                        }
                    }

                    clearList("turbine-list")
                    for (let t = 0; t < turbineList.length; t++) {
                        turbineSupply += parseFloat(turbineList[t].Message)
                        addItemToList((turbineList[t].Sender + " : " + turbineList[t].Message + " KW/h\n"), "turbine-list")
                        if (t === turbineList.length - 1) {

                        }
                    }

                    clearList("panel-list")
                    for (let p = 0; p < panelList.length; p++) {
                        solarSupply += parseFloat(panelList[p].Message)
                        addItemToList((panelList[p].Sender + " : " + panelList[p].Message + " KW/h\n"), "panel-list")
                        if (p === panelList.length - 1) {
                        }
                    }

                    interval = parseFloat(document.getElementById("seconds").innerText)
                    if (data[i + 1].Message.split(" ")[0] === "Removed:") {
                        stored -= Math.round((parseFloat((data[i + 1].Message.split(" ")[1])) + Number.EPSILON) * 100) / 100
                    }

                    if (data[i + 1].Message.split(" ")[0] === "Stored:") {
                        stored = Math.round((parseFloat((data[i + 1].Message.split(" ")[1])) + Number.EPSILON) * 100) / 100
                    }

                    if (data[i + 1].Message.split(" ")[0] === "Remaining:") {
                        fromGrid += (Math.round((parseFloat((data[i + 1].Message.split(" ")[1])) + Number.EPSILON) * 100) / 100)
                        stored = 0;
                    }

                    houseList = [];
                    turbineList = [];
                    panelList = [];
                    hours++

                    if (hours > 23) {
                        updateClock(hours)
                        days--;
                        document.getElementById("days-remaining").innerText = "Days Remaining: " + days
                        hours = 0;
                    } else {
                        updateClock(hours)
                    }
                }
            } else {
                document.getElementById("clock").innerText = "00:00"
                clearList("house-list")
                clearList("turbine-list")
                clearList("panel-list")
                document.getElementById("grid-message").innerText = "Total From Grid: 0KW/h";
                document.getElementById('panel-message').innerText = ("Total Solar Supply: 0KW/h\n");
                document.getElementById('turbine-message').innerText = ("Total Turbine Supply: 0KW/h\n");
                document.getElementById('house-message').innerText = ("Total Demand: 0KW/h\n");
                document.getElementById("grid-manager-message").innerText = "Gird Status: ";
                break;
            }
        }

        if (document.getElementById("houses").disabled) {
            stopAnimation()
            document.getElementById("toggle-btn").disabled = false;
            document.getElementById("turbines").disabled = false;
            document.getElementById("duration").disabled = false;
            document.getElementById("panels").disabled = false;
            document.getElementById("houses").disabled = false;
            document.getElementById("month").disabled = false;
        }

        if (previousSim) {
            document.getElementById("toggle-btn").disabled = false;
            document.getElementById("turbines").disabled = false;
            document.getElementById("panels").disabled = false;
            document.getElementById("houses").disabled = false;
            stopAnimation()
        }
    }

    return (
        <>
            <div className={"simulation-panel"}>
                <div className="card visualiser-card">
                    <div className={"visualiser-header"}>
                        <h3 className="card-header ">Visualiser
                        </h3>
                        <h4 className="card-header " id={"days-remaining"}>Days Remaining:</h4>
                        <Clock></Clock>
                    </div>
                    <div className={"visualiser-container"}>
                        <div className="card-body-visualiser battery-icon">
                            <div id={"capacity"} className={"message"}>Energy Stored: 0/2000 MW/h</div>
                        </div>
                        <div className="wind-turbine-animated turbine-icon">
                            <div className="dropdown">
                                <div className="dropdown-content">
                                    <div className="list-container">
                                        <ul className="list" id={"turbine-list"}>
                                        </ul>
                                    </div>
                                </div>
                                <div id={"turbine-message"} className={"message"}>Total Turbine Supply: 0 KW/h</div>
                            </div>
                        </div>
                        <div className="card-body-visualiser solar-icon">
                            <div className="dropdown">
                                <div className="dropdown-content">
                                    <div className="list-container">
                                        <ul className="list" id={"panel-list"}>
                                        </ul>
                                    </div>
                                </div>
                                <div id={"panel-message"} className={"message"}>Total Solar Supply: 0 KW/h</div>
                            </div>
                        </div>
                        <div className="card-body-visualiser">
                        </div>
                        <div className="grid-manager-icon">
                        </div>
                        <div className="card-body-visualiser">
                        </div>
                        <div className="grid-icon">
                            <div id={"grid-message"} className={"message"}>Total From Grid: 0 KW/h</div>
                        </div>
                        <div className="house-icon">
                            <div id={"grid-manager-message"} className={"message"}>Grid Status:</div>
                        </div>
                        <div className="house-icon">
                            <div className="dropdown">
                                <div className="dropdown-content">
                                    <div className="list-container">
                                        <ul className="list" id={"house-list"}>
                                        </ul>
                                    </div>
                                </div>
                                <div id={"house-message"} className={"message"}>Total House Demand: 0 KW/h</div>
                            </div>
                        </div>
                    </div>
                </div>
                <button id={"toggle-btn"} type={"button"} className={"sim-start-button"} onClick={getSimData}>Start
                    Sim
                </button>
            </div>
        </>
    );
}