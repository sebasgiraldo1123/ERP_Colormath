/**
 * ---------------------- FILTRAR PEDIDOS ----------------------
 * 
 * 
 */

function filterOrders(parameter) {

  // Time
  //var startTime = new Date();

  let orders = null;

  switch (parameter) {
    case "POR HACER":
      orders = searchOrdersByState("POR HACER");
      break;
    case "ENTREGADO":
      orders = searchOrdersByState("ENTREGADO");
      break;
    case "CANCELADO":
      orders = searchOrdersByState("CANCELADO");
      break;
    case "LISTO":
      orders = searchOrdersByState("LISTO");
      break;
    case "DISEÑADO":
      orders = searchOrdersByState("DISEÑADO");
      break;
    case "IMPRESO":
      orders = searchOrdersByState("IMPRESO");
      break;
    default:
      orders = searchOrdersByState("LISTO");
      orders = orders.concat(searchOrdersByState("POR HACER"));
      break;
  }

  // Time
  //var endTime = new Date();
  //console.log("time : ", endTime - startTime);

  if (orders.length === 0) {
    return null;
  }
  else {
    // Ordena los elementos del vector de acuerdo a la última fila, es decir, el plazo
    return orders.sort((a, b) => a[a.length - 1] - b[b.length - 1]);
  }
}


/**
 * Encuentra todas las ordenes de un estado en específico
 */
function searchOrdersByState(searchText) {

  let orders = [];
  const range = "B2:B";
  let rowList = [];

  const textFinder = PEDIDOS_TABLE.getRange(range)
    .createTextFinder(searchText).matchEntireCell(true);

  rowList = textFinder.findAll();

  // Se crea un objeto con los datos de las filas proporcionadas
  for (let i = 0; i < rowList.length; i++) {
    orders.push(PEDIDOS_TABLE.getRange(rowList[i].getRow(), 1, 1, PEDIDOS_TABLE.getLastColumn()).getValues()[0]);

    if (searchText !== "ENTREGADO" && searchText !== "CANCELADO") {
      // Calcula el plazo con la diferencia entre la fecha actual y la fecha de entrega, lo agrega en la última fila del vector
      orders[i].push((Math.floor((new Date(orders[i][5]) - new Date()) / (1000 * 60 * 60 * 24))) + 1);
    }
  }

  return orders;
}


/*
 * retorna la cantidad de entregas que hay para un dia en específico
 */
function getOrdersByDate(date) {

  const range = "F2:F";
  let rowList = [];
  let countOrders = 0;

  const textFinder = PEDIDOS_TABLE.getRange(range)
    .createTextFinder(date).matchEntireCell(true);

  rowList = textFinder.findAll();

  for (let i = 0; i < rowList.length; i++) {
    let state = PEDIDOS_TABLE.getRange(rowList[i].getRow(), 2).getValue();
    if (state === "POR HACER") {
      countOrders++;
    }
  }
  return countOrders;
}












