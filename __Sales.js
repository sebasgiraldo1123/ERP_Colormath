/**
 * -------------------------- CREAR VENTA FUNCTIONS --------------------------
 */


/**
 * Registra una nueva venta dentro del spreadsheet
 * @param {*} data 
 */
function createSale(data) {

  //---------------------------- Pedido -----------------------------------
  const id = data.id_cliente;
  const estado = "POR HACER";

  // La fecha del pedido se toma del servidor
  const fecha = formatDate(new Date());

  const cliente = data.nombre_cliente.toUpperCase();
  const celular = data.celular_cliente;
  const fecha_entrega = data.fecha_entrega;
  const vlr_abonado = data.abono;
  const vlr_total = data.valor_total;

  // Se agrega la fila con los datos recopilados
  PEDIDOS_TABLE.appendRow([
    id,
    estado,
    fecha,
    cliente,
    celular,
    fecha_entrega,
    vlr_abonado,
    vlr_total
  ]);

  // Se formatea la fila agregada (última fila) como texto plano para evitar problemas con las fechas
  PEDIDOS_TABLE.getRange("A" + PEDIDOS_TABLE.getLastRow() + ":Z" + PEDIDOS_TABLE.getLastRow()).setNumberFormat("@");


  //---------------------------- Productos -----------------------------------

  let id_producto;
  let nombre;
  let cantidad;
  let vlr_unitario;
  let orientacion;
  let color;
  let tipo_diseño;
  let ruana;

  for (const [key, product] of Object.entries(data.products)) {

    id_producto = product.id_producto;
    nombre = product.nombre_producto;
    cantidad = product.cantidad;
    vlr_unitario = product.valor_unitario;

    if (product.orientacion !== undefined) {
      orientacion = product.orientacion;
    }
    else {
      orientacion = "-";
    }

    if (product.color !== undefined) {
      color = product.color;
    }
    else {
      color = "-";
    }

    if (product.tipo_diseño !== undefined) {
      tipo_diseño = product.tipo_diseño;
    }
    else {
      tipo_diseño = "-";
    }

    if (product.ruana !== undefined) {
      ruana = product.ruana;
    }
    else {
      ruana = "-";
    }

    PRODUCTOS_TABLE.appendRow([
      id_producto,
      id,
      nombre,
      cantidad,
      vlr_unitario,
      orientacion,
      color,
      tipo_diseño,
      ruana
    ]);

    // Se formatea la fila agregada (última fila) como texto plano
    PRODUCTOS_TABLE.getRange("A" + PRODUCTOS_TABLE.getLastRow() + ":Z" + PRODUCTOS_TABLE.getLastRow()).setNumberFormat("@");
  }

  //------------------------------ Abono -------------------------------------

  const id_abono = `${id}A1`;
  const vlr_abono = data.abono;

  ABONOS_TABLE.appendRow([
    id_abono,
    id,
    vlr_abono,
    fecha
  ]);

  // Se formatea la fila agregada (última fila) como texto plano
  ABONOS_TABLE.getRange("A" + ABONOS_TABLE.getLastRow() + ":Z" + ABONOS_TABLE.getLastRow()).setNumberFormat("@");

  return data;
}



/**
 * Lee la lista de productos
 * @returns lista de productos disponibles con sus características
 */
function readProductsList() {
  const dataProducts = PRODUCTS_LIST_TABLE.getDataRange().getDisplayValues();
  dataProducts.shift();

  if (dataProducts.length === 0) {
    return null;
  }
  else {
    return dataProducts;
  }
}



/**
 * Busca el último id registrado del cliente y le suma 1 para obtener el siguiente.
 * @returns último ID + 1
 */
function getLastClientId() {
  // No existe ningún registro
  if (PEDIDOS_TABLE.getLastRow() === 1) {
    return 1;
  }
  else {
    let id_actual = parseInt(PEDIDOS_TABLE.getRange(PEDIDOS_TABLE.getLastRow(), 1).getValues());
    return id_actual + 1;
  }
}


/**
 * -------------------------- BUSCAR VENTA FUNCTIONS --------------------------
 */

/**
 * Busca los pedidos en base a una palabra determinada.
 * ------- ojo -------
 * Busca el match textual, entonces debe formatearse para buscar un celular "322-522-3545", una fecha "2023-07-05" o un precio --> "12,000"
 * Hay q resolverlo desde el front
 * -------------------
 * @returns la lista de pedidos encontrados
 */
function lookForSale(searchText, maxResults) {

  const range = "A2:H";
  const sales = [];
  let rowList = [];

  // Busca todas las coincidencias

  if (isNaN(maxResults)) {

    // Se realiza una primera búsqueda comparando el searchText con el dato completo de cada celda
    const textFinder = PEDIDOS_TABLE.getRange(range)
      .createTextFinder(searchText).matchEntireCell(true);

    rowList = textFinder.findAll();

    // Si no hay coinciencias se realiza una búsqueda sin el matchEntireCell
    if (rowList.length === 0) {
      const textFinder = PEDIDOS_TABLE.getRange(range)
        .createTextFinder(searchText).matchEntireCell(false);

      rowList = textFinder.findAll();
    }

    // Se crea un objeto con los datos de las filas proporcionadas
    for (let i = 0; i < rowList.length; i++) {
      sales.push(PEDIDOS_TABLE.getRange(rowList[i].getRow(), 1, 1, PEDIDOS_TABLE.getLastColumn()).getValues()[0]);
    }
  }

  // Coinicidencias limitadas

  else {
    // Se realiza una primera búsqueda comparando el searchText con el dato completo de cada celda
    const textFinder = PEDIDOS_TABLE.getRange(range)
      .createTextFinder(searchText).matchEntireCell(true);

    let cell = textFinder.findNext();
    let count = 0;

    while (cell && count < maxResults) {
      rowList.push(cell.getRow());
      cell = textFinder.findNext();
      count++;
    }

    // Si no hay coinciencias se realiza una búsqueda sin el matchEntireCell
    if (rowList.length === 0) {
      const textFinder = PEDIDOS_TABLE.getRange(range)
        .createTextFinder(searchText).matchEntireCell(false);

      let cell = textFinder.findNext();
      let count = 0;

      while (cell && count < maxResults) {
        rowList.push(cell.getRow());
        cell = textFinder.findNext();
        count++;
      }
    }

    // Se crea un objeto con los datos de las filas proporcionadas
    for (let i = 0; i < rowList.length; i++) {
      sales.push(PEDIDOS_TABLE.getRange(rowList[i], 1, 1, PEDIDOS_TABLE.getLastColumn()).getValues()[0]);
    }
  }

  if (sales.length === 0) {
    return null;
  }
  else {
    return sales;
  }
}


