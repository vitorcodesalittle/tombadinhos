describe('About page', () => {
  it("Should render content", () => {
    cy.visit('/about')
    // should have title Tombadinhos
    cy.title().should('contain', 'Tombadinhos')
    // should have Sobre o projeto title
    cy.get('[data-cy=about-title]')
      .should('contain', 'Sobre o projeto')
    // should have "Como ajudar" subtitle
    cy.get('[data-cy=about-subtitle]')
      .should('contain', 'Como ajudar')
  })
})
