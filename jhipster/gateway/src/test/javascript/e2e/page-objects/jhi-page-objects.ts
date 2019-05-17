import { element, by, ElementFinder, browser } from 'protractor';

export class NavBarPage {
  entityMenu = element(by.id('entity-menu'));
  accountMenu = element(by.id('account-menu'));
  adminMenu: ElementFinder;
  signIn = element(by.id('login'));
  register = element(by.css('[routerLink="register"]'));
  signOut = element(by.id('logout'));
  passwordMenu = element(by.css('[routerLink="password"]'));
  settingsMenu = element(by.css('[routerLink="settings"]'));

  constructor(asAdmin?: Boolean) {
    if (asAdmin) {
      this.adminMenu = element(by.id('admin-menu'));
    }
  }

  async clickOnEntityMenu() {
    await this.entityMenu.click();
  }

  async clickOnAccountMenu() {
    await this.accountMenu.click();
  }

  async clickOnAdminMenu() {
    await this.adminMenu.click();
  }

  async clickOnSignIn() {
    await this.signIn.click();
  }

  async clickOnRegister() {
    await this.signIn.click();
  }

  async clickOnSignOut() {
    await this.signOut.click();
  }

  async clickOnPasswordMenu() {
    await this.passwordMenu.click();
  }

  async clickOnSettingsMenu() {
    await this.settingsMenu.click();
  }

  async clickOnEntity(entityName: string) {
    await element(by.css('[routerLink="' + entityName + '"]')).click();
  }

  async clickOnAdmin(entityName: string) {
    await element(by.css('[routerLink="admin/' + entityName + '"]')).click();
  }

  async getSignInPage() {
    await this.clickOnAccountMenu();
    await this.clickOnSignIn();
    return new SignInPage();
  }

  async goToEntity(entityName: string) {
    await this.clickOnEntityMenu();
    await this.clickOnEntity(entityName);
  }

  async goToSignInPage() {
    await this.clickOnAccountMenu();
    await this.clickOnSignIn();
  }

  async goToPasswordMenu() {
    await this.clickOnAccountMenu();
    await this.clickOnPasswordMenu();
  }

  async autoSignOut() {
    await this.clickOnAccountMenu();
    await this.clickOnSignOut();
  }
}

export class SignInPage {
  username = element(by.name('username'));
  password = element(by.name('password'));
  loginButton = element(by.css('input[type=submit]'));

  async setUserName(username) {
    await this.username.sendKeys(username);
  }

  async getUserName() {
    return this.username.getAttribute('value');
  }

  async clearUserName() {
    await this.username.clear();
  }

  async setPassword(password) {
    await this.password.sendKeys(password);
  }

  async getPassword() {
    return this.password.getAttribute('value');
  }

  async clearPassword() {
    await this.password.clear();
  }

  async loginWithOAuth(username: string, password: string) {
    // Entering non angular site, tell webdriver to switch to synchronous mode.
    await browser.waitForAngularEnabled(false);

    if (await this.username.isPresent()) {
      await this.username.sendKeys(username);
      await this.password.sendKeys(password);
      await this.loginButton.click();
      if (!(await this.username.isPresent())) {
        await browser.waitForAngularEnabled(true);
      }
    } else {
      // redirected back because already logged in
      browser.waitForAngularEnabled(true);
    }
  }

  async login() {
    await this.loginButton.click();
  }
}
