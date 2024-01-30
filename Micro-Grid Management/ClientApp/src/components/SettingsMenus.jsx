import React from "react";
import $ from "jquery";



export function SimulateSettings() {
    let interval = 0;

    function updateSlider() {
        interval = document.getElementById("slider").value / 10
        document.getElementById("seconds").innerText = interval
        return interval;
    }
    
    return (
            <div className="settings-card card">
                <h3 className="settings-card-header text-lg-start">Settings</h3>
                <div className="card-body">
                    <form>
                        <div className="form-group">
                            <label htmlFor="turbines">Number of Turbines</label>
                            <input type="number" className="form-control" id="turbines"
                                   placeholder="Enter the number of turbines"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="panels">Number of Panels</label>
                            <input type="number" className="form-control" id="panels"
                                   placeholder="Enter the number of panels"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="houses">Number of Houses</label>
                            <input type="number" className="form-control" id="houses"
                                   placeholder="Enter the number of houses"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="duration">Duration</label>
                            <input type="number" className="form-control" id="duration"
                                   placeholder="Enter the duration"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="month">Month of the Year</label>
                            <select className="form-control" id="month">
                                <option>January</option>
                                <option>February</option>
                                <option>March</option>
                                <option>April</option>
                                <option>May</option>
                                <option>June</option>
                                <option>July</option>
                                <option>August</option>
                                <option>September</option>
                                <option>October</option>
                                <option>November</option>
                                <option>December</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="duration">Interval of action (seconds)</label><br/>
                            <input id={"slider"} type="range" min="1" max="50" onChange={updateSlider}
                                   onLoad={updateSlider}/>
                            <text className={"form-control"} id={"seconds"}>0</text>
                        </div>
                    </form>
                </div>
        </div>
    );
}

export function HistorySettings() {
    let interval = 0;
    let array = [];
    populateArray();

    function updateSlider() {
        interval = document.getElementById("slider").value / 10
        document.getElementById("seconds").innerText = interval
        return interval;
    }
    
    function removeOptions(selectElement) {
        let i, L = selectElement.options.length - 1;
        for(i = L; i >= 0; i--) {
            selectElement.remove(i);
        }
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

    function populateInformation(){
        let option = document.getElementById("simData").selectedIndex
        document.getElementById("turbines").innerText = array[option].turbineCount
        document.getElementById("panels").innerText = array[option].panelCount
        document.getElementById("houses").innerText = array[option].houseCount
        document.getElementById("date").innerText = array[option].date
        document.getElementById("duration").innerText = array[option].duration
    }

    function createList(list) {
        array = list
        removeOptions(document.getElementById("simData"))
        //Create and append the options
        for (let i = 0; i < list.length; i++) {
            let option = document.createElement("option");
            option.value = list[i].simId;
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
                            <div className="form-group">
                                <label htmlFor="duration">Duration</label>
                                <div className="form-control" id="duration"></div>
                            </div>
                            <label htmlFor="duration">Interval of action (seconds)</label><br/>
                            <input id={"slider"} type="range" min="1" max="50" onChange={updateSlider}
                                   onLoad={updateSlider}/>
                            <text className={"form-control"} id={"seconds"}>0</text>
                        </div>
                    </form>
                </div>
        </div>
    );
}