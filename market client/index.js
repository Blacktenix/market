const productl = document.getElementById('products');

fetch('http://localhost:3000/products')
    .then(response => response.json())
    .then(products => {
        // Clear existing content
        productl.innerHTML = '';

        // Loop through users and create HTML elements
        products.forEach(product => {
            const productDiv = document.createElement('div');
            const button = document.createElement('button')
            const input = document.createElement('input')
            input.type = 'number'
            input.min = 1
            input.value = 1
            input.addEventListener('change',()=>{
                if (input.value == 0){
                input.value = 1
            }
            })
            const div = document.createElement('div')
            div.appendChild(button)
            button.innerText = "Add to Cart"
            div.appendChild(input)
            button.addEventListener("click",() =>{
                addProductToCart(product.productID, +input.value)
                window.location.reload()
            })
            productDiv.innerHTML = `
                <h3>${product.name}</h3>
                <p class="availability">${product.availability}</p>
                <span class="price">${product.price} $</span>
                <h5>${product.category}</h5>
              `;
              productDiv.classList.add("product");
              productDiv.appendChild(div)
              productl.appendChild(productDiv);
        });
    })
    .catch(error => {
        console.error('Error fetching product data:', error);
    });

function getCart() {
    const cart = getCookie("cart")
    if (cart == ""){
        return []
    }
    else{
        return JSON.parse(cart)
    }
}

function addProductToCart(product, count) {
    const cart = getCart();
    const p = {product,count}
    cart.push(p)
    setCookie("cart",JSON.stringify(cart),2)

}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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


console.log(getCart())