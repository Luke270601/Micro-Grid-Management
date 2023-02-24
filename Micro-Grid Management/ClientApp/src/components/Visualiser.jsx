import React, {useState} from "react";
import Battery from "./Battery";
import {House, Panel, WindTurbine, Grid, GridManager} from "./wind-turbine";
import {Clock} from "./Clock";
import $ from "jquery";

export function Visualiser() {

    const [charge, setCharge] = useState(0);

    const handleIncreaseCharge = () => {
        if (charge < 100) {
            setCharge(charge + 1);
            Math.round(charge)
        }
    };

    const handleDecreaseCharge = () => {
        if (charge > 0) {
            setCharge(charge - 10);
        }
    };

    function getSimData() {

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
                });
        } else {
            alert("All fields must be filled (Duration must be 1 and house count exceed 0)")
        }
    }

    function runSim(json, turbineCount, panelCount, houseCount) {
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
            
            if(count === totalAgents){
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
                    if (h === houseList.length-1){
                        console.log(houseResults)
                        console.log("Total Demand: " + houseDemand + " KW/h\n")
                    }
                }

                for (let t = 0; t < turbineList.length; t++) {

                    turbineSupply += parseFloat(turbineList[t].Message)
                    turbineResults += turbineList[t].Sender + " : " + turbineList[t].Message + " KW/h\n"
                    if (t === turbineList.length-1){
                        console.log(turbineResults)
                        console.log("Total Turbine Supply: " + turbineSupply + " KW/h\n")
                    }
                }

                for (let p = 0; p < panelList.length; p++) {
                    
                    solarSupply += parseFloat(panelList[p].Message)
                    panelResults += panelList[p].Sender + " : " + panelList[p].Message + " KW/h\n"
                    if (p === panelList.length-1){
                        console.log(panelResults)
                        console.log("Total Solar Supply: " + solarSupply + " KW/h\n")
                    }
                }


                houseList = [];
                turbineList = [];
                panelList = [];
            }
        }
        setTimeout(stopAnimation, 12)
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
                    <h3 className="card-header text-lg-start ">Visualiser</h3>
                    <div className={"visualiser-container"}>
                        <div className="card-body-visualiser">
                            <Battery charge={charge}/>
                            <button type={"button"} onClick={handleIncreaseCharge}
                                    className={"btn btn-outline-dark"}></button>
                        </div>
                        <div className="wind-turbine-animated grid-item">
                            <WindTurbine></WindTurbine>
                        </div>
                        <div className="card-body-visualiser grid-item">
                            <Panel></Panel>
                        </div>
                        <div className="card-body-visualiser">
                        </div>
                        <div className="grid-manager-icon">
                            <GridManager></GridManager>
                        </div>
                        <div className="card-body-visualiser">
                            <Clock></Clock>
                        </div>
                        <div className="grid-icon">
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