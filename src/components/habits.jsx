import React, { Component } from 'react';
import CheckCircle from './checkCircle';
import './habits.css'

class HabitWeekly extends Component {

  handleClick = (dayOfWeek) => {
    this.props.onHabitClick(this.props.habit.habit_name, dayOfWeek);
  }

  render() {
    let days = [];
    this.props.habit.completion_status.forEach((cs, idx) => {
      days.push(<td key={idx}><CheckCircle checked={cs} dayOfWeek={idx} onClick={this.handleClick}/></td>);
    });
    return (
      <tr>
        <td>
          {this.props.habit.habit_name}
        </td>
        {days}
      </tr>
      
    );
  }
}

export default HabitWeekly;