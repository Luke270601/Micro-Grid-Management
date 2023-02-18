import {TabPanel} from "../components/SideBar";
import $ from "jquery";
import React from "react";
import {Visualiser} from "../components/Visualiser";

export function Simulate() {
    function getSimData() {
        let duration = document.getElementById("duration").value
        let turbineCount = document.getElementById("turbines").value
        let panelCount = document.getElementById("panels").value
        let houseCount = document.getElementById("houses").value

        if (duration < 2 && turbineCount != null && panelCount != null && houseCount > 0) {
            $.getJSON("https://localhost:44314/api/Simulation?duration=" + duration + "&turbineCount=" + turbineCount + "&panelCount=" + panelCount + "&houseCount=" + houseCount, function () {

            })
                .done(function (data) {
                    alert("Data collected")
                    console.log(data);
                })
                .fail(function () {
                    alert("Web api not currently active, please try again later.")
                });
        } else {
            alert("All fields must be filled (Duration must be 1 and house count exceed 0)")
        }
    }

    return (
        <div id={"simulate"}>
            <TabPanel/>
                <div className={"settings-container"}>
                    <div className="settings-card card">
                        <h3 className="card-header text-lg-start">Settings</h3>
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
                                <button type="button" className="btn btn-primary" onClick={getSimData}>Submit</button>
                            </form>
                        </div>
                    </div>
                    <Visualiser></Visualiser>
                </div>
        </div>
    );
}