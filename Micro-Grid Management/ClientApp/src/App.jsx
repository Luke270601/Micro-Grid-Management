import React, {Component} from 'react';
import './css/custom.css';
import {Routes, Route} from "react-router-dom";
import {Home} from "./pages/Home"
import {About} from "./pages/About"
import {NavBar} from "./components/NavBar";
import {Simulate} from "./pages/Simulate";
import {History} from "./pages/History";

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <>
                <NavBar />
                <div>
                    <Routes>
                        <Route path={"/"} element={<Home/>}></Route>
                        <Route path={"/about"} element={<About/>}></Route>
                        <Route path={"/simulate"} element={<Simulate/>}></Route>
                        <Route path={"/history"} element={<History/>}></Route>
                    </Routes>
                </div>
            </>
        );
    }
}
