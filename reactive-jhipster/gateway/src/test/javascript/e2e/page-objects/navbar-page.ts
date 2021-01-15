import { browser, $, ElementFinder } from 'protractor';

import SignInPage from './signin-page';
import { ConfigurationsPage, GatewayPage, HealthPage, LogsPage, MetricsPage } from './administration-page';
import { click, isVisible, waitUntilDisplayed, waitUntilHidden } from '../util/utils';

export default class NavBarPage {
  selector: ElementFinder = $('#app-header');
  adminMenu: ElementFinder = this.selector.$('#admin-menu');
  accountMenu: ElementFinder = this.selector.$('#account-menu');
  entityMenu: ElementFinder = this.selector.$('#entity-menu');

  async clickOnTabMenu(item: string) {
    await click(this.selector.$(`.dropdown-menu ${item}`));
  }

  async clickOnAccountMenu() {
    await click(this.accountMenu);
  }

  async clickOnAccountMenuItem(item: string) {
    await this.clickOnAccountMenu();
    await click(this.selector.$(`.dropdown-item[href="/account/${item}"]`));
  }

  async getSignInPage() {
    await this.clickOnAccountMenu();
    await this.clickOnTabMenu('#login');
    const signInPage = new SignInPage();
    return signInPage;
  }

  async clickOnAdminMenuItem(item: string) {
    await click(this.adminMenu);
    await click(this.selector.$(`.dropdown-item[href="/admin/${item}"]`));
  }

  async clickOnEntityMenu() {
    await click(this.entityMenu);
  }

  async clickOnEntity(entityName: string) {
    await click(this.selector.$(`.dropdown-item[href="/${entityName}"]`));
  }

  async getEntityPage(entityName: string) {
    await this.clickOnEntityMenu();
    await this.clickOnEntity(entityName);
  }

  async login(username: string, password: string) {
    await this.clickOnAccountMenu();
    const alreadyLoggedIn = await isVisible(this.selector.$(`.dropdown-menu #logout`));

    // close account menu
    await this.clickOnAccountMenu();
    if (!alreadyLoggedIn) {
      const signInPage = await this.getSignInPage();
      await signInPage.login(username, password);
      await waitUntilDisplayed(this.entityMenu);
    }
  }

  async autoSignOut() {
    // avoid interference due to dialogs
    await browser.get('/');
    await this.clickOnAccountMenu();
    await this.clickOnTabMenu('#logout');
    await waitUntilHidden(this.entityMenu);
  }

  async getMetricsPage() {
    await this.clickOnAdminMenuItem('metrics');
    const metricsPage = new MetricsPage();
    await waitUntilDisplayed(metricsPage.title);
    return metricsPage;
  }

  async getHealthPage() {
    await this.clickOnAdminMenuItem('health');
    const healthPage = new HealthPage();
    await waitUntilDisplayed(healthPage.title);
    return healthPage;
  }

  async getConfigurationsPage() {
    await this.clickOnAdminMenuItem('configuration');
    const configurationsPage = new ConfigurationsPage();
    await waitUntilDisplayed(configurationsPage.title);
    return configurationsPage;
  }

  async getLogsPage() {
    await this.clickOnAdminMenuItem('logs');
    const logsPage = new LogsPage();
    await waitUntilDisplayed(logsPage.title);
    return logsPage;
  }

  async getGatewayPage() {
    await this.clickOnAdminMenuItem('gateway');
    const gatewayPage = new GatewayPage();
    await waitUntilDisplayed(gatewayPage.title);
    return gatewayPage;
  }
}
