import { useState } from 'react';
import Calendar from 'react-calendar';
import { DateCard } from '../DateCard';
import { getWeekBoundingDates, currentOnCallName } from '../../utils/utils';
import { staffOnCallRoster, getAdjustedBeginRoster, beginDate } from '../../utils/utils';

const dateOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
const onCallRoster = getAdjustedBeginRoster(staffOnCallRoster);

const comments = {"Matthew Murrell": "Please divert phone to 0419295532"};

function dateInRange(date, range) {
  date.setHours(0,0,0,0)
  range[0].setHours(0,0,0,0);
  range[1].setHours(0,0,0,0);
  if (date >= range[0].getTime() && date <= range[1].getTime()) {
    return true
  }
  return false;
}

function filterUpdateData(date, onCallChangedData) {
  const [lowerWeekBoundingDate, upperWeekBoundingDate] = getWeekBoundingDates(date);
  lowerWeekBoundingDate.setHours(0,0,0,0)
  upperWeekBoundingDate.setHours(0,0,0,0)
  const changedData = onCallChangedData.filter((entry) => {
    const startingDate = new Date(entry.startDate)
    const endingDate = new Date(entry.endDate)
    // Set the date objects hours for consistency and comparison accuracy 
    startingDate.setHours(0,0,0,0);
    endingDate.setHours(0,0,0,0);
    return startingDate >= lowerWeekBoundingDate && endingDate <= upperWeekBoundingDate; 
  })
  return changedData[0];
}

function getOnCallData(inputDate, beginDate, onCallChangedData) {

  // Check to see if there is any roster changes for the selected week 
  const changedData = filterUpdateData(inputDate, onCallChangedData);
  const [lowerWeekBoundingDate, upperWeekBoundingDate] = getWeekBoundingDates(inputDate);
  // Return the default data if no changed data available for selected week. 
  if (changedData === undefined) {
    return {dateRange: [lowerWeekBoundingDate, upperWeekBoundingDate], employeeData: {name: currentOnCallName(onCallRoster, beginDate, inputDate), comment: comments[currentOnCallName(onCallRoster, beginDate, inputDate)]}};
  }

  // Get the lower and upper bounds of the changed data.
  const lowerChangedBound = new Date(changedData.startDate);
  const upperChangedBound = new Date(changedData.endDate);
  
  // Early return if changed on call is for the entire week.
  if (lowerWeekBoundingDate === lowerChangedBound && upperWeekBoundingDate === upperChangedBound) {
    return {dateRange: [lowerChangedBound, upperChangedBound], employeeData: {name: changedData.newOnCall, comment: `Replacing ${changedData.originalOnCall} due to ${changedData.reason}`}};
  }
  // Determine if selected date is within the changed bounds or not.
  if (dateInRange(inputDate, [lowerChangedBound, upperChangedBound])) {
    return {dateRange: [lowerChangedBound, upperChangedBound], employeeData: {name: changedData.newOnCall, comment: `Replacing ${changedData.originalOnCall} due to ${changedData.reason}`}};
  }
  else if (inputDate < lowerChangedBound) {
    // Set the new default end date to one day before the start date of the roster change
    const newDefaultUpperBound = lowerChangedBound.getTime() - (24*60*60*1000);
    const newDefaultEndDate = new Date(newDefaultUpperBound);
    return {dateRange: [lowerWeekBoundingDate, newDefaultEndDate], employeeData: {name: currentOnCallName(onCallRoster, beginDate, inputDate), comment: comments[currentOnCallName(onCallRoster, beginDate, inputDate)]}};
  }
  else if (inputDate > upperChangedBound) {
    // Set the new default start 1 day after end of changed end date
    const newDefaultLowerBound = upperChangedBound.getTime() + (24*60*60*1000);
    const newDefaultStartDate = new Date(newDefaultLowerBound);
    return {dateRange: [newDefaultStartDate, upperWeekBoundingDate], employeeData: {name: currentOnCallName(onCallRoster, beginDate, inputDate), comment: comments[currentOnCallName(onCallRoster, beginDate, inputDate)]}};
  }
}

