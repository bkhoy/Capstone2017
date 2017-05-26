use SEFlow_dashboard;

#getDeviceInfo.php
	#getDeviceDetails() - get device details for the device with the given serialNum        
        SELECT serialNum, statusName, useModeName, city, country, MAX(startDateTime) AS 'mostRecentCycle'
		FROM DEVICE d
		JOIN LOCATION l ON l.deviceID = d.deviceID
		JOIN USE_MODE u ON d.useModeID = u.useModeID
		JOIN DEVICE_STATUS ds ON d.deviceStatusID = ds.statusID
        LEFT OUTER JOIN CYCLE c ON c.deviceID = d.deviceID
		WHERE d.serialNum = '15347'
        GROUP BY d.deviceID;

#getUser.php
	#Get the detials about a user with the given email
		SELECT fname, lname, email, accountType, (SELECT organizationName FROM ORGANIZATION o WHERE u.organizationID = o.organizationID) AS 'organizationName'
			FROM USER u
			JOIN ACCOUNT_TYPE a ON a.accountTypeID = u.accountTypeID
			WHERE email = 'ssmith@gmail.com';

	#Get all devices assoicated with the user of the given email
		SELECT serialNum FROM USER u 
        JOIN USER_DEVICE um ON um.userID = u.userID 
        JOIN DEVICE d ON d.deviceID = um.deviceID 
        WHERE email = 'ssmith@gmail.com';

#getAllDevices.php
	#Get all devices from the database
	SELECT serialNum, statusName AS 'status', city, country, MAX(placementDate) AS 'placementDate', MAX(startDateTime) AS 'mostRecentCycle'
		FROM DEVICE d
		JOIN LOCATION l ON d.deviceID = l.deviceID
		LEFT OUTER JOIN CYCLE c ON c.deviceID = d.deviceID
		JOIN DEVICE_STATUS ds ON ds.statusID = d.deviceStatusID
		GROUP BY d.deviceID;

#getUserDevices.php
	#getAllDevicesForEmail() - get all devices owned by a user
		SELECT serialNum, city, country, longitude, latitude, Max(placementDate) as 'placementDate', photoFileName
			FROM DEVICE d
			JOIN USER_DEVICE ud ON ud.deviceID = d.deviceID
			JOIN USER u ON u.userID = ud.userID
			JOIN LOCATION l ON l.deviceID = d.deviceID
			WHERE email = 'ssmith@gmail.com'
			GROUP BY d.deviceID;

#functions.php
	#getRecentDeviceCycles() - get the 10 most recent cycles for a device
		SELECT c.startDateTime, MAX(seconds) AS 'runtime', totalChlorineProduced, 
			(SELECT statusName FROM CYCLE_STATUS cs WHERE cs.cycleStatusID = c.cycleStatusID) AS 'statusName', 
			(SELECT statusDesc FROM CYCLE_STATUS cs WHERE cs.cycleStatusID = c.cycleStatusID) AS 'statusDesc'
		FROM CYCLE c
		JOIN DEVICE d ON d.deviceID = c.deviceID
		JOIN ENTRY e ON c.cycleID = e.cycleID
		WHERE d.serialNum = 15340
		GROUP BY e.cycleID
		ORDER BY startDateTime DESC
		LIMIT 10;

#getDeviceLocations.php
	#Get all locations for each device in the database
	SELECT serialNum, city, country, longitude, latitude, MAX(placementDate) AS 'placementDate' FROM DEVICE d
		JOIN LOCATION l on d.deviceID = l.deviceID
		GROUP BY serialNum;
        
#getDeviceLog.php
	#getDeviceEntries
    SELECT c.cycleID,
		c.startSalinity, c.startTempIn, c.startTempOut, c.powerSupply AS 'startPowerSupply', c.startCell1, c.startCell2, c.startCell3, c.startCell4, c.totalCurrent AS 'startTotalCurrent', c.startDateTime,
        e.entryID, TIME_TO_SEC(e.seconds) AS 'seconds', e.salinity, e.flowrate, e.dutyCycle, e.tempIn, e.tempOut, e.powerSupply, e.cell1, e.cell2, e.cell3, e.cell4, e.totalCurrent
	FROM CYCLE c
	JOIN DEVICE	d ON d.deviceID = c.deviceID
    LEFT OUTER JOIN ENTRY e ON e.cycleID = c.cycleID
    WHERE d.serialNum = 16000
    ORDER BY c.startDateTime;
    
    #getDeviceEntriesByDate
    SELECT c.cycleID,
		c.startSalinity, c.startTempIn, c.startTempOut, c.powerSupply AS 'startPowerSupply', c.startCell1, c.startCell2, c.startCell3, c.startCell4, c.totalCurrent AS 'startTotalCurrent', c.startDateTime,
        e.entryID, TIME_TO_SEC(e.seconds) AS 'seconds', e.salinity, e.flowrate, e.dutyCycle, e.tempIn, e.tempOut, e.powerSupply, e.cell1, e.cell2, e.cell3, e.cell4, e.totalCurrent
	FROM CYCLE c
	JOIN DEVICE	d ON d.deviceID = c.deviceID
    LEFT OUTER JOIN ENTRY e ON e.cycleID = c.cycleID
    WHERE d.serialNum = 16000
    AND c.startDateTime BETWEEN '2017-01-01' AND '2017-01-09'
    ORDER BY c.startDateTime;