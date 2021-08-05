// Selectors
const frequently = document.querySelector('.frequently-asked-toggle');
const reviews = document.querySelector('.reviews-toggle');
const to_cart_buttons = document.querySelectorAll('.to-cart-button, .ask-question-button, .check-offer-button, .add-to-cart-button, .reviews-button, .rate-button');
const footer_links = document.querySelectorAll('.desktop-footer a');
const links = document.querySelectorAll("a");
const gallery = document.querySelectorAll("[class*=gallery-]");
const product = document.querySelector(".product-left");
const cart = document.querySelector(".cart-button");
const availableProducts = document.querySelectorAll("[class*=item1-], [class*=item2-], [class*=item3-]");
const add_to_cart_buttons = document.querySelectorAll("[id*=button-item");

// getting rid of links default actions.
for (let i = 0; i < links.length; i++) {
  links[i].addEventListener('click', function (event) {
    event.preventDefault();
  });
}

document.querySelector('.mobile-frequently-button').addEventListener('click', function (event) {
  frequently.classList.toggle('active');
  event.preventDefault();
});

document.querySelector('.reviews-button').addEventListener('click', function (event) {
  reviews.classList.toggle('active');
  event.preventDefault();
});

for (let i = 0; i < to_cart_buttons.length; i++) {
  to_cart_buttons[i].addEventListener('mousedown', function (event) {
    event.preventDefault();
    this.classList.add('clicked');
  });
  to_cart_buttons[i].addEventListener('mouseup', function (event) {
    event.preventDefault();
    this.classList.remove('clicked');
  });
}

for (let i = 0; i < footer_links.length; i++) {
  footer_links[i].addEventListener('click', function (event) {
    event.preventDefault();
  });
}


// loading data from json file via axios package
const response = await axios("../products.json");
// saving response data into const
const products = response.data;
// console.log(products);

