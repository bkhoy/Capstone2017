<?php
	// Retreives a list of all devices in the database and returns them as a JSON file.
	
	// Imports global functions
	require('functions.php');
	
	if (!isset($_GET['serialNum'])) {
		die('Must pass a serial number.');
	}
	$serialNum = $_GET['serialNum'];

	$output = getDeviceDetails($serialNum);
	$output['cycles'] = getRecentDeviceCycles($serialNum, 50);
	
	// Output JSON object with query results
	echo json_encode($output);

//FUNCTIONS
	// Gets the device details for the device with the given $serialNumber (int) from the database
	function getDeviceDetails($serialNum) {
		$query = "SELECT serialNum, statusName, useModeName, city, country, MAX(startDateTime) AS 'mostRecentCycle'
					FROM DEVICE d
					JOIN LOCATION l ON l.deviceID = d.deviceID
					JOIN USE_MODE u ON d.useModeID = u.useModeID
					JOIN DEVICE_STATUS ds ON d.deviceStatusID = ds.statusID
					LEFT OUTER JOIN CYCLE c ON c.deviceID = d.deviceID
	    			WHERE d.serialNum = :serialNum
	    			GROUP BY d.deviceID;";
		$sth = database()->prepare($query);
		$sth->bindValue(':serialNum', $serialNum, PDO::PARAM_INT);
		$sth->execute();
		
		// Build JSON object from query results
		$output = array();
		$results = $sth->fetchall();
		foreach ($results as $result) {
			$output['serialNum'] = $result['serialNum'];
			$output['statusName'] = $result['statusName'];
			$output['useModeName'] = $result['useModeName'];
			$output['city'] = $result['city'];
			$output['country'] = $result['country'];
			$output['mostRecentCycle'] = $result['mostRecentCycle'];
		}
		return $output;
	}
?>