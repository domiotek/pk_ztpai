package com.api.controllers;

import com.api.dto.requests.SignInRequest;
import com.api.dto.requests.SignUpRequest;
import com.api.dto.responses.GenericResponse;
import com.api.dto.responses.SignInResponse;
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
        var result = securityService.signIn(request);

        if(result.isState()) return  ResponseEntity.ok(result);
        else return ResponseEntity.status(401).body(result);
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
