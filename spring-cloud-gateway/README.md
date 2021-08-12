
# Secure Reactive Microservices with Spring Cloud Gateway 🔐
 
This example is built with Spring Cloud Gateway and Spring WebFlux to show reactive microservices. See [Secure Reactive Microservices with Spring Cloud Gateway](https://developer.okta.com/blog/2019/08/28/reactive-microservices-spring-cloud-gateway) to how it was created.

**Prerequisites:** [Java 11](https://sdkman.io/sdks#java) and an internet connection.

* [Getting Started](#getting-started)
* [Links](#links)
* [Help](#help)
* [License](#license)

## Getting Started

To install this example, run the following commands:

```bash
git clone https://github.com/oktadev/java-microservices-examples.git
cd java-microservices-examples/spring-cloud-gateway
```

The `api-gateway` and `car-service` projects are already pre-configured to be locked down with OAuth 2.0 and Okta. That means if you try to run them, you won't be able to login until you create an account, and an application in it.

If you already have an Okta account, see the **Create a Web Application in Okta** section below. Otherwise, we created a Maven plugin that configures a free Okta developer account + an OIDC app (in under a minute!).

To use it, run `./mvnw com.okta:okta-maven-plugin:setup` to create an account and configure the gateway to work with Okta.

Copy the `okta.*` properties from the gateway's `src/main/resources/application.properties` to the same file in the `car-service` project.

Then, run all the projects with `./mvnw` in separate terminal windows. You should be able to navigate to `http://localhost:8761` and see the apps have been registered with Eureka.

Then, navigate to `http://localhost:8080/cars` in your browser, log in with Okta, and see the resulting JSON.

### Create a Web Application in Okta

Log in to your Okta Developer account (or [sign up](https://developer.okta.com/signup/) if you don't have an account).

1. From the **Applications** page, choose **Add Application**.
2. On the Create New Application page, select **Web**.
3. Give your app a memorable name, add `http://localhost:8080/login/oauth2/code/okta` as a Login redirect URI and click **Done**.

Copy the issuer (found under **API** > **Authorization Servers**), client ID, and client secret into the `application.properties` of the `api-gateway` and `car-service` projects.

```properties
okta.oauth2.issuer=https://{yourOktaDomain}/oauth2/default
okta.oauth2.client-id=$clientId
okta.oauth2.client-secret=$clientSecret
```

## Links

These examples uses the following open source libraries:

* [Okta Spring Boot Starter](https://github.com/okta/okta-spring-boot) 
* [Spring Boot](https://spring.io/projects/spring-boot)
* [Spring Cloud](https://spring.io/projects/spring-cloud)
* [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway)
* [Spring Security](https://spring.io/projects/spring-security)
* [OpenJDK](https://openjdk.java.net/)

## Help

Please post any questions as comments on [this example's blog post](https://developer.okta.com/blog/2019/08/28/reactive-microservices-spring-cloud-gateway), or on the [Okta Developer Forums](https://devforum.okta.com/).

## License

Apache 2.0, see [LICENSE](LICENSE).
