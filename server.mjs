import express from 'express';
import path from 'path';
import fs from 'fs';
import https from 'https';
import cors from 'cors';
import multer from 'multer';
import { changeLoginPassword, validateLoginCredentials, getAllData } from './controller/controller.mjs'
import { addNewStaffData, updateExistingStaffData } from './controller/staff-controller.mjs'
import { addNewDeviceData, updateExistingDeviceData, updateDeviceConfiguration, deleteExistingConfiguration, deleteExistingDocument } from './controller/device-controller.mjs'
import { addNewContactData, updateContactData } from './controller/contacts-controller.mjs';
import { updateServiceRequestForms } from './controller/forms-templates-controller.mjs';
import { updateTestingProgressData, resetTestingProgressData } from './controller/testing-templates-controller.mjs';
import { updateOnCallData } from "./controller/on-call-controller.mjs";
import { handleDeviceUpdateRequest, getAllRequestsData } from './controller/requests-controller.mjs';
import { FileHandlingError, ParsingError, DBError } from './error-handling/file-errors.mjs';
import { capitaliseFirstLetters, createDirectory, convertHospitalName } from './utils/utils.mjs';
import { generateThermometerRepairRequest, getThermometerBatch, updateThermometerList, 
    getInactiveThermometers, disposeSelectedThermometers } from './controller/thermometers-controller.mjs';

// Define the root directory and the port for the server. This is a test comment for robocopy.
const __dirname = path.dirname('.');
const PORT = process.env.PORT || 5000;

// Define the express app
const app = express();

// This sets the credentials for the HTTPS server based on the ssl credentials.
// Certificate Password: hnect-cert-password123456.
let certPassword;
if (process.env.NODE_ENV !== "production") {
    certPassword = 'hnect-dev-cert-password123456'
}
else if (process.env.NODE_ENV === "production") {
    certPassword = 'hnect-cert-password123456'
}
const options = {
    key: fs.readFileSync(`${__dirname}/key.pem`),
    pfx: fs.readFileSync(`${__dirname}/hnect_cert.pfx`),
    passphrase: certPassword
};

// Set cors for any origin during development. Set to same origin for production.  
if (process.env.NODE_ENV !== "production") {
    app.use(cors({origin: '*'}));
}

// set custom route for profile images so response headers can be set to no cache.
// This allows the avatar and photo to update on change. 
app.get("/images/staff/:filename", async (req, res, next) => {
    try {
        const filename = req.params.filename;
        const fileType = filename.split('.')[1];
        res.header('Content-Type', `image/${fileType}`);
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.sendFile(`public/images/staff/${filename}`, { root: __dirname });
    } 
    catch (err) {
        next(err);
    }
})

// Use this middleware for serving static
app.use(express.static('public'));
app.use(express.static('infocenter/build'));

// Parse JSON bodies (as sent by API clients).
app.use(express.json());

