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
public class Group {
    private Integer ID;
    private String name;

    private List<UserBasic> members;
    private Number ownerID;
    private boolean isRequesterTheOwner;
}
