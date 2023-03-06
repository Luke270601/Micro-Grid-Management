import React, {Component} from 'react';
import './css/custom.css';
import {Routes, Route} from "react-router-dom";
import {NavBar} from "./components/NavBar";
import {Simulate} from "./pages/Simulate";
import {History} from "./pages/History";

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <div className={"app"}>
                <NavBar />
                <div className={"app"}>
                    <Routes>
                        <Route path={"/"} element={<Simulate/>}></Route>
                        <Route path={"/history"} element={<History/>}></Route>
                    </Routes>
                </div>
            </div>
        );
    }
}
