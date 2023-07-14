import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import { createDirectory, convertHospitalName, readAllData, readDeviceData, writeDataToFile } from './utils/utils.mjs';
import { capitaliseFirstLetters } from './utils/utils.mjs';
import { error } from 'console';

// Define the root directory and the port for the server 
const __dirname = path.dirname('.');
const PORT = process.env.PORT || 5000;

// Used with Multer for storing uploaded files on disk.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const model = req.body.model.toLowerCase();
        const documentsFieldRegex = /file[1-4]/;
        console.log(file.fieldname, file.originalname, model);
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
        else if (file.fieldname === "image-file") {
            cb(null, path.join(__dirname, `public/images/equipment`))
        }
        else {
            const fileType = capitaliseFirstLetters(file.fieldname.split('-').join(' '));
            cb(new Error(`An error occurred trying to save the uploaded ${fileType}`));
        }    
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
  })


// Specify how to handle storage of file uploads. 
const upload = multer({ storage: storage})

// Define the field names to be used with Multer for the uploaded files.
const cpUpload = upload.fields([{name: 'service_manual', maxCount: 1}, {name: 'user_manual', maxCount: 1}, 
{name: 'configs', maxCount: 1}, {name: 'software', maxCount: 1}, {name: 'file1', maxCount: 1},
{name: 'file2', maxCount: 1}, {name: 'file3', maxCount: 1}, {name: 'file4', maxCount: 1}, {name: 'image-file', maxCount: 1}])

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

app.put("/PutDeviceData", async (req, res) => {
    try {
        cpUpload(req, res, async function (err) {
            if (err) {
                console.log(err.message);
                res.json({type: "Error", message: err.message});
            }
            else {
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
        
        });
    } 
    catch (err) {
        console.error(err);
    }
});

app.post('/AddNewEntry/:page', async (req, res) => {
    try {
        cpUpload(req, res, async function (err) {
            if (err) {
                console.log(err.message);
                res.json({type: "Error", message: err.message});
            }
            else {
                const page = req.params.page; 
                if (page === "technical-info") {
                    console.log(req.body);
                    const allData = await readAllData(__dirname);
                    const deviceData = allData.deviceData;
                    const newModel = req.body.model;
                    const newType = req.body.type;
                    const manufacturer = req.body.manufacturer;
                    const fileExt = req.body.extension;
                    const newDevice = {
                        img: fileExt,
                        type: newType,
                        manufacturer: manufacturer,
                        model: newModel,
                        serviceManual: "",
                        userManual: "",
                        config: "",
                        software: "",
                        documents: "",
                        placeholder2: ""
                      }
                    
                    // Push the new device data to the device data array 
                    const updatedData = [newDevice].push(...deviceData);
                    console.log(updatedData);
                    
                    // // Set the updated data to the all data object
                    // allData.deviceData =  newDeviceData;

                    // // Write the data to file
                    // writeDataToFile(__dirname, JSON.stringify(allData, null, 2));

                    res.json({hello: "Response from the server"});
                }
            }
        })
    }
    catch(err) {
        console.log(err);
    }
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

