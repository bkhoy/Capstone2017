<?php
	// Retreives a list of all the current locations for all devices in the database and returns them as a JSON file.
	
	// Imports global functions
	require('functions.php');
	authenticate();
	
	// Get the most current location for all devices from the database
	$query = "SELECT serialNum, city, country, longitude, latitude, MAX(placementDate) AS 'placementDate' FROM DEVICE d
				JOIN LOCATION l on d.deviceID = l.deviceID
    			GROUP BY serialNum;";
	$sth = database()->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
	$sth->execute();

	// Build JSON object from query results
	$output = array();
	$results = $sth->fetchall();
	foreach ($results as $result) {
		$serialNum = $result['serialNum'];
		$city = $result['city'];
		$country = $result['country'];
		$longitude = $result['longitude'];
		$latitude = $result['latitude'];
		$placementDate = $result['placementDate'];
		$device = array('serialNum' => $serialNum, 'city' => $city, 'country' => $country, 'latitude' => $latitude, 'longitude' => $longitude, 'deploymentDate' => $placementDate);
		$output[] = $device;
	}

	// Output JSON object with query results
	echo json_encode($output);
?>