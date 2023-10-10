import { useState } from 'react';
import Calendar from 'react-calendar';

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

export function CalendarComponent({date, setDate}) {
  const [date, setDate] = useState(new Date());

  return (
    <div className='on-call-page'>
      <h1 className='text-center'>React Calendar</h1>
      <div className='calendar-container'>
        <Calendar onChange={setDate} value={date} />
      </div>
      <p className='text-center'>
        <span className='bold'>Selected Date:</span>{' '}
        {date.toDateString()}
      </p>
    </div>
  );
}

