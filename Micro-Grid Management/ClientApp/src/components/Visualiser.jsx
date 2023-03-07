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

export function Visualiser() {

    let [charge, setCharge] = useState(0);
    let fromGrid = 0;
    let stored = 0;
    let interval = 0;

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

    const handleIncreaseCharge = (power) => {
        if (((power / 1000) / 2000) * 100 < 100) {
            setCharge((charge + (power / 1000)) / 2000 * 100);
            document.getElementById("capacity").innerText = "Energy Stored: " + power / 1000 + "/2000 MW/h"
        }
    };

    const handleDecreaseCharge = (power) => {
        if (((power / 1000) / 2000) * 100 > 0) {
            setCharge(charge - (power / 1000) / 2000 * 100);
            document.getElementById("capacity").innerText = "Energy Stored: " + power / 1000 + "/2000 MW/h"
        }
    };

    const handleEmpty = () => {
        setCharge(0)
        charge = 0
        let power = 0;
        document.getElementById("capacity").innerText = "Energy Stored: 0/2000 MW/h"
    };

    function getSimData() {
        document.getElementById("toggle-btn").disabled = true;
        document.getElementById("turbines").disabled = true;
        document.getElementById("duration").disabled = true;
        document.getElementById("panels").disabled = true;
        document.getElementById("houses").disabled = true;
        handleEmpty()
        let duration = document.getElementById("duration").value
        let turbineCount = document.getElementById("turbines").value
        let panelCount = document.getElementById("panels").value
        let houseCount = document.getElementById("houses").value
        interval = parseFloat(document.getElementById("seconds").innerText)

        if (duration < 2 && turbineCount != null && panelCount != null && houseCount > 0 && interval > 0) {
            $.getJSON("https://localhost:44314/api/Simulation?duration=" + duration + "&turbineCount=" + turbineCount + "&panelCount=" + panelCount + "&houseCount=" + houseCount, function () {

            })
                .done(function (data) {
                    alert("Beginning Simulation")
                    runSim(data, turbineCount, panelCount, houseCount)
                })
                .fail(function () {
                    alert("Web api not currently active, please try again later.")
                    document.getElementById("toggle-btn").disabled = false;
                    document.getElementById("turbines").disabled = false;
                    document.getElementById("duration").disabled = false;
                    document.getElementById("panels").disabled = false;
                    document.getElementById("houses").disabled = false;
                });
        } else {
            alert("All fields must be filled (Duration must be 1 and house count exceed 0)")
            document.getElementById("toggle-btn").disabled = false;
            document.getElementById("turbines").disabled = false;
            document.getElementById("duration").disabled = false;
            document.getElementById("panels").disabled = false;
            document.getElementById("houses").disabled = false;
        }

    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async function runSim(json, turbineCount, panelCount, houseCount) {
        let hours = 0;

        startAnimation()

        let count = 0
        let hourCount = 0;
        let totalAgents = parseInt(turbineCount) + parseInt(panelCount) + parseInt(houseCount)
        let houseList = [];
        let turbineList = [];
        let panelList = [];
        let data = eval(json)

        for (let i = 0; i < data.length; i++) {

            if (document.getElementById("houses") != null) {

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
                    hours++
                    interval = parseFloat(document.getElementById("seconds").innerText)
                    count = 0
                    let houseDemand = 0;
                    let turbineSupply = 0;
                    let solarSupply = 0;
                    hourCount++;

                    clearList("house-list")
                    for (let h = 0; h < houseList.length; h++) {
                        houseDemand += parseFloat(houseList[h].Message)
                        addItemToList((houseList[h].Sender + " : " + houseList[h].Message + " KW/h\n"), "house-list")
                        if (h === houseList.length - 1) {
                            interval = parseFloat(document.getElementById("seconds").innerText)
                            document.getElementById("line5").style.animation = "houseLine " + interval + "s linear"
                            await sleep(interval * 1000);
                            document.getElementById("line5").style.animation = ""
                            document.getElementById('house-message').innerText = ("Total Demand: " + Math.round(houseDemand) + " KW/h\n");
                        }
                    }

                    clearList("turbine-list")
                    for (let t = 0; t < turbineList.length; t++) {
                        turbineSupply += parseFloat(turbineList[t].Message)
                        addItemToList((turbineList[t].Sender + " : " + turbineList[t].Message + " KW/h\n"), "turbine-list")
                        if (t === turbineList.length - 1) {
                            interval = parseFloat(document.getElementById("seconds").innerText)
                            document.getElementById("line2").style.animation = "turbineLine  " + interval + "s linear"
                            await sleep(interval * 1000);
                            document.getElementById("line2").style.animation = ""
                            document.getElementById('turbine-message').innerText = ("Total Turbine Supply: " + Math.round(turbineSupply) + " KW/h\n");
                        }
                    }

                    clearList("panel-list")
                    for (let p = 0; p < panelList.length; p++) {
                        solarSupply += parseFloat(panelList[p].Message)
                        addItemToList((panelList[p].Sender + " : " + panelList[p].Message + " KW/h\n"), "panel-list")
                        if (p === panelList.length - 1) {
                            interval = parseFloat(document.getElementById("seconds").innerText)
                            document.getElementById("line3").style.animation = "solarLine  " + interval + "s linear"
                            await sleep(interval * 1000);
                            document.getElementById("line3").style.animation = ""
                            document.getElementById('panel-message').innerText = ("Total Solar Supply: " + Math.round(solarSupply) + " KW/h\n");
                        }
                    }

                    interval = parseFloat(document.getElementById("seconds").innerText)
                    if (data[i + 1].Message.split(" ")[0] === "Removed:") {
                        document.getElementById("grid-manager-message").innerText = "Gird Status: Requesting supply from battery"
                        document.getElementById("line1").style.animation = "batteryOutLine  " + interval + "s linear"
                        await sleep(interval * 1000);
                        document.getElementById("line1").style.animation = ""
                        stored -= Math.round((parseFloat((data[i + 1].Message.split(" ")[1])) + Number.EPSILON) * 100) / 100
                        handleDecreaseCharge(stored)
                    }

                    if (data[i + 1].Message.split(" ")[0] === "Stored:") {
                        document.getElementById("grid-manager-message").innerText = "Gird Status: Storing excess energy"
                        document.getElementById("line1").style.animation = "batteryInLine  " + interval + "s linear"
                        stored = Math.round((parseFloat((data[i + 1].Message.split(" ")[1])) + Number.EPSILON) * 100) / 100
                        await sleep(interval * 1000);
                        document.getElementById("line1").style.animation = ""
                        handleIncreaseCharge(stored)
                    }

                    if (data[i + 1].Message.split(" ")[0] === "Remaining:") {
                        document.getElementById("grid-manager-message").innerText = "Gird Status: Requesting supply from grid"
                        document.getElementById("line4").style.animation = "gridLine  " + interval + "s linear"
                        await sleep(interval * 1000);
                        document.getElementById("line4").style.animation = "0"
                        fromGrid += (Math.round((parseFloat((data[i + 1].Message.split(" ")[1])) + Number.EPSILON) * 100) / 100)
                        document.getElementById("grid-message").innerText = "Total From Grid: " + fromGrid + " KW/h";
                        handleEmpty()
                    }

                    houseList = [];
                    turbineList = [];
                    panelList = [];

                    updateClock(hours)
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
                handleEmpty()
                break;
            }
        }

        if(document.getElementById("houses") != null) {
            stopAnimation()
            document.getElementById("toggle-btn").disabled = false;
            document.getElementById("turbines").disabled = false;
            document.getElementById("duration").disabled = false;
            document.getElementById("panels").disabled = false;
            document.getElementById("houses").disabled = false;
        }
    }

    return (
        <>
            <div className={"simulation-panel"}>
                <div className="card visualiser-card">
                    <div className={"visualiser-header"}>
                        <h3 className="card-header ">Visualiser
                        </h3>
                        <Clock></Clock>
                    </div>
                    <div className={"visualiser-container"}>
                        <div className="card-body-visualiser battery-icon">
                            <Battery charge={charge}/>
                            <div id={"capacity"} className={"message"}>Energy Stored: 0/2000 MW/h</div>
                            <div id="line1"><EnergyMarker></EnergyMarker></div>
                        </div>
                        <div className="wind-turbine-animated turbine-icon">
                            <WindTurbine></WindTurbine>
                            <div className="dropdown">
                                <div className="dropdown-content">
                                    <div className="list-container">
                                        <ul className="list" id={"turbine-list"}>
                                        </ul>
                                    </div>
                                </div>
                                <div id={"turbine-message"} className={"message"}>Total Turbine Supply: 0 KW/h</div>
                            </div>
                            <div id="line2"><EnergyMarker></EnergyMarker></div>
                        </div>
                        <div className="card-body-visualiser solar-icon">
                            <Panel></Panel>
                            <div className="dropdown">
                                <div className="dropdown-content">
                                    <div className="list-container">
                                        <ul className="list" id={"panel-list"}>
                                        </ul>
                                    </div>
                                </div>
                                <div id={"panel-message"} className={"message"}>Total Solar Supply: 0 KW/h</div>
                            </div>
                            <div id="line3"><EnergyMarker></EnergyMarker></div>
                        </div>
                        <div className="card-body-visualiser">
                        </div>
                        <div className="grid-manager-icon">
                            <GridManager></GridManager>
                            <div id="line4"><EnergyMarker></EnergyMarker></div>
                        </div>
                        <div className="card-body-visualiser">
                        </div>
                        <div className="grid-icon">
                            <div id="line6"><EnergyMarker></EnergyMarker></div>
                            <div id={"grid-message"} className={"message"}>Total From Grid: 0 KW/h</div>
                            <Grid></Grid>
                        </div>
                        <div className="house-icon">
                            <div id="line6"></div>
                            <div id={"grid-manager-message"} className={"message"}>Grid Status:</div>
                            <br/>
                            <br/>
                            <House></House>
                        </div>
                        <div className="house-icon">
                            <div id="line5"><EnergyMarker></EnergyMarker></div>
                            <div className="dropdown">
                                <div className="dropdown-content">
                                    <div className="list-container">
                                        <ul className="list" id={"house-list"}>
                                        </ul>
                                    </div>
                                </div>
                                <div id={"house-message"} className={"message"}>Total House Demand: 0 KW/h</div>
                            </div>
                            <br/>
                            <br/>
                            <House></House>
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