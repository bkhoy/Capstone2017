#Database creation script for the SE Flow Chlorine Maker

#DATABASE
CREATE DATABASE SEFlow_dashboard;
USE SEFlow_dashboard;

# TABLES
CREATE TABLE ORGANIZATION (
	organizationID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    organizationName varchar(50) NOT NULL,
    organizationDesc varchar(500)
);
    
CREATE TABLE ACCOUNT_TYPE (
	accountTypeID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    accountType varchar(50) NOT NULL,
    accountTypeDesc varchar(500)
);

CREATE TABLE USE_MODE (
	useModeID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    useModeName varchar(50) NOT NULL,
    useModeDesc varchar(500)
);

CREATE TABLE DEVICE_STATUS (
	statusID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    statusName varchar(50) NOT NULL,
    statusDesc varchar(500)
);

CREATE TABLE CYCLE_STATUS (
	cycleStatusID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    statusName varchar(50),
    isError boolean,
    statusDesc varchar(500)
);

CREATE TABLE USER (
	userID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    organizationID int,
    accountTypeID int,
    email varchar(100) UNIQUE,
    fName varchar(50),
    lName varchar(50),
    FOREIGN KEY(organizationID) REFERENCES ORGANIZATION(organizationID),
    FOREIGN KEY(accountTypeID) REFERENCES ACCOUNT_TYPE(accountTypeID)
);

CREATE TABLE DEVICE (
	deviceID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    useModeID int NOT NULL,
    deviceStatusID int NOT NULL,
    serialNum int NOT NULL UNIQUE,
    deviceDesc varchar(500),
    photoFileName varchar(50),
    FOREIGN KEY(useModeID) REFERENCES USE_MODE(useModeID),
    FOREIGN KEY(deviceStatusID) REFERENCES DEVICE_STATUS (statusID)
);

CREATE TABLE LOCATION (
	locationID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    deviceID int NOT NULL,
    city varchar(50),
    country varchar(50) NOT NULL,
    longitude float NOT NULL,
    latitude float NOT NULL,
    placementDate date,
    locationDesc varchar(500),
    FOREIGN KEY(deviceID) REFERENCES DEVICE(deviceID)
);

CREATE TABLE USER_DEVICE (
	userDeivceID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userID int NOT NULL,
    deviceID int NOT NULL,
    FOREIGN KEY(userID) REFERENCES USER(userID),
    FOREIGN KEY(deviceID) REFERENCES DEVICE(deviceID)
);

CREATE TABLE CYCLE (
	cycleID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    deviceID int NOT NULL,
    cycleStatusID int,
    startDateTime DATETIME NOT NULL,
    startSalinity int,
    startTempIn int NOT NULL,
    startTempOut int NOT NULL,
    powerSupply float NOT NULL,
    startCell1 float NOT NULL,
    startCell2 float NOT NULL,
    startCell3 float NOT NULL,
    startCell4 float NOT NULL,
    totalCurrent float NOT NULL,
    totalChlorineProduced float NOT NULL,
    FOREIGN KEY(deviceID) REFERENCES DEVICE(deviceID), 
    FOREIGN KEY(cycleStatusID) REFERENCES CYCLE_STATUS(cycleStatusID)
);

CREATE TABLE ENTRY (
	entryID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cycleID int NOT NULL,
    seconds time NOT NULL,
    salinity int,
    flowrate int NOT NULL,
    dutyCycle int NOT NULL,
    tempIn int NOT NULL,
    tempOut int NOT NULL,
    powerSupply float NOT NULL,
    cell1 float NOT NULL,
    cell2 float NOT NULL,
    cell3 float NOT NULL,
    cell4 float NOT NULL,
    totalCurrent float NOT NULL,
    chlorineProduced float NOT NULL,
    FOREIGN KEY(cycleID) REFERENCES CYCLE(cycleID)
);

# USERS
GRANT SELECT, UPDATE, INSERT, EXECUTE ON SEFlow_dashboard.* To 'dashboard'@'%' IDENTIFIED BY 'MouS@17Rese_tain';
