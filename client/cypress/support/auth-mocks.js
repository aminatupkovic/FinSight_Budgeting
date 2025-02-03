// cypress/support/auth-mocks.js
Cypress.Commands.add("mockClerkSignedIn", () => {
    cy.intercept("GET", "/api/auth/user", {
      statusCode: 200,
      body: {
        user: { id: 1, email: "test+clerk_test@example.com" },
        isSignedIn: true,
      },
    }).as("getUser");
  });