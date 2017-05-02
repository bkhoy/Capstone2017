<?php
	// Global functions used accross multiple php.

//FUNCTIONS
	// Creates and returns a new PDO object connected to the SEFlow_dashboard database
	function database() {
		$db = new PDO("mysql:dbname=SEFlow_dashboard;host=seflowdb.cgp29ssuqlax.us-west-2.rds.amazonaws.com;port=3306;charset=utf8", "dashboard", "MouS@17Rese_tain");
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		return $db;
	}
?>