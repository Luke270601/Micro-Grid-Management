import React from "react";
import {Link} from "react-router-dom";

export function TabPanel() {
    return (
        <div className="side-bar">
            <a className="navbar-brand" href="#">
                <img src="L" width="30" height="30"
                     className="d-inline-block align-top" alt=""/>
                Dashboard
            </a>
            <ul className="navbar-nav" id="navbarNavAltMarkup">
                <li className="nav-item active">
                    <Link to={"/simulate"}  className="nav-link btn">Simulate</Link>
                </li>
                <li className="nav-item">
                    <Link to={"/history"} className="nav-link btn">History</Link>
                </li>
            </ul>
        </div>
    );
}