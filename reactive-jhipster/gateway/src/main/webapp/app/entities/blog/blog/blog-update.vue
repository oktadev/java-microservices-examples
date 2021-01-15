<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2
          id="gatewayApp.blogBlog.home.createOrEditLabel"
          data-cy="BlogCreateUpdateHeading"
          v-text="$t('gatewayApp.blogBlog.home.createOrEditLabel')"
        >
          Create or edit a Blog
        </h2>
        <div>
          <div class="form-group" v-if="blog.id">
            <label for="id" v-text="$t('global.field.id')">ID</label>
            <input type="text" class="form-control" id="id" name="id" v-model="blog.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.blogBlog.name')" for="blog-name">Name</label>
            <input
              type="text"
              class="form-control"
              name="name"
              id="blog-name"
              data-cy="name"
              :class="{ valid: !$v.blog.name.$invalid, invalid: $v.blog.name.$invalid }"
              v-model="$v.blog.name.$model"
              required
            />
            <div v-if="$v.blog.name.$anyDirty && $v.blog.name.$invalid">
              <small class="form-text text-danger" v-if="!$v.blog.name.required" v-text="$t('entity.validation.required')">
                This field is required.
              </small>
              <small class="form-text text-danger" v-if="!$v.blog.name.minLength" v-text="$t('entity.validation.minlength', { min: 3 })">
                This field is required to be at least 3 characters.
              </small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.blogBlog.handle')" for="blog-handle">Handle</label>
            <input
              type="text"
              class="form-control"
              name="handle"
              id="blog-handle"
              data-cy="handle"
              :class="{ valid: !$v.blog.handle.$invalid, invalid: $v.blog.handle.$invalid }"
              v-model="$v.blog.handle.$model"
              required
            />
            <div v-if="$v.blog.handle.$anyDirty && $v.blog.handle.$invalid">
              <small class="form-text text-danger" v-if="!$v.blog.handle.required" v-text="$t('entity.validation.required')">
                This field is required.
              </small>
              <small class="form-text text-danger" v-if="!$v.blog.handle.minLength" v-text="$t('entity.validation.minlength', { min: 2 })">
                This field is required to be at least 2 characters.
              </small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" v-text="$t('gatewayApp.blogBlog.user')" for="blog-user">User</label>
            <select class="form-control" id="blog-user" data-cy="user" name="user" v-model="blog.user">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="blog.user && userOption.id === blog.user.id ? blog.user : userOption"
                v-for="userOption in users"
                :key="userOption.id"
              >
                {{ userOption.login }}
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
            :disabled="$v.blog.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./blog-update.component.ts"></script>
