# Use official JDK image
FROM eclipse-temurin:20-jdk-alpine

# Set working directory
WORKDIR /app

# Copy the entire project into the container
COPY . .

# Grant permissions
RUN chmod +x ./gradlew

# Build the Spring Boot app
RUN ./gradlew :app:bootJar --no-daemon

# Run the generated jar
CMD ["java", "-jar", "app/build/libs/app-0.0.1-SNAPSHOT.jar"]
