<?php
// is there a way to set this based on how many lines are in the given file?
	ini_set('max_execution_time', 50000);

	// Imports global functions
	require('functions.php');

	// Get the name of the log file
	if(!isset($_GET['logfile'])) {
		die('Must pass a file name');
	}
	$logfile = $_GET['logfile'];
	// Check that the file exists and that the filename is correctly formated, then open it
	if(!preg_match('/(logfile|logdata)_\d{5}.(txt|csv)/i', $logfile)) {
		die("Given filename is incorrectly formatted. <br/> Should follow the structure: 'logfile_00000.txt' or 'logfile_00000.csv' with the 0s representing a device's serial number.");
	}
	if(!file_exists($logfile)) {
		die('The log file ' . $logfile . ' could not be found on the server.');
	}
	$logdata = fopen($logfile, "r");

	// Parse the log file into the cycles, calculate the chlorine produced, and submit each cycle to the database
	$serialNum = substr($logfile, 8, 5);
	$producingCl = FALSE;
	$cycle = null;
    while (($line = fgetcsv($logdata, 1000, ",")) !== FALSE) {
        if (strcmp(trim($line[0]), "salinity(g/l)") === 0) { // cycle title line
        	// submit previous cycle 
        	if ($cycle !== null) {
	    		sumbitCycle($cycle, $serialNum);
	    	}
	    	// start new cycle
        	$cycle = new cycle(fgetcsv($logdata, 1000, ","));
        } else if (count($line) === 12  && strcmp(trim($line[0]), "time(sec)") !== 0) { // data line
	    	$entryValues = $line;
	    	// If cell 4 is reading a value greater than 0 then chlorine has started to be pumped out of the device since the previous entry. 
	    	$cell4 = $entryValues[10];
	    	$producingCl = $cell4 != 0;
	    	$cycle->addEntries($entryValues, $producingCl);	
	    }
		//skip the entries title lines and blank lines
    }

    // submits the last cycle in the file
    if ($cycle !== null) {
		sumbitCycle($cycle, $serialNum);
	} 
    fclose($logdata);

//FUNCTIONS
	// Takes a Cycle object and inserts its contents into the database
	function sumbitCycle($cycle, $serialNum) {
//check to see if the cycle exists or not
		//insert the cycle into the database and gets the cycleID from the database
		$query = "CALL addCycle((SELECT deviceID FROM DEVICE WHERE DEVICE.serialNum = :serialNum), :startDateTime, :salinity, :tempIn, :tempOut, :powerSupply, :cell1, :cell2, :cell3, :cell4, :totalCurrent, :chlorineProduced, :cycleStatus, @output); SELECT @ouptut;";
		$sth = database()->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		$sth->execute(array(':serialNum' => $serialNum, ':startDateTime' => $cycle->dateTime,
							':salinity' => $cycle->salinity, ':tempIn' => $cycle->tempIn, 
							':tempOut' => $cycle->tempOut, ':powerSupply' => $cycle->powerSupply, 
							':cell1' => $cycle->cell1, ':cell2' => $cycle->cell2, 
							':cell3' => $cycle->cell3, 'cell4' => $cycle->cell4, 
							':totalCurrent' => $cycle->totalCurrent, ':chlorineProduced' => $cycle->totalChlorineProduced,
							':cycleStatus' => $cycle->cycleStatus));
		$cycleID = $sth->fetch()[0];

		// insert the cycle's entries into the database in batches of 1000
		$entryBatch = array();
		foreach ($cycle->entries as $entry) {
			if(count($entryBatch) > 1000) {
				submitEntries($entryBatch, $cycleID);
				$entryBatch = array();
			}
			$entryBatch[] = $entry;
		}
		// inserts any remaining entries into the database
		if (count($entryBatch) !== 0) {
			submitEntries($entryBatch, $cycleID);
		}
	}

	// Takes an array of strings, with each string recording a single entry and submits each value in the string seperated by commas into the database with the given cycleID.
	// Expects each string to be have values in the following order: seconds, salinity, flowrate, temp_in, temp_out, 12V supply, CELL1, CELL2, CELL3, CELL4
	function submitEntries($entries, $cycleID) {
		$count = count($entries);
		$query = "";
		$queryValues = [':cycleID' => $cycleID];
		// loops through each element in the $entires array and appends an insert query for that element to $query. Then adds that elements values to the $queryValues array with the corresponding variable names.
		for ($i=0; $i < $count; $i++) {
			$entry = $entries[$i];
			$query .= "CALL addEntries(:cycleID, :seconds" . $i . ", :salinity" . $i . 
						", :flowrate" . $i . ", :dutyCycle" . $i . 
						", :tempIn" . $i . ", :tempOut" . $i . 
						", :supply" . $i . ", :cell1" . $i . 
						", :cell2" . $i . ", :cell3" . $i . 
						", :cell4" . $i . ", :totalCurrent" . $i . 
						", :chlorineProduced" . $i . ");";
			$entryValues = [(':seconds' . $i) => $entry[0], (':salinity' . $i) => $entry[1], (':flowrate' . $i) => $entry[2], ('dutyCycle' . $i) => $entry[3], (':tempIn' . $i) => $entry[4], (':tempOut' . $i) => $entry[5], (':supply' . $i) => $entry[6], (':cell1' . $i) => $entry[7], (':cell2' . $i) => $entry[8], (':cell3' . $i) => $entry[9], (':cell4' . $i) => $entry[10], (':totalCurrent' . $i) => $entry[11], (':chlorineProduced' . $i) => $entry[12]];
			$queryValues = array_merge($queryValues, $entryValues);
		}
		$sth = database()->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		$sth->execute($queryValues);
	}
	

