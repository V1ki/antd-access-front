
describe("Menus Test" , ()=>{


  const url = "http://localhost:8000/menus" ;
  const key = '4' ;

  before(()=>{
    cy.visit("http://localhost:8000/user/login");
    cy.get("#username").type('admin');
    cy.get("#password").type('ant.design');

    cy.get(`form > button.ant-btn`).click()
    cy.get('span.ant-dropdown-trigger')
  })

  beforeEach(()=>{
    cy.visit(url);
  })

  it('Query menu list', ()=>{
    cy.get('tr.ant-table-row-level-0').should('have.length', 2);

    cy.get('button.ant-table-row-expand-icon').click({multiple: true});

    cy.get('tr.ant-table-row-level-1').should('have.length', 1);

  })


  it('Create menu', ()=> {

    cy.get("#menu-create").click();
    cy.get('div.ant-modal-content input#name').type('user');
    cy.get('div.ant-modal-content input#icon').type('user');
    cy.get('div.ant-modal-content input#path').type('/user');
    cy.get('div.ant-modal-content input#component').type('./component');
    cy.get('div.ant-modal-content input#order').type('2');
    // cy.get('div.ant-modal-content input#hide').check();

    cy.get('div.ant-modal-footer button.ant-btn-primary').click();
    cy.wait(2000)
    cy.get('tr.ant-table-row-level-0').should('have.length', 3);
  })


  it('update menu', ()=>{
    cy.get(`#menus-update-${key}`).click();

    cy.get('div.ant-modal-content input#name').clear().type('user1');
    cy.get('div.ant-modal-content input#icon').clear().type('user');
    cy.get('div.ant-modal-content input#path').clear().type('/user');
    cy.get('div.ant-modal-content input#component').clear().type('./component');
    cy.get('div.ant-modal-content input#order').clear().type('2');

    cy.get('div.ant-modal-footer button.ant-btn-primary').click();
    cy.wait(2000)
    // [data-row-key='2'] td:nth-child(2)

    cy.get('tr.ant-table-row-level-0').should('have.length', 3);
    // cy.get(`[data-row-key='${key}'] > td`).should( ($lis) => {
    //   expect($lis.eq(1),'	菜单名称').to.contain('user1');
    // } )
    cy.get(`[data-row-key='${key}'] > td`).eq(1).should('have.text','user1')

  })

  it('delete menu', ()=>{
      cy.wait(2000) ;
      cy.get(`#menus-delete-${key}`).click();
      cy.wait(100) ;
      cy.get('tr.ant-table-row-level-0').should('have.length', 2);
  });

})
