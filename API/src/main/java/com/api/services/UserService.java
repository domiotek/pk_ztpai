package com.api.services;

import com.api.dto.GroupBasic;
import com.api.dto.UserBasic;
import com.api.models.Group;
import com.api.models.User;
import com.api.repositories.GroupRepository;
import com.api.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;
    private final GroupRepository groupRepository;

    public UserBasic getSignedInUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication==null) return null;

        return ((User) authentication.getPrincipal()).getDTO();
    }

    @Transactional
    public Optional<User> getUser(String email) {
        if(Objects.equals(email, "")) return Optional.empty();

        return userRepo.findUserByEmail(email);
    }

    public Optional<User> getUser(Number ID) {
        return userRepo.findUserByID(ID);
    }

    @Transactional
    public List<GroupBasic> getGroupsOfAnUser(Number ID) {
        final var user = userRepo.findUserByID(ID);

        if(user.isEmpty()) return new ArrayList<GroupBasic>();

        return user.get().getGroups().stream().map(Group::getBasicDTO).collect(Collectors.toList());

    }

    public List<Group> getUserOwnedGroups(Number ID) {
        final var user = userRepo.findUserByID(ID);

        if(user.isEmpty()) return new ArrayList<Group>();

        return groupRepository.findGroupsByOwner(user.get());
    }


}
