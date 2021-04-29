<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2
          id="gatewayApp.blogPost.home.createOrEditLabel"
          data-cy="PostCreateUpdateHeading"
          v-text="$t('gatewayApp.blogPost.home.createOrEditLabel')"
        >
          Create or edit a Post
        </h2>
        <div>
          <div class="form-group" v-if="post.id">
            <label for="id" v-text="$t('global.field.id')">ID</label>
            <input type="text" class="form-control" id="id" name="id" v-model="post.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.blogPost.title')" for="post-title">Title</label>
            <input
              type="text"
              class="form-control"
              name="title"
              id="post-title"
              data-cy="title"
              :class="{ valid: !$v.post.title.$invalid, invalid: $v.post.title.$invalid }"
              v-model="$v.post.title.$model"
              required
            />
            <div v-if="$v.post.title.$anyDirty && $v.post.title.$invalid">
              <small class="form-text text-danger" v-if="!$v.post.title.required" v-text="$t('entity.validation.required')">
                This field is required.
              </small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.blogPost.content')" for="post-content">Content</label>
            <textarea
              class="form-control"
              name="content"
              id="post-content"
              data-cy="content"
              :class="{ valid: !$v.post.content.$invalid, invalid: $v.post.content.$invalid }"
              v-model="$v.post.content.$model"
              required
            ></textarea>
            <div v-if="$v.post.content.$anyDirty && $v.post.content.$invalid">
              <small class="form-text text-danger" v-if="!$v.post.content.required" v-text="$t('entity.validation.required')">
                This field is required.
              </small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.blogPost.date')" for="post-date">Date</label>
            <div class="d-flex">
              <input
                id="post-date"
                data-cy="date"
                type="datetime-local"
                class="form-control"
                name="date"
                :class="{ valid: !$v.post.date.$invalid, invalid: $v.post.date.$invalid }"
                required
                :value="convertDateTimeFromServer($v.post.date.$model)"
                @change="updateInstantField('date', $event)"
              />
            </div>
            <div v-if="$v.post.date.$anyDirty && $v.post.date.$invalid">
              <small class="form-text text-danger" v-if="!$v.post.date.required" v-text="$t('entity.validation.required')">
                This field is required.
              </small>
              <small
                class="form-text text-danger"
                v-if="!$v.post.date.ZonedDateTimelocal"
                v-text="$t('entity.validation.ZonedDateTimelocal')"
              >
                This field should be a date and time.
              </small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.blogPost.blog')" for="post-blog">Blog</label>
            <select class="form-control" id="post-blog" data-cy="blog" name="blog" v-model="post.blog">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="post.blog && blogOption.id === post.blog.id ? post.blog : blogOption"
                v-for="blogOption in blogs"
                :key="blogOption.id"
              >
                {{ blogOption.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label v-text="$t('gatewayApp.blogPost.tag')" for="post-tag">Tag</label>
            <select class="form-control" id="post-tag" data-cy="tag" multiple name="tag" v-if="post.tags !== undefined" v-model="post.tags">
              <option v-bind:value="getSelected(post.tags, tagOption)" v-for="tagOption in tags" :key="tagOption.id">
                {{ tagOption.name }}
              </option>
            </select>
          </div>
        </div>
        <div>
          <button type="button" id="cancel-save" class="btn btn-secondary" v-on:click="previousState()">
            <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.cancel')">Cancel</span>
          </button>
          <button
            type="submit"
            id="save-entity"
            data-cy="entityCreateSaveButton"
            :disabled="$v.post.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./post-update.component.ts"></script>
