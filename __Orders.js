/**
 * ---------------------- FILTRAR PEDIDOS ----------------------
 * 
 * 
 */

function filterOrders(parameter) {

  // Time
  //var startTime = new Date();

  const orders = [];

  switch (parameter) {
    case "POR HACER":
      searchOrdersByParameter("POR HACER", orders);
      break;
    case "ENTREGADO":
      searchOrdersByParameter("ENTREGADO", orders);
      break;
    case "CANCELADO":
      searchOrdersByParameter("CANCELADO", orders);
      break;
    case "LISTO":
      searchOrdersByParameter("LISTO", orders);
      break;
    case "DISEÑADO":
      searchOrdersByParameter("DISEÑADO", orders);
      break;
    case "IMPRESO":
      searchOrdersByParameter("IMPRESO", orders);
      break;
    default:
      searchOrdersByParameter("LISTO", orders);
      searchOrdersByParameter("POR HACER", orders);
      break;
  }

  // Time
  //var endTime = new Date();
  //console.log("time : ", endTime - startTime);

  if (orders.length === 0) {
    return null;
  }
  else {
    return orders;
  }

}

/**
 * Encuentra todas las ordenes de un estado en específico y las agrega al vector sale
 */
function searchOrdersByParameter(searchText, orders) {

  const range = "A2:H";
  let rowList = [];

  const textFinder = PEDIDOS_TABLE.getRange(range)
    .createTextFinder(searchText).matchEntireCell(true);

  rowList = textFinder.findAll();

  // Se crea un objeto con los datos de las filas proporcionadas
  for (let i = 0; i < rowList.length; i++) {
    orders.push(PEDIDOS_TABLE.getRange(rowList[i].getRow(), 1, 1, PEDIDOS_TABLE.getLastColumn()).getValues()[0]);
  }
}





