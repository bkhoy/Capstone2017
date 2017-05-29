'use strict';

$(function() {

	// Handle the add a device form
	$("#addDevice").submit(function(event) {
	  	event.preventDefault();
	
		// get values from the from
		var $form = $(this);
		var serialNum = $form.find("input[name='serialNum']").val();
		var photoName = $form.find("select[name='photoName']").val();
		var placementDate = $form.find("input[name='placementDate']").val();
		var city = $form.find("input[name='city']").val();
		var country = $form.find("input[name='country']").val();
		var longitude = $form.find("input[name='longitude']").val();
		var latitude = $form.find("input[name='latitude']").val();

		// post the values to addDevice.php
		var posting = $.post( "./webservice/addDevice.php", {
			'serialNum': serialNum, 'photoName': photoName,
			'placementDate': placementDate,'city': city,
			'country': country,'longitude': longitude,
			'latitude': latitude});

		// Put the results in a div
		posting.done(function(data) {
			$("#deviceResult").empty().append(data);
		});
	});

    // hard coded email for now
    var email = "admin@msr.com";
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