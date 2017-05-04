CREATE DEFINER=`appleTea`@`%` PROCEDURE `addEntries`(cycleID int, OUT success BOOLEAN)
BEGIN
	#Declare statements
    DECLARE _rollback BOOLEAN DEFAULT FALSE;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET _rollback = TRUE;

	START TRANSACTION;
		#add the entries to the database
			#split the entries string based on deliminators
			#split the string again based on commas
			#Add an entry to the database
				#check to see if the first entry already exists, not necessary?
				#if it does not add all entries to the database
			
	IF _rollback THEN 
		ROLLBACK;
		SET @success = FALSE;
	ELSE
		COMMIT;
		SET @success = TRUE;
	END IF;
    SELECT @success;
END