<?php
	// Retreives a list of all devices in the database and returns them as a JSON file.
	
	// Imports global functions
	require('functions.php');

	//Need to add check for authentication
	// if (!isset($_POST[''])) {
	// 	die('Must be signed in to make this request.');
	// }
	
	// Get all devices from the database
	$query = 'SELECT serialNum, lastCleaned, useModeName FROM DEVICE d
	JOIN USE_MODE u ON d.useModeID = u.useModeID';
	$sth = database()->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
	//$sth->bindParam(':location', $location, PDO::PARAM_STR);
	$sth->execute();
	
	// Build JSON object from query results
	$output = array();
	$results = $sth->fetchall();
	foreach ($results as $result) {
		$serialNum = $result['serialNum'];
		$lastCleaned = $result['lastCleaned'];
		$useModeName = $result['useModeName'];
		$device = array('serialNum' => $serialNum, 'lastCleaned' => $lastCleaned, 'useModeName' => $useModeName);
		array_push($output, $device);
	}

	// Output JSON object with query results
	echo json_encode($output);
?>