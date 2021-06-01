import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import * as config from '@/shared/config/config';
import HealthModal from '@/admin/health/health-modal.vue';
import HealthModalClass from '@/admin/health/health-modal.component';

const localVue = createLocalVue();
config.initVueApp(localVue);
const i18n = config.initI18N(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
const healthsService = { getBaseName: jest.fn(), getSubSystemName: jest.fn() };

describe('Health Modal Component', () => {
  let wrapper: Wrapper<HealthModalClass>;
  let healthModal: HealthModalClass;

  beforeEach(() => {
    wrapper = shallowMount<HealthModalClass>(HealthModal, {
      propsData: {
        currentHealth: {},
      },
      i18n,
      localVue,
      provide: {
        healthService: () => healthsService,
      },
    });
    healthModal = wrapper.vm;
  });

  describe('baseName and subSystemName', () => {
    it('should use healthService', () => {
      healthModal.baseName('base');

      expect(healthsService.getBaseName).toHaveBeenCalled();
    });

    it('should use healthService', () => {
      healthModal.subSystemName('base');

      expect(healthsService.getSubSystemName).toHaveBeenCalled();
    });
  });

  describe('readableValue should transform data', () => {
    it('to string when is an object', () => {
      const result = healthModal.readableValue({ data: 1000 });

      expect(result).toBe('{"data":1000}');
    });

    it('to string when is a string', () => {
      const result = healthModal.readableValue('data');

      expect(result).toBe('data');
    });
  });
});

describe('Health Modal Component for diskSpace', () => {
  let wrapper: Wrapper<HealthModalClass>;
  let healthModal: HealthModalClass;

  beforeEach(() => {
    wrapper = shallowMount<HealthModalClass>(HealthModal, {
      propsData: {
        currentHealth: { name: 'diskSpace' },
      },
      i18n,
      localVue,
      provide: {
        healthService: () => healthsService,
      },
    });
    healthModal = wrapper.vm;
  });

  describe('readableValue should transform data', () => {
    it('to GB when needed', () => {
      const result = healthModal.readableValue(2147483648);

      expect(result).toBe('2.00 GB');
    });

    it('to MB when needed', () => {
      const result = healthModal.readableValue(214748);

      expect(result).toBe('0.20 MB');
    });
  });
});
