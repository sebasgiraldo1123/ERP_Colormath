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
    // Formateo el mes para que tenga la forma "01" si es menor que 10
    let date = new Date();
    let numberMonth = date.getMonth() + 1;
    let month = (numberMonth < 10 ? "0" : "") + numberMonth.toString();
    const fecha = date.getFullYear() + "-" + (month) + "-" + date.getDate();

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

    // Se formatea la fila agregada (última fila) como texto plano
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

    ABONOS_TABLE.getRange("A" + ABONOS_TABLE.getLastRow() + ":Z" + ABONOS_TABLE.getLastRow()).setNumberFormat("@");

    return data;
}



/**
 * Lee la lista de productos
 * @returns 
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
 * -------------------------- BUSCAR Y EDITAR VENTAS FUNCTIONS --------------------------
 */

/**
 * Busca los pedidos en base a una palabra determinada.
 * ------- ojo -------
 * Busca el match textual, entonces debe formatearse para buscar un celular "322-522-3545", una fecha "2023-07-05" o un precio --> "12,000"
 * Hay q resolverlo desde el front
 * -------------------
 * @returns la lista de pedidos encontrados
 */
function lookForSale() {

    const searchText = "TEST";
    const range = "A2:H";
    const sales = [];

    // Se obtiene la lista de indices de filas que cumplen con la descripción
    const rowList = PEDIDOS_TABLE.getRange(range)
        .createTextFinder(searchText)
        .matchEntireCell(false)
        .findAll()
        .map((r) => r.getRow());

    // Se crea un objeto con los datos de las filas proporcionadas
    for (let i = 0; i < rowList.length; i++) {
        sales.push(PEDIDOS_TABLE.getRange(rowList[i], 1, 1, PEDIDOS_TABLE.getLastColumn()).getValues()[0]);
    }

    console.log(sales);

    if (sales.length === 0) {
        return 0;
    }
    else {
        return sales;
    }
}



