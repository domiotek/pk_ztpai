package com.api.models;

import com.api.dto.GroupBasic;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Entity
@Table(name = "groups")
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@Builder
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ID;
    private String name;

    private ZonedDateTime createdAt;

    @Column(unique = true)
    private String inviteCode;

    @ManyToOne
    private User owner;

    @OneToMany(mappedBy = "group")
    private Set<Task> tasks;

    @OneToMany(mappedBy = "group")
    private Set<Note> notes;

    @ManyToMany
    private List<User> members;

    public GroupBasic getBasicDTO() {
        return GroupBasic.builder()
                .ID(getID())
                .name(getName())
                .build();
    }

    public com.api.dto.Group getDTO() {
        return com.api.dto.Group.builder()
                .ID(getID())
                .name(getName())
                .members(members.stream().map(User::getDTO).collect(Collectors.toCollection(ArrayList::new)))
                .ownerID(getOwner().getID())
                .build();
    }
}
