package com.api.services;

import com.api.dto.GroupMembers;
import com.api.dto.responses.GenericResponse;
import com.api.dto.requests.GroupDefManagementRequest;
import com.api.dto.responses.GroupMembersResponse;
import com.api.dto.UserBasic;
import com.api.models.Group;
import com.api.models.User;
import com.api.repositories.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

import static com.api.Utils.resolveRegex;

@Service
@RequiredArgsConstructor
public class GroupService {

    public static Integer MAXIMUM_OWNED_GROUPS = 3;

    private final GroupRepository groupRepository;

    private final Random random = new Random();

    public Optional<Group> getGroup(Number groupID) {
        return groupRepository.findGroupByID(groupID);
    }

    public Optional<Group> getGroup(String inviteCode) {
        return groupRepository.findGroupByInviteCode(inviteCode);
    }

    public GenericResponse validateGroupCreationRequest(GroupDefManagementRequest request) {
        final var response = GenericResponse.builder();

        response.state(false);
        response.code("BadRequest");

        if(request.getGroupName()==null) {
            response.message("groupName field is required.");
            return response.build();
        }

        if(!resolveRegex("^[a-zA-Z0-9\\s]{2,15}$", request.getGroupName())) {
            response.message("Invalid group name. It must be 2-15 characters long.");
            return response.build();
        }

        response.state(true);
        response.code(null);
        return response.build();
    }

    public String generateInviteCode() {
        var gen =  random.nextInt(67108864,  134217728);
        return Integer.toHexString(gen);
    }

    public boolean createGroup(GroupDefManagementRequest request, User owner) {

        var group = Group.builder()
                .name(request.getGroupName())
                .createdAt(ZonedDateTime.now())
                .owner(owner)
                .inviteCode(generateInviteCode())
                .build();

        return updateGroup(group);
    }

    public boolean updateGroup(Group group) {
        try {
            groupRepository.save(group);
        }catch(Exception ex) {
            return false;
        }

        return true;
    }

    public boolean isInGroup(Group group, UserBasic user) {
        for (var member :
                group.getMembers()) {
            if(member.getID().equals(user.getID())) return true;
        }

        return false;
    }

    public boolean isGroupOwner(Group group, UserBasic user) {
        return group.getOwner().getID().equals(user.getID());
    }

    public boolean addToGroup(Group group, User user) {
        group.getMembers().add(user);

        return updateGroup(group);
    }

    public boolean removeFromGroup(Group group, User user) {
        final var isOwner = isGroupOwner(group, user.getDTO());

        if(group.getMembers().size()==1 && isOwner) {
            deleteGroup(group);
            return true;
        }

        if(group.getMembers().remove(user)) {
            if(isOwner) {
                var newCandidate = group.getMembers().get(0);
                group.setOwner(newCandidate);
            }

            groupRepository.save(group);
            return true;
        }
        return false;
    }

    public GroupMembers getGroupMembers(Group group) {
        return GroupMembers.builder()
                .ownerID(group.getOwner().getID())
                .members(group.getMembers().stream().map(User::getDTO).collect(Collectors.toList()))
                .build();
    }

    public void deleteGroup(Group group) {
        groupRepository.delete(group);
    }
}
