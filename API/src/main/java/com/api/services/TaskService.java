package com.api.services;

import com.api.dto.EventLogEntryContents.AlterTaskContent;
import com.api.dto.EventLogEntryContents.AlterTaskStateContent;
import com.api.dto.EventLogEntryContents.GenericContent;
import com.api.dto.UserBasic;
import com.api.dto.requests.ResolvedTaskDefManagementRequest;
import com.api.dto.requests.TaskDefManagementRequest;
import com.api.dto.responses.GenericResponse;
import com.api.models.Group;
import com.api.models.Task;
import com.api.models.User;
import com.api.repositories.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.api.Utils.groupNotFoundResponse;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository repository;
    private final UserService userService;
    private final GroupService groupService;

    public ResolvedTaskDefManagementRequest validateTaskCreationRequest(TaskDefManagementRequest request) {
        final var response = ResolvedTaskDefManagementRequest.builder();

        response.isValid(false);

        if(request.getTitle()==null) {
            response.validationErrorMessage("title field is required.");
            return response.build();
        }else response.title(request.getTitle());

        if(request.getAssignedUserID()!=null) {
            final var user = userService.getUser(request.getAssignedUserID());

            if(user.isEmpty()){
                response.validationErrorMessage("cannot assign non-existent user.");
                return response.build();
            }else response.assignedUser(user.get());
        }

        response.dueDate(request.getDueDate());

        response.isValid(true);
        return response.build();
    }

    public ResponseEntity<GenericResponse> verifyBelongsToGroup(Task task, Number groupID) {
        final var group = groupService.getGroup(groupID);

        if(group.isEmpty())
            return ResponseEntity.status(404).body(groupNotFoundResponse());

        if(!group.get().getTasks().contains(task))
            return ResponseEntity.status(400).body(new GenericResponse(false, "UnrecognizedEntity","Group doesn't have such task."));

        return null;
    }

    public List<com.api.dto.Task> getTasks(Group group) {
        final var tasks = repository.findTasksByGroup(group);

        final var result = new ArrayList<com.api.dto.Task>();

        for (var task : tasks) {
            var assignedUser = task.getAssignedUser();
            if(assignedUser!=null&&!groupService.isInGroup(group, assignedUser.getDTO()))
                assignedUser = null;

            result.add(com.api.dto.Task.builder()
                            .taskID(task.getID())
                            .creator(task.getCreator().getDTO())
                            .title(task.getTitle())
                            .creationDate(task.getCreatedAt())
                            .assignedUser(assignedUser!=null?assignedUser.getDTO():null)
                            .group(task.getGroup().getBasicDTO())
                            .dueDate(task.getDueDate())
                            .isCompleted(task.getCompletionState())
                            .build()
            );
        }


        return result;
    }

    public com.api.dto.Task getTaskDTO(Number taskID) {
        final var task = repository.findById(taskID.intValue());

        if(task.isEmpty()) return null;

        var assignedUser = task.get().getAssignedUser();
        if(assignedUser!=null&&!groupService.isInGroup(task.get().getGroup(), assignedUser.getDTO()))
            assignedUser = null;

        return com.api.dto.Task.builder()
                .taskID(task.get().getID())
                .creator(task.get().getCreator().getDTO())
                .title(task.get().getTitle())
                .creationDate(task.get().getCreatedAt())
                .assignedUser(assignedUser!=null?assignedUser.getDTO():null)
                .group(task.get().getGroup().getBasicDTO())
                .dueDate(task.get().getDueDate())
                .isCompleted(task.get().getCompletionState())
                .build();
    }

    public Optional<Task> getTask(Number taskID) {
        return repository.findById(taskID.intValue());
    }

    public Task createTask(ResolvedTaskDefManagementRequest request, Group group, User creator) {
        var task = Task.builder()
                .creator(creator)
                .title(request.getTitle())
                .createdAt(new Date())
                .assignedUser(request.getAssignedUser())
                .group(group)
                .dueDate(request.getDueDate())
                .completionState(false)
                .build();

        try {

            SimpleDateFormat sdf;
            sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");

            var content = AlterTaskContent.builder()
                    .scope("task")
                    .type("create")
                    .name(task.getTitle())
                    .dueDate(task.getDueDate()!=null?sdf.format(task.getDueDate()):null)
                    .assignedUser(task.getAssignedUser()!=null?task.getAssignedUser().getDTO():null)
                    .build();

            groupService.postEventLogEntry(group, creator.getDTO(), content);
            task = repository.save(task);
        }catch(Exception ex) {
            System.out.println(ex.getMessage());
            return null;
        }

        return task;
    }

    public Task updateTask(Task task, UserBasic initiator, boolean isJustState) {
        try {
            SimpleDateFormat sdf;
            sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");

            var content = isJustState?
                    AlterTaskStateContent.builder()
                            .scope("task")
                            .type("updateState")
                            .name(task.getTitle())
                            .state(task.getCompletionState())
                            .build()
            :
                    AlterTaskContent.builder()
                            .scope("task")
                            .type("update")
                            .name(task.getTitle())
                            .dueDate(task.getDueDate()!=null?sdf.format(task.getDueDate()):null)
                            .assignedUser(task.getAssignedUser()!=null?task.getAssignedUser().getDTO():null)
                            .build();

            groupService.postEventLogEntry(task.getGroup(), initiator, content);

            task = repository.save(task);
        }catch(Exception ex) {
            System.out.println(ex.getMessage());
            return null;
        }

        return task;
    }

    public boolean deleteTask(Task task, UserBasic initiator) {
        try {
            var group = task.getGroup();
            if(!group.getTasks().remove(task)) return false;

            group = groupService.updateGroup(group);
            repository.delete(task);

            var content = GenericContent.builder()
                    .scope("task")
                    .type("delete")
                    .name(task.getTitle())
                    .build();

            groupService.postEventLogEntry(task.getGroup(), initiator, content);

            return group!=null;
        }catch (Exception ex) {
            return false;
        }

    }
}
