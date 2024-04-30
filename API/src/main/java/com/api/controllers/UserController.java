package com.api.controllers;

import com.api.dto.User;
import com.api.dto.responses.GenericResponse;
import com.api.dto.UserBasic;
import com.api.dto.responses.UserDetailsResponse;
import com.api.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final UserService service;
    @GetMapping("/me")
    ResponseEntity<UserDetailsResponse> getSignedInUser() {
        UserBasic user = service.getSignedInUser();

        return ResponseEntity.ok(
                UserDetailsResponse.builder()
                        .state(true)
                        .data(new User(user.getID(), user.getName(), service.getGroupsOfAnUser(user.getID())))
                        .build()
        );
    }

    @GetMapping("/me/changelog")
    String getChangelog() {
        return "Changelog";
    }

}
