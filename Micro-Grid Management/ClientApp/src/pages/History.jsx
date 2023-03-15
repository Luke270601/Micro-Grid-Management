import {TabPanel} from "../components/SideBar";
import {Visualiser} from "../components/Visualiser";
import React from "react";
import $ from "jquery";

export function History() {

    let interval = 0;
    let array = [];
    populateArray();

    function removeOptions(selectElement) {
        let i, L = selectElement.options.length - 1;
        for(i = L; i >= 0; i--) {
            selectElement.remove(i);
        }
    }
    
    function updateSlider() {
        interval = document.getElementById("slider").value / 10
        document.getElementById("seconds").innerText = interval
    }


    function populateArray() {
        $.getJSON("https://localhost:44314/api/GetSimData/GetNames", function () {

        })
            .done(function (data) {
                createList(data)
            })
            .fail(function () {
                console.log("Error")
            });
    }

    function getData(id) {
        $.getJSON("https://localhost:44314/api/GetSimData/GetNames/" + id, function () {

        })
            .done(function (data) {
                createList(data)
            })
            .fail(function () {
                console.log("Error")
            });
    }
    
    function populateInformation(){
        let option = document.getElementById("simData").value
        document.getElementById("turbines").innerText = array[option].turbineCount 
        document.getElementById("panels").innerText = array[option].panelCount
        document.getElementById("houses").innerText = array[option].houseCount
        document.getElementById("date").innerText = array[option].date
    }

    function createList(list) {
        array = list
        removeOptions(document.getElementById("simData"))
        //Create and append the options
        for (let i = 0; i < list.length; i++) {
            let option = document.createElement("option");
            option.value = [i];
            option.text = "Simulation ID: " + list[i].simId;
            document.getElementById("simData").appendChild(option);
        }

        let option = document.getElementById("simData").value
        document.getElementById("turbines").innerText = array[option].turbineCount
        document.getElementById("panels").innerText = array[option].panelCount
        document.getElementById("houses").innerText = array[option].houseCount
        document.getElementById("date").innerText = array[option].date
        
        return array
    }

    return (
        <div id={"simulate"}>
            <TabPanel/>
            <div className={"settings-container"}>
                <div className="settings-card card">
                    <h3 className="settings-card-header text-lg-start">Settings</h3>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <div className="form-group">
                                    <label htmlFor="simSelect">Simulation Select</label>
                                    <select className="form-control" id="simData" onClick={populateInformation}>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="turbines">Number of Turbines</label>
                                    <text className="form-control" id="turbines"></text>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="panels">Number of Panels</label>
                                    <text className="form-control" id="panels"></text>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="houses">Number of Houses</label>
                                    <text className="form-control" id="houses"></text>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Date">Date Recorded</label>
                                    <text className="form-control" id="date"></text>
                                </div>
                                <label htmlFor="duration">Interval of action (seconds)</label><br/>
                                <input id={"slider"} type="range" min="1" max="50" onChange={updateSlider}
                                       onLoad={updateSlider}/>
                                <text className={"form-control"} id={"seconds"}>0</text>
                            </div>
                        </form>
                    </div>
                </div>
                    <Visualiser></Visualiser>
            </div>
        </div>
    );
}