
# Reactive Java Microservices with Spring Boot and JHipster 🤓
 
This example uses JHipster 7 to generate a reactive microservices architecture with Spring Cloud Gateway and Spring WebFlux. See [Reactive Java Microservices with Spring Boot and JHipster](https://developer.okta.com/blog/2021/01/20/reactive-java-microservices) to see how it was built.

**Prerequisites:** [Java 11](https://sdkman.io/sdks#java) and [Docker](https://docs.docker.com/engine/install/).

* [Getting Started](#getting-started)
* [Links](#links)
* [Help](#help)
* [License](#license)

## Getting Started

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

* [Spring Boot](https://spring.io/projects/spring-boot)
* [Spring Cloud](https://spring.io/projects/spring-cloud)
* [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway)
* [Spring Security](https://spring.io/projects/spring-security)
* [JHipster](https://www.jhipster.tech)
* [OpenJDK](https://openjdk.java.net/)

## Help

Please post any questions as comments on [this example's blog post](https://developer.okta.com/blog/2021/01/20/reactive-java-microservices), or on the [Okta Developer Forums](https://devforum.okta.com/).

## License

Apache 2.0, see [LICENSE](LICENSE).
