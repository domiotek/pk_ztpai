package com.api.repositories;

import com.api.models.Group;
import com.api.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, Integer> {
    Optional<Group> findGroupByID(Number groupID);
    Optional<Group> findGroupByInviteCode(String inviteCode);

    List<Group> findGroupsByOwner(User user);
}
