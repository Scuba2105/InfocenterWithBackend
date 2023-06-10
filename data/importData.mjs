import fs from 'fs';
import { staffData } from './staff-data.mjs';

fs.writeFileSync('./staffData.json', JSON.stringify(staffData, null, 2));


