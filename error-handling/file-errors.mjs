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
      
      if (action === "delete") {
        this.message = `Unable to ${action} the selected file as it was not able to be found.`
      }
      else if (this.constructor.code === ENOENT) {
        this.message = `Unable to ${action} the ${route} data as the file could not be found.`
      }
      else if (this.constructor.code === EISDIR) {
        this.message = `Unable to ${action} the ${route} data ${action === "read" ? "from" : "to"} a directory.`
      }
      else {
        this.message = `An unexpected error occurred while trying to ${action} the ${route} data.`
      }
        
    }
}