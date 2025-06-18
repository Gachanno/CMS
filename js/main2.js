import { fetchRequest } from "./modules/api.js"; 
import { priceСhange } from './modules/numbers.js'


const form = document.querySelector('.main-section__form');
const headerIdElement = document.querySelector('.header__id');
const url = 'https://courageous-elfin-vulcanodon.glitch.me/api/goods';
let params = new URLSearchParams(document.location.search);


const loadProductData = async () => {
    const itemId = params.get('id');
    console.log(itemId);
    if (!itemId) {
        window.location.href = './index.html';
        return;
    }

    try {
        const response = await fetchRequest(`${url}/${itemId}`, {
            method: 'GET'
        });
        
        fillForm(response);
        headerIdElement.textContent = `id: ${itemId}`;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
};

const fillForm = (product) => {
    form.name.value = product.title || '';
    form.category.value = product.category || '';
    form.uof.value = product.units || '';
    form.description.value = product.description || '';
    form.count.value = product.count || 1;
    form.price.value = product.price || 0;
    
    if (product.discount) {
        form.discount.checked = true;
        form.discountNumb.disabled = false;
        form.discountNumb.value = product.discount;
    }
    
    if (product.image) {
        const imgBlock = document.querySelector('.main-section__img');
        imgBlock.src = product.image;
        imgBlock.style.display = "block";
    }

    priceСhange();
};

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const itemId = params.get('id');
    const formData = new FormData(form);
    
    const updatedProduct = {
        title: formData.get('name'),
        category: formData.get('category'),
        units: formData.get('uof'),
        description: formData.get('description'),
        count: Number(formData.get('count')),
        price: Number(formData.get('price')),
        discount: Number(formData.get('discountNumb')) || 0,
        image: formData.get('img-input') || null
    };
    console.log(updatedProduct);

    try {
        await fetchRequest(`${url}/${itemId}`, {
            method: 'PUT',
            body: updatedProduct,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        window.location.href = './index3.html';
    } catch (error) {
        console.error('Ошибка обновления:', error);
        alert('Не удалось обновить товар');
    }
});





document.addEventListener('DOMContentLoaded', loadProductData);