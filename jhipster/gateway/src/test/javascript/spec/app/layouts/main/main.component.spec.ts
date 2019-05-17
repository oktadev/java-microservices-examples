import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationCancel, Router } from '@angular/router';

import { AccountService, StateStorageService } from 'app/core';
import { JhiMainComponent } from 'app/layouts';
import { MockStateStorageService } from '../../../helpers/mock-state-storage.service';
import { GatewayTestModule } from '../../../test.module';

describe('Component Tests', () => {
  describe('MainComponent', () => {
    let comp: JhiMainComponent;
    let fixture: ComponentFixture<JhiMainComponent>;
    let accountService: any;
    let storageService: any;
    let router: any;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [GatewayTestModule],
        declarations: [JhiMainComponent],
        providers: [
          {
            provide: StateStorageService,
            useClass: MockStateStorageService
          }
        ]
      })
        .overrideTemplate(JhiMainComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(JhiMainComponent);
      comp = fixture.componentInstance;
      accountService = fixture.debugElement.injector.get(AccountService);
      storageService = fixture.debugElement.injector.get(StateStorageService);
      router = fixture.debugElement.injector.get(Router);
    });

    it('should navigate to the previous stored url post successful authentication', () => {
      accountService.setIdentityResponse({ firstName: 'John' });
      storageService.setResponse('admin/users?page=0');
      router.setRouterEvent(new NavigationCancel(0, 'http://localhost:9000', 'cancel'));

      // WHEN/
      comp.ngOnInit();

      // THEN
      expect(storageService.getUrlSpy).toHaveBeenCalledTimes(1);
      expect(storageService.storeUrlSpy).toHaveBeenCalledWith(null);
      expect(router.navigateByUrlSpy).toHaveBeenCalledWith('admin/users?page=0');
    });

    it('should not navigate to the previous stored url when authentication fails', () => {
      accountService.setIdentityResponse();
      router.setRouterEvent(new NavigationCancel(0, 'http://localhost:9000', 'cancel'));

      // WHEN/
      comp.ngOnInit();

      // THEN
      expect(storageService.getUrlSpy).not.toHaveBeenCalled();
      expect(storageService.storeUrlSpy).not.toHaveBeenCalled();
      expect(router.navigateByUrlSpy).not.toHaveBeenCalled();
    });

    it('should not navigate to the previous stored url when no such url exists post successful authentication', () => {
      accountService.setIdentityResponse({ firstName: 'John' });
      storageService.setResponse(undefined);
      router.setRouterEvent(new NavigationCancel(0, 'http://localhost:9000', 'cancel'));

      // WHEN/
      comp.ngOnInit();

      // THEN
      expect(storageService.getUrlSpy).toHaveBeenCalledTimes(1);
      expect(storageService.storeUrlSpy).not.toHaveBeenCalled();
      expect(router.navigateByUrlSpy).not.toHaveBeenCalled();
    });
  });
});
