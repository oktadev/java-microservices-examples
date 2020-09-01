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
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
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
    public WebClient.Builder loadBalancedWebClientBuilder() {
        return WebClient.builder();
    }
}

@Data
class Car {
    private String name;
    private LocalDate releaseDate;
}

@RestController
class FaveCarsController {

    private final WebClient.Builder carClient;

    public FaveCarsController(WebClient.Builder carClient) {
        this.carClient = carClient;
    }

    @GetMapping("/fave-cars")
    public Flux<Car> faveCars(@RegisteredOAuth2AuthorizedClient("okta") OAuth2AuthorizedClient authorizedClient) {
        return carClient.build().get().uri("lb://car-service/cars")
                .header("Authorization", "Bearer " + authorizedClient.getAccessToken().getTokenValue())
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
