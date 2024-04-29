package com.api.controllers;

import com.api.dto.GenericResponse;
import com.api.dto.Group;
import com.api.dto.GroupDefManagementRequest;
import com.api.services.GroupService;
import com.api.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/groups")
public class GroupController {

    private GroupService service;
    private UserService userService;

    @GetMapping("/{groupID}")
    ResponseEntity<Group> getGroup(@PathVariable Number groupID) {
        var group = service.getGroup(groupID);

        if(group.isEmpty()) return ResponseEntity.notFound().build();

        var initiator = userService.getSignedInUser();

        if(!service.isInGroup(group.get(), initiator))
            return ResponseEntity.status(403).build();

        return ResponseEntity.ok(
                group.get().getDTO()
        );
    }

    @PostMapping()
    ResponseEntity<GenericResponse> createGroup(@RequestBody GroupDefManagementRequest request) {
        var requestValidity = service.validateGroupCreationRequest(request);

        if(!requestValidity.isState()) return ResponseEntity.badRequest().body(requestValidity);

        var user = userService.getUser(userService.getSignedInUser().getEmail());

        if(user.isPresent()) {

            var userOwnedGroupCount = userService.getUserOwnedGroups(user.get().getID()).size();

            if(userOwnedGroupCount < GroupService.MAXIMUM_OWNED_GROUPS && service.createGroup(request, user.get()))
                return ResponseEntity.ok(
                        GenericResponse.builder()
                                .state(true)
                                .message("Success")
                                .build()

                );
            else return ResponseEntity.badRequest().body(
                    GenericResponse.builder()
                            .state(false)
                            .message("Maximum owned group count reached.")
                            .build()
            );
        }else
            return ResponseEntity.internalServerError().body(
                    GenericResponse.builder()
                            .state(false)
                            .message("Unexpected error")
                            .build()
            );
    }

    @PutMapping("/{groupID}")
    ResponseEntity<GenericResponse> updateGroupName(@PathVariable Number groupID, @RequestBody GroupDefManagementRequest request) {
        var requestValidity = service.validateGroupCreationRequest(request);

        if(!requestValidity.isState()) return ResponseEntity.badRequest().body(requestValidity);

        var groupOpt = service.getGroup(groupID);

        if(groupOpt.isEmpty())
            return ResponseEntity.notFound().build();

        var group = groupOpt.get();
        var initiator = userService.getSignedInUser();

        if(!group.getOwner().getID().equals(initiator.getID())) {

            return ResponseEntity.status(403).body(
                    GenericResponse.builder()
                            .state(false)
                            .message("Access denied.")
                            .build()
            );
        }


        group.setName(request.getGroupName());

        if(service.updateGroup(group))
            return ResponseEntity.ok(
                    GenericResponse.builder()
                            .state(true)
                            .message("Success")
                            .build()
            );
        else
            return ResponseEntity.internalServerError().body(
                    GenericResponse.builder()
                            .state(false)
                            .message("Unexpected error")
                            .build()
            );
    }

    @PostMapping("/{groupID}/regenInvite")
    ResponseEntity<GenericResponse> regenerateInviteCode(@PathVariable Number groupID) {
        var group = service.getGroup(groupID);

        if(group.isEmpty())
            return ResponseEntity.notFound().build();

        var initiator = userService.getSignedInUser();

        if(!group.get().getOwner().getID().equals(initiator.getID())) {

            return ResponseEntity.status(403).body(
                    GenericResponse.builder()
                            .state(false)
                            .message("Access denied.")
                            .build()
            );
        }

        group.get().setInviteCode(service.generateInviteCode());

        if(service.updateGroup(group.get()))
            return ResponseEntity.ok(
                    GenericResponse.builder()
                            .state(true)
                            .message("Success")
                            .build()
            );
        else
            return ResponseEntity.internalServerError().body(
                    GenericResponse.builder()
                            .state(false)
                            .message("Unexpected error")
                            .build()
            );
    }

}
