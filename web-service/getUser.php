<?php
	// Retreives a list of all devices in the database and returns them as a JSON file.
	
	// Imports global functions
	require('functions.php');

	//Need to add check for authentication
	// if (!isset($_POST[''])) {
	// 	die('Must be signed in to make this request.');
	// }
	
	if (!isset($_GET['email'])) {
		die('Must pass an email.');
	}

	// Get all devices from the database
	$query = 'SELECT fname, lname, email, accountType FROM USER u
		JOIN ACCOUNT_TYPE a ON a.accountTypeID = u.accountTypeID
		WHERE u.email = :email';
	$sth = database()->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
	$sth->bindParam(':email', $_GET['email'], PDO::PARAM_STR);
	$sth->execute();
	
	// Build JSON object from query results
	$output = array();
	$results = $sth->fetchall();
	foreach ($results as $result) {
		$fname = $result['fname'];
		$lname = $result['lname'];
		$email = $result['email'];
		$accountType = $result['accountType'];
		$user = array('fname' => $fname, 'lname' => $lname, 'email' => $email, 'accountType' => $accountType);
		array_push($output, $user);
	}

	// Output JSON object with query results
	echo json_encode($output);
?>