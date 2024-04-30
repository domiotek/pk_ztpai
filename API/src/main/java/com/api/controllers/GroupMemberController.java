package com.api.controllers;

import com.api.dto.responses.GenericResponse;
import com.api.dto.requests.GroupJoinRequest;
import com.api.dto.responses.GroupMembersResponse;
import com.api.services.GroupService;
import com.api.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.api.Utils.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/groups")
public class GroupMemberController {

    private GroupService groupService;
    private UserService userService;

    @PostMapping("/join")
    ResponseEntity<GenericResponse> joinGroupWithCode(@RequestBody GroupJoinRequest request) {
        var group = groupService.getGroup(request.getCode());

        if(group.isEmpty())
            return ResponseEntity.status(404).body(groupNotFoundResponse());

        var initiator = userService.getSignedInUser();

        if(groupService.isInGroup(group.get(), initiator))
            return ResponseEntity.badRequest().body(
                    GenericResponse.builder()
                            .state(false)
                            .code("AlreadyMember")
                            .build()
            );

        var resolvedInitiator = userService.getUser(initiator.getID());

        if(resolvedInitiator.isPresent() && groupService.addToGroup(group.get(), resolvedInitiator.get()))
            return ResponseEntity.ok(
                    GenericResponse.builder()
                            .state(true)
                            .build()
            );
        else
            return ResponseEntity.internalServerError().body(internalErrorResponse());
    }

    @GetMapping("/{groupID}/members")
    ResponseEntity<GroupMembersResponse> getMembers(@PathVariable Number groupID) {
        var group = groupService.getGroup(groupID);

        if(group.isEmpty())
            return ResponseEntity.status(404).body(new GroupMembersResponse(false,"NoEntity", "No such group."));

        var initiator = userService.getSignedInUser();

        if(!groupService.isInGroup(group.get(), initiator))
            return ResponseEntity.status(403).body(new GroupMembersResponse(false, "AccessDenied",null));

        return ResponseEntity.ok(
                GroupMembersResponse.builder()
                        .state(true)
                        .data(groupService.getGroupMembers(group.get()))
                        .build()
        );

    }

    @DeleteMapping("/{groupID}/members/self")
    ResponseEntity<GenericResponse> leaveGroup(@PathVariable Number groupID) {
        var group = groupService.getGroup(groupID);

        if(group.isEmpty())
            return ResponseEntity.status(404).body(groupNotFoundResponse());

        var initiator = userService.getSignedInUser();

        if(!groupService.isInGroup(group.get(), initiator))
            return ResponseEntity.status(403).body(accessDeniedResponse());

        var resolvedInitiator = userService.getUser(initiator.getID());

        resolvedInitiator.ifPresent(user -> groupService.removeFromGroup(group.get(), user));

        return ResponseEntity.ok(
                GenericResponse.builder()
                        .state(true)
                        .build()
        );

    }

    @DeleteMapping("/{groupID}/members/{userID}")
    ResponseEntity<GenericResponse> kickMember(@PathVariable Number groupID, @PathVariable Number userID) {
        var group = groupService.getGroup(groupID);

        if(group.isEmpty())
            return ResponseEntity.status(404).body(groupNotFoundResponse());

        var initiator = userService.getSignedInUser();

        if(!groupService.isGroupOwner(group.get(), initiator))
            return ResponseEntity.status(403).body(accessDeniedResponse());

        var resolvedUser = userService.getUser(userID);

        if(resolvedUser.isPresent() && groupService.removeFromGroup(group.get(), resolvedUser.get()))
            return ResponseEntity.ok(
                    GenericResponse.builder()
                            .state(true)
                            .build()
            );
        else
            return ResponseEntity.badRequest().body(
                    GenericResponse.builder()
                            .state(false)
                            .code(resolvedUser.isPresent()?"NotMember":"NoUser")
                            .build()
            );
    }


}
