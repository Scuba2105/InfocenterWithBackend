import {readAllData, readDeviceData, writeDataToFile } from './utils/utils.mjs';

export async function getAllData(req, res) {
    try {
        const data = await readAllData(__dirname);
        res.json(data);
    }
    catch(error) {
        console.log(error)
    }
}

export async function updateExistingDeviceData(req, res) {
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

            // Send the updated device's new data as a response.
            res.json({type: "Success", message: 'Data Upload Successful'});
    }           
    catch (err) {
        console.error(err);
    }
}