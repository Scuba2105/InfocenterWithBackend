const primaryKeyLookup = {"Users": "Staff ID"}

export class FileHandlingError extends Error {  
    constructor (message, cause, action, route) {
      // Access the properties and methods of the base class it extends
      if (message) {
        super(message, {cause: cause});
      } else {
        super("An unexpected file handling error occurred!");
      }
      
      // capturing the stack trace keeps the reference to your error class
      Error.captureStackTrace(this, this.constructor);
  
      // assign the error class name and error code in your custom error (as a shortcut)
      this.name = "FileHandlingError";
      this.httpStatusCode = 500; 
      
      // Set the abstracted error message for front-end user based on constructor parameters
      if (action === "delete") {
        if (this.constructor.code === "ENOENT") {
          this.message = `Unable to ${action} the selected file as it could not be found.`
        }
        else if (this.constructor.code === "EISDIR") {
          this.message = `Unable to ${action} the selected file as the path is a directory instead of a file.`
        }
        else if (this.constructor.code === "EPERM") {
          this.message = `Unable to ${action} the selected file due to a permissions issue on the server.`
        }
        else {
          this.message = `An unexpected error occurred while trying to ${action} the selected file.`
        }
      }
      else {
        if (this.constructor.code === "ENOENT") {
          this.message = `Unable to ${action} the ${route} data as the data file could not be found.`
        }
        else if (this.constructor.code === "EISDIR") {
          this.message = `Unable to ${action} the ${route} data as the path points to a directory instead of a file.`
        }
        else if (this.constructor.code === "EPERM") {
          this.message = `Unable to ${action} the ${route} data due to a permissions issue on the server.`
        }
        else {
          this.message = `An unexpected error occurred while trying to ${action} the ${route} data.`
        }
      }
    }
}

export class ParsingError extends Error {  
  constructor (message, cause, route) {
    // Access the properties and methods of the base class it extends
    if (message) {
      super(message, {cause: cause});
    } else {
      super("An unexpected parsing error occurred!");
    }
    
    // capturing the stack trace keeps the reference to your error class
    Error.captureStackTrace(this, this.constructor);

    // assign the error class name and error code in your custom error (as a shortcut)
    this.type = "ParsingError";
    this.httpStatusCode = 500; 
    
    // Set the abstracted error message for front-end user based on constructor parameters
    this.message = `Unable to get the ${route} data as an error occurred while parsing the JSON data.`
  }
}

export class DBError extends Error {  
  constructor (message, cause, table, action, querySuccess=false) {
    // Access the properties and methods of the base class it extends
    if (message) {
      super(message, { cause: cause });
    } else {
      super("An unexpected Database error occurred!");
    }
    
    // capturing the stack trace keeps the reference to your error class
    Error.captureStackTrace(this, this.constructor);

    // assign the error class name and error code in your custom error (as a shortcut)
    this.type = "DBError"
    this.httpStatusCode = 500; 
    
    // Set the abstracted error message for front-end user based on constructor parameters
    //name, code, message
    if (this.cause.code === "ELOGIN") {
      this.message = `An error occurred logging into the Information Centre database.`
    }
    else if (this.cause.code === "ETIMEOUT" && this.constructor.name === "ConnectionError") {
      this.message = `A timeout error occurred while connecting to the Information Centre database.`; 
    }
    else if (this.cause.code === "ECONNCLOSED") {
      this.message = `The Information Centre database could not be accessed as the connection is closed.`; 
    }
    else if (this.cause.code === "EABORT") {
      this.message = `The request could not be completed since the database transaction with Information Centre database was aborted.`; 
    }
    else if (this.cause.code === "ETIMEOUT" && this.constructor.name === "RequestError") {
      this.message = `A timeout error occurred while completing the request to the Information Centre database.`; 
    }
    else if (this.cause.code === "EARGS") {
      this.message = `An invalid number of arguments was provided to the request with the Information Centre database.`;
    }
    else if (this.cause.code === "EREQUEST") {
      if (this.cause.number === 2627) {
        this.message = `There already exists an entry in the Information Centre database with the entered ${primaryKeyLookup[table]} and duplicates are not allowed. Please verify you have entered the correct ${primaryKeyLookup[table]}.`
      }
      else {
        this.message = `An unexpected error occurred with the Information Centre database query.`
      }
    }
    else if (["INSERT", "UPDATE"].includes(action) && querySuccess === true) {
      this.message = message;
    }
    else {
      this.message = `An unexpected error occurred with the Information Centre database while completing the request.`; 
    }
  }
}
