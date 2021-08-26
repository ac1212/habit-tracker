import React, { Component } from "react";
import HabitWeekly from "./habits";
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import './weekView.css';

class WeekViewAddHabit extends Component {
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

  onEditClick() {
    this.props.onEditClick()
  }

  render() {
    let cells = [];
    if (this.props.editMode) {
      cells.push(<td key="cancel"><CloseIcon color="primary" onClick={() => this.onEditClick()} /></td>);
      cells.push(<td key="add"><AddIcon color="primary" onClick={() => this.onAdd()} /></td>);
    }
    else {
      cells.push(<td key="edit"><EditIcon color="red" onClick={() => this.onEditClick()}/></td>);
    }
    return (
    <tr>
      {cells}
    </tr>);
  }
}

class WeekView extends Component {

  constructor() {
    super();
    this.state = {editMode: false};
  }

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

  handleEditClick = async () => {
    var state = this.state;
    state.editMode = !state.editMode;
    this.setState(state);
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
        header_cells.push(<th  key="2">S</th>);
        header_cells.push(<th  key="3">M</th>);
        header_cells.push(<th  key="4">T</th>);
        header_cells.push(<th  key="5">W</th>);
        header_cells.push(<th  key="6">T</th>);
        header_cells.push(<th  key="7">F</th>);
        header_cells.push(<th  key="8">S</th>);
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
          showEditButtons={this.state.editMode}
          onHabitClick={this.handleHabitClick}
          onHabitDelete={this.handleHabitDelete}
        />
      );
    }
    habits.push(<WeekViewAddHabit key="add_habit" editMode={this.state.editMode} onHabitAdd={this.handleHabitAdd} onEditClick={this.handleEditClick}/>)
    return (
      <table>
        <thead>
          <tr>
            {getHeader(this.state.editMode, !this.state.editMode && Object.keys(this.props.habits).length>0)}
          </tr>
        </thead>
        <tbody>{habits}</tbody>
      </table>
    );
  }
}

export default WeekView;
