package com.api.dto.responses;

import com.api.dto.SignInData;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class SignInResponse extends GenericResponse {
    private SignInData data;
}
