import { expr, observable } from 'mobx';

import PropTypes from 'prop-types';
import React from 'react';
import TodoModel from '../models/TodoModel'
import ViewStore from '../stores/ViewStore'
import { observer } from 'mobx-react';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

@observer
export default class TodoItem extends React.Component {
  @observable editText = "";

  props: {
    viewStore: ViewStore;
    todo: TodoModel;
  };

  render() {
    const { viewStore, todo } = this.props;
    return (
      <li className={[
        todo.completed ? "completed" : "",
        expr(() => todo === viewStore.todoBeingEdited ? "editing" : "")
      ].join(" ")}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={this.handleToggle}
          />
          <label onDoubleClick={this.handleEdit}>
            {todo.title.text}
          </label>
          <button className="destroy" onClick={this.handleDestroy} />
        </div>
        <input
          ref="editField"
          className="edit"
          value={this.editText}
          onBlur={this.handleSubmit}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
      </li>
    );
  }

  handleSubmit = (event) => {
    const val = this.editText.trim();
    if (val) {
      this.props.todo.setTitle(val);
      this.editText = val;
    } else {
      this.handleDestroy();
    }
    this.props.viewStore.todoBeingEdited = null;
  };

  handleDestroy = () => {
    this.props.todo.destroy();
    this.props.viewStore.todoBeingEdited = null;
  };

  handleEdit = () => {
    const todo = this.props.todo;
    this.props.viewStore.todoBeingEdited = todo;
    this.editText = todo.title.text;
  };

  handleKeyDown = (event) => {
    if (event.which === ESCAPE_KEY) {
      this.editText = this.props.todo.title.text;
      this.props.viewStore.todoBeingEdited = null;
    } else if (event.which === ENTER_KEY) {
      this.handleSubmit(event);
    }
  };

  handleChange = (event) => {
    this.editText = event.target.value;
  };

  handleToggle = () => {
    this.props.todo.toggle();
  };
}

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
  viewStore: PropTypes.object.isRequired
};
