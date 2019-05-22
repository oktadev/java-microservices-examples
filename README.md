
# Java Microservices with Spring Boot and Spring Cloud 🍃☁️
 
This repository contains examples of how to build a microservices architecture with Spring Boot 2.1, Spring Cloud Greenwich, Netflix Eureka, and Netflix Zuul.

This repository has two examples in it. One is a bare-bones microservices architecture with Spring Boot, Spring Cloud, Eureka Server, and Zuul. The second is one that's built with JHipster and configured centrally with Spring Cloud Config.

Please read [Java Microservices with Spring Boot and Spring Cloud](https://developer.okta.com/blog/2019/05/22/java-microservices-spring-boot-spring-cloud) for an overview of the first example.

**Prerequisites:** [Java 11](https://sdkman.io/sdks#java).

* [Spring Boot + Spring Cloud Example](#spring-boot--spring-cloud-example)
* [JHipster + Spring Cloud Config Example](#jhipster--spring-cloud-config-example)
* [Links](#links)
* [Help](#help)
* [License](#license)

## Spring Boot + Spring Cloud Example

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

Then, navigate to `http://localhost:8080/cool-bars` in your browser, log in with Okta, and see the resulting JSON.

## JHipster + Spring Cloud Config Example

To install this example, run the following commands:

```bash
git clone https://github.com/oktadeveloper/java-microservices-examples.git
cd java-microservices-examples/jhipster
```

Create Docker containers for all gateway and microservice applications:

```bash
mvn -Pprod verify com.google.cloud.tools:jib-maven-plugin:dockerBuild
```

### Create a Web Application in Okta

Log in to your Okta Developer account (or [sign up](https://developer.okta.com/signup/) if you don't have an account).

1. From the **Applications** page, choose **Add Application**.
2. On the Create New Application page, select **Web**.
3. Give your app a memorable name, add `http://localhost:8080/login/oauth2/code/okta` as a Login redirect URI, select **Refresh Token** (in addition to **Authorization Code**), and click **Done**.
4. To configure Logout to work in JHipster, **Edit** your app, add `http://localhost:8080` as a Logout redirect URI, then click **Save**.

Rather than modifying each of your apps for Okta, you can use Spring Cloud Config in JHipster Registry to do it. Open `docker-compose/central-server-config/application.yml` and add your Okta settings.

The client ID and secret are available on your app settings page. You can find the issuer under **API** > **Authorization Servers**.

```yaml
spring:
  security:
    oauth2:
      client:
        provider:
          oidc:
            issuer-uri: https://{yourOktaDomain}/oauth2/default
        registration:
          oidc:
            client-id: {yourClientId}
            client-secret: {yourClientSecret}
```

The registry, gateway, blog, and store applications are all configured to read this configuration on startup.

Start all your containers from the `docker-compose` directory:

```bash
docker-compose up -d
```

Before you can log in to the registry, you'll need to add redirect URIs for JHipster Registry, ensure your user is in a `ROLE_ADMIN` group and that groups are included in the ID token.

Log in to your Okta dashboard, edit your OIDC app, and add the following Login redirect URI:

* `http://localhost:8761/login/oauth2/code/oidc`

You'll also need to add a Logout redirect URI:

* `http://localhost:8761`

Then, click **Save**.

### Create Groups and Add Them as Claims to the ID Token

JHipster is configured by default to work with two types of users: administrators and users. Keycloak is configured with users and groups automatically, but you need to do some one-time configuration for your Okta organization.

Create a `ROLE_ADMIN` group (**Users** > **Groups** > **Add Group**) and add your user to it. Navigate to **API** > **Authorization Servers**, and click on the the `default` server. Click the **Claims** tab and **Add Claim**. Name it `groups`, and include it in the ID Token. Set the value type to `Groups` and set the filter to be a Regex of `.*`. Click **Create**.

Now when you hit `http://localhost:8761` or `http://localhost:8080`, you should be able to log in with Okta!

## Links

These examples uses the following open source libraries:

* [Okta Spring Boot Starter](https://github.com/okta/okta-spring-boot) 
* [Spring Boot](https://spring.io/projects/spring-boot)
* [Spring Cloud](https://spring.io/projects/spring-cloud)
* [Spring Security](https://spring.io/projects/spring-security)
* [JHipster](https://www.jhipster.tech)
* [OpenJDK](https://openjdk.java.net/)

## Help

Please post any questions as comments on the example's blog post, or on the [Okta Developer Forums](https://devforum.okta.com/).

## License

Apache 2.0, see [LICENSE](LICENSE).
