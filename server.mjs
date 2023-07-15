import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import { getAllData, updateExistingDeviceData } from './controller/controller.mjs';
import { createDirectory, convertHospitalName } from './utils/utils.mjs';
import { capitaliseFirstLetters } from './utils/utils.mjs';

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
        await getAllData(req, res);
    } catch (err) {
        console.error(err);
    }
});

app.put("/PutDeviceData", async (req, res) => {
    try {
        cpUpload(req, res, async function (err) {
            if (err) {
                res.json({type: "Error", message: err.message});
            }
            else {
                updateExistingDeviceData(req, res);        
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
                        serviceManual: false,
                        userManual: false,
                        config: "",
                        software: "",
                        documents: "",
                        placeholder2: ""
                      }
                    
                    // Push the new device data to the device data array 
                    deviceData.push(newDevice);
                                        
                    // Set the updated data to the all data object
                    const updatedAllData = {staffData: allData.staffData, deviceData: deviceData}
                    
                    // Write the data to file
                    writeDataToFile(__dirname, JSON.stringify(updatedAllData, null, 2));

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

