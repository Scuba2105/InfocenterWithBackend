import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import multer from 'multer';

// Used with Multer for storing uploaded files on disk.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/tmp/my-uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

// Used for testing
const upload = multer({ dest: 'uploads/' })
//const upload = multer({ storage: storage })

const __dirname = path.dirname('.');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({
    origin: '*'
}))

app.get("/getData", (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'data.json'), (err, data) => {
        if (err) {
            console.error(err);
        }
        else {
            res.json(JSON.parse(data));
        }
    });
    
})

const cpUpload = upload.fields([{name: 'service_manual', maxCount: 1}, {name: 'user_manual', maxCount: 1}, 
{name: 'configs', maxCount: 1}, {name: 'software', maxCount: 1}, {name: 'file1', maxCount: 1},
{name: 'file2', maxCount: 1}, {name: 'file3', maxCount: 1}, {name: 'file4', maxCount: 1}])
app.put("/putDeviceData", cpUpload, (req, res) => {
    console.log(req.files);
    console.log(req.body);
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})