CREATE DEFINER=`appleTea`@`%` PROCEDURE `updateDeviceStatus`(updateSerialNum int)
BEGIN
	# Updates the deviceStatus of the device with the given serialNum

	DECLARE cycleDeviceID int;
    DECLARE mostRecentCycleID int;
    DECLARE cycleIsError BOOLEAN;
    DECLARE deviceStatus varchar(50);

    SET cycleDeviceID = (SELECT deviceID FROM DEVICE WHERE serialNum = updateSerialNum);
	SET mostRecentCycleID = (SELECT cycleID FROM CYCLE
                                WHERE deviceID = cycleDeviceID
                                ORDER BY startDateTime DESC 
                                LIMIT 1);
	SET cycleIsError = (SELECT cs.isError FROM CYCLE c 
						LEFT OUTER JOIN CYCLE_STATUS cs ON c.cycleStatusID = cs.cycleStatusID 
						WHERE c.cycleID = mostRecentCycleID);
    
    
	IF cycleIsError IS NOT NULL THEN 
		CASE 
			WHEN cycleIsError THEN SET deviceStatus = 'error';
			ELSE SET deviceStatus = 'warning';
		END CASE;
	ELSE
		CASE
			WHEN (31 < DATEDIFF(NOW(), (SELECT Max(startDateTime) FROM CYCLE WHERE cycleID = mostRecentCycleID))) THEN SET deviceStatus = 'inactive';
			ELSE SET deviceStatus = 'active';
		END CASE;
	END IF;

	UPDATE DEVICE d
		SET d.deviceStatusID = (SELECT statusID FROM DEVICE_STATUS WHERE statusName = deviceStatus) 
		WHERE d.deviceID = cycleDeviceID;
END