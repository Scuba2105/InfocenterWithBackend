import { useState } from 'react';
import Calendar from 'react-calendar';
import { DateCard } from './DateCard';

const dateOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

const onCallRoster = ["Kendo Wu", "Matthew Murrell", "Durga Sompalle", "Mitchell Pyne", "Atif Siddiqui",
"Mitchell Pacey", "Steven Bradbury", "Ray Aunei Mose", "Rodney Birt"];

const comments = {"Matthew Murrell": "Please divert phone to 0419295532"};

function dateInRange(date, range) {
  if (date >= range[0] && date <= range[1]) {
    return true
  }
  return false;
}

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

function getWeekBoundingDates(inputDate) {
  const selectedDay = inputDate.getDay();
  // Adjust day to make Monday the start, not Sunday.
  const adjustedDay = selectedDay === 0 ? 6 : selectedDay - 1;
  const weekStart = inputDate - adjustedDay * (24*60*60*1000);
  const weekEnd = weekStart + 6 * (24*60*60*1000);
  const upperBoundDate = new Date(weekEnd);
  const lowerBoundDate = new Date(weekStart);
  return [lowerBoundDate, upperBoundDate];
}

function getOnCallBoundingDates(inputDate, selectedDateChangedData) {
  const changedData = selectedDateChangedData[0];
  const [lowerWeekBoundingDate, upperWeekBoundingDate] = getWeekBoundingDates(inputDate);
  const lowerChangedBound = changedData.startDate;
  const upperChangedBound = changedData.endDate;
  // Early return if changed on call is for the entire week.
  if (lowerWeekBoundingDate === lowerChangedBound && upperWeekBoundingDate === upperChangedBound) {
    return [lowerChangedBound, upperChangedBound];
  }
  // Determine the changed bounds
  let changedBounds, defaultBound1, defaultBound2;
  if (lowerWeekBoundingDate === lowerChangedBound && upperWeekBoundingDate > upperChangedBound) {
      changedBounds = [lowerChangedBound, upperChangedBound];
      const newLowerDefaultBound = upperChangedBound + (24*60*60*1000);
      defaultBound1 = [newLowerDefaultBound, upperWeekBoundingDate];
  }
  else if (lowerWeekBoundingDate < lowerChangedBound && upperWeekBoundingDate > upperChangedBound) {
   
  }
}

// Triggered state changes when month is changed
function updateMonth(activeStartDate, setSelectedMonth, setDate, setBoundingDates, selectedDateChangedData) {
  const newBoundingDates = getWeekBoundingDates(activeStartDate);
  setDate(activeStartDate);
  setBoundingDates(newBoundingDates);
  setSelectedMonth(activeStartDate.getMonth());
}

// Triggered state changes when selected date is changed.
function updateSelectedDate(newDate, setDate, setBoundingDates, selectedDateChangedData) {
  const newBoundingDates = getWeekBoundingDates(newDate);
  setDate(newDate);
  setBoundingDates(newBoundingDates);
}

function filterUpdateData(date, onCallChangedData) {
  const [lowerWeekBoundingDate, upperWeekBoundingDate] = getWeekBoundingDates(date);
  const changedData = onCallChangedData.filter((entry) => {
    return entry.startDate >= lowerWeekBoundingDate && entry.endDate <= upperWeekBoundingDate; 
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
  const [boundingDates, setBoundingDates] = useState(getWeekBoundingDates(date))

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
        <Calendar onChange={(value) => updateSelectedDate(value, setDate, setBoundingDates, selectedDateChangedData)} value={date} minDetail='month' onActiveStartDateChange={({activeStartDate}) => updateMonth(activeStartDate, setSelectedMonth, setDate, setBoundingDates, selectedDateChangedData)} tileDisabled={({date}) => date.getMonth() !== selectedMonth}/>
      </div>
    </div>
  );
}

