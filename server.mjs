import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

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

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})