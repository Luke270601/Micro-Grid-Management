import React, {useState} from "react";
import Battery from "./Battery";
import {House, Panel, WindTurbine, Grid, GridManager} from "./wind-turbine";
import {func} from "prop-types";
import {getElement} from "bootstrap/js/src/util";
import {Clock} from "./Clock";

export function Visualiser() {

    const [charge, setCharge] = useState(0);
    let toggle = false;


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

    function starSim() {
        const blade1 = document.getElementById("blades-1")
        const blade2 = document.getElementById("blades-2")
        const blade3 = document.getElementById("blades-3")
        
        if (!toggle) {
            blade1.style.animation = "turbine 2s infinite linear"
            blade2.style.animation = "turbine 2s infinite linear"
            blade3.style.animation = "turbine 2s infinite linear"
            toggle = true
        } 
        
        else if(toggle) {
            blade1.style.animation = ""
            blade2.style.animation = ""
            blade3.style.animation = ""
            toggle = false
        }
    }

    return (
        <>
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
                    </div>
                    <div className="grid-icon">
                        <Grid></Grid>
                    </div>
                    <div className="house-icon">
                        <House></House>
                    </div>
                    <div className="house-icon">
                        <House></House>
                        <button id={"toggle-btn"} type={"button"} className={"btn btn-primary"} onClick={starSim}>Start
                            Sim
                        </button>
                    </div>
                </div>
                <Clock/>
            </div>
        </>
    );
}