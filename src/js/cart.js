import { setCartLocalStorage,getCartLocalStorage } from "./otherFunc.js";

let cart = [];
cart = getCartLocalStorage(cart);
let targetCategory;

//добавление в корзину
function addToCart() {
 
    const output = document.querySelector(".output");
    const cartNum = document.querySelector(".header__icons__cart__num");
    
    output.addEventListener("click", function(e) {
           
        e.stopPropagation();        
        const cartBtn = e.target;

        if(!cartBtn.classList.contains("card__text-btn")) return;
        else {
            const card = cartBtn.closest(".output__card");
            const id = card.dataset.id;

            if (!cartBtn.classList.contains("in-the-cart")) { 
            
                cartBtn.classList.add("in-the-cart");
                cartNum.classList.remove("invisible");
                cartBtn.textContent = "in the cart";

                cart.push(id);
                setCartLocalStorage(cart);
            
            } else {
                
                cartBtn.classList.remove("in-the-cart");
                cartBtn.textContent= "buy now";
                
                removeIdFromLocalStorage(cart,id);
                
                if (cartNum.textContent === "0") {
                    cartNum.classList.add("invisible");
                    
            }
        }
    } 
       
    })
   
}
addToCart();

//отслеживание книг в корзине
export function checkActiveButtons(cart) {
   
    cart = getCartLocalStorage(cart);
    
    if(!cart.length) {
        return
    } else {
        
        let buttons = document.querySelectorAll(".card__text-btn");
        const cartNum = document.querySelector(".header__icons__cart__num");

        cartNum.classList.remove("invisible");
        cartNum.textContent = cart.length;

        buttons.forEach(btn => {
            const card = btn.closest(".output__card");
            const id = card.dataset.id;
            const isInCart = cart.includes(id);
            btn.classList.toggle("in-the-cart", isInCart);
            btn.textContent = isInCart ? "in the cart" : "buy now";

        })
    }
}

//удаление из корзины
function removeIdFromLocalStorage(cart,id) {
        
    let index = cart.indexOf(id)
        if (index !== -1) {
            cart.splice(index, 1);
            setCartLocalStorage(cart);
        }
}
  