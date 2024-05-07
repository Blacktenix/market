const orderList = document.getElementById('orders')
const categoriesList = document.getElementById('productCategories')
const categoriesUpdateList = document.getElementById('productCategoriesUpdate')
const productName = document.getElementById('productNameUpdate')
const productPrice = document.getElementById('productPriceUpdate')
const productAvailability = document.getElementById('productAvailabilityUpdate')
const sum = document.getElementById('sum')
const groupBy = document.getElementById('groupBy')
const max = document.getElementById('max')
const min = document.getElementById('min')


fetch('http://localhost:3000/orders')
    .then(response => response.json())
    .then(orders => {
        // Clear existing content
        orderList.innerHTML = '';

        // Loop through users and create HTML elements
        orders.forEach(order => {
            const products = order.product.split(',')
            const counts = order.count.split(',')
            let productTable = "<table>";
            for (let i = 0; i < products.length; i++) {
            productTable += `<tr><td>${products[i]}</td><tr>`;
            }
            productTable += "</table>";

            let countTable = "<table>";
            for (let i = 0; i < counts.length; i++) {
            countTable += `<tr><td>${counts[i]}</td><tr>`;
            }
            countTable += "</table>";
    
            const orderTr = document.createElement('tr');
            orderTr.innerHTML = `
            <td>${order.orderID}</td>
            <td>${order.buyer}</td>
            <td class="td">${productTable}</td>
            <td class="td">${countTable}</td>
            <td>${order.order_date}</td>
              `;
              orderList.appendChild(orderTr);
        });
    })
    .catch(error => {
        console.error('Error fetching order data:', error);
    });


fetch('http://localhost:3000/categories')
    .then(response => response.json())
    .then(categories => {
        // Clear existing content
        categoriesList.innerHTML = '';

        // Loop through users and create HTML elements
        categories.forEach(category => {
            const categoryOption = document.createElement('option');
            categoryOption.innerHTML = `
            ${category.categoryID} ${category.category}
              `;
            categoryOption.value = category.categoryID
            categoriesList.appendChild(categoryOption);
            
        });
    })
    .catch(error => {
        console.error('Error fetching order data:', error);
    });


fetch('http://localhost:3000/categories')
    .then(response => response.json())
    .then(categories => {
        // Clear existing content
        categoriesUpdateList.innerHTML = '';

        // Loop through users and create HTML elements
        categories.forEach(category => {
            const categoryOption = document.createElement('option');
            categoryOption.innerHTML = `
            ${category.categoryID} ${category.category}
              `;
            categoryOption.value = category.categoryID
            categoriesUpdateList.appendChild(categoryOption);
            
        });
    })
    .catch(error => {
        console.error('Error fetching order data:', error);
    });

function productLoad(){
    const productId = document.getElementById('productIdUpdate').value
    fetch('http://localhost:3000/product/' + productId)
    .then(response => response.json())
    .then(product => {
        productName.value = product[0].name
        productPrice.value = product[0].price
        productAvailability.value = product[0].availability
        categoriesUpdateList.value = product[0].category
    })
}

fetch('http://localhost:3000/productSum')
    .then(response => response.json())
    .then(productSum => {
        // Clear existing content
        sum.innerHTML = '';

        // Loop through users and create HTML elements
        productSum.forEach(product => {
            const sumSpan = document.createElement('span');
            sumSpan.innerHTML = `
            ${product.sum} $
              `;
            sum.appendChild(sumSpan);
            
        });
    })

fetch('http://localhost:3000/categoryGroup')
    .then(response => response.json())
    .then(categories => {
        // Clear existing content
        groupBy.innerHTML = '';

        // Loop through users and create HTML elements
        categories.forEach(category => {
            const groupByLi = document.createElement('li');
            groupByLi.innerHTML = `
            ${category.category} - ${category.sum} $
              `;
            groupBy.appendChild(groupByLi);
            
        });
    })
    .catch(error => {
        console.error('Error fetching order data:', error);
    });



fetch('http://localhost:3000/productMax')
    .then(response => response.json())
    .then(productMax => {
        // Clear existing content
        max.innerHTML = '';

        // Loop through users and create HTML elements
        productMax.forEach(product => {
            const maxSpan = document.createElement('span');
            maxSpan.innerHTML = `
            ${product.name} 
              `;
            max.appendChild(maxSpan);
            
        });
    })

fetch('http://localhost:3000/productMin')
    .then(response => response.json())
    .then(productMin => {
        // Clear existing content
        min.innerHTML = '';

        // Loop through users and create HTML elements
        productMin.forEach(product => {
            const minSpan = document.createElement('span');
            minSpan.innerHTML = `
            ${product.name} 
              `;
            min.appendChild(minSpan);
            
        });
    })
    .catch(error => {
        console.error('Error fetching order data:', error);
    });


