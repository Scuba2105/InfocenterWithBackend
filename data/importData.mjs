import fs from 'fs';
import path from 'path'

import { staffData } from '../infocenter/src/staff-data';

fs.writeFileSync('./staffData.json', JSON.stringify(staffData, null, 2));