// Triggered state changes when month is changed
function updateMonth(activeStartDate, beginDate, setSelectedMonth, setDate, setBoundingDates, setOnCallEmployee, onCallChangedData) {
  const onCallData = getOnCallData(activeStartDate, beginDate, onCallChangedData);
  setDate(activeStartDate);
  setBoundingDates(onCallData.dateRange);
  setOnCallEmployee(onCallData.employeeData)
  setSelectedMonth(activeStartDate.getMonth());
}

// Triggered state changes when selected date is changed.
function updateSelectedDate(newDate, beginDate, setDate, setBoundingDates, setOnCallEmployee, onCallChangedData) {
  const onCallData = getOnCallData(newDate, beginDate, onCallChangedData);
  setDate(newDate)
  setBoundingDates(onCallData.dateRange);
  setOnCallEmployee(onCallData.employeeData)
}

export function CalendarComponent({onCallChangedData}) {
  
  // Currently selected date
  const [date, setDate] = useState(new Date());
  
  // Separate the on call data
  const rosterEdits = onCallChangedData.rosterEdits;
  const rosterConfirmations = onCallChangedData.rosterConfirmation;

  // Check if roster Confirmations exist for the current selected week.
  const currentWeekConfirmations = rosterConfirmations.find((entry) => {
    const currentDate = date;
    currentDate.setHours(0,0,0,0);
    const rosterStartDate = new Date(entry.startDate);
    const rosterEndDate = new Date(entry.endDate);
    rosterStartDate.setHours(0,0,0,0);
    rosterEndDate.setHours(0,0,0,0);
    
    return currentDate.getTime() >= rosterStartDate.getTime() && currentDate.getTime() <= rosterEndDate.getTime() 
  })

  let currentWeekConfirmed = false;
  if (currentWeekConfirmations !== undefined) {
    currentWeekConfirmed = true;
  }

  // Set the minimum date accessible from the calendar at 2 weeks prior to the current date.
  const currentDate = new Date();
  const minDateMillisec = currentDate.getTime() - 14 * (24*60*60*1000);
  const minDate = new Date(minDateMillisec);

  // Store the name of the current on call employee for selected date 
  const [onCallEmployee, setOnCallEmployee] = useState({name: currentOnCallName(onCallRoster, beginDate, date), comment: comments[currentOnCallName(onCallRoster, beginDate, date)]})

  // Set the initial selected page and select month with state variables
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth());
  const [boundingDates, setBoundingDates] = useState(getWeekBoundingDates(date))

  return (
    <div className='calendar-half-page size-100 flex-c-col'>
      <div className='on-call-summary flex-c'>
        <DateCard date={boundingDates[0]} dateBoundary="lower" dateOptions={dateOptions}></DateCard>
        <div className='on-call-staff-card'>
          <span className="card-head flex-c">{currentWeekConfirmed ? "Confirmed On-Call Details" : "Unconfirmed On-Call Details"}</span>
          <div className='on-call-staff flex-c-col'>
            <span className='on-call-name flex-c'>{onCallEmployee.name}</span> 
            <div className='comments-container flex-c-col'>
              <span className='on-call-comment flex-c'>{onCallEmployee.comment ? onCallEmployee.comment : "No Comments"}</span>
            </div>
          </div>
        </div>
        <DateCard date={boundingDates[1]} dateBoundary="upper" dateOptions={dateOptions}></DateCard>
      </div>
      <div className='calendar-container flex-c-col'>
        <Calendar onChange={(value) => updateSelectedDate(value, beginDate, setDate, setBoundingDates, setOnCallEmployee, rosterEdits)} value={date} minDetail='month' onActiveStartDateChange={({activeStartDate}) => updateMonth(activeStartDate, beginDate, setSelectedMonth, setDate, setBoundingDates, setOnCallEmployee, rosterEdits)} minDate={minDate} tileDisabled={({date}) => date.getMonth() !== selectedMonth}/>
      </div>
    </div>
  );
}

