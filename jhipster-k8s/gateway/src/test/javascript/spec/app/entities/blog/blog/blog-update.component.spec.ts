/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';

import * as config from '@/shared/config/config';
import BlogUpdateComponent from '@/entities/blog/blog/blog-update.vue';
import BlogClass from '@/entities/blog/blog/blog-update.component';
import BlogService from '@/entities/blog/blog/blog.service';

import UserOAuth2Service from '@/entities/user/user.oauth2.service';

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
  describe('Blog Management Update Component', () => {
    let wrapper: Wrapper<BlogClass>;
    let comp: BlogClass;
    let blogServiceStub: SinonStubbedInstance<BlogService>;

    beforeEach(() => {
      blogServiceStub = sinon.createStubInstance<BlogService>(BlogService);

      wrapper = shallowMount<BlogClass>(BlogUpdateComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: {
          blogService: () => blogServiceStub,

          userOAuth2Service: () => new UserOAuth2Service(),
        },
      });
      comp = wrapper.vm;
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const entity = { id: 123 };
        comp.blog = entity;
        blogServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(blogServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.blog = entity;
        blogServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(blogServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundBlog = { id: 123 };
        blogServiceStub.find.resolves(foundBlog);
        blogServiceStub.retrieve.resolves([foundBlog]);

        // WHEN
        comp.beforeRouteEnter({ params: { blogId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.blog).toBe(foundBlog);
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
