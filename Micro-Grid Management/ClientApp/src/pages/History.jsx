import {TabPanel} from "../components/SideBar";
import {Visualiser} from "../components/Visualiser";
import React from "react";

export function History() {

    let interval = 0;
    let array = populateArray()
    
    function updateSlider() {
        interval = document.getElementById("slider").value / 10
        document.getElementById("seconds").innerText = interval
    }
    
    function populateArray(){
        let list = [""]
        for(let i = 0; i<10; i++){
            list[i] = "Sim " + i
        }
        return list
    }

    function createList() {
//Create array of options to be added

        if (array !== []) {
//Create and append the options
            for (let i = 0; i < array.length; i++) {
                let option = document.createElement("option");
                option.value = array[i];
                option.text = array[i];
                document.getElementById("simData").appendChild(option);
            }
        }
        
        array = [];
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
                                    <select className="form-control" id="simData" onClick={createList}>
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