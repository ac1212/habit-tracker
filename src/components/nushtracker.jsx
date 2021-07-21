import React, { Component } from "react";
import WeekView from "./weekView";
import LocalDataHelper from '../dataHelper';


class Nushtracker extends Component {
    

    constructor() {
        super();
        var startTime = new Date(Date.now());
        startTime.setDate(startTime.getDate() - startTime.getDay());
        startTime.setHours(0);
        startTime.setMinutes(0);
        startTime.setSeconds(0);
        startTime.setMilliseconds(0);
        this.state = {
            currentWeekView: {
                startDate: startTime,
                state: this.defaultWeekViewState
            }
        };
    }

    defaultWeekViewState = {
        Kriya: [true, true, false, false, true, true, false],
        Padmasadhna: [false, true, true, true, true, true, true],
    };

    refreshStateFromLocalDb() {
        //TODO: show error if accessed before localdb inited.
        const date_now = Date.now();
        this.localdb.getWeekUpdates(date_now).then((s) => {
            // Calculate start of the week.
            var startTime = new Date(date_now);
            startTime.setDate(startTime.getDate() - startTime.getDay());
            startTime.setHours(0);
            startTime.setMinutes(0);
            startTime.setSeconds(0);
            startTime.setMilliseconds(0);
            this.setState({
                currentWeekView: {
                    startDate: startTime,
                    state: s
                }
            })
        });
    }

    componentDidMount() {
        this.localdb = new LocalDataHelper();
        this.refreshStateFromLocalDb();
    }

    handleHabitClick = (habit_name, dayOfWeek, completed) => {
        // Calculate date.
        var date = this.state.currentWeekView.startDate;
        date.setDate(date.getDate() + dayOfWeek);
        const instance = this;
        this.localdb.writeUpdate(date, habit_name, completed).then(() => instance.refreshStateFromLocalDb());
    }

    render() {
        console.log("rendering with ",this.state.currentWeekView);
        // Render.
        return (
            <WeekView habits={this.state.currentWeekView.state} onHabitClick={this.handleHabitClick} />
        );
    }
}

export default Nushtracker;