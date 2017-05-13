use SEFlow_dashboard;

#Get the detials about a user with the given email
SELECT fname, lname, email, accountType, (SELECT organizationName FROM ORGANIZATION o WHERE u.organizationID = o.organizationID) AS 'organizationName' FROM USER u
	JOIN ACCOUNT_TYPE a ON a.accountTypeID = u.accountTypeID
	WHERE email = 'ssmith@gmail.com';

#Get all devices assoicated with a user
SELECT serialNum FROM USER u
	JOIN USER_DEVICE um ON um.userID = u.userID
    JOIN DEVICE d ON d.deviceID = um.deviceID
    WHERE email = 'ssmith@gmail.com';

#Get a devices details for a device with the given serialNum
SELECT serialNum, statusName, useModeName, city, country, (SELECT startDateTime FROM CYCLE c WHERE c.cycleID = d.mostRecentCycle) AS 'mostRecentCycle' FROM DEVICE d
    JOIN LOCATION l ON l.deviceID = d.deviceID
    JOIN USE_MODE u ON d.useModeID = u.useModeID
    JOIN DEVICE_STATUS ds ON d.deviceStatusID = ds.statusID
    WHERE d.serialNum = '15347';

#Get all of the users assoicated with a device
SELECT email, accountType FROM DEVICE d
    JOIN USER_DEVICE ud ON d.deviceID = ud.deviceID
    JOIN USER u ON u.userID = ud.userID
    JOIN ACCOUNT_TYPE a ON a.accountTypeID = u.accountTypeID
    WHERE serialNum = '15340';

#Get the 10 most recent cycles for a device
SELECT startDateTime, startTempIn, startCell1, startCell2, startCell3, totalCurrent, errorID FROM CYCLE c
	JOIN DEVICE d ON d.deviceID = c.deviceID
    WHERE d.serialNum = 15348
    ORDER BY startDateTime DESC
    LIMIT 10;

#Get all locations for each device in the database
SELECT serialNum, city, country, longitude, latitude, MAX(placementDate) AS 'placementDate' FROM DEVICE d
	JOIN LOCATION l on d.deviceID = l.deviceID
    GROUP BY serialNum;

#Get all devices from the database
SELECT serialNum, statusName AS 'status', city, country, placementDate AS 'deploymentDate', (SELECT startDateTime FROM CYCLE c WHERE c.cycleID = d.mostRecentCycle) AS 'mostRecentCycle' FROM DEVICE d
	JOIN LOCATION l ON d.deviceID = l.deviceID
    JOIN DEVICE_STATUS ds ON ds.statusID = d.deviceStatusID;

# get all devices owned by a user
SELECT serialNum FROM DEVICE d
    JOIN USER_DEVICE ud ON ud.deviceID = d.deviceID
    JOIN USER u ON u.userID = ud.userID
    WHERE email = 'ssmith@gmail.com';

# get 10 most recent cycles for a serialNum
SELECT startDateTime, totalChlorineProduced FROM CYCLE c
	JOIN DEVICE d ON d.deviceID = c.deviceID
    WHERE serialNum = 15342
    ORDER BY startDateTime DESC
    LIMIT 10;


/*
#Get the datetime of the most recent cycle for a device
SELECT MAX(startDateTime) FROM CYCLE c
    JOIN DEVICE d ON d.deviceID = c.deviceID
    WHERE d.serialNum = '15340' AND
    startDateTime IS NOT NULL;
    
SELECT serialNum, city, country, placementDate, Max(startDateTime) FROM DEVICE d
	JOIN LOCATION l ON d.deviceaddCycleaddCycleID = l.deviceID
    JOIN CYCLE c ON c.deviceID = d.deviceID
    WHERE c.startDateTime IS NOT NULL
    GROUP BY d.deviceID;
    #ORDER BY c.startDateTime DESC;
    
SELECT Count(cycleID) FROM DEVICE d
	JOIN CYCLE c ON c.deviceID = d.deviceID
    GROUP BY d.deviceID;
    

SELECT serialNum, city, country, placementDate, startDateTime FROM DEVICE d
	JOIN LOCATION l ON d.deviceID = l.deviceID
    JOIN CYCLE c ON c.deviceID = d.deviceID
    GROUP BY d.deviceID;    
*/