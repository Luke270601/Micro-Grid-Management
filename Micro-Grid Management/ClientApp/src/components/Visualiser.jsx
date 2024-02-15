import React, {useState} from "react";
import {Clock, updateClock} from "./Clock";
import $ from "jquery";
import LineGraph from "./Graph";


export function Visualiser() {

    let fromGrid = 0;
    let stored = 0;
    let interval = 0;
    let days = 0;

    const [windData, setWindData] = useState([
        {time: '00:00', value: 0}
    ]);

    const [solarData, setSolarData] = useState([
        {time: '00:00', value: 0}
    ]);

    const [homeData, setHomeData] = useState([
        {time: '00:00', value: 0}
    ]);

    const [batteryData, setBatteryData] = useState([
        {time: '00:00', value: 0}
    ]);

    const [gridData, setGridData] = useState([
        {time: '00:00', value: 0}
    ]);


    function getSimData() {
        try {
            document.getElementById("toggle-btn").disabled = true;
            document.getElementById("turbines").disabled = true;
            document.getElementById("duration").disabled = true;
            document.getElementById("panels").disabled = true;
            document.getElementById("houses").disabled = true;
            document.getElementById("month").disabled = true;
            let duration = document.getElementById("duration").value
            let turbineCount = document.getElementById("turbines").value
            let panelCount = document.getElementById("panels").value
            let houseCount = document.getElementById("houses").value
            let monthOfYear = document.getElementById("month").value.substring(0, 3)
            interval = parseFloat(document.getElementById("seconds").innerText)

            if (turbineCount != null && panelCount != null && houseCount > 0 && interval > 0) {
                $.getJSON("https://localhost:44314/api/Simulation?duration=" + duration + "&turbineCount=" + turbineCount + "&panelCount=" + panelCount + "&houseCount=" + houseCount + "&monthOfTheYear=" + monthOfYear, function () {

                })
                    .done(function (data) {
                        alert("Beginning Simulation")
                        runSim(data, turbineCount, panelCount, houseCount, false)
                    })
                    .fail(function () {
                        alert("Web api not currently active, please try again later.")
                        document.getElementById("toggle-btn").disabled = false;
                        document.getElementById("turbines").disabled = false;
                        document.getElementById("duration").disabled = false;
                        document.getElementById("panels").disabled = false;
                        document.getElementById("houses").disabled = false;
                        document.getElementById("month").disabled = false;
                    });
            } else {
                alert("All fields must be filled (house count exceed 0)")
                document.getElementById("toggle-btn").disabled = false;
                document.getElementById("turbines").disabled = false;
                document.getElementById("duration").disabled = false;
                document.getElementById("panels").disabled = false;
                document.getElementById("houses").disabled = false;
                document.getElementById("month").disabled = false;
            }

        } catch (error) {
            let turbineCount = parseInt(document.getElementById("turbines").innerText)
            let panelCount = parseInt(document.getElementById("panels").innerText)
            let houseCount = parseInt(document.getElementById("houses").innerText)
            let id = document.getElementById("simData").value
            interval = parseFloat(document.getElementById("seconds").innerText)

            if (turbineCount != null && panelCount != null && houseCount > 0 && interval > 0) {
                $.getJSON("https://localhost:44314/api/GetSimData/GetData/" + id, function () {

                })
                    .done(function (data) {
                        alert("Data received starting simulation")
                        runSim(data, turbineCount, panelCount, houseCount, true)
                    })
                    .fail(function () {
                        alert("Web api not active please try again later")
                    });
            } else {
                alert("Interval must exceed 0")
                document.getElementById("toggle-btn").disabled = false;
            }

        }

    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async function runSim(json, turbineCount, panelCount, houseCount, previousSim) {
        setWindData([{time: '00:00', value: 0}]);
        setSolarData([{time: '00:00', value: 0}]);
        setBatteryData([{time: '00:00', value: 0}]);
        setHomeData([{time: '00:00', value: 0}]);
        setGridData([{time: '00:00', value: 0}]);
        let hours = 0;
        let duration = 0;
        if (previousSim) {
            duration = document.getElementById("duration").innerText
        } else {
            duration = document.getElementById("duration").value
        }
        days = duration
        document.getElementById("days-remaining").innerText = "Days Remaining: " + duration


        let count = 0
        let totalAgents = parseInt(turbineCount) + parseInt(panelCount) + parseInt(houseCount)
        let houseList = [];
        let turbineList = [];
        let panelList = [];
        let data = eval(json)

        for (let i = 0; i < data.length; i++) {

            if (document.getElementById("houses").disabled || previousSim) {

                if (data[i].Sender.includes("houseAgent") || data[i].Sender.includes("solarPanel") || data[i].Sender.includes("turbine")) {
                    if (data[i].Sender.includes("houseAgent")) {
                        houseList.push(data[i])
                    }

                    if (data[i].Sender.includes("solarPanel")) {
                        panelList.push(data[i])
                    }

                    if (data[i].Sender.includes("turbine")) {
                        turbineList.push(data[i])
                    }
                    count++;
                }

                if (count === totalAgents) {
                    interval = parseFloat(document.getElementById("seconds").innerText)
                    count = 0
                    let houseDemand = 0;
                    let turbineSupply = 0;
                    let solarSupply = 0;
                    interval = parseFloat(document.getElementById("seconds").innerText)
                    let currentTime = document.getElementById('clock').innerText;
                    await sleep(interval * 1000);

                    for (let h = 0; h < houseList.length; h++) {
                        houseDemand += parseFloat(houseList[h].Message)
                        if (h === houseList.length - 1) {
                            setHomeData(prevData => [...prevData, {time: currentTime, value: houseDemand}]);
                        }
                    }

                    for (let t = 0; t < turbineList.length; t++) {
                        turbineSupply += parseFloat(turbineList[t].Message)
                        if (t === turbineList.length - 1) {
                            // Correct way to update state immutably
                            setWindData(prevData => [...prevData, {time: currentTime, value: turbineSupply}]);
                        }
                    }

                    for (let p = 0; p < panelList.length; p++) {
                        solarSupply += parseFloat(panelList[p].Message)
                        if (p === panelList.length - 1) {
                            setSolarData(prevData => [...prevData, {time: currentTime, value: solarSupply}]);
                        }
                    }

                    interval = parseFloat(document.getElementById("seconds").innerText)
                    if (data[i + 1].Message.split(" ")[0] === "Removed:") {
                        stored -= Math.round((parseFloat((data[i + 1].Message.split(" ")[1])) + Number.EPSILON) * 100) / 100
                        setBatteryData(prevData => [...prevData, {time: currentTime, value: stored}]);
                    }

                    if (data[i + 1].Message.split(" ")[0] === "Stored:") {
                        stored = Math.round((parseFloat((data[i + 1].Message.split(" ")[1])) + Number.EPSILON) * 100) / 100
                        setBatteryData(prevData => [...prevData, {time: currentTime, value: stored}]);
                    }

                    if (data[i + 1].Message.split(" ")[0] === "Remaining:") {
                        fromGrid += (Math.round((parseFloat((data[i + 1].Message.split(" ")[1])) + Number.EPSILON) * 100) / 100)
                        setWindData(prevData => [...prevData, {time: currentTime, value: turbineSupply}]);
                        stored = 0;
                        setBatteryData(prevData => [...prevData, {time: currentTime, value: stored}]);
                        setGridData(prevData => [...prevData, {time: currentTime, value: fromGrid}]);
                    }

                    houseList = [];
                    turbineList = [];
                    panelList = [];
                    hours++

                    if (hours > 23) {
                        updateClock(hours)
                        days--;
                        document.getElementById("days-remaining").innerText = "Days Remaining: " + days
                        hours = 0;
                    } else {
                        updateClock(hours)
                    }
                }
            } else {
                document.getElementById("clock").innerText = "00:00"
                break;
            }
        }

        if (document.getElementById("houses").disabled) {
            document.getElementById("toggle-btn").disabled = false;
            document.getElementById("turbines").disabled = false;
            document.getElementById("duration").disabled = false;
            document.getElementById("panels").disabled = false;
            document.getElementById("houses").disabled = false;
            document.getElementById("month").disabled = false;
        }

        if (previousSim) {
            document.getElementById("toggle-btn").disabled = false;
            document.getElementById("turbines").disabled = false;
            document.getElementById("panels").disabled = false;
            document.getElementById("houses").disabled = false;
        }
    }


    return (
        <>
            <div className={"simulation-panel"}>
                <LineGraph data={batteryData} width={400} height={400}/>
                <br/>
                <LineGraph data={windData} width={400} height={400}/>
                <br/>
                <LineGraph data={solarData} width={400} height={400}/>
                <br/>
                <LineGraph data={gridData} width={400} height={400}/>
                <br/>
                <LineGraph data={homeData} width={400} height={400}/>
            </div>
        </>
    );
}