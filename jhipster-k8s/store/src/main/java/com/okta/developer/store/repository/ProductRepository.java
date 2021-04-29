package com.okta.developer.store.repository;

import com.okta.developer.store.domain.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

/**
 * Spring Data MongoDB reactive repository for the Product entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductRepository extends ReactiveMongoRepository<Product, String> {
    Flux<Product> findAllBy(Pageable pageable);
}
