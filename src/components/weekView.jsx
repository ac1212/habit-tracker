import React, { Component } from "react";
import HabitWeekly from "./habits";

class WeekViewAddHabit extends Component {
  onClick() {
    // show add dialog, hide button.
    const new_habit_name = window.prompt("Enter new habit name", "");
    // on enter, then result = await this.props.onHabitAdd(habit_name); on cancel, return the button and hide this.
    this.props.onHabitAdd(new_habit_name).then(function (result) {
      if(result) {
        console.log("habit added successfully.");
      }
      else {
        console.log("habit add failed.");
      }
    });
    // if result is habit already exists, show error
    // if result is success, close dialog. return button.
  };

  render() {
    return (
      <button onClick={() => this.onClick()}>add</button>
    );
  }
}

class WeekView extends Component {

  instance = this;

  handleHabitClick = (habit_name, dayOfWeek, completed) => {
    this.props.onHabitClick(habit_name, dayOfWeek, completed);
  };

  handleHabitAdd = async (habit_name) => {
    console.log("this is ",this.props);
    return this.props.onHabitAdd(habit_name);
  }

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
      <div>
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
      <WeekViewAddHabit onHabitAdd={this.handleHabitAdd}/>
      </div>
    );
  }
}

export default WeekView;
