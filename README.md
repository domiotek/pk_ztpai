# Taskmate

Project for "Zawaansowane technologie projektowania aplikacji internetowych" class on Cracow University of Technology.

### Table of contents
- About
- Technologies
- Instalation
- Preview


### About
Taskmate allows users to join or create groups with other people and then share tasks and notes among themselves.


### Technologies
Project developed using java with SpringBoot on backend and React on frontend.

- React 18.2
- SpringBoot 3
- Docker
- PostgreSQL
- Apache Kafka

### Instalation
Before instalation, make sure you have installed on your system following dependencies:
- node.js (version 20.11)
- mvn
- docker
- Java JDK 17

Application consists of multiple modules. Tu build and run them, execute following commands in given order.

While being in the project root directory:
1. `docker compose up`
Wait for containers to start. Right now you should have working database as well as apache kafka broker.
2. `cd API`
3. `mvn clean install`
This command will build the backend, spring boot application.
4. `mvn spring-boot:run`
And this one will run it. After this step Application should be running and the API should be accessible under localhost:8080
5. `cd ../WebApp`
6. `npm i`
To install all frontend dependencies.
7. `npm run build`
8. `npm run preview`
After this step application should be built and accessible under the address shown in the console. You can also press `o + Enter` to open your browser with the link already pasted in.


### Preview
To be added





