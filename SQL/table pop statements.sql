USE SEFlow_dashboard;
#Look up tables
INSERT INTO ACCOUNT_TYPE (accountType, accountTypeDesc) VALUES
	('donor', 'This user contributed to a SE-Flow device and can see information about the device they donate.'),
	('admin', 'This user can view detailed information about all devices.');

INSERT INTO ORGANIZATION (organizationName) VALUES
	('World Vision'),
    ('PATH'),
    ('MSR GLOBAL HEALTH');
            
INSERT INTO USE_MODE (useModeName, useModeDesc) VALUES
	('IPC', 'This device is used primarily for Infection Prevention and Control situations, likely at a clinic'),
	('Water Purfication', 'This device is used primarily for water purfication');
    
INSERT INTO DEVICE_STATUS (statusName, statusDesc) VALUES
    ('Active', 'This device is functioning normally.'),
    ('Inactive', 'This device has not reported a cycle within the last month.'),
    ('Unknown', 'This device has not reported any cycles.'),
    ('Warning', 'This device\'s most recent cycle had a warning during the cycle.'),
    ('Error', 'This device\'s most recent cycle ended with in an error.');

INSERT INTO CYCLE_STATUS (statusName, isError, statusDesc) VALUES
	('Warning: Hot Output Temperature', FALSE, 'The output temperature is above 50C! Device will shut off if output exceeds 60C.'),
    ('Warning: Low Battery', FALSE, 'Power input is low please charge battery or check power supply. Device will shut down if voltage drops too low.'),
    ('Error: High Input Temperature', TRUE, 'The input brine solution is too hot to use! A cooler brine solution is needed.'),
    ('Error: Low Input Temperature', TRUE, 'The input brine solution is too cold to use! A warmer brine solution is needed.'),
    ('Error: High Output Temperature', TRUE, 'Output temperature is too hot! Use a cooler input brine solution or decrease the salt concentration of the input brine solution.'),
    ('Error: Low Salt Concentration', TRUE, 'The salt concentration of the input brine solution is too low! Add more salt to input brine solution.'),
    ('Error: High Salt Concentration', TRUE, 'The salt concentration of the input brine solution is too high! Decrease the salt concentration of the input brine solution.');
            
#Test Data
INSERT INTO DEVICE (useModeID, deviceStatusID, serialNum, photoFileName) VALUES
	((SELECT useModeID FROM USE_MODE WHERE useModeName = 'IPC'), (SELECT statusID FROM DEVICE_STATUS WHERE statusName = 'Unknown'), '15348', 'device1.jpg'),
	((SELECT useModeID FROM USE_MODE WHERE useModeName = 'IPC'), (SELECT statusID FROM DEVICE_STATUS WHERE statusName = 'Unknown'), '15345', 'device2.jpg'),
	((SELECT useModeID FROM USE_MODE WHERE useModeName = 'IPC'), (SELECT statusID FROM DEVICE_STATUS WHERE statusName = 'Unknown'), '15344', 'device3.jpg'),
	((SELECT useModeID FROM USE_MODE WHERE useModeName = 'IPC'), (SELECT statusID FROM DEVICE_STATUS WHERE statusName = 'Unknown'), '15342', 'device4.jpg'),
	((SELECT useModeID FROM USE_MODE WHERE useModeName = 'IPC'), (SELECT statusID FROM DEVICE_STATUS WHERE statusName = 'Unknown'), '15347', 'device5.jpg'),
	((SELECT useModeID FROM USE_MODE WHERE useModeName = 'IPC'), (SELECT statusID FROM DEVICE_STATUS WHERE statusName = 'Unknown'), '15340', 'device2.jpg');
    
