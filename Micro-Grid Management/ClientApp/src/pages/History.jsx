import {Sidebar} from "../components/SideBar";
import {Visualiser} from "../components/Visualiser";
import React from "react";
import {HistorySettings} from "../components/SettingsMenus";

export function History() {
    return (
        <div id={"simulate"}>
            <Sidebar/>
            <div className={"settings-container"}>
            <Visualiser></Visualiser>
                <HistorySettings></HistorySettings>
            </div>
        </div>
    );
}