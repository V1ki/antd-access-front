
describe("Roles Test" , ()=>{

    const identifier = "user" ;

    before(()=>{
      cy.visit("http://localhost:8000/user/login");
      cy.get("#username").type('admin');
      cy.get("#password").type('ant.design');

      cy.get(`form > button.ant-btn`).click()
      cy.get('span.ant-dropdown-trigger')
    })

    beforeEach(()=>{
      cy.visit("http://localhost:8000/roles");
    })

    it('Query role list', ()=>{
      cy.get('tr.ant-table-row').should('have.length', 2);
    })


    it('Create Role', ()=> {
      cy.get("#role-create").click();
      cy.get('div.ant-modal-content input#name').type('user');
      cy.get('div.ant-modal-content input#identifier').type(identifier);
      cy.get('div.ant-modal-content input#order').type('1');
      cy.get('div.ant-modal-content input#enabled').check();

      cy.get('div.ant-modal-footer button.ant-btn-primary').click();
      cy.wait(2000)

      cy.get('tr.ant-table-row').should('have.length', 3);
    })


    it('update role', ()=>{

      cy.get(`button#roles-update-${identifier}`).click();

      cy.get('div.ant-modal-content input#name').clear().type('user2');

      cy.get('div.ant-modal-content input#identifier').should('not.be.enabled')
      cy.get('div.ant-modal-content input#order').clear().type('1');
      cy.get('div.ant-modal-content input#enabled').check();

      cy.get('div.ant-modal-footer button.ant-btn-primary').click();
      cy.wait(2000)

      cy.get('tr.ant-table-row').should('have.length', 3);
    })

    it('delete role', ()=>{

      cy.visit("http://localhost:8000/roles");
      cy.wait(2000)

      cy.get(`button#roles-delete-${identifier}`).click();
    });

})
