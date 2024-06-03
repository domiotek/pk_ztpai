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
![image](https://github.com/domiotek/pk_ztpai/assets/41295244/e947a4c0-fbcb-4656-b085-5e67a520b48f)
![image](https://github.com/domiotek/pk_ztpai/assets/41295244/c1609a49-8889-4a0e-9b6e-b2a484ec802c)
![image](https://github.com/domiotek/pk_ztpai/assets/41295244/36a254b8-7f84-47f5-966e-2e22f0a1e3b2)
![image](https://github.com/domiotek/pk_ztpai/assets/41295244/35d72b6c-7181-4a6b-a4c8-db1dc3a338b2)
![image](https://github.com/domiotek/pk_ztpai/assets/41295244/b24eece3-d1d2-4d60-8e2a-fa390092ea60)
![image](https://github.com/domiotek/pk_ztpai/assets/41295244/50f6bec7-7232-4fbe-9178-bee65ee35bc9)
![image](https://github.com/domiotek/pk_ztpai/assets/41295244/2ee71c1d-44bf-45b5-abe4-a82d5235685f)
![image](https://github.com/domiotek/pk_ztpai/assets/41295244/8af383de-2409-489b-a243-0db099588c22)









