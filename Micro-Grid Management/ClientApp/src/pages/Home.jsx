import $ from 'jquery';


export function Home() {
    function getSimData() {
        $.getJSON( "https://localhost:44314/api/Simulation", function(data) {
           
        })
            .done(function() {
                console.log( data );
            })
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