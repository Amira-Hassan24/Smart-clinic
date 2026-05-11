package com.smartclinic.scms.service;

import com.smartclinic.scms.dto.ProfileResponse;
import com.smartclinic.scms.entity.User;
import com.smartclinic.scms.entity.UserProfile;
import com.smartclinic.scms.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    public ProfileResponse getCurrentUserProfile() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        UserProfile profile = userProfileRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        ProfileResponse response = new ProfileResponse();
        response.setFullName(profile.getFullName());
        response.setPhoneNumber(profile.getPhoneNumber());
        response.setGender(profile.getGender());
        response.setBirthDate(profile.getBirthDate());
        response.setAddress(profile.getAddress());
        response.setEmail(currentUser.getEmail());

        return response;
    }
}