# Kanban E2E Tests

## Descrição
Este projeto contém testes end-to-end (E2E) para um aplicativo Kanban, utilizando **Cypress**.  
O objetivo é validar funcionalidades como:

- Adicionar novas colunas
- Criar tarefas únicas em colunas
- Mover tarefas entre colunas (drag-and-drop)
- Excluir tarefas
- Verificar responsividade no modo mobile

---

## Tecnologias Utilizadas
- [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [Cypress](https://www.cypress.io/)
- Git/GitHub para versionamento

---

## Estrutura do Projeto
.
├── cypress/
│ ├── e2e/ # Testes E2E
│ ├── screenshots/ # Prints ou GIFs de testes (para README)
│ └── support/ # Comandos customizados e configurações
├── node_modules/ # Dependências (não subir no GitHub)
├── .gitignore # Ignora arquivos desnecessários
├── package.json # Configuração do Node e Cypress
└── README.md # Este arquivo

---

## Como Rodar os Testes

1. Instale as dependências:
```bash
npm install
Abra o Cypress:

bash
Copiar
Editar
npx cypress open
Execute os testes diretamente na interface do Cypress ou pelo terminal:

bash
Copiar
Editar
npx cypress run
Todos os testes foram criados para rodar de forma confiável, garantindo que cada funcionalidade crítica do Kanban seja validada.

Contato
Guilherme Timóteo

Email: guilhermetimoteo1501@gmail.com

LinkedIn: www.linkedin.com/in/guilherme-timóteo-541b8b207
