'use strict';

$(function() {
    const GET_ALL_DEVICES = "http://boneappletea.me/webservice/getAllDevices.php";
    const GET_DEVICE_DETAILS = "http://boneappletea.me/deviceDetails.html?serialNum=";

    //displays list of all devices
    function getAllDevices() {
        $.ajax({
            url: GET_ALL_DEVICES,
            dataType: "json",
            method: "GET",
            success: function(data) {
                // will need to uncomment this for local dev (CORS issue will come up)
                //var data = [{"serialNum":"15348","status":"Active","city":"Nairobi","country":"Kenya","placementDate":"2017-04-03","mostRecentCycle":"2017-04-17 09:35:00"},{"serialNum":"15345","status":"Active","city":"Mombasa","country":"Kenya","placementDate":"2017-04-03","mostRecentCycle":"2017-04-17 09:35:00"},{"serialNum":"15344","status":"Active","city":"Wote","country":"Kenya","placementDate":"2017-04-03","mostRecentCycle":"2017-04-17 09:35:00"},{"serialNum":"15342","status":"Active","city":"Dadaab","country":"Kenya","placementDate":"2017-04-03","mostRecentCycle":"2017-04-17 09:35:00"},{"serialNum":"15347","status":"Active","city":"Port-au-Prince","country":"Haiti","placementDate":"2017-04-03","mostRecentCycle":"2017-04-17 09:35:00"},{"serialNum":"15340","status":"Active","city":"Cercadie","country":"Haiti","placementDate":"2017-04-03","mostRecentCycle":"2017-04-17 09:35:00"}];

                var table = $('.table');
                for (var i = 0; i < data.length; i++) {
                    var link = GET_DEVICE_DETAILS + data[i].serialNum;
                    var tr = $('<tr></tr>');
                    table.append(tr);
                    $(tr).append("<td><img src='img/active.svg'</td>");
                    tr.append($('<td><a href="' + link + '" >' + data[i].serialNum + '</a></td>'));
                    tr.append($('<td>' + data[i].mostRecentCycle + '</td>'));
                    tr.append($('<td>' + data[i].placementDate + '</td>'));
                    tr.append($('<td>' + data[i].city + '</td>'));
                    tr.append($('<td>' + data[i].country + '</td>'));

                    $("#cycles-tbody").append(tr);
                }

                // initialize DataTables jQuery library
                $("#devices").DataTable();
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    getAllDevices();
});