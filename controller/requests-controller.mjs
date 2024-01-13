import { getRequestsData, writeRequestsData, moveRequestFile, deleteFile, removeRequestEntry } from "../models/requests-models.mjs";
import { getAllDeviceData, writeAllDeviceData } from "../models/device-models.mjs";
import { FileHandlingError, ParsingError } from "../error-handling/file-errors.mjs";
import { Mutex } from "async-mutex";
import { convertHospitalName } from "../utils/utils.mjs";

// Assists with preventing race conditions. 
const requestsDataMutex = new Mutex();

export function getAllRequestsData(req, res, next, __dirname) {
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
             
            // Send the requests data as the response.
            res.json(JSON.stringify(requestsData));
    
        }
        catch (err) {
            // Log the route and error message and call error handling middlware.
            console.log({Route: `Update ${req.body.model}`, Error: err.message});
            next(err);
        }
    })
}

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
            const staffId = req.body.staffId;
            const staffPhotoExtension = req.body.fileExtension;
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
                const serviceManualRequestObject = {requestor: username, requestorId: staffId, staffPhotoExtension: staffPhotoExtension, timestamp: timestamp, filePath: `/requests/${model}/${username}_${timestamp}_${model.toLowerCase().replace(/\s/g, "_")}_service_manual.pdf`};
                if (updatedDevice.serviceManual) {
                    updatedDevice.serviceManual.push(serviceManualRequestObject);
                }
                else {
                    updatedDevice.serviceManual = [serviceManualRequestObject];
                }
            }

            // Add any user manual requests to the updated request data
            if (Object.keys(req.files).includes('user-manual')) {
                const userManualRequestObject = {requestor: username, requestorId: staffId, staffPhotoExtension: staffPhotoExtension, timestamp: timestamp, filePath: `/requests/${model}/${username}_${timestamp}_${model.toLowerCase().replace(/\s/g, "_")}_user_manual.pdf`};
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
                const configRequestObject = {requestor: username, requestorId: staffId, staffPhotoExtension: staffPhotoExtension, timestamp: timestamp, hospital: hospital, model: model, configPath: `/requests/${model}/${username}_${timestamp}_${req.files.configs[0].originalname.replace(/\s/g, "-")}`};
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
                const softwareRequestObject = {requestor: username, requestorId: staffId, staffPhotoExtension: staffPhotoExtension, timestamp: timestamp, softwareType: softwareType, softwareLocation: softwareLocation};
                    
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
                        const keyObjectDetails = {requestor: username, requestorId: staffId, staffPhotoExtension: staffPhotoExtension, timestamp: timestamp, label: req.body[key], filePath: `/requests/${model}/${username}_${timestamp}_${req.files[`file${index + 1}`][0].originalname}`} 
                        documentsInfo.push(keyObjectDetails);
                    });
                    updatedDevice.documents = documentsInfo;
                }
                else {
                    documentKeys.forEach((key, index) => {
                        const keyObjectDetails = {requestor: username, requestorId: staffId, staffPhotoExtension: staffPhotoExtension, timestamp: timestamp, label: req.body[key], filePath: `/requests/${model}/${username}_${timestamp}_${req.files[`file${index + 1}`][0].originalname}`} 
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
                    updatedDevice.passwords.push({type: restrictedAccessType, values: [{requestor: username, requestorId: staffId, staffPhotoExtension: staffPhotoExtension, timestamp: timestamp, passwordData: passwordDataObject}]});
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
                        updatedDevice.passwords.push({type: restrictedAccessType, values: [{requestor: username, requestorId: staffId, staffPhotoExtension: staffPhotoExtension, timestamp: timestamp, passwordData: passwordDataObject}]});
                    }
                    else {
                        existingRestrictedAccessData.values.push({requestor: username, requestorId: staffId, staffPhotoExtension: staffPhotoExtension, timestamp: timestamp, passwordData: passwordDataObject});
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
           
            // Add the updated device data to the re
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
        
            // Send the success response message.
            res.json({type: "Success", message: 'Update Request Successfully Submitted!'});
    
        }
        catch (err) {
            // Log the route and error message and call error handling middlware.
            console.log({Route: `Update ${req.body.model}`, Error: err.message});
            next(err);
        }
    })
    
}

