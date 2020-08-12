package com.example.apigateway;

import lombok.Data;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.security.oauth2.gateway.TokenRelayGatewayFilterFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.reactive.function.client.ServerOAuth2AuthorizedClientExchangeFilterFunction;
import org.springframework.security.oauth2.client.web.server.ServerOAuth2AuthorizedClientRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.time.LocalDate;

@EnableEurekaClient
@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder,
                                           TokenRelayGatewayFilterFactory filterFactory) {
        return builder.routes()
                .route("car-service", r -> r.path("/cars")
                        .filters(f -> f.filter(filterFactory.apply()))
                        // .filters(f -> f.hystrix(c -> c.setName("carsFallback")
                        // .setFallbackUri("forward:/cars-fallback")))
                        .uri("lb://car-service"))
                .build();
    }

    @Bean
    @LoadBalanced
    public WebClient webClient(ReactiveClientRegistrationRepository clientRegistrations,
                               ServerOAuth2AuthorizedClientRepository authorizedClients) {
        ServerOAuth2AuthorizedClientExchangeFilterFunction oauth =
                new ServerOAuth2AuthorizedClientExchangeFilterFunction(clientRegistrations, authorizedClients);
        oauth.setDefaultOAuth2AuthorizedClient(true);
        oauth.setDefaultClientRegistrationId("okta");
        return WebClient.builder().filter(oauth).build();
    }
}

@Data
class Car {
    private String name;
    private LocalDate releaseDate;
}

@RestController
class FaveCarsController {

    private final WebClient carClient;

    public FaveCarsController(WebClient carClient) {
        this.carClient = carClient;
    }

    @GetMapping("/fave-cars")
    public Flux<Car> faveCars() {
        return carClient.get().uri("lb://car-service/cars")
                .retrieve().bodyToFlux(Car.class)
                .filter(this::isFavorite);
    }

    private boolean isFavorite(Car car) {
        return car.getName().equals("ID. BUZZ");
    }
}

@RestController
class CarsFallback {

    @GetMapping("/cars-fallback")
    public Flux<Car> noCars() {
        return Flux.empty();
    }
}
