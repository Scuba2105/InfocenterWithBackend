import { getAllFormsTemplatesData, getUserFormsTemplatesData, writeAllFormTemplateData } from "../models/forms-templates-models.mjs"
import { FileHandlingError, DBError, ParsingError } from '../error-handling/file-errors.mjs';

export async function updateServiceRequestForms(__dirname, userId, req, res, next) {
    try {
        const formTemplateDataArray = await Promise.all([getAllFormsTemplatesData(__dirname), 
        getUserFormsTemplatesData(__dirname, userId)])
        .catch((err) => {
            if (err.type === "FileHandlingError") {
                throw new FileHandlingError(err.message, err.cause, err.action, err.route);
            }
            else {
                throw new ParsingError(err.message, err.cause, err.route);
            }
        });
        
        // Get the existing service request forms for all staff and current user.
        const allFormTemplateData = formTemplateDataArray[0];
        let userFormTemplateData = formTemplateDataArray[1];
        
        // Get the request data from the request body.
        const selectedServiceAgent =  req.body["service-agent"]
        
        // Need to check if data already exists or not and add the new entry to the form template data array 
        if (!userFormTemplateData) {
            userFormTemplateData = {"staffId": userId, "serviceFormsAvailable": []};
            allFormTemplateData.push(userFormTemplateData);
        }
    
        // Get the current user list of available service forms.
        const currentUserFormsTemplates = userFormTemplateData.serviceFormsAvailable
        
        if (currentUserFormsTemplates.includes(selectedServiceAgent)) {
            // Send the success response message.
            res.json({type: "Success", message: 'Data Upload Successful'}); 
        }
        else {
            // Update the current user service request form data with the uploaded Service Agent.
            currentUserFormsTemplates.push(selectedServiceAgent);
            userFormTemplateData.serviceFormsAvailable = currentUserFormsTemplates;
            
            // Push the current updated data to all data array if it does not exist
            const updatedFormTemplateData = allFormTemplateData.map((entry) => {
                if (entry.staffId === userId) {
                    return userFormTemplateData;               
                }
                return entry;
            });
            
            const writeFileResult = writeAllFormTemplateData(__dirname, JSON.stringify(updatedFormTemplateData, null, 2))
            .catch((err) => {
                throw new FileHandlingError(err.message, err.cause, err.action, err.route);
            })
    
            // Send the success response message.
            res.json({type: "Success", message: 'Data Upload Successful'}); 
        }
    }
    catch (err) {
        // Log the route and error message and call error handling middlware.
        console.log({Route: `Forms & Templates`, Error: err.message});
        next(err);
    }    
}