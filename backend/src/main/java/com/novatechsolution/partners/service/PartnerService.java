package com.novatechsolution.partners.service;

import com.novatechsolution.partners.domain.Partner;
import com.novatechsolution.partners.dto.PartnerRequest;
import com.novatechsolution.partners.repository.PartnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class PartnerService {
    private final PartnerRepository repository;
    @Transactional(readOnly=true) public List<Partner> publicList(){return repository.findAllByPublishedTrueOrderByDisplayOrderAsc();}
    @Transactional(readOnly=true) public List<Partner> adminList(){return repository.findAllByOrderByDisplayOrderAsc();}
    @Transactional public Partner create(PartnerRequest r){Partner p=new Partner();apply(p,r);return repository.save(p);}
    @Transactional public Partner update(UUID id,PartnerRequest r){Partner p=repository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Partenaire introuvable."));apply(p,r);return p;}
    @Transactional public void delete(UUID id){if(!repository.existsById(id))throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Partenaire introuvable.");repository.deleteById(id);}
    private void apply(Partner p,PartnerRequest r){p.setName(r.name().trim());p.setLogoUrl(r.logoUrl().trim());p.setWebsiteUrl(r.websiteUrl());p.setDisplayOrder(r.displayOrder());p.setPublished(r.published());}
}
