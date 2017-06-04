<?php
	// Retreives a list of device details for all of the devices associated with a user, based on the given email address, and returns them as a JSON file.
	
	// Imports global functions
	require('functions.php');

	if (!isset($_GET['email'])) {
		die('Must pass an email.');
	}

	$output = array();
	$devices = getAllDevicesForEmail($_GET['email']);
	foreach ($devices as $device) {
		$device['cycles'] = getRecentDeviceCycles($device['serialNum'], 10);
		$output[] = $device;
	}
	echo json_encode($output);

// FUNCTIONS
	// Outputs an array of devices where each element is an assoicative array with the following keys:
	// 		serialNum, city, country, longitude, latitude, placementDate, photoFileName
	function getAllDevicesForEmail($email) {
		// Get all devices assoicated with the user of the given email
		$query = "SELECT serialNum, city, country, longitude, latitude, Max(placementDate) as 'placementDate', photoFileName
					FROM DEVICE d
				    JOIN USER_DEVICE ud ON ud.deviceID = d.deviceID
				    JOIN USER u ON u.userID = ud.userID
				    JOIN LOCATION l ON l.deviceID = d.deviceID
				    WHERE email = :email
				    GROUP BY d.deviceID;";
		$sth = database()->prepare($query);
		$sth->bindValue(':email', $email, PDO::PARAM_STR);
		$sth->execute();
		
		// Build JSON object from query results
		$output = array();
		$results = $sth->fetchall();
		foreach ($results as $result) {
			$device = array();
			$device['serialNum'] = $result['serialNum'];
			$device['city'] = $result['city'];
			$device['country'] = $result['country'];
			$device['longitude'] = $result['longitude'];
			$device['latitude'] = $result['latitude'];
			$device['placementDate'] = $result['placementDate'];
			if (is_null($result['photoFileName'])) {
				$device['photoFileName'] = 'defaultImage.png';//default image???
			} else {
				$device['photoFileName'] = $result['photoFileName'];
			}
			$output[] = $device;
		}

		return $output;
	}

?>