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

});