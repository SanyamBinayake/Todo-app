import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css'; // Import the new CSS file
import { Calendar, Tag, Filter, Search, Trash2, Plus, Check, X, BarChart3, Sun, Moon, GripVertical } from 'lucide-react';

const API_URL = 'http://localhost:8080/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [category, setCategory] = useState('PERSONAL');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterCompleted, setFilterCompleted] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  // --- All your existing functions (fetchTodos, addTodo, etc.) go here ---
  // No changes are needed for the functions themselves.
    const fetchTodos = useCallback(async () => {
        try {
          const params = new URLSearchParams();
          if (searchTerm) params.append('search', searchTerm);
          if (filterPriority) params.append('priority', filterPriority);
          if (filterCategory) params.append('category', filterCategory);
          if (filterCompleted) params.append('completed', filterCompleted);
          
          const response = await axios.get(`${API_URL}?${params}`);
          setTodos(response.data);
        } catch (error) {
          console.error('Error fetching todos:', error);
        }
    }, [searchTerm, filterPriority, filterCategory, filterCompleted]);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    const fetchStats = async () => {
        try {
          const response = await axios.get(`${API_URL}/statistics`);
          setStats(response.data);
          setShowStats(true);
        } catch (error) {
          console.error('Error fetching statistics:', error);
        }
    };

    const addTodo = async (e) => {
        e.preventDefault();
        if (!task.trim()) return;

        const newTodo = {
          task,
          description,
          priority,
          category,
          dueDate: dueDate || null,
          tags,
          completed: false
        };

        try {
          const response = await axios.post(API_URL, newTodo);
          setTodos([...todos, response.data]);
          resetForm();
        } catch (error) {
          console.error('Error creating todo:', error);
        }
    };

    const toggleTodo = async (id) => {
        try {
          const response = await axios.patch(`${API_URL}/${id}/toggle`);
          setTodos(todos.map(t => (t.id === id ? response.data : t)));
        } catch (error) {
          console.error('Error toggling todo:', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
          await axios.delete(`${API_URL}/${id}`);
          setTodos(todos.filter(t => t.id !== id));
        } catch (error) {
          console.error('Error deleting todo:', error);
        }
    };

    const deleteCompleted = async () => {
        try {
          await axios.delete(`${API_URL}/completed`);
          setTodos(todos.filter(t => !t.completed));
        } catch (error) {
          console.error('Error deleting completed todos:', error);
        }
    };

    const resetForm = () => {
        setTask('');
        setDescription('');
        setPriority('MEDIUM');
        setCategory('PERSONAL');
        setDueDate('');
        setTags('');
    };

    const handleDragStart = (e, todo) => {
        setDraggedItem(todo);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e, targetTodo) => {
        e.preventDefault();
        if (!draggedItem || draggedItem.id === targetTodo.id) return;

        const draggedIndex = todos.findIndex(t => t.id === draggedItem.id);
        const targetIndex = todos.findIndex(t => t.id === targetTodo.id);

        const newTodos = [...todos];
        newTodos.splice(draggedIndex, 1);
        newTodos.splice(targetIndex, 0, draggedItem);

        setTodos(newTodos);
        setDraggedItem(null);

        const orderList = newTodos.map((t) => ({ id: t.id }));
        try {
          await axios.patch(`${API_URL}/reorder`, orderList);
        } catch (error) {
          console.error('Error reordering todos:', error);
        }
    };

    const isOverdue = (dueDate, completed) => {
        if (!dueDate || completed) return false;
        return new Date(dueDate) < new Date();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };


  const completedCount = todos.filter(t => t.completed).length;
  const progressPercent = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  return (
    <div className={`app-wrapper ${isDark ? 'dark' : ''}`}>
      <div className="container">
        {/* Header */}
        <div className="card header-card">
          <div className="header-top">
            <h1 className="header-title">Advanced Todo</h1>
            <button onClick={() => setIsDark(!isDark)} className="theme-toggle-btn">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-labels">
              <span>Progress: {completedCount} / {todos.length}</span>
              <span className="font-semibold">{progressPercent}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fg" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={() => setShowFilters(!showFilters)} className="btn">
              <Filter size={16} /> Filters
            </button>
            <button onClick={fetchStats} className="btn">
              <BarChart3 size={16} /> Stats
            </button>
            <button onClick={deleteCompleted} className="btn btn-danger">
              <Trash2 size={16} /> Clear Done
            </button>
          </div>

          {/* Search & Filters */}
          {showFilters && (
            <div className="filter-controls">
              <div className="search-input-wrapper">
                <Search className="search-icon" size={18} />
                <input
                  type="text"
                  placeholder="Search todos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input search-input"
                />
              </div>
              <div className="filter-selects">
                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="select">
                  <option value="">All Priorities</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="select">
                  <option value="">All Categories</option>
                  <option value="PERSONAL">Personal</option>
                  <option value="WORK">Work</option>
                  <option value="SHOPPING">Shopping</option>
                  <option value="HEALTH">Health</option>
                  <option value="EDUCATION">Education</option>
                  <option value="OTHER">Other</option>
                </select>
                <select value={filterCompleted} onChange={(e) => setFilterCompleted(e.target.value)} className="select">
                  <option value="">All Status</option>
                  <option value="false">Active</option>
                  <option value="true">Completed</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Add Todo Form */}
        <form onSubmit={addTodo} className="card add-todo-form">
          <h2 className="form-title">Add New Task</h2>
          <div className="form-fields">
            <input
              type="text"
              placeholder="Task title..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="input"
              required
            />
            <textarea
              placeholder="Description (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea"
              rows="2"
            />
            <div className="form-grid">
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="select">
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent</option>
              </select>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="select">
                <option value="PERSONAL">Personal</option>
                <option value="WORK">Work</option>
                <option value="SHOPPING">Shopping</option>
                <option value="HEALTH">Health</option>
                <option value="EDUCATION">Education</option>
                <option value="OTHER">Other</option>
              </select>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input"
              />
              <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="input"
              />
            </div>
            <button type="submit" className="btn btn-submit">
              <Plus size={20} /> Add Task
            </button>
          </div>
        </form>

        {/* Todo List */}
        <div className="todo-list">
          {todos.map(todo => (
            <div
              key={todo.id}
              draggable
              onDragStart={(e) => handleDragStart(e, todo)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, todo)}
              className={`todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority.toLowerCase()}`}
            >
              <div className="todo-item-content">
                <button onClick={() => toggleTodo(todo.id)} className={`toggle-btn ${todo.completed ? 'completed' : ''}`}>
                  {todo.completed && <Check size={14} className="check-icon" />}
                </button>

                <div className="todo-details">
                  <div className="todo-header">
                    <h3 className="todo-task">{todo.task}</h3>
                    <GripVertical size={18} className="drag-handle" />
                  </div>

                  {todo.description && <p className="todo-description">{todo.description}</p>}

                  <div className="tags-container">
                    <span className={`tag priority-tag priority-${todo.priority.toLowerCase()}`}>{todo.priority}</span>
                    <span className={`tag category-tag category-${todo.category.toLowerCase()}`}>{todo.category}</span>
                    {todo.dueDate && (
                      <span className={`tag date-tag ${isOverdue(todo.dueDate, todo.completed) ? 'overdue' : ''}`}>
                        <Calendar size={12} /> {formatDate(todo.dueDate)}
                      </span>
                    )}
                    {todo.tags && todo.tags.split(',').map((tag, idx) => (
                      <span key={idx} className="tag generic-tag">
                        <Tag size={12} /> {tag.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="todo-timestamps">
                    {todo.createdAt && <span>Created: {formatDate(todo.createdAt)}</span>}
                    {todo.completedAt && <span className="completed-date">Completed: {formatDate(todo.completedAt)}</span>}
                  </div>
                </div>

                <button onClick={() => deleteTodo(todo.id)} className="delete-btn">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {todos.length === 0 && (
            <div className="empty-state">
              <p>No tasks yet. Create your first one!</p>
            </div>
          )}
        </div>

        {/* Statistics Modal */}
        {showStats && stats && (
          <div className="modal-overlay" onClick={() => setShowStats(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Statistics</h2>
                <button onClick={() => setShowStats(false)} className="modal-close-btn">
                  <X size={20} />
                </button>
              </div>

              <div className="stats-grid">
                <div className="stat-box stat-total">
                  <div className="stat-value">{stats.total}</div>
                  <div className="stat-label">Total</div>
                </div>
                <div className="stat-box stat-completed">
                    <div className="stat-value">{stats.completed}</div>
                    <div className="stat-label">Completed</div>
                </div>
                <div className="stat-box stat-pending">
                    <div className="stat-value">{stats.pending}</div>
                    <div className="stat-label">Pending</div>
                </div>
                <div className="stat-box stat-overdue">
                    <div className="stat-value">{stats.overdue}</div>
                    <div className="stat-label">Overdue</div>
                </div>
              </div>

              <div className="stats-breakdown">
                <div>
                  <h3 className="stats-subtitle">By Priority</h3>
                  <div className="stats-bars">
                    {Object.entries(stats.byPriority).map(([priority, count]) => (
                      <div key={priority} className="stat-bar-item">
                        <span className="stat-bar-label">{priority}</span>
                        <div className="stat-bar-bg">
                          <div
                            className={`stat-bar-fg priority-bg-${priority.toLowerCase()}`}
                            style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%`}}
                          >
                           {count > 0 && <span className="stat-bar-count">{count}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="stats-subtitle">By Category</h3>
                  <div className="stats-bars">
                    {Object.entries(stats.byCategory).map(([category, count]) => (
                      <div key={category} className="stat-bar-item">
                        <span className="stat-bar-label wide">{category}</span>
                        <div className="stat-bar-bg">
                          <div
                            className={`stat-bar-fg category-bg-${category.toLowerCase()}`}
                            style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%`}}
                          >
                            {count > 0 && <span className="stat-bar-count">{count}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;