package com.okta.developer.blog.web.rest;

import com.okta.developer.blog.domain.Tag;
import com.okta.developer.blog.repository.TagRepository;
import com.okta.developer.blog.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.reactive.ResponseUtil;

/**
 * REST controller for managing {@link com.okta.developer.blog.domain.Tag}.
 */
@RestController
@RequestMapping("/api")
public class TagResource {

    private final Logger log = LoggerFactory.getLogger(TagResource.class);

    private static final String ENTITY_NAME = "blogTag";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TagRepository tagRepository;

    public TagResource(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    /**
     * {@code POST  /tags} : Create a new tag.
     *
     * @param tag the tag to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tag, or with status {@code 400 (Bad Request)} if the tag has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tags")
    public Mono<ResponseEntity<Tag>> createTag(@Valid @RequestBody Tag tag) throws URISyntaxException {
        log.debug("REST request to save Tag : {}", tag);
        if (tag.getId() != null) {
            throw new BadRequestAlertException("A new tag cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return tagRepository
            .save(tag)
            .map(
                result -> {
                    try {
                        return ResponseEntity
                            .created(new URI("/api/tags/" + result.getId()))
                            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
                            .body(result);
                    } catch (URISyntaxException e) {
                        throw new RuntimeException(e);
                    }
                }
            );
    }

    /**
     * {@code PUT  /tags/:id} : Updates an existing tag.
     *
     * @param id the id of the tag to save.
     * @param tag the tag to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tag,
     * or with status {@code 400 (Bad Request)} if the tag is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tag couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tags/{id}")
    public Mono<ResponseEntity<Tag>> updateTag(@PathVariable(value = "id", required = false) final String id, @Valid @RequestBody Tag tag)
        throws URISyntaxException {
        log.debug("REST request to update Tag : {}, {}", id, tag);
        if (tag.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tag.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return tagRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    return tagRepository
                        .save(tag)
                        .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                        .map(
                            result ->
                                ResponseEntity
                                    .ok()
                                    .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId()))
                                    .body(result)
                        );
                }
            );
    }

    /**
     * {@code PATCH  /tags/:id} : Partial updates given fields of an existing tag, field will ignore if it is null
     *
     * @param id the id of the tag to save.
     * @param tag the tag to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tag,
     * or with status {@code 400 (Bad Request)} if the tag is not valid,
     * or with status {@code 404 (Not Found)} if the tag is not found,
     * or with status {@code 500 (Internal Server Error)} if the tag couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/tags/{id}", consumes = "application/merge-patch+json")
    public Mono<ResponseEntity<Tag>> partialUpdateTag(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody Tag tag
    ) throws URISyntaxException {
        log.debug("REST request to partial update Tag partially : {}, {}", id, tag);
        if (tag.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tag.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return tagRepository
            .existsById(id)
            .flatMap(
                exists -> {
                    if (!exists) {
                        return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                    }

                    Mono<Tag> result = tagRepository
                        .findById(tag.getId())
                        .map(
                            existingTag -> {
                                if (tag.getName() != null) {
                                    existingTag.setName(tag.getName());
                                }

                                return existingTag;
                            }
                        )
                        .flatMap(tagRepository::save);

                    return result
                        .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                        .map(
                            res ->
                                ResponseEntity
                                    .ok()
                                    .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, res.getId()))
                                    .body(res)
                        );
                }
            );
    }

    /**
     * {@code GET  /tags} : get all the tags.
     *
     * @param pageable the pagination information.
     * @param request a {@link ServerHttpRequest} request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tags in body.
     */
    @GetMapping("/tags")
    public Mono<ResponseEntity<List<Tag>>> getAllTags(Pageable pageable, ServerHttpRequest request) {
        log.debug("REST request to get a page of Tags");
        return tagRepository
            .count()
            .zipWith(tagRepository.findAllBy(pageable).collectList())
            .map(
                countWithEntities -> {
                    return ResponseEntity
                        .ok()
                        .headers(
                            PaginationUtil.generatePaginationHttpHeaders(
                                UriComponentsBuilder.fromHttpRequest(request),
                                new PageImpl<>(countWithEntities.getT2(), pageable, countWithEntities.getT1())
                            )
                        )
                        .body(countWithEntities.getT2());
                }
            );
    }

    /**
     * {@code GET  /tags/:id} : get the "id" tag.
     *
     * @param id the id of the tag to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tag, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tags/{id}")
    public Mono<ResponseEntity<Tag>> getTag(@PathVariable String id) {
        log.debug("REST request to get Tag : {}", id);
        Mono<Tag> tag = tagRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(tag);
    }

    /**
     * {@code DELETE  /tags/:id} : delete the "id" tag.
     *
     * @param id the id of the tag to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tags/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public Mono<ResponseEntity<Void>> deleteTag(@PathVariable String id) {
        log.debug("REST request to delete Tag : {}", id);
        return tagRepository
            .deleteById(id)
            .map(
                result ->
                    ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build()
            );
    }
}
