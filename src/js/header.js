function chooseMenuItem() {
    const menu = document.querySelectorAll(".header__menu ul");
    menu.forEach(item => {
    
        item.addEventListener("click", (e) => {
            e.stopPropagation();
            
            const target = e.target;
            console.log(target.nodeName)
            if(target.nodeName !== "A") return;
            document.getElementsByClassName("activeText")[0].classList.remove("activeText");
            const parentLi = target.closest("li");
            console.log(parentLi)
            parentLi.classList.add("activeText");
            
        })

    })
}
chooseMenuItem();