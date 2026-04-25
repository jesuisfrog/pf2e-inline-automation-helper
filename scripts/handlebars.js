export function registerHandlebarsHelpers() {

    Handlebars.registerHelper("t", function (e) {
        return game.i18n.localize(`PF2EIAH.${e}.Title`);
    });

}