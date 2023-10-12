import { useState } from 'react';
import Calendar from 'react-calendar';
import { DateCard } from './DateCard';

const dateOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

const onCallRoster = ["Kendo Wu", "Matthew Murrell", "Durga Sompalle", "Mitchell Pyne", "Atif Siddiqui",
"Mitchell Pacey", "Steven Bradbury", "Ray Aunei Mose", "Rodney Birt"];

const comments = {"Matthew Murrell": "Please divert phone to 0419295532"};

function currentOnCallName(beginDate, date) {
  const diff = (date - beginDate)
  // Number of weeks is difference in ms divided by number of ms in one week rounded down
  const numberOfWeeks = Math.abs(Math.floor(diff/(604800000)));
  const rosterCycleNumber = numberOfWeeks % onCallRoster.length;
  const reversedRoster = onCallRoster.slice(1).reverse();
  // Add the initial entry to the roster
  reversedRoster.unshift(onCallRoster[0]);
  if (beginDate <= date) {
    return onCallRoster[rosterCycleNumber]; 
  }
  return reversedRoster[rosterCycleNumber];  
}

function getBoundingDates(inputDate) {
  const selectedDay = inputDate.getDay();
  // Adjust day to make Monday the start, not Sunday.
  const adjustedDay = selectedDay === 0 ? 6 : selectedDay - 1;
  const lowerDay = inputDate - adjustedDay * (24*60*60*1000);
  const upperDay = lowerDay + 6 * (24*60*60*1000);
  const upperBoundDate = new Date(upperDay);
  const lowerBoundDate = new Date(lowerDay);
  return [lowerBoundDate, upperBoundDate];
}

function updateMonth(activeStartDate, setSelectedMonth, setDate, setBoundingDates) {
  const newBoundingDates = getBoundingDates(activeStartDate);
  setDate(activeStartDate);
  setBoundingDates(newBoundingDates);
  setSelectedMonth(activeStartDate.getMonth());
}

function updateSelectedDate(newDate, setDate, setBoundingDates) {
  const newBoundingDates = getBoundingDates(newDate);
  setDate(newDate);
  setBoundingDates(newBoundingDates);
}

function filterUpdateData(date, onCallChangedData) {
  const changedData = onCallChangedData.filter((entry) => {
    return date.getTime() >= entry.startDate && date.getTime() <= entry.endDate
  })
  return changedData;
}

export function CalendarComponent({onCallChangedData}) {
  
  // Currently selected date
  const [date, setDate] = useState(new Date());

  // Get any changed data for the current date
  const selectedDateChangedData = filterUpdateData(date, onCallChangedData);
  
  // Begin date is mm/dd/yyyy so actually Mon 09/10/2023
  const beginDate = new Date("10/09/2023");

  // Set the initial selected page and select month with state variables
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth());
  const [boundingDates, setBoundingDates] = useState(getBoundingDates(date))

  return (
    <div className='calendar-half-page'>
      <div className='on-call-summary'>
        <DateCard date={boundingDates[0]} dateBoundary="lower" dateOptions={dateOptions}></DateCard>
        <div className='on-call-staff-card'>
          <span className="card-head">Selected On-Call Details</span>
          <div className='on-call-staff'>
            <span className='on-call-name'>{selectedDateChangedData.length !== 0 ? selectedDateChangedData[0].name : currentOnCallName(beginDate, date)}</span> 
            <div className='comments-container'>
              <label className='comment-label'>Comments:</label>
              <span className='on-call-comment'>{selectedDateChangedData.length !== 0 ? selectedDateChangedData[0].comments : comments[currentOnCallName(beginDate, date)] ? comments[currentOnCallName(beginDate, date)] : "N/A"}</span>
            </div>
          </div>
        </div>
        <DateCard date={boundingDates[1]} dateBoundary="upper" dateOptions={dateOptions}></DateCard>
      </div>
      <div className='calendar-container'>
        <Calendar onChange={(value) => updateSelectedDate(value, setDate, setBoundingDates)} value={date} minDetail='month' onActiveStartDateChange={({activeStartDate}) => updateMonth(activeStartDate, setSelectedMonth, setDate, setBoundingDates)} tileDisabled={({date}) => date.getMonth() !== selectedMonth}/>
      </div>
    </div>
  );
}

