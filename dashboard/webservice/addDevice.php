<?php
	// Creates a new device in the database from the given post parameters.

	// Imports global functions
	require('functions.php');

	// check to see that all post parameters are set
	if (!isset($_POST['serialNum']) && !isset($_POST['photoFileName']) && isset($_POST['city']) && isset($_POST['country']) && isset($_POST['longitude']) && isset($_POST['latitude']) && isset($_POST['placementDate'])) {
		die('Must pass all parameters from the form to create a new device.');
	}

	// set all variables
	$serialNum = $_POST['serialNum'];
	$photoFileName = $_POST['photoName'];
	$city = $_POST['city'];
	$country = $_POST['country'];
	$longitude = $_POST['longitude'];
	$latitude = $_POST['latitude'];
	$placementDate = $_POST['placementDate'];

	// check required values
	if (strlen(trim($serialNum)) == 0 || strlen(trim($country)) == 0 || strlen(trim($longitude)) == 0 || strlen(trim($latitude)) == 0) {
		die('Missing at least one of the requred parameters: serialNum, country, longitude, or latitude.');
	}

	// call the addDevice storedProcedure
	try {
		$query = "CALL addDevice(:serialNum, :photoFileName, :city, :country, :longitude, :latitude, :placementDate, @output); SELECT @ouptut;";
		$sth = database()->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		$sth->execute(array(':serialNum' => $serialNum, ':photoFileName' => $photoFileName,
							':city' => $city, ':country' => $country,
							':longitude' => $longitude, ':latitude' => $latitude,
							':placementDate' => $placementDate));
		$deviceID = $sth->fetch()[0];
	} catch (Exception $e) {
		errorMessage($e->getMessage());
	}

	if ($deviceID != -1) {
		echo('Device has been successfully created in the database.');
	} else {
		echo('The device was not added to the database.');
	}
?>