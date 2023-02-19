import React, {useState} from "react";
import Battery from "./Battery";
import {House, Panel, WindTurbine, Grid, GridManager} from "./wind-turbine";

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
                    <div className="card-body-visualiser">
                        <GridManager></GridManager>
                    </div>
                    <div className="card-body-visualiser">
                    </div>
                    <div className="card-body-visualiser">
                        <Grid></Grid>
                    </div>
                    <div className="card-body-visualiser grid-item">
                        <House></House>
                    </div>
                </div>
            </div>
        </>
    );
}