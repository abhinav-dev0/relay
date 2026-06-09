package com.abhinav.relay.security;

public class TenantContext {
    private static final ThreadLocal<Long> tenantId = new ThreadLocal<>();

    public static Long getTenantId() {
        return tenantId.get();
    }

    public static void setTenantId(Long id) {
        tenantId.set(id);
    }

    public static void clear() {
        tenantId.remove();
    }
}