package com.example.todo_app.repository;

import org.springframework.stereotype.Repository;
import com.example.todo_app.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;


@Repository
public interface TodoRepository extends JpaRepository<Todo,Long> {

}