for (let i = 0; i < gallery.length; i++) {
  gallery[i].addEventListener('click', function (event) {
    event.preventDefault();
    let style = gallery[i].currentStyle || window.getComputedStyle(gallery[i], false),
      galleryImage = style.backgroundImage.slice(26, -1).replace(/"/g, "");
    let compare = ".." + galleryImage;
    console.log(style.backgroundImage)

    let productStyle = product.currentStyle || window.getComputedStyle(product, false),
      productImage = ".." + productStyle.backgroundImage.slice(26, -1).replace(/"/g, "");
    console.log(productStyle.backgroundImage);

    for (let img in products.small_images) {
      if (products.small_images[img] == compare) {
        document.getElementById('product-left').setAttribute("style", "background-image: url(" + products.images[img] + ");background-repeat: no-repeat");
      }
    }
  });
}

// console.log(products);

cart.addEventListener('click', function (event) {
  event.preventDefault();
  document.querySelector(".cart-dropdown").classList.toggle('active');
});

// Injecting prepared data into elements of "dostępne warianty" section.
let injectAvailableProducts = () => {
  for (const item in products.available) {
    // console.log(item.length)
    // console.log(products.available[item]);
    // if(document.getElementById("item"+i+"-img").contains)
    // console.log(products.available[item].img);
    // console.log(document.getElementById("item" + products.available[item].id + "-img"));
    document.getElementById("item" + products.available[item].id + "-img").setAttribute("style", "background-image: url(" + products.available[item].img + "); background-repeat: no-repeat");
    document.getElementById("item" + products.available[item].id + "-title").innerHTML = products.available[item].title;
    document.getElementById("item" + products.available[item].id + "-quantity").innerHTML = products.available[item].quantity;
    document.getElementById("item" + products.available[item].id + "-price").innerHTML = products.available[item].price + "zł / szt.";
  }
}

// Calculating the total price of order
let calculateTotal = () => {
  let cartItemsPrices = document.querySelectorAll('[id*="item-price"]');
  let totalPrice = 0.00;
  for (let i = 0; i < cartItemsPrices.length; i++) {
    totalPrice += parseFloat((cartItemsPrices[i].innerHTML).substring(6, (cartItemsPrices[i].innerHTML).length - 2));
  }
  let totalPrice_Selector = document.querySelectorAll('[id="total-price"]');
  for (let i = 0; i < totalPrice_Selector.length; i++) {
    totalPrice_Selector[i].innerHTML = totalPrice.toFixed(2) + ' zł';
  }
}

// Checking the quantity of cart items 
// console.log(products.available)
// let quantityCheck = [];
// let quantityValidator = (cartValid) => {
//   for (const cartItem in cartValid) {
//     for (const item in products.available) {
//       if (cartValid[cartItem].id == products.available[item].id) {

//       }
//     }
//   }
// }

let counter = 0;
let cartValid = {};

let AddToCart = ({ id, img, title, quantity, price }, requestQuantity) => {
  cartValid[counter] = {
    "id": id,
    "quantity": requestQuantity
  }
  console.log(cartValid);
  let itemPrice = price * requestQuantity;
  counter += 1;
  if (requestQuantity > quantity) {
    return window.alert('próbujesz zamówić więcej sztuk produktu niż obecnie posiadamy w magazynach!');
  }
  let html = `
  <li id="item-id-${id}" class="row cart-items-styles">
    <div class="col-md-4">
      <span style="background: url(..${img}) no-repeat; background-size: 100%;" class="item-image"></span>
    </div>
    <div class="col-md-8 cart-item-description">
      <span class="item-name row">${title}</span>
      <div class="row">
        <span class="item-quantity">Ilość: ${requestQuantity}</span>
        <span id="item-price-${counter}" class="item-price">Cena: ${itemPrice} zł</span>
      </div>
    </div>
  </li>`;

  // let result = quantityValidator(cartValid);
  // document.getElementById("cart-dropdown-items").innerHTML += html;
  // if(result == 1){
  document.getElementById("cart-dropdown-items").insertAdjacentHTML('beforeend', html);
  calculateTotal();
  // }
  // else{
  //   return window.alert('próbujesz zamówić więcej sztuk produktu niż obecnie posiadamy w magazynach!')
  // }
}

// Adding event listeners to Add-To-Cart buttons
for (let i = 0; i < add_to_cart_buttons.length; i++) {
  add_to_cart_buttons[i].addEventListener('click', function () {
    console.log(add_to_cart_buttons[i]);
    let button_id = (add_to_cart_buttons[i].id).charAt((add_to_cart_buttons[i].id).length - 1);
    console.log(button_id);
    for (const item in products.available) {
      if ((add_to_cart_buttons[i].id).length == 12) {
        if (button_id == products.available[item].id) {
          if (products.available[item].quantity > 0) {
            console.log(products.available[item]);
            let id = parseInt(button_id) + 1;
            let requestQuantity = document.getElementById('quantity-item' + id);
            // console.log(requestQuantity);
            AddToCart(products.available[item], requestQuantity.value);
            products.available[item].quantity = products.available[item].quantity - 1;
            console.log(products.available[item].quantity);
            injectAvailableProducts();
          } else if (products.available[item].quantity == 0) {
            add_to_cart_buttons[i].disabled = true;
            window.alert('Próbujesz zamówić więcej niż obecnie posiadamy w magazynach, przepraszamy');
          }
        }
      } else if ((add_to_cart_buttons[i].id).length > 12) {
        if (button_id == products.available[item].id) {
          if (button_id == products.available[item].id) {
            let id = parseInt(button_id);
            console.log(id);
            let requestQuantity = document.getElementById('quantity-item' + id);
            // console.log(requestQuantity);
            AddToCart(products.available[item], requestQuantity.value);
            products.available[item].quantity = products.available[item].quantity - 1;
            injectAvailableProducts();
          } else if (products.available[item].quantity == 0) {
            add_to_cart_buttons[i].disabled = true;
            window.alert('Próbujesz zamówić więcej niż obecnie posiadamy w magazynach, przepraszamy');
          }
        }
      }
    }
  });
}


injectAvailableProducts();