// Used with Multer for storing uploaded files on disk.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        // Get the model 
        const model = req.body.model ? req.body.model.toLowerCase() : null;
        const documentsFieldRegex = /file[1-4]/;
        
        // handle any resource requests in a separate path first as they use same fieldnames as device updates
        if (req.body["request-type"] === "update-request") {
            if ((file.fieldname === "service-manual" || file.fieldname === "user-manual") && file.mimetype !== 'application/pdf') {
                const fileType = capitaliseFirstLetters(file.fieldname.split('-').join(' '));
                return cb(new Error(`The uploaded file is not of the correct type. Please check the manual is a PDF and try again`));
            }
            createDirectory(path.join(__dirname, `public/requests/${model}`));
            cb(null, path.join(__dirname, `public/requests/${model}`));
        }
        else {
            
            if (file.fieldname === "service-manual" && file.mimetype === 'application/pdf') {
                cb(null, path.join(__dirname, `public/manuals/service_manuals`))
            }
            else if (file.fieldname === "user-manual" && file.mimetype === 'application/pdf') {
                cb(null, path.join(__dirname, `public/manuals/user_manuals`));
            } 
            else if (file.fieldname === "configs") {
                const hospital = convertHospitalName(req.body.hospital);
                createDirectory(path.join(__dirname, `public/configurations/${hospital}/${model}`));
                cb(null, path.join(__dirname, `public/configurations/${hospital}/${model}`));
            }
            else if (documentsFieldRegex.test(file.fieldname)) {
                createDirectory(path.join(__dirname, `public/documents/${model}`));
                cb(null, path.join(__dirname, `public/documents/${model}`));            
            }  
            else if (file.fieldname === "image-file" && (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png')) {
                cb(null, path.join(__dirname, `public/images/equipment`));
            }
            else if (file.fieldname === "employee-photo" && (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png')) {
                cb(null, path.join(__dirname, `public/images/staff`));
            }
            else if (file.fieldname === "updated-config-file") {
                const hospital = convertHospitalName(req.body.hospital);
                cb(null, path.join(__dirname, `public/configurations/${hospital}/${model}`));
            }
            else if (file.fieldname === "updated-document") {
                cb(null, path.join(__dirname, `public/documents/${model}`));
            } 
            else if ((file.fieldname === "service-request-form") && (file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype === 'application/msword')) {
                const staffId = req.params.UserId;
                createDirectory(path.join(__dirname, `public/forms-templates/service-requests/${staffId}`));
                cb(null, path.join(__dirname, `public/forms-templates/service-requests/${staffId}`));
            }
            else if ((file.fieldname === "service-request-form") && (file.mimetype !== 'application/pdf' || file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype !== 'application/msword')) {
                return cb(new Error(`The error occurred trying to save the uploaded file because the file extension is incorrect. Please check the manual is a PDF or word document and try again`));    
            }
            else if ((file.fieldname === "service-manual" || file.fieldname === "user-manual") && file.mimetype !== 'application/pdf') {
                const fileType = capitaliseFirstLetters(file.fieldname.split('-').join(' '));
                return cb(new Error(`The uploaded file is not of the correct type. Please check the manual is a PDF and try again`));
            }
            else if ((file.fieldname === "employee-photo" || file.fieldname === "image-file") && (file.mimetype !== 'image/jpeg' || file.mimetype !== 'image/jpg' || file.mimetype !== 'image/png')) {
                const fileType = capitaliseFirstLetters(file.fieldname.split('-').join(' '));
                return cb(new Error(`An error occurred trying to save the uploaded ${fileType}. Please check the image file is either jpg or png and try again`));
            }   
            else {
                return cb(new Error('An unknown error occurred with the file upload. Please try again and contact the administrator if the issue persists'))
            } 
        }
    },
    filename: function (req, file, cb) {
        if (req.body["request-type"] === "update-request") {
            cb(null, `${req.body.username}_${req.body.timestamp}_${file.originalname}`);
        }
        else {
            cb(null, file.originalname);
        }
        
    }
  })

// Specify how to handle storage of file uploads. 
const upload = multer({ storage: storage})

// Define the field names to be used with Multer for the uploaded files.
const cpUpload = upload.fields([{name: 'service-manual', maxCount: 1}, {name: 'user-manual', maxCount: 1}, 
{name: 'configs', maxCount: 1}, {name: 'software', maxCount: 1}, {name: 'file1', maxCount: 1},
{name: 'file2', maxCount: 1}, {name: 'file3', maxCount: 1}, {name: 'file4', maxCount: 1}, {name: 'image-file', maxCount: 1},
{name: 'employee-photo', maxCount: 1}, {name: 'updated-document', maxCount: 1}, {name: 'service-request-form', maxCount: 1},
{name: 'updated-config-file', maxCount: 1}]);

app.get("/", async (req, res, next) => {
    try {
        res.sendFile("infocenter/build/index.html", { root: __dirname });
    } 
    catch (err) {
        next(err);
    }
})

app.post("/VerifyLogin", async (req, res, next) => {
    validateLoginCredentials(req, res, next, __dirname)
});

app.post("/ChangePassword", async (req, res, next) => {
    changeLoginPassword(req, res, next, __dirname)
});

// Define route to get all data.
app.get("/getData/:staffId", async (req, res, next) => {
    getAllData(req, res, next, __dirname);
});

// Define route to update staff or equipment details. 
app.put("/UpdateEntry/:page", (req, res, next) => {
    cpUpload(req, res, (err) => {
        const page = req.params.page; 
        if (err) {
            next(err);
        }
        else {
            if (page === "technical-info") {
                updateExistingDeviceData(req, res, next, __dirname);  
            }
            else if (page === "staff") {
                updateExistingStaffData(req, res, next, __dirname); 
            }
        }
    })
})

