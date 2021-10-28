let allShop = [];
let valueInputShop = "";
let valueInputPrice = "";
let inputShop = null;
let inputPrice = null;
let count = 0;

const day = () => {
  let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();
today = dd + '.' + mm + '.' + yyyy;

return today
}

window.onload = init = () => {
  inputShop = document.getElementById("add-shop");
  inputPrice = document.getElementById("price-shop");
  inputShop.addEventListener("change", updateShop);
  inputPrice.addEventListener("change", updatePrice);
  render();
};

const onClickButton = () => {
  allShop.push({
    shop: valueInputShop,
    price: valueInputPrice,
    date : day()
  });
  
  valueInputShop = "";
  valueInputPrice = "";
  inputShop.value = "";
  inputPrice.value = "";
  render();
  console.log(allShop);
};

const updateShop = (event) => {
  valueInputShop = event.target.value;
};
const updatePrice = (event) => {
  valueInputPrice = event.target.value;
};

const render = () => {
  const content = document.getElementById("content-page");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  allShop.map((item, index) => {
    const container = document.createElement('div');
    container.id = `buy-${index}`;
    container.className = "shoplist-container";
    const valId = document.createElement("p");
    valId.innerText = `${index +1} )` 
    const valShop = document.createElement("p");
    valShop.innerText = item.shop;
    const valPrice = document.createElement("p");
    valPrice.innerText = item.price + ` p.`;
    const valDate = document.createElement("p");
    valDate.innerText = `${item.date}`;
    container.appendChild(valId);
    container.appendChild(valShop);
    container.appendChild(valDate);
    container.appendChild(valPrice);
    content.appendChild(container);
    count = count + Number(item.price)
    const imageEdit = document.createElement("img");
    imageEdit.src = "images/edit.png";
    container.appendChild(imageEdit);
    const imageDelete = document.createElement("img");
    imageDelete.src = "images/close.png";
    container.appendChild(imageDelete);
    const inputShopValue = document.createElement("input");
    const inputPriceValue = document.createElement("input");
    imageDelete.onclick = () => deleteElements (index, content, container);
    imageEdit.onclick = () => editElements (inputShopValue,inputPriceValue, valShop, valPrice, container, item , imageEdit, imageDelete );
  });


  const sumPrice = document.getElementById('count-price');
  sumPrice.innerText = count;
  count = 0;
}

const editElements = (inputShopValue,inputPriceValue, valShop, valPrice , container, item , imageEdit, imageDelete) => {
  inputShopValue.value = valShop.innerText;
  valPrice.innerText = item.price;
  inputPriceValue.value = valPrice.innerText;
  container.replaceChild(inputShopValue, valShop);
  container.replaceChild(inputPriceValue, valPrice);
  imageEdit.onclick = () => saveElements(inputShopValue,inputPriceValue, valShop, valPrice , container, item);
  imageDelete.onclick = () => render();

}

const saveElements = (inputShopValue,inputPriceValue, valShop, valPrice , container, item) => {
  valShop.innerText = inputShopValue.value;
  valPrice.innerText = inputPriceValue.value;
  item.shop = inputShopValue.value;
  item.price = inputPriceValue.value;
  container.replaceChild(valShop, inputShopValue);
  container.replaceChild(valPrice, inputPriceValue);
  render();
};

const deleteElements = (index, content, container) => {
  allShop.splice(index, 1);
  content.removeChild(container);
  render();
};

