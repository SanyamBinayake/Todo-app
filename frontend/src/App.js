import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:8080/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');

  // Fetch all todos from the backend when the component mounts
  useEffect(() => {
    axios.get(API_URL).then(response => {
      setTodos(response.data);
    });
  }, []);

  // Handle form submission to add a new todo
  const addTodo = (e) => {
    e.preventDefault();
    if (!task.trim()) return; // Don't add empty todos
    axios.post(API_URL, { task, completed: false }).then(response => {
      setTodos([...todos, response.data]);
      setTask(''); // Clear the input field
    });
  };

  // Toggle the 'completed' status of a todo
  const toggleTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    const updatedTodo = { ...todo, completed: !todo.completed };

    axios.put(`${API_URL}/${id}`, updatedTodo).then(response => {
      setTodos(todos.map(t => (t.id === id ? response.data : t)));
    });
  };

  // Delete a todo
  const deleteTodo = (id) => {
    axios.delete(`${API_URL}/${id}`).then(() => {
      setTodos(todos.filter(t => t.id !== id));
    });
  };

  return (
    <div className="app-container">
      <h1>To-Do List</h1>
      <form onSubmit={addTodo} className="add-todo-form">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <button type="submit">Add Todo</button>
      </form>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <span onClick={() => toggleTodo(todo.id)}>
              {todo.task}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;