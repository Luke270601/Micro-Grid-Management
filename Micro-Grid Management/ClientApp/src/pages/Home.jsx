import $ from 'jquery';


export function Home() {
    function getSimData() {
        let req = new XMLHttpRequest();
        req.open("GET", "/Simulation")
        req.send()
        
        req.response = function (response){
            console.log(response)
        }
    }

    return (
        <>
            <h1>hgi</h1>
            <h1>hgi</h1>
            <h1>hgi</h1>
            <h1>hgi</h1>
            <h1>hgi</h1>
            <button type="button" className="btn btn-primary" onClick={getSimData}>Button</button>

        </>

    );
}