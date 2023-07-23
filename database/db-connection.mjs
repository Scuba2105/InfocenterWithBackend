import { Connection, Request } from "tedious";
import { localDBConfig } from "../config.mjs";

export function queryDB(query) {
  const connection = new Connection(localDBConfig);

  connection.connect((err) => {
    if (err) {
      console.log('Connection Failed');
      throw err;
    }

    executeStatement(query);
  });
}

function executeStatement(query) {
  
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
  request.on('row', (columns) => {
    columns.forEach((column) => {
      if (column.value === null) {
        console.log('NULL');
      } else {
        serialNumberLookup.push(column.value);
      }
    });
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