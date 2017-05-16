CREATE DEFINER=`appleTea`@`%` PROCEDURE `addCycle`(newDevice int, newDateTime datetime, newSalinity int, newTempIn int, newTempOut int, newPowerSupply float, newCell1 float, newCell2 float,
	newCell3 float, newCell4 float, newTotalCurrent float, newChlorineProduced float, OUT cycleID INTEGER)
BEGIN
	# Adds a Cycle with the given values to the database
	# Returns the cycleID of that cycle
	
	INSERT INTO CYCLE (deviceID, startDateTime, startSalinity, startTempIn, startTempOut, powerSupply, startCell1, startCell2, startCell3, startCell4, totalCurrent, totalChlorineProduced)
	VALUES (newDevice, newDateTime, newSalinity, newTempIn, newTempOut, newPowerSupply, newCell1, newCell2, newCell3, newCell4, newTotalCurrent, newChlorineProduced);
	SET cycleID = (SELECT LAST_INSERT_ID());
    SELECT cycleID;
END