package com.api.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.util.Date;

@Entity
@Data
@Table(name = "tasks")
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@Builder
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer ID;

    @ManyToOne
    private Group group;

    @ManyToOne
    private User creator;

    private Date createdAt;

    private String title;

    private Boolean completionState;

    @ManyToOne
    private User assignedUser;

    private Date dueDate;


}
