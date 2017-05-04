CREATE DEFINER=`appleTea`@`%` PROCEDURE `addCycle`(newCycleSalinity int, newCycleTempIn int, newCycleCell1 double, newCycleCell2 double, newCycleCell3 double, newCycleTotalCurrent double, newCycleDateTime datetime, 
	OUT cycleID INTEGER)
BEGIN
	# Adds a Cycle with the given values to the database, if the cycle does not already exist in the database
	# Returns the cycleID of that cycle or -1 if the cycle was not added to the database

	#Declare statements
    DECLARE _rollback BOOLEAN DEFAULT FALSE;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET _rollback = TRUE;
	
    #check to see if the cycle exists or not
    IF (SELECT Count(*) FROM CYCLE WHERE CYCLE.startDateTime = newCycleDateTime > 0) THEN 
		SET @cycleID = -1;
	ELSE
		START TRANSACTION;
		INSERT INTO CYCLE VALUES (newCycleSalinity, newCycleTempIn, newCycleCell1, newCycleCell2, newCycleCell3, newCycleTotalCurrent, newCycleDateTime);
		SET @cycleID = (SELECT LAST_INSERT_ID());        
		IF _rollback THEN 
			ROLLBACK;
            SET @cycleID = -1;
		ELSE
			COMMIT;
		END IF;
	END IF;    
    SELECT @cycleID;
END