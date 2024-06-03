package com.api.dto.responses;

import com.api.dto.EventLogEntry;
import com.api.dto.GroupMembers;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class EventLogResponse extends GenericResponse {
    private List<EventLogEntry> data;

    public EventLogResponse(boolean state, String code, String msg) {
        super(state, code, msg);
    }
}
