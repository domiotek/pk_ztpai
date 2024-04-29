package com.api;

import com.api.dto.GenericResponse;

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
                .message("Access denied.")
                .build();
    }
}
