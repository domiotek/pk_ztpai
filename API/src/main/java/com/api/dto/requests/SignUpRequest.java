package com.api.dto.requests;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {
    private String name;
    private String username;
    private String password;
}