// Define the route for handling the device resource update requests.
app.put("/RequestDeviceUpdate", (req, res, next) => {
    cpUpload(req, res, (err) => {
        if (err) {
            next(err);
        }
        else {
            handleDeviceUpdateRequest(req, res, next, __dirname);
        }
    })
})

// Define route to add new staff or equipment. 
app.post('/AddNewEntry/:page', (req, res, next) => {
    cpUpload(req, res, (err) => {
        if (err) {
            next(err);
        }
        else {
            const page = req.params.page; 
            if (page === "technical-info") {
                addNewDeviceData(req, res, next, __dirname);
            }
            else if (page === "staff") {
                addNewStaffData(req, res, next, __dirname);
            }
        }
    })
})

// Define route to update existing equipment configuration files. 
app.put("/UpdateConfigurations", (req, res, next) => {
    cpUpload(req, res, (err) => {
        if (err) {
            next(err);
        }
        else {
            updateDeviceConfiguration(__dirname, req, res, next);
        }
    })
})

// Define route to delete equipment documents. 
app.delete("/DeleteConfiguration", (req, res, next) => {
    deleteExistingConfiguration(req, res, next, __dirname);
})

// Define route to upload equipment documents. 
app.put("/UpdateDocuments", (req, res, next) => {
    cpUpload(req, res, (err) => {
        if (err) {
            next(err);
        }
        else {
            // Send the success response message.
            res.json({type: "Success", message: 'Data Upload Successful'}); 
        }
    })
})

// Define route to delete equipment documents. 
app.delete("/DeleteDocument", (req, res, next) => {
    deleteExistingDocument(req, res, next, __dirname);
})

// Define route to add new hne staff contacts or vendor contacts. 
app.post('/AddNewContact/:formType', (req, res, next) => {
    addNewContactData(req, res, next, __dirname); 
})

// Define route to add new hne staff contacts or vendor contacts. 
app.post('/UpdateContact/:formType', (req, res, next) => {
    updateContactData(req, res, next, __dirname); 
})

// Define the route to update the service request forms available.  
app.put("/UpdateServiceRequestForms/:UserId", (req, res, next) => {
    cpUpload(req, res, (err) => {
        if (err) {
            next(err);
        }
        else {
            // Get the current user ID from the request body
            const userId = req.params.UserId
            updateServiceRequestForms(__dirname, userId, req, res, next);            
        }
    })
})

// Update the testing data.
app.put('/UpdateTestingData', (req, res, next) => {
    updateTestingProgressData(req, res, next, __dirname); 
})

// Reset the testing data.
app.put('/ResetTestingProgress', (req, res, next) => {
    resetTestingProgressData(req, res, next, __dirname); 
})

// Define route to update on-call details. 
app.post('/OnCall/:operation', (req, res, next) => {
    updateOnCallData(req, res, next, __dirname); 
})

// Define the route for getting requests data
app.get('/GetRequestsData', (req, res, next) => {
    getAllRequestsData(req, res, next, __dirname); 
})

// define route for processing Genius 3 thermometers
app.put('/Thermometers/:requestType', async (req, res, next) => {
    const requestType = req.params.requestType;
    
    if (requestType === "RepairRequestGeneration") {
        try {
            await generateThermometerRepairRequest(req, res, __dirname)
        }
        catch(err) {
            next(err);
        }
    }
    else if (requestType === "CheckReturns") {
        try {
            await getThermometerBatch(req, res, __dirname)
        }
        catch(err) {
            next(err);
        }
    }
    else if (requestType === "UpdateReturns") {
        try {
            await updateThermometerList(req, res, __dirname);
        }
        catch(err) {
            next(err);
        }
    }
    else if (requestType === "GetInactive") {
        try {
            await getInactiveThermometers(req, res, __dirname);
        }
        catch(err) {
            next(err);
        }
    }
    else if (requestType === "Disposals") {
        try {
            await disposeSelectedThermometers(req, res, __dirname);
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
    if (["FileHandlingError", "DBError", "ParsingError"].includes(err.type)) {
        res.status(err.httpStatusCode).json({type: "Error", message: err.message});
    }
    else {
        res.status(400).json({type: "Error", message: `An  error occurred while completing the request. ${err.message} If the issue persists please contact and administrator`});
    }
});

// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS Server is listening on port ${PORT}`);
});

