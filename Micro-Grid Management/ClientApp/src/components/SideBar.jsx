import React from "react";
import {Link} from "react-router-dom";

export function Sidebar() {

    return (
        <div className="side-bar">
            <ul className="navbar-nav" id="navbarNavAltMarkup">
                <br/>
                <li className="nav-item active">
                    <Link to={"/"}  className="nav-link btn">Simulate</Link>
                </li>
                <br/>
                <li className="nav-item active">
                    <Link to={"/history"} className="nav-link btn">History</Link>
                </li>
            </ul>
        </div>
    );
}