import { getRequestsData, writeRequestsData } from "../models/requests-models.mjs";
import { FileHandlingError, ParsingError } from "../error-handling/file-errors.mjs";
import { Mutex } from "async-mutex";
import { convertHospitalName } from "../utils/utils.mjs";

// Assists with preventing race conditions. 
const requestsDataMutex = new Mutex();

export function handleDeviceUpdateRequest(req, res, next, __dirname) {
    // Need to add the data to the requests json file for storage.
    requestsDataMutex.runExclusive(async () => {
        try {
            const requestsData = await getRequestsData(__dirname).catch((err) => {
                if (err.type === "FileHandlingError") {
                    throw new FileHandlingError(err.message, err.cause, err.action, err.route);
                }
                else {
                    throw new ParsingError(err.message, err.cause, err.route);
                }
            });
            
            // Define the variables from the uploaded data.
            const model = req.body.model;
            const manufacturer = req.body.manufacturer;
            const username = req.body.username;
            const timestamp = req.body.timestamp;
            const documentKeys = Object.keys(req.body).filter((key) => {
                return /description[1-4]/.test(key);
            });
                
            // Retrieve the current data for the updated device.
            let updatedDevice = requestsData.find((entry) => {
                return entry.model === model && entry.manufacturer === manufacturer;
            })

            // determine if the current device has update requests
            const modelUpdatesExist = updatedDevice ? true : false;

            if (!updatedDevice) {
                updatedDevice = {model: model, manufacturer: manufacturer};
            }
            
            // Update the device details if corresponding key exists in form data.

            // Add any service manual requests to the updated request data
            if (Object.keys(req.files).includes('service-manual')) {
                const serviceManualRequestObject = {requestor: username, timestamp: timestamp, fileName: `/requests/${model}/${username}_${timestamp}_${model.toLowerCase().replace(/\s/g, "_")}_service_manual.pdf`};
                if (updatedDevice.serviceManual) {
                    updatedDevice.serviceManual.push(serviceManualRequestObject);
                }
                else {
                    updatedDevice.serviceManual = [serviceManualRequestObject];
                }
            }

            // Add any user manual requests to the updated request data
            if (Object.keys(req.files).includes('user-manual')) {
                const userManualRequestObject = {requestor: username, timestamp: timestamp, filePath: `/requests/${model}/${username}_${timestamp}_${model.toLowerCase().replace(/\s/g, "_")}_user_manual.pdf`};
                if (updatedDevice.userManual) {
                    updatedDevice.userManual.push(userManualRequestObject)
                }
                else {
                    updatedDevice.userManual = [userManualRequestObject];
                }
            }

            // Add any config requests to the updated request data.
            if (Object.keys(req.files).includes('configs')) {
                const hospital = req.body.hospital;
                const configRequestObject = {requestor: username, timestamp: timestamp, hospital: hospital, model: model, configPath: `/requests/${model}/${username}_${timestamp}_${req.files.configs[0].originalname}`};
                if (updatedDevice.config) {
                    updatedDevice.config.push(configRequestObject)
                }
                else {
                    updatedDevice.config = [configRequestObject];
                }
            }

            // Add any software requests to the updated request data.
            if (Object.keys(req.body).includes('software')) {
                const softwareData = req.body.software;
                const softwareDataArray = softwareData.split('=');
                const softwareType = softwareDataArray[0];
                const softwareLocation = softwareDataArray[1];
                const softwareRequestObject = {requestor: username, timestamp: timestamp, softwareType: softwareType, softwareLocation: softwareLocation};
                    
                if (updatedDevice.software) {
                    updatedDevice.software.push(softwareRequestObject);
                }
                else {
                    updatedDevice.software = [softwareRequestObject];
                }
            }

            // Add any uploaded 'Other Documents' to the uploaded request data 
            if (documentKeys.length !== 0) {
                if (!updatedDevice.documents) {
                    const documentsInfo = [];
                    documentKeys.forEach((key, index) => {
                        const keyObjectDetails = {requestor: username, timestamp: timestamp, label: req.body[key], filePath: `/requests/${model}/${username}_${timestamp}_${req.files[`file${index + 1}`][0].originalname}`} 
                        documentsInfo.push(keyObjectDetails);
                    });
                    updatedDevice.documents = documentsInfo;
                }
                else {
                    documentKeys.forEach((key, index) => {
                        const keyObjectDetails = {requestor: username, timestamp: timestamp, label: req.body[key], filePath: `/requests/${model}/${username}_${timestamp}_${req.files[`file${index + 1}`][0].originalname}`} 
                        updatedDevice.documents.push(keyObjectDetails);
                    });
                }
            }

            //  Add any uploaded password data to the updated request object 
            if (Object.keys(req.body).includes("restricted-access-type")) {
                 
                // Create the new password data object
                const restrictedAccessType = `${req.body["restricted-access-type"]}`;
                const passwordDataObject = `${req.body["credential-type"]}: ${req.body["credential-value"]}`;

                // Get the existing password data.
                const passwordData = updatedDevice.passwords;

                // If password data doesn't exist create the password array and enter the new data object.
                if (!passwordData) {
                    updatedDevice.passwords = [];
                    updatedDevice.passwords.push({requestor: username, timestamp: timestamp, type: restrictedAccessType, values: [passwordDataObject]});
                }
                else {
                    
                    // Get the existing password data for the restricted access if it exists. Devices can have multiple entries for each
                    // access type such as password, username, or different software revision passwords.
                    const existingRestrictedAccessData = passwordData.find((entry) => {
                        return entry.type === restrictedAccessType;
                    })

                    // If restricted access type array already exists push the new data to the values array otherwise 
                    // push the new object to the password data.
                    if (!existingRestrictedAccessData) {
                        updatedDevice.passwords.push({requestor: username, timestamp: timestamp, type: restrictedAccessType, values: [passwordDataObject]});
                    }
                    else {
                        existingRestrictedAccessData.values.push(passwordDataObject);
                        const updatedPasswordsData = passwordData.map((entry) => {
                            if (entry.type === restrictedAccessType) {
                                return existingRestrictedAccessData
                            }
                            return entry;
                        })
                        updatedDevice.passwords = updatedPasswordsData;
                    }
                }
            }

            let updatedRequestsData;

            if (modelUpdatesExist) {
                updatedRequestsData = requestsData.map((entry) => {
                    if (entry.model === model && entry.manufacturer === manufacturer) {
                        return updatedDevice
                    }
                    return entry
                })
            }
            else {
                requestsData.push(updatedDevice);
                updatedRequestsData = requestsData;
            }    
            
            const writeResult = await writeRequestsData(__dirname, JSON.stringify(updatedRequestsData, null, 2)).catch((err) => {
                throw new FileHandlingError(err.message, err.cause, err.action, err.route);
            });
        
            // Updated request API to here *******************************************************************.
                    
            
            
            // // Replace the old device data in the DeviceData array with the new data that has been entered 
            // const updatedDeviceData = requestsData.map((entry) => {
            //     if (entry.model === model && entry.manufacturer === manufacturer) {
            //         return updatedDevice
            //     }
            //     else {
            //         return entry;
            //     }
            // })

            // // Write the data to file.
            // const fileWriteResult = await writeAllDeviceData(__dirname, JSON.stringify(updatedDeviceData, null, 2)).catch((err) => {
            //     throw new FileHandlingError(err.message, err.cause, err.action, err.route);
            // });

            // // Send the success response message.
            res.json({type: "Success", message: 'Update Request Successfully Submitted'});
    
        }
        catch (err) {
            console.log(err)
            // Log the route and error message and call error handling middlware.
            console.log({Route: `Update ${req.body.model}`, Error: err.message});
            next(err);
        }
    })
    
}