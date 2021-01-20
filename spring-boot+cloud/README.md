
# Java Microservices with Spring Boot and Spring Cloud 🍃☁️

This example is a bare-bones microservices architecture built with Spring Boot, Spring Cloud, Eureka Server, and Zuul. See [Java Microservices with Spring Boot and Spring Cloud](https://developer.okta.com/blog/2019/05/22/java-microservices-spring-boot-spring-cloud) to see how it was created.

**Prerequisites:** [Java 11](https://sdkman.io/sdks#java) and an internet connection.

* [Getting Started](#getting-started)
* [Links](#links)
* [Help](#help)
* [License](#license)

## Getting Started

To install this example, run the following commands:

```bash
git clone https://github.com/oktadeveloper/java-microservices-examples.git
cd java-microservices-examples/spring-boot+cloud
```

The `api-gateway` and `car-service` projects are already pre-configured to be locked down with OAuth 2.0 and Okta. That means if you try to run them, you won't be able to login until you create an account, and an application in it.

### Create a Web Application in Okta

Log in to your Okta Developer account (or [sign up](https://developer.okta.com/signup/) if you don't have an account).

1. From the **Applications** page, choose **Add Application**.
2. On the Create New Application page, select **Web**.
3. Give your app a memorable name, add `http://localhost:8080/login/oauth2/code/okta` as a Login redirect URI, select **Refresh Token** (in addition to **Authorization Code**), and click **Done**.

Copy the issuer (found under **API** > **Authorization Servers**), client ID, and client secret into the `application.properties` of the `api-gateway` and `car-service` projects.

```properties
okta.oauth2.issuer=https://{yourOktaDomain}/oauth2/default
okta.oauth2.client-id=$clientId
okta.oauth2.client-secret=$clientSecret
```

Then, run all the projects with `./mvnw` in separate terminal windows. You should be able to navigate to `http://localhost:8761` and see the apps have been registered with Eureka.

Then, navigate to `http://localhost:8080/cool-cars` in your browser, log in with Okta, and see the resulting JSON.

## Links

These examples uses the following open source libraries:

* [Okta Spring Boot Starter](https://github.com/okta/okta-spring-boot)
* [Spring Boot](https://spring.io/projects/spring-boot)
* [Spring Cloud](https://spring.io/projects/spring-cloud)
* [Spring Security](https://spring.io/projects/spring-security)
* [OpenJDK](https://openjdk.java.net/)

## Help

Please post any questions as comments on the [example's blog post](https://developer.okta.com/blog/2019/05/22/java-microservices-spring-boot-spring-cloud), or on the [Okta Developer Forums](https://devforum.okta.com/).

## License

Apache 2.0, see [LICENSE](LICENSE).
