import expect from "expect.js";
import CartModel from "../../src/models/cart/carts.model";
import supertest from "supertest";

const CartType = {
  _id: "",
  products: [],
};

const requested = supertest("http://localhost:8080");
let auth_token: string = "";
let session: any = {};
let cid: string = "";

describe("Test módulo de carrito", () => {
  before(async function () {
    const login_res = await requested
      .post("/auth/login")
      .send({
        email: "lrojasmassey95@gmail.com",
        password: "Luca1995",
      })
      .set("Content-Type", "application/json");

    const cookies = login_res.headers["set-cookie"];
    if (cookies) {
      for (const cookie of cookies) {
        const match = /access_token=([^;]+);/.exec(cookie);
        if (match) {
          auth_token = match[1];
          break;
        }
      }
    }
    const { body } = await requested
      .get("/sessions")
      .set("Cookie", `access_token=${auth_token}`);
    if (body) {
      session = body;
    }
  });

  it("Debe de traer el carrito", async function () {
    const { statusCode, ok, body } = await requested
      .get(`/api/cart/${session.cid}`)
      .set("Cookie", `access_token=${auth_token}`);

    expect(statusCode).to.be.equal(200);
    expect(ok).to.be.ok;
    expect(body.payload._id.length).to.be.greaterThan(0);
    expect(body.payload).to.be.a(typeof CartType);
  });

  it("Debe de crear un carrito", async function () {
    const { statusCode, ok, body } = await requested
      .post("/api/cart/")
      .set("Cookie", `access_token=${auth_token}`);

    cid = body.cid;

    expect(statusCode).to.be.equal(201);
    expect(ok).to.be.ok;
    expect(body.cid.length).to.be.greaterThan(0);
    expect(body.message).to.be.equal("Cart created successfully.");
  });

  it("Debe de agregar un producto al carrito", async function () {
    const { statusCode, ok, body } = await requested
      .post("/api/cart/product")
      .send({
        cid: session.cid,
        pid: "92811100-b5d6-4be9-8bb2-24c6f9c5e77d",
      })
      .set("Cookie", `access_token=${auth_token}`);

    expect(statusCode).to.be.equal(200);
    expect(ok).to.be.ok;
    expect(body.message).to.be.equal(
      `Product has added to cart ${session.cid}.`
    );
  });
  it("Debe de editar la cantidad de los productos en el carrito", async function () {
    const {statusCode, ok, body} = await requested.put("/api/cart/products").send({
      cid: session.cid,
      pid: "92811100-b5d6-4be9-8bb2-24c6f9c5e77d",
      quantity: 4,
    })
    .set("Cookie", `access_token=${auth_token}`);

    expect(statusCode).to.be.equal(200);
    expect(ok).to.be.ok;
    expect(body.message).to.be.equal("Quantity updated successfully.");
  });
  it("Debe de eliminar un producto del carrito", async function () {
    const {statusCode, ok, body} = await requested.delete("/api/cart/products").send({
      cid: session.cid,
      pid: "92811100-b5d6-4be9-8bb2-24c6f9c5e77d",
    })
    .set("Cookie", `access_token=${auth_token}`);

    expect(statusCode).to.be.equal(200);
    expect(ok).to.be.ok;
    expect(body.message).to.be.equal("The product has been deleted from cart.");
  });
});
