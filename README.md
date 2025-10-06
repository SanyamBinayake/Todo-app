# Advanced Todo App

A full-stack todo application built with React and Spring Boot, featuring advanced task management capabilities with priorities, categories, due dates, and comprehensive filtering options.

![Advanced Todo App](https://img.shields.io/badge/React-19.2.0-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)

## Features

### Core Functionality
- ✅ **Create, Read, Update, Delete (CRUD)** operations for todos
- ✅ **Task Completion** tracking with toggle functionality
- ✅ **Drag & Drop** reordering for task prioritization
- ✅ **Search** functionality across task titles and descriptions
- ✅ **Advanced Filtering** by priority, category, and completion status

### Task Management
- **Priority Levels**: Low, Medium, High, Urgent
- **Categories**: Personal, Work, Shopping, Health, Education, Other
- **Due Dates**: Set deadlines with overdue highlighting
- **Tags**: Add custom comma-separated tags
- **Descriptions**: Detailed task descriptions
- **Timestamps**: Automatic tracking of creation and completion dates

### User Interface
- 🌓 **Dark/Light Mode** with smooth transitions
- 📊 **Progress Tracking** with visual progress bar
- 📈 **Statistics Dashboard** with charts for priorities and categories
- 🎨 **Color-Coded Tags** for visual organization
- 📱 **Fully Responsive** design for all screen sizes
- ⚡ **Smooth Animations** and hover effects

## Technology Stack

### Frontend
- **React** 19.2.0 - UI library
- **Axios** 1.12.2 - HTTP client
- **Lucide React** - Icon library
- **CSS3** - Custom styling

### Backend
- **Spring Boot** 3.5.6
- **Spring Data JPA** - Database abstraction
- **MySQL** - Relational database
- **Lombok** - Boilerplate reduction
- **Maven** - Build tool

## Prerequisites

Before running this application, ensure you have:

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **Java** (JDK 17 or higher)
- **MySQL** (v8.0 or higher)
- **Maven** (v3.6 or higher)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone [https://github.com/yourusername/todo-app.git](https://github.com/SanyamBinayake/Todo-app.git)
cd todo-app
```

### 2. Database Setup

```sql
CREATE DATABASE todo_db;
```

### 3. Configure Backend

Update `todo-app/src/main/resources/application.properties`:

```properties
spring.application.name=todo-app
spring.datasource.url=jdbc:mysql://localhost:3306/todo_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### 4. Run Backend

```bash
cd todo-app
./mvnw spring-boot:run
```

Or on Windows:
```bash
.\mvnw.cmd spring-boot:run
```

The backend will start at `http://localhost:8080`

### 5. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 6. Run Frontend

```bash
npm start
```

The frontend will start at `http://localhost:3000`

## Project Structure

```
todo-app/
├── frontend/                      # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js                # Main React component
│   │   ├── App.css               # Styling
│   │   └── index.js              # Entry point
│   └── package.json
│
└── todo-app/                      # Spring Boot backend
    ├── src/
    │   ├── main/
    │   │   ├── java/com/example/todo_app/
    │   │   │   ├── controller/
    │   │   │   │   └── TodoController.java
    │   │   │   ├── model/
    │   │   │   │   └── Todo.java
    │   │   │   ├── repository/
    │   │   │   │   └── TodoRepository.java
    │   │   │   └── TodoAppApplication.java
    │   │   └── resources/
    │   │       └── application.properties
    │   └── test/
    └── pom.xml
```

## API Endpoints

### Todo Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos (with optional filters) |
| GET | `/api/todos/{id}` | Get specific todo by ID |
| POST | `/api/todos` | Create new todo |
| PUT | `/api/todos/{id}` | Update existing todo |
| PATCH | `/api/todos/{id}/toggle` | Toggle completion status |
| DELETE | `/api/todos/{id}` | Delete specific todo |
| DELETE | `/api/todos/completed` | Delete all completed todos |
| PATCH | `/api/todos/reorder` | Reorder todos |
| GET | `/api/todos/statistics` | Get statistics |

### Query Parameters

- `?search=keyword` - Search in task and description
- `?priority=HIGH` - Filter by priority
- `?category=WORK` - Filter by category
- `?completed=true` - Filter by completion status

## Usage Guide

### Creating a Task

1. Enter task title (required)
2. Add description (optional)
3. Select priority level
4. Choose category
5. Set due date (optional)
6. Add tags separated by commas (optional)
7. Click "Add Task"

### Managing Tasks

- **Complete/Uncomplete**: Click the circle checkbox
- **Delete**: Click the trash icon
- **Reorder**: Drag and drop tasks using the grip handle
- **View Details**: Task cards show all information

### Filtering & Search

1. Click "Filters" button
2. Use search box for text search
3. Select filters for priority, category, or status
4. Filters can be combined

### Statistics

Click "Stats" button to view:
- Total, completed, pending, and overdue counts
- Distribution by priority
- Distribution by category

### Theme Toggle

Click the moon/sun icon to switch between dark and light modes.

## Database Schema

### Todo Table

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key (auto-increment) |
| task | VARCHAR(255) | Task title (required) |
| description | TEXT | Task description |
| completed | BOOLEAN | Completion status |
| priority | ENUM | LOW, MEDIUM, HIGH, URGENT |
| category | ENUM | PERSONAL, WORK, SHOPPING, HEALTH, EDUCATION, OTHER |
| due_date | DATETIME | Deadline |
| tags | VARCHAR(255) | Comma-separated tags |
| display_order | INT | Order for display |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |
| completed_at | DATETIME | Completion timestamp |

## Troubleshooting

### Common Issues

**Backend won't start**
- Verify MySQL is running
- Check database credentials in `application.properties`
- Ensure port 8080 is available

**Frontend can't connect to backend**
- Verify backend is running on port 8080
- Check CORS settings in `TodoController.java`
- Ensure API_URL in `App.js` is correct

**Database errors**
- Run `CREATE DATABASE todo_db;` in MySQL
- Check MySQL user permissions
- Verify MySQL version compatibility

## Future Enhancements

- [ ] User authentication (JWT)
- [ ] Multi-user support
- [ ] Task sharing and collaboration
- [ ] Recurring tasks
- [ ] Email notifications for due dates
- [ ] File attachments
- [ ] Comments on tasks
- [ ] Calendar view
- [ ] Export/Import (JSON, CSV)
- [ ] Offline mode (PWA)
- [ ] Mobile app (React Native)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Spring Boot documentation
- React documentation
- Lucide Icons
- MySQL community

---

Made with ❤️ using React and Spring Boot
