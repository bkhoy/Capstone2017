<?php

	// Imports global functions
	require('functions.php');
	
	// Get and parse the file
	if(!isset($_GET['logfile'])) {
		die('Must pass a file name');
	}
	$logfile = $_GET['logfile'];
	
	// Parse the log file into the array $cycles, which is an array of cycle objects
	$serialNum = substr($logfile, 8, 5);
	echo $serialNum . ' serialNum <br/>';

	$cycles = array();
	if (($logdata = fopen($logfile, "r")) !== FALSE) {		
		$cycle = null;
	    while (($line = fgetcsv($logdata, 1000, ",")) !== FALSE) {
	        if (strcmp(trim($line[0]), "salinity(g/l)") === 0) { // cycle start line
	        	$cycle = new cycle(fgetcsv($logdata, 1000, ","));
	        } else if (strcmp(trim($line[0]), "time(sec)") === 0) {
	        	//skip this line
	        } else if (count($line) === 10) { // data line
	        	array_push($cycle->entries, implode(', ', $line));
	        } else { // first 3 letters are 'NUL' or empty line either indicates the end of a cycle (all other cases)
	        	if ($cycle !== null) {
	        		array_push($cycles, $cycle);
	        	}      		
        		//reset temps
        		$cycle = null;
			}
	    }

	    // in case end of file does not have an empty line at the end of the file, submits the last cycle.
	    if ($cycle !== null) {
    		array_push($cycles, $cycle);
    	} 
	    fclose($logdata);
	}
	echo('total cycles: ' . count($cycles) . '<br />');
	//echo var_dump($cycles);

	//add the parsed cycles to the database
	submitLogCycles($cycles, $serialNum);


//FUNCTIONS
	// Takes an array of Cycle objects and adds them to the database.
	function submitLogCycles($cycleSet, $serialNum) {
//check to see what the newest cycle from the database is...
		foreach ($cycleSet as $cycle) {
			//if date is newer than newest cycle from database??
			sumbitCycle($cycle, $serialNum);
		}
	}

	// Takes a Cycle object and inserts its contents into the database
	function sumbitCycle($cycle, $serialNum) {
		// insert the cycle into the database and get the cycleID from the database
		$query = "INSERT INTO CYCLE (deviceID, startSalinity, startTempIn, startCell1, startCell2, startCell3, totalCurrent, startDateTime) VALUES
					((SELECT deviceID FROM DEVICE WHERE DEVICE.serialNum = :serialNum), :salinity, :tempIn, :cell1, :cell2, :cell3, :totalCurrent, :startDateTime);
					SELECT LAST_INSERT_ID();";
		$sth = database()->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		$sth->execute(array(':serialNum' => $serialNum, ':salinity' => $cycle->salinity, ':tempIn' => $cycle->tempIn, ':cell1' => $cycle->cell1, ':cell2' => $cycle->cell2, ':cell3' => $cycle->cell3, ':totalCurrent' => $cycle->totalCurrent, ':startDateTime' => $cycle->dateTime));
		$cycleID = $sth->fetch();

		echo $cycleID . ' cycleID<br />';

		// insert the cycle's entries into the database in batches of 100
		$entryBatch = array();
		foreach ($cycle->entries as $entry) {
			if(count($entryBatch) > 100) {
				submitEntries($entryBatch, $cycleID);
				$entryBatch = array();
			}
			array_push($entryBatch, $result);
		}
		// inserts any remaining entries into the database
		if (count($entryBatch) !== 0) {
			submitEntries($entryBatch, $cycleID);
		}
	}

	// Takes an array of integer array, with each array representing a single entry and submits each element of the array into the database with the given cycleID.
	// Expects each element of the $entries array to be all ints and in the following order: seconds, salinity, flowrate, temp_in, temp_out, 12V supply, CELL1, CELL2, CELL3, CELL4
	function submitEntries($entries, $cycleID) {
		$count = count($entries);
		$query = "";
		$queryValues = [':cycleID' => $cycleID];
		
		// loops through each element in the $entires array and adds a insert query for that element to $query. Then adds that elements values to the $queryValues array with the corresponding variable names.
		for ($i=0; $i < $count; $i++) { 
			$query .= "INSERT INTO ENTRY (cycleID, seconds, salinity, flowrate, tempIN, tempOut, supply, cell1, cell2, cell3, cell4) VALUES
						((SELECT cycleID FROM CYCLE WHERE cycleID = :cycleID), :seconds" . $i . ", :salinity" . $i . ", :flowrate" . $i . ", tempIn" . $i . ", tempOut" . $i . ", :supply" . $i . ", :cell1" . $i . ", :cell2" . $i . ", :cell3" . $i . ", :cell4" . $i . ");";
			$entryValues = [(':seconds' . $i) => $entries[$i][0], (':salinity' . $i) => $entries[$i][1], (':flowrate' . $i) => $entries[$i][2], (':tempIn' . $i) => $entries[$i][3], (':tempOut' . $i) => $entries[$i][4], (':supply' . $i) => $entries[$i][5], (':cell1' . $i) => $entries[$i][6], (':cell2' . $i) => $entries[$i][7], (':cell3' . $i) => $entries[$i][8], (':cell4' . $i) => $entries[$i][9]];
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
		public $cell1;
		public $cell2;
		public $cell3;
		public $totalCurrent;
		public $dateTime;

		// expects an array of starting values and an array of entries
		function setValues($startValues, $entries) {
			$this->salinity = $startValues[0];
			$this->tempIn = $startValues[1];
			$this->cell1 = $startValues[2];
			$this->cell2 = $startValues[3];
			$this->cell3 = $startValues[4];
			$this->totalCurrent = $startValues[5];
			$this->dateTime = $startValues[6];
			$this->entries = $entries;
// NEED TO check cycle values for errors
		}

		public function __construct() {
			$argv = func_get_args();
		    switch(func_num_args()) {
		        case 1:
		            $this->setValues($argv[0], array());
		            //echo 'constructor1: ' . var_dump($argv[0]) . '<br />';
		            //self::__construct1($argv[0]);
		            break;
		        case 2:
		        	$this->setValues($argv[0], $argv[1]);
		        	echo 'constructor2: THIS WAS USED!!! <br />';
		            //self::__construct2($argv[0], $argv[1]);
		     }
		}
		
	}
?>