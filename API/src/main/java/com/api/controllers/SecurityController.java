package com.api.controllers;

import com.api.dto.SignInResponse;
import com.api.dto.SignInRequest;
import com.api.dto.SignUpRequest;
import com.api.dto.GenericResponse;
import com.api.services.SecurityService;
import com.api.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class SecurityController {

    private final SecurityService securityService;
    private final UserService userService;

    @PostMapping("/signin")
    public ResponseEntity<SignInResponse> signIn(@RequestBody SignInRequest request) {
        return ResponseEntity.ok(securityService.signIn(request));
    }

    @PostMapping("/signup")
    public ResponseEntity<GenericResponse> signUp(@RequestBody SignUpRequest request) {
        if(userService.getSignedInUser()!=null) return ResponseEntity.badRequest().body(
                GenericResponse.builder()
                        .state(false).message("Sign out before proceeding.")
                        .build()
        );

        var requestValidity = securityService.validateSignUpRequest(request);

        if(!requestValidity.isState()) return ResponseEntity.badRequest().body(requestValidity);


        var user = userService.getUser(request.getEmail());

        if(user.isPresent())
            return ResponseEntity.badRequest().body(
                    GenericResponse.builder().state(false).message("User already exists").build()
            );

        securityService.signUp(request);
        return ResponseEntity.ok(GenericResponse.builder().state(true).build());
    }

}
