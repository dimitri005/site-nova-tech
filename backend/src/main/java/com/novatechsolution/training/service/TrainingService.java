package com.novatechsolution.training.service;

import com.novatechsolution.shared.domain.Slugger;
import com.novatechsolution.training.domain.TrainingCourse;
import com.novatechsolution.training.domain.TrainingSession;
import com.novatechsolution.training.domain.TrainingSessionStatus;
import com.novatechsolution.training.dto.TrainingCourseRequest;
import com.novatechsolution.training.dto.TrainingSessionRequest;
import com.novatechsolution.training.dto.SessionRegistration;
import com.novatechsolution.training.repository.TrainingCourseRepository;
import com.novatechsolution.training.repository.TrainingSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class TrainingService {
    private final TrainingCourseRepository courses;
    private final TrainingSessionRepository sessions;
    @Transactional(readOnly = true) public List<TrainingCourse> publicCourses() { return courses.findAllByPublishedTrueOrderByTitleFrAsc(); }
    @Transactional(readOnly = true) public List<TrainingCourse> adminCourses() { return courses.findAllByOrderByTitleFrAsc(); }
    @Transactional(readOnly = true) public TrainingCourse publicCourse(String slug) {
        return courses.findBySlugAndPublishedTrue(slug).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Formation introuvable."));
    }
    @Transactional(readOnly = true) public List<TrainingSession> publicSessions(String slug) {
        TrainingCourse course = publicCourse(slug);
        return sessions.findAllByCourseIdAndStatusInOrderByStartsAtAsc(course.getId(), List.of(TrainingSessionStatus.OPEN, TrainingSessionStatus.FULL));
    }
    @Transactional
    public TrainingCourse createCourse(TrainingCourseRequest r) { TrainingCourse c = new TrainingCourse(); apply(c, r); return courses.save(c); }
    @Transactional
    public TrainingCourse updateCourse(UUID id, TrainingCourseRequest r) {
        TrainingCourse c = courses.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Formation introuvable."));
        apply(c, r); c.setUpdatedAt(Instant.now()); return c;
    }
    @Transactional
    public void deleteCourse(UUID id) { if (!courses.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Formation introuvable."); courses.deleteById(id); }
    @Transactional(readOnly = true)
    public List<TrainingSession> adminSessions(UUID courseId) { return sessions.findAllByCourseIdOrderByStartsAtAsc(courseId); }
    @Transactional(readOnly = true)
    public long publishedCourseCount() { return courses.countByPublishedTrue(); }
    @Transactional
    public SessionRegistration reservePlace(UUID id) {
        TrainingSession session = sessions.findByIdForUpdate(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session introuvable."));
        if (!session.getCourse().isPublished() || session.getStatus() != TrainingSessionStatus.OPEN
                || session.getReservedPlaces() >= session.getCapacity() || !session.getStartsAt().isAfter(Instant.now()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cette session n'accepte plus de pré-inscriptions.");
        session.setReservedPlaces(session.getReservedPlaces() + 1);
        if (session.getReservedPlaces() >= session.getCapacity()) session.setStatus(TrainingSessionStatus.FULL);
        return new SessionRegistration(session.getId(), session.getCourse().getId(), session.getCourse().getTitleFr(), session.getStartsAt());
    }
    @Transactional
    public void releasePlace(UUID id) {
        TrainingSession session = sessions.findByIdForUpdate(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session introuvable."));
        session.setReservedPlaces(Math.max(0, session.getReservedPlaces() - 1));
        if (session.getStatus() == TrainingSessionStatus.FULL && session.getStartsAt().isAfter(Instant.now()))
            session.setStatus(TrainingSessionStatus.OPEN);
    }
    @Transactional
    public TrainingSession createSession(TrainingSessionRequest r) {
        TrainingSession s = new TrainingSession(); apply(s, r); return sessions.save(s);
    }
    @Transactional
    public TrainingSession updateSession(UUID id, TrainingSessionRequest r) {
        TrainingSession s = sessions.findByIdForUpdate(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session introuvable."));
        if (r.capacity() < s.getReservedPlaces()) throw new ResponseStatusException(HttpStatus.CONFLICT, "La capacité ne peut être inférieure aux pré-inscriptions actives.");
        apply(s, r); return s;
    }
    @Transactional
    public void deleteSession(UUID id) { if (!sessions.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Session introuvable."); sessions.deleteById(id); }
    private void apply(TrainingCourse c, TrainingCourseRequest r) {
        c.setSlug(Slugger.from(r.slug())); c.setTitleFr(r.titleFr().trim()); c.setTitleEn(r.titleEn().trim());
        c.setDescriptionFr(r.descriptionFr().trim()); c.setDescriptionEn(r.descriptionEn().trim());
        c.setObjectivesFr(r.objectivesFr()); c.setObjectivesEn(r.objectivesEn()); c.setAudienceFr(r.audienceFr()); c.setAudienceEn(r.audienceEn());
        c.setPrerequisitesFr(r.prerequisitesFr()); c.setPrerequisitesEn(r.prerequisitesEn()); c.setProgramFr(r.programFr()); c.setProgramEn(r.programEn());
        c.setDurationHours(r.durationHours()); c.setIndicativePrice(r.indicativePrice()); c.setCurrency(r.currency() == null ? "XAF" : r.currency().toUpperCase());
        c.setImageUrl(r.imageUrl()); c.setPublished(r.published());
    }
    private void apply(TrainingSession s, TrainingSessionRequest r) {
        if (!r.endsAt().isAfter(r.startsAt())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fin de session doit suivre le début.");
        TrainingCourse course = courses.findById(r.courseId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Formation introuvable."));
        s.setCourse(course); s.setStartsAt(r.startsAt()); s.setEndsAt(r.endsAt()); s.setVenue(r.venue().trim());
        s.setCapacity(r.capacity()); s.setStatus(r.capacity() <= s.getReservedPlaces() ? TrainingSessionStatus.FULL : r.status());
    }
}
