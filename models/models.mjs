import sql from "mssql";
import { infoCenterDBConfig } from "../config.mjs";
import { localEMSConfig } from "../config.mjs";

// Retrieve User credentials from the database
export async function retrieveUserCredentials(email) {
    return new Promise(async(resolve, reject) => {
        try {
            // Connect to the database
            await sql.connect(infoCenterDBConfig);  
        
            // Create a new request object
            const request = new sql.Request();

            // Query the database for user credentials
            const result = await request
                .input('input_parameter', sql.VarChar, email)
                .query(`SELECT * FROM Users WHERE Email = @input_parameter OR StaffID = @input_parameter`);

            // Return the recordset
            resolve(result.recordset)
        }
        catch (error) {
            reject({type: "DBError", message: error.message, cause: error, table: "Users", action: "SELECT"});    
        }
    })
}

// Update the User's login password in the database
export async function updateUserPassword(staffId, hashedPassword) {
    return new Promise(async(resolve, reject) => {
        try {
            // Connect to the database.
            await sql.connect(infoCenterDBConfig);  
            
            // Create a new request object.
            const request = new sql.Request();

            // Query the database for user credentials.
            const result = await request
                .input('input_parameter1', sql.VarChar, staffId)
                .input('input_parameter2', sql.VarChar, hashedPassword)
                .query(`UPDATE Users SET Password = @input_parameter2 WHERE StaffID = @input_parameter1`);
            
            // Check that the data was inserted into the database.
            if (result.rowsAffected == 0){
                reject({type: "DBError", message: `Nothing was inserted into the database as the entered Staff ID already exists. Please verify you have entered the correct ID.`,
                table: "Users", action: "UPDATE", querySuccess: true});
            }

            // Return the recordset.
            resolve(result.recordset); 
        }
        catch (error) {
            reject({type: "DBError", message: error.message, cause: error, table: "Users", action: "UPDATE"});
        }
    })
}

// Get the Genius3 Serial Numbers from the BME list input
export async function getGenius3Serial(parameter, length) {
  try {

      // Need to validate the parameter input
      // Connect to the database
      await sql.connect(localEMSConfig);  
      //await sql.connect(localDBConfig);
      
      // Create a new request object
      const request = new sql.Request()
      
      // declare result variable
      let result;

      // make sure that any items are correctly URL encoded in the connection string
      if (length === 1) {
            result = await request.query(`SELECT BMENO, Serial_No, BRAND_NAME FROM tblEquipment WHERE BMENO = ${parameter}`);
            //result = await request.query(`SELECT BMENO, Serial_No FROM Equipment WHERE BMENO = ${parameter}`);
      } 
      else {
            result = await request.query(`SELECT BMENO, Serial_No, BRAND_NAME FROM tblEquipment WHERE BMENO IN ${parameter}`);
            //result = await request.query(`SELECT BMENO, Serial_No FROM Equipment WHERE BMENO IN ${parameter}`);
      }

      // Need to close connection
      return result.recordset;
  } 
  catch (error) {
    console.log(error);
    throw new Error(`An error occurred querying the database:- ${error.message}`);
  }
}

export async function disposeGenius3(parameter) {
    try {
  
        // Need to validate the parameter input
        // Connect to the database
        await sql.connect(localEMSConfig);  
        //await sql.connect(localDBConfig);
        
        // Create a new request object
        const request = new sql.Request()
        
        // declare result variable
        const result = await request
            .input('bmeString', parameter)
            .execute(`sp_SCB_ThermometerBulkDisposal`);        
  
        // Need to close connection
        return result.recordset;
    } 
    catch (error) {
      console.log(error);
      throw new Error(`An error occurred querying the database :- ${error.message}`);
    }
  }

  export async function getSerialNumbers(parameter, length) {
    try {
  
        // Need to validate the parameter input
        // Connect to the database
        await sql.connect(localEMSConfig);  
                
        // Create a new request object
        const request = new sql.Request()
        
        // declare result variable
        let result;

        // make sure that any items are correctly URL encoded in the connection string
        if (length === 1) {
            result = await request.query(`SELECT BMENO, Serial_No, BRAND_NAME FROM tblEquipment WHERE BMENO = ${parameter}`);
            //result = await request.query(`SELECT BMENO, Serial_No FROM Equipment WHERE BMENO = ${parameter}`);
        } 
        else {
            result = await request.query(`SELECT BMENO, Serial_No, BRAND_NAME FROM tblEquipment WHERE BMENO IN ${parameter}`);
            //result = await request.query(`SELECT BMENO, Serial_No FROM Equipment WHERE BMENO IN ${parameter}`);
        }

        // Need to close connection
        return result.recordset;
    }
    catch (err) {
        console.log(err);
        throw new Error (err.message);
    }
}





