import React, { Component } from "react";
import WeekView from "./weekView";
import LocalDataHelper from '../dataHelper';
import './nushtracker.css';


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

    async refreshStateFromLocalDb(target_date) {
        // Calculate start of the week.
        var startDate = new Date(target_date);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);
        // Calculate end of the week.
        var endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        //TODO: show error if accessed before localdb inited.
        const state = await this.localdb.getWeekUpdates(target_date);
        const olderUpdatesExist = await this.localdb.olderUpdatesExist(startDate);
        const newerUpdatesExist = await this.localdb.newerUpdatesExist(endDate);
        this.setState({
            currentWeekView: {
                startDate: startDate,
                state: state
            },
            olderUpdatesExist: olderUpdatesExist,
            newerUpdatesExist: newerUpdatesExist
        });
    }

    componentDidMount() {
        this.localdb = new LocalDataHelper();
        this.refreshStateFromLocalDb(Date.now());
    }

    handleHabitClick = (habit_name, dayOfWeek, completed) => {
        // Calculate date.
        var date = this.state.currentWeekView.startDate;
        date.setDate(date.getDate() + dayOfWeek);
        const instance = this;
        this.localdb.writeUpdate(date, habit_name, completed).then(() => instance.refreshStateFromLocalDb(this.state.currentWeekView.startDate));
    }

    handleHabitAdd = async (habit_name) => {
        var result = this.localdb.addHabit(habit_name);
        this.refreshStateFromLocalDb(this.state.currentWeekView.startDate);
        return result;
    }

    handleHabitDelete = async (habit_name) => {
        var result = this.localdb.deleteHabit(habit_name);
        this.refreshStateFromLocalDb(this.state.currentWeekView.startDate);
        return result;
    }

    gotoPrevWeek = async () => {
        var prevWeekStartTime = this.state.currentWeekView.startDate;
        prevWeekStartTime.setDate(prevWeekStartTime.getDate() - 7);
        await this.refreshStateFromLocalDb(prevWeekStartTime);
    }

    gotoNextWeek = async () => {
        var nextWeekStartTime = this.state.currentWeekView.startDate;
        nextWeekStartTime.setDate(nextWeekStartTime.getDate() + 7);
        await this.refreshStateFromLocalDb(nextWeekStartTime);
    }

    render() {
        // Get current week.
        const startDate = this.state.currentWeekView.startDate;
        var endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        // Set format.
        var options = {weekday: "short", month: "short", day: "numeric"};
        const current_date = new Date();
        const current_year = current_date.getFullYear();
        if (startDate.getFullYear()!==current_year || endDate.getFullYear()!==current_year) {
            options.year = "numeric";
        }
        // Build the week display string.
        var currentPeriodString = startDate.toLocaleDateString(undefined, options);
        currentPeriodString += " - ";
        currentPeriodString += endDate.toLocaleDateString(undefined, options);
        // Render.
        return (
            <div>
                <div id="navigator">
                    <button disabled={!this.state.olderUpdatesExist} onClick={this.gotoPrevWeek}>prev</button>
                    <span>{currentPeriodString}</span>
                    <button disabled={!this.state.newerUpdatesExist} onClick={this.gotoNextWeek}>next</button>
                </div>
                <WeekView habits={this.state.currentWeekView.state} onHabitClick={this.handleHabitClick} onHabitAdd={this.handleHabitAdd} onHabitDelete={this.handleHabitDelete} />
            </div>
        );
    }
}

export default Nushtracker;