import {TabPanel} from "../components/SideBar";
import $ from "jquery";
import React from "react";
import {Visualiser} from "../components/Visualiser";

export function Simulate() {

    let interval = 0;

    function updateSlider() {
        interval = document.getElementById("slider").value / 10
        document.getElementById("seconds").innerText = interval
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
                <Visualiser></Visualiser>
            </div>
        </div>
    )
        ;
}