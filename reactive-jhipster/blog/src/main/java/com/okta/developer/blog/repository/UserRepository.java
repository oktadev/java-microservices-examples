package com.okta.developer.blog.repository;

import com.okta.developer.blog.domain.User;
import org.neo4j.springframework.data.repository.ReactiveNeo4jRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data Neo4j RX repository for the {@link User} entity.
 */
@Repository
public interface UserRepository extends ReactiveNeo4jRepository<User, String> {
    Mono<User> findOneByLogin(String login);

    Flux<User> findAll();

    Flux<User> findAllByIdNotNull(Pageable pageable);

    Flux<User> findAllByIdNotNullAndActivatedIsTrue(Pageable pageable);

    Mono<Long> count();
}
