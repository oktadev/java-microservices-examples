import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Tag e2e test', () => {
  let startingEntitiesCount = 0;

  beforeEach(() => {
    cy.getOauth2Data();
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogin(oauth2Data, Cypress.env('E2E_USERNAME') || 'admin', Cypress.env('E2E_PASSWORD') || 'admin');
    });
    cy.intercept('GET', '/services/blog/api/tags*').as('entitiesRequest');
    cy.visit('');
    cy.clickOnEntityMenuItem('tag');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  afterEach(() => {
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogout(oauth2Data);
    });
    cy.clearCache();
  });

  it('should load Tags', () => {
    cy.intercept('GET', '/services/blog/api/tags*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('tag');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Tag').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Tag page', () => {
    cy.intercept('GET', '/services/blog/api/tags*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('tag');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('tag');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Tag page', () => {
    cy.intercept('GET', '/services/blog/api/tags*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('tag');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Tag');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Tag page', () => {
    cy.intercept('GET', '/services/blog/api/tags*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('tag');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Tag');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of Tag', () => {
    cy.intercept('GET', '/services/blog/api/tags*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('tag');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Tag');

    cy.get(`[data-cy="name"]`).type('didactic', { force: true }).invoke('val').should('match', new RegExp('didactic'));

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/services/blog/api/tags*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('tag');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of Tag', () => {
    cy.intercept('GET', '/services/blog/api/tags*').as('entitiesRequest');
    cy.intercept('DELETE', '/services/blog/api/tags/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('tag');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('tag').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/services/blog/api/tags*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('tag');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
