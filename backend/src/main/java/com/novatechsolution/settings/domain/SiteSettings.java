package com.novatechsolution.settings.domain;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.LinkedHashMap;
import java.util.Map;

@Entity @Table(name = "site_settings") @Getter @Setter @NoArgsConstructor
public class SiteSettings {
    @Id private String id = "default";
    @ElementCollection
    @CollectionTable(name = "site_setting_values", joinColumns = @JoinColumn(name = "settings_id"))
    @MapKeyColumn(name = "setting_key", length = 160)
    @Column(name = "setting_value", nullable = false, length = 4000)
    private Map<String, String> values = new LinkedHashMap<>();
}
