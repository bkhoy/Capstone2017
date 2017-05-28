/**
 * Created by briluu on 4/13/17.
 */

'use strict';

// global variables

// holds json data of all devices
var DEVICES = [];
// global variable for the google map
var map = null;
var currDevice = null;
var myBarChart = null;

// initiatives the list of DEVICES on the left side of the map
// requires that the DEVICES list is populated (meaning a successful call to the server)
function initDeviceList() {
    var parent = $("#scrollable-div");
    for (var i = 0; i < DEVICES.length; i++) {
        var div = $("<div></div>");
        div.addClass("device-block");
        div.prepend("<img src='./img/devices/" + DEVICES[i].photoFileName + "'>");
        // creates a hidden element attached to each div that will allow the map-graph interaction to work.
        // the hidden ul element will be used to uniquely identify each device when it is clicked on
        var ul = $("<ul></ul>");
        div.append(ul);
        ul.append("<span>" + DEVICES[i].serialNum + "</span>");
        ul.hide();
        div.on("click", function() {
            var span = ($(this).find("span"));
            var serialNum = span[0].innerHTML;
            for (var j = 0; j < DEVICES.length; j++) {
                if (DEVICES[j].serialNum == serialNum) {
                    currDevice = DEVICES[j];
                    break;
                }
            }
            updateDescription();
            updateMap();
            removeData();
            updateGraph();
        });
        parent.append(div);
    }
}

function updateDescription() {
    if (currDevice == null) {
        currDevice = DEVICES[0];
    }
    // remove current image
    $("#device-description-div").children("img").remove();
    // update image
    $("#device-description-div").prepend("<img src='./img/devices/" + currDevice.photoFileName + "'>");
    var description = "This device was deployed in " + currDevice.city + ", " + currDevice.country;
    description += " on " + new Date(currDevice.placementDate).toLocaleDateString() + ".";
    $("#description").html(description);
}

function updateMap() {
    var latLng = new google.maps.LatLng(currDevice.latitude, currDevice.longitude);
    map.panTo(latLng);
}

// initMap is called in html when it calls to Google Maps API
function initMap() {
    var api = "http://boneappletea.me/webservice/getUserDevices.php?email=ssmith%40gmail.com";
    $.ajax({
        url: api,
        dataType: "json",
        method: "GET",
        success: function(data) {
            populateMap(data);
            initDeviceList();
            initChart(DEVICES[0]);
            updateDescription();
        },
        error: function(error) {
            console.log(error);
            $("#devices").html("<h3>Oops! Looks like the data could not be retrieved. " +
               "Please bring this up to the website admin! Sorry about that. &#9785;</h3>");

            // For local dev, uncomment the below lines of code and comment out the above line.
            // The data variable is just the copy/pasted response from manually calling the endpoint.
            // var data = [{"serialNum":"15348","city":"Nairobi","country":"Kenya","longitude":"36.8219","latitude":"-1.29207","placementDate":"2017-04-03","photoFileName":"device1.jpg","cycles":[{"startDateTime":"2017-04-16 09:35:00","runtime":"00:10:02","totalChlorineProduced":"0","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-15 09:35:00","runtime":"00:37:31","totalChlorineProduced":"1437.17","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-12 09:35:00","runtime":"03:04:39","totalChlorineProduced":"8887.83","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-11 09:35:00","runtime":"03:08:29","totalChlorineProduced":"9392.83","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-10 15:35:00","runtime":"03:49:12","totalChlorineProduced":"10809.3","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-10 09:35:00","runtime":"04:00:43","totalChlorineProduced":"11802.2","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-09 09:35:00","runtime":"04:15:40","totalChlorineProduced":"11797.7","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-08 09:35:00","runtime":"03:21:43","totalChlorineProduced":"9235.5","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-07 09:35:00","runtime":"00:40:19","totalChlorineProduced":"1465.33","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-06 09:35:00","runtime":"02:42:23","totalChlorineProduced":"7492.83","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."}]},{"serialNum":"15342","city":"Dadaab","country":"Kenya","longitude":"40.3191","latitude":"0.0925798","placementDate":"2017-04-03","photoFileName":"device2.jpg","cycles":[{"startDateTime":"2017-04-16 09:35:00","runtime":"00:10:02","totalChlorineProduced":"0","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-15 09:35:00","runtime":"00:37:31","totalChlorineProduced":"1437.17","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-12 09:35:00","runtime":"03:04:39","totalChlorineProduced":"8887.83","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-11 09:35:00","runtime":"03:08:29","totalChlorineProduced":"9392.83","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-10 15:35:00","runtime":"03:49:12","totalChlorineProduced":"10809.3","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-10 09:35:00","runtime":"04:00:43","totalChlorineProduced":"11802.2","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-09 09:35:00","runtime":"04:15:40","totalChlorineProduced":"11797.7","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-08 09:35:00","runtime":"03:21:43","totalChlorineProduced":"9235.5","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-07 09:35:00","runtime":"00:40:19","totalChlorineProduced":"1465.33","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-06 09:35:00","runtime":"02:42:23","totalChlorineProduced":"7492.83","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."}]},{"serialNum":"15340","city":"Cercadie","country":"Haiti","longitude":"-72.3074","latitude":"18.5944","placementDate":"2017-04-03","photoFileName":"device3.jpg","cycles":[{"startDateTime":"2017-04-16 09:35:00","runtime":"00:10:02","totalChlorineProduced":"0","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-15 09:35:00","runtime":"00:37:31","totalChlorineProduced":"1437.17","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-12 09:35:00","runtime":"03:04:39","totalChlorineProduced":"8887.83","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-11 09:35:00","runtime":"03:08:29","totalChlorineProduced":"9392.83","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-10 15:35:00","runtime":"03:49:12","totalChlorineProduced":"10809.3","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-10 09:35:00","runtime":"04:00:43","totalChlorineProduced":"11802.2","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-09 09:35:00","runtime":"04:15:40","totalChlorineProduced":"11797.7","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-08 09:35:00","runtime":"03:21:43","totalChlorineProduced":"9235.5","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-07 09:35:00","runtime":"00:40:19","totalChlorineProduced":"1465.33","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-06 09:35:00","runtime":"02:42:23","totalChlorineProduced":"7492.83","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."}]}];
            // populateMap(data);
            // initDeviceList();
            // initChart(DEVICES[0]);
            // updateDescription();
        }
    });
}

