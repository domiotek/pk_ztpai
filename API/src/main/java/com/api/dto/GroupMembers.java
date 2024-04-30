package com.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@AllArgsConstructor
@Data
@Builder
public class GroupMembers {
    private Number ownerID;
    private List<UserBasic> members;
}
