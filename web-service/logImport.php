<?php
	ini_set('max_execution_time', 300);

	// Imports global functions
	require('functions.php');
	authenticate();

	// Get the name of the log file
	if(!isset($_GET['logfile'])) {
		die('Must pass a file name');
	}
	$logfile = $_GET['logfile'];
		
	// Parse the log file into the cycles and then submit each cycle
	$serialNum = substr($logfile, 8, 5);
	if (($logdata = fopen($logfile, "r")) !== FALSE) {		
		$cycle = null;
	    while (($line = fgetcsv($logdata, 1000, ",")) !== FALSE) {
	        if (strcmp(trim($line[0]), "salinity(g/l)") === 0) { // cycle start line
	        	$cycle = new cycle(fgetcsv($logdata, 1000, ","));
	        } else if (strcmp(trim($line[0]), "time(sec)") === 0) {
	        	//skip the title line for the entries section
	        } else if (count($line) === 10) { // data line
	        	$cycle->entries[] = implode(', ', $line);
	        	//array_push($cycle->entries, implode(', ', $line));
	        } else { // first 3 letters are 'NUL' or empty line either indicates the end of a cycle (all other cases)
	        	if ($cycle !== null) {
	        		sumbitCycle($cycle, $serialNum);
	        	}      		
        		//reset temps
        		$cycle = null;
			}
	    }

	    // in case end of file does not have an empty line at the end of the file, appends the last cycle.
	    if ($cycle !== null) {
    		sumbitCycle($cycle, $serialNum);
    	} 
	    fclose($logdata);
	}

//FUNCTIONS
	// Takes a Cycle object and inserts its contents into the database
	function sumbitCycle($cycle, $serialNum) {
//check to see if the cycle exists or not
		//insert the cycle into the database and gets the cycleID from the database
		$query = "CALL addCycle((SELECT deviceID FROM DEVICE WHERE DEVICE.serialNum = :serialNum), :salinity, :tempIn, :cell1, :cell2, :cell3, :totalCurrent, :startDateTime, @output); SELECT @ouptut;";
		$sth = database()->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		$sth->execute(array(':serialNum' => $serialNum, ':salinity' => $cycle->salinity, ':tempIn' => $cycle->tempIn, ':cell1' => $cycle->cell1, ':cell2' => $cycle->cell2, ':cell3' => $cycle->cell3, ':totalCurrent' => $cycle->totalCurrent, ':startDateTime' => $cycle->dateTime));
		$cycleID = $sth->fetch()[0];

		// insert the cycle's entries into the database in batches of 1000
		$entryBatch = array();
		foreach ($cycle->entries as $entry) {
			if(count($entryBatch) > 1000) {
				submitEntries($entryBatch, $cycleID);
				$entryBatch = array();
			}
			$entryBatch[] = $entry;
			//array_push($entryBatch, $entry);
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
			$entry = str_getcsv($entries[$i]);
			$query .= "INSERT INTO ENTRY (cycleID, seconds, salinity, flowrate, tempIN, tempOut, supply, cell1, cell2, cell3, cell4) VALUES
						((SELECT cycleID FROM CYCLE WHERE cycleID = :cycleID), :seconds" . $i . ", :salinity" . $i . ", :flowrate" . $i . ", :tempIn" . $i . ", :tempOut" . $i . ", :supply" . $i . ", :cell1" . $i . ", :cell2" . $i . ", :cell3" . $i . ", :cell4" . $i . ");";
			$entryValues = [(':seconds' . $i) => $entry[0], (':salinity' . $i) => $entry[1], (':flowrate' . $i) => $entry[2], (':tempIn' . $i) => $entry[3], (':tempOut' . $i) => $entry[4], (':supply' . $i) => $entry[5], (':cell1' . $i) => $entry[6], (':cell2' . $i) => $entry[7], (':cell3' . $i) => $entry[8], (':cell4' . $i) => $entry[9]];
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