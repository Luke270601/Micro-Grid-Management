import {Sidebar} from "../components/SideBar";
import React from "react";
import {Visualiser} from "../components/Visualiser";
import {SimulateSettings} from "../components/SettingsMenus";

export function Simulate() {

    return (
        <div id={"simulate"}>
            <Sidebar/>
            <div className={"settings-container"}>
                <Visualiser></Visualiser>
                <SimulateSettings/>
            </div>
        </div>
    )
        ;
}