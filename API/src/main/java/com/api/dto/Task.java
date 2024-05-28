package com.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@AllArgsConstructor
@Data
@Builder
public class Task {
    private Number taskID;

    private Boolean isCompleted;

    private Date creationDate;

    private Date dueDate;

    private String title;

    private UserBasic assignedUser;

    private UserBasic creator;

    private GroupBasic group;
}
