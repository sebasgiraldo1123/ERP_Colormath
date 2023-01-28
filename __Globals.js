//---------------- Data ERP Colormath ------------------------

const BD_ID = '1BYXFtDEnkaH2dNwD89MYIadp-JYcYobmwYHkE79oR5I';
const DATA_ERP_COLORMATH = SpreadsheetApp.openById(BD_ID);

// Tablas de la BD
const PEDIDOS_TABLE = DATA_ERP_COLORMATH.getSheetByName('PEDIDOS');


//------------- Price Admin ERP Colormath ---------------------

const PRICE_ID = '1H-KPUe-9E6-EblhPDo1eX3YHcVwInThHpeN2TF2fI1w';
const PRICE_ADMIN_ERP_COLORMATH = SpreadsheetApp.openById(PRICE_ID);

// Tabla de Precios
const PRODUCTS_LIST_TABLE = PRICE_ADMIN_ERP_COLORMATH.getSheetByName('LISTA_PRODUCTOS');


