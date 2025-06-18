import { getStorage, setStorage } from "./modules/storage.js";
import { priceСhange } from './modules/numbers.js'

const checkbox = document.querySelector('.main-section__form-checkbox');
const checkInput = document.querySelector('.input-checkbox');
const form = document.querySelector('.main-section__form');

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

form.addEventListener('submit', (event) =>{
    event.preventDefault()
    const obj = 
    {
        name: form.name.value,
        category: form.category.value,
        uof: form.uof.value,
        discountNumb: form.discountNumb.value || 0,
        description: form.description.value,
        count: form.count.value,
        price: form.price.value,
        img: form['img-input'].value,
        totalPrice: (form.price.value - (form.price.value * (form.discountNumb.value / 100))) * form.count.value,
    }
    setStorage(obj)
    form.reset()
})

