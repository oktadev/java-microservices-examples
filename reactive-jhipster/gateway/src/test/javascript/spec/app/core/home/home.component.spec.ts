import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils';
import Home from '@/core/home/home.vue';
import HomeClass from '@/core/home/home.component';
import * as config from '@/shared/config/config';

const localVue = createLocalVue();
config.initVueApp(localVue);
const store = config.initVueXStore(localVue);
const i18n = config.initI18N(localVue);
localVue.component('router-link', {});

describe('Home', () => {
  let home: HomeClass;
  let wrapper: Wrapper<HomeClass>;
  const loginService = { login: jest.fn(), logout: jest.fn() };

  beforeEach(() => {
    wrapper = shallowMount<HomeClass>(Home, {
      i18n,
      store,
      localVue,
      provide: {
        loginService: () => loginService,
      },
    });
    home = wrapper.vm;
  });

  it('should not have user data set', () => {
    expect(home.authenticated).toBeFalsy();
    expect(home.username).toBe('');
  });

  it('should have user data set after authentication', () => {
    store.commit('authenticated', { login: 'test' });

    expect(home.authenticated).toBeTruthy();
    expect(home.username).toBe('test');
  });

  it('should use login service', () => {
    home.openLogin();

    expect(loginService.login).toHaveBeenCalled();
  });
});
