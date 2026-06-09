package com.abhinav.relay.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TenantRequestDto {
    @NotBlank(message = "Tenant Name cannot be blank.")
    String name;

    @NotBlank(message = "Tenant Domain cannot be blank.")
    String domain;
}
