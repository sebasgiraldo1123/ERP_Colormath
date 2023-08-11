/**
 * ------------- FILTRA LOS TRABAJOS QUE REQUIEREN MADERA -------------
 * 
 */

function filterWoodOrders() {
  let orders = null;
  let woodOrders = [];


  // Captura las ordenes en los estados indicados
  orders = searchOrdersByState("POR HACER");
  orders = orders.concat(searchOrdersByState("DISEÑADO"));
  orders = orders.concat(searchOrdersByState("IMPRESO"));

  // Sort
  if (orders.length === 0) {
    return null;
  }
  else {
    // Ordena los elementos del vector de acuerdo a la última fila, es decir, el plazo
    orders.sort((a, b) => a[a.length - 1] - b[b.length - 1]);
  }

  // Deja en el vector únicamente las ordenes que tienen trabajo en madera
  let products = PRODUCTOS_TABLE.getDataRange().getValues();

  for (let i = 0; i < orders.length; i++) {

    // Agrega al vector final las ordenes que tienen madera
    if (searchWoodOrdersById(orders[i][0], products)) {
      woodOrders.push(orders[i]);
    }
  }

  return woodOrders;
}

/**
 * Encuentra si una orden requiere un trabajo en madera, si es así responde true, de lo contrario false
 */
function searchWoodOrdersById(id, products) {

  let filtered = products.filter(sublist => sublist[1] === id);
  let searchWords = ["RETABLO", "GIRATORIO", "CUADRO", "TABLA", "OTROS"];
  const searchRegex = new RegExp(`\\b(?:${searchWords.join("|")})\\b`, 'i');

  return filtered.some(product => {
    let productName = product[2];
    return searchRegex.test(productName);
  });
}


function functionSpeedTest() {
  // Time
  var startTime = new Date();

  /*
    let data = PEDIDOS_TABLE.getDataRange();
    const filtradas = data.getValues().filter(product => product.includes('ENTREGADO'));
    console.log(filtradas);
  */

  /*
  let data = PRODUCTOS_TABLE.getDataRange().getValues();
  let filtered = data.filter(sublist => sublist[1] === "6716");

  let searchWords = ["RETABLO", "GIRATORIO", "CUADRO", "TABLA", "OTROS"];
  const searchRegex = new RegExp(`\\b(?:${searchWords.join("|")})\\b`, 'i');

  filtered.forEach(product => {
    let productName = product[2];

    if (searchRegex.test(productName)) {
      console.log(`Palabras encontradas en la product ${product[0]}: ${productName}`);
    } else {
      console.log(`No se encontraron palabras en la product ${product[0]}`);
    }
  })
  */

  // Time
  var endTime = new Date();
  console.log("time : ", endTime - startTime);
}



















