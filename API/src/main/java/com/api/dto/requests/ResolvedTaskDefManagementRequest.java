package com.api.dto.requests;

import com.api.models.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResolvedTaskDefManagementRequest {

    private boolean isValid;

    private String validationErrorMessage;
    private String title;
    private User assignedUser;
    private Date dueDate;
}