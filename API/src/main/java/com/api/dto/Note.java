package com.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@AllArgsConstructor
@Data
@Builder
public class Note {
    private Number noteID;

    private Date creationDate;

    private String title;

    private String content;
    private UserBasic creator;
    private GroupBasic group;
}
