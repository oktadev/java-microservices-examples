package com.okta.developer.blog.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.csrf;

import com.okta.developer.blog.IntegrationTest;
import com.okta.developer.blog.domain.Tag;
import com.okta.developer.blog.repository.TagRepository;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link TagResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient
@WithMockUser
class TagResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/tags";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private WebTestClient webTestClient;

    private Tag tag;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tag createEntity() {
        Tag tag = new Tag().name(DEFAULT_NAME);
        return tag;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tag createUpdatedEntity() {
        Tag tag = new Tag().name(UPDATED_NAME);
        return tag;
    }

    @BeforeEach
    public void setupCsrf() {
        webTestClient = webTestClient.mutateWith(csrf());
    }

    @BeforeEach
    public void initTest() {
        tagRepository.deleteAll().block();
        tag = createEntity();
    }

    @Test
    void createTag() throws Exception {
        int databaseSizeBeforeCreate = tagRepository.findAll().collectList().block().size();
        // Create the Tag
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(tag))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Tag in the database
        List<Tag> tagList = tagRepository.findAll().collectList().block();
        assertThat(tagList).hasSize(databaseSizeBeforeCreate + 1);
        Tag testTag = tagList.get(tagList.size() - 1);
        assertThat(testTag.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    void createTagWithExistingId() throws Exception {
        // Create the Tag with an existing ID
        tag.setId("existing_id");

        int databaseSizeBeforeCreate = tagRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(tag))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Tag in the database
        List<Tag> tagList = tagRepository.findAll().collectList().block();
        assertThat(tagList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = tagRepository.findAll().collectList().block().size();
        // set the field null
        tag.setName(null);

        // Create the Tag, which fails.

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(tag))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Tag> tagList = tagRepository.findAll().collectList().block();
        assertThat(tagList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllTags() {
        // Initialize the database
        tagRepository.save(tag).block();

        // Get all the tagList
        webTestClient
            .get()
            .uri(ENTITY_API_URL + "?sort=id,desc")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.[*].name")
            .value(hasItem(DEFAULT_NAME));
    }

    @Test
    void getTag() {
        // Initialize the database
        tagRepository.save(tag).block();

        // Get the tag
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, tag.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.name")
            .value(is(DEFAULT_NAME));
    }

    @Test
    void getNonExistingTag() {
        // Get the tag
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewTag() throws Exception {
        // Initialize the database
        tagRepository.save(tag).block();

        int databaseSizeBeforeUpdate = tagRepository.findAll().collectList().block().size();

        // Update the tag
        Tag updatedTag = tagRepository.findById(tag.getId()).block();
        updatedTag.name(UPDATED_NAME);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, updatedTag.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(updatedTag))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Tag in the database
        List<Tag> tagList = tagRepository.findAll().collectList().block();
        assertThat(tagList).hasSize(databaseSizeBeforeUpdate);
        Tag testTag = tagList.get(tagList.size() - 1);
        assertThat(testTag.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    void putNonExistingTag() throws Exception {
        int databaseSizeBeforeUpdate = tagRepository.findAll().collectList().block().size();
        tag.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, tag.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(tag))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Tag in the database
        List<Tag> tagList = tagRepository.findAll().collectList().block();
        assertThat(tagList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchTag() throws Exception {
        int databaseSizeBeforeUpdate = tagRepository.findAll().collectList().block().size();
        tag.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(tag))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Tag in the database
        List<Tag> tagList = tagRepository.findAll().collectList().block();
        assertThat(tagList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamTag() throws Exception {
        int databaseSizeBeforeUpdate = tagRepository.findAll().collectList().block().size();
        tag.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(tag))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Tag in the database
        List<Tag> tagList = tagRepository.findAll().collectList().block();
        assertThat(tagList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateTagWithPatch() throws Exception {
        // Initialize the database
        tagRepository.save(tag).block();

        int databaseSizeBeforeUpdate = tagRepository.findAll().collectList().block().size();

        // Update the tag using partial update
        Tag partialUpdatedTag = new Tag();
        partialUpdatedTag.setId(tag.getId());

        partialUpdatedTag.name(UPDATED_NAME);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedTag.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedTag))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Tag in the database
        List<Tag> tagList = tagRepository.findAll().collectList().block();
        assertThat(tagList).hasSize(databaseSizeBeforeUpdate);
        Tag testTag = tagList.get(tagList.size() - 1);
        assertThat(testTag.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    void fullUpdateTagWithPatch() throws Exception {
        // Initialize the database
        tagRepository.save(tag).block();

        int databaseSizeBeforeUpdate = tagRepository.findAll().collectList().block().size();

        // Update the tag using partial update
        Tag partialUpdatedTag = new Tag();
        partialUpdatedTag.setId(tag.getId());

        partialUpdatedTag.name(UPDATED_NAME);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedTag.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedTag))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Tag in the database
        List<Tag> tagList = tagRepository.findAll().collectList().block();
        assertThat(tagList).hasSize(databaseSizeBeforeUpdate);
        Tag testTag = tagList.get(tagList.size() - 1);
        assertThat(testTag.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    void patchNonExistingTag() throws Exception {
        int databaseSizeBeforeUpdate = tagRepository.findAll().collectList().block().size();
        tag.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, tag.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(tag))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Tag in the database
        List<Tag> tagList = tagRepository.findAll().collectList().block();
        assertThat(tagList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchTag() throws Exception {
        int databaseSizeBeforeUpdate = tagRepository.findAll().collectList().block().size();
        tag.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, UUID.randomUUID().toString())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(tag))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Tag in the database
        List<Tag> tagList = tagRepository.findAll().collectList().block();
        assertThat(tagList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamTag() throws Exception {
        int databaseSizeBeforeUpdate = tagRepository.findAll().collectList().block().size();
        tag.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(tag))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Tag in the database
        List<Tag> tagList = tagRepository.findAll().collectList().block();
        assertThat(tagList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteTag() {
        // Initialize the database
        tagRepository.save(tag).block();

        int databaseSizeBeforeDelete = tagRepository.findAll().collectList().block().size();

        // Delete the tag
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, tag.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Tag> tagList = tagRepository.findAll().collectList().block();
        assertThat(tagList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
