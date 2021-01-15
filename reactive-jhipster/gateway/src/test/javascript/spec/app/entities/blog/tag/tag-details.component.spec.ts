/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import VueRouter from 'vue-router';

import * as config from '@/shared/config/config';
import TagDetailComponent from '@/entities/blog/tag/tag-details.vue';
import TagClass from '@/entities/blog/tag/tag-details.component';
import TagService from '@/entities/blog/tag/tag.service';
import router from '@/router';

const localVue = createLocalVue();
localVue.use(VueRouter);

config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('router-link', {});

describe('Component Tests', () => {
  describe('Tag Management Detail Component', () => {
    let wrapper: Wrapper<TagClass>;
    let comp: TagClass;
    let tagServiceStub: SinonStubbedInstance<TagService>;

    beforeEach(() => {
      tagServiceStub = sinon.createStubInstance<TagService>(TagService);

      wrapper = shallowMount<TagClass>(TagDetailComponent, {
        store,
        i18n,
        localVue,
        router,
        provide: { tagService: () => tagServiceStub },
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundTag = { id: 123 };
        tagServiceStub.find.resolves(foundTag);

        // WHEN
        comp.retrieveTag(123);
        await comp.$nextTick();

        // THEN
        expect(comp.tag).toBe(foundTag);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundTag = { id: 123 };
        tagServiceStub.find.resolves(foundTag);

        // WHEN
        comp.beforeRouteEnter({ params: { tagId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.tag).toBe(foundTag);
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
