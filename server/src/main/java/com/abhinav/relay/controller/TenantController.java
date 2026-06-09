package com.abhinav.relay.controller;

import com.abhinav.relay.dto.ApiResponse;
import com.abhinav.relay.dto.request.TenantJoinDto;
import com.abhinav.relay.dto.request.TenantRequestDto;
import com.abhinav.relay.service.TenantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tenant")
public class TenantController {

    @Autowired
    private TenantService tenantService;

    @PostMapping(path = "/")
    public ApiResponse create(@RequestBody @Valid TenantRequestDto request) {
        ApiResponse apiResponse = new ApiResponse();
        try {
            tenantService.create(request.getName(), request.getDomain());
            apiResponse.setSuccess(true);
            apiResponse.setMessage("Success");
        } catch (Exception e) {
            apiResponse.setMessage(e.getMessage());
            apiResponse.setSuccess(false);
        }
        return apiResponse;
    }

    @GetMapping(path="/")
    public ApiResponse get() {
        ApiResponse apiResponse = new ApiResponse();
        try {
            apiResponse.setData(tenantService.get());
            apiResponse.setSuccess(true);
            apiResponse.setMessage("Success");
        } catch (Exception e) {
            apiResponse.setMessage(e.getMessage());
            apiResponse.setSuccess(false);
        }
        return apiResponse;
    }

    @PostMapping(path="/join")
    public ApiResponse join(@RequestBody @Valid TenantJoinDto request) {
        ApiResponse apiResponse = new ApiResponse();
        try {
            tenantService.join(request.getDomain(), request.getCode());
            apiResponse.setSuccess(true);
            apiResponse.setMessage("Success");
        } catch (Exception e) {
            apiResponse.setMessage(e.getMessage());
            apiResponse.setSuccess(false);
        }
        return apiResponse;
    }
    @GetMapping(path="/users")
    public ApiResponse getTenantUsers() {
        ApiResponse apiResponse = new ApiResponse();
        try {
            apiResponse.setData(tenantService.getTenantUsers());
            apiResponse.setSuccess(true);
            apiResponse.setMessage("Success");
        } catch (Exception e) {
            apiResponse.setMessage(e.getMessage());
            apiResponse.setSuccess(false);
        }
        return apiResponse;
    }
}
