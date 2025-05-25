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
    return `
      <div class="product-item">
        <a class="product-item__img" href="${product.url}" target="_blank">
          <img src="${product.img}" alt="${product.name}" />
        </a>
        <div class="product-item-content">
          <h2 class="product-item__brand">
            <b>${product.brand} - </b><span>${product.name}</span>
          </h2>
          <div class="product-item__price">
            <span class="product-price">${product.price.toFixed(2)} TL</span>
          </div>
          <button class="close-btn">Sepete Ekle</button>
        </div>
      </div>
    `;
  }).join("");
};



  const buildCSS = () => {
    const css = `
      .container {
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        margin-right: auto;
        margin-left: auto;
      }
      
      .banner__wrapper {
        box-shadow: 15px 15px 30px 0 #ebebeb80;
        background-color: #fff;
        border-bottom-left-radius: 35px;
        border-bottom-right-radius: 35px;
        position: relative; 
      }
      
      .product-wrapper {
        display: flex;
        gap: 20px;
        margin-top: 20px;
        overflow-x: auto;
        padding-bottom: 15px;
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
      .product-item-content .stars-wrapper {
        --cx-color-primary: #fed100;
        --cx-color-light: #d7d7d7;
        padding: 5px 0 15px;
}
      .product-item__price {
        position: relative;
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        height: auto;
        margin-bottom: 10px;
      }
      
      .product-price {
        font-weight: bold;
        color: #7d7d7d;
        font-size: 16px;
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
        padding: 25px;
        border-top-left-radius: 35px;
        border-top-right-radius: 35px;
        font-family: Quicksand-Bold;
        font-weight: 700;
        margin-bottom: 20px;
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
    // Şimdilik boş, sonradan eklenecek
  };

  init();
})();