package com.api.dto.responses;

import com.api.dto.GroupMembers;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;


@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class GroupMembersResponse extends GenericResponse {
    private GroupMembers data;

    public GroupMembersResponse(boolean state, String code, String msg) {
        super(state, code, msg);
    }
}
