import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import { createDirectory, convertHospitalName } from './utils/utils.mjs';

// Define the root directory and the port for the server 
const __dirname = path.dirname('.');
const PORT = process.env.PORT || 5000;

// Used with Multer for storing uploaded files on disk.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
        const model = req.body.model.toLowerCase();
        const documentsFieldRegex = /file[1-4]/;
        
        if (file.fieldname === "service_manual" && file.mimetype === 'application/pdf') {
            cb(null, path.join(__dirname, `infocenter/public/manuals/service_manuals`))
        }
        else if (file.fieldname === "user_manual" && file.mimetype === 'application/pdf') {
            cb(null, path.join(__dirname, `infocenter/public/manuals/user_manuals`))
        } 
        else if (file.fieldname === "configs") {
            const hospital = convertHospitalName(req.body.hospital);
            createDirectory(path.join(__dirname, `infocenter/public/configurations/${hospital}/${model}`))
            cb(null, path.join(__dirname, `infocenter/public/configurations/${hospital}/${model}`))
        }
        else if (documentsFieldRegex.test(file.fieldname)) {
            createDirectory(path.join(__dirname, `infocenter/public/documents/${model}`))
            cb(null, path.join(__dirname, `infocenter/public/documents/${model}`))            
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


const app = express();

app.use(cors({
    origin: '*'
}))

app.get("/getData", (req, res) => {
    try {
        fs.readFile(path.join(__dirname, 'data', 'data.json'), (err, data) => {
            if (err) {
                console.error(err);
            }
            else {
                res.json(JSON.parse(data));
            }
        }); 
    } catch (err) {
        console.error(err);
    }
});

app.put("/putDeviceData", cpUpload, async (req, res) => {
    try {
        console.log(req.files);
        const deviceJSON = fs.readFileSync(path.join(__dirname, 'data', 'data.json'));
        const deviceData = JSON.parse(deviceJSON).deviceData;
        const model = req.body.model;
        const manufacturer = req.body.manufacturer;
        let hospital, configPath;
        const documentKeys = Object.keys(req.body).filter((key) => {
            return /description[1-4]/.test(key);
        });
        
        const updatedDevice = deviceData.find((entry) => {
            return entry.model === model && entry.manufacturer === manufacturer;
        })

        if (Object.keys(req.files).includes('service_manual')) {
            updatedDevice.serviceManual = true;
        }

        if (Object.keys(req.files).includes('user_manual')) {
            updatedDevice.userManual = true;
        }

        if (Object.keys(req.files).includes('configs')) {
            hospital = convertHospitalName(req.body.hospital);
            configPath = `/configurations/${hospital}/${model}/${req.files.configs[0].originalname.split('.').slice(0, -1).join('.')}`
        }

        if (Object.keys(req.body).includes('software')) {
            updatedDevice.software = req.body.software;
        }
       
        if (documentKeys.length !== 0) {
            const documentsInfo = [];
            documentKeys.forEach((key, index) => {
                const keyObjectDetails = {label: key, filePath: `/documents/${model}/${req.files[`file${index + 1}`][0].originalname}`} 
                documentsInfo.push(keyObjectDetails);
            });
            updatedDevice.documents = documentsInfo;
        }

        console.log(updatedDevice);
    } catch (err) {
        console.error(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

