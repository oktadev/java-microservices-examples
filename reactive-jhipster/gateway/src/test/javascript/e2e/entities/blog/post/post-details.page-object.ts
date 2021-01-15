import { element, by, ElementFinder } from 'protractor';

export default class PostDetailsPage {
  title: ElementFinder = element(by.css('h2.jh-entity-heading'));
  firstDetail: ElementFinder = element.all(by.css('.jh-entity-details > dd > span')).first();
  backButton: ElementFinder = element(by.css('.btn-info'));
}
