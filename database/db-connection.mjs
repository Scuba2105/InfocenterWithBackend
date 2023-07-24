import sql from "mssql";
import { localDBConfig } from "../config.mjs";
import { localEMSConfig } from "../config.mjs";

async function getGenius3Serial(parameter) {
  try {
      // Need to validate the parameter input
      // Connect to the database
      await sql.connect(localDBConfig);  
      
      // Create a new request object
      const request = new sql.Request()
            
      // make sure that any items are correctly URL encoded in the connection string
      const result = await request.query(`SELECT BMENO, Serial_No FROM Equipment WHERE BMENO IN ${parameter}`);
      return result.recordset;
  } catch (error) {
      console.log(error);
  }
}

// const array = ["37646", "57565", "45742", "55406", "53729", "37746", "54024", "51784", "47767"];
// const lastIndex = array.length - 1;
// const queryParameter = array.map((bme, index) => {
//   return index === 0 ? `(${bme}` : index === lastIndex ? `${bme})` : `${bme}`
// }).join(",");


