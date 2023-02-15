import React, {useState} from "react";
import Battery from "./Battery";

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
            <br/>
            <div className="card visualiser-card">
                <h3 className="card-header text-lg-start ">Settings</h3>
                <div className="card-body">
                    <div className="container">
                        <Battery charge={charge}/>
                        <button type={"button"} onClick={handleIncreaseCharge} className={"btn btn-outline-dark"}></button>
                    </div>
                </div>
            </div>
        </>
    );
}