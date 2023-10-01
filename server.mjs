import express from 'express';
import path from 'path';
import fs from 'fs';
import https from 'https';
import cors from 'cors';
import multer from 'multer';
import { changeLoginPassword, validateLoginCredentials, getAllData } from './controller/controller.mjs'
import { addNewStaffData, updateExistingStaffData } from './controller/staff-controller.mjs'
import { addNewDeviceData, updateExistingDeviceData } from './controller/device-controller.mjs'
import { addNewContactData, updateContactData } from './controller/contacts-controller.mjs';
import { capitaliseFirstLetters, createDirectory, convertHospitalName } from './utils/utils.mjs';
import { generateThermometerRepairRequest, getThermometerBatch, updateThermometerList, 
    getInactiveThermometers, disposeSelectedThermometers } from './controller/thermometers-controller.mjs';

// Define the root directory and the port for the server. This is a test comment for robocopy.
const __dirname = path.dirname('.');
const PORT = process.env.PORT || 5000;

// Define the express app
const app = express();

// This sets the credentials for the HTTPS server based on the ssl credentials. Read the appropriate credentials whether in dev or production
// Certificate Password: hnect-cert-password123456.
let options;

if (process.env.NODE_ENV !== "production") {
    options = {
        key: fs.readFileSync(`${__dirname}/key.pem`),
        pfx: fs.readFileSync(`${__dirname}/hnect_cert.pfx`),
        passphrase: 'hnect-cert-password123456'
    };
}
else {
    options = {
        key: fs.readFileSync(`${__dirname}/key.pem`),
        pfx: fs.readFileSync(`${__dirname}/hnect_cert.pfx`),
        passphrase: 'hnect-cert-password123456'
    };
}

// Set cors for any origin during development. Set to same origin for production.  
if (process.env.NODE_ENV !== "production") {
    app.use(cors({origin: '*'}));
}

// set custom route for profile images so response headers can be set to no cache.
app.get("/images/staff/:filename", async (req, res, next) => {
    try {
        const filename = req.params.filename;
        const fileType = filename.split('.')[1];
        res.header('Content-Type', `image/${fileType}`);
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.sendFile(`public/images/staff/${filename}`, { root: __dirname });
    } 
    catch (error) {
        console.log(error);
        next();
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
        else if (file.fieldname === "image-file" && (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png')) {
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

app.get("/", async (req, res, next) => {
    try {
        res.sendFile("infocenter/build/index.html", { root: __dirname });
    } 
    catch (error) {
        res.send(error.message);
    }
})

app.post("/VerifyLogin", async (req, res, next) => {
    try {
        await validateLoginCredentials(req, res, __dirname)
    } catch (err) {
        next(err);
    }
});

app.post("/ChangePassword", async (req, res, next) => {
    try {
        await changeLoginPassword(req, res, __dirname)
    } catch (err) {
        next(err);
    }
});

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
                    addNewDeviceData(req, res, __dirname);
                }
                else if (page === "staff") {
                    addNewStaffData(req, res, __dirname);
                }
            }
        })
    } 
    catch (err) {
        next(err);
    }   
})

// Define route to add new hne staff contacts or vendor contacts. 
app.post('/AddNewContact/:formType', (req, res, next) => {
    try {
       addNewContactData(req, res, __dirname); 
    } catch (err) {
        next(err);
    }
})

// Define route to add new hne staff contacts or vendor contacts. 
app.post('/UpdateContact/:formType', (req, res, next) => {
    try {
       updateContactData(req, res, __dirname); 
    } catch (err) {
        next(err);
    }
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
    console.log(JSON.stringify({Route: "Error Handler Middleware", Error: err.message}), null, 2);
    return res.status(400).json({type: "Error", message: err.message});
});

// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS Server is listening on port ${PORT}`);
});

