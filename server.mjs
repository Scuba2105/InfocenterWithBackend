import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import { cpUpload } from './file-handling/file-uploads.mjs';
import { addNewDeviceData, addNewStaffData, getAllData, updateExistingDeviceData, updateExistingStaffData, generateRepairRequest } from './controller/controller.mjs';


// Define the root directory and the port for the server 
const rootDirectory = path.dirname('.');
const PORT = process.env.PORT || 5000;

// Define the express app
const app = express();

// Set cors for any origin during development. Set to same origin for production.  
app.use(cors({origin: '*'}));

// Serve static files. 
app.use(express.static('public'));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.get("/getData", async (req, res) => {
    try {
        await getAllData(req, res, rootDirectory);
    } catch (err) {
        console.error(err);
    }
});

app.put("/UpdateEntry/:page", async (req, res) => {
    try {
        cpUpload(req, res, async function (err) {
            if (err) {
                res.json({type: "Error", message: err.message});
            }
            else {
                const page = req.params.page; 
                if (page === "technical-info") {
                    updateExistingDeviceData(req, res, rootDirectory);  
                }
                else if (page === "staff") {
                    updateExistingStaffData(req, res, rootDirectory); 
                }
                      
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
                else if (page === "staff") {
                    addNewStaffData(req, res, rootDirectory);
                }
            }
        })
    }
    catch(err) {
        console.log(err);
    }
})

app.put('/Thermometers/:requestType', async (req, res) => {
    const requestType = req.params.requestType;
    if (requestType === "RepairRequestGeneration") {
        try {
            await generateRepairRequest(req, res, rootDirectory)
        }
        catch(err) {
            console.log(err);
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

