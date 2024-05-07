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

cart.forEach(({productId, count})=>{
  const productDiv = document.createElement('div');
  productDiv.innerHTML = 
    `<h3>Product 1</h3>
    <span class= "count">${count}</span>
    <span class="price">$19.99</span>
    <button class="remove-btn">Remove</button>`
  items.appendChild(productDiv)
})

const clearCartBtn = document.querySelector('.clear-cart-btn');

clearCartBtn.addEventListener('click', function() {
  clearCart();
});

function clearCart() {
  setCookie('cart', JSON.stringify([]));
  window.location.reload()
}