INSERT INTO LOCATION (deviceID, placementDate, city, country, latitude, longitude) VALUES
	((SELECT deviceID FROM DEVICE WHERE serialNum = 15348), '2017-04-03', 'Nairobi', 'Kenya', -1.2920659, 36.8219462),
    ((SELECT deviceID FROM DEVICE WHERE serialNum = 15345), '2017-04-03', 'Mombasa', 'Kenya', -4.0434771, 39.6682065),
    ((SELECT deviceID FROM DEVICE WHERE serialNum = 15345), '2017-01-03', 'Nairobi', 'Kenya', -1.2920659, 36.8219462),
    ((SELECT deviceID FROM DEVICE WHERE serialNum = 15344), '2017-04-03', 'Wote', 'Kenya', -1.788625, 37.63333960000001),
    ((SELECT deviceID FROM DEVICE WHERE serialNum = 15344), '2017-01-03', 'Nairobi', 'Kenya', -1.2920659, 36.8219462),
    ((SELECT deviceID FROM DEVICE WHERE serialNum = 15342), '2017-04-03', 'Dadaab', 'Kenya', 0.09257979999999999, 40.3190719),
    ((SELECT deviceID FROM DEVICE WHERE serialNum = 15347), '2017-04-03', 'Port-au-Prince', 'Haiti', 19.3039935, -72.0379277),
    ((SELECT deviceID FROM DEVICE WHERE serialNum = 15340), '2017-04-03', 'Cercadie', 'Haiti', 18.594395, -72.3074326);

INSERT INTO USER (accountTypeID, organizationID, fName, lName, email) VALUES
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'admin'), (SELECT organizationID FROM ORGANIZATION WHERE organizationName = 'MSR Global Health'), 'Jake', 'Wheeler', 'admin@msr.com'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), (SELECT organizationID FROM ORGANIZATION WHERE organizationName = 'World Vision'), 'Sarah', 'Smith', 'ssmith@gmail.com'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), (SELECT organizationID FROM ORGANIZATION WHERE organizationName = 'PATH'),'Imelda', 'Hayes', 'erat@commodo.co.uk'), 
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), (SELECT organizationID FROM ORGANIZATION WHERE organizationName = 'PATH'), 'Veronica', 'Alford', 'tempus.lacinia@mattisInteger.ca'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), (SELECT organizationID FROM ORGANIZATION WHERE organizationName = 'PATH'),'Tyler', 'Erickson', 'amet.ante@dolor.org'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), (SELECT organizationID FROM ORGANIZATION WHERE organizationName = 'World Vision'), 'Bert', 'Calderon', 'tincidunt.aliquam@Fusce.com'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), (SELECT organizationID FROM ORGANIZATION WHERE organizationName = 'World Vision'), 'Ori', 'Garner', 'dignissim.tempor@enimnislelementum.org'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), (SELECT organizationID FROM ORGANIZATION WHERE organizationName = 'World Vision'), 'Fuller', 'Levy', 'dui.Fusce@Sedegetlacus.net'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), (SELECT organizationID FROM ORGANIZATION WHERE organizationName = 'World Vision'), 'Renee', 'David', 'quam@tortor.com'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), (SELECT organizationID FROM ORGANIZATION WHERE organizationName = 'World Vision'), 'Nasim', 'Cline', 'gravida.non@ornare.org'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), (SELECT organizationID FROM ORGANIZATION WHERE organizationName = 'World Vision'), 'Leonard', 'Fields', 'orci@arcuVestibulum.edu'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), (SELECT organizationID FROM ORGANIZATION WHERE organizationName = 'World Vision'), 'Lewis', 'Berg', 'at@sem.co.uk');

INSERT INTO USER (accountTypeID, fName, lName, email) VALUES
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Sylvia', 'Ayers', 'sit@dolorDonecfringilla.com'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Odessa', 'Colon', 'mi.eleifend.egestas@tristiqueac.com'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Kiayada', 'Santana', 'semper@sed.com'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Hillary', 'Stanton', 'eget.mollis@turpisegestas.net'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Xantha', 'Rivera', 'cursus.mollis@Fuscefermentum.co.uk'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Georgia', 'Austin', 'Nulla.tempor@metuseu.org'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Richard', 'Jackson', 'tincidunt.nibh@euismod.net'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Kimberley', 'Sanders', 'non.magna.Nam@feugiat.edu'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Evan', 'Cervantes', 'bibendum@atauctorullamcorper.ca'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Raja', 'Hardin', 'eget@Fuscemi.co.uk'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Doris', 'Moody', 'penatibus.et@facilisisegetipsum.net'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Sierra', 'Love', 'lorem.luctus@ligulaelitpretium.org'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Griffin', 'Brooks', 'praesent.eu@orcipibus.org'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Ferris', 'Dunlap', 'ac@Aliquam.com');
    
