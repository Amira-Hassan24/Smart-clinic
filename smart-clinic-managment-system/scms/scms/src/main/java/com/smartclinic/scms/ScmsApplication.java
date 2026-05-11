package com.smartclinic.scms;

import com.smartclinic.scms.entity.Role;
import com.smartclinic.scms.entity.User;
import com.smartclinic.scms.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ScmsApplication {

	public static void main(String[] args) {
		SpringApplication.run(ScmsApplication.class, args);
	}

	@Bean
	public CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {

			if (userRepository.findByRole(Role.ADMIN).isEmpty()) {
				User rootAdmin = new User();
				rootAdmin.setName("Root Admin");
				rootAdmin.setEmail("admin@smartclinic.com");
				rootAdmin.setPhoneNumber("01012345678");
				rootAdmin.setRole(Role.ADMIN);
				rootAdmin.setIsActive(true);
				rootAdmin.setNeedsPasswordReset(true);
				rootAdmin.setPassword(passwordEncoder.encode("admin123"));

				userRepository.save(rootAdmin);
				System.out.println("✅ Root Admin Created: admin@smartclinic.com / admin123");
			}
		};
	}
}