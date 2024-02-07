import expect from "expect.js";
import supertest from "supertest";

const SessionModel = {
    id: "",
    first_name: "",
    last_name: "",
    role: "",
    email: "",
    cid: "",
    iat: 0,
    exp: 0
}

const requested = supertest("http://localhost:8080");
let auth_token: string = "";

describe("Test módulo de sesiones", () => {
  before(async function () {
    const res = await requested
      .post("/auth/login")
      .send({
        email: "lrojasmassey95@gmail.com",
        password: "Luca1995",
      })
      .set("Content-Type", "application/json");

    const cookies = res.headers["set-cookie"];
    if (cookies) {
      for (const cookie of cookies) {
        const match = /access_token=([^;]+);/.exec(cookie);
        if (match) {
          auth_token = match[1];
          break;
        }
      }
    }
  });

  it("Debe de corroborar la session actual", async function () {
    const { statusCode, ok, body } = await requested
      .get("/sessions")
      .set("Cookie", `access_token=${auth_token}`);

    expect(statusCode).to.be.equal(200);
    expect(ok).to.be.ok;
    expect(body).to.be.a(typeof SessionModel);
  });
});
