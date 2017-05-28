/**
 * Created by briluu on 5/18/17.
 */


// runs this block of code when the page is ready/loaded
$(function() {

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

    // grabs all device info to populate the page
    $.ajax({
        url: GET_DEVICE_INFO,
        dataType: "json",
        method: "GET",
        success: function(device) {
            initChart(device);
            initDeviceSummary(device);
            initPastCycles(device);
        },
        error: function(error) {
            console.log(error);
            $(".summary").html("Oops! Looks like the data could not be retrieved. Please bring this up to the website admin! Sorry about that. &#9785;");
            // for local dev, uncomment the below lines of code and comment out the above line
            // var device = {"serialNum":"15340","statusName":"Active","useModeName":"IPC","city":"Cercadie","country":"Haiti","mostRecentCycle":"2017-04-17 09:35:00","cycles":[{"startDateTime":"2017-04-16 09:35:00","runtime":"00:10:02","totalChlorineProduced":"0","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-15 09:35:00","runtime":"00:37:31","totalChlorineProduced":"1437.17","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-12 09:35:00","runtime":"03:04:39","totalChlorineProduced":"8887.83","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-11 09:35:00","runtime":"03:08:29","totalChlorineProduced":"9392.83","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-10 15:35:00","runtime":"03:49:12","totalChlorineProduced":"10809.3","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-10 09:35:00","runtime":"04:00:43","totalChlorineProduced":"11802.2","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-09 09:35:00","runtime":"04:15:40","totalChlorineProduced":"11797.7","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-08 09:35:00","runtime":"03:21:43","totalChlorineProduced":"9235.5","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-07 09:35:00","runtime":"00:40:19","totalChlorineProduced":"1465.33","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-06 09:35:00","runtime":"02:42:23","totalChlorineProduced":"7492.83","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-05 09:35:00","runtime":"00:11:31","totalChlorineProduced":"140.5","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-04 09:35:00","runtime":"04:59:00","totalChlorineProduced":"14231.7","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-03 09:35:00","runtime":"01:37:19","totalChlorineProduced":"4461.5","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-04-02 09:35:00","runtime":"06:09:39","totalChlorineProduced":"18833.7","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-03-31 09:35:00","runtime":"00:37:43","totalChlorineProduced":"1414.67","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-03-30 09:35:00","runtime":"06:01:33","totalChlorineProduced":"17765","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-03-29 09:35:00","runtime":"00:10:15","totalChlorineProduced":"47","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-03-28 09:35:00","runtime":"01:29:50","totalChlorineProduced":"4190.17","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-03-27 09:35:00","runtime":"03:23:51","totalChlorineProduced":"9949.33","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-03-26 09:35:00","runtime":"01:39:08","totalChlorineProduced":"4735.17","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-03-25 09:35:00","runtime":"01:18:08","totalChlorineProduced":"3744.5","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-03-24 09:35:00","runtime":"00:07:15","totalChlorineProduced":"0","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-03-22 09:35:00","runtime":"01:10:43","totalChlorineProduced":"3280.17","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-03-22 09:35:00","runtime":"03:14:19","totalChlorineProduced":"9927.67","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-03-20 09:35:00","runtime":"00:28:35","totalChlorineProduced":"1072.5","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-03-19 09:35:00","runtime":"01:20:31","totalChlorineProduced":"3835.5","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-03-18 09:35:00","runtime":"00:53:30","totalChlorineProduced":"2400.33","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-03-17 09:35:00","runtime":"02:00:56","totalChlorineProduced":"5957.67","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-03-16 09:35:00","runtime":"00:20:54","totalChlorineProduced":"636.667","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-03-15 09:35:00","runtime":"00:06:13","totalChlorineProduced":"0","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-03-14 15:35:00","runtime":"05:34:42","totalChlorineProduced":"17497.2","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-03-14 09:35:00","runtime":"00:35:54","totalChlorineProduced":"1490.5","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-03-12 09:35:00","runtime":"00:07:49","totalChlorineProduced":"0","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-03-02 09:35:00","runtime":"02:41:43","totalChlorineProduced":"7930.67","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-02-28 09:35:00","runtime":"05:30:57","totalChlorineProduced":"16914.2","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-02-26 09:35:00","runtime":"01:02:06","totalChlorineProduced":"2854.5","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-02-24 09:35:00","runtime":"02:43:44","totalChlorineProduced":"8016.33","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-02-23 09:35:00","runtime":"00:39:31","totalChlorineProduced":"1632.17","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-02-22 09:35:00","runtime":"01:42:10","totalChlorineProduced":"4939.67","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-02-21 09:35:00","runtime":"00:06:16","totalChlorineProduced":"0","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-02-20 09:35:00","runtime":"00:41:40","totalChlorineProduced":"1799.17","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-02-19 09:35:00","runtime":"01:03:55","totalChlorineProduced":"3032.33","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-02-18 09:35:00","runtime":"01:52:41","totalChlorineProduced":"5534.17","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-02-17 09:35:00","runtime":"03:48:35","totalChlorineProduced":"11669.5","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-02-16 09:35:00","runtime":"03:48:44","totalChlorineProduced":"12319.5","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-02-15 09:35:00","runtime":"02:00:51","totalChlorineProduced":"6532","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-02-14 09:35:00","runtime":"04:25:42","totalChlorineProduced":"13648.7","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-02-13 09:35:00","runtime":"00:26:40","totalChlorineProduced":"1076.17","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-02-12 09:35:00","runtime":"01:09:32","totalChlorineProduced":"3269","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."},{"startDateTime":"2017-02-10 09:35:00","runtime":"02:38:16","totalChlorineProduced":"7915.67","statusName":"Completed","statusDesc":"This cycle ran successfully and did not throw any errors or warnings."}]};
            // initChart(device);
            // initDeviceSummary(device);
            // initPastCycles(device);
        }
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
            $("#last-used").html("No cycles for given device.");
            $("#cycle-status").html("No cycles for given device.");

        }
    }

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
            //$(tr).append("<td><img src='img/active.svg'</td>");
            $(tr).append("<td>" + device.cycles[i].statusName + "</td>");
            $(tr).append("<td>" + device.cycles[i].startDateTime + "</td>");
            $(tr).append("<td>" + device.cycles[i].runtime + "</td>");
            $(tr).append("<td>" + device.cycles[i].statusDesc + "</td>");
            $("#cycles-tbody").append(tr);
        }

        // initialize DataTables jQuery library
        $("#cycles").DataTable();
     }

    // initializes the chart. uses Chart.js library.
    function initChart(device) {
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

    // pulls the serialnum from the URL looks like this : .../deviceDetails.html?serialNum=
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