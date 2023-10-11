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

function formatDayDate(currentDate) {
  const dateArray = currentDate.toLocaleDateString('en-us', options).split(', ');
  const dayNumber = dateArray[1].split(' ')[1];
  const lastDigit = dayNumber[dayNumber.length - 1];
  const dayString = `${dateArray[0].substring(0, 3)} ${dayNumber}`;
  const daySuffix = lastDigit === 1 ? 'st' : lastDigit === 2 ? 'nd' : lastDigit === 3 ? 'rd' : 'th';
  return dayString + daySuffix; 
}

function formatMonthYear(currentDate) {
  const dateArray = currentDate.toLocaleDateString('en-us', options).split(', ');
  const month = dateArray[1].split(" ")[0];
  const year = dateArray[2];
  return month + " " + year
}

export function CalendarComponent() {
  const [date, setDate] = useState(new Date());
  const selectedMonth = date.getMonth();
  const currentDate = new Date();

 return (
    <div className='calendar-half-page'>
        <div className='calendar-container'>
            <p className='calendar-header'>
                <span id="day">{formatDayDate(currentDate)}</span>
                <span id="month-year">{formatMonthYear(currentDate)}</span>
            </p>      
            <Calendar onChange={setDate} value={date} minDetail='month' tileDisabled={({date}) => date.getMonth() !== selectedMonth}/>
        </div>
    </div>
  );
}

