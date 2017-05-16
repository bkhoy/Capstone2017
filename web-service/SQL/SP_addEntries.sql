CREATE DEFINER=`appleTea`@`%` PROCEDURE `addEntries`(newCycleID int, newSeconds int, newSalinity int, newFlowrate int, newDutyCycle int, newTempIn int, newTempOut int,
	newPowerSupply float, newCell1 float, newCell2 float, newCell3 float, newCell4 float, newTotalCurrent float, newChlorineProduced float)
BEGIN
	#Inserts an entry into the database with the given values
    INSERT INTO ENTRY (cycleID, seconds, salinity, flowrate, dutyCycle, tempIN, tempOut, powerSupply, cell1, cell2, cell3, cell4, totalCurrent, chlorineProduced) 
    VALUES (newCycleID, SEC_TO_TIME(newSeconds), newSalinity, newFlowrate, newDutyCycle, newTempIn, newTempOut, newPowerSupply, newCell1, newCell2, newCell3, newCell4, newTotalCurrent, newChlorineProduced);
END