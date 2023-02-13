import {Link} from "react-router-dom";

export function NavBar(){
return(
    <nav id={"navbar"} className="navbar nav-pills navbar-expand navbar-dark">
        <Link to={"/"} className="navbar-brand px-3">Micro-Grid Manager</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
    </nav>
);
}
