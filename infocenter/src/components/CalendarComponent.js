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

function getOnCallData(inputDate, beginDate, selectedDateChangedData) {
  const changedData = selectedDateChangedData[0];
  const [lowerWeekBoundingDate, upperWeekBoundingDate] = getWeekBoundingDates(inputDate);
  
  // Return the default data if no changed data available for selected week. 
  if (changedData === undefined) {
    return {dateRange: [lowerWeekBoundingDate, upperWeekBoundingDate], employeeData: {name: currentOnCallName(beginDate, inputDate), comment: comments[currentOnCallName(beginDate, inputDate)]}};
  }

  // Get the lower and upper bounds of the changed data.
  const lowerChangedBound = new Date(changedData.startDate);
  const upperChangedBound = new Date(changedData.endDate);
  
  // Early return if changed on call is for the entire week.
  if (lowerWeekBoundingDate === lowerChangedBound && upperWeekBoundingDate === upperChangedBound) {
    console.log("Error. Wrong condition entered");
    return {dateRange: [lowerChangedBound, upperChangedBound], employeeData: {name: changedData.name, comment: changedData.comment}};
  }
  // Determine if selected date is within the changed bounds or not.
  if (dateInRange(inputDate, [lowerChangedBound, upperChangedBound])) {
    console.log("Cicked between Mon 8th and Wed 4th October");
    return {dateRange: [lowerChangedBound, upperChangedBound], employeeData: {name: changedData.name, comment: changedData.comment}};
  }
  else if (inputDate < lowerChangedBound) {
    console.log("Error. Wrong condition entered.")
    const newDefaultUpperBound = lowerChangedBound - (24*60*60*1000);
    const newDefaultEndDate = new Date(newDefaultUpperBound);
    return {dateRange: [lowerWeekBoundingDate, newDefaultEndDate], employeeData: {name: currentOnCallName(beginDate, inputDate), comment: comments[currentOnCallName(beginDate, inputDate)]}};
  }
  else if (inputDate > upperChangedBound) {
    console.log("Clicked after Wed 4th.")
    const newDefaultStartDate = upperChangedBound + (24*60*60*1000);
    return {dateRange: [newDefaultStartDate, upperWeekBoundingDate], employeeData: {name: currentOnCallName(beginDate, inputDate), comment: comments[currentOnCallName(beginDate, inputDate)]}};
  }
}

// Triggered state changes when month is changed
function updateMonth(activeStartDate, beginDate, setSelectedMonth, setDate, setBoundingDates, setOnCallEmployee, selectedDateChangedData) {
  const onCallData = getOnCallData(activeStartDate, beginDate, selectedDateChangedData);
  setDate(activeStartDate);
  setBoundingDates(onCallData.dateRange);
  setOnCallEmployee(onCallData.employeeData)
  setSelectedMonth(activeStartDate.getMonth());
}

// Triggered state changes when selected date is changed.
function updateSelectedDate(newDate, beginDate, setDate, setBoundingDates, setOnCallEmployee, selectedDateChangedData) {
  const onCallData = getOnCallData(newDate, beginDate, selectedDateChangedData);
  setDate(newDate)
  setBoundingDates(onCallData.dateRange);
  setOnCallEmployee(onCallData.employeeData)
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
  
  // Begin date is mm/dd/yyyy so actually Mon 09/10/2023
  const beginDate = new Date("10/09/2023");

  // Store the name of the current on call employee for selected date 
  const [onCallEmployee, setOnCallEmployee] = useState({name: currentOnCallName(beginDate, date), comment: comments[currentOnCallName(beginDate, date)]})

  // Get any changed data for the current date
  const selectedDateChangedData = filterUpdateData(date, onCallChangedData);
  
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
            <span className='on-call-name'>{onCallEmployee.name}</span> 
            <div className='comments-container'>
              <label className='comment-label'>Comments:</label>
              <span className='on-call-comment'>{onCallEmployee.comment}</span>
            </div>
          </div>
        </div>
        <DateCard date={boundingDates[1]} dateBoundary="upper" dateOptions={dateOptions}></DateCard>
      </div>
      <div className='calendar-container'>
        <Calendar onChange={(value) => updateSelectedDate(value, beginDate, setDate, setBoundingDates, setOnCallEmployee, selectedDateChangedData)} value={date} minDetail='month' onActiveStartDateChange={({activeStartDate}) => updateMonth(activeStartDate, beginDate, setSelectedMonth, setDate, setBoundingDates, setOnCallEmployee, selectedDateChangedData)} tileDisabled={({date}) => date.getMonth() !== selectedMonth}/>
      </div>
    </div>
  );
}

