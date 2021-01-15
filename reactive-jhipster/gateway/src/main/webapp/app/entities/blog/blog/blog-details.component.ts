import { Component, Vue, Inject } from 'vue-property-decorator';

import { IBlog } from '@/shared/model/blog/blog.model';
import BlogService from './blog.service';

@Component
export default class BlogDetails extends Vue {
  @Inject('blogService') private blogService: () => BlogService;
  public blog: IBlog = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.blogId) {
        vm.retrieveBlog(to.params.blogId);
      }
    });
  }

  public retrieveBlog(blogId) {
    this.blogService()
      .find(blogId)
      .then(res => {
        this.blog = res;
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
