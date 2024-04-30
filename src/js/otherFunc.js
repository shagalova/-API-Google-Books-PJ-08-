export function getCartLocalStorage() {
    const cartDataJSON = localStorage.getItem("cart");
    return cartDataJSON ? JSON.parse(cartDataJSON) : [];
    
}

export function getBooksLocalStorage() {
    const DataJSON = localStorage.getItem("books");
    return DataJSON ? JSON.parse(DataJSON) : [];
}

export function setBooksLocalStorage(arr) {
    let savedArr = getBooksLocalStorage();
    
    if(savedArr.length === 0) {
        localStorage.setItem("books", JSON.stringify(arr))

    } else {

      arr.forEach(item => {
        const double = savedArr.find( (el) => el.id===item.id);
            if (double) {
                return
            } else {
                savedArr.push(item);
            }
        localStorage.setItem("books", JSON.stringify(savedArr));
      })
    }
}


export function setCartLocalStorage(arr) {
    let cart = [];
    const cartNum = document.querySelector(".header__icons__cart__num");
    localStorage.setItem("cart", JSON.stringify(arr));
    cartNum.textContent = arr.length;
}