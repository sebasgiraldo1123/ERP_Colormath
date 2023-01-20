const BD_ID = '1BYXFtDEnkaH2dNwD89MYIadp-JYcYobmwYHkE79oR5I';
const DATA_ERP_COLORMATH = SpreadsheetApp.openById(BD_ID);

// Tablas de la BD
const PEDIDOS_TABLE = DATA_ERP_COLORMATH.getSheetByName('PEDIDOS');