/**
 * Entrega toda la información disponible de una venta dado un Id
 */
function showSaleById(saleId) {

  const sale = {};

  // --------------------------------- PEDIDOS -------------------------------------

  // Busco la fila con el id
  let rowPedidosTable = getRowById(saleId, PEDIDOS_TABLE);

  // Recupero los datos de la fila y genero un objeto con los datos
  if (rowPedidosTable.length !== 0) {

    // getRange("A row : lastColumn row")
    let rowPedido = PEDIDOS_TABLE.getRange(`A${rowPedidosTable[0]}:${String.fromCharCode(PEDIDOS_TABLE.getLastColumn() + 64)}${rowPedidosTable[0]}`).getValues();

    let pedido = {
      id: rowPedido[0][0],
      estado: rowPedido[0][1],
      fecha: rowPedido[0][2],
      cliente: rowPedido[0][3],
      celular: rowPedido[0][4],
      fechaEntrega: rowPedido[0][5],
      vlrAbonado: rowPedido[0][6],
      vlrTotal: rowPedido[0][7]
    }

    sale.pedido = pedido;
  }

  // --------------------------------- PRODUCTOS -------------------------------------

  // Busco la fila con el id
  let rowsProductosTable = getRowById(saleId, PRODUCTOS_TABLE);

  if (rowsProductosTable.length !== 0) {
    let rowsProductos = PRODUCTOS_TABLE.getRange(`A${rowsProductosTable[0]}:${String.fromCharCode(PRODUCTOS_TABLE.getLastColumn() + 64)}${rowsProductosTable[rowsProductosTable.length - 1]}`).getValues();

    let productos = {};

    for (let i = 0; i < rowsProductos.length; i++) {
      let producto = {
        id: rowsProductos[i][0],
        nombre: rowsProductos[i][2],
        cantidad: rowsProductos[i][3],
        vlrUnitario: rowsProductos[i][4],
        orientacion: rowsProductos[i][5],
        color: rowsProductos[i][6],
        tipoD: rowsProductos[i][7],
        ruana: rowsProductos[i][8]
      }
      productos[i] = producto;
    }
    sale.productos = productos;
  }

  // ----------------------------------- ABONOS --------------------------------------

  // Busco la fila con el id
  let rowsAbonosTable = getRowById(saleId, ABONOS_TABLE);

  if (rowsAbonosTable.length !== 0) {
    let rowsAbonos = ABONOS_TABLE.getRange(`A${rowsAbonosTable[0]}:${String.fromCharCode(ABONOS_TABLE.getLastColumn() + 64)}${rowsAbonosTable[rowsAbonosTable.length - 1]}`).getValues();

    let abonos = {};

    for (let i = 0; i < rowsAbonos.length; i++) {
      let abono = {
        id: rowsAbonos[i][0],
        vlr: rowsAbonos[i][2],
        fecha: rowsAbonos[i][3]
      }
      abonos[i] = abono;
    }
    sale.abonos = abonos;
  }

  return sale;
}


/**
 * Dada una tabla y un id entrega el número de la fila o el número de las filas que contienen dicho id
 */
function getRowById(id, table) {

  let range = `B2:B${table.getLastRow()}`;

  if (table === PEDIDOS_TABLE) {
    range = `A2:A${table.getLastRow()}`;
  }

  const rowsList = table.getRange(range)
    .createTextFinder(id)
    .matchEntireCell(true)
    .findAll()
    .map((r) => r.getRow());

  return rowsList;
}


/**
 * Actualiza los abonos y el estado del pedido que se modificó
 */
function updateShowSale(id, newState, newTotalAdvance, newAdvanceId, newAdvance, newAdvanceDate, sendNewAdvance) {


  let row = "";

  // Se actualiza tabla PEDIDO

  row = getRowById(id, PEDIDOS_TABLE);

  PEDIDOS_TABLE.getRange(row, 2).setValue(newState); // 2 - ESTADO
  PEDIDOS_TABLE.getRange(row, 7).setValue(newTotalAdvance); // 7 - VLR_ABONADO

  // Se actualiza tabla ABONOS si existe uno válido

  if (sendNewAdvance) {
    row = getRowById(id, ABONOS_TABLE);
    row = row[row.length - 1]
    let newValues = [newAdvanceId, id, newAdvance, newAdvanceDate];

    ABONOS_TABLE.insertRowAfter(row);
    ABONOS_TABLE.getRange(`A${row + 1}:D${row + 1}`).setValues([newValues]);
  }
}





