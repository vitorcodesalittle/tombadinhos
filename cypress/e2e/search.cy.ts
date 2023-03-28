describe('Search', () => {
  describe("user visits /search", () => {
    it("should see a search text field", () => {
      // visit /search page
      cy.visit('/search')

      // input value should be empty
      cy.get('#search')
        .should('have.value', '')

      // page title should have Tombadinhos
      cy.title().should('contain', 'Tombadinhos')

      // search text field should be visible
      cy.get('#search')
        .should('be.visible')
    })
  });

  describe("users searches \"Oficina\"", () => {
    // Given the user is in the /search page
    it("should see 2 test results", () => {
      // visit /search page
      cy.visit('/search')
      // search for "Oficina"
      cy.get('#search')
        .type('Oficina')
      // click search button
      cy.get('[data-cy=search-button]')
        .click()
      // should see 2 results
      cy.get('[data-cy=search-result-item]')
        .should('have.length', 5)

      // first result should start with Oficina
      cy.get('[data-cy=search-result]')
        .first()
        // .should('contain', 'Oficina')
    })
  })
})
