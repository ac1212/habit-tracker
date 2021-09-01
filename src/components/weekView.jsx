import React, { Component } from "react";
import HabitWeekly from "./habits";
import './weekView.css';

class WeekViewAddHabit extends Component {
  constructor() {
    super();
    this.state = {newHabitName: ''};
  }
  onAdd() {
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
  };

  onNewHabitEnterPressed = (event) => {
    if(event.code === 'Enter') {
      this.props.onHabitAdd(this.state.newHabitName).then(function (result) {
        if(result) {
          console.log("habit added successfully.");
        }
        else {
          console.log("habit add failed.");
        }
        event.target.value = "";
      });
    }
  }

  updateNewHabitName = ({target}) => {
    this.setState({newHabitName: target.value});
  }

  render() {
    let cells = [];
    cells.push(<td key="gap"/>);
    if (this.props.editMode) {
      cells.push(<td key="add"><input id="new-habit-box" placeholder="New habit..." type="text" onChange={this.updateNewHabitName} onKeyDown={(e) => this.onNewHabitEnterPressed(e)}/></td>)
    }
    return (
    <tr>
      {cells}
    </tr>);
  }
}

class WeekView extends Component {
  instance = this;

  handleHabitClick = (habit_name, dayOfWeek, completed) => {
    this.props.onHabitClick(habit_name, dayOfWeek, completed);
  };

  handleHabitAdd = async (habit_name) => {
    return this.props.onHabitAdd(habit_name);
  }

  handleHabitDelete = async (habit_name) => {
    return this.props.onHabitDelete(habit_name);
  }

  render() {
    // Prep header.
    function getHeader(showEditButtons, showHeader) {
      let header_cells = [];
      header_cells.push(<th key="0"></th>);
      if (showEditButtons) {
        header_cells.push(<th key="1">&nbsp;</th>);
      }
      if(showHeader)
      {
        const visiblity_class = showEditButtons ? "hidden" : "visible"
        header_cells.push(<th className={visiblity_class} key="2">S</th>);
        header_cells.push(<th className={visiblity_class} key="3">M</th>);
        header_cells.push(<th className={visiblity_class} key="4">T</th>);
        header_cells.push(<th className={visiblity_class} key="5">W</th>);
        header_cells.push(<th className={visiblity_class} key="6">T</th>);
        header_cells.push(<th className={visiblity_class} key="7">F</th>);
        header_cells.push(<th className={visiblity_class} key="8">S</th>);
      }
      return header_cells;
    };
    // Prep habits.
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
          showEditButtons={this.props.editMode}
          onHabitClick={this.handleHabitClick}
          onHabitDelete={this.handleHabitDelete}
        />
      );
    }
    habits.push(<WeekViewAddHabit key="add_habit" editMode={this.props.editMode} onHabitAdd={this.handleHabitAdd}/>)
    return (
      <table>
        <thead>
          <tr>
            {getHeader(this.props.editMode, Object.keys(this.props.habits).length>0)}
          </tr>
        </thead>
        <tbody>{habits}</tbody>
      </table>
    );
  }
}

export default WeekView;
