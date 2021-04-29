<template>
  <div>
    <h2 id="page-heading" data-cy="BlogHeading">
      <span v-text="$t('gatewayApp.blogBlog.home.title')" id="blog-heading">Blogs</span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
          <span v-text="$t('gatewayApp.blogBlog.home.refreshListLabel')">Refresh List</span>
        </button>
        <router-link :to="{ name: 'BlogCreate' }" custom v-slot="{ navigate }">
          <button @click="navigate" id="jh-create-entity" data-cy="entityCreateButton" class="btn btn-primary jh-create-entity create-blog">
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span v-text="$t('gatewayApp.blogBlog.home.createLabel')"> Create a new Blog </span>
          </button>
        </router-link>
      </div>
    </h2>
    <br />
    <div class="alert alert-warning" v-if="!isFetching && blogs && blogs.length === 0">
      <span v-text="$t('gatewayApp.blogBlog.home.notFound')">No blogs found</span>
    </div>
    <div class="table-responsive" v-if="blogs && blogs.length > 0">
      <table class="table table-striped" aria-describedby="blogs">
        <thead>
          <tr>
            <th scope="row"><span v-text="$t('global.field.id')">ID</span></th>
            <th scope="row"><span v-text="$t('gatewayApp.blogBlog.name')">Name</span></th>
            <th scope="row"><span v-text="$t('gatewayApp.blogBlog.handle')">Handle</span></th>
            <th scope="row"><span v-text="$t('gatewayApp.blogBlog.user')">User</span></th>
            <th scope="row"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="blog in blogs" :key="blog.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'BlogView', params: { blogId: blog.id } }">{{ blog.id }}</router-link>
            </td>
            <td>{{ blog.name }}</td>
            <td>{{ blog.handle }}</td>
            <td>
              {{ blog.user ? blog.user.login : '' }}
            </td>
            <td class="text-right">
              <div class="btn-group">
                <router-link :to="{ name: 'BlogView', params: { blogId: blog.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                  </button>
                </router-link>
                <router-link :to="{ name: 'BlogEdit', params: { blogId: blog.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                  </button>
                </router-link>
                <b-button
                  v-on:click="prepareRemove(blog)"
                  variant="danger"
                  class="btn btn-sm"
                  data-cy="entityDeleteButton"
                  v-b-modal.removeEntity
                >
                  <font-awesome-icon icon="times"></font-awesome-icon>
                  <span class="d-none d-md-inline" v-text="$t('entity.action.delete')">Delete</span>
                </b-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <b-modal ref="removeEntity" id="removeEntity">
      <span slot="modal-title"
        ><span id="gatewayApp.blogBlog.delete.question" data-cy="blogDeleteDialogHeading" v-text="$t('entity.delete.title')"
          >Confirm delete operation</span
        ></span
      >
      <div class="modal-body">
        <p id="jhi-delete-blog-heading" v-text="$t('gatewayApp.blogBlog.delete.question', { id: removeId })">
          Are you sure you want to delete this Blog?
        </p>
      </div>
      <div slot="modal-footer">
        <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialog()">Cancel</button>
        <button
          type="button"
          class="btn btn-primary"
          id="jhi-confirm-delete-blog"
          data-cy="entityConfirmDeleteButton"
          v-text="$t('entity.action.delete')"
          v-on:click="removeBlog()"
        >
          Delete
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts" src="./blog.component.ts"></script>
