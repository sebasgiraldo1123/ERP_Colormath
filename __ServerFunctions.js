/**
 * Carga el http principal cuando se carga la página.
 * Esta función se ejecuta cuando un usuario entra al link de la webApp, muy parecido al Start( ) de Unity. 
 * @returns http principal evaluado.
 */
function doGet() {
  const html = HtmlService.createTemplateFromFile('_app');

  const output = html.evaluate()
    .setTitle('ERP Colormath')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  return output;
}

/**
 * Scriptlets
 * Toma el contenido de cualquier archivo y lo inserta en otro.
 * @param {nombre del archivo a incluir en el http} fileName 
 * @returns contenido del archivo
 */
function include(fileName) {
  return HtmlService.createHtmlOutputFromFile(fileName).getContent();
}



/**
 * Carga la información del flujo de caja en Data_ERP_Colormath
 * 
 * Ojo...... -> se borra toda la data y se reemplaza por que que está en el flujo de caja, haga un backup de Data_ERP_Colormath antes de usar está función
 */

function loadAllData() {

  // Time
  var startTime = new Date();

  //deleteDataTable(PEDIDOS_TABLE);
  //deleteDataTable(PRODUCTOS_TABLE);
  //deleteDataTable(ABONOS_TABLE);

  loadData(0, 1306-3); // última fila - 3

  // Time
  var endTime = new Date();
  console.log("time : ", endTime - startTime);

  //  ........ No olvides convertir todo a texto plano

}

function loadData(start, end) {

  const idFlujoCaja = '1OhU5Fz_L773P0YfNvrUns1rCxMuT0rtZcZ89dJiMqIg';
  const flujoCaja = SpreadsheetApp.openById(idFlujoCaja);
  const ventas = flujoCaja.getSheetByName('Ventas');
  const dataFlujoCaja = ventas.getRange('A4:AC').getValues();
  let i = start;

  let pedidosData = [];
  let productosData = [];
  let abonosData = [];

  // -------------------------- Pedidos ----------------------------

  let id;
  let estado;
  let fecha;
  let cliente;
  let celular;
  let fecha_entrega;
  let vlr_abonado;
  let vlr_total;

  // -------------------------- Productos ----------------------------

  let id_producto;
  let nombre;
  let cantidad;
  let vlr_unitario;
  let orientacion;
  let color;
  let tipo_diseño;
  let ruana;

  // -------------------------- Abonos ----------------------------

  let id_abono;
  let vlr_abono;


  while (i < end) {

    // -------------------------- Pedidos ----------------------------

    id = dataFlujoCaja[i][1];
    estado = dataFlujoCaja[i][0];


    try {
      // Se formatea la fecha AAAA-MM-DD
      fecha = formatDate(dataFlujoCaja[i][2]);
    }
    catch {
      fecha = "-";
    }

    cliente = dataFlujoCaja[i][3];
    celular = "";
    fecha_entrega = "2023-08-26";
    vlr_abonado = formatValue(dataFlujoCaja[i][27]);
    vlr_total = formatValue(dataFlujoCaja[i][28]);


    pedidosData.push([
      id,
      estado,
      fecha,
      cliente,
      celular,
      fecha_entrega,
      vlr_abonado,
      vlr_total
    ]);


    // -------------------------- Productos ----------------------------

    id_producto = id + "P0";
    nombre = dataFlujoCaja[i][5].toString().toUpperCase();
    cantidad = dataFlujoCaja[i][7];
    vlr_unitario = formatValue(dataFlujoCaja[i][6]);
    orientacion = "-";
    color = "-";
    tipo_diseño = "-";
    ruana = "-";

    productosData.push([
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


    if (dataFlujoCaja[i][9] !== "") {

      id_producto = id + "P1";
      nombre = dataFlujoCaja[i][9].toString().toUpperCase();
      cantidad = dataFlujoCaja[i][11];
      vlr_unitario = formatValue(dataFlujoCaja[i][10]);
      orientacion = "-";
      color = "-";
      tipo_diseño = "-";
      ruana = "-";

      productosData.push([
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
    }

    // -------------------------- Abonos ----------------------------

    id_abono = id + "A0";
    vlr_abono = formatValue(dataFlujoCaja[i][27]);

    abonosData.push([
      id_abono,
      id,
      vlr_abono,
      fecha
    ]);

    i++;
  }

  PEDIDOS_TABLE.getRange(`A2:H${pedidosData.length + 1}`).setValues(pedidosData);
  PEDIDOS_TABLE.getRange("A2" + ":Z" + PEDIDOS_TABLE.getLastRow()).setNumberFormat("@");

  PRODUCTOS_TABLE.getRange(`A2:I${productosData.length + 1}`).setValues(productosData);
  PRODUCTOS_TABLE.getRange("A2" + ":Z" + PRODUCTOS_TABLE.getLastRow()).setNumberFormat("@");

  ABONOS_TABLE.getRange(`A2:D${abonosData.length + 1}`).setValues(abonosData);
  ABONOS_TABLE.getRange("A2" + ":Z" + ABONOS_TABLE.getLastRow()).setNumberFormat("@");

  console.log(i + " Registros ingresados");

}


/**
 * Elimina toda la información de una tabla excepto el encabezado
 */
function deleteDataTable(table) {
  table.getRange('A2:Z').clearContent();
}

/**
 * Formatea la fecha dada con el formato AAAA-MM-DD
 */
function formatDate(date) {
  let numberMonth = date.getMonth() + 1;
  let month = (numberMonth < 10 ? "0" : "") + numberMonth.toString();
  return date.getFullYear() + "-" + (month) + "-" + date.getDate();
}

/**
 * Formatea un valor para tener una coma "," separando los miles
 */
function formatValue(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}




