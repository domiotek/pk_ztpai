package com.api.controllers;

import com.api.dto.UserBasic;
import com.api.dto.UserDetailsResponse;
import com.api.models.Group;
import com.api.models.User;
import com.api.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final UserService service;
    @GetMapping("/me")
    ResponseEntity<UserDetailsResponse> getSignedInUser() {
        UserBasic user = service.getSignedInUser();

        return ResponseEntity.ok(
                UserDetailsResponse
                        .builder()
                        .ID(user.getID())
                        .name(user.getName())
                        .groups(service.getGroupsOfAnUser(user.getID()))
                        .build()
        );
    }

    @GetMapping("/me/changelog")
    String getChangelog() {
        return "Changelog";
    }

}
