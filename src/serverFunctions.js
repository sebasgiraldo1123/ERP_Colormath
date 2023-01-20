
/**
 * Carga el http principal cuando se carga la página.
 * Esta función se ejecuta cuando un usuario entra al link de la webApp, muy parecido al Start( ) de Unity. 
 * @returns http principal evaluado.
 */
function doGet() {
    const html = HtmlService.createTemplateFromFile('src/components/app');
    const output = html.evaluate().setTitle('ERP Colormath');
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
