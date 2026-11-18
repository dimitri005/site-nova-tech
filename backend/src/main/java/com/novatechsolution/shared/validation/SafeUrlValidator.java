package com.novatechsolution.shared.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.net.URI;

public class SafeUrlValidator implements ConstraintValidator<SafeUrl,String> {
    @Override public boolean isValid(String value, ConstraintValidatorContext context) {
        if(value==null||value.isBlank())return true;
        String candidate=value.trim();
        if(candidate.startsWith("/media/")&&!candidate.startsWith("//")&&!candidate.contains("..")&&!candidate.contains("\\"))return true;
        try{
            URI uri=URI.create(candidate);
            return ("https".equalsIgnoreCase(uri.getScheme())||"http".equalsIgnoreCase(uri.getScheme()))
                    &&uri.getHost()!=null&&uri.getUserInfo()==null;
        }catch(IllegalArgumentException exception){return false;}
    }
}
