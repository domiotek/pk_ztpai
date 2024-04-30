package com.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class User {
    private Number ID;
    private String name;
    private List<GroupBasic> groups;
}
