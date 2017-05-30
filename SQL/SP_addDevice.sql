CREATE DEFINER=`appleTea`@`%` PROCEDURE `addDevice`(newSerialNum int, newPhotoFileName varchar(50), newCity varchar(50), newCountry varchar(50), newLatitude float, newLongitude float, newPlacementDate DATE, OUT deviceID INTEGER)
BEGIN
	# Adds a device with the given values to the database
	# Returns the new deviceID of the new device or -1 if device is already in the database
	
    DECLARE numDeviceMatches int;
    DECLARE newDeviceID int;
	SET numDeviceMatches = (SELECT COUNT(d.deviceID) FROM DEVICE d WHERE d.serialNum = newSerialNum);
    
    #Insert into database if the cycle does not already exist
     CASE 
		WHEN numDeviceMatches = 0 THEN 
			BEGIN               
                INSERT INTO DEVICE (useModeID, deviceStatusID, serialNum, photoFileName) VALUES
					((SELECT useModeID FROM USE_MODE WHERE useModeName = 'IPC'),
					(SELECT statusID FROM DEVICE_STATUS WHERE statusName = 'Unknown'),
					newSerialNum, newPhotoFileName);
				
                SET newDeviceID = (SELECT LAST_INSERT_ID());
				SELECT newDeviceID;
                
				INSERT INTO LOCATION (deviceID, placementDate, city, country, latitude, longitude) VALUES
					(newDeviceID, newPlacementDate, newCity, newCountry, newLatitude, newLongitude);
			END;
		ELSE SELECT -1;
	END CASE;    
END