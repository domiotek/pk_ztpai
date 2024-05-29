package com.api.models;

import com.api.dto.UserBasic;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.util.Date;

@Entity
@Data
@Table(name = "notes")
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@Builder
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ID;

    @ManyToOne
    private Group group;

    @ManyToOne
    private User creator;

    private Date createdAt;

    private String title;

    private String content;

    public com.api.dto.Note getDTO() {
        return com.api.dto.Note.builder()
                .noteID(getID())
                .title(getTitle())
                .content(getContent())
                .group(getGroup().getBasicDTO())
                .creationDate(getCreatedAt())
                .creator(getCreator().getDTO())
                .build();
    }
}
