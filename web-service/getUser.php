<?php
	// Retreives the details of a user's account as a JSON file.
	
	// Imports global functions
	require('functions.php');

	if (!isset($_GET['email'])) {
		die('Must pass an email.');
	}

	// Get the details of the user with the given email from the database
	$query = "SELECT fname, lname, email, accountType, (SELECT organizationName FROM ORGANIZATION o WHERE u.organizationID = o.organizationID) AS 'organizationName' FROM USER u JOIN ACCOUNT_TYPE a ON a.accountTypeID = u.accountTypeID WHERE u.email = :email";
	$sth = database()->prepare($query);
	$sth->bindValue(':email', $_GET['email'], PDO::PARAM_STR);
	$sth->execute();
	
	// Build JSON object from query results
	$output = array();
	$results = $sth->fetchall();
	foreach ($results as $result) {
		$output['fname'] = $result['fname'];
		$output['lname'] = $result['lname'];
		$output['email'] = $result['email'];
		$output['accountType'] = $result['accountType'];
		$output['organizationName'] = $result['organizationName'];
	}

	// Get all devices assoicated with the user of the given email
	$query2 = 'SELECT serialNum FROM USER u JOIN USER_DEVICE um ON um.userID = u.userID JOIN DEVICE d ON d.deviceID = um.deviceID WHERE email = :email;';
	$sth2 = database()->prepare($query2);
	$sth2->bindValue(':email', $_GET['email'], PDO::PARAM_STR);
	$sth2->execute();
	$output['devices'] = $sth2->fetchall();

	// Output JSON object with query results
	echo json_encode($output);
?>