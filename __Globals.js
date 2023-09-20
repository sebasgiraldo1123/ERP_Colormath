//---------------- Data ERP Colormath ------------------------

const BD_ID = '';
const DATA_ERP_COLORMATH = SpreadsheetApp.openById(BD_ID);

// Tablas de la BD
const PEDIDOS_TABLE = DATA_ERP_COLORMATH.getSheetByName('PEDIDOS');
const PRODUCTOS_TABLE = DATA_ERP_COLORMATH.getSheetByName('PRODUCTOS');
const ABONOS_TABLE = DATA_ERP_COLORMATH.getSheetByName('ABONOS');


//------------- Price Admin ERP Colormath ---------------------

const PRICE_ID = '';
const PRICE_ADMIN_ERP_COLORMATH = SpreadsheetApp.openById(PRICE_ID);

// Tabla de Precios
const PRODUCTS_LIST_TABLE = PRICE_ADMIN_ERP_COLORMATH.getSheetByName('LISTA_PRODUCTOS');


