import { useLayoutEffect } from "react";
import Calendar from "color-calendar";
import "color-calendar/dist/css/theme-glass.css";

export function CalendarComponent() {

    useLayoutEffect(() => {
        new Calendar({
        id: "#myCal",
        theme: "glass",
        weekdayType: "long-upper",
        monthDisplayType: "long",
        calendarSize: "small",
        layoutModifiers: ["month-left-align"],
        eventsData: [
            {
            id: 1,
            name: "French class",
            start: "2023-10-17T06:00:00",
            end: "2023-10-18T20:30:00"
            },
            {
            id: 2,
            name: "Blockchain 101",
            start: "2023-10-09T10:00:00",
            end: "2023-10-20T11:30:00"
            }
        ],
        dateChanged: (currentDate, events) => {
            console.log("date change", currentDate, events);
        },
        monthChanged: (currentDate, events) => {
            console.log("month change", currentDate, events);
        }
        });
    })

    return (
        <div id="myCal"></div>
    )
}