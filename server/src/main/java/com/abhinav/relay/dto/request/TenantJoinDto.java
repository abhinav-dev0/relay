package com.abhinav.relay.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TenantJoinDto {
    @NotBlank(message = "Domain cannot be blank")
    private String domain;

    @NotBlank(message = "Code cannot be blank")
    private String code;
}
