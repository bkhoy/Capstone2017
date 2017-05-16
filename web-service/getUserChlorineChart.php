<?php
	// Retreives a list of all devices in the database and returns them as a JSON file.
	
	// Imports global functions
	require('functions.php');
	authenticate();

	if (!isset($_GET['email'])) {
		die('Must pass an email.');
	}

	// Build JSON object from query results
	$output = array();

	// Get all devices assoicated with the user of the given email
	$query = 'SELECT serialNum FROM USER u 
				JOIN USER_DEVICE ud ON ud.userID = u.userID 
				JOIN DEVICE d ON d.deviceID = ud.deviceID 
				WHERE email = :email;';
	$sth = database()->prepare($query);
	$sth->bindValue(':email', $_GET['email'], PDO::PARAM_STR);
	$sth->execute();
	$devices = $sth->fetchall();
	
	// Get the startDateTime and chlorineProduced for each device assoicated with the user
	foreach ($devices as $serialNum) {
		$output[$serialNum['serialNum']] = getClProduced($serialNum['serialNum']);
	}

	// Output JSON object with query results
	echo json_encode($output);

	/* FUNCTIONS */
	function getClProduced($serialNum) {
		$queryCl = "SELECT startDateTime, totalChlorineProduced FROM CYCLE c
			 	JOIN DEVICE d ON d.deviceID = c.deviceID
			    WHERE serialNum = :serialNum
			    ORDER BY startDateTime DESC
			    LIMIT 10;";
		$sthCl = database()->prepare($queryCl);
		$sthCl->bindValue(':serialNum', $serialNum, PDO::PARAM_INT);
		$sthCl->execute();
		$result = $sthCl->fetchall();
		return $result;
	}
?>