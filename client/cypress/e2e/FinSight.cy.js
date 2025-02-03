// cypress/e2e/dashboard.spec.js
describe("Dashboard", () => {
  beforeEach(() => {
    // Mock Clerk's authentication state
    cy.mockClerkSignedIn();

    // Navigate directly to the dashboard
    cy.visit("/dashboard");
  });

  it("loads the dashboard", () => {
    // Verify the dashboard loads
    cy.get(".dashboard").should("exist");
  });

  it("adds an income and updates the balance", () => {
    // Simulate adding an income
    cy.get('input[type="text"]').type("100");
    cy.contains("Add Income").click();

    // Verify the balance updates
    cy.get(".balance").should("contain", "$100");
  });
});