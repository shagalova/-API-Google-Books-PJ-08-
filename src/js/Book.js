 

import { getBooksLocalStorage, setBooksLocalStorage } from "./otherFunc.js";
import { checkActiveButtons } from "./cart.js";


const apiKey = "AIzaSyCCTTDDIA16TuouhGsfn-ANBuUPUgiM-Ck";
const url = "https://www.googleapis.com/books/v1";

const output = document.querySelector(".output");
const moreBtn = document.querySelector(".loadMore");

let categories = [];
let loadedBooks =[];
let startIndex = 0;
let targetCategory; 
let maxResult = 6;
let nextIndex = maxResult;
let countClickMoreBtn = 1;

// выбираем категорию
const chooseCategory = function () {
    const categoryDiv = document.querySelectorAll(".category__item");
    categoryDiv.forEach((item,index) => {
    
        let category = `${item.textContent}`
        item.dataset.number = `n${index}`;
        categories.push(category);
        
    });
    localStorage.setItem("targetCategory", categories[0]);
    const categoryList = document.querySelector(".category");

    categoryList.addEventListener("click", (e, cart) => {
        e.stopPropagation();
        
        const li = e.target;
        if(li.nodeName !== "LI") return;
        document.getElementsByClassName("activeItem")[0].classList.remove("activeItem");
        li.classList.add("activeItem");
        targetCategory = categoryList.querySelector(".activeItem").textContent;
        clearResultOutput();
        clearArr(loadedBooks);
        localStorage.setItem("targetCategory", targetCategory);
        countClickMoreBtn = 1;
        loadBooksByCategories(targetCategory);
        checkActiveButtons(cart);

     return targetCategory;

})
}

chooseCategory();

//запрос API
const getBooks = async(ind,targetCategory=categories[0]) => {

    try {
        targetCategory = localStorage.getItem("targetCategory");

        const res = await fetch (`${url}/volumes?q="subject:${targetCategory}&printType=books&langRestrict=en&startIndex=${ind}&maxResults=${maxResult}&key=${apiKey}`)
            
        if(!res.ok) {
            throw new Error(res.statusText)
           }
        const data = await res.json();
        
        data.items.forEach(item => {

            const book = {
                category: targetCategory,
                id: item.id,
                img: item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail || "./img/img/no_cover_thumb.png",
                title: item.volumeInfo.title,
                author: item.volumeInfo.authors || "No authors",
                rating: item.volumeInfo.averageRating || 0,
                review: item.volumeInfo.ratingsCount || 0,
                summary: item.volumeInfo.description || item.volumeInfo.title, 
                saleability: item.saleInfo.saleability, 
                price: item.saleInfo.retailPrice && item.saleInfo.retailPrice.amount,
                currency: item.saleInfo.retailPrice && item.saleInfo.retailPrice.currencyCode,
            }
            printBooks(book);
            loadedBooks.push(book);
            setRatingActiveWidth(book);
            
        })

        setBooksLocalStorage(loadedBooks);
        

    } catch (err) {
        console.log(err);
    }
    
}
 
   

// проверка в LS есть ли книги категории 

    function checkSavedBooksByCategory(targetCategory) {

        const savedBooks = getBooksLocalStorage()
        targetCategory = localStorage.getItem("targetCategory")
        const result = savedBooks.filter((item) => item.category === targetCategory);
    
        return result;
    }
    

//загрузка книг по категориям в зависимости от наличия в LS
    function loadBooksByCategories(targetCategory,cart) {
            
        nextIndex = output.children.length;
        let savedBooksByCategory = checkSavedBooksByCategory(targetCategory);
        
        if(savedBooksByCategory.length === 0) {
            getBooks(startIndex,targetCategory);

        } else {
            loadBooksFromLocalStorage(targetCategory,cart);
            checkActiveButtons(cart);
        }
        
    }

    loadBooksByCategories(targetCategory)
     
//отрисовка карточки
function printBooks(book) {
    
        const {id, img, author, title, rating, review, summary, saleability, price, currency} = book;

        const coverPart =   
            `<img src=${img} alt="${img}"/>`;
            
        const headerPart =
            `<div class="card__text-author">${author}</div>
            <div class="card__text-title">${title}</div>`;
        
        const ratingPart = rating > 0 
        ? `<div class="rating__icons">
            <div class="rating__active"></div>
        </div>`
        : "";

    const reviewPart = rating > 0
        ? `<div class="rating__text">${review} review</div>`
        : "";

    const summaryPart =  
        `<div class="card__text-summary"><p>${summary}</p></div>`;

    const salePart = 
        saleability == "FOR_SALE" 
        ? `<div class="card__text-price"> ${price} ${currency}</div>`
        : "";

    const bookTemplate = `
        <div class="output__card" data-id="${id}">
            <div class="card__cover">
                ${coverPart}
            </div>
            <div class="card__text">
                ${headerPart}
                <div class="card__text-rating">
                    ${ratingPart}
                    ${reviewPart}
                </div>
                ${summaryPart}
                ${salePart}
                <button class="card__text-btn">buy now</div>
            </div>`;

    output.insertAdjacentHTML("beforeend", bookTemplate);
    
}

//отрисовка рейтинга
    function setRatingActiveWidth(book) {
       
        let ratingActive = output.querySelectorAll(".rating__active");
        
        for(let i=0; i<ratingActive.length; i++) {
            let index = book.rating;

            if(index > 0) {
            const ratingActiveWidth = index / 0.05;
            ratingActive[i].style.width = ratingActiveWidth + '%';
            } else if (index = 0){
                ratingActive[i].parentElement.parentElement.style.visibility = "hidden";
                ratingActive[i].parentElement.style.visibility = "hidden";
                ratingActive[i].nextSibling.style.display = "none";
            }
}
             
        }
           
         
//загрузка из LS    
    function loadBooksFromLocalStorage(targetCategory,cart) {
       
        const countShownCards = maxResult * countClickMoreBtn;
        let booksInCategory = checkSavedBooksByCategory(targetCategory);

        const arrCards = booksInCategory.slice(nextIndex, countShownCards);
        
        if(arrCards.length < maxResult) {
            getBooks(nextIndex,targetCategory);
        } else {
            arrCards.forEach(card => {
            printBooks(card);
            setRatingActiveWidth(card);
            checkActiveButtons(cart);
        })
        }
       
    }
    
//"ленивая" загрузка
moreBtn.addEventListener("click", loadMore);

function loadMore(e, targetCategory, cart) {
   
    e.preventDefault();
    countClickMoreBtn++;

    loadBooksByCategories(targetCategory);
        
    nextIndex += maxResult;

    checkActiveButtons(cart);
       
    }
    

function clearResultOutput() {
     output.innerHTML = "";
    
}

function clearArr(arr) {
    arr.splice(0,arr.length);
}
