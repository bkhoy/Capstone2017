CREATE DEFINER=`appleTea`@`%` PROCEDURE `addCycle`(serialNum int, newDateTime DATETIME, newSalinity int, newTempIn int, newTempOut int, newPowerSupply float, newCell1 float, newCell2 float,
	newCell3 float, newCell4 float, newTotalCurrent float, newChlorineProduced float, cycleStatus varchar(50), OUT cycleID INTEGER)
BEGIN
	# Adds a Cycle with the given values to the database and updates deviceStatus
	# Returns the cycleID of that cycle, -1 if cycle was not added to the database, or -2 if the serialNum passed is not valid
	
    DECLARE numCycleMatches int;
    DECLARE cycleDeviceID int;
    SET cycleDeviceID = (SELECT d.deviceID FROM DEVICE d WHERE d.serialNum = serialNum);
    IF cycleDeviceID IS NULL THEN
    	SET numCycleMatches = (SELECT COUNT(c.cycleID) FROM CYCLE c WHERE c.deviceID = cycleDeviceID AND newDateTime = c.startDateTime);
	ELSE SELECT -2;
    END IF;
    
    #Insert into database if the cycle does not already exist
     CASE 
		WHEN numCycleMatches = 0 THEN 
			BEGIN   
				INSERT INTO CYCLE (deviceID, startDateTime, startSalinity, startTempIn, startTempOut, powerSupply, startCell1, startCell2, startCell3, startCell4, totalCurrent, totalChlorineProduced, cycleStatusID)
				VALUES (cycleDeviceID, newDateTime, newSalinity, newTempIn, newTempOut, newPowerSupply, newCell1, newCell2, newCell3, newCell4, newTotalCurrent, newChlorineProduced, (SELECT cycleStatusID FROM CYCLE_STATUS WHERE statusName = cycleStatus));
				SET cycleID = (SELECT LAST_INSERT_ID());
				SELECT cycleID;
				CALL updateDeviceStatus(serialNum);
			END;
		ELSE SELECT -1;
	END CASE;    
END