<?php
	// Retreives a list of all devices in the database and returns them as a JSON file.
	
	// Imports global functions
	require('functions.php');

	//Need to add check for authentication
	// if (!isset($_POST[''])) {
	// 	die('Must be signed in to make this request.');
	// }
	
	// Get all devices from the database
	 $query = 'SELECT serialNum, city, country, placementDate FROM DEVICE d
	JOIN LOCATION l on d.deviceID = l.deviceID';
	// $query = 'SELECT serialNum, city, country, placementDate, startDateTime FROM DEVICE d
	// JOIN LOCATION l on d.deviceID = l.deviceID
 //    JOIN CYCLE c on d.deviceID = c.deviceID
 //    ORDER BY startDateTime ASC
 //    LIMIT 1;';
	$sth = database()->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
	$sth->execute();

//ADD USE MODE BACK IN
	// Build JSON object from query results
	$output = array();
	$results = $sth->fetchall();
	foreach ($results as $result) {
		$serialNum = $result['serialNum'];
		$city = $result['city'];
		$country = $result['country'];
		$placementDate = $result['placementDate'];
		$lastUsed = 'TEMP'; //$result['startDateTime'];
		$status = 'Active';
		$device = array('serialNum' => $serialNum, 'city' => $city, 'country' => $country, 'deploymentDate' => $placementDate, 'lastUsed' => $lastUsed, 'status' => 'status');
		array_push($output, $device);
	}

	// Output JSON object with query results
	echo json_encode($output);
?>