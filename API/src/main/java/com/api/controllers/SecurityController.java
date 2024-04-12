package com.api.controllers;

import com.api.models.Session;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@NoArgsConstructor
@RequestMapping("/api/auth")
public class SecurityController {

    @PostMapping("/signin")
    public String signIn() {
        return "Sign In";
    }

    @GetMapping("/signout")
    public String signOut() {
        return "Sign Out";
    }

    @GetMapping("/signup")
    public String signUp() {
        return "Sign Up";
    }

}
