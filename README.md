# Java Microservices with Spring Boot & Spring Cloud 🍃☁️
 
This repository contains examples of how to build a Java microservices architecture with Spring Boot, Spring Cloud, and Netflix Eureka.

This repository has five examples in it:

1. The first is a bare-bones microservices architecture with Spring Boot, Spring Cloud, Eureka Server, and Zuul. 
2. The second is one that's built with JHipster and configured centrally with Spring Cloud Config. 
3. The third uses Spring Cloud Gateway and Spring WebFlux to show reactive microservices.
4. The fourth uses JHipster 7 to generate a reactive microservices architecture with Spring Cloud Gateway and Spring WebFlux.
5. The fifth uses JHipster 7 + Kubernetes and deploys to Google Cloud with sealed secrets. 

We think you'll enjoy them all!

* See [Java Microservices with Spring Boot and Spring Cloud][blog-spring-boot-spring-cloud] for an overview of the first example.
* Read [Java Microservices with Spring Cloud Config and JHipster][blog-spring-cloud-config] to learn about microservices with JHipster.
* Refer to [Secure Reactive Microservices with Spring Cloud Gateway][blog-spring-cloud-gateway] to learn about Spring Cloud Gateway and reactive microservices.
* Refer to [Reactive Java Microservices with Spring Boot and JHipster][blog-reactive-jhipster] to see how JHipster makes reactive microservices a breeze.
* Peruse to [Kubernetes to the Cloud with Spring Boot and JHipster][blog-k8s] to see how JHipster simplifies Kubernetes deployments.

