package com.example.todo_app.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.example.todo_app.model.Todo;
import com.example.todo_app.model.Todo.Category;
import com.example.todo_app.model.Todo.Priority;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    
    List<Todo> findAllByOrderByDisplayOrderAsc();
    
    List<Todo> findByCompleted(boolean completed);
    
    List<Todo> findByPriority(Priority priority);
    
    List<Todo> findByCategory(Category category);
    
    List<Todo> findByCompletedAndPriority(boolean completed, Priority priority);
    
    List<Todo> findByCompletedAndCategory(boolean completed, Category category);
    
    List<Todo> findByTaskContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String task, String description);
    
    long countByCompleted(boolean completed);
    
    long countByPriority(Priority priority);
    
    long countByCategory(Category category);
    
    long countByCompletedAndDueDateBefore(boolean completed, LocalDateTime date);
    
    @Transactional
    void deleteByCompleted(boolean completed);
    
    @Query("SELECT MAX(t.displayOrder) FROM Todo t")
    Integer findMaxDisplayOrder();
}