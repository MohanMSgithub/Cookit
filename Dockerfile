# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:20-jdk-alpine

# Set working directory inside the container
WORKDIR /app

# Copy the Gradle wrapper and build files
COPY gradlew .
COPY gradle gradle
COPY app/build.gradle .
COPY settings.gradle .

# Download dependencies only (improves caching)
RUN ./gradlew build -x test --no-daemon

# Copy the rest of the app
COPY app/src ./src

# Build the project
RUN ./gradlew build -x test --no-daemon

# Run the Spring Boot app
CMD ["java", "-jar", "app/build/libs/app-0.0.1-SNAPSHOT.jar"]


