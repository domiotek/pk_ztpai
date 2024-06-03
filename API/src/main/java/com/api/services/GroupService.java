package com.api.services;

import com.api.dto.EventLogEntryContents.AlterMemberContent;
import com.api.dto.EventLogEntry;
import com.api.dto.GroupMembers;
import com.api.dto.responses.GenericResponse;
import com.api.dto.requests.GroupDefManagementRequest;
import com.api.dto.UserBasic;
import com.api.models.Group;
import com.api.models.User;
import com.api.repositories.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static com.api.Utils.groupNotFoundResponse;
import static com.api.Utils.resolveRegex;

@Service
@RequiredArgsConstructor
public class GroupService {

    public static Integer MAXIMUM_OWNED_GROUPS = 3;

    private final GroupRepository groupRepository;

    private final KafkaService<EventLogEntry> kafkaService;

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

    @Transactional
    public boolean createGroup(GroupDefManagementRequest request, User owner) {
        var group = Group.builder()
                .name(request.getGroupName())
                .createdAt(ZonedDateTime.now())
                .owner(owner)
                .inviteCode(generateInviteCode())
                .members(new ArrayList<>())
                .build();

        group = updateGroup(group);

        final var groupID = group.getID();

        if(!kafkaService.createTopic("eventlog-group-"+groupID)) {
            deleteGroup(group);
            return false;
        }

        return addToGroup(group, owner);
    }

    public Group updateGroup(Group group) {
        try {
            group = groupRepository.save(group);
        }catch(Exception ex) {
            return null;
        }

        return group;
    }

    public boolean isInGroup(Group group, UserBasic user) {
        for (var member :
                group.getMembers()) {
            if(member.getID().equals(user.getID())) return true;
        }

        return false;
    }

    public ResponseEntity<GenericResponse> validateGroupMembership(Optional<Group> maybeGroup, UserBasic user) {
        if(maybeGroup.isEmpty())
            return ResponseEntity.status(404).body(groupNotFoundResponse());

        if(!isInGroup(maybeGroup.get(), user))
            return ResponseEntity.status(403).body(new GenericResponse(false, "AccessDenied",null));

        return null;
    }

    public boolean isGroupOwner(Group group, UserBasic user) {
        return group.getOwner().getID().equals(user.getID());
    }

    public boolean addToGroup(Group group, User user) {
        group.getMembers().add(user);
        var content = AlterMemberContent.builder()
                .scope("member")
                .type("join")
                .targetUser(user.getDTO())
                .build();

        this.postEventLogEntry(group, user.getDTO(), content);

        return updateGroup(group)!=null;
    }

    public boolean removeFromGroup(Group group, User user, Boolean isKick) {
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

            var content = AlterMemberContent.builder()
                    .scope("member")
                    .type(isKick?"kick":"leave")
                    .targetUser(user.getDTO())
                    .build();

            this.postEventLogEntry(group, isKick?group.getOwner().getDTO():user.getDTO(), content);

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

    public List<EventLogEntry> getGroupEventLog(Group group) {
        return kafkaService.readXLastMessages("eventlog-group-"+group.getID(), 10);
    }

    public void postEventLogEntry(Group group, UserBasic originator, Object content) {
        EventLogEntry entry = EventLogEntry.builder()
                .targetGroup(group.getBasicDTO())
                .originatedAt(new Date())
                .originator(originator)
                .content(content)
                .build();
        kafkaService.sendToTopic("eventlog-group-"+group.getID(),entry);
    }

    public void deleteGroup(Group group) {
        groupRepository.delete(group);
        kafkaService.deleteTopic("eventlog-group-"+group.getID());
    }
}
