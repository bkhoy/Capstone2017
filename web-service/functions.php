<?php
	// Global functions used accross the web service.

//FUNCTIONS
	// Creates and returns a new PDO object connected to the SEFlow_dashboard database
	function database() {
		$db = new PDO("mysql:dbname=SEFlow_dashboard;host=seflowdb.cgp29ssuqlax.us-west-2.rds.amazonaws.com;port=3306;charset=utf8", "dashboard", "MouS@17Rese_tain");
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		return $db;
	}

	function errorMessage($errorMessage) {
		// for production 
		//die(); ???

		// for testing
		echo 'Error: <br />' . $errorMessage . '<br />';
		return null;
	}

	// Gets $numCycles (int) of the most recent cycles for the device with the given $serialNum (int).  Returns the values as an array.
	function getRecentDeviceCycles($serialNum, $numCycles) {
		try {
			$query = "SELECT c.startDateTime, MAX(seconds) AS 'runtime', totalChlorineProduced, 
						(SELECT statusName FROM CYCLE_STATUS cs WHERE cs.cycleStatusID = c.cycleStatusID) AS 'statusName', 
						(SELECT statusDesc FROM CYCLE_STATUS cs WHERE cs.cycleStatusID = c.cycleStatusID) AS 'statusDesc'
					FROM CYCLE c
					JOIN DEVICE d ON d.deviceID = c.deviceID
					JOIN ENTRY e ON c.cycleID = e.cycleID
					WHERE d.serialNum = :serialNum
					GROUP BY e.cycleID
					ORDER BY startDateTime DESC
					LIMIT :numCycles;";
			$sth = database()->prepare($query);
			$sth->bindValue(':serialNum', $serialNum, PDO::PARAM_INT);
			$sth->bindValue(':numCycles', $numCycles, PDO::PARAM_INT);
			$sth->execute();

			$results = $sth->fetchall();
			$output = array();
			foreach ($results as $result) {
				$cycle = array();
				$cycle['startDateTime'] = $result['startDateTime'];
				$cycle['runtime'] = $result['runtime'];
				$cycle['totalChlorineProduced'] = $result['totalChlorineProduced'];
				
				if (is_null($result['statusName'])) {
					$cycle['statusName'] = 'Completed';
					$cycle['statusDesc'] = 'This cycle ran successfully and did not throw any errors or warnings.';
				} else {
					$cycle['statusName'] = $result['statusName'];
					$cycle['statusDesc'] = $result['statusDesc'];
				}
				
				$output[] = $cycle;
			}

			return $output;
		} catch (Exception $e) {
			return errorMessage($e->getMessage());
		}		
	}
?>