**Prerequisites:** [Java 11](https://sdkman.io/sdks#java) and an internet connection.

* [Spring Boot + Spring Cloud Example](#spring-boot--spring-cloud-example)
* [JHipster + Spring Cloud Config Example](#jhipster--spring-cloud-config-example)
* [Spring Cloud Gateway Example](#spring-cloud-gateway-example)
* [Reactive Microservices with JHipster Example](#reactive-microservices-with-jhipster-example)
* [Kubernetes to the Cloud Example](#kubernetes--reactive-java-with-jhipster-example)
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

## Kubernetes + Reactive Java with JHipster Example

To install this example, run the following commands:

```bash
git clone https://github.com/oktadeveloper/java-microservices-examples.git
cd java-microservices-examples/jhipster-k8s/k8s
```

If you don't have JHipster installed, install it.

```shell
npm i -g generator-jhipster@7
```

Run JHipster's [Kubernetes sub-generator](https://www.jhipster.tech/kubernetes/).

```shell
jhipster k8s
```

You will be prompted with several questions. The answers will be pre-populated from choices I made when creating this app. Answer as follows, changing the Docker repository name to yours, or leaving it blank if you don't have one.

- Type of application: **Microservice application**
- Root directory: **../**
- Which applications? <select all>
- Set up monitoring? **No**
- Which applications with clustered databases? select **store**
- Admin password for JHipster Registry: <generate one>
- Kubernetes namespace: **demo**
- Docker repository name: <your docker hub username>
- Command to push Docker image: `docker push`
- Enable Istio? **No**
- Kubernetes service type? **LoadBalancer**
- Use dynamic storage provisioning? **Yes**
- Use a specific storage class? <leave empty>

### Install Minikube to Run Kubernetes Locally

If you have Docker installed, you can run Kubernetes locally with Minikube. Run `minikube start` to begin.

```shell
minikube --memory 8g --cpus 8 start
```

Now, you need to build Docker images for each app. In the {`gateway`, `blog`, `store` } directories, run the following Gradle command (where `<image-name>` is `gateway`, `store`, or `blog`).

```shell
./gradlew bootJar -Pprod jib -Djib.to.image=<docker-repo-name>/<image-name>
```

> You can also build your images locally and publish them to your Docker daemon. This is the default if you didn't specify a base Docker repository name.
>
> ```shell
> # this command exposes Docker images to minikube
> eval $(minikube docker-env)
> ./gradlew -Pprod bootJar jibDockerBuild
> ```
>
> Because this publishes your images locally to Docker, you'll need to make modifications to your Kubernetes deployment files to use `imagePullPolicy: IfNotPresent`.
>
> ```yaml
> - name: gateway-app
>   image: gateway
>   imagePullPolicy: IfNotPresent
> ```
>
> Make sure to add this `imagePullPolicy` to the following files:
>
> - `k8s/gateway-k8s/gateway-deployment.yml`
> - `k8s/blog-k8s/blog-deployment.yml`
> - `k8s/store-k8s/store-deployment.yml`

### Register an OIDC App for Auth

Install the Okta CLI using the instructions on [cli.okta.com](https://cli.okta.com) and come back here when you're done. If you don't have an Okta developer account, run `okta register`.

**NOTE**: You can also use your browser and Okta's developer console to register an app. See [JHipster's security documentation](https://www.jhipster.tech/security/#okta) for those instructions.

From the gateway project's directory, run `okta apps create jhipster`. Accept the default redirect URIs.

This process does several things:

1. Registers an OIDC app in Okta with JHipster's configured redirect URIs.
2. Creates `ROLE_ADMIN` and `ROLE_USER` groups and adds your user to both.
3. Creates a `groups` claim and adds it to ID tokens.
4. Creates a `.okta.env` file with the values you'll need to talk to Okta.

Update `k8s/registry-k8s/application-configmap.yml` to contain your OIDC settings from the `.okta.env` file the Okta CLI just created. The Spring Cloud Config server reads from this file and shares the values with the gateway and microservices.

```yaml
data:
  application.yml: |-
    ...
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

To configure the JHipster Registry to use OIDC for authentication, modify `k8s/registry-k8s/jhipster-registry.yml` to enable the `oauth2` profile.

```yaml
- name: SPRING_PROFILES_ACTIVE
  value: prod,k8s,oauth2
```

Then, in the `k8s` directory, start your engines!

```shell
./kubectl-apply.sh -f
```

You can see if everything starts up using the following command.

```shell
kubectl get pods -n default
```

You can use the name of a pod with `kubectl logs` to tail its logs.

```shell
kubectl logs <pod-name> --tail=-1 -n default
```

You can use port-forwarding to see the JHipster Registry.

```shell
kubectl port-forward svc/jhipster-registry -n default 8761
```

Open a browser and navigate to `\http://localhost:8761`. You'll need to sign in with your Okta credentials.

Once all is green, use port-forwarding to see the gateway app.

```shell
kubectl port-forward svc/gateway -n default 8080
```

Then, go to `http://localhost:8080`, and you should be able to add blogs, posts, tags, and products.

Please read the [Kubernetes to the Cloud with Spring Boot and JHipster][blog-k8s] for more information.

## Links

These examples use the following open source libraries:

* [Okta Spring Boot Starter](https://github.com/okta/okta-spring-boot) 
* [Spring Boot](https://spring.io/projects/spring-boot)
* [Spring Cloud](https://spring.io/projects/spring-cloud)
* [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway)
* [Spring Security](https://spring.io/projects/spring-security)
* [JHipster](https://www.jhipster.tech)
* [OpenJDK](https://openjdk.java.net/)
* [K9s](https://k9scli.io/)

## Help

Please post any questions as comments on the example's blog post, or on the [Okta Developer Forums](https://devforum.okta.com/).

## License

Apache 2.0, see [LICENSE](LICENSE).

[blog-spring-boot-spring-cloud]: https://developer.okta.com/blog/2019/05/22/java-microservices-spring-boot-spring-cloud
[blog-spring-cloud-config]: https://developer.okta.com/blog/2019/05/23/java-microservices-spring-cloud-config
[blog-spring-cloud-gateway]: https://developer.okta.com/blog/2019/08/28/reactive-microservices-spring-cloud-gateway
[blog-reactive-jhipster]: https://developer.okta.com/blog/2021/01/20/reactive-java-microservices
[blog-k8s]: https://developer.okta.com/blog/2021/06/01/kubernetes-java-spring-boot
