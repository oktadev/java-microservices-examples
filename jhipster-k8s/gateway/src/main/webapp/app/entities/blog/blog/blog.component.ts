import { mixins } from 'vue-class-component';

import { Component, Vue, Inject } from 'vue-property-decorator';
import Vue2Filters from 'vue2-filters';
import { IBlog } from '@/shared/model/blog/blog.model';

import BlogService from './blog.service';

@Component({
  mixins: [Vue2Filters.mixin],
})
export default class Blog extends Vue {
  @Inject('blogService') private blogService: () => BlogService;
  private removeId: number = null;

  public blogs: IBlog[] = [];

  public isFetching = false;

  public mounted(): void {
    this.retrieveAllBlogs();
  }

  public clear(): void {
    this.retrieveAllBlogs();
  }

  public retrieveAllBlogs(): void {
    this.isFetching = true;

    this.blogService()
      .retrieve()
      .then(
        res => {
          this.blogs = res.data;
          this.isFetching = false;
        },
        err => {
          this.isFetching = false;
        }
      );
  }

  public handleSyncList(): void {
    this.clear();
  }

  public prepareRemove(instance: IBlog): void {
    this.removeId = instance.id;
    if (<any>this.$refs.removeEntity) {
      (<any>this.$refs.removeEntity).show();
    }
  }

  public removeBlog(): void {
    this.blogService()
      .delete(this.removeId)
      .then(() => {
        const message = this.$t('blogApp.blogBlog.deleted', { param: this.removeId });
        this.$bvToast.toast(message.toString(), {
          toaster: 'b-toaster-top-center',
          title: 'Info',
          variant: 'danger',
          solid: true,
          autoHideDelay: 5000,
        });
        this.removeId = null;
        this.retrieveAllBlogs();
        this.closeDialog();
      });
  }

  public closeDialog(): void {
    (<any>this.$refs.removeEntity).hide();
  }
}
