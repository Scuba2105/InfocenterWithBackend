import multer from 'multer';
import path from 'path';
import { createDirectory, convertHospitalName, capitaliseFirstLetters } from '../utils/utils.mjs';

// Specify the root path
const __dirname = path.dirname('.');

// Used with Multer for storing uploaded files on disk.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const model = req.body.model ? req.body.model.toLowerCase() : null;
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
        else if (file.fieldname === "image-file" && (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')) {
            cb(null, path.join(__dirname, `public/images/equipment`))
        }
        else if (file.fieldname === "employee-photo" && (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')) {
            cb(null, path.join(__dirname, `public/images/staff`))
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
export const cpUpload = upload.fields([{name: 'service_manual', maxCount: 1}, {name: 'user_manual', maxCount: 1}, 
{name: 'configs', maxCount: 1}, {name: 'software', maxCount: 1}, {name: 'file1', maxCount: 1},
{name: 'file2', maxCount: 1}, {name: 'file3', maxCount: 1}, {name: 'file4', maxCount: 1}, {name: 'image-file', maxCount: 1},
{name: 'employee-photo', maxCount: 1}])
