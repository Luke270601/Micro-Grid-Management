import {TabPanel} from "../components/SideBar";
import {Visualiser} from "../components/Visualiser";
import React from "react";

export function History(){

    let interval = 0;

    function updateSlider (){
        interval = document.getElementById("slider").value/10
        document.getElementById("seconds").innerText = interval
    }
    
    return(
        <div id={"simulate"}>
            <TabPanel/>
            <div className={"settings-container"}>
                <div className="settings-card card">
                    <h3 className="settings-card-header text-lg-start">Settings</h3>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="duration">Interval of action (seconds)</label><br/>
                                <input id={"slider"} type="range" min="1" max="50" onChange={updateSlider} onLoad={updateSlider}/>
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