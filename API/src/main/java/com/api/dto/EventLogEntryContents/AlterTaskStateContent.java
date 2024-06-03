package com.api.dto.EventLogEntryContents;

import com.api.dto.UserBasic;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
public class AlterTaskStateContent {
    private String scope;
    private String type;
    private String name;
    private Boolean state;
}