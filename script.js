let allShop = [];
let valueInputShop = "";
let valueInputPrice = null;
let inputShop = null;
let inputPrice = null;
let count = 0;
let tempValuesInEdit = {
  shop: "",
  price: null,
  date: "",
};

const day = () => {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  today = dd + "." + mm + "." + yyyy;

  return today;
};

window.onload = init = async () => {
  inputShop = document.getElementById("add-shop");
  inputPrice = document.getElementById("price-shop");
  inputShop.addEventListener("change", updateShop);
  inputPrice.addEventListener("change", updatePrice);

  const resp = await fetch("http://localhost:8000/allShop", {
    method: "GET",
  });
  const result = await resp.json();
  allShop = result.data;
  render();
};

const onClickButton = async () => {
  //проверка иф
  if (valueInputShop.trim() !== "" && valueInputPrice !== null) {
    const resp = await fetch("http://localhost:8000/createShop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        shop: valueInputShop,
        price: valueInputPrice,
        date: day(),
      }),
    });

    const result = await resp.json();
    allShop.push(result.data);
    valueInputShop = "";
    valueInputPrice = "";
    inputShop.value = "";
    inputPrice.value = "";
    render();
  } else {
    alert("Проверьте заполненность полей");
  }
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
    const container = document.createElement("div");
    container.id = `buy-${index}`;
    container.className = "shoplist-container";
    const valId = document.createElement("p");
    valId.className = "index-id";
    valId.innerText = `${index + 1})`;
    const valShop = document.createElement("p");
    valShop.className = "shop-style";
    valShop.innerText = item.shop;
    const valPrice = document.createElement("p");
    valPrice.innerText = item.price + ` p.`;
    const valDate = document.createElement("p");
    valDate.className = "date";
    valDate.innerText = item.date;
    valShop.ondblclick = () => {
      const [inputShopValue] = dbEditShop(index);
      contentShop.replaceChild(inputShopValue, valShop);
      tempValuesInEdit = item;
    };
    valPrice.ondblclick = () => {
      const [inputPriceValue] = dbEditPrice(index);
      contentPriceAndDate.replaceChild(inputPriceValue, valPrice);
      tempValuesInEdit = item;
    };
    valDate.ondblclick = () => {
      const [inputDateValue] = dbEditDate(index);
      contentPriceAndDate.replaceChild(inputDateValue, valDate);
      tempValuesInEdit = item;
    };
    const contentShop = document.createElement('div');
    contentShop.className = "content-shop"
    const contentOtherInfo = document.createElement('div');
    contentOtherInfo.className = "content-other-info";
    const contentPriceAndDate = document.createElement('div');
    contentPriceAndDate.className = "content-price-date";
    const contentButton = document.createElement('div');
    contentButton.className = "content-button";

    contentShop.appendChild(valId);
    contentShop.appendChild(valShop);
    container.appendChild(contentShop);

    contentPriceAndDate.appendChild(valDate);
    contentPriceAndDate.appendChild(valPrice);
    contentOtherInfo.appendChild(contentPriceAndDate);
    

    count = count + Number(item.price);
    const imageEdit = document.createElement("img");
    imageEdit.src = "images/edit.png";
    contentButton.appendChild(imageEdit);
    const imageDelete = document.createElement("img");
    imageDelete.src = "images/close.png";
    contentButton.appendChild(imageDelete);

    imageDelete.onclick = () => deleteElements(index);
    imageEdit.onclick = () => {
      const [inputShopValue, inputPriceValue, inputDateValue] =
        editElements(index);
      contentShop.replaceChild(inputShopValue, valShop);
      contentPriceAndDate.replaceChild(inputPriceValue, valPrice);
      contentPriceAndDate.replaceChild(inputDateValue, valDate);
      imageEdit.onclick = () => saveElements(index);
      imageDelete.onclick = () => render();
      tempValuesInEdit = item;
    };
    contentOtherInfo.appendChild(contentButton);
    container.appendChild(contentOtherInfo);
    content.appendChild(container);
  });

  const sumPrice = document.getElementById("count-price");
  sumPrice.innerText = count;
  count = 0;
};

const editElements = (index) => {
  const { shop, price, date } = allShop[index];
  const inputShopValue = document.createElement("input");
  const inputPriceValue = document.createElement("input");
  inputPriceValue.type = "number";
  const inputDateValue = document.createElement("input");
  inputDateValue.type = "date";
  inputShopValue.onchange = (e) =>
    (tempValuesInEdit = { ...tempValuesInEdit, shop: e.target.value });
  inputPriceValue.onchange = (e) =>
    (tempValuesInEdit = { ...tempValuesInEdit, price: e.target.value });
  inputDateValue.onchange = (e) =>
    (tempValuesInEdit = {
      ...tempValuesInEdit,
      date: e.target.value.slice(0, 10).split("-").reverse().join("."),
    });
  inputShopValue.value = shop;
  inputPriceValue.value = price;
  inputDateValue.value = date;
  return [inputShopValue, inputPriceValue, inputDateValue];
};

const saveElements = async (index) => {
  const { shop, price } = tempValuesInEdit;
  if (shop.trim() !== "" && price !== "") {
    const resp = await fetch("http://localhost:8000/updateShop", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(tempValuesInEdit),
    });
    const result = await resp.json();
    allShop = result.data;
    render();
  } else {
    alert("Проверьте заполненность полей");
  }
};

const dbEditShop = (index) => {
  const { shop } = allShop[index];
  const inputShopValue = document.createElement("input");
  inputShopValue.onchange = (e) =>
    (tempValuesInEdit = { ...tempValuesInEdit, shop: e.target.value });
  inputShopValue.value = shop;
  inputShopValue.focus();
  inputShopValue.onblur = async () => {
    if (inputShopValue.value !== "") {
      const resp = await fetch("http://localhost:8000/updateShop", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(tempValuesInEdit),
      });
      const result = await resp.json();
      allShop = result.data;
      render();
    } else {
      alert("Заполните поле!");
    }
  };
  return [inputShopValue];
};

const dbEditPrice = (index) => {
  const { price } = allShop[index];
  const inputPriceValue = document.createElement("input");
  inputPriceValue.type = "number";
  inputPriceValue.onchange = (e) =>
    (tempValuesInEdit = { ...tempValuesInEdit, price: e.target.value });
  inputPriceValue.value = price;
  inputPriceValue.focus();
  inputPriceValue.onblur = async () => {
    if (inputPriceValue.value !== "") {
      const resp = await fetch("http://localhost:8000/updateShop", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(tempValuesInEdit),
      });
      const result = await resp.json();
      allShop = result.data;
      render();
    } else {
      alert("Заполните поле!");
    }
  };
  return [inputPriceValue];
};

const dbEditDate = (index) => {
  const { date } = allShop[index];
  const inputDateValue = document.createElement("input");
  inputDateValue.type = "date";
  inputDateValue.onchange = (e) =>
    (tempValuesInEdit = {
      ...tempValuesInEdit,
      date: e.target.value.slice(0, 10).split("-").reverse().join("."),
    });
  inputDateValue.value = date;
  inputDateValue.focus();
  inputDateValue.onblur = async () => {
    const resp = await fetch("http://localhost:8000/updateShop", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(tempValuesInEdit),
    });
    const result = await resp.json();
    allShop = result.data;
    render();
  };
  return [inputDateValue];
};

const deleteElements = async (index) => {
  const resp = await fetch(
    `http://localhost:8000/deleteShop?_id=${allShop[index]._id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
  const result = await resp.json();
  allShop = result.data;
  render();
};
