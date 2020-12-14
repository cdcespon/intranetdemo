// Dispara el evento de carga de solapa de reporte para el listener de default.aspx
function raiseevent(report) {
    parent.$(parent.document).trigger('reporttab', report);
}
