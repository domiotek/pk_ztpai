package com.api.dto.responses;

import com.api.dto.Task;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class TasksResponse extends GenericResponse {
    private List<Task> data;

    public TasksResponse(boolean state, String code, String msg) {
        super(state, code, msg);
    }
}