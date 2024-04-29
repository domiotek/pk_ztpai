package com.api.controllers;

import com.api.dto.GenericResponse;
import com.api.dto.GroupJoinRequest;
import com.api.dto.GroupMembersResponse;
import com.api.services.GroupService;
import com.api.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.api.Utils.accessDeniedResponse;

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
            return ResponseEntity.notFound().build();

        var initiator = userService.getSignedInUser();

        if(groupService.isInGroup(group.get(), initiator))
            return ResponseEntity.badRequest().body(
                    GenericResponse.builder()
                            .state(false)
                            .message("Already a member.")
                            .build()
            );

        var resolvedInitiator = userService.getUser(initiator.getID());

        if(resolvedInitiator.isPresent() && groupService.addToGroup(group.get(), resolvedInitiator.get()))
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

    @GetMapping("/{groupID}/members")
    ResponseEntity<GroupMembersResponse> getMembers(@PathVariable Number groupID) {
        var group = groupService.getGroup(groupID);

        if(group.isEmpty())
            return ResponseEntity.notFound().build();

        var initiator = userService.getSignedInUser();

        if(!groupService.isInGroup(group.get(), initiator))
            return ResponseEntity.status(403).body(
                    GroupMembersResponse.builder()
                            .state(false)
                            .message("Access denied.")
                            .build()
            );

        return ResponseEntity.ok(groupService.getGroupMembers(group.get()));

    }

    @DeleteMapping("/{groupID}/members/self")
    ResponseEntity<GenericResponse> leaveGroup(@PathVariable Number groupID) {
        var group = groupService.getGroup(groupID);

        if(group.isEmpty())
            return ResponseEntity.notFound().build();

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
            return ResponseEntity.notFound().build();

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
                            .message(resolvedUser.isPresent()?"Not a member.":"User not found.")
                            .build()
            );
    }


}
