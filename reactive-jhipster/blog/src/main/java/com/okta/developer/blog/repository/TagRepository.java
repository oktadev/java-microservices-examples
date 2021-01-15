package com.okta.developer.blog.repository;

import com.okta.developer.blog.domain.Tag;
import org.neo4j.springframework.data.repository.ReactiveNeo4jRepository;
import org.neo4j.springframework.data.repository.query.Query;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

/**
 * Spring Data Neo4j reactive repository for the Tag entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TagRepository extends ReactiveNeo4jRepository<Tag, String> {
    Flux<Tag> findAllBy(Pageable pageable);
}
