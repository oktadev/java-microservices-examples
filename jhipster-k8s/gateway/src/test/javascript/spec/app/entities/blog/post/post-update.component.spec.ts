/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';

import dayjs from 'dayjs';
import { DATE_TIME_LONG_FORMAT } from '@/shared/date/filters';

import * as config from '@/shared/config/config';
import PostUpdateComponent from '@/entities/blog/post/post-update.vue';
import PostClass from '@/entities/blog/post/post-update.component';
import PostService from '@/entities/blog/post/post.service';

import BlogService from '@/entities/blog/blog/blog.service';

import TagService from '@/entities/blog/tag/tag.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
const router = new Router();
localVue.use(Router);
localVue.component('font-awesome-icon', {});
localVue.component('b-input-group', {});
localVue.component('b-input-group-prepend', {});
localVue.component('b-form-datepicker', {});
localVue.component('b-form-input', {});

describe('Component Tests', () => {
  describe('Post Management Update Component', () => {
    let wrapper: Wrapper<PostClass>;
    let comp: PostClass;
    let postServiceStub: SinonStubbedInstance<PostService>;

    beforeEach(() => {
      postServiceStub = sinon.createStubInstance<PostService>(PostService);

      wrapper = shallowMount<PostClass>(PostUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          postService: () => postServiceStub,

          blogService: () => new BlogService(),

          tagService: () => new TagService(),
        },
      });
      comp = wrapper.vm;
    });

    describe('load', () => {
      it('Should convert date from string', () => {
        // GIVEN
        const date = new Date('2019-10-15T11:42:02Z');

        // WHEN
        const convertedDate = comp.convertDateTimeFromServer(date);

        // THEN
        expect(convertedDate).toEqual(dayjs(date).format(DATE_TIME_LONG_FORMAT));
      });

      it('Should not convert date if date is not present', () => {
        expect(comp.convertDateTimeFromServer(null)).toBeNull();
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const entity = { id: 123 };
        comp.post = entity;
        postServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(postServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.post = entity;
        postServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(postServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundPost = { id: 123 };
        postServiceStub.find.resolves(foundPost);
        postServiceStub.retrieve.resolves([foundPost]);

        // WHEN
        comp.beforeRouteEnter({ params: { postId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.post).toBe(foundPost);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        comp.previousState();
        await comp.$nextTick();

        expect(comp.$router.currentRoute.fullPath).toContain('/');
      });
    });
  });
});
