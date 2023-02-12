import React from "react";
import {Tabs, Tab, AppBar} from '@mui/material'
export function TabPanel(){
return(    
    <div id={"SideBar"}>
        <AppBar>
            <Tabs>
                <Tab label={"Simulate"}/>
                <Tab label={"History"}>SDAdsa</Tab>
            </Tabs>
        </AppBar>
    </div>
);
}