'use strict';

$(function() {
    const GET_ALL_DEVICES = "http://boneappletea.me/webservice/getAllDevices.php";
    const GET_DEVICE_DETAILS = "http://boneappletea.me/webservice/getDeviceInfo.php?serialNum=15348";

    //displays list of all devices
    function getAllDevices() {
        $.get(GET_ALL_DEVICES, function(data) {
            console.log(data);
        }).then(function(response) {

        });
    }


    function getSpecificDevice() {
        $.get(GET_DEVICE_DETAILS, function(data) {
            console.log(data);
        }).then(function() {

        });
    }

    // getAllDevices();
    // getSpecificDevice();
});