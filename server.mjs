import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import { addNewDeviceData, addNewStaffData, getAllData, updateExistingDeviceData, updateExistingStaffData, generateThermometerRepairRequest } from './controller/controller.mjs';
import { capitaliseFirstLetters } from './utils/utils.mjs';

// Define the root directory and the port for the server 
const __dirname = path.dirname('.');
const PORT = process.env.PORT || 5000;

// Define the express app
const app = express();

// Set cors for any origin during development. Set to same origin for production.  
app.use(cors({origin: '*'}));

// Serve static files. 
app.use(express.static('public'));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Used with Multer for storing uploaded files on disk.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const model = req.body.model ? req.body.model.toLowerCase() : null;
        const documentsFieldRegex = /file[1-4]/;
        
        if (file.fieldname === "service-manual" && file.mimetype === 'application/pdf') {
            cb(null, path.join(__dirname, `public/manuals/service_manuals`))
        }
        else if (file.fieldname === "user-manual" && file.mimetype === 'application/pdf') {
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
        else if (file.fieldname === "image-file" && (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')) {
            cb(null, path.join(__dirname, `public/images/equipment`))
        }
        else if (file.fieldname === "employee-photo" && (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png')) {
            cb(null, path.join(__dirname, `public/images/staff`))
        }
        else if ((file.fieldname === "service-manual" || file.fieldname === "user-manual") && file.mimetype !== 'application/pdf') {
            const fileType = capitaliseFirstLetters(file.fieldname.split('-').join(' '));
            return cb(new Error(`An error occurred trying to save the uploaded ${fileType}. Please check the manual is a pdf and try again`));
        }
        else if ((file.fieldname === "employee-photo" || file.fieldname === "image-file") && (file.mimetype !== 'image/jpeg' || file.mimetype !== 'image/jpg' || file.mimetype !== 'image/png')) {
            const fileType = capitaliseFirstLetters(file.fieldname.split('-').join(' '));
            return cb(new Error(`An error occurred trying to save the uploaded ${fileType}. Please check the image file is either jpg or png and try again`));
        }   
        else {
            return cb(new Error('An unknown error occurred. Please try again and contact the administrator if the issue persists'))
        } 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
  })

// Specify how to handle storage of file uploads. 
const upload = multer({ storage: storage})

// Define the field names to be used with Multer for the uploaded files.
const cpUpload = upload.fields([{name: 'service-manual', maxCount: 1}, {name: 'user-manual', maxCount: 1}, 
{name: 'configs', maxCount: 1}, {name: 'software', maxCount: 1}, {name: 'file1', maxCount: 1},
{name: 'file2', maxCount: 1}, {name: 'file3', maxCount: 1}, {name: 'file4', maxCount: 1}, {name: 'image-file', maxCount: 1},
{name: 'employee-photo', maxCount: 1}])

// Define route to get all data.
app.get("/getData", async (req, res) => {
    try {
        await getAllData(req, res, __dirname);
    } catch (err) {
        next(err);
    }
});

// Define route to update staff or equipment details. 
app.put("/UpdateEntry/:page", (req, res, next) => {
    try {
        cpUpload(req, res, (err) => {
            if (err) {
                next(err);
            }
            else {
                const page = req.params.page; 
                if (page === "technical-info") {
                    updateExistingDeviceData(req, res, __dirname);  
                }
                else if (page === "staff") {
                    updateExistingStaffData(req, res, __dirname); 
                }
            }
        })
    } 
    catch (err) {
        next(err);
    }     
})



// Define route to add new staff or equipment. 
app.post('/AddNewEntry/:page', (req, res, next) => {
    try {
        cpUpload(req, res, (err) => {
            if (err) {
                next(err);
            }
            else {
                const page = req.params.page; 
                if (page === "technical-info") {
                    console.log(req.body, req.files)
                    addNewDeviceData(req, res, __dirname);
                }
                else if (page === "staff") {
                    console.log(req.body, req.files)
                    addNewStaffData(req, res, __dirname);
                }
            }
        })
    } 
    catch (err) {
        next(err);
    }   
})

// define route for processing Genius 3 thermometers
app.put('/Thermometers/:requestType', async (req, res) => {
    const requestType = req.params.requestType;
    if (requestType === "RepairRequestGeneration") {
        try {
            await generateThermometerRepairRequest(req, res, __dirname)
        }
        catch(err) {
            next(err);
        }
    }
});

// Error handler 
app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    console.log(err);
    return res.status(400).json({type: "Error", message: err.message});
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

