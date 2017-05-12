<?php
	// Retreives a list of all devices in the database and returns them as a JSON file.
	
	// Imports global functions
	require('functions.php');
	authenticate();
	
	// Get all devices from the database
	$query = "SELECT serialNum, statusName AS 'status', city, country, placementDate AS 'deploymentDate', 
				(SELECT startDateTime FROM CYCLE c WHERE c.cycleID = d.mostRecentCycle) AS 'mostRecentCycle'
				FROM DEVICE d
				JOIN LOCATION l ON d.deviceID = l.deviceID
    			JOIN DEVICE_STATUS ds ON ds.statusID = d.deviceStatusID;";
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
		$deploymentDate = $result['deploymentDate'];
		$status = $result['status'];
		$mostRecentCycle = $result['mostRecentCycle'];
		$device = array('serialNum' => $serialNum, 'status' => $status, 'city' => $city, 'country' => $country, 'deploymentDate' => $deploymentDate, 'mostRecentCycle' => $mostRecentCycle);
		$output[] = $device;
	}

	// Output JSON object with query results
	echo json_encode($output);
?>