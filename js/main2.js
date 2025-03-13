import { getStorage, setStorage, editStorage, getIndex} from "./modules/storage.js";


const checkbox = document.querySelector('.main-section__form-checkbox');
const checkinut = document.querySelector('.input-checkbox');
const priceElement = document.querySelector('[data-js-price]')
const form = document.querySelector('.main-section__form')
const headerIdElement = document.querySelector('.header__id')


const priceСhange = () =>{
    priceElement.textContent = `$ ${numeral((form.price.value - (form.price.value * (form.discountNumb.value / 100))) * form.count.value).format('0.00')}`
}

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
    element.addEventListener('change', enforceMinMax)
    element.addEventListener('change', priceСhange)
})

checkbox.addEventListener('change', (event) => {
    checkinut.disabled ^= true;
    checkinut.required ^= true;
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
    editStorage(obj)
    form.reset()
    window.location.replace('./index3.html')
})

const addValue = () =>{
    const data = getStorage()[getIndex()]
    const {
        name,
        category,
        uof,
        discountNumb,
        description,
        count,
        price,
    } = data
    form.name.value = name
    form.category.value = category
    form.uof.value = uof
    if(discountNumb){
        checkinut.disabled ^= true;
        checkinut.required ^= true;
        form.discount.checked = true
        form.discountNumb.value = discountNumb
    }
    form.description.value = description
    form.count.value = count
    form.price.value = price
    priceСhange()
    headerIdElement.textContent = `id: ${parseInt(getIndex()) + 1}`
}

addValue()