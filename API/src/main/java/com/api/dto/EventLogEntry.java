package com.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Date;

@Builder
@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class EventLogEntry {
    private UserBasic originator;
    private GroupBasic targetGroup;
    private Date originatedAt;
    private Object content;
}
