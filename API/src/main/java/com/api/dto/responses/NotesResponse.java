package com.api.dto.responses;

import com.api.dto.Note;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class NotesResponse extends GenericResponse {
    private List<Note> data;

    public NotesResponse(boolean state, String code, String msg) {
        super(state, code, msg);
    }
}
