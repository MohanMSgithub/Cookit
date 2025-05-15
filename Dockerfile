# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:17-jdk-alpine

# Set working directory inside the container
WORKDIR /app

# Copy the Gradle wrapper and build files first for better caching
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Download dependencies only (optional but speeds up build)
RUN ./gradlew build -x test --no-daemon

# Copy the rest of the project files
COPY . .

# Build the project
RUN ./gradlew build -x test --no-daemon

# Run the Spring Boot app
CMD ["java", "-jar", "build/libs/cookit-0.0.1-SNAPSHOT.jar"]
