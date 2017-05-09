<?php
	// Global functions used accross the web service.
	authenticate();

//FUNCTIONS
	// Creates and returns a new PDO object connected to the SEFlow_dashboard database
	function database() {
		$db = new PDO("mysql:dbname=SEFlow_dashboard;host=seflowdb.cgp29ssuqlax.us-west-2.rds.amazonaws.com;port=3306;charset=utf8", "dashboard", "MouS@17Rese_tain");
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		return $db;
	}

	// Checks to make sure that the user is authenticated.  If they are not authenticated, then they are sent back to the login page.  If they are, php script is allowed to run.
	function authenticate() {
		$authenticated = true;
		if(!$authenticated) {
			header("Location: https://www.boneappletea.me");
			exit();
		}
	}

	// Gets $numCycles (int) of the most recent cycles for the device with the given $serialNum (int).  Returns the values as an array.
	function getRecentDeviceCycles($serialNum, $numCycles) {
		$query = 'SELECT startDateTime, startTempIn, startCell1, startCell2, startCell3, totalCurrent, errorID
					FROM CYCLE c
					JOIN DEVICE d ON d.deviceID = c.deviceID
				    WHERE d.serialNum = :serialNum
				    ORDER BY startDateTime DESC
				    LIMIT :numCycles;';
		$sth = database()->prepare($query);
		$sth->bindValue(':serialNum', $serialNum, PDO::PARAM_INT);
		$sth->bindValue(':numCycles', $numCycles, PDO::PARAM_INT);
		$sth->execute();
		return $sth->fetchall();
	}
?>