package com.novatechsolution.dashboard.service;

import com.novatechsolution.blog.service.ArticleService;
import com.novatechsolution.enrollment.service.EnrollmentService;
import com.novatechsolution.inquiries.service.InquiryService;
import com.novatechsolution.projects.service.ProjectService;
import com.novatechsolution.dashboard.dto.DashboardSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class DashboardService {
    private final InquiryService inquiries;
    private final EnrollmentService enrollments;
    private final ProjectService projects;
    private final ArticleService articles;

    @Transactional(readOnly = true)
    public DashboardSummary summary() {
        return new DashboardSummary(inquiries.unreadMessageCount(), inquiries.pendingQuoteCount(),
                enrollments.recentCount(), projects.publishedCount(), articles.publishedCount());
    }
}
