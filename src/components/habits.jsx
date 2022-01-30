import React, { Component } from 'react';
import CheckCircle from './checkCircle';
import './habits.css'
import DeleteIcon from '@material-ui/icons/Delete';

class HabitWeekly extends Component {

  constructor() {
    super();
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  handleClick = (dayOfWeek, completed) => {
    this.props.onHabitClick(this.props.habit.habit_name, dayOfWeek, completed);
  }

  handleHabitDelete = () => {
    return this.props.onHabitDelete(this.props.habit.habit_name);
  }

  getEditButtons = () => {
    if (this.props.showEditButtons) {
      return <td><DeleteIcon onClick={this.handleHabitDelete} /></td>;
    }
    else {
      return;
    }
  }

  render() {
    let days = [];
      this.props.habit.completion_status.forEach((cs, idx) => {
        days.push(<td key={idx} className={
          this.props.showEditButtons ? "hidden" : "visible"
        }><CheckCircle checked={cs} dayOfWeek={idx} onClick={this.handleClick}/></td>);
      });
    if (this.state.width>=700) { // construct single line habit.
      return (
        <tr>
          {this.getEditButtons()}
          <td id="habit-name-label">
            {this.props.habit.habit_name}
          </td>
          {days}
        </tr>
        
      );
    } else { // use 2 lines, one for title and second for status.
      return (
        <React.Fragment>
        <tr>
          {this.getEditButtons()}
          <td colSpan="8" id="habit-name-label">
            {this.props.habit.habit_name}
          </td>
        </tr>
        <tr>
          <td></td>
          {this.props.showEditButtons && <td></td>}
          {days}
        </tr>
        </React.Fragment>
        
      );
    }
    
    
  }
}

export default HabitWeekly;