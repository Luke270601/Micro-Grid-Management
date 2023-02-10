import {Link} from "react-router-dom";

export function NavBar(){
return(
    <nav className="navbar navbar-dark navbar-expand bg-dark">
        <Link to={"/"} className="navbar-brand px-3">Micro-Grid Manager</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
                <li className="nav-item active">
                    <Link to={"/"}  className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                    <Link to={"/about"}  className="nav-link">About </Link>
                </li>
            </ul>
        </div>
    </nav>
);
}