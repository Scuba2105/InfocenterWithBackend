export class FileHandlingError extends Error {  
    constructor (message, action, route) {
      // Access the properties and methods of the base class it extends
      if (message) {
        super(message);
      } else {
        super("An unexpected file handling error occurred!");
      }
      
      // capturing the stack trace keeps the reference to your error class
      Error.captureStackTrace(this, this.constructor);
  
      // assign the error class name and error code in your custom error (as a shortcut)
      this.name = this.constructor.name;
      this.httpStatusCode = 500; 
      
      // Set the abstracted error message for front-end user based on constructor parameters
      if (action === "delete") {
        if (this.constructor.code === ENOENT) {
          this.message = `Unable to ${action} the selected file as it could not be found.`
        }
        else if (this.constructor.code === EISDIR) {
          this.message = `Unable to ${action} the selected file as the path is a directory instead of a file.`
        }
        else if (this.constructor.code === EPERM) {
          this.message = `Unable to ${action} the selected file due to a permissions issue on the server.`
        }
        else {
          this.message = `An unexpected error occurred while trying to ${action} the selected file.`
        }
      }
      else {
        if (this.constructor.code === ENOENT) {
          this.message = `Unable to ${action} the ${route} data as the data file could not be found.`
        }
        else if (this.constructor.code === EISDIR) {
          this.message = `Unable to ${action} the ${route} data as the path points to a directory instead of a file.`
        }
        else if (this.constructor.code === EPERM) {
          this.message = `Unable to ${action} the ${route} data due to a permissions issue on the server.`
        }
        else {
          this.message = `An unexpected error occurred while trying to ${action} the ${route} data.`
        }
      }
    }
}

export class ParsingError extends Error {  
  constructor (message, route) {
    // Access the properties and methods of the base class it extends
    if (message) {
      super(message);
    } else {
      super("An unexpected parsing error occurred!");
    }
    
    // capturing the stack trace keeps the reference to your error class
    Error.captureStackTrace(this, this.constructor);

    // assign the error class name and error code in your custom error (as a shortcut)
    this.name = this.constructor.name;
    this.httpStatusCode = 500; 
    
    // Set the abstracted error message for front-end user based on constructor parameters
    this.message = `Unable to get the ${route} data as an error occurred while parsing the JSON data.`
  }
}