# Kubernetes + Reactive Java with JHipster Example
 
This example uses JHipster 7 to generate Kubernetes deployment descriptors and deploy your microservice architecture to Minikue and Google Cloud (GKE). See [Kubernetes to the Cloud with Spring Boot and JHipster][blog] to see how it was built.

**Prerequisites:** [Java 11](https://sdkman.io/sdks#java) and [Docker](https://docs.docker.com/engine/install/).

* [Getting Started](#getting-started)
* [Links](#links)
* [Help](#help)
* [License](#license)

## Getting Started

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

## Install Minikube to Run Kubernetes Locally

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

## Register an OIDC App for Auth

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

Please read the [Kubernetes to the Cloud with Spring Boot and JHipster][blog] for more information.

## Links

These examples uses the following open source libraries:

* [Spring Boot](https://spring.io/projects/spring-boot)
* [Spring Cloud](https://spring.io/projects/spring-cloud)
* [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway)
* [Spring Security](https://spring.io/projects/spring-security)
* [JHipster](https://www.jhipster.tech)
* [OpenJDK](https://openjdk.java.net/)
* [K9s](https://k9scli.io/)

## Help

Please post any questions as comments on [this example's blog post][blog], or on the [Okta Developer Forums](https://devforum.okta.com/).

## License

Apache 2.0, see [LICENSE](LICENSE).

[blog]: https://developer.okta.com/blog/2021/06/01/kubernetes-java-spring-boot
