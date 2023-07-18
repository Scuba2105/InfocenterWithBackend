import {readAllData, readDeviceData, writeDataToFile, generateNewDeviceData, generateNewStaffData, determineTeam } from '../utils/utils.mjs';
import { updateStaffEntry } from '../models/models.mjs';

export async function getAllData(req, res, __dirname) {
    try {
        const data = await readAllData(__dirname);
        res.json(data);
    }
    catch(error) {
        console.log(error);
    }
}

export async function updateExistingDeviceData(req, res, __dirname) {
    try {
        const allData = await readAllData(__dirname);
        const deviceData = allData.deviceData;

        // Define the variables from the uploaded data
        const model = req.body.model;
        const manufacturer = req.body.manufacturer;
        let hospital, configPath;
        const documentKeys = Object.keys(req.body).filter((key) => {
            return /description[1-4]/.test(key);
        });
            
        // Retrieve the current data for the updated device
        const updatedDevice = deviceData.find((entry) => {
            return entry.model === model && entry.manufacturer === manufacturer;
        })

        // Update the device details if corresponding key exists in form data
        if (Object.keys(req.files).includes('service_manual')) {
            updatedDevice.serviceManual = true;
        }

        if (Object.keys(req.files).includes('user_manual')) {
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

        // Replace the old device data in the DeviceData array with the new data that has been entered 
        const updatedDeviceData = deviceData.map((entry) => {
            if (entry.model === model && entry.manufacturer === manufacturer) {
                return updatedDevice
            }
            else {
                return entry;
            }
        })

        const updatedAllData = {staffData: allData.staffData, deviceData: updatedDeviceData} 
        // Write the data to file
        writeDataToFile(__dirname, JSON.stringify(updatedAllData, null, 2));

        // Send the success response message.
        res.json({type: "Success", message: 'Data Upload Successful'});
    }           
    catch (err) {
        // Send the error response message.
        res.json({type: "Error", message: `An error occurred while updating the data: ${err.message}.\r\n Please try again and if issue persists contact administartor`});
    }
}

export async function addNewDeviceData(req, res, __dirname) {
    try {

        // Get the current device data 
        const allData = await readAllData(__dirname);
        const deviceData = allData.deviceData;

        // Get the new device data from the request object
        const newModel = req.body.model;
        const newType = req.body.type;
        const manufacturer = req.body.manufacturer;
        const fileExt = req.body.extension;
        
        // Create the new data for the added device 
        const newDevice  = generateNewDeviceData(fileExt, newType, manufacturer, newModel);
                        
        // Push the new device data to the current device data array 
        deviceData.push(newDevice);
                                    
        // Set the updated data to the all data object
        const updatedAllData = {staffData: allData.staffData, deviceData: deviceData}
        
        // Write the data to file
        writeDataToFile(__dirname, JSON.stringify(updatedAllData, null, 2));

        // Send the success response message.
        res.json({type: "Success", message: 'Data Upload Successful'});
    }
    catch(err) {
        // Send the error response message.
        res.json({type: "Error", message: `An error occurred while updating the data: ${err.message}.\r\n Please try again and if issue persists contact administartor`});
    }
}

export async function addNewStaffData(req, res, __dirname) {
    try {
        // Get the current device data 
        const allData = await readAllData(__dirname);
        const staffData = allData.staffData;

        // Define the mandatory data in the request body
        const name = req.body.name;
        const id = req.body.id;
        const workshop = req.body.workshop;
        const position = req.body.position;
        const officePhone = req.body["office-phone"];
        const team = determineTeam(position, workshop);

        // Generate a new staff data object
        const newStaffData = generateNewStaffData(name, id, workshop, position, officePhone, team)   

        // Add any optional data provided to the data object
        const optionalData = {"dect-phone": "dectPhone", "work-mobile": "workMobile", "personal-mobile": "personalMobile",
        "extension": "img"};

        // Loop over optional data and add to data object
        Object.keys(optionalData).forEach((key) => {
            if (req.body[key]) {
                newStaffData[optionalData[key]] = req.body[key];
            }
        });

        // Append the new staff data 
        staffData.push(newStaffData);

        // Set the updated data to the staffData property 
        const updatedAllData = {staffData: staffData, deviceData: allData.deviceData}

        // Write the data to file
        writeDataToFile(__dirname, JSON.stringify(updatedAllData, null, 2));

        // Send the success response message.
        res.json({type: "Success", message: 'Data Upload Successful'});    
    } catch (err) {
        // Send the error response message.
        res.json({type: "Error", message: `An error occurred while updating the data: ${err.message}.\r\n Please try again and if issue persists contact administartor`});
    }
}

export async function updateExistingStaffData(req, res, __dirname) {
    try {
        // Get the current device data 
        const allData = await readAllData(__dirname);
        const staffData = allData.staffData;

        // Get the staff ID and find the existing employee data
        const existingId = req.body["existing-id"];
        const currentData = staffData.find((entry) => {
            return entry.id === existingId;
        })
                
        // Update the data based on the key value pairs in the request body.
        const updatedData = updateStaffEntry(req, currentData);

        console.log(updatedData);
    } catch (err) {
        // Send the error response message.
        res.json({type: "Error", message: `An error occurred while updating the data: ${err.message}.\r\n Please try again and if issue persists contact administartor`});
    }
    
}