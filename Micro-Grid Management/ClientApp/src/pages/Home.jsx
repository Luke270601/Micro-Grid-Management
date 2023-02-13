﻿import $ from 'jquery';
import {TabPanel} from "../components/SideBar";


export function Home() {
    function getSimData() {
        let duration = document.getElementById("duration").value
        let turbineCount = document.getElementById("turbine-count").value
        let panelCount = document.getElementById("panel-count").value
        let houseCount = document.getElementById("house-count").value
        
        if(duration < 2 && turbineCount != null && panelCount != null && houseCount > 0) {
            $.getJSON("https://localhost:44314/api/Simulation?duration=" + duration + "&turbineCount=" + turbineCount +
                "&panelCount=" + panelCount + "&houseCount=" + houseCount, function () {

            })
                .done(function (data) {
                    alert("Data collected")
                    console.log(data);
                })
                .fail(function (){
                   alert("Web api not currently active, please try again later.") 
                });
        }
        
        else {
            alert("All fields must be filled (Duration must be 1 and house count exceed 0)")
        }
    }

    return (
        <div id={"Home"}>
            <TabPanel></TabPanel>
            <h5>Simulation Options</h5>
            <form>
                <div>
                    <label className={"form-label"}>Number of Turbines:</label>
                    <input type="number" className="form-control-sm px-4" id="turbine-count"/><br></br>
                    <label className={"form-label"}>Number of Solar Panels:</label>
                    <input type="number" className="form-control-sm px-4" id="panel-count"/><br></br>
                    <label className={"form-label"}>Number of Houses:</label>
                    <input type="number" className="form-control-sm px-4" id="house-count"/><br></br>
                    <label className={"form-label"}>Number of Days to simulate:</label>
                    <input type="number" className="form-control-sm px-4" id="duration"/><br></br>
                    <label className={"form-label"}>Month of the year:</label>
                    <select className="form-control-sm px-4">
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
                    </select><br></br>
                    <button type="button" className="btn btn-primary " onClick={getSimData}>Button</button>
                </div>
            </form>
        </div>

    );
}