package com.api.controllers;

import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@NoArgsConstructor
@RestController
@RequestMapping("/api/groups/")
public class GroupMemberController {

    @PostMapping("/join")
    String joinGroupWithCode() {
        return "joined group";
    }

    @GetMapping("/{groupID}/members")
    ArrayList<String> getMembers() {
        return new ArrayList<String>();
    }

    @DeleteMapping("/{groupID}/members/self")
    String leaveGroup(@PathVariable Number groupID) {
        return "left group";
    }

    @DeleteMapping("/{groupID}/members/{userID}")
    String kickMember(@PathVariable Number groupID, @PathVariable Number userID) {
        return "user kicked";
    }


}
