/**
 * Created by briluu on 4/13/17.
 */

'use strict';

// global variables

// holds json data of all devices
var DEVICES = [];
// global variable for the google map
var map = null;
// global variable for the current device
var currDevice = null;
var myBarChart = null;

// When page is ready, run this block of code
$(function(){
    // hard coded email for now
    var email = "ssmith@gmail.com";
    const GET_ACCOUNT_INFO = "./webservice/getUser.php?email=" + email;

    // populate the Account modal
    $.ajax({
        url: GET_ACCOUNT_INFO,
        dataType: "json",
        method: "GET",
        success: function(account) {
            var p = $("<p></p>");
            var text = "Name: " + account.fname + " " + account.lname + "<br>" + "Email: " + account.email;
            p.html(text);
            $(".modal-body").html(p);
        },
        error: function(error) {
            $(".modal-body").html("<p>Sorry, your account information could not be retrieved right now.</p>");
        }
    });

});

// Initializes the list of DEVICES for the donor (the scrollable div black div)
// Requires that the DEVICES list is populated (meaning a successful call to the server)
function initDeviceList() {
    var parent = $("#scrollable-div");
    for (var i = 0; i < DEVICES.length; i++) {
        var div = $("<div></div>");
        div.addClass("device-block");
        // Highlight the first item for user
        if (i == 0) {
            div.addClass("selected");
        } else {
            div.addClass("unactive");
        }
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
            // Update the highlighted item for the user
            $(".device-block").removeClass("selected");
            $(".device-block").addClass("unactive");
            $(this).addClass("selected");
            $(this).removeClass("unactive");
            updateDescription();
            updateMap();
            removeData();
            updateGraph();
        });
        parent.append(div);
    }
}


// Updates the device's description (left of the map)
function updateDescription() {
    if (currDevice == null) {
        currDevice = DEVICES[0];
    }
    // remove current image
    $("#device-description-div").children("img").remove();
    
    // update image
    $("#device-description-div").prepend("<img src='./img/devices/" + currDevice.photoFileName + "'>");
    
    //update description
    var description = "<strong>Serial Number:</strong> " + currDevice.serialNum + "<br/>";
    description += "<strong>Location:</strong> " + currDevice.city + ", " + currDevice.country + "<br/>";
    description += "<strong>Deployed On:</strong> " + new Date(currDevice.placementDate).toLocaleDateString() + "<br/>";
    description += "<br/>This device is being used in a clinic for infection prevention and control (IPC).";
    $("#description").html(description);
}

// Pans the map's camera to the current device's latitude and longtitude coordinates
function updateMap() {
    var latLng = new google.maps.LatLng(currDevice.latitude, currDevice.longitude);
    map.panTo(latLng);
}

// initMap is called in HTML when browser renders the Google Maps
function initMap() {
    var api = "./webservice/getUserDevices.php?email=ssmith%40gmail.com";
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
        }
    }).done(function() {
        $("#map-graph").css("visibility", "visible");
        $(".loadingDiv").toggle();
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

// Initializes the chart with the first device in DEVICES. uses Chart.js library.
function initChart(device) {
    var ctx = document.getElementById("myChart").getContext("2d");
    ctx.canvas.width = 520;
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

// Adds data for the chart and updates the graph
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

// Removes the data on the chart
function removeData() {
    // empty the labels (xAxis tick labels AKA cycle datetimes) and also dataset
    myBarChart.data.labels = [];
    myBarChart.data.datasets.length = [];
    myBarChart.update();
}

