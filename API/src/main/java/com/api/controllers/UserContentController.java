package com.api.controllers;
import com.api.dto.UserBasic;
import com.api.dto.requests.NoteDefManagementRequest;
import com.api.dto.requests.TaskDefManagementRequest;
import com.api.dto.requests.TaskStateManagementRequest;
import com.api.dto.responses.*;
import com.api.models.Note;
import com.api.models.Task;
import com.api.services.GroupService;
import com.api.services.NoteService;
import com.api.services.TaskService;
import com.api.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

import static com.api.Utils.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/groups/{groupID}")
public class UserContentController {

    private final GroupService groupService;
    private final TaskService taskService;
    private final NoteService noteService;
    private final UserService userService;

    @GetMapping("/tasks")
    ResponseEntity<TasksResponse> getTasks(@PathVariable Number groupID) {
        var group = groupService.getGroup(groupID);


        if(group.isEmpty())
            return ResponseEntity.status(404).body(new TasksResponse(false,"NoEntity", "No such group."));

        var initiator = userService.getSignedInUser();

        if(!groupService.isInGroup(group.get(), initiator))
            return ResponseEntity.status(403).body(new TasksResponse(false, "AccessDenied",null));

        return ResponseEntity.ok(
                TasksResponse.builder()
                        .state(true)
                        .data(taskService.getTasks(group.get()))
                        .build()
        );
    }

    @GetMapping("/notes")
    ResponseEntity<NotesResponse> getNotes(@PathVariable Number groupID) {
        var group = groupService.getGroup(groupID);


        if(group.isEmpty())
            return ResponseEntity.status(404).body(new NotesResponse(false,"NoEntity", "No such group."));

        var initiator = userService.getSignedInUser();

        if(!groupService.isInGroup(group.get(), initiator))
            return ResponseEntity.status(403).body(new NotesResponse(false, "AccessDenied",null));

        return ResponseEntity.ok(
                NotesResponse.builder()
                        .state(true)
                        .data(noteService.getNotes(group.get()))
                        .build()
        );
    }

    @GetMapping("/tasks/{taskID}")
    ResponseEntity<TaskResponse> getTask(@PathVariable Number groupID, @PathVariable Number taskID) {
        var group = groupService.getGroup(groupID);


        if(group.isEmpty())
            return ResponseEntity.status(404).body(new TaskResponse(false,"NoEntity", "No such group."));

        var initiator = userService.getSignedInUser();

        if(!groupService.isInGroup(group.get(), initiator))
            return ResponseEntity.status(403).body(new TaskResponse(false, "AccessDenied",null));

        var task = taskService.getTaskDTO(taskID);

        if(task==null)
            return ResponseEntity.status(404).body(new TaskResponse(false, "NoEntity", "No such task."));

        return ResponseEntity.ok(
                TaskResponse.builder()
                        .state(true)
                        .data(task)
                        .build()
        );
    }

    @GetMapping("/notes/{noteID}")
    ResponseEntity<NoteResponse> getNote(@PathVariable Number groupID, @PathVariable Number noteID) {
        var group = groupService.getGroup(groupID);

        if(group.isEmpty())
            return ResponseEntity.status(404).body(new NoteResponse(false,"NoEntity", "No such group."));

        var initiator = userService.getSignedInUser();

        if(!groupService.isInGroup(group.get(), initiator))
            return ResponseEntity.status(403).body(new NoteResponse(false, "AccessDenied",null));

        var note = noteService.getNote(noteID);

        if(note.isEmpty())
            return ResponseEntity.status(404).body(new NoteResponse(false, "NoEntity", "No such note."));

        return ResponseEntity.ok(
                NoteResponse.builder()
                        .state(true)
                        .data(note.get().getDTO())
                        .build()
        );
    }

    @PostMapping("/tasks")
    ResponseEntity<GenericResponse> createTask(@PathVariable Number groupID, @RequestBody TaskDefManagementRequest request) {
        var resolvedRequest = taskService.validateTaskCreationRequest(request);

        if(!resolvedRequest.isValid()) return ResponseEntity.badRequest().body(GenericResponse.builder()
                        .state(false)
                        .code("BadRequest")
                        .message(resolvedRequest.getValidationErrorMessage())
                        .build());

        var group = groupService.getGroup(groupID);
        var initiator = userService.getSignedInUser();

        final var response = groupService.validateGroupMembership(group, initiator);

        if(response!=null) return response;

        var user = userService.getUser(userService.getSignedInUser().getEmail());

        if(user.isPresent()&&taskService.createTask(resolvedRequest,group.orElseThrow(), user.get())!=null)
            return ResponseEntity.ok(
                    GenericResponse.builder()
                            .state(true)
                            .build()

            );

        return ResponseEntity.internalServerError().body(internalErrorResponse());
    }

    @PostMapping("/notes")
    ResponseEntity<GenericResponse> createNote(@PathVariable Number groupID, @RequestBody NoteDefManagementRequest request) {
        var requestValidationResponse = noteService.validateNoteCreationRequest(request);

        if(requestValidationResponse!=null) return ResponseEntity.badRequest().body(requestValidationResponse);

        var group = groupService.getGroup(groupID);
        var initiator = userService.getSignedInUser();

        final var response = groupService.validateGroupMembership(group, initiator);
        if(response!=null) return response;


        var user = userService.getUser(userService.getSignedInUser().getEmail());

        if(user.isPresent()&&noteService.createNote(request,group.orElseThrow(), user.get())!=null)
            return ResponseEntity.ok(
                    GenericResponse.builder()
                            .state(true)
                            .build()

            );

        return ResponseEntity.internalServerError().body(internalErrorResponse());
    }

