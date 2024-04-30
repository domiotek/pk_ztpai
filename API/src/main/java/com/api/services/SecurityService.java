package com.api.services;

import com.api.dto.responses.GenericResponse;
import com.api.dto.responses.SignInResponse;
import com.api.security.JwtService;
import com.api.dto.SignInData;
import com.api.dto.requests.SignInRequest;
import com.api.dto.requests.SignUpRequest;
import com.api.models.User;
import com.api.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;

import static com.api.Utils.resolveRegex;

@Service
@RequiredArgsConstructor
public class SecurityService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private final AuthenticationManager authManager;

    public SignInResponse signIn(SignInRequest request) {
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        }catch (BadCredentialsException ex) {
            return SignInResponse.builder()
                    .state(false)
                    .message("BadCredentials")
                    .build();
        }

        var user = repository.findUserByEmail(request.getEmail()).orElseThrow();

        var jwtToken = jwtService.generateToken(user);

        return SignInResponse.builder()
                .state(true)
                .data(new SignInData(jwtToken))
                .build();
    }

    public void signUp(SignUpRequest request) {
        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .createdAt(ZonedDateTime.now())
                .build();
        repository.save(user);
    }

    public GenericResponse validateSignUpRequest(SignUpRequest request) {
        final var response = GenericResponse.builder();

        response.state(false);
        response.code("BadRequest");


        final var emailRegex = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])";
        final var passRegex = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$";

        if(request.getName()==null||request.getEmail()==null||request.getPassword()==null) {
            response.message("At least one of required fields (email, name, password) isn't present.");
            return response.build();
        }

        if(!resolveRegex(emailRegex, request.getEmail())) {
            response.message("Invalid email input.");
            return response.build();
        }

        if(!resolveRegex("^[a-zA-Z]{2,15}$", request.getName())) {
            response.message("Invalid name input. Name must be 2-15 characters long and contain only letters.");
            return response.build();
        }

        if(!resolveRegex(passRegex, request.getPassword())) {
            response.message("Invalid password input. Password must be at least 8 characters long, has at least one uppercase, one lowercase letter and a digit.");
            return response.build();
        }


        response.state(true);
        response.code(null);
        return response.build();
    }
}
