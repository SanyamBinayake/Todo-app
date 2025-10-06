package com.example.todo_app.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.todo_app.model.Todo;
import com.example.todo_app.model.Todo.Category;
import com.example.todo_app.model.Todo.Priority;
import com.example.todo_app.repository.TodoRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:3000")
public class TodoController {

    @Autowired
    private TodoRepository todoRepository;

    @GetMapping
    public ResponseEntity<List<Todo>> getAllTodos(
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) String search) {
        
        List<Todo> todos;
        
        if (search != null && !search.isEmpty()) {
            todos = todoRepository.findByTaskContainingIgnoreCaseOrDescriptionContainingIgnoreCase(search, search);
        } else if (completed != null && priority != null) {
            todos = todoRepository.findByCompletedAndPriority(completed, priority);
        } else if (completed != null && category != null) {
            todos = todoRepository.findByCompletedAndCategory(completed, category);
        } else if (completed != null) {
            todos = todoRepository.findByCompleted(completed);
        } else if (priority != null) {
            todos = todoRepository.findByPriority(priority);
        } else if (category != null) {
            todos = todoRepository.findByCategory(category);
        } else {
            todos = todoRepository.findAllByOrderByDisplayOrderAsc();
        }
        
        return ResponseEntity.ok(todos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
        return todoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Todo> createTodo(@Valid @RequestBody Todo todo) {
        if (todo.getDisplayOrder() == null) {
            Integer maxOrder = todoRepository.findMaxDisplayOrder();
            todo.setDisplayOrder(maxOrder == null ? 0 : maxOrder + 1);
        }
        Todo savedTodo = todoRepository.save(todo);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTodo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @Valid @RequestBody Todo todoDetails) {
        return todoRepository.findById(id)
                .map(existingTodo -> {
                    existingTodo.setTask(todoDetails.getTask());
                    existingTodo.setDescription(todoDetails.getDescription());
                    existingTodo.setCompleted(todoDetails.isCompleted());
                    existingTodo.setPriority(todoDetails.getPriority());
                    existingTodo.setCategory(todoDetails.getCategory());
                    existingTodo.setDueDate(todoDetails.getDueDate());
                    existingTodo.setTags(todoDetails.getTags());
                    existingTodo.setDisplayOrder(todoDetails.getDisplayOrder());
                    
                    Todo updatedTodo = todoRepository.save(existingTodo);
                    return ResponseEntity.ok(updatedTodo);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Todo> toggleTodo(@PathVariable Long id) {
        return todoRepository.findById(id)
                .map(todo -> {
                    todo.setCompleted(!todo.isCompleted());
                    Todo updatedTodo = todoRepository.save(todo);
                    return ResponseEntity.ok(updatedTodo);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/reorder")
    public ResponseEntity<Void> reorderTodos(@RequestBody List<Map<String, Long>> orderList) {
        for (int i = 0; i < orderList.size(); i++) {
            final int displayOrder = i;
            Long id = orderList.get(i).get("id");
            todoRepository.findById(id).ifPresent(todo -> {
                todo.setDisplayOrder(displayOrder);
                todoRepository.save(todo);
            });
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        if (todoRepository.existsById(id)) {
            todoRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/completed")
    public ResponseEntity<Void> deleteCompletedTodos() {
        todoRepository.deleteByCompleted(true);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        long total = todoRepository.count();
        long completed = todoRepository.countByCompleted(true);
        long pending = total - completed;
        long overdue = todoRepository.countByCompletedAndDueDateBefore(false, LocalDateTime.now());
        
        Map<String, Long> byPriority = Map.of(
            "LOW", todoRepository.countByPriority(Priority.LOW),
            "MEDIUM", todoRepository.countByPriority(Priority.MEDIUM),
            "HIGH", todoRepository.countByPriority(Priority.HIGH),
            "URGENT", todoRepository.countByPriority(Priority.URGENT)
        );
        
        Map<String, Long> byCategory = Map.of(
            "PERSONAL", todoRepository.countByCategory(Category.PERSONAL),
            "WORK", todoRepository.countByCategory(Category.WORK),
            "SHOPPING", todoRepository.countByCategory(Category.SHOPPING),
            "HEALTH", todoRepository.countByCategory(Category.HEALTH),
            "EDUCATION", todoRepository.countByCategory(Category.EDUCATION),
            "OTHER", todoRepository.countByCategory(Category.OTHER)
        );
        
        Map<String, Object> stats = Map.of(
            "total", total,
            "completed", completed,
            "pending", pending,
            "overdue", overdue,
            "byPriority", byPriority,
            "byCategory", byCategory
        );
        
        return ResponseEntity.ok(stats);
    }
}