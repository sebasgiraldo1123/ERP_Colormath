/**
 * ------------- FILTRA LOS TRABAJOS QUE REQUIEREN MADERA -------------
 * 
 */

function filterWoodOrders(maxWoodResults) {
  // Time
  var startTime = new Date();

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

  //console.log(orders);

  // Deja en el vector únicamente las ordenes que tienen trabajo en madera
  for (let i = 0; i < orders.length; i++) {

    // Agrega al vector final las ordenes que tienen madera
    if (searchWoodOrdersById(orders[i][0])) {
      woodOrders.push(orders[i]);
    }

    /*
    if (woodOrders.length >= maxWoodResults) {
      break;
    }
    */
  }

  // Time
  var endTime = new Date();
  console.log("time : ", endTime - startTime);

  //console.log(woodOrders);
  return woodOrders;
}

/**
 * Encuentra si una orden requiere un trabajo en madera, si es así responde true, de lo contrario false
 */
function searchWoodOrdersById(id) {

  let rows = getRowById(id, PRODUCTOS_TABLE);
  const range = `C${rows[0]}:C${rows[rows.length - 1]}`;
  let products = PRODUCTOS_TABLE.getRange(range).getValues();

  let searchWords = ["RETABLO", "GIRATORIO", "CUADRO", "TABLA", "OTROS"];

  // Esto permite ver si la búsqueda es acertada
  //console.log(products);

  // Expresión regular cortesía de GePeTo
  //const searchRegex = new RegExp("\\b(" + searchWords.join("|") + ")\\b", 'i');
  const searchRegex = new RegExp(`\\b(?:${searchWords.join("|")})\\b`, 'i');

  return products.some(product => searchRegex.test(product[0]));
}



















