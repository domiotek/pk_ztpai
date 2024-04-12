package com.api.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.util.Date;
import java.util.Set;

@Data
@Entity
@Table(name = "groups")
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ID;
    private String name;

    private Date createdAt;

    private String inviteCode;

    @ManyToOne
    private User owner;

    @OneToMany(mappedBy = "group")
    private Set<Task> tasks;

    @OneToMany(mappedBy = "group")
    private Set<Note> notes;

    @ManyToMany(mappedBy = "groups")
    private Set<User> members;
}
