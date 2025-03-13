import { getStorage, removeStorage } from "./modules/storage.js"

const tbodyElement = document.querySelector('tbody')
const totalPriceElement = document.querySelector('.header__total-price')

getStorage().forEach((element, index) => {
    tbodyElement.insertAdjacentHTML('beforeend', 
        `
        <tr class="table__row">
                <td class="table__text" data-js-index>${index + 1}</td>
                <td class="table__text">${element.name}</td>
                <td class="table__text">${element.category}</td>
                <td class="table__text--center">${element.uof}</td>
                <td class="table__text--center">${element.count}</td>
                <td class="table__text--center">$${element.price}</td>
                <td class="table__text--right">$${element.totalPrice}</td>
                <td class="table__icons-box">
                    <a href="./index2.html">
                        <img data-js-edit src="./icons/${element.img ? 'picture.svg' : 'no-image.svg'}" class="table__icon" alt="${element.img ? 'Есть изображение' : 'Нету изображения'}"></a>
                    <a href="./index2.html">
                        <img data-js-edit src="./icons/edit.svg" class="table__icon" alt="Изменить товар">
                    </a>
                        <img src="./icons/delete.svg" class="table__icon" alt="Удалить товар" data-js-delet>
                </td>
            </tr>
        `)
});

const changeTotalPrice = () =>{
    totalPriceElement.textContent = '$' + getStorage().
    reduce((acumm, numb) => {
        if(numb) return acumm + numb.totalPrice
        else return acumm
    },
        0)
}

changeTotalPrice()

tbodyElement.addEventListener('click', e =>{
    e.preventDefault()
    if(e.target.hasAttribute('data-js-delet')){
        const trElement = e.target.closest('tr')
        const index = parseInt(trElement.querySelector('[data-js-index]').textContent) - 1
        trElement.remove()
        removeStorage(index)
        changeTotalPrice()
    }
    else if(e.target.hasAttribute('data-js-edit')){
        const trElement = e.target.closest('tr')
        const index = parseInt(trElement.querySelector('[data-js-index]').textContent) - 1
        sessionStorage.setItem('index', index)
        window.location.replace(e.target.closest('a').href)
    }
})

