import {TabPanel} from "../components/SideBar";
import React from "react";
import {Visualiser} from "../components/Visualiser";
import {SimulateSettings} from "../components/SettingsMenus";

export function Simulate() {

    return (
        <div id={"simulate"}>
            <TabPanel/>
            <div className={"settings-container"}>
                <Visualiser></Visualiser>
            </div>
        </div>
    )
        ;
}