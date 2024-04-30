function initSlider() {
  const slider = document.querySelector('.slider');

  const images = slider.querySelectorAll('img');
  const sliderImages = document.querySelector('.slider__images');


  const sliderDots = slider.querySelector(".slider__dots");

  if (!images || !images.length) return;


  initImages();
  initDots();
  initAutoplay();

  function initImages() {
     
      images.forEach( (item, index) => {
       
          item.setAttribute("data-index", index);
          item.classList.add(`n${index}`);

          if (item.dataset.index == '0') {
              item.classList.add("active");
          }

          if (!item.classList.contains("active")) {
              item.style.display = "none";
          }
              else {
                  item.style.display = "inline";
              }
          
      });
      
  }


  function initDots() {
      images.forEach((image, index) => {
        let dot = `<div class="slider__dots-item n${index} ${index === 0? "active" : ""}" data-index="${index}"></div>`;
        sliderDots.innerHTML += dot;
        
      });
    
      sliderDots.querySelectorAll(".slider__dots-item").forEach(dot => {
        dot.addEventListener("click", function() {
          moveSlider(this.dataset.index);
        })
      })
    }

    function moveSlider(num) {
      sliderImages.querySelector(".active").classList.remove("active");
      sliderImages.querySelector(".n" + num).classList.add("active");

      images.forEach(item => {
          if (!item.classList.contains("active")) {
          item.style.display = "none";
      }
          else {
              item.style.display = "inline";
          }
      })
    
        sliderDots.querySelector(".active").classList.remove("active");
        sliderDots.querySelector(".n" + num).classList.add("active");
      
      
    }
    

    function initAutoplay() {
      setInterval(() => {
        let curNumber = +sliderImages.querySelector(".active").dataset.index;
        let nextNumber = curNumber === images.length - 1? 0 : curNumber + 1;
        moveSlider(nextNumber);
      }, 5000);
    }

      
}

document.addEventListener("DOMContentLoaded", initSlider);
