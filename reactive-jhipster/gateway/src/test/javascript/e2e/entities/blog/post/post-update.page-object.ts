import { by, element, ElementFinder } from 'protractor';

import AlertPage from '../../../page-objects/alert-page';

export default class PostUpdatePage extends AlertPage {
  title: ElementFinder = element(by.id('gatewayApp.blogPost.home.createOrEditLabel'));
  footer: ElementFinder = element(by.id('footer'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));

  titleInput: ElementFinder = element(by.css('input#post-title'));

  contentInput: ElementFinder = element(by.css('textarea#post-content'));

  dateInput: ElementFinder = element(by.css('input#post-date'));

  blogSelect = element(by.css('select#post-blog'));

  tagSelect = element(by.css('select#post-tag'));
}
