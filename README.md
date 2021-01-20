
# Java Microservices with Spring Boot and Spring Cloud 🍃☁️
 
This repository contains examples of how to build a Java microservices architecture with Spring Boot, Spring Cloud, and Netflix Eureka.

This repository has four examples in it:

1. The first is a bare-bones microservices architecture with Spring Boot, Spring Cloud, Eureka Server, and Zuul. 
2. The second is one that's built with JHipster and configured centrally with Spring Cloud Config. 
3. The third uses Spring Cloud Gateway and Spring WebFlux to show reactive microservices.
4. The fourth uses JHipster 7 to generate a reactive microservices architecture with Spring Cloud Gateway and Spring WebFlux.

We think you'll enjoy them all!

* See [Java Microservices with Spring Boot and Spring Cloud](https://developer.okta.com/blog/2019/05/22/java-microservices-spring-boot-spring-cloud) for an overview of the first example.
* Read [Java Microservices with Spring Cloud Config and JHipster](https://developer.okta.com/blog/2019/05/23/java-microservices-spring-cloud-config) to learn about microservices with JHipster.
* Refer to [Secure Reactive Microservices with Spring Cloud Gateway](https://developer.okta.com/blog/2019/08/28/reactive-microservices-spring-cloud-gateway) to learn about Spring Cloud Gateway and reactive microservices.
* Refer to [Reactive Java Microservices with Spring Boot and JHipster](https://developer.okta.com/blog/2021/01/20/reactive-java-microservices) to see how JHipster makes reactive microservices a breeze.

**Prerequisites:** [Java 11](https://sdkman.io/sdks#java) and an internet connection.

* [Spring Boot + Spring Cloud Example](#spring-boot--spring-cloud-example)
* [JHipster + Spring Cloud Config Example](#jhipster--spring-cloud-config-example)
* [Spring Cloud Gateway Example](#spring-cloud-gateway-example)
* [Reactive Microservices with JHipster Example](#reactive-microservices-with-jhipster-example)
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

Then, navigate to `http://localhost:8080/cool-cars` in your browser, log in with Okta, and see the resulting JSON.

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

## Spring Cloud Gateway Example

To install this example, run the following commands:

```bash
git clone https://github.com/oktadeveloper/java-microservices-examples.git
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

## Reactive Microservices with JHipster Example

To install this example, run the following commands:

```bash
git clone https://github.com/oktadeveloper/java-microservices-examples.git
cd java-microservices-examples/reactive-jhipster
```

The JHipster Registry and Spring Cloud Config are pre-configured to use Okta. That means if you try to run them, you won't be able to login until you create an account, and an application in it.

Install the Okta CLI using the instructions on [cli.okta.com](https://cli.okta.com) and come back here when you're done. If you don't have an Okta developer account, run `okta register`.

**NOTE**: You can also use your browser and Okta's developer console to register an app. See [JHipster's security documentation](https://www.jhipster.tech/security/#okta) for those instructions.

From the gateway project's directory, run `okta apps create jhipster`. Accept the default redirect URIs.

This process does several things:

1. Registers an OIDC app in Okta with JHipster's configured redirect URIs.
2. Creates `ROLE_ADMIN` and `ROLE_USER` groups and adds your user to both.
3. Creates a `groups` claim and adds it to ID tokens.
4. Creates a `.okta.env` file with the values you'll need to talk to Okta.

Spring Cloud Config allows you to distribute Spring's configuration between apps. Update `gateway/src/main/docker/central-server-config/localhost-config/application.yml` to use your Okta app settings. You can find the values for each property in the `.okta.env` file.

```yaml
spring:
  security:
    oauth2:
      client:
        provider:
          oidc:
            issuer-uri: https://<your-okta-domain>/oauth2/default
        registration:
          oidc:
            client-id: <client-id>
            client-secret: <client-secret>
```

Save your changes. These values will be distributed to the JHipster Registry, gateway, blog, and store apps. Start all the services and apps using the following commands:

```shell
cd gateway
docker-compose -f src/main/docker/keycloak.yml up -d #jhkeycloakup
docker-compose -f src/main/docker/postgresql.yml up -d #jhpostgresqlup
docker-compose -f src/main/docker/jhipster-registery up -d #jhregistryup
./gradlew
```

Open a new terminal window, start the blog app's Neo4j database, and then the app itself.

```shell
cd ../blog
docker-compose -f src/main/docker/neo4j.yml up -d #jhneo4jup
./gradlew
```

Then, open another terminal window, start the store app's MongoDB database, and the microservice.

```shell
cd ../store
docker-compose -f src/main/docker/mongodb.yml up -d #jhmongoup
./gradlew
```

Now, open a new incognito browser window, go to `http://localhost:8080`, and sign in. Rejoice that using Okta for authentication works!

**TIP**: You can also run everything using Docker Compose. See the [blog post](https://developer.okta.com/blog/2021/01/20/reactive-java-microservices#run-your-microservices-stack-with-docker-compose) for how to do that.

## Links

These examples uses the following open source libraries:

* [Okta Spring Boot Starter](https://github.com/okta/okta-spring-boot) 
* [Spring Boot](https://spring.io/projects/spring-boot)
* [Spring Cloud](https://spring.io/projects/spring-cloud)
* [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway)
* [Spring Security](https://spring.io/projects/spring-security)
* [JHipster](https://www.jhipster.tech)
* [OpenJDK](https://openjdk.java.net/)

## Help

Please post any questions as comments on the example's blog post, or on the [Okta Developer Forums](https://devforum.okta.com/).

## License

Apache 2.0, see [LICENSE](LICENSE).
