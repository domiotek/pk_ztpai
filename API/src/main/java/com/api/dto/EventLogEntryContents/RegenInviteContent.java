package com.api.dto.EventLogEntryContents;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class RegenInviteContent {
    private String scope;
    private String type;

    private String code;
}
