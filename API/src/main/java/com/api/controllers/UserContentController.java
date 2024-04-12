package com.api.controllers;

import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@NoArgsConstructor
@RequestMapping("/api/groups/{groupID}")
public class UserContentController {

    @GetMapping("/tasks")
    ArrayList<String> getTasks(@PathVariable Number groupID) {
        return new ArrayList<String>();
    }

    @GetMapping("/notes")
    ArrayList<String> getNotes(@PathVariable Number groupID) {
        return new ArrayList<>();
    }

    @PostMapping("/tasks")
    String createTask(@PathVariable Number groupID) {
        return  "task created";
    }

    @PostMapping("/notes")
    String createNote(@PathVariable Number groupID) {
        return "note created";
    }

    @PutMapping("/tasks/{taskID}")
    String updateTask(@PathVariable Number groupID, @PathVariable Number taskID) {
        return "task updated";
    }

    @PutMapping("/tasks/{taskID}/state")
    String updateTaskState(@PathVariable Number groupID, @PathVariable Number taskID) {
        return "task state updated";
    }

    @PutMapping("/notes/{noteID}")
    String updateNote(@PathVariable Number groupID, @PathVariable Number noteID) {
        return "note updated";
    }

    @DeleteMapping("/tasks/{taskID}")
    String deleteTask(@PathVariable Number groupID, @PathVariable Number taskID){
        return "task deleted";
    }

    @DeleteMapping("/notes/{noteID}")
    String deleteNote(@PathVariable Number groupID, @PathVariable Number noteID) {
        return "note deleted";
    }



}
