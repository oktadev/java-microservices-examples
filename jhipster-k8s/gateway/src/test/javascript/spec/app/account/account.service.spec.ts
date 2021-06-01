import { createLocalVue } from '@vue/test-utils';
import router from '@/router';
import axios from 'axios';
import sinon from 'sinon';

import AccountService from '@/account/account.service';
import TranslationService from '@/locale/translation.service';

import * as config from '@/shared/config/config';

const axiosStub = {
  get: sinon.stub(axios, 'get'),
  post: sinon.stub(axios, 'post'),
};
const mockedCookie = {
  get: jest.fn(() => {
    return 'token';
  }),
};

const localVue = createLocalVue();
let i18n;

let store;

describe('Account Service test suite', () => {
  let accountService: AccountService;

  beforeEach(() => {
    axiosStub.get.reset();
    store = config.initVueXStore(localVue);
    i18n = config.initI18N(localVue);
  });

  it('should init service and do not retrieve account', async () => {
    axiosStub.get.resolves({ data: { 'display-ribbon-on-profiles': 'dev', activeProfiles: ['dev', 'test'] } });
    const cookie = { get: jest.fn() };
    accountService = await new AccountService(store, new TranslationService(store, i18n), cookie, router);

    expect(store.getters.logon).toBe(false);
    expect(accountService.authenticated).toBe(false);
    expect(store.getters.account).toBe(null);
    expect(axiosStub.get.calledWith('management/info')).toBeTruthy();
    expect(store.getters.activeProfiles[0]).toBe('dev');
    expect(store.getters.activeProfiles[1]).toBe('test');
    expect(store.getters.ribbonOnProfiles).toBe('dev');
  });

  it('should init service and retrieve profiles if already logged in before but no account found', async () => {
    axiosStub.get.resolves({});
    accountService = await new AccountService(store, new TranslationService(store, i18n), mockedCookie, router);

    expect((<any>router).history.current.fullPath).toBe('/');
    expect(store.getters.logon).toBe(false);
    expect(accountService.authenticated).toBe(false);
    expect(store.getters.account).toBe(null);
    expect(axiosStub.get.calledWith('management/info')).toBeTruthy();
  });

  it('should init service and retrieve profiles if already logged in before but exception occurred and should be logged out', async () => {
    axiosStub.get.resolves({});
    axiosStub.get.withArgs('api/account').rejects();
    accountService = await new AccountService(store, new TranslationService(store, i18n), mockedCookie, router);

    expect((<any>router).history.current.fullPath).toBe('/');
    expect(accountService.authenticated).toBe(false);
    expect(store.getters.account).toBe(null);
    expect(axiosStub.get.calledWith('management/info')).toBeTruthy();
  });

  it('should init service and check for authority after retrieving account but getAccount failed', async () => {
    axiosStub.get.rejects();
    accountService = await new AccountService(store, new TranslationService(store, i18n), mockedCookie, router);

    return accountService.hasAnyAuthorityAndCheckAuth('USER').then((value: boolean) => {
      expect(value).toBe(false);
    });
  });

  it('should init service and check for authority after retrieving account', async () => {
    axiosStub.get.resolves({ data: { authorities: ['USER'] } });
    accountService = await new AccountService(store, new TranslationService(store, i18n), mockedCookie, router);

    return accountService.hasAnyAuthorityAndCheckAuth('USER').then((value: boolean) => {
      expect(value).toBe(true);
    });
  });

  it('should init service as not authentified and not return any authorities admin and not retrieve account', async () => {
    axiosStub.get.resolves({});
    axiosStub.get.withArgs('api/account').rejects();
    accountService = await new AccountService(store, new TranslationService(store, i18n), mockedCookie, router);

    return accountService.hasAnyAuthorityAndCheckAuth('ADMIN').then((value: boolean) => {
      expect(value).toBe(false);
    });
  });

  it('should init service as not authentified and return authority user', async () => {
    axiosStub.get.resolves({});
    axiosStub.get.withArgs('api/account').rejects();
    accountService = await new AccountService(store, new TranslationService(store, i18n), mockedCookie, router);

    return accountService.hasAnyAuthorityAndCheckAuth('USER').then((value: boolean) => {
      expect(value).toBe(true);
    });
  });
});
