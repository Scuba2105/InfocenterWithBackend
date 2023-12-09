import { getAllDeviceData, writeAllDeviceData, deleteDocumentFile, generateNewDeviceData } from '../models/device-models.mjs';
import { convertHospitalName } from '../utils/utils.mjs';
import { Mutex } from 'async-mutex';
import { FileHandlingError, DBError, ParsingError } from '../error-handling/file-errors.mjs';

// Assists with preventing race conditions. 
const deviceDataMutex = new Mutex();

export async function addNewDeviceData(req, res, next, __dirname) {
    
    deviceDataMutex.runExclusive(async () => {
        try {
            // Get the current device data. 
            const deviceData = await getAllDeviceData(__dirname).catch((err) => {
                if (err.type === "FileHandlingError") {
                    throw new FileHandlingError(err.message, err.cause, err.action, err.route);
                }
                else {
                    throw new ParsingError(err.message, err.cause, err.route);
                }
            });
        
            // Get the new device data from the request object.
            const newModel = req.body.model;
            const newType = req.body.type;
            const manufacturer = req.body.manufacturer;
            const vendor = req.body.vendor;
            const fileExt = req.body.extension;
        
            // Create the new data for the added device.
            const newDevice  = generateNewDeviceData(fileExt, newType, manufacturer, vendor, newModel);
                            
            // Push the new device data to the current device data array. 
            deviceData.push(newDevice);
                                        
            // Write the data to file.
            const fileWriteResult = await writeAllDeviceData(__dirname, JSON.stringify(deviceData, null, 2)).catch((err) => {
                throw new FileHandlingError(err.message, err.cause, err.action, err.route);
            });

            // Send the success response message.
            res.json({type: "Success", message: 'Data Upload Successful'});
    
        }
        catch(err) {
            // Log the route and error message and call error handling middlware.
            console.log({Route: "Add New Device", Error: err.message});
            next(err);   
        }
    })
}

