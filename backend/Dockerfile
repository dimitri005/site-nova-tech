FROM maven:3.9.11-eclipse-temurin-21 AS build

WORKDIR /workspace

# Cache Maven dependencies separately from application source changes.
COPY pom.xml ./
RUN mvn -B -ntp dependency:go-offline

COPY src ./src
RUN mvn -B -ntp -DskipTests package \
    && cp target/NTS-0.0.1-SNAPSHOT.jar /workspace/app.jar

FROM eclipse-temurin:21-jre-jammy AS runtime

RUN apt-get update \
    && apt-get install --yes --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system novatech \
    && useradd --system --gid novatech --home-dir /app --shell /usr/sbin/nologin novatech \
    && mkdir -p /app/var/media \
    && chown -R novatech:novatech /app

WORKDIR /app

COPY --from=build --chown=novatech:novatech /workspace/app.jar /app/app.jar

ENV SPRING_PROFILES_ACTIVE=prod \
    SERVER_PORT=8080 \
    MEDIA_STORAGE_PATH=/app/var/media \
    JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75.0 -XX:+UseG1GC -Djava.security.egd=file:/dev/./urandom"

USER novatech

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD curl --fail --silent http://127.0.0.1:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
