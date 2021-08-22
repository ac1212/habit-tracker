import React, { Component } from 'react';
import CheckCircle from './checkCircle';
import './habits.css'

class HabitWeekly extends Component {

  handleClick = (dayOfWeek, completed) => {
    this.props.onHabitClick(this.props.habit.habit_name, dayOfWeek, completed);
  }

  handleHabitDelete = () => {
    return this.props.onHabitDelete(this.props.habit.habit_name);
  }

  getEditButtons = () => {
    if (this.props.showEditButtons) {
      return <td><button onClick={this.handleHabitDelete}>delete</button></td>;
    }
    else {
      return;
    }
  }

  render() {
    let days = [];
    if (!this.props.showEditButtons) {
      this.props.habit.completion_status.forEach((cs, idx) => {
        days.push(<td key={idx}><CheckCircle checked={cs} dayOfWeek={idx} onClick={this.handleClick}/></td>);
      });
    }
    return (
      <tr>
        {this.getEditButtons()}
        <td>
          {this.props.habit.habit_name}
        </td>
        {days}
      </tr>
      
    );
  }
}

export default HabitWeekly;