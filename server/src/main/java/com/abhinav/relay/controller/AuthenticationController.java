package com.abhinav.relay.controller;

import com.abhinav.relay.dto.ApiResponse;
import com.abhinav.relay.dto.request.LoginDto;
import com.abhinav.relay.dto.request.RegisterDto;
import com.abhinav.relay.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping(path = "/login")
    public ApiResponse login(@Valid @RequestBody LoginDto request) {
        ApiResponse response = new ApiResponse();
        try {
            response.setData(authenticationService.login(request.getEmail(), request.getPassword()));
            response.setSuccess(Boolean.TRUE);
            response.setMessage("Login successful");
            return response;
        } catch (Exception e) {
            response.setSuccess(Boolean.FALSE);
            response.setMessage(e.getMessage());
            return response;
        }
    }

    @PostMapping(path = "/register")
    public ApiResponse register(@Valid @RequestBody RegisterDto request) {
        ApiResponse response = new ApiResponse();
        try {
            response.setData(authenticationService.register(request.getEmail(), request.getPassword(), request.getName()));
            response.setSuccess(Boolean.TRUE);
            response.setMessage("Registered successfully");
            return response;
        } catch (Exception e) {
            response.setSuccess(Boolean.FALSE);
            response.setMessage(e.getMessage());
            return response;
        }
    }
}
