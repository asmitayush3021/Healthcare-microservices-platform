# Healthcare Microservices Platform

A backend microservices application built with **Java and Spring Boot** to explore distributed system architecture, service-to-service communication, authentication, event-driven communication, and containerized development.

## Architecture

The application is divided into multiple independent services:

* **Auth Service** – Authentication and authorization using Spring Security and JWT
* **Patient Service** – Patient management and REST APIs
* **Billing Service** – Billing operations exposed through gRPC
* **Notification Service** – Processes asynchronous events
* **Analytics Service** – Consumes application events for analytics
* **API Gateway** – Central entry point for client requests
* **PostgreSQL** – Persistent storage for services
* **Apache Kafka** – Event-driven communication
* **gRPC** – Synchronous service-to-service communication

### High-Level Architecture

```text
                         Client
                           |
                           v
                    +-------------+
                    | API Gateway |
                    +-------------+
                           |
              +------------+------------+
              |                         |
              v                         v
       +-------------+           +-------------+
       | Auth Service|           |   Patient   |
       | JWT/Security|           |   Service   |
       +-------------+           +------+------+
                                       |
                              +--------+--------+
                              |                 |
                              v                 v
                       +-------------+     +----------+
                       |   Billing   |     |  Kafka   |
                       |   Service   |     +----+-----+
                       |    gRPC     |          |
                       +-------------+          v
                                      +-------------------+
                                      | Analytics /       |
                                      | Notification      |
                                      +-------------------+
```

## Technologies

### Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* Spring Cloud Gateway
* Maven

### Communication

* REST APIs
* gRPC
* Protocol Buffers
* Apache Kafka

### Database

* PostgreSQL

### Security

* Spring Security
* JWT
* Role-based authorization

### Infrastructure

* Docker
* Docker Compose
* PostgreSQL containers
* Kafka

### Testing & Development

* Spring Boot Test
* Spring Security Test
* Integration testing
* IntelliJ IDEA

## Microservices

### Auth Service

Responsible for:

* User authentication
* JWT generation and validation
* Role-based authorization
* User persistence
* Securing protected APIs

The service uses Spring Security, JPA, PostgreSQL and JJWT.

### Patient Service

Responsible for:

* Patient management
* REST APIs
* Database persistence
* Request validation
* Communication with Billing Service
* Publishing events to Kafka

### Billing Service

Provides billing functionality through **gRPC**.

The project uses:

* gRPC Netty
* gRPC Protobuf
* gRPC Spring Boot Starter
* Protocol Buffers

### Notification Service

Consumes Kafka events and processes notification-related operations.

Kafka is configured through the Spring Kafka integration.

### Analytics Service

Consumes application events from Kafka for analytics-related processing.

## Communication Patterns

### Synchronous Communication

Patient Service communicates with Billing Service using:

```text
Patient Service
      |
      | gRPC
      v
Billing Service
```

Protocol Buffers are used to define the gRPC contracts.

### Asynchronous Communication

Services communicate asynchronously through Kafka:

```text
Patient Service
      |
      | Publish Event
      v
    Kafka
      |
      +----------+
      |          |
      v          v
 Analytics   Notification
```

## Database

The services use PostgreSQL databases.

Example Patient Service configuration:

```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://patient-service-db:5432/db
SPRING_DATASOURCE_USERNAME=admin_user
SPRING_DATASOURCE_PASSWORD=password
```

## Running the Project

### Prerequisites

Install:

* Java 21+
* Maven
* Docker
* Docker Compose
* PostgreSQL
* IntelliJ IDEA (optional)

### Clone

```bash
git clone https://github.com/asmitayush3021/Healthcare-microservices-platform.git
cd Healthcare-microservices-platform
```

### Start Infrastructure

```bash
docker compose up -d
```

### Build

```bash
mvn clean install
```

### Run Individual Services

Start the required services from IntelliJ IDEA or using Maven:

```bash
mvn spring-boot:run
```

## Environment Variables

Example Patient Service configuration:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://patient-service-db:5432/db
SPRING_DATASOURCE_USERNAME=admin_user
SPRING_DATASOURCE_PASSWORD=password
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9092
```

The project also configures the Billing Service gRPC endpoint:

```env
BILLING_SERVICE_ADDRESS=billing-service
BILLING_SERVICE_GRPC_PORT=9005
```

## Project Structure

```text
Healthcare-microservices-platform/
│
├── auth-service/
├── patient-service/
├── billing-service/
├── notification-service/
├── analytics-service/
├── api-gateway/
├── docker-compose.yml
└── README.md
```

## What I Learned

This project provides hands-on experience with:

* Spring Boot microservices
* REST API development
* Spring Security
* JWT authentication
* Spring Data JPA
* PostgreSQL
* API Gateway
* gRPC
* Protocol Buffers
* Apache Kafka
* Event-driven architecture
* Docker
* Docker Compose
* Integration testing
* Service-to-service communication

## Future Improvements

Potential improvements include:

* Service discovery with Eureka
* Centralized configuration
* Resilience4j circuit breakers
* Distributed tracing
* Centralized logging
* Redis caching
* Kubernetes deployment
* CI/CD pipeline
* Database migration using Flyway or Liquibase
* Improved observability with Prometheus and Grafana

## License

This project is intended for educational and learning purposes.
