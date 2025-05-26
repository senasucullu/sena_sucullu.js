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


  const buildHTML = (products) => {
    const title = document.createElement("h2");
    title.innerText = "Beğenebileceğinizi düşündüklerimiz";
    title.className = "title-primary";

    const container = document.createElement("div");
    container.className = "banner__titles";
    container.appendChild(title);

    const productWrapper = document.createElement("div");
    productWrapper.className = "product-wrapper"; 
    productWrapper.innerHTML = buildProducts(products); 

    container.appendChild(productWrapper);

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
      <div class="product-item">
        <a class="product-item__img" href="${product.url}" target="_blank">
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
        <div class="product-item-content">
          <h2 class="product-item__brand">
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


          <div class="product-item__price">
            ${
              hasDiscount
                ? `
              <div class="d-flex align-items-center">
                <span class="product-item__old-price">${product.original_price.toFixed(2)} TL</span>
                <span class="product-item__percent">%${discountPercent} <i class="icon icon-decrease"></i></span>
              </div>
              <span class="product-item__new-price">${product.price.toFixed(2)} TL</span>
              `
                : 
                `<span class="product-item__new-price">${product.price.toFixed(2)} TL</span>`
            }
          </div>
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

      .banner__wrapper {
        box-shadow: 15px 15px 30px 0 #ebebeb80;
        background-color: #fff;
        border-bottom-left-radius: 35px;
        border-bottom-right-radius: 35px;
        position: relative; 
      }
      
      .product-wrapper {
        display: flex;
        overflow-x: auto;
      }
      
      .product-item {
        min-width: 200px;
        z-index: 1;
        font-family: Poppins, cursive;
        font-size: 12px;
        padding: 5px;
        color: #7d7d7d;
        
        border: 1px solid #ededed;
        border-radius: 10px;
        position: relative;
        text-decoration: none;
        background-color: #fff;
      }
      
      .product-item__img {
        position: relative;
        display: block;
        width: 100%;
        background-color: #fff;
        margin-bottom: 10px;
        text-align: center;
      }
      
      .product-item__img img {
        width: 100%;
        height: auto;
        border-radius: 8px;
      }
        .product-item__brand {
       font-size: 1.2rem;
       height: 42px;
       overflow: hidden;
       margin-bottom: 10px;
}
      
      .product-item-content {
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

      .product-item__old-price {
          font-size: 1.4rem;
          font-weight: 500;
          text-decoration: line-through;
  }

      .product-item__percent {
          color: #00a365;
          font-size: 18px;
          font-weight: 700;
          display: inline-flex;
          justify-content: center;
          margin-left: 10px;
  }

      .product-item__new-price {
          display: block;
          width: 100%;
          font-size: 2.2rem;
          font-weight: 600;
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
      }
      
      .title-primary {
        font-family: Quicksand-Bold;
        font-size: 1.8rem;
        font-weight: 700;
        line-height: 1.11;
        color: #f28e00;
        margin: 0 0 20px 0;
      }
      
      @media (max-width: 768px) {
        .title-primary {
          font-size: 1.5rem;
        }
        
        .product-item {
          min-width: 160px;
        }
      }
    `;
    
    const style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);
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