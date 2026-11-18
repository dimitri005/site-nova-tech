package com.novatechsolution.audit.service;

import com.novatechsolution.audit.domain.ActivityLog;
import com.novatechsolution.audit.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class ActivityLogService {
    private final ActivityLogRepository repository;
    @Transactional(propagation=Propagation.REQUIRES_NEW)
    public void record(String actor,String method,String path,int status){ActivityLog log=new ActivityLog();log.setActorEmail(actor);log.setMethod(method);log.setPath(path);log.setResponseStatus(status);repository.save(log);}
    @Transactional(readOnly=true) public Page<ActivityLog> list(Pageable pageable){return repository.findAllByOrderByCreatedAtDesc(pageable);}
}
