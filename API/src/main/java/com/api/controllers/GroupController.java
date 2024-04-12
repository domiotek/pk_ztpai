package com.api.controllers;

import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@NoArgsConstructor
@RequestMapping("/api/groups")
public class GroupController {

    @GetMapping("/{groupID}")
    String getGroup(@PathVariable Number groupID) {
        return "Group data";
    }

    @PostMapping()
    String createGroup() {
        return "group created (or not)";
    }

    @PutMapping()
    String updateGroupName() {
        return "group renamed";
    }

    @PostMapping("/regenInvite")
    String regenerateInviteCode() {
        return "invite code generated";
    }

}
