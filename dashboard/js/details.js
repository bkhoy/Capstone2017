/**
 * Created by briluu on 5/18/17.
 */


// runs this block of code when the page is ready/loaded
$(function() {

    // grabs the serial Number from URL
    var serialNum = getSerialNum();
    const GET_DEVICE_INFO = "./webservice/getDeviceInfo.php?serialNum=" + serialNum;

    if (serialNum.trim().length == 0) {
        window.location.href = "./displayAllDevices.html";
    }

    // hard coded email for now
    var email = "admin@msr.com";
    const GET_ACCOUNT_INFO = "./webservice/getUser.php?email=" + email;

    $('#logDownloadForm').submit( function(e) {
        e.preventDefault();
        logDownload();
    });

    // If the All Logs box is checked, disable user input for the start and end date selection
    // If unchecked, enable user input for the start and end date selection
    $("#allLogs").change(function() {
        if ($(this).is(":checked")) {
            $("#startDate").attr("disabled", true);
            $("#endDate").attr("disabled", true);
            $("#startDate").addClass("disabled");
            $("#endDate").addClass("disabled");
        } else {
            $("#startDate").prop("disabled", false);
            $("#endDate").prop("disabled", false);
            $("#startDate").removeClass("disabled");
            $("#endDate").removeClass("disabled");
        }
    });

    // Populates the Account modal by calling the server endpoint that returns a JSON object
    // for account information
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

    // Grabs all device-specific information to populate the page
    $.ajax({
        url: GET_DEVICE_INFO,
        dataType: "json",
        method: "GET",
        success: function(device) {
            initDeviceSummary(device);
            initChart(device);            
            initPastCycles(device);
        },
        error: function(error) {
            console.log(error);
            $(".summary").html("Oops! Looks like the data could not be retrieved. Please bring this up to the website admin! Sorry about that. &#9785;");
        }
    }).done(function() {
        $(".loadingDiv").toggle();
    });

    // Initialize the device summary row
    function initDeviceSummary(device) {
        $("#status").html("<img src='img/" + device.statusName.toLowerCase() + ".svg'>");
        $("#serialNum").html(device.serialNum);
        $("#location").html(device.city + ", " + device.country);
        if (device.cycles.length != 0) {
            $("#last-used").html(device.cycles[0].startDateTime);
            $("#cycle-status").html(device.cycles[0].statusDesc);
        } else {
            $("#last-used").html("No cycles for this device.");
            $("#cycle-status").html("No cycles for this device.");
        }
    }

    // Initializes the table with previous cycles
    function initPastCycles(device) {
        for (var i = 0; i < device.cycles.length; i++) {
            var tr = $("<tr></tr>");
            var split = device.cycles[i].statusName.toLowerCase().split(":");
            var statusName = "";
            if (split.length == 1) {
                statusName = "active";
            } else {
                statusName = split[0];
            }
            $(tr).append("<td><img src='img/" + statusName + ".svg'> </td>");
            $(tr).append("<td>" + device.cycles[i].statusName + "</td>");
            $(tr).append("<td>" + device.cycles[i].startDateTime + "</td>");
            $(tr).append("<td>" + device.cycles[i].runtime + "</td>");
            $(tr).append("<td>" + device.cycles[i].statusDesc + "</td>");
            $("#cycles-tbody").append(tr);
        }

        // initialize DataTables jQuery library
        $("#cycles").DataTable({
            "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
            "oLanguage": {
                "sLengthMenu": "Show _MENU_ cycles",
                "sInfo": "Showing _START_ to _END_ of _TOTAL_ cycles"
            }
        });
     }

    // Initializes the chart with the given device JSON object. uses Chart.js library.
    function initChart(device) {
        if (device.cycles.length == 0) {
            $("#graph").html("No cycles for this device.");
            return;
        }

        var ctx = document.getElementById("myChart").getContext("2d");
        ctx.canvas.width = 800;
        ctx.canvas.height = 600;

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
                    }
                }]
            },
            title: {
                display: true,
                text: "Chlorine Produced in last " + numOfCycles + " Cycles",
                fontSize: 16
            }
        };
        var myLineChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options
        });
    }

    // opens a new window to download the log file
    function logDownload() {
        // get form values
        var allLogs = $('#allLogs').is(":checked");
        var startDate = $('#startDate').val();
        var endDate = $('#endDate').val();
        
        // build URL
        var downloadURL = './webservice/getDeviceLog.php?serialNum=' + serialNum;
        downloadURL += '&allLogs=' + allLogs;
        if (!allLogs) {
            downloadURL += '&start=' + startDate;
            downloadURL += '&end=' + endDate;
        }
        
        // check that all variables are valid before downloading
        if (allLogs || (startDate.trim().length > 0 && endDate.trim().length > 0)) {
            window.open(downloadURL, '_blank');
            $('#logDownloadForm input[type=submit]').removeClass("btn-warning").addClass("btn-success");
        } else {
            $('#logDownloadForm input[type=submit]').removeClass("btn-success").addClass("btn-warning");
        }
    };

    // pulls the serialnum from the URL (looks like this : .../deviceDetails.html?serialNum=)
    function getSerialNum() {
        //Only takes the URL text AFTER "?"
        var query = window.location.search.substring(1);

        //Checks if there's multiple parameters
        //If true, then return an emtpy string
        //(At this moment, we don't need multiple parameters)
        if (query.includes("&")) {
            return "";
        }

        var pair = query.split("=");
        if (pair[0].toLowerCase() != "serialnum") {
            return ""; //for error handling, check if serialNum = ""
        }

        //if function is able to get all the way here,
        //return the value of serialNum
        return pair[1];
    };

});