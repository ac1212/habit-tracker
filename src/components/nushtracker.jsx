import React, { Component } from "react";
import WeekView from "./weekView";
import LocalDataHelper from '../dataHelper';


class Nushtracker extends Component {
    constructor() {
        super();
        this.state = {
            Kriya: [true, true, false, false, true, true, false],
            Padmasadhna: [false, true, true, true, true, true, true],
        };
    }

    componentDidMount() {
        this.localdb = new LocalDataHelper();
        this.localdb.getWeekUpdates(Date.now()).then((s) => this.setState(s));
    }

    handleHabitClick = (habit_name, dayOfWeek) => {
        let new_state = JSON.parse(JSON.stringify(this.props));
        new_state.habits[habit_name][dayOfWeek] = !new_state.habits[habit_name][
            dayOfWeek
        ];
        this.setState(new_state);
    }

    render() {
        
        // Render.
        return (
            <WeekView habits={this.state} onHabitClick={this.handleHabitClick} />
        );
    }
}

export default Nushtracker;