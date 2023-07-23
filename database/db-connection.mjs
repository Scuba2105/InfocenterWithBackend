import { Connection, Request } from "tedious";
import { localDBConfig } from "../config.mjs";

const connection = new Connection(localDBConfig);

connection.connect((err) => {
  if (err) {
    console.log('Connection Failed');
    throw err;
  }

  executeStatement();
});

function executeStatement() {
  const request = new Request('SELECT TOP (10) * FROM Equipment', (err, rowCount) => {
    if (err) {
      throw err;
    }

    console.log('DONE!');
    connection.close();
  });

  // Emits a 'DoneInProc' event when completed.
  request.on('row', (columns) => {
    columns.forEach((column) => {
      if (column.value === null) {
        console.log('NULL');
      } else {
        console.log(column.value);
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