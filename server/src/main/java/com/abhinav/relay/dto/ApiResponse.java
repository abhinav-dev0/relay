package com.abhinav.relay.dto;

import lombok.Data;

@Data
public class ApiResponse {
    Object data;
    Boolean success;
    String message;
}
