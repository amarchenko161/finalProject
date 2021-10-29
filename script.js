const allShop = [];
let valueInputShop = "";
let valueInputPrice = "";
let inputShop = null;
let inputPrice = null;
let count = 0;
let tempValuesInEdit = {
  shop: '',
  price: '',
  date: ''
};

const day = () => {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();
  today = dd + '.' + mm + '.' + yyyy;

  return today
}

window.onload = init = () => {
  inputShop = document.getElementById("add-shop");
  inputPrice = document.getElementById("price-shop");
  inputShop.addEventListener("change", updateShop);
  inputPrice.addEventListener("change", updatePrice);
  render();
}

const onClickButton = () => {
  allShop.push({
    shop: valueInputShop,
    price: valueInputPrice,
    date: day()
  });
  
  valueInputShop = "";
  valueInputPrice = "";
  inputShop.value = "";
  inputPrice.value = "";
  render();
}

const updateShop = (event) => {
  valueInputShop = event.target.value;
}

const updatePrice = (event) => {
  valueInputPrice = event.target.value;
}

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
    valId.className = 'index-id';
    valId.innerText = `${index + 1} )`;
    const valShop = document.createElement("p");
    valShop.className = 'shop-style';
    valShop.innerText = item.shop;
    const valPrice = document.createElement("p");
    valPrice.innerText = item.price + ` p.`;
    const valDate = document.createElement("p");
    valDate.className = 'date';
    valDate.innerText = item.date;
    valShop.ondblclick = () => {
      const [inputShopValue] = dbEditShop(index);
      container.replaceChild(inputShopValue, valShop);
      tempValuesInEdit = item;
    } 
    valPrice.ondblclick = () => {
      const [inputPriceValue] = dbEditPrice(index);
      container.replaceChild(inputPriceValue, valPrice);
      tempValuesInEdit = item;
    }  
    valDate.ondblclick = () => {
      const [inputDateValue] = dbEditDate(index);
      container.replaceChild(inputDateValue, valDate);
      tempValuesInEdit = item;
    }
    container.appendChild(valId);
    container.appendChild(valShop);
    container.appendChild(valDate);
    container.appendChild(valPrice);
    count = count + Number(item.price)
    const imageEdit = document.createElement("img");
    imageEdit.src = "images/edit.png";
    container.appendChild(imageEdit);
    const imageDelete = document.createElement("img");
    imageDelete.src = "images/close.png";
    container.appendChild(imageDelete);
 
    imageDelete.onclick = () => deleteElements (index, content, container);
    imageEdit.onclick = () => {
      const [inputShopValue, inputPriceValue, inputDateValue] = editElements(index);
      container.replaceChild(inputShopValue, valShop);
      container.replaceChild(inputPriceValue, valPrice);
      container.replaceChild(inputDateValue, valDate);
      imageEdit.onclick = () => saveElements(index);
      imageDelete.onclick = () => render();
      tempValuesInEdit = item; 
    }
    content.appendChild(container);
  });

  const sumPrice = document.getElementById('count-price');
  sumPrice.innerText = count;
  count = 0;

}


const editElements = (index) => {
  const { shop, price, date } = allShop[index];
  const inputShopValue = document.createElement("input");
  inputShopValue.onchange = (e) => tempValuesInEdit = {...tempValuesInEdit, shop: e.target.value};
  const inputPriceValue = document.createElement("input");
  inputPriceValue.onchange = (e) => tempValuesInEdit = {...tempValuesInEdit, price: e.target.value};
  const inputDateValue = document.createElement("input");
  inputDateValue.type = 'date';
  inputDateValue.onchange = (e) => tempValuesInEdit = {...tempValuesInEdit, date: e.target.value.slice(0, 10).split('-').reverse().join('.')};
  inputShopValue.value = shop;
  inputPriceValue.value = price;
  inputDateValue.value = date;
  
  return [inputShopValue, inputPriceValue, inputDateValue];
}

const saveElements = (index) => {
  allShop[index] = tempValuesInEdit;
  render();
}

const dbEditShop = (index) => {
  const { shop } = allShop[index];
  const inputShopValue = document.createElement("input");
  inputShopValue.onchange = (e) => tempValuesInEdit = {...tempValuesInEdit, shop: e.target.value};
  inputShopValue.value = shop;
  inputShopValue.focus();
  inputShopValue.onblur = () => {
    allShop[index] = tempValuesInEdit;
    render();
  }
  return [inputShopValue]
}

const dbEditPrice = (index) => {
  const { price } = allShop[index];
  const inputPriceValue = document.createElement("input");
  inputPriceValue.onchange = (e) => tempValuesInEdit = {...tempValuesInEdit, price: e.target.value};
  inputPriceValue.value = price;
  inputPriceValue.focus();
  inputPriceValue.onblur = () => {
    allShop[index] = tempValuesInEdit;
    render();
  }
  return [inputPriceValue]
}

const dbEditDate = (index) => {
  const { date } = allShop[index];
  const inputDateValue = document.createElement("input");
  inputDateValue.type = 'date';
  inputDateValue.onchange = (e) => tempValuesInEdit = {...tempValuesInEdit, date: e.target.value.slice(0, 10).split('-').reverse().join('.')};
  inputDateValue.value = date;
  inputDateValue.focus();
  inputDateValue.onblur = () => {
    allShop[index] = tempValuesInEdit;
    render();
  }
  return [inputDateValue]
}


const deleteElements = (index, content, container) => {
  allShop.splice(index, 1);
  content.removeChild(container);
  render();
}

