import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import { cpUpload } from './file-handling.mjs';
import { addNewDeviceData, getAllData, updateExistingDeviceData } from './controller/controller.mjs';


// Define the root directory and the port for the server 
const rootDirectory = path.dirname('.');
const PORT = process.env.PORT || 5000;

// Define the express app
const app = express();

// Set cors for any origin during development. Set to same origin for production.  
app.use(cors({
    origin: '*'
}))

// Serve static files 
app.use(express.static('public'))

app.get("/getData", async (req, res) => {
    try {
        await getAllData(req, res, rootDirectory);
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
                updateExistingDeviceData(req, res, rootDirectory);        
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
                res.json({type: "Error", message: err.message});
            }
            else {
                const page = req.params.page; 
                if (page === "technical-info") {
                    addNewDeviceData(req, res, rootDirectory);
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

