const tabs = document.querySelectorAll('.tab');
const productsContainer = document.querySelector('.products');
let productsData = []; // To store the fetched products data

async function fetchProducts() {
    try {
        const response = await fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json');
        const data = await response.json();
        if (!Array.isArray(data.categories)) {
            console.error('Error: Data is not in the expected format', data);
            return;
        }
        productsData = data.categories.flatMap(category => category.category_products);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


function renderProducts(category) {
    if (!Array.isArray(productsData)) {
        console.error('Error: productsData is not an array', productsData);
        return;
    }

    let filteredProducts;
    if (category === 'men') {
        filteredProducts = productsData.filter(product => product.id !== '1w' && product.id !== '2w' && product.id !== '3w' && product.id !== '4w' && product.id !== '1k' && product.id !== '2k' && product.id !== '3k' && product.id !== '4k');
    } else if (category === 'women') {
        filteredProducts = productsData.filter(product => product.id === '1w' || product.id === '2w' || product.id === '3w' || product.id === '4w');
    } else if (category === 'kids') {
        filteredProducts = productsData.filter(product => product.id === '1k' || product.id === '2k' || product.id === '3k' || product.id === '4k');
    } else {
        console.error('Error: Invalid category', category);
        return;
    }

    productsContainer.innerHTML = '';
    filteredProducts.forEach(product => {
        const discount = ((product.compare_at_price - product.price) / product.compare_at_price) * 100;
        const productCard = `
  <div class="product-card">
  ${product.badge_text ? `<div class="badge">${product.badge_text}</div>` : ''}
    <img src="${product.image}" alt="${product.title}">
    <div class="row1">
    <div class="title">${product.title}</div>
    <div class="vendor">
      <span class="dot"></span> ${product.vendor}
    </div>
    </div>
    <div class="row2">
    <div class="price">Rs ${product.price}</div>
    <div class="compare-price">${product.compare_at_price}</div>
    <div class="discount">${discount.toFixed(0)}% Off</div>
    </div>
    <button>Add to cart</button>
  </div>
`;



        productsContainer.innerHTML += productCard;
    });
}




tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const category = tab.getAttribute('data-category');
        renderProducts(category);
        tabs.forEach(t => {
            t.classList.remove('active');
            t.querySelector('.category-icon').style.display = 'none';
        });
        tab.classList.add('active');
        tab.querySelector('.category-icon').style.display = 'inline-block';
    });
});

// Initial load
fetchProducts().then(() => {
    renderProducts('men'); // Default to 'men' category
    tabs[0].classList.add('active'); // Activate the 'men' tab
});