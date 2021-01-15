import { Component, Inject } from 'vue-property-decorator';

import { mixins } from 'vue-class-component';
import JhiDataUtils from '@/shared/data/data-utils.service';

import { required } from 'vuelidate/lib/validators';
import dayjs from 'dayjs';
import { DATE_TIME_LONG_FORMAT } from '@/shared/date/filters';

import BlogService from '@/entities/blog/blog/blog.service';
import { IBlog } from '@/shared/model/blog/blog.model';

import TagService from '@/entities/blog/tag/tag.service';
import { ITag } from '@/shared/model/blog/tag.model';

import { IPost, Post } from '@/shared/model/blog/post.model';
import PostService from './post.service';

const validations: any = {
  post: {
    title: {
      required,
    },
    content: {
      required,
    },
    date: {
      required,
    },
  },
};

@Component({
  validations,
})
export default class PostUpdate extends mixins(JhiDataUtils) {
  @Inject('postService') private postService: () => PostService;
  public post: IPost = new Post();

  @Inject('blogService') private blogService: () => BlogService;

  public blogs: IBlog[] = [];

  @Inject('tagService') private tagService: () => TagService;

  public tags: ITag[] = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.postId) {
        vm.retrievePost(to.params.postId);
      }
      vm.initRelationships();
    });
  }

  created(): void {
    this.currentLanguage = this.$store.getters.currentLanguage;
    this.$store.watch(
      () => this.$store.getters.currentLanguage,
      () => {
        this.currentLanguage = this.$store.getters.currentLanguage;
      }
    );
    this.post.tags = [];
  }

  public save(): void {
    this.isSaving = true;
    if (this.post.id) {
      this.postService()
        .update(this.post)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('blogApp.blogPost.updated', { param: param.id });
          return this.$root.$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Info',
            variant: 'info',
            solid: true,
            autoHideDelay: 5000,
          });
        });
    } else {
      this.postService()
        .create(this.post)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = this.$t('blogApp.blogPost.created', { param: param.id });
          this.$root.$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Success',
            variant: 'success',
            solid: true,
            autoHideDelay: 5000,
          });
        });
    }
  }

  public convertDateTimeFromServer(date: Date): string {
    if (date && dayjs(date).isValid()) {
      return dayjs(date).format(DATE_TIME_LONG_FORMAT);
    }
    return null;
  }

  public updateInstantField(field, event) {
    if (event.target.value) {
      this.post[field] = dayjs(event.target.value, DATE_TIME_LONG_FORMAT);
    } else {
      this.post[field] = null;
    }
  }

  public updateZonedDateTimeField(field, event) {
    if (event.target.value) {
      this.post[field] = dayjs(event.target.value, DATE_TIME_LONG_FORMAT);
    } else {
      this.post[field] = null;
    }
  }

  public retrievePost(postId): void {
    this.postService()
      .find(postId)
      .then(res => {
        res.date = new Date(res.date);
        this.post = res;
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {
    this.blogService()
      .retrieve()
      .then(res => {
        this.blogs = res.data;
      });
    this.tagService()
      .retrieve()
      .then(res => {
        this.tags = res.data;
      });
  }

  public getSelected(selectedVals, option): any {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
