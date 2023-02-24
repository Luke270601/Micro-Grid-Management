export function Clock() {

    let hours = 0

    function updateClock() {
        hours++;
        
        if (hours > 23) {
            hours = 0
        }

        var clockDiv = document.getElementById('clock');

        if (hours <= 9) {
            clockDiv.innerText = "0" + hours + ":" + "00";
        }
        
        if (hours > 9) {
            clockDiv.innerText = hours + ":" + "00";
        }

    }

    setInterval(updateClock, 1000);

    return (
        <body>
        <div id="clock"></div>
        </body>
    );
}