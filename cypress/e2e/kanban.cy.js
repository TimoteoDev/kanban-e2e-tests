/// <reference types="cypress" />
import '../support/commands';

describe('Kanban App - Testes E2E Confiáveis', () => {

  // Usamos timestamp para gerar nomes únicos de tarefas/colunas
  const timestamp = Date.now();

  // Antes de cada teste, visitamos a página do Kanban
  beforeEach(() => {
    cy.visit('/', { failOnStatusCode: false }); // evita erro 403
  });

  // Função auxiliar para drag-and-drop confiável
  function dragAndDrop(source, target) {
    cy.get(source)
      .trigger('mousedown', { which: 1, force: true })
      .trigger('dragstart', { dataTransfer: new DataTransfer() });

    cy.get(target)
      .trigger('dragover', { dataTransfer: new DataTransfer(), force: true })
      .trigger('drop', { dataTransfer: new DataTransfer(), force: true })
      .trigger('mouseup', { force: true });
  }

  // Teste: Carregar a página principal
  it('Carrega a página principal', () => {
    cy.url({ timeout: 10000 }).should('include', 'vercel.app'); // verifica URL
    cy.get('body', { timeout: 10000 }).should('be.visible'); // verifica se página está visível
  });

  // Teste: Adiciona uma nova coluna
  it('Adiciona uma nova coluna única', () => {
    const columnName = `Lista ${timestamp}`; // nome único
    cy.contains('p', 'Adicionar outra lista', { timeout: 10000 }).click(); // abre input
    cy.get('.sc-jqUVSM.kJTISr', { timeout: 10000 })
      .find('input:visible')
      .first()
      .type(`${columnName}{enter}`); // digita o nome da coluna
    cy.contains(columnName, { timeout: 10000 }).should('exist'); // valida criação
  });

  // Teste: Adiciona uma tarefa na coluna To Do
  it('Adiciona uma tarefa única na coluna To Do', () => {
    const taskName = `Tarefa teste`;
    cy.contains('h1.board-header-title', /📝\s*To Do/, { timeout: 10000 })
      .parents('div.sc-iBkjds')
      .find('div.board-cards.custom-scroll')
      .within(() => {
        cy.contains('p', 'Adicionar Tarefa', { timeout: 10000 }).click(); // abre input da tarefa
        cy.get('input:visible', { timeout: 10000 }).first().type(`${taskName}{enter}`); // digita a tarefa
      });
    cy.contains('p', taskName, { timeout: 10000 }).should('exist'); // verifica se a tarefa foi criada
  });

  // Teste: Move uma tarefa para outra coluna
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

    // Executa drag-and-drop confiável
    dragAndDrop('@taskToMove', '@targetColumn');

    cy.wait(500); // espera a animação do movimento

    // Valida se a tarefa está na coluna de destino
    cy.get('@targetColumn')
      .contains('p', taskName, { timeout: 10000 })
      .should('be.visible');
  });

  // Teste: Exclui uma tarefa
  it('Exclui uma tarefa única', () => {
    const taskName = `Tarefa exclui ${timestamp}`;

    // Cria a tarefa na coluna To Do
    cy.contains('h1.board-header-title', /📝\s*To Do/)
      .parents('div.sc-iBkjds')
      .find('div.board-cards.custom-scroll')
      .within(() => {
        cy.contains('p', 'Adicionar Tarefa').click();
        cy.get('input:visible').first().type(`${taskName}{enter}`);
      });

    // Clica no ícone de lixeira para excluir
    cy.contains('h1.board-header-title', /📝\s*To Do/)
      .parents('div.sc-iBkjds')
      .find('div.board-cards.custom-scroll')
      .within(() => {
        cy.contains('p', taskName)
          .parents('div.sc-gKXOVf')
          .within(() => {
            cy.get('svg.trash').click({ force: true }); // força clique pois pode estar escondido
          });
      });

    // Verifica se a tarefa foi realmente excluída
    cy.contains('p', taskName, { timeout: 10000 }).should('not.exist');
  });

  // Teste: Verifica visualização mobile
  it('Exibe corretamente no modo mobile', () => {
    cy.viewport('iphone-x'); // simula iPhone X
    cy.visit('/', { failOnStatusCode: false });
    cy.get('body').should('be.visible'); // verifica carregamento
    cy.contains('p', 'Adicionar outra lista').should('be.visible'); // valida elementos visíveis
  });
});
