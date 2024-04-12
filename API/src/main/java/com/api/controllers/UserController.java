package com.api.controllers;

import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@NoArgsConstructor
@RequestMapping("/api")
public class UserController {
    @GetMapping("/me")
    String getSignedInUser() {
        return "Signed in user";
    }

    @GetMapping("/me/groups")
    String getGroupsOfSignedInUser() {
        return "Groups of signed in user.";
    }

    @GetMapping("/me/changelog")
    String getChangelog() {
        return "Changelog";
    }

}
