import { useState } from 'react';
import Calendar from 'react-calendar';

const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

/* Import the on-call roster
Kendo Wu - 09/10/2023
Matthew Murrell - Please divert phone to 0419295532
Durga Sompalle
Mitchell Pyne
Atif Siddiqui
Mitchell Pacey
Steven Bradbury
Ray Aunei Mose
Rodney Birt
*/

export function CalendarComponent() {
  const [date, setDate] = useState(new Date());
  const selectedMonth = date.getMonth();
  
  return (
    <div className='calendar-half-page'>
        <div className='calendar-container'>
            <Calendar onChange={setDate} value={date} minDetail='month' tileDisabled={({date}) => date.getMonth() !== selectedMonth}/>
        </div>
    </div>
  );
}

