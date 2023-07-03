import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import { createDirectory, convertHospitalName, readAllData, readDeviceData, writeDataToFile } from './utils/utils.mjs';

// Define the root directory and the port for the server 
const __dirname = path.dirname('.');
const PORT = process.env.PORT || 5000;

// Used with Multer for storing uploaded files on disk.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const model = req.body.model.toLowerCase();
        const documentsFieldRegex = /file[1-4]/;
        
        if (file.fieldname === "service_manual" && file.mimetype === 'application/pdf') {
            cb(null, path.join(__dirname, `public/manuals/service_manuals`))
        }
        else if (file.fieldname === "user_manual" && file.mimetype === 'application/pdf') {
            cb(null, path.join(__dirname, `public/manuals/user_manuals`))
        } 
        else if (file.fieldname === "configs") {
            const hospital = convertHospitalName(req.body.hospital);
            createDirectory(path.join(__dirname, `public/configurations/${hospital}/${model}`))
            cb(null, path.join(__dirname, `public/configurations/${hospital}/${model}`))
        }
        else if (documentsFieldRegex.test(file.fieldname)) {
            createDirectory(path.join(__dirname, `public/documents/${model}`))
            cb(null, path.join(__dirname, `public/documents/${model}`))            
        }  
        else {
            console.log(`The uploaded ${file.originalname} was not stored in a directory!`);
        }    
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
  })

// Used for testing
//const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage: storage })

// Define the field names to be used with Multer for the uploaded files.
const cpUpload = upload.fields([{name: 'service_manual', maxCount: 1}, {name: 'user_manual', maxCount: 1}, 
{name: 'configs', maxCount: 1}, {name: 'software', maxCount: 1}, {name: 'file1', maxCount: 1},
{name: 'file2', maxCount: 1}, {name: 'file3', maxCount: 1}, {name: 'file4', maxCount: 1}])

// Define the express app
const app = express();

// Set cors for any origin
app.use(cors({
    origin: '*'
}))

// Serve static files 
app.use(express.static('public'))

app.get("/getData", async (req, res) => {
    try {
        const data = await readAllData(__dirname);
        res.json(data);
    } catch (err) {
        console.error(err);
    }
});

app.put("/putDeviceData", cpUpload, async (req, res) => {
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
        res.json(updatedDevice);
    } catch (err) {
        console.error(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

