# Build stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy the pom.xml first to cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests -B

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Spring Boot will listen on the port specified by PORT env var, which Render sets automatically.
# We will expose port 3000 by default (as per application.properties)
EXPOSE 3000

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
