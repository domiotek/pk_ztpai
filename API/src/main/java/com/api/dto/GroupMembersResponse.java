package com.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupMembersResponse {

    private boolean state;
    private String message;
    private Number ownerID;
    private List<UserBasic> members;
}
