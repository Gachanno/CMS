import { fetchRequest } from "./modules/api.js"; 
import { priceСhange } from './modules/numbers.js'


const form = document.querySelector('.main-section__form');
const headerIdElement = document.querySelector('.header__id');
const url = 'https://dandy-chrome-house.glitch.me/api/goods';
let params = new URLSearchParams(document.location.search);


const checkbox = document.querySelector('.main-section__form-checkbox');
const checkInput = document.querySelector('.input-checkbox');

const enforceMinMax = (el) => {
    if (el.target.value != "") {
        if (parseInt(el.target.value) < parseInt(el.target.min)) {
            el.target.value = el.target.min;
        }
        if (parseInt(el.target.value) > parseInt(el.target.max)) {
            el.target.value = el.target.max;
        }
    }
}

[
    form.discountNumb,
    form.price,
    form.count
].forEach((element) =>{
    element.addEventListener('change', enforceMinMax, {element})
    element.addEventListener('change', priceСhange)
})

checkbox.addEventListener('change', (event) => {
    checkInput.disabled ^= true;
    checkInput.required ^= true;
    form.discountNumb.value = '';
    priceСhange()
}, false);

form['img-input'].addEventListener('change', (input) => {
    const errorText = document.querySelector('.main-section__error-img');
    if(input.target.files[0].size > 1024 * 1024) {
        errorText.style.display = 'block';
        input.target.value = '';
    }
    else errorText.removeAttribute("style");
})

document.querySelector('input[type="file"]').onchange = event => {
    if(!event.target.value){
        return
    }
    let reader = new FileReader();
    const imgBlock = document.querySelector('img');
    reader.onload = e => imgBlock.src = e.target.result;
    reader.readAsDataURL(event.target.files[0]);
    imgBlock.style.display = "block";
};

const img = document.querySelector('.main-section__img');
img.addEventListener('click', (event) => {
    img.removeAttribute("src");
    img.removeAttribute("style");
})

const loadProductData = async () => {
    const itemId = params.get('id');
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