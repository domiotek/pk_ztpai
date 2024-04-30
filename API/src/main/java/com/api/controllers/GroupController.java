package com.api.controllers;

import com.api.dto.responses.GenericResponse;
import com.api.dto.Group;
import com.api.dto.requests.GroupDefManagementRequest;
import com.api.dto.responses.GroupResponse;
import com.api.services.GroupService;
import com.api.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.api.Utils.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/groups")
public class GroupController {

    private GroupService service;
    private UserService userService;

    @GetMapping("/{groupID}")
    ResponseEntity<GroupResponse> getGroup(@PathVariable Number groupID) {
        var group = service.getGroup(groupID);

        if(group.isEmpty())
            return ResponseEntity.status(404)
                    .body(GroupResponse.builder()
                            .state(false)
                            .code("NoEntity")
                            .message("Group doesn't exist")
                            .build()
                    );

        var initiator = userService.getSignedInUser();

        if(!service.isInGroup(group.get(), initiator))
            return ResponseEntity.status(403).body(new GroupResponse(false, "AccessDenied", null));

        return ResponseEntity.ok(GroupResponse.builder()
                .state(true)
                .data(group.get().getDTO())
                .build()
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
                                .build()

                );
            else return ResponseEntity.badRequest().body(
                    GenericResponse.builder()
                            .state(false)
                            .code("MaxOwnedGroupsReached")
                            .build()
            );
        }else
            return ResponseEntity.internalServerError().body(internalErrorResponse());
    }

    @PutMapping("/{groupID}")
    ResponseEntity<GenericResponse> updateGroupName(@PathVariable Number groupID, @RequestBody GroupDefManagementRequest request) {
        var requestValidity = service.validateGroupCreationRequest(request);

        if(!requestValidity.isState()) return ResponseEntity.badRequest().body(requestValidity);

        var groupOpt = service.getGroup(groupID);

        if(groupOpt.isEmpty())
            return ResponseEntity.status(404).body(groupNotFoundResponse());

        var group = groupOpt.get();
        var initiator = userService.getSignedInUser();

        if(!group.getOwner().getID().equals(initiator.getID())) {

            return ResponseEntity.status(403).body(accessDeniedResponse());
        }


        group.setName(request.getGroupName());

        if(service.updateGroup(group))
            return ResponseEntity.ok(
                    GenericResponse.builder()
                            .state(true)
                            .build()
            );
        else
            return ResponseEntity.internalServerError().body(internalErrorResponse());
    }

    @PostMapping("/{groupID}/regenInvite")
    ResponseEntity<GenericResponse> regenerateInviteCode(@PathVariable Number groupID) {
        var group = service.getGroup(groupID);

        if(group.isEmpty())
            return ResponseEntity.status(404).body(groupNotFoundResponse());

        var initiator = userService.getSignedInUser();

        if(!group.get().getOwner().getID().equals(initiator.getID())) {

            return ResponseEntity.status(403).body(accessDeniedResponse());
        }

        group.get().setInviteCode(service.generateInviteCode());

        if(service.updateGroup(group.get()))
            return ResponseEntity.ok(
                    GenericResponse.builder()
                            .state(true)
                            .build()
            );
        else
            return ResponseEntity.internalServerError().body(internalErrorResponse());
    }

}
