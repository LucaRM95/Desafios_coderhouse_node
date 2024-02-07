import expect from "expect.js";
import supertest from "supertest";

const ProductModel = {
  _id: "",
  code: "",
  owner: "",
  status: false,
  title: "",
  description: "",
  category: "",
  thumbnail: [""],
  price: 0,
  stock: 0,
};

const requested = supertest("http://localhost:8080");
let auth_token: string = "";

describe("Test de productos", () => {
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

  it("Debe traer todos los productos", async function () {
    const { statusCode, ok, body } = await requested
      .get("/api/products")
      .set("Cookie", `access_token=${auth_token}`);

    expect(statusCode).to.be.equal(200);
    expect(ok).to.be.equal(true);
    expect(body.payload.length).to.be.greaterThan(0);
  });

  it("Debe de traer un producto por id", async function () {
    const pid: string = "ad26fe9f-04ed-4e4f-b561-0a3e2b8fbd7c";
    const { statusCode, ok, body } = await requested
      .get(`/api/product/${pid}`)
      .set("Cookie", `access_token=${auth_token}`);

    expect(statusCode).to.be.equal(200);
    expect(ok).to.be.ok;
    expect(body).to.be.a(typeof ProductModel);
    expect(body[0]._id).to.be.equal(pid);
  });

  it("Debe crear un producto correctamente o denegar en caso de existir", async function () {
    const product = {
      code: 108,
      status: true,
      title: "iPhone 15 Pro Max",
      description: "iPhone 15 Pro Max",
      category: "Telefonía Celular",
      thumbnail: ["iphone_15_pmax.png"],
      price: 1500,
      stock: 38,
    };

    const { statusCode, ok, body } = await requested
      .post("/api/product")
      .send(product)
      .set("Cookie", `access_token=${auth_token}`);

    expect(statusCode).to.be.equal(201);
    expect(ok).to.be.equal(true);
    expect(body.message).to.be.equal(
      "Product has been added successfully."
    );
  });

  it("Debe de editar el producto seleccionado", async function () {
    const pid: string | number = 108;
    const editFields = {
      price: 1100,
      stock: 52,
    };
    const { statusCode, ok, body } = await requested
      .put(`/api/product/${pid}`)
      .send(editFields)
      .set("Cookie", `access_token=${auth_token}`);

    expect(statusCode).to.be.equal(200);
    expect(ok).to.be.ok;
    expect(body.message).to.be.equal("Product has been updated successfully.");
  });

  it("Debe de eliminar el producto correctamente", async function () {
    const pid: string | number = 108;
    const { statusCode, ok, body } = await requested
      .delete(`/api/product/${pid}`)
      .set("Cookie", `access_token=${auth_token}`);
    
    expect(statusCode).to.be.equal(200);
    expect(ok).to.be.ok;
    expect(body.message).to.be.equal("The product was deleted successfully.");
  });
});
