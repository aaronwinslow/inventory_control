/*----------------------------------------------------
 vm.checkQuantityRangeObj

 Description
     check range of a number on an object

 Params
     item - object containing number
     field - string name of property for number
     min - min value
     max - max value
     defaultNaN - default value if number is not a number
     allowEmpty - allow the empty string for the value

 Example: place this as attribute on input element

    ng-change="checkQuantityRangeObj(iteml, 'quantityOnPallet', 1, item.quantityPerPallet, item.quantityPerPallet, true)"

 */
vm.checkQuantityRangeObj = function (item, field, min, max, defaultNaN, allowEmpty) {
    var quantity = item[field];
    var quantityNum = quantity / 1;

    if (quantity == '' && allowEmpty) {
        item[field] = '';
    }
    else if (isNaN(quantityNum)) {
        item[field] = defaultNaN;
    }
    else if (quantityNum < min) {
        item[field] = min;
    }
    else if (quantityNum > max) {
        item[field] = max;
    }
}
