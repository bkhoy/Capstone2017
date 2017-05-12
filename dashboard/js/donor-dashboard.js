/**
 * Created by briluu on 4/13/17.
 */

'use strict';

var devices = [];
var map = null;

//Same thing as document.ready
$(function() {

    initChart();

    initDevices();

});

var devices = [];
var serialToLatLng = {};

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
            var latLng = new google.maps.LatLng(coordinates[0], coordinates[1]); //Makes a latlng
            map.panTo(latLng); //Make map global
        });
        parent.append(div);
    }
}

// initMap is called in html when it calls to Google Maps API
function initMap() {

    var api = "http://boneappletea.me/webservice/getDeviceLocations.php";
    //
    // $.ajax({
    //     url: "http://boneappletea.me/webservice/getDeviceLocations.php",
    //     dataType: "json",
    //     method: "GET",
    //     crossDomain: true,
    //     success: function(data) {
    //         console.log(data);
    //         console.log("hello");
    //         populateMap(data);
    //     },
    //     error: function(error) {
    //         console.log(error);
    //     }
    // })



    populateMap();
}

function populateMap() {
    var kenya = {lat: 0.0236, lng: 37.9062};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: kenya,
        scrollwheel: false
    });

    var data = [{"serialNum":"15340","city":"Cercadie","country":"Haiti","latitude":"18.5944","longitude":"-72.3074","deploymentDate":"2017-04-03"},{"serialNum":"15342","city":"Dadaab","country":"Kenya","latitude":"0.0925798","longitude":"40.3191","deploymentDate":"2017-04-03"},{"serialNum":"15344","city":"Wote","country":"Kenya","latitude":"-1.78863","longitude":"37.6333","deploymentDate":"2017-04-03"},{"serialNum":"15345","city":"Mombasa","country":"Kenya","latitude":"-4.04348","longitude":"39.6682","deploymentDate":"2017-04-03"},{"serialNum":"15347","city":"Port-au-Prince","country":"Haiti","latitude":"19.304","longitude":"-72.0379","deploymentDate":"2017-04-03"},{"serialNum":"15348","city":"Nairobi","country":"Kenya","latitude":"-1.29207","longitude":"36.8219","deploymentDate":"2017-04-03"}];
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

function centerControl(controlDiv, map, center) {
    var control = this;

    // Set the center property upon construction
    control.center_ = center;
    controlDiv.style.clear = 'both';

}


function initChart() {
    var ctx = document.getElementById("myChart").getContext("2d");
    ctx.canvas.width = 800;
    ctx.canvas.height = 600;
    var data = {
        //labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "Chlorine Production Rate",
                fill: true,
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
                data: [65, 59, 80, 81, 74, 77, 85], // data points go here
                spanGaps: false, // If true, lines will be drawn between points with no or null data
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
        maintainAspectRatio: false
    };
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}