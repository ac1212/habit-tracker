import React, { Component } from "react";
import HabitWeekly from "./habits";

class WeekView extends Component {

  handleHabitClick = (habit_name, dayOfWeek, completed) => {
    this.props.onHabitClick(habit_name, dayOfWeek, completed);
    
  };

  render() {
    let habits = [];
    for (const [habit_name, completion_status] of Object.entries(
      this.props.habits
    )) {
      habits.push(
            <HabitWeekly key={habit_name}
          habit={{
            habit_name: habit_name,
            completion_status: completion_status,
          }}
          onHabitClick={this.handleHabitClick}
        />
      );
    }
    return (
      <table>
        <thead>
            <tr>
                <th></th>
                <th>S</th>
                <th>M</th>
                <th>T</th>
                <th>W</th>
                <th>T</th>
                <th>F</th>
                <th>S</th>
            </tr>
        </thead>
        <tbody>{habits}</tbody>
      </table>
    );
  }
}

export default WeekView;
