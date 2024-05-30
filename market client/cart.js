const items = document.getElementById("items")


let cart = getCart()
function getCart() {
    const cart = getCookie("cart")
    if (cart == ""){
        return []
    }
    else{
        return JSON.parse(cart)
    }
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i]; 
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
let sum = 0;
cart.forEach(({product, count})=>{
  const productDiv = document.createElement('div');
  fetch('http://localhost:3000/products')
    .then(response => response.json())
    .then(products => {
        // Clear existing content
        const p = products.find((p) => p.productID == product)
        productDiv.innerHTML = 
        `<h3>${p.name}</h3>
        <span class= "count">Count: ${count}</span>
        <span class="price">Price: ${p.price*count} $</span>
        <button class="remove-btn">Remove</button>`
        items.appendChild(productDiv)
        sum += p.price*count
        const total = document.getElementById('price')
        total.innerText = sum + " $"
        console.log(total)
      })
  
  
})


const clearCartBtn = document.querySelector('.clear-cart-btn');

clearCartBtn.addEventListener('click', function() {
  clearCart();
});

function clearCart() {
  setCookie('cart', JSON.stringify([]));
  window.location.reload()
}

const CheckoutBtn = document.querySelector('.checkout-btn');

CheckoutBtn.addEventListener('click', function() {
  Checkout();
  
});


function Checkout() {
  const buyer = document.getElementById("user").value
  const details = getCart()
  const data = {buyer,details}
  
fetch('http://localhost:3000/addOrder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => console.log(data));
  
  window.location.href = window.location.href.split('cart.html')[0] + 'index.html';

  CheckoutBtn.disabled = true;
  CheckoutBtn.style.backgroundColor = '#ccc';
  CheckoutBtn.style.cursor = 'default';
  setTimeout(function() {
    CheckoutBtn.disabled = false;
    CheckoutBtn.style.backgroundColor = '#007bff';
    CheckoutBtn.style.cursor = 'pointer';
  }, 3000);
}


