import sql from "mssql";
import { localDBConfig, localEMSConfig, testDBConfig } from "../config"

const pool = new sql.ConnectionPool(testDBConfig);

async function getGenius3Serial(parameter) {
  try {

    let connPromise;
    if (!pool.connected) {
        if (!pool.connecting) {
            connPromise = await pool.connect();
        } else {
            await connPromise;
        }
    }
   
    // Create a new request object
    var req = await pool.Request();
    
    // Make sure that any items are correctly URL encoded in the connection string
    const result = await request.query(`SELECT BMENO, Serial_No FROM Equipment WHERE BMENO IN ${parameter}`);
    
    // Close connection to pool
    await pool.close();
    
    return result.recordset;
  } 
  catch (error) {
      console.log(error);
  }
}

// const array = ["37646", "57565", "45742", "55406", "53729", "37746", "54024", "51784", "47767"];
// const lastIndex = array.length - 1;
// const queryParameter = array.map((bme, index) => {
//   return index === 0 ? `(${bme}` : index === lastIndex ? `${bme})` : `${bme}`
// }).join(",");


