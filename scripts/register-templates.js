export function registerTemplates() {

    const MODULE_ID = "pf2e-inline-automation-helper";
    const templatePaths = [
        `modules/${MODULE_ID}/templates/inline-check.hbs`,
        `modules/${MODULE_ID}/templates/inline-damage.hbs`,
        `modules/${MODULE_ID}/templates/inline-roll.hbs`,
        `modules/${MODULE_ID}/templates/inline-template.hbs`,
    ];

    foundry.applications.handlebars.loadTemplates(templatePaths);
}