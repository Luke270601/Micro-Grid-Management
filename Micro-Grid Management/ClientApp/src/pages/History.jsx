import {TabPanel} from "../components/SideBar";
import {Visualiser} from "../components/Visualiser";
import React from "react";
import {HistorySettings} from "../components/SettingsMenus";

export function History() {
    return (
        <div id={"simulate"}>
            <TabPanel/>
            <div className={"settings-container"}>
            <Visualiser></Visualiser>
            </div>
        </div>
    );
}