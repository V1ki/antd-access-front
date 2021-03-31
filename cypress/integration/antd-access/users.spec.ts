describe('Roles Test', () => {
  const identifier = 'test';

  before(() => {
    cy.visit('http://localhost:8000/user/login');
    cy.get('#username').type('admin');
    cy.get('#password').type('ant.design');

    cy.get(`form > button.ant-btn`).click();
    cy.get('span.ant-dropdown-trigger');
  });

  beforeEach(() => {
    cy.visit('http://localhost:8000/users');
  });

  it('Query users list', () => {
    cy.get('tr.ant-table-row').should('have.length', 2);
  });

  it('Query Menus', () => {
    cy.get('li.ant-menu-item').should('have.length', 2);
  });

  it('Update Role', () => {
    cy.visit('http://localhost:8000/roles');
    cy.get('#roles-menu-update-admin').click();
    cy.get('span.ant-tree-checkbox').eq(0).click();
    cy.get('span.ant-tree-checkbox').eq(2).click();

    cy.get('div.ant-modal-footer button.ant-btn-primary').click();
    cy.reload();
    cy.wait(2000);
    cy.get('li.ant-menu-item').should('have.length', 4);
  });

  it('Create users', () => {
    cy.get('#user-create').click();
    cy.get('div.ant-modal-content input#account').type(identifier);
    cy.get('div.ant-modal-content input#name').type('test');
    cy.get('div.ant-modal-content input#passwd').type('123456');
    cy.get('div.ant-modal-content input#avatar').type(
      'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    );

    cy.get('div.ant-modal-content input#mobile').type('xxxxxxx');
    cy.get('div.ant-modal-content input#email').type('test@test.com');
    cy.get('div.ant-modal-content input#roles').click();

    cy.get('div[title="Test"]').click();

    cy.get('div.ant-modal-content input#email').click();

    cy.get('div.ant-modal-footer button.ant-btn-primary').click();
    cy.wait(2000);

    cy.get('tr.ant-table-row').should('have.length', 3);
    cy.get(`[data-row-key='3'] > td`).eq(2).should('have.text', 'test');
  });

  it('Log out', () => {
    //  data-key="account-dropdown"
    cy.get(`[data-key="account-dropdown"]`).click();
    cy.get(`.anticon-logout`).click();
  });

  it('Login with test  and logout', () => {
    //  data-key="account-dropdown"
    cy.visit('http://localhost:8000/user/login');
    cy.get('#username').type('test');
    cy.get('#password').type('123456');

    cy.get(`form > button.ant-btn`).click();
    cy.wait(2000);

    cy.visit('http://localhost:8000/users');
    cy.wait(2000);

    cy.get('tr.ant-table-row').should('have.length', 3);

    cy.get(`[data-key="account-dropdown"]`).click();
    cy.get(`.anticon-logout`).click();
  });

  it('Login with admin', () => {
    cy.visit('http://localhost:8000/user/login');
    cy.get('#username').type('admin');
    cy.get('#password').type('ant.design');

    cy.get(`form > button.ant-btn`).click();

    cy.wait(2000);
    cy.get(`[data-key="account-dropdown"]`);
  });

  it('update user', () => {
    cy.get(`button#user-update-3`).click();

    cy.get('div.ant-modal-content input#name').clear().type('test1');
    cy.get('div.ant-modal-content input#passwd').clear().type('654321');
    cy.get('div.ant-modal-footer button.ant-btn-primary').click();
    cy.wait(2000);

    cy.get('tr.ant-table-row').should('have.length', 3);
    cy.get(`[data-row-key='3'] > td`).eq(2).should('have.text', 'test1');
    cy.get(`[data-row-key='3'] > td`).eq(3).should('have.text', '654321');
  });

  it('delete user', () => {
    cy.visit('http://localhost:8000/users');
    cy.wait(2000);

    cy.get(`button#user-delete-3`).click();
  });

  it('delete role', () => {
    cy.visit('http://localhost:8000/roles');
    cy.wait(2000);

    cy.get('#roles-menu-update-admin').click();
    cy.get('span.ant-tree-checkbox-checked').should('have.length', 3);
    cy.get('span.ant-tree-checkbox').eq(0).click();
    cy.get('span.ant-tree-checkbox').eq(2).click();
    cy.get('div.ant-modal-footer button.ant-btn-primary').click();
    cy.reload();
    cy.wait(2000);

    cy.get('li.ant-menu-item').should('have.length', 2);
  });
});
