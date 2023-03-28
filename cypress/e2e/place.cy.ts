describe('Place page', () => {
  const placeData = {
    name: 'eildjncmtj',
    description: 'cgirppaand' 
  }
  it('Shows basic place information', () => {
    // visits /edificios/1
    cy.visit('/edificios/kywoJYcBcYmTycStvsb9')
    // page title should be Tombadinhos
    cy.title().should('contain', 'Tombadinhos')
    // Should have title element with Oficina
    cy.get('[data-cy=place-title]')
      .should('contain', placeData.name)

    // Should have paragraph with place description
    cy.get('[data-cy=place-description]')
      .should('contain', placeData.description)
  })
})
