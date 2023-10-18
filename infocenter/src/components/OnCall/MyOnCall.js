import { staffOnCallRoster, getAdjustedBeginRoster, beginDate, currentOnCallName, getWeekBoundingDates } from '../../utils/utils';
import { useUser } from "../StateStore"
import { DateCard } from '../DateCard';
import { RightArrow } from '../../svg';

// Options for fomatting date strings.
const dateOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

// Get on call roster ordered from begin date.
const onCallRoster = getAdjustedBeginRoster(staffOnCallRoster);

function getOnCallShifts(currentUser) {
    const currentDate = new Date();
    const index  = onCallRoster.indexOf(currentUser);
    //Get the next 5 scheduled on-call shifts
    const currentOnCall = currentOnCallName(onCallRoster, beginDate, currentDate);
    const currentIndex = onCallRoster.indexOf(currentOnCall);
    const diff = index - currentIndex
    const weeksTillOnCall = diff >= 0 ? diff : onCallRoster.length + diff;
    
    // Initialise the future on call dates array.
    // Then get the time in milliseconds weekTillOnCall weeks in advance and add to array. 
    const futureOnCallDates = [];
    const nextOnCallMs = currentDate.getTime() + weeksTillOnCall * (7*24*60*60*1000)
    const advancedDate = new Date(nextOnCallMs);
    futureOnCallDates.push(advancedDate);

    // Loop to add the next 3 on call dates.
    for (let i = 1; i <= 2; i++) {
        const dateInMs = nextOnCallMs + i * onCallRoster.length * (7*24*60*60*1000);
        const nextDate = new Date(dateInMs);
        futureOnCallDates.push(nextDate);
    }

    const boundingDates = futureOnCallDates.map((entry) => {
        const boundingDates = getWeekBoundingDates(entry);
        return {startDate: boundingDates[0], endDate: boundingDates[1]};
    });

    return boundingDates;
}

function formatDateString(date) {
    const formattedDate = date.toDateString('en-us', dateOptions)
    return formattedDate;
}

export function MyOnCall() {

    // Get user state from Zustand state
    const userDetails = useUser((state) => state.userCredentials);
    const currentUser =  userDetails.user;

    const onCallShifts = getOnCallShifts(currentUser)
    
    return (
        <div className="modal-display">
            <div className='my-roster-start-end-label flex-c'>
                <label className='flex-c'>Start Date</label>
                <div className='my-roster-label-aligner'></div>
                <label className='flex-c'>End Date</label>
            </div>
            {onCallShifts.map((entry, index) => {
                return (
                    <div key={`on-call-date-range-${index}`} className="date-range-container flex-c">
                        <DateCard date={entry.startDate} size="small" dateBoundary="lower" dateOptions={dateOptions}></DateCard>
                        <RightArrow color="white"></RightArrow>
                        <DateCard date={entry.endDate} size="small" dateBoundary="upper" dateOptions={dateOptions}></DateCard>
                    </div>
                )
            })}
        </div>
    )
}