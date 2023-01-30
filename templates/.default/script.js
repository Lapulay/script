$(document).ready(function () {
    $("body .main-grid-cell-left[data-editable=\'true\']").on('input', 'input.main-grid-editor-text', function () {
        let elementId = $(this).prop('id');
        let allowableIDs = ['FIO_control', 'LEADER_control', 'DEPARTMENT_control'];
        if ($.inArray(elementId, allowableIDs) > -1) {
            makeSearchField(elementId, elementId === 'DEPARTMENT_control' ? structure : users);
        }
        BX.Grid.Row.prototype.getEditorValue = function getEditorValue() {
            var self = this;
            var cells = this.getCells();
            var editValues = {};
            var cellValues;
            [].forEach.call(cells, function (current) {
                cellValues = self.getCellEditorValue(current);
                if (BX.type.isArray(cellValues)) {
                    cellValues.forEach(function (cellValue) {
                        editValues[cellValue.NAME] = cellValue.VALUE !== undefined ? cellValue.VALUE : "";
                        if (cellValue.hasOwnProperty("RAW_NAME") && cellValue.hasOwnProperty("RAW_VALUE")) {
                            editValues[cellValue.NAME + "_custom"] = editValues[cellValue.NAME + "_custom"] || {};
                            editValues[cellValue.NAME + "_custom"][cellValue.RAW_NAME] = editValues[cellValue.NAME + "_custom"][cellValue.RAW_NAME] || cellValue.RAW_VALUE;
                        }
                    });
                } else if (cellValues) {
                    editValues[cellValues.NAME] = cellValues.VALUE !== undefined ? cellValues.VALUE : "";
                }
            });
            editValues['FIO'] = $("#FIO_control").val();
            editValues['LEADER'] = $("#LEADER_control").val();
            editValues['REESTR_DEPARTMENT'] = $("#DEPARTMENT_control").val();
            return editValues;
        }
    });
    BX.addCustomEvent('BX.Main.grid:paramsUpdated', BX.delegate(function () {
        $("body .main-grid-cell-left[data-editable=\'true\']").on('input', 'input.main-grid-editor-text', function () {
            let elementId = $(this).prop('id');
            let allowableIDs = ['FIO_control', 'LEADER_control', 'DEPARTMENT_control'];
            if ($.inArray(elementId, allowableIDs) > -1) {
                makeSearchField(elementId, elementId === 'DEPARTMENT_control' ? structure : users);
            }
        });
    }));
})

function makeSearchField(elementID, source) {
    $('#' + elementID).replaceWith('<select id=' + elementID + ' class="selectpicker form-control"' +
        'data-dropup-auto="false" data-size="5" title="Выбрать"' +
        'data-live-search="true" data-live-search-placeholder="Найти"' +
        'name="FIO"' +
        '</select>'
    )
    let select = $('select#' + elementID)
    let propertyName = elementID === 'DEPARTMENT_control' ? 'NAME' : 'USER_INFO';
    $.each(source, function (optionId, optionValue) {
        select.append('<option value="' + optionId + '"> ' + optionValue[propertyName] + '</option>')
    });
    select.selectpicker('refresh');
}