    @PutMapping("/tasks/{taskID}")
    ResponseEntity<GenericResponse> updateTask(@PathVariable Number groupID, @PathVariable Number taskID, @RequestBody TaskDefManagementRequest request) {
        var resolvedRequest = taskService.validateTaskCreationRequest(request);

        if(!resolvedRequest.isValid()) return ResponseEntity.badRequest().body(GenericResponse.builder()
                .state(false)
                .code("BadRequest")
                .message(resolvedRequest.getValidationErrorMessage())
                .build());

        var maybeTask = taskService.getTask(taskID);

        if(maybeTask.isEmpty())
            return ResponseEntity.status(404).body(taskNotFoundResponse());

        var task = maybeTask.get();
        var initiator = userService.getSignedInUser();

        var response = groupService.validateGroupMembership(Optional.ofNullable(task.getGroup()), initiator);
        if(response!=null) return response;

        response = taskService.verifyBelongsToGroup(task, groupID);
        if(response!=null) return response;

        task.setTitle(resolvedRequest.getTitle());
        task.setDueDate(resolvedRequest.getDueDate());
        task.setAssignedUser(resolvedRequest.getAssignedUser());

        if(taskService.updateTask(task)!=null)
            return ResponseEntity.ok(
                    GenericResponse.builder()
                            .state(true)
                            .build()
            );
        else
            return ResponseEntity.internalServerError().body(internalErrorResponse());
    }

    @PutMapping("/tasks/{taskID}/state")
   ResponseEntity<GenericResponse> updateTaskState(@PathVariable Number groupID, @PathVariable Number taskID, @RequestBody TaskStateManagementRequest request) {
        Optional<Task> maybeTask = taskService.getTask(taskID);

        if (maybeTask.isPresent()) {
            Task task = maybeTask.get();
            UserBasic initiator = userService.getSignedInUser();

            var response = groupService.validateGroupMembership(Optional.ofNullable(task.getGroup()), initiator);
            if (response != null) return response;

            response = taskService.verifyBelongsToGroup(task, groupID);
            if(response!=null) return response;

            task.setCompletionState(request.isState());

            if (taskService.updateTask(task) != null)
                return ResponseEntity.ok(
                        GenericResponse.builder()
                                .state(true)
                                .build()
                );
            else
                return ResponseEntity.internalServerError().body(internalErrorResponse());

        }else return ResponseEntity.status(404).body(taskNotFoundResponse());
    }

    @PutMapping("/notes/{noteID}")
    ResponseEntity<GenericResponse> updateNote(@PathVariable Number groupID, @PathVariable Number noteID, @RequestBody NoteDefManagementRequest request) {
        var requestValidationResponse = noteService.validateNoteCreationRequest(request);

        if(requestValidationResponse!=null) return ResponseEntity.badRequest().body(requestValidationResponse);

        var maybeNote = noteService.getNote(noteID);

        if(maybeNote.isEmpty())
            return ResponseEntity.status(404).body(noteNotFoundResponse());

        Note note = maybeNote.get();
        var initiator = userService.getSignedInUser();

        var response = groupService.validateGroupMembership(Optional.ofNullable(note.getGroup()), initiator);
        if(response!=null) return response;

        response = noteService.verifyBelongsToGroup(note, groupID);
        if(response!=null) return response;

        note.setTitle(request.getTitle());
        note.setContent(request.getContent());

        if(noteService.updateNote(note)!=null)
            return ResponseEntity.ok(
                    GenericResponse.builder()
                            .state(true)
                            .build()
            );
        else
            return ResponseEntity.internalServerError().body(internalErrorResponse());
    }

    @DeleteMapping("/tasks/{taskID}")
    ResponseEntity<GenericResponse> deleteTask(@PathVariable Number groupID, @PathVariable Number taskID){
        var maybeTask = taskService.getTask(taskID);

        if(maybeTask.isEmpty())
            return ResponseEntity.status(404).body(taskNotFoundResponse());

        var initiator = userService.getSignedInUser();

        var response = groupService.validateGroupMembership(Optional.ofNullable(maybeTask.get().getGroup()), initiator);
        if (response != null) return response;

        response = taskService.verifyBelongsToGroup(maybeTask.get(), groupID);
        if(response!=null) return response;

        if(taskService.deleteTask(maybeTask.get()))
            return ResponseEntity.ok(
                GenericResponse.builder()
                        .state(true)
                        .build()
            );
        else
            return ResponseEntity.internalServerError().body(internalErrorResponse());
    }

    @DeleteMapping("/notes/{noteID}")
    ResponseEntity<GenericResponse> deleteNote(@PathVariable Number groupID, @PathVariable Number noteID) {
        var maybeNote = noteService.getNote(noteID);

        if(maybeNote.isEmpty())
            return ResponseEntity.status(404).body(noteNotFoundResponse());

        UserBasic initiator = userService.getSignedInUser();

        var response = groupService.validateGroupMembership(Optional.ofNullable(maybeNote.get().getGroup()), initiator);
        if (response != null) return response;

        response = noteService.verifyBelongsToGroup(maybeNote.get(), groupID);
        if(response!=null) return response;

        if(noteService.deleteNote(maybeNote.get()))
            return ResponseEntity.ok(
                    GenericResponse.builder()
                            .state(true)
                            .build()
            );
        else
            return ResponseEntity.internalServerError().body(internalErrorResponse());
    }
}
