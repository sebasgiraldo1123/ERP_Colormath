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

  //deleteDataTable(PEDIDOS_TABLE);
  //deleteDataTable(PRODUCTOS_TABLE);
  //deleteDataTable(ABONOS_TABLE);

  //0-1131

  //loadData(0, 200);
  //loadData(200, 400);
  //loadData(400, 600);
  //loadData(600, 800);
  //loadData(800, 1000);
  //loadData(1000, 1131);

}

function loadData(start, end) {

  const idFlujoCaja = '1OhU5Fz_L773P0YfNvrUns1rCxMuT0rtZcZ89dJiMqIg';
  const flujoCaga = SpreadsheetApp.openById(idFlujoCaja);
  const ventas = flujoCaga.getSheetByName('Ventas');
  const dataFlujoCaja = ventas.getRange('A4:AC').getValues();

  let i = start;

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
    fecha_entrega = "2023-07-28";
    vlr_abonado = formatValue(dataFlujoCaja[i][27]);
    vlr_total = formatValue(dataFlujoCaja[i][28]);

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
    //PEDIDOS_TABLE.getRange("A" + PEDIDOS_TABLE.getLastRow() + ":Z" + PEDIDOS_TABLE.getLastRow()).setNumberFormat("@");

    // -------------------------- Productos ----------------------------

    id_producto = id + "P0";
    nombre = dataFlujoCaja[i][5].toString().toUpperCase();
    cantidad = dataFlujoCaja[i][7];
    vlr_unitario = formatValue(dataFlujoCaja[i][6]);
    orientacion = "-";
    color = "-";
    tipo_diseño = "-";
    ruana = "-";

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
    //PRODUCTOS_TABLE.getRange("A" + PRODUCTOS_TABLE.getLastRow() + ":Z" + PRODUCTOS_TABLE.getLastRow()).setNumberFormat("@");

    if (dataFlujoCaja[i][9] !== "") {

      id_producto = id + "P1";
      nombre = dataFlujoCaja[i][9].toString().toUpperCase();
      cantidad = dataFlujoCaja[i][11];
      vlr_unitario = formatValue(dataFlujoCaja[i][10]);
      orientacion = "-";
      color = "-";
      tipo_diseño = "-";
      ruana = "-";

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
      //PRODUCTOS_TABLE.getRange("A" + PRODUCTOS_TABLE.getLastRow() + ":Z" + PRODUCTOS_TABLE.getLastRow()).setNumberFormat("@");
    }

    // -------------------------- Abonos ----------------------------

    id_abono = id + "A0";
    vlr_abono = formatValue(dataFlujoCaja[i][27]);

    ABONOS_TABLE.appendRow([
      id_abono,
      id,
      vlr_abono,
      fecha
    ]);

    // Se formatea la fila agregada (última fila) como texto plano
    //ABONOS_TABLE.getRange("A" + ABONOS_TABLE.getLastRow() + ":Z" + ABONOS_TABLE.getLastRow()).setNumberFormat("@");

    i++;
  }

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




