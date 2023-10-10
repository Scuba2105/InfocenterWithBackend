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

  const currentDate = new Date();
  return (
    <div className='calendar-half-page'>
        <div className='calendar-container'>
            <p className='calendar-header'>
                <span className="year">{currentDate.toLocaleDateString('en-us', options).split(', ')[2]}</span>
                <span className="day-month">{currentDate.toLocaleDateString('en-us', options).split(', ').slice(0,2).join(', ')}</span>
            </p>      
            <Calendar onChange={setDate} value={date} />
        </div>
    </div>
  );
}

