'use strict';

$(function() {
    const GET_ALL_DEVICES = "./webservice/getAllDevices.php";
    const GET_DEVICE_DETAILS = "./deviceDetails.html?serialNum=";
    // hard coded email for now
    var email = "admin@msr.com";
    const GET_ACCOUNT_INFO = "./webservice/getUser.php?email=" + email;

    //displays list of all devices
    function getAllDevices() {
        $.ajax({
            url: GET_ALL_DEVICES,
            dataType: "json",
            method: "GET",
            success: function(data) {
                populatePage(data);
            },
            error: function(error) {
                console.log(error);
                $("#statuses").html("Oops! Looks like the data could not be retrieved. Please bring this up to the website admin! Sorry about that. &#9785;");
                // uncomment the two lines below if you want to run website locally. Comment out the above line as well.
                // var data = [{"serialNum":"15348","status":"Active","city":"Nairobi","country":"Kenya","placementDate":"2017-04-03","mostRecentCycle":"2017-04-17 09:35:00"},{"serialNum":"15345","status":"Active","city":"Mombasa","country":"Kenya","placementDate":"2017-04-03","mostRecentCycle":"2017-04-17 09:35:00"},{"serialNum":"15344","status":"Active","city":"Wote","country":"Kenya","placementDate":"2017-04-03","mostRecentCycle":"2017-04-17 09:35:00"},{"serialNum":"15342","status":"Active","city":"Dadaab","country":"Kenya","placementDate":"2017-04-03","mostRecentCycle":"2017-04-17 09:35:00"},{"serialNum":"15347","status":"Active","city":"Port-au-Prince","country":"Haiti","placementDate":"2017-04-03","mostRecentCycle":"2017-04-17 09:35:00"},{"serialNum":"15340","status":"Active","city":"Cercadie","country":"Haiti","placementDate":"2017-04-03","mostRecentCycle":"2017-04-17 09:35:00"}];
                // populatePage(data);
            }
        }).done(function() {
            $(".statuses").css("visibility", "visible");
            $(".loadingDiv").toggle();
        });
    }

    function populatePage(data) {
        var table = $('.table');

        var warningCount = 0;
        var errorCount = 0;
        var activeCount = 0;
        var inactiveCount = 0;
        var unknownCount = 0;

        for (var i = 0; i < data.length; i++) {
            var link = GET_DEVICE_DETAILS + data[i].serialNum;
            var tr = $('<tr></tr>');
            table.append(tr);
            var iconLink = "<img src='img/" + data[i].status.toLowerCase() + ".svg'>";
            $(tr).append("<td>" + iconLink + "</td>");
            tr.append($('<td><a href="' + link + '" >' + data[i].serialNum + '</a></td>'));
            
            if (!data[i].mostRecentCycle) {
                tr.append($('<td>-</td>'));
            } else {
                tr.append($('<td>' + data[i].mostRecentCycle + '</td>'));
            }

            if (!data[i].placementDate) {
                tr.append($('<td>-</td>'));
            } else {
                tr.append($('<td>' + data[i].placementDate + '</td>'));
            }

            if (!data[i].city) {
                tr.append($('<td>-</td>'));
            } else {
                tr.append($('<td>' + data[i].city + '</td>'));
            }

            tr.append($('<td>' + data[i].country + '</td>'));
            $("#cycles-tbody").append(tr);

            if (data[i].status.startsWith("Active")) {
                activeCount++;
            } else if (data[i].status.startsWith("Error")) {
                errorCount++;
            } else if (data[i].status.startsWith("Inactive")) {
                inactiveCount++;
            } else if (data[i].status.startsWith("Warning")) {
                warningCount++;
            } else if (data[i].status.startsWith("Unknown")) {
                unknownCount++;
            }
        }

        // Update the status totals at the top of the page

        var active = $("<h1></h1>");
        active.html(activeCount);
        $("#active").append(active);

        var warning = $("<h1></h1>");
        warning.html(warningCount);
        $("#warning").append(warning);

        var error = $("<h1></h1>");
        error.html(errorCount);
        $("#error").append(error);

        var inactive = $("<h1></h1>");
        inactive.html(inactiveCount);
        $("#inactive").append(inactive);

        var total = $("<h1></h1>");
        total.html(data.length);
        $("#total").append(total);

        var unknown = $("<h1></h1>");
        unknown.html(unknownCount);
        $("#unknown").append(unknown);

        // initialize DataTables jQuery library
        $("#devices").DataTable({
            "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
            "oLanguage": {
                "sLengthMenu": "Show _MENU_ devices",
                "sInfo": "Showing _START_ to _END_ of _TOTAL_ devices"
            }
        });
    }

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

    getAllDevices();
});