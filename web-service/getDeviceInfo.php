<?php
	// Retreives a list of all devices in the database and returns them as a JSON file.
	
	// Imports global functions
	require('functions.php');
	authenticate();
	
	if (!isset($_GET['serialNum'])) {
		die('Must pass a serial number.');
	}
	$serialNum = $_GET['serialNum'];

	// Get all devices from the database
	$query = "SELECT serialNum, lastCleaned, useModeName, city, country, (SELECT startDateTime FROM CYCLE c
			    JOIN DEVICE d ON d.deviceID = c.deviceID
			    WHERE d.serialNum = :serialNum AND
			    startDateTime IS NOT NULL
			    ORDER BY startDateTime DESC
			    LIMIT 1) AS 'lastCycle' FROM DEVICE d
			    JOIN LOCATION l ON l.deviceID = d.deviceID
			    JOIN USE_MODE u ON d.useModeID = u.useModeID 
			    WHERE d.serialNum = :serialNum;";
	$sth = database()->prepare($query);
	$sth->bindValue(':serialNum', $serialNum, PDO::PARAM_INT);
	$sth->execute();
	
	// Build JSON object from query results
	$output = array();
	$results = $sth->fetchall();
	foreach ($results as $result) {
		$output['serialNum'] = $result['serialNum'];
		$output['lastCleaned'] = $result['lastCleaned'];
		$output['useModeName'] = $result['useModeName'];
		$output['city'] = $result['city'];
		$output['country'] = $result['country'];
		$output['lastCycle'] = $result['lastCycle'];
	}

	// Get all users assoicated with this device
	$query2 = "SELECT email, accountType FROM DEVICE d
			    JOIN USER_DEVICE ud ON d.deviceID = ud.deviceID
			    JOIN USER u ON u.userID = ud.userID
			    JOIN ACCOUNT_TYPE a ON a.accountTypeID = u.accountTypeID
			    WHERE serialNum = :serialNum;";
	$sth2 = database()->prepare($query2);
	$sth2->bindValue(':serialNum', $serialNum, PDO::PARAM_INT);
	$sth2->execute();
	$output['users'] = $sth2->fetchall();

	// Get the devices 10 most recent cycles
	$output['recentCycles'] = getRecentDeviceCycles($serialNum, 10);
	
	// Output JSON object with query results
	echo json_encode($output);
?>