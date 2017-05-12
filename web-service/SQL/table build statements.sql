#DROP DATABASE SEFlow_dashboard;
CREATE DATABASE SEFlow_dashboard;
USE SEFlow_dashboard;
#table creation statements
CREATE TABLE ORGANIZATION (
	organizationID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    organizationName varchar(50) NOT NULL,
    organizationDesc varchar(300)
);
    
CREATE TABLE ACCOUNT_TYPE (
	accountTypeID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    accountType varchar(50) NOT NULL,
    accountTypeDesc varchar(300)
);

CREATE TABLE USE_MODE (
	useModeID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    useModeName varchar(50) NOT NULL,
    useModeDesc varchar(300)
);

CREATE TABLE DEVICE_STATUS (
	statusID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    statusName varchar(30) NOT NULL,
    statusDesc varchar(300)
);

CREATE TABLE USER (
	userID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    organizationID int,
    accountTypeID int,
    email varchar(50),
    fName varchar(50),
    lName varchar(50),
    FOREIGN KEY(organizationID) REFERENCES ORGANIZATION(organizationID),
    FOREIGN KEY(accountTypeID) REFERENCES ACCOUNT_TYPE(accountTypeID)
);

CREATE TABLE DEVICE (
	deviceID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    useModeID int NOT NULL,
    statusID int NOT NULL,
    serialNum int NOT NULL,
    lastCleaned date,
    deviceDesc varchar(300),
    photoFileName varchar(100),
    FOREIGN KEY(useModeID) REFERENCES USE_MODE(useModeID),
    FOREIGN KEY(statusID) REFERENCES DEVICE_STATUS (statusID)
);

CREATE TABLE LOCATION (
	locationID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    deviceID int NOT NULL,
    city varchar(100),
    country varchar(100),
    longitude float,
    latitude float,
    placementDate datetime,
    locationDesc varchar(300),
    FOREIGN KEY(deviceID) REFERENCES DEVICE(deviceID)
);

CREATE TABLE USER_DEVICE (
	userDeivceID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userID int NOT NULL,
    deviceID int NOT NULL,
    FOREIGN KEY(userID) REFERENCES USER(userID),
    FOREIGN KEY(deviceID) REFERENCES DEVICE(deviceID)
);

CREATE TABLE ERROR (
	errorID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    errorNum int  NOT NULL,
    errorName varchar(50) NOT NULL,
    errorDesc varchar(300)
);

CREATE TABLE CYCLE (
	cycleID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    deviceID int NOT NULL,
    errorID int,
    startDateTime DATETIME,
    startSalinity int,
    startTempIn int,
    startCell1 double,
    startCell2 double,
    startCell3 double,
    totalCurrent double,
    FOREIGN KEY(deviceID) REFERENCES DEVICE(deviceID), 
    FOREIGN KEY(errorID) REFERENCES ERROR(errorID)
);

CREATE TABLE ENTRY (
	entryID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cycleID int NOT NULL,
    seconds time NOT NULL,
    salinity int NOT NULL,
    flowrate int NOT NULL,
    tempIn int NOT NULL,
    tempOut int NOT NULL,
    supply int NOT NULL,
    cell1 int NOT NULL,
    cell2 int NOT NULL,
    cell3 int NOT NULL,
    cell4 int NOT NULL,
    FOREIGN KEY(cycleID) REFERENCES CYCLE(cycleID)
);

# Creates the account for the dashboard to access the database
GRANT SELECT, UPDATE, INSERT, EXECUTE ON SEFlow_dashboard.* To 'dashboard'@'%' IDENTIFIED BY 'MouS@17Rese_tain';
