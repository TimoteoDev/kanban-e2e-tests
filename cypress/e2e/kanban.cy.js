/// <reference types="cypress" />
import '../support/commands';

describe('Kanban App - Testes E2E Confiáveis', () => {

  const timestamp = Date.now();

  beforeEach(() => {
    cy.visit('/', { failOnStatusCode: false });
  });

  // Função confiável de drag-and-drop
  function dragAndDrop(source, target) {
    cy.get(source)
      .trigger('mousedown', { which: 1, force: true })
      .trigger('dragstart', { dataTransfer: new DataTransfer() });

    cy.get(target)
      .trigger('dragover', { dataTransfer: new DataTransfer(), force: true })
      .trigger('drop', { dataTransfer: new DataTransfer(), force: true })
      .trigger('mouseup', { force: true });
  }

  it('Carrega a página principal', () => {
    cy.url({ timeout: 10000 }).should('include', 'vercel.app');
    cy.get('body', { timeout: 10000 }).should('be.visible');
  });

  it('Adiciona uma nova coluna única', () => {
    const columnName = `Lista ${timestamp}`;
    cy.contains('p', 'Adicionar outra lista', { timeout: 10000 }).click();
    cy.get('.sc-jqUVSM.kJTISr', { timeout: 10000 })
      .find('input:visible')
      .first()
      .type(`${columnName}{enter}`);
    cy.contains(columnName, { timeout: 10000 }).should('exist');
  });

  it('Adiciona uma tarefa única na coluna To Do', () => {
    const taskName = `Tarefa teste`;
    cy.contains('h1.board-header-title', /📝\s*To Do/, { timeout: 10000 })
      .parents('div.sc-iBkjds')
      .find('div.board-cards.custom-scroll')
      .within(() => {
        cy.contains('p', 'Adicionar Tarefa', { timeout: 10000 }).click();
        cy.get('input:visible', { timeout: 10000 }).first().type(`${taskName}{enter}`);
      });
    cy.contains('p', taskName, { timeout: 10000 }).should('exist');
  });

  it('Move uma tarefa única para outra coluna (corrigido)', () => {
    const taskName = `Tarefa move ${timestamp}`;

    // Cria a tarefa na coluna To Do
    cy.contains('h1.board-header-title', /📝\s*To Do/)
      .parents('div.sc-iBkjds')
      .find('div.board-cards.custom-scroll')
      .within(() => {
        cy.contains('p', 'Adicionar Tarefa').click();
        cy.get('input:visible').first().type(`${taskName}{enter}`);
      });

    // Seleciona tarefa e coluna de destino
    cy.contains('h1.board-header-title', /📝\s*To Do/)
      .parents('div.sc-iBkjds')
      .find('div.board-cards.custom-scroll')
      .contains('p', taskName)
      .parents('div.sc-gKXOVf')
      .as('taskToMove');

    cy.contains(/💻\s*In Progress/)
      .parents('div.sc-iBkjds')
      .find('div.board-cards.custom-scroll')
      .as('targetColumn');

    // Drag-and-drop confiável
    dragAndDrop('@taskToMove', '@targetColumn');

    cy.wait(500);

    // Verifica se a tarefa está na coluna de destino
    cy.get('@targetColumn')
      .contains('p', taskName, { timeout: 10000 })
      .should('be.visible');
  });

  it('Exclui uma tarefa única', () => {
    const taskName = `Tarefa exclui ${timestamp}`;

    cy.contains('h1.board-header-title', /📝\s*To Do/)
      .parents('div.sc-iBkjds')
      .find('div.board-cards.custom-scroll')
      .within(() => {
        cy.contains('p', 'Adicionar Tarefa').click();
        cy.get('input:visible').first().type(`${taskName}{enter}`);
      });

    cy.contains('h1.board-header-title', /📝\s*To Do/)
      .parents('div.sc-iBkjds')
      .find('div.board-cards.custom-scroll')
      .within(() => {
        cy.contains('p', taskName)
          .parents('div.sc-gKXOVf')
          .within(() => {
            cy.get('svg.trash').click({ force: true });
          });
      });

    cy.contains('p', taskName, { timeout: 10000 }).should('not.exist');
  });

  it('Exibe corretamente no modo mobile', () => {
    cy.viewport('iphone-x');
    cy.visit('/', { failOnStatusCode: false });
    cy.get('body').should('be.visible');
    cy.contains('p', 'Adicionar outra lista').should('be.visible');
  });
});
