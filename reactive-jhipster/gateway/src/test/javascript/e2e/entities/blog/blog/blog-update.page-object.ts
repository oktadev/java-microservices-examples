import { by, element, ElementFinder } from 'protractor';

import AlertPage from '../../../page-objects/alert-page';

export default class BlogUpdatePage extends AlertPage {
  title: ElementFinder = element(by.id('gatewayApp.blogBlog.home.createOrEditLabel'));
  footer: ElementFinder = element(by.id('footer'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));

  nameInput: ElementFinder = element(by.css('input#blog-name'));

  handleInput: ElementFinder = element(by.css('input#blog-handle'));

  userSelect = element(by.css('select#blog-user'));
}
