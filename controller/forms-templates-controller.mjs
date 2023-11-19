import { getUserFormsTemplatesData, writeAllFormTemplateData } from "../models/forms-templates-models.mjs"
import { FileHandlingError, DBError, ParsingError } from '../error-handling/file-errors.mjs';

export async function updateServiceRequestForms(__dirname, userId, req, res, next) {
    const formTemplateData = await getUserFormsTemplatesData(__dirname, userId).catch((err) => {
        if (err.type === "FileHandlingError") {
            throw new FileHandlingError(err.message, err.cause, err.action, err.route);
        }
        else {
            throw new ParsingError(err.message, err.cause, err.route);
        }
    });

    // Need to check if data already exists or not and add the new entry to the form template data array 
    
}