package com.novatechsolution.inquiries.dto;

import com.novatechsolution.inquiries.domain.InquiryStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record InquiryStatusRequest(@NotNull InquiryStatus status, @Size(max = 12000) String internalNotes) {
}
