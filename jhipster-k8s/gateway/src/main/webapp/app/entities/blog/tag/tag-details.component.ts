import { Component, Vue, Inject } from 'vue-property-decorator';

import { ITag } from '@/shared/model/blog/tag.model';
import TagService from './tag.service';

@Component
export default class TagDetails extends Vue {
  @Inject('tagService') private tagService: () => TagService;
  public tag: ITag = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.tagId) {
        vm.retrieveTag(to.params.tagId);
      }
    });
  }

  public retrieveTag(tagId) {
    this.tagService()
      .find(tagId)
      .then(res => {
        this.tag = res;
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