INSERT INTO USER_DEVICE (userID, deviceID) VALUES
	((SELECT userID FROM USER WHERE email = 'ssmith@gmail.com' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15348')),
    ((SELECT userID FROM USER WHERE email = 'ssmith@gmail.com' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '16302')),
    ((SELECT userID FROM USER WHERE email = 'ssmith@gmail.com' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15342')),
    ((SELECT userID FROM USER WHERE email = 'ssmith@gmail.com' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15345')),
    ((SELECT userID FROM USER WHERE email = 'ssmith@gmail.com' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15347')),
	((SELECT userID FROM USER WHERE email = 'ac@Aliquam.com' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15348')),
    ((SELECT userID FROM USER WHERE email = 'praesent.eu@orcipibus.org' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15348')),
    ((SELECT userID FROM USER WHERE email = 'lorem.luctus@ligulaelitpretium.org' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15348')),
    ((SELECT userID FROM USER WHERE email = 'penatibus.et@facilisisegetipsum.net' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15348')),
    ((SELECT userID FROM USER WHERE email = 'eget@Fuscemi.co.uk' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15345')),
    ((SELECT userID FROM USER WHERE email = 'eget@Fuscemi.co.uk' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15340')),
    ((SELECT userID FROM USER WHERE email = 'bibendum@atauctorullamcorper.ca' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15345')),
    ((SELECT userID FROM USER WHERE email = 'bibendum@atauctorullamcorper.ca' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15344')),
    ((SELECT userID FROM USER WHERE email = 'non.magna.Nam@feugiat.edu' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15344')),
    ((SELECT userID FROM USER WHERE email = 'tincidunt.nibh@euismod.net' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15344')),
    ((SELECT userID FROM USER WHERE email = 'Nulla.tempor@metuseu.org' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15344')),
    ((SELECT userID FROM USER WHERE email = 'Nulla.tempor@metuseu.org' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15345')),
    ((SELECT userID FROM USER WHERE email = 'cursus.mollis@Fuscefermentum.co.uk' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15344')),
    ((SELECT userID FROM USER WHERE email = 'eget.mollis@turpisegestas.net' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15344')),
    ((SELECT userID FROM USER WHERE email = 'semper@sed.com' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15344')),
    ((SELECT userID FROM USER WHERE email = 'semper@sed.com' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15347')),
    ((SELECT userID FROM USER WHERE email = 'mi.eleifend.egestas@tristiqueac.com' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15342')),
    ((SELECT userID FROM USER WHERE email = 'sit@dolorDonecfringilla.com' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15342')),
    ((SELECT userID FROM USER WHERE email = 'at@sem.co.uk' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15342')),
    ((SELECT userID FROM USER WHERE email = 'orci@arcuVestibulum.edu' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15342')),
    ((SELECT userID FROM USER WHERE email = 'gravida.non@ornare.org' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15342')),
    ((SELECT userID FROM USER WHERE email = 'quam@tortor.com' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15347')),
    ((SELECT userID FROM USER WHERE email = 'dui.Fusce@Sedegetlacus.net' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15347')),
    ((SELECT userID FROM USER WHERE email = 'dignissim.tempor@enimnislelementum.org' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15347')),
    ((SELECT userID FROM USER WHERE email = 'dignissim.tempor@enimnislelementum.org' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15342')),
    ((SELECT userID FROM USER WHERE email = 'tincidunt.aliquam@Fusce.com' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15340')),
    ((SELECT userID FROM USER WHERE email = 'amet.ante@dolor.org' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15340')),
    ((SELECT userID FROM USER WHERE email = 'tempus.lacinia@mattisInteger.ca' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15340')),
    ((SELECT userID FROM USER WHERE email = 'erat@commodo.co.uk' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15340')),
    ((SELECT userID FROM USER WHERE email = 'erat@commodo.co.uk' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15347'));