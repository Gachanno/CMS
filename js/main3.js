import { getStorage, removeStorage } from "./modules/storage.js"

const url = 'https://dandy-chrome-house.glitch.me/api/goods';
const tbodyElement = document.querySelector('tbody');
const totalPriceElement = document.querySelector('.header__total-price');

const fetchRequest = async (url, { method = 'GET', callback, body, headers } = {}) => {
    try {
        const options = { method };
        if (body) options.body = JSON.stringify(body);
        if (headers) options.headers = headers;

        const response = await fetch(url, options);
        if (!response.ok) throw new Error(response.status);

        const data = await response.json();
        if (callback) callback(null, data);
        return data;
    } catch (err) {
        if (callback) callback(err);
        throw err;
    }
};

const renderTable = (err, data) => {
    if (err) {
        console.error('Ошибка загрузки данных:', err);
        return;
    }

    tbodyElement.innerHTML = '';
    data.goods.forEach((item, index) => {
        const rowHTML = `
        <tr class="table__row">
            <td class="table__text" data-js-index>${item.id}</td>
            <td class="table__text">${item.title}</td>
            <td class="table__text">${item.category || 'N/A'}</td>
            <td class="table__text--center">${item.units || 'шт.'}</td>
            <td class="table__text--center">${item.count || 1}</td>
            <td class="table__text--center">$${item.price}</td>
            <td class="table__text--right">$${(item.price * (item.count || 1)).toFixed(2)}</td>
            <td class="table__icons-box">
                ${item.image ? 
                    `<a href="${item.image}" target="_blank">
                        <img data-js-photo src="./icons/picture.svg" class="table__icon" alt="Просмотр изображения">
                    </a>` : 
                    `<span class="table__icon-wrapper">
                        <img src="./icons/no-image.svg" class="table__icon" alt="Нет изображения">
                    </span>`
                }
                <a href="./index2.html">
                    <img data-js-edit src="./icons/edit.svg" class="table__icon" alt="Изменить товар">
                </a>
                <img src="./icons/delete.svg" class="table__icon" alt="Удалить товар" data-js-delete>
            </td>
        </tr>`;
        tbodyElement.insertAdjacentHTML('beforeend', rowHTML);
    });

    updateTotalPrice(data.goods);
};

const updateTotalPrice = (goods) => {
    const total = goods.reduce((acc, item) => 
        acc + (item.price * (item.count || 1)), 0);
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
};

tbodyElement.addEventListener('click', async (e) => {
    e.preventDefault();
    const row = e.target.closest('tr');
    const index = Array.from(tbodyElement.children).indexOf(row);
    
    if (e.target.matches('[data-js-delete]')) {
        try {
            const items = await fetchRequest(url);
            const itemId = items.goods[index].id;
            
            await fetchRequest(`${url}/${itemId}`, { 
                method: 'DELETE' 
            });
            
            row.remove();
            const updatedData = await fetchRequest(url);
            updateTotalPrice(updatedData.goods);
        } catch (err) {
            console.error('Ошибка удаления:', err);
        }
    }
    else if (e.target.matches('[data-js-edit]')) {
        const items = await fetchRequest(url);
        const itemId = items.goods[index].id;
        window.location.href = `./index2.html?id=${itemId}`;
    }
});


document.addEventListener('DOMContentLoaded', () => {
    fetchRequest(url, { 
        method: 'GET',
        callback: renderTable,
        headers: { 'Content-Type': 'application/json' }
    });
});


