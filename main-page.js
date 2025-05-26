(() => {
  const init =async  () => {
    if (!window.location.href.includes('e-bebek.com') || window.location.pathname !== '/') {
      console.log('wrong page');
      return;
    }
    const productData = await getProductData();
    buildHTML(productData);
    buildCSS();
    setEvents();
  };
  
  const getProductData = async () => {
  const localData = localStorage.getItem("ProductsData");
  if (localData) {
    return JSON.parse(localData);
  }

  try {
    const response = await fetch("https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json");
    const data = await response.json();
    localStorage.setItem("ProductsData", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Ürünler alınamadı:", error);
    return [];
  }
};
 
  let slideIndex = 0;


  const buildHTML = (products) => {
    const title = document.createElement("h2");
    title.innerText = "Beğenebileceğinizi düşündüklerimiz";
    title.className = "title-primary";

    const container = document.createElement("div");
    container.className = "banner__titles";
    container.appendChild(title);

    const productWrapper = document.createElement("div");
    productWrapper.className = "custom-product-wrapper"; 
    productWrapper.innerHTML = buildProducts(products); 

    container.appendChild(productWrapper);

    const wrapper = document.createElement("div");
    wrapper.className = "custom-banner__wrapper";

    const prevBtn = document.createElement("button");
    prevBtn.className = "swiper-prev";
    prevBtn.setAttribute("aria-label", "Geri");

    const nextBtn = document.createElement("button");
    nextBtn.className = "swiper-next";
    nextBtn.setAttribute("aria-label", "İleri");

    //anasayfada ilk olarak 5 ürün göster kaydırınca 1 ürün getir
    prevBtn.addEventListener("click", () => {
    if (slideIndex > 0) {
      slideIndex--;
      updateVisibleSlides(productWrapper, slideIndex);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (slideIndex < products.length - 5) {
      slideIndex++;
      updateVisibleSlides(productWrapper, slideIndex);
    }
  });

    wrapper.appendChild(prevBtn);
    wrapper.appendChild(productWrapper);
    wrapper.appendChild(nextBtn);
    container.appendChild(wrapper);
    updateVisibleSlides(productWrapper, slideIndex);

    const target = document.querySelector(".hero.banner");
    if (target) {
      target.parentNode.insertBefore(container, target.nextSibling);
    }
  };

 const buildProducts = (products) => {
  return products.map(product => {
    
    const hasDiscount = product.price < product.original_price;
    const discountPercent = hasDiscount
      ? Math.round(100 - (product.price / product.original_price) * 100)
      : 0;
    
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const isFavorite = favorites.includes(product.url);

    return `
      <div class="custom-product-item">
        <a class="custom-product-item__img" href="${product.url}" target="_blank">
          <div class="heart" data-url="${product.url}">
        ${
          isFavorite
            ? `<img src="https://www.e-bebek.com/assets/svg/added-favorite.svg" alt="heart fill" class="heart-icon">`
            : `
              <img id="default-favorite" src="https://www.e-bebek.com/assets/svg/default-favorite.svg" alt="heart" class="heart-icon">
              <img src="https://www.e-bebek.com/assets/svg/default-hover-favorite.svg" alt="heart" class="heart-icon hovered">
          `
  }
      </div>

        <img src="${product.img}" alt="${product.name}" />
        </a>
        <div class="custom-product-item-content">
          <h2 class="custom-product-item__brand">
            <b>${product.brand} - </b><span>${product.name}</span>
          </h2>
          <div class="stars-wrapper">
          <i class="fa fa-star gray-star"></i>
          <i class="fa fa-star gray-star"></i>
          <i class="fa fa-star gray-star"></i>
          <i class="fa fa-star gray-star"></i>
          <i class="fa fa-star gray-star"></i>
        </div>
        </div>


            ${hasDiscount
  ? `
          <div class="custom-price-discount">
            <span class="custom-product-item__old-price">${product.original_price.toFixed(2)} TL</span>
            <span class="custom-product-item__percent">%${discountPercent} <i class="percent_icon"></i></span>
          </div>
          <span class="custom-product-item__price custom-product-item__price--new-price">${product.price.toFixed(2)} TL</span>
        `
        : `
          <div class="custom-price-discount" style="visibility: hidden;">
            <span class="custom-product-item__old-price">-</span>
            <span class="">-</span>
          </div>
          <span class="custom-product-item__price">${product.price.toFixed(2)} TL</span>
        `
      }
          
          <button class="close-btn">Sepete Ekle</button>
        
      </div>
    `;
  }).join("");
};
  
const fontAwesome = document.createElement("link");
fontAwesome.rel = "stylesheet";
fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
document.head.appendChild(fontAwesome);


  const buildCSS = () => {
    const css = `

      .custom-banner__wrapper {
        box-shadow: 15px 15px 30px 0 #ebebeb80;
        background-color: #fff;
        border-bottom-left-radius: 35px;
        border-bottom-right-radius: 35px;
        position: relative; 
        margin: 0 auto;
        overflow: hidden;
      }
      
      .custom-product-wrapper {
        display: flex;
        overflow: hidden;
        position: relative;
        gap: 0; 

      }
      
      .custom-product-item {
         min-width: 220px;
         max-width: 220px;
         height: 100%;
         display: flex;
         flex-direction: column;
         justify-content: space-between;
         font-family: Poppins, cursive;
         font-size: 12px;
         color: #7d7d7d;
         border: 1px solid #ededed;
         border-radius: 10px;
         background-color: #fff;
         margin-right: 10px;
         position: relative;
      }
      
      .custom-product-item__img {
          width: 100%;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          background-color: #fff;
      }
      
      .custom-product-item__img img {
         max-height: 100%;
         max-width: 100%;
         object-fit: contain;
      }
        .custom-product-item__brand {
       font-size: 1.1rem;
       height: 42px;
       overflow: hidden;
       margin-bottom: 8px;
}
      
      .custom-product-item-content {
        padding: 0 10px 10px;
        box-sizing: border-box;
      }
      
      .product-title {
        font-size: 14px;
        margin: 10px 0 5px;
        color: #333;
        height: 40px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .stars-wrapper {
        display: flex;
        gap: 3px;
        margin: 5px 0;
     }

      .gray-star {
        color: #d7d7d7;
        font-size: 16px;
      }

      .heart {
        position: absolute;
        top: 10px;
        right: 15px;
        cursor: pointer;
        background-color: #fff;
        border-radius: 50%;
        box-shadow: 0 2px 4px 0 #00000024;
        width: 50px;
        height: 50px;
        z-index: 10;
}

      .heart .heart-icon {
        width: 25px;
        height: 25px;
        position: absolute;
        top: 13px;
        right: 12px;
}

      .heart .hovered {
         display: none;
}

      .heart:hover .hovered {
        display: block;
}

      .heart:hover #default-favorite {
         display: none;
}
       .custom-price-discount {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 8px;
          margin-bottom: 5px;
          min-height: 22px;
}
      .custom-product-item__old-price {
          font-size: 1.4rem;
          font-weight: 500;
          text-decoration: line-through;
          color: #7d7d7d;

  }

      .custom-product-item__percent {
          color: #00a365;
          font-size: 1.4rem;
          font-weight: 700;
          display: inline-flex;
          justify-content: center;
          margin-top: 2px;
  }
      .custom-product-item__percent .percent_icon {
          display: inline-block;
           height: 22px;
          font-size: 22px;
          margin-left: 3px;
          
  }

      .custom-product-item__price {
          display: block;
          width: 100%;
          font-size: 2.2rem;
          font-weight: 600;
          
  } 
      .custom-product-item__price--new-price {
      color: #00a365;
      }
      .close-btn {
        width: 100%;
        padding: 15px 20px;
        border-radius: 37.5px;
        background-color: #fff7ec;
        color: #f28e00;
        font-family: Poppins,"cursive";
        font-size: 1.4rem;
        font-weight: 700;
        margin-top: 25px
}

      .close-btn:hover {
         background-color: #fdeed9
}
      
      .banner__titles {
        display: flex;
        flex-direction: column;
        background-color: #fef6eb;
        border-top-left-radius: 35px;
        border-top-right-radius: 35px;
        font-family: Quicksand-Bold;
        font-weight: 700;
        overflow: visible;
        padding: 25px 60px;
        position: relative;

      }
      
      .title-primary {
        font-family: Quicksand-Bold;
        font-size: 1.8rem;
        font-weight: 700;
        line-height: 1.11;
        color: #f28e00;
        margin: 0 0 20px 0;
      }
        .banner__wrapper {
          position: relative;
          overflow: hidden;
        }

        .swiper-prev,
        .swiper-next {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          background-color: #fef6eb;
          background-size: 20px;
          background-repeat: no-repeat;
          background-position: center;
          box-shadow: 0 2px 6px #00000033;
          border: none;
          cursor: pointer;
}

        .swiper-prev {
          left: -25px;
          background-image: url("https://www.e-bebek.com/assets/svg/prev.svg");
        }

        .swiper-next {
          right: -25px;
          background-image: url("https://www.e-bebek.com/assets/svg/next.svg");
        }

      
      @media (max-width: 768px) {
        .title-primary {
          font-size: 1.5rem;
        }
        
        .custom-product-item {
          min-width: 160px;
        }
      }

    `;
    
    const style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);
  };
  
  const updateVisibleSlides = (wrapper, start) => {
  const items = wrapper.querySelectorAll(".custom-product-item");
  items.forEach((item, index) => {
    if (index >= start && index < start + 5) {
      item.style.display = "inline-block";
    } else {
      item.style.display = "none";
    }
  });
};

  const setEvents = () => {
     document.querySelectorAll(".heart").forEach((heart) => {
      heart.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const url = heart.getAttribute("data-url");
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        const isFav = favorites.includes(url);

        if (isFav) {
          favorites = favorites.filter(item => item !== url);
        } else {
          favorites.push(url);
        }

        localStorage.setItem("favorites", JSON.stringify(favorites));

        
        location.reload();
      });
    });
};

  

  init();
})();