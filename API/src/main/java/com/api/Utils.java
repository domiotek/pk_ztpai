package com.api;

import com.api.dto.responses.GenericResponse;

import java.util.regex.Pattern;

public class Utils {

    public static boolean resolveRegex(String regex, String input) {
        if(regex==null||input==null) return false;

        return Pattern.compile(regex)
                .matcher(input)
                .matches();
    }

    public static GenericResponse accessDeniedResponse() {
        return GenericResponse.builder()
                .state(false)
                .code("AccessDenied")
                .build();
    }

    public static GenericResponse groupNotFoundResponse() {
        return GenericResponse.builder()
                .state(false)
                .code("NoEntity")
                .message("No such group")
                .build();
    }

    public static GenericResponse taskNotFoundResponse() {
        return GenericResponse.builder()
                .state(false)
                .code("NoEntity")
                .message("No such task")
                .build();
    }

    public static GenericResponse noteNotFoundResponse() {
        return GenericResponse.builder()
                .state(false)
                .code("NoEntity")
                .message("No such note")
                .build();
    }


    public static GenericResponse internalErrorResponse() {
        return GenericResponse.builder()
                .state(false)
                .code("InternalError")
                .build();
    }
}
