package com.novatechsolution.shared.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD,ElementType.PARAMETER,ElementType.RECORD_COMPONENT,ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy=SafeUrlValidator.class)
public @interface SafeUrl {
    String message() default "URL must use HTTPS, HTTP, or a local /media/ path";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
