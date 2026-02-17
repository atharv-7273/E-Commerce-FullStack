function isLoggedIn() {
  return localStorage.getItem("token") !== null;
}



// =============================
// DOM ELEMENTS
// =============================

const loginForm = document.getElementById("loginForm");
const productsDiv = document.getElementById("products");
const form = document.getElementById("productForm");

let editMode = false;
let editProductId = null;

if (!isLoggedIn()) {
  form.style.display = "none";
}


// =============================
// LOGIN LOGIC
// =============================

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          alert("Login Successful!");
        } else {
          alert("Login Failed");
        }
      });
  });
}

// =============================
// DELETE PRODUCT
// =============================

function deleteProduct(id) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first!");
    return;
  }

  fetch(`http://localhost:5000/api/products/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(() => loadProducts());
}

// =============================
// EDIT PRODUCT
// =============================

function editProduct(id, title, price, description) {
  document.getElementById("title").value = title;
  document.getElementById("price").value = price;
  document.getElementById("description").value = description;

  editMode = true;
  editProductId = id;
}

// =============================
// LOAD PRODUCTS
// =============================

function loadProducts() {

  fetch("http://localhost:5000/api/products")
    .then(res => res.json())
    .then(data => {
      productsDiv.innerHTML = "";

      data.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
  <img src="${product.image}" class="product-img">
  <h3>${product.title}</h3>
  <p class="price">₹${product.price}</p>
  <p>${product.description}</p>

  ${isLoggedIn() ? `
    <button onclick="editProduct('${product._id}', '${product.title}', '${product.price}', '${product.description}')">Edit</button>
    <button onclick="deleteProduct('${product._id}')">Delete</button>
  ` : ""}
`;


          
         ${
          isLoggedIn() ? `
           <button onclick="editProduct('${product._id}', '${product.title}', '${product.price}', '${product.description}')">Edit</button>

            <button onclick="deleteProduct('${product._id}')">Delete</button>
            ` : ""
        }

        `;

        productsDiv.appendChild(card);
      });
    });
}

// =============================
// Add Logout Button Logic
// =============================

function logout() {
  localStorage.removeItem("token");
  alert("Logged out!");
  location.reload();
}


// =============================
// ADD OR UPDATE PRODUCT
// =============================

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first!");
    return;
  }

  const productData = {
    title: document.getElementById("title").value,
    price: document.getElementById("price").value,
    description: document.getElementById("description").value
  };

  if (editMode) {
    fetch(`http://localhost:5000/api/products/${editProductId}`, {
        method: "PUT",
          headers: {
          "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      })
        .then(res => res.json())
        .then(() => {
          editMode = false;
          editProductId = null;
          form.reset();
          loadProducts();
        });
    } else {
      fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    })
      .then(res => res.json())
      .then(() => {
        form.reset();
        loadProducts();
      });
  }
});

// =============================
// INITIAL LOAD
// =============================

loadProducts();
