const getStorage = () =>{
    const data = localStorage.getItem('data')
    return JSON.parse(data) || []
}

const getIndex = () =>{
    return sessionStorage.getItem('index') || NaN
}

const setStorage = (obj) =>{
    const data = getStorage()
    data.push(obj)
    localStorage.setItem('data', JSON.stringify(data, null, 1))
}

const editStorage = (obj) =>{
    const data = getStorage()
    data[getIndex()] = obj
    localStorage.setItem('data', JSON.stringify(data, null, 1))
}

const removeStorage = (index) =>{
    const data = getStorage()
    delete data[index]
    localStorage.setItem('data', JSON.stringify(data, null, 1))
}  

if(!localStorage.getItem('data')){
    localStorage.setItem('data', JSON.stringify([], null, 1))
}
else{
    const data = getStorage()
    while(data.includes(null)){
        data.forEach((e, i) =>{
            if(!e) data.splice(i, 1)
        })}
    localStorage.setItem('data', JSON.stringify(data, null, 1))
}

export {getStorage, setStorage, removeStorage, editStorage, getIndex}