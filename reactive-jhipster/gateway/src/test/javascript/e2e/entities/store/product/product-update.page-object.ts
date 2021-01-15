import { by, element, ElementFinder } from 'protractor';

import AlertPage from '../../../page-objects/alert-page';

export default class ProductUpdatePage extends AlertPage {
  title: ElementFinder = element(by.id('gatewayApp.storeProduct.home.createOrEditLabel'));
  footer: ElementFinder = element(by.id('footer'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));

  titleInput: ElementFinder = element(by.css('input#product-title'));

  priceInput: ElementFinder = element(by.css('input#product-price'));

  imageInput: ElementFinder = element(by.css('input#file_image'));
}
