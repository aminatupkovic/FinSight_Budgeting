// cypress/support/auth-mocks.js
Cypress.Commands.add("mockClerkSignedIn", () => {
    // Mock Clerk's useAuth hook with your real data
    cy.intercept("GET", "/api/auth/user", {
      statusCode: 200,
      body: {
        user: {
          id: "user_2qAB4y2pWowu1ZHB8tjR9mCrjcP", // Replace with your real Clerk user ID
          email: "aminatpkvc@gmail.com", // Replace with your real email
        },
        isSignedIn: true,
      },
    }).as("getUser");
  });