package com.novatechsolution.partners.repository;

import com.novatechsolution.partners.domain.Partner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface PartnerRepository extends JpaRepository<Partner, UUID> {
    List<Partner> findAllByPublishedTrueOrderByDisplayOrderAsc();
    List<Partner> findAllByOrderByDisplayOrderAsc();
}
