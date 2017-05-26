<?php

	// Import global functions
	require('functions.php');

	// Set get parameters
	if (!isset($_GET['serialNum'])) {
		die('Must pass a serial number.');
	}
	$serialNum = $_GET['serialNum'];

	if (!isset($_GET['allLogs'])) {
		die('Missing the allLogs parameter');
	}
	$allLogs = strcmp(trim($_GET['allLogs']), 'true') == 0;

	// pull data from the database
	if ($allLogs) {
		$results = getDeviceEntries($serialNum);
	} else {
		if (!isset($_GET['start']) && !isset($_GET['end'])) {
			die('Missing start and end parameters');
		}
		$start = $_GET['start'];
		$end = $_GET['end'];
		$results = getDeviceEntriesByDate($serialNum, $start, $end);
	}

	// create csv
	$fileName = 'log_downloads\logfile_' . $serialNum . '.csv';
	$file = fopen($fileName, 'w');
	$currentCycleID = null;
	$cycleTitleValues = ['salinity(g/l)', 'temp_in(C)', 'temp_out(C)', '12V_Supply(V)', 'CELL1(A)', 'CELL2(A)', 'CELL3(A)', 'CELL4(A)', 'Total_Current(A)', 'DATE_TIME'];
	$entryTitleValues = ['time(sec)', 'salinity(g/l)', 'flowrate(ml/min)', 'duty_cycle(%)', 'temp_in(C)', 'temp_out(C)', '12V supply(V)', 'CELL1(A)', 'CELL2(A)', 'CELL3(A)', 'CELL4(A)', 'TOTAL_CURRENT(A)'];
	$delimiter = ', ';
	foreach ($results as $result) {
		if($currentCycleID !== $result['cycleID']) {
			// build line
			$line = array();
			$line[] = $result['startSalinity'];
			$line[] = $result['startTempIn'];
			$line[] = $result['startTempOut'];
			$line[] = $result['startPowerSupply'];
			$line[] = $result['startCell1'];
			$line[] = $result['startCell2'];
			$line[] = $result['startCell3'];
			$line[] = $result['startCell4'];
			$line[] = $result['startTotalCurrent'];
			$line[] = $result['startDateTime'];

			// write line & title lines to log file
			fwrite($file, "\n");
			fwrite($file, implode($delimiter, $cycleTitleValues) . "\n");
			fwrite($file, implode($delimiter, $line) . "\n");

			// fputcsv($file, []); //empty line
			// fputcsv($file, $cycleTitleValues);
			// fputcsv($file, $line, ',', ' ');

			if (!is_null($result['entryID'])) {
				fwrite($file, "\n");
				fwrite($file, implode($delimiter, $entryTitleValues) . "\n");
				// fputcsv($file, []); //empty line
				// fputcsv($file, $entryTitleValues);
			}

			// update $currentCycleID
			$currentCycleID = $result['cycleID'];
		} 
		if (!is_null($result['entryID'])) {
			// build line
			$line = array();
			$line[] = $result['seconds'];
			$line[] = $result['salinity'];
			$line[] = $result['flowrate'];
			$line[] = $result['dutyCycle'];
			$line[] = $result['tempIn'];
			$line[] = $result['tempOut'];
			$line[] = $result['powerSupply'];
			$line[] = $result['cell1'];
			$line[] = $result['cell2'];
			$line[] = $result['cell3'];
			$line[] = $result['cell4'];
			$line[] = $result['totalCurrent'];

			//write the entry values to the file
			fwrite($file, implode($delimiter, $line) . "\n");
			//fputcsv($file, $line);
		}
	}
	fclose($file);

	//redirect browser to file for download
	header('location: ' . $fileName);

// FUNCTIONS
	// returns all of the entries for a device with both the cycle and entry values
	function getDeviceEntries($serialNum) {
		try {
			$query = "SELECT c.cycleID, c.startSalinity, c.startTempIn, c.startTempOut, c.powerSupply AS 'startPowerSupply', c.startCell1,
							c.startCell2, c.startCell3, c.startCell4, c.totalCurrent AS 'startTotalCurrent', c.startDateTime,
					        e.entryID, TIME_TO_SEC(e.seconds) AS 'seconds', e.salinity, e.flowrate, e.dutyCycle,
					        e.tempIn, e.tempOut, e.powerSupply, e.cell1, e.cell2, e.cell3, e.cell4, e.totalCurrent
						FROM CYCLE c
						JOIN DEVICE	d ON d.deviceID = c.deviceID
					    LEFT OUTER JOIN ENTRY e ON e.cycleID = c.cycleID
					    WHERE d.serialNum = :serialNum
					    ORDER BY c.startDateTime
					    LIMIT 2000;";
			$sth = database()->prepare($query);
			$sth->bindValue(':serialNum', $serialNum, PDO::PARAM_INT);
			$sth->execute();

			return $sth->fetchall();
		} catch (Exception $e) {
			return errorMessage($e->getMessage());
		}
	}

	// returns all of the entries for a device with both the cycle and entry values between a date range
	function getDeviceEntriesByDate($serialNum, $startDate, $endDate) {
		try {
			$query = "SELECT c.cycleID,	c.startSalinity, c.startTempIn, c.startTempOut, c.powerSupply AS 'startPowerSupply', c.startCell1,
							c.startCell2, c.startCell3, c.startCell4, c.totalCurrent AS 'startTotalCurrent', c.startDateTime,
				        	e.entryID, TIME_TO_SEC(e.seconds) AS 'seconds', e.salinity, e.flowrate, e.dutyCycle,
				        	e.tempIn, e.tempOut, e.powerSupply, e.cell1, e.cell2, e.cell3, e.cell4, e.totalCurrent
					FROM CYCLE c
					JOIN DEVICE	d ON d.deviceID = c.deviceID
				    LEFT OUTER JOIN ENTRY e ON e.cycleID = c.cycleID
				    WHERE d.serialNum = :serialNum
				    AND c.startDateTime BETWEEN :startDate AND :endDate
				    ORDER BY c.startDateTime
				    LIMIT 2000;";
			$sth = database()->prepare($query);
			$sth->bindValue(':serialNum', $serialNum, PDO::PARAM_INT);
			$sth->bindValue(':startDate', $startDate, PDO::PARAM_STR);
			$sth->bindValue(':endDate', $endDate, PDO::PARAM_STR);
			$sth->execute();

			return $sth->fetchall();
		} catch (Exception $e) {
			return errorMessage($e->getMessage());
		}
	}

?>