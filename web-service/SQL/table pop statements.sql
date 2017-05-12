USE SEFlow_dashboard;
#Look up tables
INSERT INTO ACCOUNT_TYPE (accountType, accountTypeDesc) VALUES
	('donor', 'This user contributed to a SE-Flow device and can see information about the device they donate.'),
	('super-user', 'This user can view detailed information about all devices.');
            
INSERT INTO USE_MODE (useModeName, useModeDesc) VALUES
	('IPC', 'This device is used primarily for Infection Prevention and Control situations, likely at a clinic'),
	('Water Purfication', 'This device is used primarily for water purfication');
    
INSERT INTO DEVICE_STATUS (statusName, statusDesc) VALUES
	('Warning', 'This device is functioning but has a warning that should be addressed.'),
    ('Active', 'This device is functioning nomrally.'),
    ('Error', 'This device is not functioning and has received an error.'),
    ('Unknown' 'This device has not yet reported cycle informaiton or has not reported a cycle in over a year.');
            
#Test Data
INSERT INTO DEVICE (useModeID, serialNum, lastCleaned) VALUES
	((SELECT useModeID FROM USE_MODE WHERE useModeName = 'IPC'), '15348', '2017-05-01'),
	((SELECT useModeID FROM USE_MODE WHERE useModeName = 'IPC'), '15345', '2017-05-01'),
	((SELECT useModeID FROM USE_MODE WHERE useModeName = 'IPC'), '15344', '2017-03-01'),
	((SELECT useModeID FROM USE_MODE WHERE useModeName = 'IPC'), '15342', '2017-05-01'),
	((SELECT useModeID FROM USE_MODE WHERE useModeName = 'IPC'), '15347', '2017-05-01'),
	((SELECT useModeID FROM USE_MODE WHERE useModeName = 'IPC'), '15340', '2015-01-01');
    
INSERT INTO LOCATION (deviceID, placementDate, city, country) VALUES
	((SELECT deviceID FROM DEVICE WHERE deviceID = '15348'), '2017-04-03', 'Seattle', 'United States'),
    #((SELECT deviceID FROM DEVICE WHERE deviceID = '15348'), '2017-04-03', 'Seattle', 'United States'),
    ((SELECT deviceID FROM DEVICE WHERE deviceID = '15345'), '2017-04-03', 'Seattle', 'United States'),
    ((SELECT deviceID FROM DEVICE WHERE deviceID = '15344'), '2017-04-03', 'Seattle', 'United States'),
    ((SELECT deviceID FROM DEVICE WHERE deviceID = '15342'), '2017-04-03', 'Seattle', 'United States'),
    ((SELECT deviceID FROM DEVICE WHERE deviceID = '15347'), '2017-04-03', 'Seattle', 'United States'),
    ((SELECT deviceID FROM DEVICE WHERE deviceID = '15340'), '2017-04-03', 'Seattle', 'United States');

INSERT INTO USER (accountTypeID, fName, lName, email) VALUES
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Sarah', 'Smith', 'ssmith@gmail.com'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Imelda', 'Hayes', 'erat@commodo.co.uk'), 
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Veronica', 'Alford', 'tempus.lacinia@mattisInteger.ca'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Tyler', 'Erickson', 'amet.ante@dolor.org'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Bert', 'Calderon', 'tincidunt.aliquam@Fusce.com'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Ori', 'Garner', 'dignissim.tempor@enimnislelementum.org'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Fuller', 'Levy', 'dui.Fusce@Sedegetlacus.net'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Renee', 'David', 'quam@tortor.com'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Nasim', 'Cline', 'gravida.non@ornare.org'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Leonard', 'Fields', 'orci@arcuVestibulum.edu'),
	((SELECT accountTypeID FROM ACCOUNT_TYPE WHERE accountType = 'donor'), 'Lewis', 'Berg', 'at@sem.co.uk'),
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
    ((SELECT userID FROM USER WHERE email = 'ssmith@gmail.com' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15348')),
    ((SELECT userID FROM USER WHERE email = 'ssmith@gmail.com' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15340')),
    ((SELECT userID FROM USER WHERE email = 'ssmith@gmail.com' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15342')),
    ((SELECT userID FROM USER WHERE email = 'erat@commodo.co.uk' LIMIT 1), (SELECT deviceID FROM DEVICE WHERE serialNum = '15347'));