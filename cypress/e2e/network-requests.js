describe("Network Requests", () => {
  let message = "Unable to find comment!";
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/network-requests");
  });

  it("Get Request", () => {
    cy.intercept(
      {
        method: "GET",
        url: "**/comments/*",
      },
      {
        body: {
          postId: 1,
          id: 1,
          name: "Test number 1",
          email: "tester@test.com",
          body: "Best ways to test XHR requests",
        },
      }
    ).as("getComment");

    cy.get(".network-btn").click();

    cy.wait("@getComment").its("response.statusCode").should("eq", 200);
  });

  it("Post Request", () => {
    cy.intercept("POST", "/comments").as("postComment");

    cy.get(".network-post").click();

    cy.wait("@postComment").should(({ request, response }) => {
      console.log(request);

      expect(request.body).to.include("email");

      console.log(response);

      expect(response.body).to.have.property("email", "hello@cypress.io");

      expect(request.headers).to.have.property("content-type");
      expect(request.headers).to.have.property(
        "origin",
        "https://example.cypress.io"
      );
    });
  });
  it("Put Request", () => {
    cy.intercept(
      {
        method: "PUT",
        url: "**/comments/*",
      },
      {
        statusCode: 404,
        body: { error: message },
        delay: 500,
      }
    ).as("putComment");

    cy.get(".network-put").click();

    cy.wait("@putComment");

    cy.get(".network-put-comment").should("contain", message);
  });
});
