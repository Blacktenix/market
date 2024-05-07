// Получение ID заказа из URL
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');

// Запрос на сервер для получения данных о заказе по его ID
fetch(`/getOrderDetails?orderId=${orderId}`)
  .then(response => response.json())
  .then(data => {
    // Обработка полученных данных и отображение на странице
    displayOrderDetails(data);
  })
  .catch(error => {
    console.error('Error fetching order details:', error);
  });

// Функция для отображения данных о заказе на странице
function displayOrderDetails(order) {
  const container = document.getElementById('order-details-container');
  container.innerHTML = `
    <p><strong>Order ID:</strong> ${order.orderID}</p>
    <p><strong>Product:</strong> ${order.product}</p>
    <p><strong>Quantity:</strong> ${order.quantity}</p>
    <p><strong>Total:</strong> ${order.total}</p>
    <p><strong>Status:</strong> ${order.status}</p>
  `;
}
