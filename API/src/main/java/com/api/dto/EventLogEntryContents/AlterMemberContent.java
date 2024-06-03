package com.api.dto.EventLogEntryContents;

import com.api.dto.UserBasic;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AlterMemberContent {
    private String scope;
    private String type;
    private UserBasic targetUser;
}
