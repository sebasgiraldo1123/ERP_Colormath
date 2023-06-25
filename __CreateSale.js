/**
 * Registra una nueva venta dentro del spreadsheet
 * @param {*} data 
 */
function createSale(data) {

    //---------------------------- Pedido -----------------------------------
    const id = data.id_cliente;
    const estado = "EN PROCESO";

    let date = new Date();

    // Formateo el mes para que tenga la forma "01" si es menor que 10
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


    //---------------------------- Productos -----------------------------------

    let id_producto;
    let nombre;
    let cantidad;
    let vlr_unitario;
    let orientacion;
    let color;
    let tipo_diseño;

    for (const [key, product] of Object.entries(data.products)) {

        id_producto = product.id_producto;
        nombre = product.nombre_producto;
        cantidad = product.cantidad;
        vlr_unitario = product.valor_unitario;

        if(product.orientacion !== undefined){
            orientacion = product.orientacion;
        }
        else{
            orientacion = "-";
        }

        if(product.color !== undefined){
            color = product.color;
        }
        else{
            color = "-";
        }

        if(product.tipo_diseño !== undefined){
            tipo_diseño = product.tipo_diseño;
        }
        else{
            tipo_diseño = "-";
        }

        PRODUCTOS_TABLE.appendRow([
            id_producto,
            id,
            nombre,
            cantidad,
            vlr_unitario,
            orientacion,
            color,
            tipo_diseño
          ]);
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
    
    return data;
}
