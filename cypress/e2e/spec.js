/// <reference types="cypress" />
import '@4tw/cypress-drag-drop';

describe('Kanban App - Testes E2E', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Carrega a página principal', () => {
    cy.url().should('include', 'vercel.app');
    cy.get('body').should('be.visible');
  });

  it('Adiciona uma nova coluna', () => {
    cy.contains('p', 'Adicionar outra lista').click();
    cy.get('input:visible').type('Nova Lista{enter}');
    cy.contains('Nova Lista').should('exist');
  });

  it('Adiciona uma tarefa na coluna To Do', () => {
    cy.get('#📝\\  To DoCreateTask').click();
    cy.get('#📝\\  To DoCreateTask input:visible')
      .type('Tarefa de teste To Do{enter}');
    cy.contains('p', 'Tarefa de teste To Do').should('exist');
  });

  it('Adiciona uma tarefa na coluna In Progress', () => {
    cy.get('#💻\\  In ProgressCreateTask').click();
    cy.get('#💻\\  In ProgressCreateTask input:visible')
      .type('Tarefa de teste In Progress{enter}');
    cy.contains('p', 'Tarefa de teste In Progress').should('exist');
  });

  it('Adiciona uma tarefa na coluna Done', () => {
    cy.get('#🚀\\  DoneCreateTask').click();
    cy.get('#🚀\\  DoneCreateTask input:visible')
      .type('Tarefa de teste Done{enter}');
    cy.contains('p', 'Tarefa de teste Done').should('exist');
  });

  it('Move tarefa da coluna To Do para In Progress', () => {
    // Supondo que as colunas têm a estrutura que você mandou:
    cy.contains('p', 'Tarefa de teste To Do')
      .parents('div.sc-gKXOVf') // container da tarefa
      .drag('#💻\\  In Progress .board-cards'); // área onde soltar na coluna In Progress

    // Verifica que a tarefa está agora dentro da coluna In Progress
    cy.get('#💻\\  In Progress .board-cards')
      .should('contain', 'Tarefa de teste To Do');
  });

  it('Exclui uma tarefa existente na To Do', () => {
    cy.get('#📝\\  To Do .board-cards').within(() => {
      cy.contains('p', 'Tarefa para excluir').then(task => {
        if (task.length === 0) {
          // Se não existe, cria para poder excluir
          cy.get('#📝\\  To DoCreateTask').click();
          cy.get('#📝\\  To DoCreateTask input:visible').type('Tarefa para excluir{enter}');
          cy.contains('p', 'Tarefa para excluir').should('exist');
        }
      });

      cy.contains('p', 'Tarefa para excluir')
        .parents('div.sc-gKXOVf')
        .within(() => {
          cy.get('svg.trash').click();
        });
    });

    cy.contains('p', 'Tarefa para excluir').should('not.exist');
  });

  it('Exibe corretamente no modo mobile', () => {
    cy.viewport('iphone-x');
    cy.visit('/');
    cy.get('body').should('be.visible');
    cy.contains('p', 'Adicionar outra lista').should('be.visible');
  });
});
