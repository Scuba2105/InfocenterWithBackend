import { Connection, Request } from "tedious";

// For testing on home laptop DB
import { localDBConfig } from "../config.mjs";

// For testing on local mobile EMS backend 
import { localEMSConfig } from "../config.mjs";

export function queryDB(query) {
  const connection = new Connection(localEMSConfig);

  connection.connect((err) => {
    if (err) {
      console.log('Connection Failed');
      throw err;
    }

    executeStatement(connection, query);
  });
}

function executeStatement(connection, query) {
  
  const serialNumberLookup = [];

  const request = new Request(query, (err, rowCount) => {
    if (err) {
      throw err;
    }

    console.log(serialNumberLookup);
    console.log('DONE!');
    connection.close();
  });

  // Emits a 'DoneInProc' event when completed.
  // This on row callback is for a specific query
  request.on('row', (columns) => {
    let rowData = {bme: null, serial: null};
    columns.forEach((column, index) => {
      if (index === 0) {
        rowData.bme = column.value;
      }
      else if (index === 1) {
        rowData.serial = column.value;
      }
      else (console.log("unknown column"));
    });
    serialNumberLookup.push(rowData);
  });

  request.on('done', (rowCount) => {
    console.log('Done is called!');
  });

  request.on('doneInProc', (rowCount, more) => {
    console.log(rowCount + ' rows returned');
  });

  // Execute the define statement
  connection.execSql(request);
}

//queryDB("SELECT BMENO, SERIAL_NO FROM tblEquipment WHERE LocationCurrent = 294 AND MANUFACT LIKE '%SLE%'");