export async function approveRequest(req, res, next, __dirname) {
    // Need to add the data to the requests json file for storage.
    requestsDataMutex.runExclusive(async () => {
        try {
            // Get the request data from the http request body
            const requestData = req.body;

            // Determine if a file needs to be moved to the appropriate model folder (manuals/model)
            let currentFilePath, newFilePath;

            if (requestData.requestType === "Service Manual") {
                newFilePath = `${__dirname}/public/manuals/service_manuals/${requestData.filePath.split("_").splice(-3).join("_")}`;
                currentFilePath = `${__dirname}/public${requestData.filePath}`;
            }
            else if (requestData.requestType === "User Manual") {
                newFilePath = `${__dirname}/public/manuals/user_manuals/${requestData.filePath.split("_").splice(-3).join("_")}`; 
                currentFilePath = `${__dirname}/public${requestData.filePath}`;
            }
            else if (requestData.requestType === "Configurations") {
                const model = requestData.model.toLowerCase();
                const hospital = convertHospitalName(requestData.hospital);

                // Need to complete new config file path.
                newFilePath = `${__dirname}/public/configurations/${hospital}/${model}/${requestData.configPath.split("_").splice(-6).join("_")}`; 
                currentFilePath = `${__dirname}/public${requestData.configPath}`;
            }
            else if (requestData.requestType === "Documents") {
                const model = requestData.model.toLowerCase();

                // Need to complete new config file path.
                newFilePath = `${__dirname}/public/documents/${model}/${requestData.filePath.split("_").splice(-1).join("_")}`; 
                currentFilePath = `${__dirname}/public${requestData.filePath}`;
            }
            
            // Need to read both the device data and the requests data.
            const [deviceData, allRequestsData] = await Promise.all([getAllDeviceData(__dirname), getRequestsData(__dirname)]).catch((err) => {
                if (err.type === "FileHandlingError") {
                    throw new FileHandlingError(err.message, err.cause, err.action, err.route);
                }
                else {
                    throw new ParsingError(err.message, err.cause, err.route);
                }
            });            

            // Find the current model from the device data
            const requestDevice = deviceData.find((entry) => entry.model === requestData.model);

            if (requestData.requestType === "Service Manual") {
                requestDevice.serviceManual = true;
            }
            else if (requestData.requestType === "User Manual") {
                requestDevice.userManual = true;
            }
            else if (requestData.requestType === "Configurations") {
                let currentConfigData = requestDevice.config[requestData.hospital];
                                                    
                // Find any configs which belong to the same department/sublocation.
                const requestLocation = requestData.configPath.split("_").slice(4, 5)[0];

                // Check whether existing entry exists for current location.
                let updatedConfigData;
                let existingLocationEntry;
                
                if (currentConfigData !== undefined) {
                    updatedConfigData = currentConfigData.map((config) => {
                        // Add request data if already exists.
                        const configLocation = config.split("_").slice(2, 3)[0];
                        if (configLocation === requestLocation) {
                            existingLocationEntry = config;
                            return `/${newFilePath.split("/").splice(2).join("/")}`;
                        } 
                        else {
                            return config;
                        }
                    })

                    // If entry does not exist add it to the array.
                    if (!existingLocationEntry) {
                        updatedConfigData.push(`/${newFilePath.split("/").splice(2).join("/")}`);
                    }


                }
                else {
                    // Create the config array if it does not exist for the requested hospital.
                    updatedConfigData = [`/${newFilePath.split("/").splice(2).join("/")}`];
                }

                // Delete existing config file if the file name is different as it will not be overwritten when moving the file.
                if (existingLocationEntry && existingLocationEntry !== newFilePath.split("/").splice(2).join("/")) {
                    const deleteExistingFileResult = await deleteFile(__dirname, existingLocationEntry).catch((err) => {
                        throw new FileHandlingError(err.message, err.cause, err.action, err.route);
                    });
                } 

                // Add the new config data to the hospital property for the model.  
                requestDevice.config[requestData.hospital] = updatedConfigData;
            }
            else if (requestData.requestType === "Documents") {
                const currentDocuments = requestDevice.documents;
                const documentLabel = requestData.label;
                currentFilePath = requestData.filePath;
                const fileName = requestData.filePath.split("/").slice(-1)[0].split("_").slice(-1)[0];
                const fileExtension = fileName.split(".").slice(-1)[0];
                newFilePath = `/documents/${requestData.model}/${documentLabel}.${fileExtension}`;
            
                const existingDocument = currentDocuments.find((entry) => entry.label === documentLabel)
                let updatedDocuments;
                if (existingDocument !== undefined) {
                    updatedDocuments = currentDocuments.map((entry) => {
                        if (entry.label === documentLabel) {
                            return {label: documentLabel, filePath: newFilePath}
                        }
                        return entry
                    })
                }     
                else {
                    currentDocuments.push({label: documentLabel, filePath: newFilePath})
                    updatedDocuments = currentDocuments
                } 
                
                // Delete existing document if label is same but filename different.
                if (existingDocument !== undefined && existingDocument.filePath !== newFilePath) {
                    const deleteExistingFileResult = await deleteFile(__dirname, existingDocument.filePath).catch((err) => {
                        throw new FileHandlingError(err.message, err.cause, err.action, err.route);
                    });
                } 
                
                // Update the requested device documents
                requestDevice.documents = updatedDocuments;
            }

            // Add the request device data all device data.
            const updatedDeviceData = deviceData.map((entry) => {
                if (entry.model === requestData.model) {
                    return requestDevice;
                }
                return entry;
            }); 

            // Remove the current request from the request data since it is approved. 
            const updatedAllRequestsData = removeRequestEntry(allRequestsData, requestData);

            // Rename the file to move it to the appropriate file directory if the request involves a file.
            if (currentFilePath !== undefined) {
                const hospital = requestData.hospital;
                const requestTypeFolderDirectory = requestData.requestType === "Service Manual" ? `manuals/service-manuals/${model}` :
                                                   requestData.requestType === "User Manual" ? `manuals/user-manuals/${model}` :
                                                   requestData.requestType === "Configurations" ? `configurations/${hospital}/${model}` :
                                                   `documents/${model}`

                const fileRenameResult = await moveRequestFile(__dirname, requestTypeFolderDirectory, currentFilePath, newFilePath).catch((err) => {
                    throw new FileHandlingError(err.message, err.cause, err.action, err.route);
                });
            }

            // Write the data to the device and requests files.
            const [devicesFileWriteResult, requestsWriteResult] = await Promise.all([writeAllDeviceData(__dirname, JSON.stringify(updatedDeviceData, null, 2)), writeRequestsData(__dirname, JSON.stringify(updatedAllRequestsData, null, 2))]).catch((err) => {
                throw new FileHandlingError(err.message, err.cause, err.action, err.route);
            });

            // Send the success response message.
            res.json({type: "Success", message: 'Request Approved Successfully!'});
        }
        catch (err) {
            // Log the route and error message and call error handling middleware.
            console.log({Route: `Update ${req.body.model}`, Error: err.message});
            next(err);
        }
    })

    // {
    //     requestType: 'Passwords',
    //     model: 'MX450',
    //     manufacturer: 'Philips Healthcare',
    //     credentialType: 'Service Mode',
    //     requestor: 'Durga Sompalle',
    //     requestorId: '60035155',
    //     staffPhotoExtension: 'JPG',
    //     timestamp: '1702793505578',
    //     passwordData: 'Username: biomedengr'
    // }
    // {
    //     requestType: 'Documents',
    //     model: 'MX450',
    //     manufacturer: 'Philips Healthcare',
    //     requestor: 'Atif Siddiqui',
    //     requestorId: '60146568',
    //     staffPhotoExtension: 'jpg',
    //     timestamp: '1702875929007',
    //     label: 'test1',
    //     filePath: '/requests/MX450/Atif Siddiqui_1702875929007_Book1.csv'
    // }
    // {
    //     requestType: 'Software',
    //     model: 'MX450',
    //     manufacturer: 'Philips Healthcare',
    //     requestor: 'Atif Siddiqui',
    //     requestorId: '60146568',
    //     staffPhotoExtension: 'jpg',
    //     timestamp: '1702875356553',
    //     softwareType: 'service-software',
    //     softwareLocation: 'I:/Staff/Apps/Philips/Support Tool'
    // }

    // {
    //     requestType: 'Configurations',
    //     model: 'MX450',
    //     manufacturer: 'Philips Healthcare',
    //     requestor: 'Atif Siddiqui',
    //     requestorId: '60146568',
    //     staffPhotoExtension: 'jpg',
    //     timestamp: '1702875356553',
    //     hospital: 'Armidale Hospital',
    //     configPath: '/requests/MX450/Atif Siddiqui_1702875356553_mx450_armidale_ICU--Transport_A06-H10-C01-C12_L.01.02_21.12.2023.cfg'
    // }

    // {
    //     requestType: 'Service Manual',
    //     model: 'MX450',
    //     manufacturer: 'Philips Healthcare',
    //     requestor: 'Atif Siddiqui',
    //     requestorId: '60146568',
    //     staffPhotoExtension: 'jpg',
    //     timestamp: '1702875356553',
    //     filePath: '/requests/MX450/Atif Siddiqui_1702875356553_mx450_service_manual.pdf'
    // }

    // {
    //     requestType: 'User Manual',
    //     model: 'MX450',
    //     manufacturer: 'Philips Healthcare',
    //     requestor: 'Atif Siddiqui',
    //     requestorId: '60146568',
    //     staffPhotoExtension: 'jpg',
    //     timestamp: '1702875356553',
    //     filePath: '/requests/MX450/Atif Siddiqui_1702875356553_mx450_user_manual.pdf'
    // }
}

