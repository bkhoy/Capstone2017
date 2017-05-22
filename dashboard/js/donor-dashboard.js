/**
 * Created by briluu on 4/13/17.
 */

'use strict';

// global variables

// holds json data of all devices
var devices = [];
// global variable for the google map
var map = null;
// dictionary for serial numbers and latitude/longitude coordinates
// example item: 15348: [18.5944, -72.3074]
var serialToLatLng = {};

// runs this block of code when the page is ready/loaded
$(function() {

    initChart();

    // initializes the chart. uses Chart.js library.
    function initChart() {
        var ctx = document.getElementById("myChart").getContext("2d");
        ctx.canvas.width = 800;
        ctx.canvas.height = 600;

        const colors = {
            green: {
                fill: '#e0eadf',
                stroke: '#5eb84d',
            },
            lightBlue: {
                stroke: '#6fccdd',
            },
            darkBlue: {
                fill: '#92bed2',
                stroke: '#3282bf',
            },
            purple: {
                fill: '#8fa8c8',
                stroke: '#75539e',
            },
        };

        var response = {"15348":[],"15340":[{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"2089.33","1":"2089.33"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"2089.33","1":"2089.33"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"2089.33","1":"2089.33"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"2089.33","1":"2089.33"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"2089.33","1":"2089.33"}],"15342":[{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"36.8333","1":"36.8333"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"36.8333","1":"36.8333"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"36.8333","1":"36.8333"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"0","1":"0"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"0","1":"0"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"0","1":"0"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"0","1":"0"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"0","1":"0"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"0","1":"0"},{"startDateTime":"2017-04-14 09:35:00","0":"2017-04-14 09:35:00","totalChlorineProduced":"0","1":"0"}]};
        console.log(response);

        var data = {
            datasets: [{
                label: "Total Chlorine Production Rate",
                fill: false,
                lineTension: 0.0,
                backgroundColor: "rgba(75,192,192,0.4)", // The fill color under the line
                borderColor: "rgba(75,192,192,1)", // 	The color of the line
                borderCapStyle: 'round',
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                spanGaps: false, // If true, lines will be drawn between points with no or null data
                data: [65, 59, 80, 81, 74, 77, 85],  // data points go here
            }, {
                label: "One device's chlorine rate",
                fill: false,
                lineTension: 0.0,
                backgroundColor: colors.green.fill, // The fill color under the line
                borderColor: colors.green.stroke, // 	The color of the line
                borderCapStyle: 'round',
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBackgroundColor: colors.green.stroke,
                pointBorderWidth: 1,
                pointHighlightStroke: colors.green.stroke,
                pointHoverRadius: 5,
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                spanGaps: false, // If true, lines will be drawn between points with no or null data
                data: [20, 39, 40, 11, 24, 20, 42]  // data points go here
            }
            ],
            xLabels: ['Apr 8', 'Apr 9', 'Apr 10', 'Apr 11', 'Apr 12', 'Apr 13', 'Apr 14'],
            yLabels: ['testing']
        };
        var options = {
            title: {
                display: true,
                text: "Your devices at work",
                fontSize: 40,
                padding: 60,
                fontFamily: "'Source Sans Pro', 'sans-serif'",
                fontStyle: 'normal'
            },
            maintainAspectRatio: true
            // if you want stacked line charts, uncomment
            // scales: {
            //     yAxes: [{
            //         stacked: true
            //     }]
            // }
        };
        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: options
        });
    }

});

// initiatives the list of devices on the left side of the map
// requires that the devices list is populated (meaning a successful call to the server)
function initDevices() {
    var parent = $("#scrollable-div");
    for (var i = 0; i < devices.length; i++) {
        var div = $("<div></div>");
        div.addClass("device-block");
        div.prepend("<img src='./img/seflow_setup.png'>");
        var ul = $("<ul></ul>");
        div.append(ul);
        ul.append("<li>" + "Serial Number: " + "<span>" + devices[i].serialNum + "</span>" + "</li>")
        ul.append("<li>" + "Location: " + devices[i].city + ", " + devices[i].country + "</li>")
        div.append("<p>This device has produced over 150mL of chlorine and has been running for 29 days.</p>");
        div.on("click", function() {
            var span = ($(this).find("span"));
            var serialNum = span[0].innerHTML;
            var coordinates = serialToLatLng[serialNum];
            var latLng = new google.maps.LatLng(coordinates[0], coordinates[1]); // Makes a latlng
            map.panTo(latLng);
        });
        parent.append(div);
    }
}