//CLASSES
	class cycle {
		public $entries;
		public $salinity;
		public $tempIn;
		public $tempOut;
		public $powerSupply;
		public $cell1;
		public $cell2;
		public $cell3;
		public $cell4;
		public $totalCurrent;
		public $dateTime;
		public $totalChlorineProduced;
		public $cycleStatus;
		
		// Expects an array for $startValues with a cycle's start values in the following order:
		// salinity(g/l), temp_in(C), temp_out(C), 12V Supply (V), CELL1 (A), CELL2(A), CELL3(A), CELL4(A), Total Current(A), DATE_TIME
		public function __construct($startValues) {
			$this->salinity = $startValues[0];
			$this->tempIn = $startValues[1];
			$this->tempOut = $startValues[2];
			$this->powerSupply = $startValues[3];
			$this->cell1 = $startValues[4];
			$this->cell2 = $startValues[5];
			$this->cell3 = $startValues[6];
			$this->cell4 = $startValues[7];
			$this->totalCurrent = $startValues[8];
			$this->dateTime = $startValues[9];
			$this->totalChlorineProduced = 0.0;
			$this->entries = array();
			$this->cycleStatus = '';

			// Check cycle values for errors/warnings
			updateCycleStatus($this->tempOut, $this->tempIn, null, $this->powerSupply);
		}

		// Expects an array for $entryValues with an entry's values in the following order:
		// time(sec), salinity(g/l), flowrate(ml/min), duty_cycle(%), temp_in(C), temp_out(C), 12V supply(V), CELL1 (A), CELL2(A), CELL3(A), CELL4(A), TOTAL CURRENT(A)
		// $producingCl is a boolean that indicates if the cycle has started pumping out chlorine
		public function addEntries($entryValues, $producingCl) {
			$updatedEntryValues = $entryValues;
			if ($producingCl) {
				// this entry's time minus previous entry's time, unless there is no previous entry
				if (count($this->entries) == 0) {
					$timeDifference = 0;
				} else {
					$timeDifference = $entryValues[0] - $this->entries[(count($this->entries) - 1)][0]; 	
				}

				$flowrate = $entryValues[2];
				// ml of chlorine produced during the $timeDifference measured in seconds
				$chlorineProduced = $flowrate * ($timeDifference / 60.0);
				$this->totalChlorineProduced += $chlorineProduced;
			} else {
				$chlorineProduced = 0.0;
			}
			$updatedEntryValues[] = $chlorineProduced;
			$this->entries[] = $updatedEntryValues;

			// Check entry values for errors/warnings
			updateCycleStatus($entryValues[5], $entryValues[4], $entryValues[2], $entryValues[6]);
		}

		// Updates this cycle's status. Errors will overwrite Warnings and any previous Errors.
		public function updateCycleStatus($tempOut, $tempIn, $flowrate, $powerSupply) {
			$result = '';
			
			// Warning Checks
			if (!is_null($powerSupply) && 10.5 < $powerSupply && $powerSupply <= 11.3) {
				$result = 'Low Battery';
			} elseif (!is_null($tempOut) && 50 <= $tempOut) {
				$result = 'Hot Output Temperature';
			}

			// Error checkcs
			if (!is_null($flowrate) && $flowrate < 40) {
				$result = 'Low Salt Concentration';
			} elseif (!is_null($flowrate) && $flowrate > 60) {
				$result = 'High Salt Concentration';
			} elseif (!is_null($tempIn) && $tempIn < 5) {
				$result = 'Low Input Temperature';
			} elseif (!is_null($tempIn) && $tempIn >= 35) {
				$result = 'High Input Temperature';
			} elseif (!is_null($tempOut) && 60 <= $tempOut) {
				$result = 'High Output Temperature';
			}

			// Update cycle status
			if(strcmp('', $result) === 0) {
				$this->status = $newStatus;
			}
		}


	}
?>