export async function updateExistingDeviceData(req, res, next, __dirname) {
    deviceDataMutex.runExclusive(async () => {
        try {
            const deviceData = await getAllDeviceData(__dirname).catch((err) => {
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
            const documentKeys = Object.keys(req.body).filter((key) => {
                return /description[1-4]/.test(key);
            });
                
            // Retrieve the current data for the updated device.
            const updatedDevice = deviceData.find((entry) => {
                return entry.model === model && entry.manufacturer === manufacturer;
            })
            
            // Update the device details if corresponding key exists in form data.
            if (Object.keys(req.files).includes('service-manual')) {
                updatedDevice.serviceManual = true;
            }

            if (Object.keys(req.files).includes('user-manual')) {
                updatedDevice.userManual = true;
            }
        
            if (Object.keys(req.files).includes('configs')) {
                const hospital = req.body.hospital;
                const hospitalDirectory = convertHospitalName(hospital);
                const configPath = `/configurations/${hospitalDirectory}/${model}/${req.files.configs[0].originalname}`
                if (Object.keys(updatedDevice.config).includes(hospital)) {
                    updatedDevice.config[hospital].push(configPath)
                } 
                else if (updatedDevice.config === "") {
                    updatedDevice.config = {};
                    updatedDevice.config[hospital] = [configPath];
                }
                else {
                    updatedDevice.config[hospital] = [configPath];
                }
            }

            if (Object.keys(req.body).includes('software')) {
                const softwareData = req.body.software;
                const softwareDataArray = softwareData.split('=');
                const softwareType = softwareDataArray[0];
                const softwareLocation = softwareDataArray[1];
                    
                if (typeof updatedDevice.software !== "object") {
                    updatedDevice.software = {[softwareType]: softwareLocation};
                }
                else {
                    updatedDevice.software[softwareType] = softwareLocation;
                }
            }
        
            if (documentKeys.length !== 0) {
                if (typeof updatedDevice.documents === 'string') {
                    const documentsInfo = [];
                    documentKeys.forEach((key, index) => {
                        const keyObjectDetails = {label: req.body[key], filePath: `/documents/${model}/${req.files[`file${index + 1}`][0].originalname}`} 
                        documentsInfo.push(keyObjectDetails);
                    });
                    updatedDevice.documents = documentsInfo;
                }
                else {
                    documentKeys.forEach((key, index) => {
                        const keyObjectDetails = {label: req.body[key], filePath: `/documents/${model}/${req.files[`file${index + 1}`][0].originalname}`} 
                        updatedDevice.documents.push(keyObjectDetails);
                    });
                }
            }

            if (Object.keys(req.body).includes("restricted-access-type")) {
                 
                // Create the new password data object
                const restrictedAccessType = `${req.body["restricted-access-type"]}`;
                const passwordDataObject = `${req.body["credential-type"]}: ${req.body["credential-value"]}`;

                // Get the existing password data.
                const passwordData = updatedDevice.passwords;

                // If password data doesn't exist create the password array and enter the new data object.
                if (passwordData === "" || passwordData === undefined) {
                    updatedDevice.passwords = [];
                    updatedDevice.passwords.push({type: restrictedAccessType, values: [passwordDataObject]});
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
                        passwordData.push({type: restrictedAccessType, values: [passwordDataObject]});
                    }
                    else {
                        existingRestrictedAccessData.values.push(passwordDataObject);
                    }
                }
                
            }
            
            // Replace the old device data in the DeviceData array with the new data that has been entered 
            const updatedDeviceData = deviceData.map((entry) => {
                if (entry.model === model && entry.manufacturer === manufacturer) {
                    return updatedDevice
                }
                else {
                    return entry;
                }
            })

            // Write the data to file.
            const fileWriteResult = await writeAllDeviceData(__dirname, JSON.stringify(updatedDeviceData, null, 2)).catch((err) => {
                throw new FileHandlingError(err.message, err.cause, err.action, err.route);
            });

            // Send the success response message.
            res.json({type: "Success", message: 'Data Upload Successful'});
    
        }
        catch (err) {
            // Log the route and error message and call error handling middlware.
            console.log({Route: `Update ${req.body.model}`, Error: err.message});
            next(err);
        }
    })
}

export function deleteExistingDocument(req, res, next, __dirname) {
    deviceDataMutex.runExclusive(async () => {
        try {
            // Read the device data.
            const deviceData = await getAllDeviceData(__dirname).catch((err) => {
                if (err.type === "FileHandlingError") {
                    throw new FileHandlingError(err.message, err.cause, err.action, err.route);
                }
                else {
                    throw new ParsingError(err.message, err.cause, err.route);
                }
            });
            
            // Define the variables from the uploaded data.
            const model = req.body.model;
            const description = req.body.document.description;
            const filepath = req.body.document.link;

            // Get the model data from the device data
            const modelData = deviceData.find((entry) => {
                return entry.model === model
            })

            // Remove the entry from the model documents.
            const modelDocuments = modelData.documents.filter((entry) => {
                return entry.label !== description
            });

            modelData.documents = modelDocuments;
            
            // Update the device data 
            const updatedDeviceData = deviceData.map((entry) => {
                if (entry.model === model) {
                    return modelData
                }
                else {
                    return entry
                }
            })
            
            // Complete the write to file and delete document from file concurrently as they are not dependent.
            const deletionResult = await Promise.all([
                writeAllDeviceData(__dirname, JSON.stringify(updatedDeviceData, null, 2)),
                deleteDocumentFile(__dirname, filepath)]).catch((err) => {
                    throw new FileHandlingError(err.message, err.cause, err.action, err.route);
                });

            // Send the success response message.
            res.json({type: "Success", message: 'Document Successfully Deleted'});

        }
        catch (err) {
            // Log the route and error message and call error handling middlware.
            console.log({Route: `Delete Document`, Error: err.message});
            next(err);         
        }
    })
}