// initMap is called in html when it calls to Google Maps API
function initMap() {
    var api = "http://boneappletea.me/webservice/getUserDevices.php?email=ssmith%40gmail.com";
    $.ajax({
        url: api,
        dataType: "json",
        method: "GET",
        success: function(data) {
            console.log(data);
            populateMap(data);
            initDevices();
        },
        error: function(error) {
            console.log(error);

        }
    });
    // To run this code locally (with hard coded data below):
    // 1. comment the above ajax call
    // 2. uncomment the below functions
    // 3. uncomment the data variable (fake data) in populateMap
    // populateMap(null);
    // initDevices();
}

// initializes and populates the Google Map with the markers
function populateMap(data) {
    var kenya = {lat: 0.0236, lng: 37.9062};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: kenya,
        scrollwheel: false
    });

    // uncomment if you want to use manual data
    // var data = [{"serialNum":"15348","city":"Nairobi","country":"Kenya","longitude":"36.8219","latitude":"-1.29207","placementDate":"2017-04-03","photoFileName":"defaultImage.png","cycles":[{"startDateTime":"2017-04-16 09:35:00","runtime":"00:10:02","totalChlorineProduced":"0","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-15 09:35:00","runtime":"00:37:31","totalChlorineProduced":"1437.17","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-12 09:35:00","runtime":"03:04:39","totalChlorineProduced":"8887.83","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-11 09:35:00","runtime":"03:08:29","totalChlorineProduced":"9392.83","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-10 15:35:00","runtime":"03:49:12","totalChlorineProduced":"10809.3","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-10 09:35:00","runtime":"04:00:43","totalChlorineProduced":"11802.2","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-09 09:35:00","runtime":"04:15:40","totalChlorineProduced":"11797.7","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-08 09:35:00","runtime":"03:21:43","totalChlorineProduced":"9235.5","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-07 09:35:00","runtime":"00:40:19","totalChlorineProduced":"1465.33","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-06 09:35:00","runtime":"02:42:23","totalChlorineProduced":"7492.83","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."}]},{"serialNum":"15342","city":"Dadaab","country":"Kenya","longitude":"40.3191","latitude":"0.0925798","placementDate":"2017-04-03","photoFileName":"defaultImage.png","cycles":[{"startDateTime":"2017-04-16 09:35:00","runtime":"00:10:02","totalChlorineProduced":"0","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-15 09:35:00","runtime":"00:37:31","totalChlorineProduced":"1437.17","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-12 09:35:00","runtime":"03:04:39","totalChlorineProduced":"8887.83","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-11 09:35:00","runtime":"03:08:29","totalChlorineProduced":"9392.83","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-10 15:35:00","runtime":"03:49:12","totalChlorineProduced":"10809.3","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-10 09:35:00","runtime":"04:00:43","totalChlorineProduced":"11802.2","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-09 09:35:00","runtime":"04:15:40","totalChlorineProduced":"11797.7","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-08 09:35:00","runtime":"03:21:43","totalChlorineProduced":"9235.5","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-07 09:35:00","runtime":"00:40:19","totalChlorineProduced":"1465.33","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-06 09:35:00","runtime":"02:42:23","totalChlorineProduced":"7492.83","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."}]},{"serialNum":"15340","city":"Cercadie","country":"Haiti","longitude":"-72.3074","latitude":"18.5944","placementDate":"2017-04-03","photoFileName":"defaultImage.png","cycles":[{"startDateTime":"2017-04-16 09:35:00","runtime":"00:10:02","totalChlorineProduced":"0","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-15 09:35:00","runtime":"00:37:31","totalChlorineProduced":"1437.17","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-12 09:35:00","runtime":"03:04:39","totalChlorineProduced":"8887.83","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-11 09:35:00","runtime":"03:08:29","totalChlorineProduced":"9392.83","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-10 15:35:00","runtime":"03:49:12","totalChlorineProduced":"10809.3","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-10 09:35:00","runtime":"04:00:43","totalChlorineProduced":"11802.2","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-09 09:35:00","runtime":"04:15:40","totalChlorineProduced":"11797.7","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-08 09:35:00","runtime":"03:21:43","totalChlorineProduced":"9235.5","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-07 09:35:00","runtime":"00:40:19","totalChlorineProduced":"1465.33","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-06 09:35:00","runtime":"02:42:23","totalChlorineProduced":"7492.83","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."}]}];

    console.log(data);

    for (var i = 0; i < data.length; i++) {
        var device = data[i];
        devices.push(device);
        serialToLatLng[device.serialNum] = [device.latitude, device.longitude];
        var marker = new google.maps.Marker({
            position: {
                lat: parseFloat(device.latitude),
                lng: parseFloat(device.longitude)
            },
            title: device.serialNum
        });
        // add the marker to the map
        marker.setMap(map);
    }
}