package com.api.dto.responses;

import com.api.dto.Group;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
@SuperBuilder
public class GroupResponse extends GenericResponse {
    private Group data;

    public GroupResponse(boolean state, String code, String msg) {
        super(state, code, msg);
    }
}
