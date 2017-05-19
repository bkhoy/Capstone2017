<?php
	// Takes in a file name and converts it to the log format, filling all new values in with defaults
	
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

	// Set defaults: 
	$tempOut = 0;
	$dutyCycle = 0;
	$powerSupply = 11.5;
	$cell4 = 0.0;
	$totalCurrent = 0.0;
	
	// Parse the log file and write each corrected line to the output string
	$newFile = "";
    while (($line = fgetcsv($logdata, 1000, ",")) !== FALSE) {
        if (strcmp(trim($line[0]), "salinity(g/l)") === 0) { // cycle title line
        	$newFile .= "salinity(g/l), temp_in(C), temp_out(C), 12V Supply (V), CELL1 (A), CELL2(A), CELL3(A), CELL4(A), Total Current(A), DATE_TIME\n";
			$cycleLine = fgetcsv($logdata, 1000, ",");
			$newFile .= $cycleLine[0] . ', ' .
						$cycleLine[1] . ', ' . 
						$tempOut . ', ' . 
						$powerSupply . ', ' . 
						$cycleLine[2] . ', ' .
						$cycleLine[3] . ', ' .
						$cycleLine[4] . ', ' .
						$cell4 . ', ' .
						$cycleLine[5] . ', ' .
						$cycleLine[6] . "\n";
        } else if (strcmp(trim($line[0]), "time(sec)") === 0) { //entry title line
			$newFile .= " time(sec), salinity(g/l), flowrate(ml/min), duty_cycle(%), temp_in(C), temp_out(C), 12V supply(V), CELL1 (A), CELL2(A), CELL3(A), CELL4(A), TOTAL CURRENT(A)\n";
		} else if (count($line) === 10) { // data line
			$newFile .= $line[0] . ', ' .
						$line[1] . ', ' .
						$line[2] . ', ' . 
						$dutyCycle . ', ' .
						$line[3] . ', ' .
						$line[4] . ', ' .
						$line[5] . ', ' .
						$line[6] . ', ' .
						$line[7] . ', ' .
						$line[8] . ', ' .
						$line[9] . ', ' . 
						$totalCurrent . "\n";
	    } else {
	    	$newFile .= implode(',', $line) . "\n";	
	    }		
    }
	fclose($logdata);
	
	// Create the new file with the corrected values
	$newFileName = substr($logfile, 0, -4) . '.csv';
	file_put_contents($newFileName, $newFile);
	echo('Log file has been converted. The new file name is: ' . $newFileName);
?>