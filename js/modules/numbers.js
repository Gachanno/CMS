const priceСhange = () =>{
    const priceElement = document.querySelector('[data-js-price]');
    const form = document.querySelector('.main-section__form');
    priceElement.textContent = `$ ${numeral((form.price.value - (form.price.value * (form.discountNumb.value / 100))) * form.count.value).format('0.00')}`
}

export { priceСhange }