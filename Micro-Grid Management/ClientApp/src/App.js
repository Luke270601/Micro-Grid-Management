import React, {Component} from 'react';
import './custom.css';
import {Routes, Route} from "react-router-dom";
import {Home} from "./pages/Home"
import {About} from "./pages/About"
import {NavBar} from "./components/NavBar";

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <>
                <NavBar />
                <div className={"container"}>
                    <Routes>
                        <Route path={"/"} element={<Home/>}></Route>
                        <Route path={"/about"} element={<About/>}></Route>
                    </Routes>
                </div>
            </>
        );
    }
}
