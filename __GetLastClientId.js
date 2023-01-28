/**
 * Busca el último id registrado del cliente y le suma 1 para obtener el siguiente.
 * @returns último ID + 1
 */
function getLastClientId() {
    // No existe ningún registro
    if (PEDIDOS_TABLE.getLastRow() === 1) {
        return ID_Cliente_Inicial;
    }
    else {
        let id_actual = parseInt(PEDIDOS_TABLE.getRange(PEDIDOS_TABLE.getLastRow(), 1).getValues());
        return id_actual + 1;
    }
}
