import sql from "mssql";
import { localDBConfig } from "../config.mjs";
import { localEMSConfig } from "../config.mjs";

async function queryDB(parameter) {
  try {
      // make sure that any items are correctly URL encoded in the connection string
      await sql.connect(localDBConfig);
      const result = await sql.query(`SELECT * FROM Equipment WHERE BMENO IN ${parameter}`);
      return result
  } catch (err) {
      // ... error checks
  }
}

const array = ["37646", "57565", "45742", "55406", "53729", "37746", "54024", "51784", "47767"];
const lastIndex = array.length - 1;
const queryParameter = array.map((bme, index) => {
  return index === 0 ? `('${bme}'` : index === lastIndex ? `'${bme}')` : `'${bme}'`;
}).join(",");

const serialBMELookup = await queryDB(queryParameter);
console.log(serialBMELookup);

