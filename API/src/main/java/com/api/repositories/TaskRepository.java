package com.api.repositories;

import com.api.models.Group;
import com.api.models.Task;
import com.api.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findTasksByGroup(Group group);

}
