(() => {
  const API = "http://localhost:8080/api";
  const socket = io();
  const productList = document.querySelector("#product-list");
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  (async () => {
    const response = await fetch(`${API}/products`);
    const products = await response.json();
    products.map((product) => {
      const p = document.createElement("p");
      p.setAttribute("id", product.code);
      p.innerText = `${product.code} - ${product.title} - ${product.category} - USD${product.price}`;
      productList.appendChild(p);
    });
  })();

  const addProductToList = (product) => {
    const p = document.createElement("p");
    p.setAttribute("id", product.code);
    p.innerText = `${product.code} - ${product.title} - ${product.category} - USD${product.price}`;
    productList.appendChild(p);
  };

  const deleteProductToList = (productCode) => {
    const product = document.getElementById(productCode);
    productList.removeChild(product);
  };

  socket.on("add-product", (data) => {
    addProductToList(data);
    Toast.fire({
      icon: "success",
      title: "Product added successfully.",
    });
  });

  socket.on("delete-product", (data) => {
    deleteProductToList(data);
    Toast.fire({
      icon: "success",
      title: "Product deleted successfully.",
    });
  });
})();