// initializes and populates the Google Map with the markers. Also stores all device info
// into global variable DEVICES
function populateMap(data) {
    var kenya = {lat: 0.0236, lng: 37.9062};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: kenya,
        scrollwheel: false
    });

    for (var i = 0; i < data.length; i++) {
        var device = data[i];
        DEVICES.push(device);
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

// initializes the chart. uses Chart.js library.
function initChart(device) {
    var ctx = document.getElementById("myChart").getContext("2d");
    ctx.canvas.width = 580;
    ctx.canvas.height = 400;

    var numOfCycles = 10;

    var xAxisLabels = [];
    var chlorine = [];
    for (var i = 0; i < 10; i++) {
        var date = new Date(device.cycles[i].startDateTime);
        xAxisLabels.push(date.toLocaleDateString() + ", " + date.toLocaleTimeString());
        chlorine.push(device.cycles[i].totalChlorineProduced);
    }

    var data = {
        labels: xAxisLabels,
        datasets: [
            {
                label: "L of chlorine produced",
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                data: chlorine
            }
        ]
    };
    var options = {
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Chlorine Produced (L)'
                }
            }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Date and Time of Cycle'
                },
                ticks: {
                    fontSize: 8
                }
            }]
        },
        title: {
            display: true,
            text: "Chlorine Produced in Last " + numOfCycles + " Cycles",
            fontSize: 16
        }
    };
    myBarChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

function updateGraph() {
    var numOfCycles = 10;
    var labels = [];
    var chlorine = [];
    for (var i = 0; i < 10; i++) {
        var date = new Date(currDevice.cycles[i].startDateTime);
        labels.push(date.toLocaleDateString() + ", " + date.toLocaleTimeString());
        chlorine.push(currDevice.cycles[i].totalChlorineProduced);
    }

    myBarChart.data.labels = labels;
    myBarChart.data.datasets = [{
        label: "L of chlorine produced",
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        data: chlorine
    }];

    myBarChart.update();
}

function removeData() {
    // empty the labels (xAxis tick labels AKA cycle datetimes) and also dataset
    myBarChart.data.labels = [];
    myBarChart.data.datasets.length = [];
    myBarChart.update();
}