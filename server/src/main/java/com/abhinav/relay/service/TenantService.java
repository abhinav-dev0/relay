package com.abhinav.relay.service;

import com.abhinav.relay.dto.response.TenantDetailDto;
import com.abhinav.relay.model.Tenant;
import com.abhinav.relay.model.TenantUser;
import com.abhinav.relay.model.User;
import com.abhinav.relay.repository.TenantRepository;
import com.abhinav.relay.repository.TenantUserRepository;
import com.abhinav.relay.repository.UserRepository;
import com.abhinav.relay.security.TenantContext;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class TenantService {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private TenantUserRepository tenantUserRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationService authenticationService;

    public void create(String orgName, String orgDomain) throws Exception {
        User user = authenticationService.getCurrentUser();
        if (tenantUserRepository.findByUserId(user.getId()).isPresent()) {
            throw new Exception("User already part of an Organisation");
        }

        Tenant tenant = new Tenant();
        tenant.setName(orgName);
        tenant.setDomain(orgDomain);
        tenant.setCode(RandomStringUtils.randomAlphanumeric(10).toLowerCase());
        tenant.setActive(true);
        tenant.setCreatedAt(Instant.now());
        tenant.setUpdatedAt(Instant.now());
        tenant.setAdminId(user.getId());
        Tenant savedOrg = tenantRepository.save(tenant);

        TenantUser tenantUser = new TenantUser();
        tenantUser.setTenantId(savedOrg.getId());
        tenantUser.setUserId(user.getId());
        tenantUserRepository.save(tenantUser);
    }

    public void join(String domain, String code) throws Exception {
        User user = authenticationService.getCurrentUser();
        if (tenantUserRepository.findByUserId(user.getId()).isPresent()) {
            throw new Exception("User already part of an Organisation");
        }
        Optional<Tenant> tenant = tenantRepository.findByDomain(domain);
        if (tenant.isPresent()) {
            if(tenant.get().getCode().equals(code)) {
            TenantUser tenantUser = new TenantUser();
            tenantUser.setUserId(user.getId());
            tenantUser.setTenantId(tenant.get().getId());
            tenantUserRepository.save(tenantUser);
            } else {
                throw new Exception("Organisation code invalid");
            }
        } else {
            throw new Exception("Organisation not found");
        }
    }

    public TenantDetailDto get() throws Exception {
        User user = authenticationService.getCurrentUser();

        TenantDetailDto dto = new TenantDetailDto();
        Optional<TenantUser> tenantUserOptional = tenantUserRepository.findByUserId(user.getId());
        if (!tenantUserOptional.isPresent()) {
            throw new Exception("User not part of any organisation");
        }
        Optional<Tenant> tenantOptional = tenantRepository.findById(tenantUserOptional.get().getTenantId());
        if (!tenantOptional.isPresent()) {
            throw new Exception("Tenant not found");
        }
        Tenant tenant = tenantOptional.get();
        dto.setName(tenant.getName());
        dto.setDomain(tenant.getDomain());
        if(tenant.getAdminId() == user.getId()) {
            dto.setCode(tenant.getCode());
        } else {
            dto.setCode("Blank");
        }
        return dto;
    }

    public List<User> getTenantUsers() {
        Long tenantId = TenantContext.getTenantId();
        List<TenantUser> tenantUsers = tenantUserRepository.findByTenantId(tenantId);
        List<Long> userIds = tenantUsers.stream().map(TenantUser::getUserId).collect(java.util.stream.Collectors.toList());
        return userRepository.findAllById(userIds);
    }
}
