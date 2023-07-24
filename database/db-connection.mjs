import sql from "mssql";
import { localEMSConfig } from "../config.mjs";

async function queryDB() {
  try {
      // make sure that any items are correctly URL encoded in the connection string
      await sql.connect(localEMSConfig);
      const result = await sql.query`SELECT BMENO, SERIAL_NO FROM tblEquipment WHERE LocationCurrent = 294 AND MANUFACT LIKE '%SLE%'`
      return result
  } catch (err) {
      // ... error checks
  }
}

const serialBMELookup = await queryDB();
console.log(serialBMELookup.recordset);

//queryDB("SELECT BMENO, SERIAL_NO FROM tblEquipment WHERE LocationCurrent = 294 AND MANUFACT LIKE '%SLE%'");