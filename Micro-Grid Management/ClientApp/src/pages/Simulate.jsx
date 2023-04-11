import {TabPanel} from "../components/SideBar";
import $ from "jquery";
import React from "react";
import {Visualiser} from "../components/Visualiser";

export function Simulate() {

    let interval = 0;

    function updateSlider() {
        interval = document.getElementById("slider").value / 10
        document.getElementById("seconds").innerText = interval
    }
    
    function get(){

        let selectElement = document.getElementById("month");
        let selectedOption = selectElement.selectedIndex
        let selectedOptionText = selectElement.options[selectElement.selectedIndex].text;
        let days = daysInMonth(selectedOptionText)
        let url = ""

        if (selectedOption+1 < 10){
             url = "https://meteostat.p.rapidapi.com/stations/hourly?station=03091&start=2022-0"+(selectedOption+1)+"-01&end=2022-0"+(selectedOption+1)+"-"+days
        }
        
        else {
             url = "https://meteostat.p.rapidapi.com/stations/hourly?station=03091&start=2022-"+(selectedOption+1)+"-01&end=2022-"+(selectedOption+1)+"-"+days
        }

        const settings = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "GET",
            "headers": {
                "X-RapidAPI-Key": "2254a8b1d4msh6bb70821d6e0711p1d5a36jsnf6e6551b6e21",
                "X-RapidAPI-Host": "meteostat.p.rapidapi.com"
            }
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
            createMonthlyAverage(response)
        });
    }
    
    function createMonthlyAverage (json){
        let array = [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00]
        let hour = 0;
        let response = eval(json.data)
        let selectElement = document.getElementById("month");
        let selectedOptionText = selectElement.options[selectElement.selectedIndex].text;
        let days = daysInMonth(selectedOptionText)
        
        for (let i = 0; i < response.length; i++){
            
            array[hour] = parseFloat( array[hour]) + parseFloat(response[i].wspd)
            hour++
            
            if(hour > 23){
                hour = 0 
            }
        }
        
        for (let j = 0; j < array.length; j++){
            array[j] = (array[j] / days) / 3.6
        }
        
        console.log(array)

        // Export to CSV
        const csv = array.join("\n");
        const csvFile = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const downloadLink = document.createElement("a");
        downloadLink.download = "monthly_average.csv";
        downloadLink.href = URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    function daysInMonth(month) {
        const monthsWith31Days = ['January', 'March', 'May', 'July', 'August', 'October', 'December'];
        const monthsWith30Days = ['April', 'June', 'September', 'November'];
        const february = 'February';

        if (monthsWith31Days.includes(month)) {
            return 31;
        } else if (monthsWith30Days.includes(month)) {
            return 30;
        } else if (month === february) {
                return 28;
        } else {
            throw new Error('Invalid month');
        }
    }

    


    return (
        <div id={"simulate"}>
            <TabPanel/>
            <div className={"settings-container"}>
                <div className="settings-card card">
                    <h3 className="settings-card-header text-lg-start">Settings</h3>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="turbines">Number of Turbines</label>
                                <input type="number" className="form-control" id="turbines"
                                       placeholder="Enter the number of turbines"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="panels">Number of Panels</label>
                                <input type="number" className="form-control" id="panels"
                                       placeholder="Enter the number of panels"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="houses">Number of Houses</label>
                                <input type="number" className="form-control" id="houses"
                                       placeholder="Enter the number of houses"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="duration">Duration</label>
                                <input type="number" className="form-control" id="duration"
                                       placeholder="Enter the duration"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="month">Month of the Year</label>
                                <select className="form-control" id="month">
                                    <option>January</option>
                                    <option>February</option>
                                    <option>March</option>
                                    <option>April</option>
                                    <option>May</option>
                                    <option>June</option>
                                    <option>July</option>
                                    <option>August</option>
                                    <option>September</option>
                                    <option>October</option>
                                    <option>November</option>
                                    <option>December</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="duration">Interval of action (seconds)</label><br/>
                                <input id={"slider"} type="range" min="1" max="50" onChange={updateSlider}
                                       onLoad={updateSlider}/>
                                <text className={"form-control"} id={"seconds"}>0</text>
                            </div>
                        </form>
                    </div>
                </div>
                <Visualiser></Visualiser>
            </div>
        </div>
    )
        ;
}