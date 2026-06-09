package com.abhinav.relay.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterDto {
    @NotBlank(message = "Email cannot be blank.")
    private String email;

    @Size(min = 6, message = "Password should be > 6 chars")
    private String password;

    @NotBlank(message = "Name cannot be blank")
    private String name;
}
