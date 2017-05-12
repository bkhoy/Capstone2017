'use strict';

$(function() {
    const GET_ALL_DEVICES = "http://boneappletea.me/webservice/getAllDevices.php";
    const GET_DEVICE_DETAILS = "http://boneappletea.me/webservice/getDeviceInfo.php?serialNum=15348";

    //displays list of all devices
    function getAllDevices() {
        // $.get(GET_ALL_DEVICES, function(data) {
        //     console.log(data);
        // }).then(function(response) {
        //     var data = [{"serialNum":"15348","status":"Active","city":"Nairobi","country":"Kenya","deploymentDate":"2017-04-03","mostRecentCycle":null},{"serialNum":"15345","status":"Active","city":"Mombasa","country":"Kenya","deploymentDate":"2017-04-03","mostRecentCycle":null},{"serialNum":"15345","status":"Active","city":"Nairobi","country":"Kenya","deploymentDate":"2017-01-03","mostRecentCycle":null},{"serialNum":"15344","status":"Active","city":"Wote","country":"Kenya","deploymentDate":"2017-04-03","mostRecentCycle":null},{"serialNum":"15344","status":"Active","city":"Nairobi","country":"Kenya","deploymentDate":"2017-01-03","mostRecentCycle":null},{"serialNum":"15342","status":"Active","city":"Dadaab","country":"Kenya","deploymentDate":"2017-04-03","mostRecentCycle":null},{"serialNum":"15347","status":"Active","city":"Port-au-Prince","country":"Haiti","deploymentDate":"2017-04-03","mostRecentCycle":null},{"serialNum":"15340","status":"Active","city":"Cercadie","country":"Haiti","deploymentDate":"2017-04-03","mostRecentCycle":null}];
        //     console.log(data);
        // });
        var data = [{"serialNum":"15348","status":"Active","city":"Nairobi","country":"Kenya","deploymentDate":"2017-04-03","mostRecentCycle":null},{"serialNum":"15345","status":"Active","city":"Mombasa","country":"Kenya","deploymentDate":"2017-04-03","mostRecentCycle":null},{"serialNum":"15345","status":"Active","city":"Nairobi","country":"Kenya","deploymentDate":"2017-01-03","mostRecentCycle":null},{"serialNum":"15344","status":"Active","city":"Wote","country":"Kenya","deploymentDate":"2017-04-03","mostRecentCycle":null},{"serialNum":"15344","status":"Active","city":"Nairobi","country":"Kenya","deploymentDate":"2017-01-03","mostRecentCycle":null},{"serialNum":"15342","status":"Active","city":"Dadaab","country":"Kenya","deploymentDate":"2017-04-03","mostRecentCycle":null},{"serialNum":"15347","status":"Active","city":"Port-au-Prince","country":"Haiti","deploymentDate":"2017-04-03","mostRecentCycle":null},{"serialNum":"15340","status":"Active","city":"Cercadie","country":"Haiti","deploymentDate":"2017-04-03","mostRecentCycle":null}];
        var table = $('.table');
        for (var i = 0; i < data.length; i++) {
            var tr = $('<tr></tr>');
            table.append(tr);
            tr.append($('<td>' + data[i].status + '</td>'));
            tr.append($('<td>' + data[i].serialNum + '</td>'));
            tr.append($('<td>' + data[i].mostRecentCycle + '</td>'));
            tr.append($('<td>' + data[i].deploymentDate + '</td>'));
            tr.append($('<td>' + data[i].city + '</td>'));
            tr.append($('<td>' + data[i].country + '</td>'));
        }
    }


    function getSpecificDevice() {
        $.get(GET_DEVICE_DETAILS, function(data) {
            console.log(data);
        }).then(function() {

        });
    }

    getAllDevices();
    // getSpecificDevice();
});