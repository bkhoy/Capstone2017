<?php
	// Retreives a list of all devices in the database and returns them as a JSON file.
	
	// Imports global functions
	require('functions.php');
	
	// Get all devices from the database
	$query = "SELECT serialNum, statusName AS 'status', city, country, MAX(placementDate) AS 'placementDate',
					MAX(startDateTime) AS 'mostRecentCycle' 
				FROM DEVICE d
				JOIN LOCATION l ON d.deviceID = l.deviceID
			    LEFT OUTER JOIN CYCLE c ON c.deviceID = d.deviceID
			    JOIN DEVICE_STATUS ds ON ds.statusID = d.deviceStatusID
			    GROUP BY d.deviceID;";
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
		$status = $result['status'];
		$mostRecentCycle = $result['mostRecentCycle'];
		$device = array('serialNum' => $serialNum, 'status' => $status, 'city' => $city, 'country' => $country,
						'placementDate' => $placementDate, 'mostRecentCycle' => $mostRecentCycle);
		$output[] = $device;
	}

	// Output JSON object with query results
	echo json_encode($output);
?>