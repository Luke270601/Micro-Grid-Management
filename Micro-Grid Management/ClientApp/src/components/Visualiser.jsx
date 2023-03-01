import React, {useState} from "react";
import Battery from "./Battery";
import {House, Panel, WindTurbine, Grid, GridManager} from "./wind-turbine";
import {Clock, updateClock} from "./Clock";
import $ from "jquery";

export function Visualiser() {

    let [charge, setCharge] = useState(0);
    let fromGrid = 0;

    const handleIncreaseCharge = (power) => {
        if (charge / 2000 < 100) {
            setCharge((charge + (power / 1000))/2000*100);
            document.getElementById("capacity").innerText = power/1000 + "/2000 MW"
        }
    };

    const handleDecreaseCharge = (power) => {
        if (charge / 2000 > 0) {
            setCharge(charge - (power / 1000)/2000*100);
            document.getElementById("capacity").innerText = power/1000 + "/2000 MW"
        }
    };

    const handleEmpty = () => {
        setCharge(0)
        charge = 0
        let power = 0;
        document.getElementById("capacity").innerText = power + "/2000 MW"
    };

    function getSimData() {
        document.getElementById("toggle-btn").disabled = true;
        handleEmpty()
        let duration = document.getElementById("duration").value
        let turbineCount = document.getElementById("turbines").value
        let panelCount = document.getElementById("panels").value
        let houseCount = document.getElementById("houses").value

        if (duration < 2 && turbineCount != null && panelCount != null && houseCount > 0) {
            $.getJSON("https://localhost:44314/api/Simulation?duration=" + duration + "&turbineCount=" + turbineCount + "&panelCount=" + panelCount + "&houseCount=" + houseCount, function () {

            })
                .done(function (data) {
                    alert("Beginning Simulation")
                    runSim(data, turbineCount, panelCount, houseCount)
                })
                .fail(function () {
                    alert("Web api not currently active, please try again later.")
                    document.getElementById("toggle-btn").disabled = false;
                });
        } else {
            alert("All fields must be filled (Duration must be 1 and house count exceed 0)")
            document.getElementById("toggle-btn").disabled = false;
        }

    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async function runSim(json, turbineCount, panelCount, houseCount) {
        let hours = -1;

        startAnimation()

        let count = 0
        let hourCount = 0;
        let totalAgents = parseInt(turbineCount) + parseInt(panelCount) + parseInt(houseCount)
        let houseList = [];
        let turbineList = [];
        let panelList = [];
        let data = eval(json)

        for (let i = 0; i < data.length; i++) {

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
                updateClock(hours)
                hours++
                count = 0
                let houseResults = "";
                let turbineResults = "";
                let panelResults = "";
                let houseDemand = 0;
                let turbineSupply = 0;
                let solarSupply = 0;
                hourCount++;

                for (let h = 0; h < houseList.length; h++) {

                    houseDemand += parseFloat(houseList[h].Message)
                    houseResults += houseList[h].Sender + " : " + houseList[h].Message + " KW/h\n"
                    if (h === houseList.length - 1) {
                        await sleep(1000);
                        document.getElementById('house-message').innerText = ("Total Demand: " + Math.round(houseDemand) + " KW/h\n");
                    }
                }

                for (let t = 0; t < turbineList.length; t++) {

                    turbineSupply += parseFloat(turbineList[t].Message)
                    turbineResults += turbineList[t].Sender + " : " + turbineList[t].Message + " KW/h\n"
                    if (t === turbineList.length - 1) {
                        await sleep(1000);
                        document.getElementById('turbine-message').innerText = ("Total Turbine Supply: " + Math.round(turbineSupply) + " KW/h\n");
                    }
                }

                for (let p = 0; p < panelList.length; p++) {

                    solarSupply += parseFloat(panelList[p].Message)
                    panelResults += panelList[p].Sender + " : " + panelList[p].Message + " KW/h\n"
                    if (p === panelList.length - 1) {
                        await sleep(1000);
                        document.getElementById('panel-message').innerText = ("Total Solar Supply: " + Math.round(solarSupply) + " KW/h\n");
                    }
                }

                if (data[i + 1].Message.split(" ")[0] === "Removed:") {
                    handleDecreaseCharge(parseFloat(data[i + 1].Message.split(" ")[1]))
                }

                if (data[i + 1].Message.split(" ")[0] === "Stored:") {
                    handleIncreaseCharge(parseFloat(data[i + 1].Message.split(" ")[1]))
                }

                if (data[i + 1].Message.split(" ")[0] === "Remaining:") {
                    fromGrid += parseFloat(data[i + 1].Message.split(" ")[1])
                    document.getElementById("grid-message").innerText = "Total From Grid: " + fromGrid + " KW/h";
                    handleEmpty()
                }

                houseList = [];
                turbineList = [];
                panelList = [];
                turbineSupply = 0
                solarSupply = 0
                houseDemand = 0
            }
        }
        stopAnimation()
        document.getElementById("toggle-btn").disabled = false;
    }

    function startAnimation() {
        document.getElementById("blades-1").style.animation = "turbine 2s infinite linear"
        document.getElementById("blades-2").style.animation = "turbine 2s infinite linear"
        document.getElementById("blades-3").style.animation = "turbine 2s infinite linear"
    }

    function stopAnimation() {
        document.getElementById("blades-1").style.animation = ""
        document.getElementById("blades-2").style.animation = ""
        document.getElementById("blades-3").style.animation = ""
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
                        <div className="card-body-visualiser">
                            <Battery charge={charge}/>
                            <div id={"capacity"}>0/2000 Mw</div>
                        </div>
                        <div className="wind-turbine-animated grid-item">
                            <div id={"turbine-message"}></div>
                            <WindTurbine></WindTurbine>
                        </div>
                        <div className="card-body-visualiser grid-item">
                            <div id={"panel-message"}></div>
                            <Panel></Panel>
                        </div>
                        <div className="card-body-visualiser">
                        </div>
                        <div className="grid-manager-icon">
                            <GridManager></GridManager>
                        </div>
                        <div className="card-body-visualiser">
                            <div id={"house-message"}></div>
                        </div>
                        <div className="grid-icon">
                            <div id={"grid-message"}></div>
                            <Grid></Grid>
                        </div>
                        <div className="house-icon">
                            <House></House>
                        </div>
                        <div className="house-icon">
                            <House></House>
                        </div>
                    </div>
                </div>
                <button id={"toggle-btn"} type={"button"} className={"btn btn-primary"} onClick={getSimData}>Start
                    Sim
                </button>
            </div>
        </>
    );
}