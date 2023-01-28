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
