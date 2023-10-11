import { useState, useRef } from 'react';
import Calendar from 'react-calendar';
import { OnCallSummary } from './OnCallSummary';

const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

const onCallRoster = ["Kendo Wu", "Matthew Murrell", "Durga Sompalle", "Mitchell Pyne", "Atif Siddiqui",
"Mitchell Pacey", "Steven Bradbury", "Ray Aunei Mose", "Rodney Birt"];

const comments = {"Matthew Murrell": "Please divert phone to 0419295532"};

function currentOnCallName(beginDate, date) {
  const diff = (date - beginDate)
  // Number of weeks is difference in ms divided by number of ms in one week rounded down
  const numberOfWeeks = Math.floor(diff/(604800000))
  const rosterCycleNumber = numberOfWeeks % onCallRoster.length;
  return onCallRoster[rosterCycleNumber]; 
}

function updateMonth(activeStartDate, setSelectedMonth) {
  setSelectedMonth(activeStartDate.getMonth());
}

export function CalendarComponent() {
  const [date, setDate] = useState(new Date());
  // Begin date is mm/dd/yyyy so actually Mon 09/10/2023
  const beginDate = new Date("10/09/2023");

  // Set the initial selected page and select month with state variables
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth());
    
  // Use ref to access calendar DOM
  const calendarContainer = useRef(null);

  return (
    <div className='calendar-half-page'>
      <OnCallSummary name={currentOnCallName(beginDate, date)} comments={comments[currentOnCallName(beginDate, date)] ? comments[currentOnCallName(beginDate, date)] : "N/A"} title="Current On-Call"></OnCallSummary>
      <div className='calendar-container'>
        <Calendar onChange={setDate} value={date} inputRef={calendarContainer} minDetail='month' onActiveStartDateChange={({activeStartDate}) => updateMonth(activeStartDate, setSelectedMonth)} tileDisabled={({date}) => date.getMonth() !== selectedMonth}/>
      </div>
    </div>
  );
}

