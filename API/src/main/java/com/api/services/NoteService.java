package com.api.services;

import com.api.dto.requests.NoteDefManagementRequest;
import com.api.dto.requests.ResolvedTaskDefManagementRequest;
import com.api.dto.requests.TaskDefManagementRequest;
import com.api.dto.responses.GenericResponse;
import com.api.models.Group;
import com.api.models.Note;
import com.api.models.Task;
import com.api.models.User;
import com.api.repositories.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static com.api.Utils.groupNotFoundResponse;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository repository;
    private final UserService userService;
    private final GroupService groupService;

    public GenericResponse validateNoteCreationRequest(NoteDefManagementRequest request) {
        final var response = GenericResponse.builder()
                .state(false)
                .code("BadRequest");

        if(request.getTitle()==null) {
            return response.message("title is a required field").build();
        }

        return null;
    }

    public ResponseEntity<GenericResponse> verifyBelongsToGroup(Note note, Number groupID) {
        final var group = groupService.getGroup(groupID);

        if(group.isEmpty())
            return ResponseEntity.status(404).body(groupNotFoundResponse());

        if(!group.get().getNotes().contains(note))
            return ResponseEntity.status(400).body(new GenericResponse(false, "UnrecognizedEntity","Group doesn't have such note."));

        return null;
    }


    public List<com.api.dto.Note> getNotes(Group group) {
        final var notes = repository.findNotesByGroup(group);

        final var result = new ArrayList<com.api.dto.Note>();

        for (var note : notes) {
            result.add(com.api.dto.Note.builder()
                    .noteID(note.getID())
                    .creator(note.getCreator().getDTO())
                    .title(note.getTitle())
                    .content(note.getContent())
                    .creationDate(note.getCreatedAt())
                    .group(note.getGroup().getBasicDTO())
                    .build()
            );
        }


        return result;
    }

    public Optional<Note> getNote(Number noteID) {
        return repository.findById(noteID.intValue());
    }

    public Note createNote(NoteDefManagementRequest request, Group group, User creator) {
        var note = Note.builder()
                .creator(creator)
                .title(request.getTitle())
                .content(request.getContent())
                .createdAt(new Date())
                .group(group)
                .build();

        try {
            note = repository.save(note);
        }catch(Exception ex) {
            return null;
        }

        return note;
    }

    public Note updateNote(Note note) {
        try {
            note = repository.save(note);
        }catch(Exception ex) {
            return null;
        }

        return note;
    }

    public boolean deleteNote(Note note) {
        try {
            var group = note.getGroup();
            if(!group.getNotes().remove(note)) return false;

            group = groupService.updateGroup(group);
            repository.delete(note);
            return group!=null;
        }catch (Exception ex) {
            return false;
        }

    }
}
