import {TabPanel} from "../components/SideBar";
import {Visualiser} from "../components/Visualiser";
import React from "react";
import $ from "jquery";

export function History() {

    let interval = 0;
    populateArray();
    function updateSlider() {
        interval = document.getElementById("slider").value / 10
        document.getElementById("seconds").innerText = interval
    }

    function removeOptions(selectElement) {
        var i, L = selectElement.options.length - 1;
        for(i = L; i >= 0; i--) {
            selectElement.remove(i);
        }
    }
    
    
    function populateArray(){
        $.getJSON("https://localhost:44314/api/GetSimData/GetNames", function () {

        })
            .done(function (data) {
                createList(data)
            })
            .fail(function () {
                console.log("Error")
            });
    }

    function createList(array) {
        removeOptions(document.getElementById('simData'));
        //Create and append the options
            for (let i = 0; i < array.length; i++) {
                let option = document.createElement("option");
                option.value = array[i];
                option.text = array[i];
                document.getElementById("simData").appendChild(option);
            }
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
                                    <select className="form-control" id="simData">
                                    </select>
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