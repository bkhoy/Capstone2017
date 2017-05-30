<?php
	// is there a way to set this based on how many lines are in the given file?
	ini_set('max_execution_time', 50000);

	// Imports global functions
	require('functions.php');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Log Import</title>

    <!-- Bootstrap -->
    <link href="../css/bootstrap.min.css" rel="stylesheet">
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" href="../css/details.css"/>
</head>
<body>
    <nav>
        <ul>
            <li class="left_links">
                <a href="../addDeviceLog.html">
                    <svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                </a>
            </li>
            <li class="right_links"><a href="#" data-toggle="modal" data-target="#myModal">Account</a></li>
            <li class="right_links"><a href="..\addDeviceLog.html">Add Device/Log</a></li>
        </ul>
    </nav>

    <!-- Modal -->
    <div class="modal fade" id="myModal" role="dialog">
        <div class="modal-dialog">

            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h2 class="modal-title">My Account</h2>
                </div>
                <div class="modal-body">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>

        </div>
    </div>

    <div id="main" class="container">
    	<div class="box row">
	    	<?php echo(importLogFile()); ?>
		</div>
	</div>
</body>
</html>

<?php
//FUNCTIONS
	// Imports the uploaded log file. Returns a string with completion or error messages.
	function importLogFile() {
		// check that a logFile and a serialNum were passed
		if (!isset($_FILES['logFile'])) {
			return 'Must pass a logFile for import.';
		}
		if (!isset($_POST['serialNum'])) {
			return 'Must pass a device serialNum.';
		}
		
		// set the serialNum
		$serialNum = trim($_POST['serialNum']);
		
		// open the uploaded file from the temporary directory
		$logFilePath = $_FILES["logFile"]["tmp_name"];
		$logdata = fopen($logFilePath, "r");

		// Parse the log file into the cycles, calculate the chlorine produced, and submit each cycle to the database		
		$producingCl = FALSE;
		$cycle = null;
		$numCyclesAdded = 0;
	    while (($line = fgetcsv($logdata, 1000, ",")) !== FALSE) {
	        if (strcmp(trim($line[0]), "salinity(g/l)") === 0) { // cycle title line
	        	// submit previous cycle 
	        	if ($cycle !== null) {
		    		$numCyclesAdded += sumbitCycle($cycle, $serialNum);
		    	}
		    	// start new cycle
	        	$cycle = new cycle(fgetcsv($logdata, 1000, ","));
	        } else if (count($line) === 12  && strcmp(trim($line[0]), "time(sec)") !== 0) { // data line
		    	$entryValues = $line;
		    	// If cell 4 is reading a value greater than 0 then chlorine has started to be pumped out of the device since the previous entry. Only then should chlorine production be calculated.
		    	$cell4 = $entryValues[10];
		    	$producingCl = $cell4 != 0;
		    	$cycle->addEntries($entryValues, $producingCl);	
		    }
			// skip the entries title lines and blank lines
	    }

	    // submits the last cycle in the file
	    if ($cycle !== null) {
			$numCyclesAdded += sumbitCycle($cycle, $serialNum);
		} 
	    fclose($logdata);

	    return $numCyclesAdded . ' new cycles were successfully added to the database.';
	}
	
	// Takes a Cycle object and inserts its contents into the database. Returns 1 if the cycle was successfully added to the database and 0 if it was not added.
	function sumbitCycle($cycle, $serialNum) {
		try {
			//insert the cycle into the database and gets the cycleID from the database
			$query = "CALL addCycle(:serialNum, :startDateTime, :salinity, :tempIn, :tempOut, :powerSupply, :cell1, :cell2, :cell3, :cell4, :totalCurrent, :chlorineProduced, :cycleStatus, @output); SELECT @ouptut;";
			$sth = database()->prepare($query, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
			$sth->execute(array(':serialNum' => $serialNum, ':startDateTime' => $cycle->dateTime,
								':salinity' => $cycle->salinity, ':tempIn' => $cycle->tempIn, 
								':tempOut' => $cycle->tempOut, ':powerSupply' => $cycle->powerSupply, 
								':cell1' => $cycle->cell1, ':cell2' => $cycle->cell2, 
								':cell3' => $cycle->cell3, 'cell4' => $cycle->cell4, 
								':totalCurrent' => $cycle->totalCurrent, ':chlorineProduced' => $cycle->totalChlorineProduced,
								':cycleStatus' => $cycle->cycleStatus));
			$cycleID = $sth->fetch()[0];
			
			//if $cycleID = -1 then cycle already exists in the database
			if($cycleID > -1) {
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
				return 1;
			}
		} catch (Exception $e) {
			//errorMessage($e->getMessage());
			echo("Importing this log encountered an error. Please check that a device with the serial number " . $serialNum . " exists and that your log file is properly formatted. <br />");
		}
		return 0;	
	}

	// Takes an array of strings, with each string recording a single entry and submits each value in the string seperated by commas into the database with the given cycleID.
	// Expects each string to be have values in the following order: seconds, salinity, flowrate, temp_in, temp_out, 12V supply, CELL1, CELL2, CELL3, CELL4
	function submitEntries($entries, $cycleID) {
		try {
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
		} catch (Exception $e) {
			//errorMessage($e->getMessage());
			echo("Importing this log encountered an error. Please check that your log file is properly formatted. <br />");
		}
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
			$this->updateCycleStatus($this->tempOut, $this->tempIn, null, $this->powerSupply);
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
				// L of chlorine produced during the $timeDifference measured in seconds
				$chlorineProduced = ($flowrate * ($timeDifference / 60.0)) / 1000;
				$this->totalChlorineProduced += $chlorineProduced;
			} else {
				$chlorineProduced = 0.0;
			}
			$updatedEntryValues[] = $chlorineProduced;
			$this->entries[] = $updatedEntryValues;

			// Check entry values for errors/warnings
			$this->updateCycleStatus($entryValues[5], $entryValues[4], $entryValues[2], $entryValues[6]);
		}

		// Updates this cycle's status. Errors will overwrite Warnings and any previous Errors.
		public function updateCycleStatus($tempOut, $tempIn, $flowrate, $powerSupply) {
			$result = '';
			
			// Warning Checks
			if (!is_null($powerSupply) && 10.5 < $powerSupply && $powerSupply <= 11.3) {
				$result = 'Warning: Low Battery';
			} elseif (!is_null($tempOut) && 50 <= $tempOut) {
				$result = 'Warning: Hot Output Temperature';
			}

			// Error checkcs
			if (!is_null($flowrate) && $flowrate < 40) {
				$result = 'Error: Low Salt Concentration';
			} elseif (!is_null($flowrate) && $flowrate > 60) {
				$result = 'Error: High Salt Concentration';
			} elseif (!is_null($tempIn) && $tempIn < 5) {
				$result = 'Error: Low Input Temperature';
			} elseif (!is_null($tempIn) && $tempIn >= 35) {
				$result = 'Error: High Input Temperature';
			} elseif (!is_null($tempOut) && 60 <= $tempOut) {
				$result = 'Error: High Output Temperature';
			}

			// Update cycle status
			$this->cycleStatus = $result;
		}


	}
?>