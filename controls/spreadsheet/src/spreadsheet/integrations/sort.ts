import { Spreadsheet, ICellRenderer, initiateCustomSort, locale, dialog } from '../index';
import { sortComplete, validateSortRange, beforeSort, getFormattedCellObject } from '../../workbook/common/event';
import { getIndexesFromAddress, getSwapRange, SheetModel, getCell, getColumnHeaderText, CellModel } from '../../workbook/index';
import { SortEventArgs, BeforeSortEventArgs } from '../../workbook/common/interface';
import { L10n, getUniqueID, getComponent, enableRipple } from '@syncfusion/ej2-base';
import { Dialog } from '../services';
import { DropDownList, ChangeEventArgs as DropdownChangeEventArgs, FieldSettingsModel } from '@syncfusion/ej2-dropdowns';
import { RadioButton, CheckBox, ChangeEventArgs as CheckBoxChangeEventArgs, ChangeArgs } from '@syncfusion/ej2-buttons';
import { ListView } from '@syncfusion/ej2-lists';

/**
 * `Sort` module is used to handle the sort action in Spreadsheet.
 */
export class Sort {
    private parent: Spreadsheet;

    /**
     * Constructor for sort module.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * To destroy the sort module.
     * @return {void}
     */
    protected destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(validateSortRange, this.validateSortRange, this);
        this.parent.on(beforeSort, this.beforeSortHandler, this);
        this.parent.on(sortComplete, this.sortComplete, this);
        this.parent.on(initiateCustomSort, this.initiateCustomSort, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(validateSortRange, this.validateSortRange);
            this.parent.off(beforeSort, this.beforeSortHandler);
            this.parent.off(sortComplete, this.sortComplete);
            this.parent.off(initiateCustomSort, this.initiateCustomSort);
        }
    }

    /**
     * Gets the module name.
     * @returns string
     */
    protected getModuleName(): string {
        return 'sort';
    }

    /**
     * Validates the range to be sorted.
     */
    private validateSortRange(args: { [key: string]: string | boolean }): void {
        args.isValid = this.showRangeAlert(args.range as string);
    }

    /**
     * Validates the range and shows the alert dialog and return true when invalid.
     * @param address - range address.
     */
    private showRangeAlert(address?: string): boolean {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let sheet: SheetModel = this.parent.getActiveSheet();
        let rangeStr: string = address || sheet.selectedRange;
        let range: number[] = getSwapRange(getIndexesFromAddress(rangeStr));
        if (range[0] > sheet.usedRange.rowIndex - 1 || range[1] > sheet.usedRange.colIndex) {
            (this.parent.serviceLocator.getService(dialog) as Dialog).show({
                height: 180, width: 400, isModal: true, showCloseIcon: true,
                content: l10n.getConstant('SortOutOfRangeError')
            });
            this.parent.hideSpinner();
            return false;
        }
        return true;
    }

    /**
     * Initiates sort process.
     */
    private beforeSortHandler(args: BeforeSortEventArgs): void {
        this.parent.showSpinner();
    }

    /**
     * Invoked when the sort action is completed.
     */
    private sortComplete(args: SortEventArgs): void {
        let range: number[] = getIndexesFromAddress(args.range);
        this.parent.serviceLocator.getService<ICellRenderer>('cell').refreshRange(range);
        this.parent.hideSpinner();
    }

    /**
     * Initiates the custom sort dialog.
     */
    private initiateCustomSort(): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        if (!this.showRangeAlert()) { return; }
        let dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        dialogInst.show({
            height: 400, width: 560, isModal: true, showCloseIcon: true, cssClass: 'e-customsort-dlg',
            header: l10n.getConstant('CustomSort'),
            beforeOpen: (): void => {
                dialogInst.dialogInstance.content = this.customSortContent(); dialogInst.dialogInstance.dataBind();
                this.parent.element.focus();
            },
            buttons: [{
                buttonModel: {
                    content: (this.parent.serviceLocator.getService(locale) as L10n).getConstant('Ok'), isPrimary: true
                },
                click: (): void => {
                    let element: HTMLElement = dialogInst.dialogInstance.content as HTMLElement;
                    let list: HTMLElement = element.getElementsByClassName('e-list-sort e-listview e-lib')[0] as HTMLElement;
                    let listview: ListView = getComponent(list, 'listview') as ListView;
                    let data: { [key: string]: string }[] = listview.dataSource as { [key: string]: string }[];
                    this.clearError();
                    let errorElem: HTMLElement = element.getElementsByClassName('e-sort-error')[0] as HTMLElement;
                    errorElem.style.display = 'block';
                    if (!this.validateError(data, element, errorElem)) {
                        dialogInst.hide();
                        let headercheck: HTMLElement = element.getElementsByClassName('e-sort-checkheader')[0] as HTMLElement;
                        let headerCheckbox: CheckBox = getComponent(headercheck, 'checkbox') as CheckBox;
                        let hasHeader: boolean = headerCheckbox.checked;
                        this.parent.sort({ sortDescriptors: data, containsHeader: hasHeader });
                    }
                }
            }]
        });
    }

    /**
     * Validates the errors of the sort criteria and displays the error.
     * @param json - listview datasource.
     * @param dialogElem - dialog content element.
     * @param errorElem - element to display error.
     */
    private validateError(json: { [key: string]: string }[], dialogElem: HTMLElement, errorElem: HTMLElement): boolean {
        //1. All sort criteria must have a column specified. Check the selected sort criteria and try again.
        //2. Column B is being sorted by values more than once. Delete the duplicate sort criteria and try again.
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let hasEmpty: boolean = json.some((element: { [key: string]: string }) => element.field.toString() === '');
        if (hasEmpty) {
            Array.prototype.some.call(dialogElem.getElementsByClassName('e-sort-field'), (dropDown: HTMLElement) => {
                let hasError: boolean = !(<DropDownList>getComponent(dropDown, 'dropdownlist')).value;
                if (hasError) {
                    dropDown.parentElement.classList.add('e-error');
                }
                return hasError; //breaks the loop if only one error added.
            });
            errorElem.innerText = l10n.getConstant('SortEmptyFieldError');
            return true;
        }
        let temp: Set<string> = new Set();
        let duplicateField: string = '';
        let hasDuplicate: boolean = json.some((element: { [key: string]: string }) => {
            duplicateField = element.field.toString();
            return temp.size === temp.add(element.field).size;
        });
        let errorField: string = '';
        if (hasDuplicate) {
            let count: number = 0;
            Array.prototype.some.call(dialogElem.getElementsByClassName('e-sort-field'), (dropDown: HTMLElement) => {
                let dropDownList: DropDownList = <DropDownList>getComponent(dropDown, 'dropdownlist');
                if (dropDownList.value === duplicateField) {
                    dropDown.parentElement.classList.add('e-error');
                    errorField = dropDownList.text;
                    count++;
                }
                return count === 2; //breaks the loop when 2 errors added.
            });
            errorElem.innerHTML = '<strong>' + errorField + '</strong>' + l10n.getConstant('SortDuplicateFieldError');
            return true;
        }
        return false;
    }

    /**
     * Creates all the elements and generates the dialog content element.
     */
    private customSortContent(): HTMLElement {
        let dialogElem: HTMLElement = this.parent.createElement('div', { className: 'e-sort-dialog' });

        let fields: { [key: string]: string }[] = this.getFields();
        let listId: string = getUniqueID('customSort');
        let listviewObj: ListView = this.getCustomListview(listId);
        this.setHeaderTab(dialogElem, listviewObj, fields);
        let contentElem: HTMLElement = this.parent.createElement('div', {
            className: 'e-sort-listsection',
            styles: ''
        });
        dialogElem.appendChild(contentElem);

        let listview: HTMLElement = this.parent.createElement('div', { className: 'e-list-sort', styles: '' });
        contentElem.appendChild(listview);
        listviewObj.createElement = this.parent.createElement;
        listviewObj.appendTo(listview);
        this.renderListItem(listId, listviewObj, true, fields);

        let errorElem: HTMLElement = this.parent.createElement('div', { className: 'e-sort-error' });
        dialogElem.appendChild(errorElem);

        return dialogElem;
    }

    /**
     * Gets the fields data from the selected range.
     */
    private getFields(): { [key: string]: string }[] {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let range: number[] = getSwapRange(getIndexesFromAddress(sheet.selectedRange));

        if (range[0] === range[2] && (range[2] - range[0]) === 0) { //for entire range
            range[0] = 0; range[1] = 0; range[3] = sheet.usedRange.colIndex;
        }
        let fields: { [key: string]: string }[] = [];
        let fieldName: string;
        for (range[1]; range[1] <= range[3]; range[1]++) {
            let cell: CellModel = getCell(range[0], range[1], sheet);
            if (cell && cell.value) {
                let eventArgs: { [key: string]: string | number | boolean } = {
                    formattedText: cell.value,
                    value: cell.value,
                    format: cell.format,
                    onLoad: true
                };
                if (cell.format) {
                    this.parent.notify(getFormattedCellObject, eventArgs);
                }
                fieldName = eventArgs.formattedText as string;
            } else {
                fieldName = 'Column ' + getColumnHeaderText(range[1] + 1);
            }
            fields.push({ text: fieldName, value: 'Column ' + getColumnHeaderText(range[1] + 1) });
        }
        return fields;
    }

    /**
     * Creates the header tab for the custom sort dialog.
     * @param dialogElem - dialog content element.
     * @param listviewObj - listview instance.
     * @param fields - fields data.
     */
    private setHeaderTab(dialogElem: HTMLElement, listviewObj: ListView, fields: { [key: string]: string }[]): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let headerTabElement: HTMLElement = this.parent.createElement('div', {
            className: 'e-sort-header',
            styles: '',
            innerHTML: ''
        });
        dialogElem.appendChild(headerTabElement);
        let addButton: HTMLElement = this.parent.createElement('button', {
            className: 'e-btn e-sort-addbtn e-flat',
            innerHTML: l10n.getConstant('AddColumn')
        });
        let footer: Element = this.parent.element.querySelector('.e-customsort-dlg .e-footer-content');
        footer.insertBefore(addButton, footer.firstElementChild);
        addButton.addEventListener('click', () => {
            if (listviewObj) {
                let listId: string = getUniqueID('customSort');
                listviewObj.addItem([{ id: listId, text: l10n.getConstant('ThenBy'), field: '', order: 'ascending' }]);
                this.renderListItem(listId, listviewObj, checkHeaderObj.checked, fields, true);
            }
        });
        let checkHeaderObj: CheckBox = new CheckBox({
            label: l10n.getConstant('ContainsHeader'),
            checked: true,
            change: (args: CheckBoxChangeEventArgs) => {
                let fieldsMap: FieldSettingsModel = args.checked ? { text: 'text', value: 'value' } : { text: 'value' };
                Array.prototype.forEach.call(
                    dialogElem.getElementsByClassName('e-sort-field e-dropdownlist e-lib'),
                    (dropDown: HTMLElement) => {
                        let dropDownListObj: DropDownList = getComponent(dropDown, 'dropdownlist') as DropDownList;
                        dropDownListObj.dataSource = null; //reset datasource.
                        dropDownListObj.dataSource = fields;
                        dropDownListObj.fields = fieldsMap;
                        dropDownListObj.dataBind();
                    });
            },
            cssClass: 'e-sort-headercheckbox'
        });
        let headerCheckbox: HTMLElement = this.parent.createElement('input', {
            className: 'e-sort-checkheader', attrs: { type: 'checkbox' }
        });
        headerTabElement.appendChild(headerCheckbox);
        checkHeaderObj.createElement = this.parent.createElement;
        checkHeaderObj.appendTo(headerCheckbox);
    }

    /**
     * Creates a listview instance.
     * @param listId - unique id of the list item.
     */
    private getCustomListview(listId: string): ListView {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let data: { [key: string]: string; }[] = [{ id: listId, text: l10n.getConstant('SortBy'), field: '', order: 'ascending' }];
        enableRipple(false);
        let listviewObj: ListView = new ListView({
            dataSource: data,
            fields: { id: 'id' },
            height: '100%',
            template: '<div class="e-sort-listwrapper">' +
                '<span class="text">${text}</span>' +
                '<div class="e-sort-row"><div class="e-sort-field"></div>' +
                '<div class="e-sort-order">' +
                '<span class="e-sort-ordertxt" style="display:none;">${order}</span></div>' +
                '<span class="e-icons e-sort-delete"></span></div>',
            cssClass: 'e-sort-template',
        });
        return listviewObj;
    }

    /**
     * Triggers the click event for delete icon.
     * @param element - current list item element.
     * @param listviewObj - listview instance.
     */
    private deleteHandler(element: Element, listviewObj: ListView): void {
        let iconEle: Element = element.getElementsByClassName('e-sort-delete')[0];
        //Event handler to bind the click event for delete icon
        iconEle.addEventListener('click', (): void => {
            if (element) {
                listviewObj.removeItem(element);
            }
        });
    }

    /**
     * Renders the dropdown and radio button components inside list item.
     * @param id - unique id of the list item.
     * @param listviewObj - listview instance.
     * @param containsHeader - data contains header.
     * @param fields - fields data.
     */
    private renderListItem(id: string, lvObj: ListView, containsHeader: boolean, fields: { [key: string]: string }[], btn?: boolean): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let element: Element = lvObj.element.querySelector('li[data-uid=' + id + ']');
        let fieldsMap: FieldSettingsModel = containsHeader ? { text: 'text', value: 'value' } : { text: 'value' };
        let dropDown: Element = element.getElementsByClassName('e-sort-field')[0];
        let dropDownListObj: DropDownList = new DropDownList({
            dataSource: fields,
            width: 'auto',
            fields: fieldsMap,
            placeholder: l10n.getConstant('SelectAColumn'),
            change: (args: DropdownChangeEventArgs) => {
                if (!args.value) { return; }
                Array.prototype.some.call(lvObj.dataSource, (item: { [key: string]: string }) => {
                    if (item.id === id) {
                        item.field = args.value as string;
                    }
                    return item.id === id; //breaks the loop when proper id found
                });
                this.clearError();
            }
        });
        dropDownListObj.createElement = this.parent.createElement;
        dropDownListObj.appendTo(dropDown as HTMLElement);
        if (!btn) {
            dropDownListObj.index = 0;
        }

        /* sort ascending radio button */
        let orderRadio: Element = element.getElementsByClassName('e-sort-order')[0];
        let ordertxtElem: HTMLElement = orderRadio.getElementsByClassName('e-sort-ordertxt')[0] as HTMLElement;
        let isAscending: boolean = ordertxtElem.innerText.toLocaleLowerCase() === 'ascending';
        let radiobutton: RadioButton = new RadioButton({
            label: l10n.getConstant('SortAscending'),
            name: 'sortAZ_' + id, value: 'ascending', checked: isAscending, cssClass: 'e-sort-radiobutton',
            change: (args: ChangeArgs) => { this.setRadioBtnValue(lvObj, id, args.value); }
        });
        let radio: HTMLElement = this.parent.createElement('input', {
            id: 'orderAsc_' + id, className: 'e-sort-radioasc', styles: '', attrs: { type: 'radio' }
        });
        orderRadio.appendChild(radio);
        radiobutton.createElement = this.parent.createElement;
        radiobutton.appendTo(radio);
        /* sort descending radio button */
        let radiobutton2: RadioButton = new RadioButton({
            label: l10n.getConstant('SortDescending'),
            name: 'sortAZ_' + id, value: 'descending', checked: !isAscending, cssClass: 'e-sort-radiobutton',
            change: (args: ChangeArgs) => { this.setRadioBtnValue(lvObj, id, args.value); }
        });
        let radio2: HTMLElement = this.parent.createElement('input', {
            id: 'orderDesc_' + id, className: 'e-sort-radiodesc', styles: '', attrs: { type: 'radio' }
        });
        orderRadio.appendChild(radio2);
        radiobutton2.createElement = this.parent.createElement;
        radiobutton2.appendTo(radio2);

        this.deleteHandler(element, lvObj);
    }

    /**
     * Sets the new value of the radio button.
     * @param listviewObj - listview instance.
     * @param id - unique id of the list item.
     * @param value - new value.
     */
    private setRadioBtnValue(listviewObj: ListView, id: string, value: string): void {
        if (!value) { return; }
        Array.prototype.some.call(listviewObj.dataSource, (item: { [key: string]: string }) => {
            if (item.id === id) {
                item.order = value;
            }
            return item.id === id; //breaks the loop when proper id found
        });
    }

    /**
     * Clears the error from the dialog.
     * @param dialogElem - dialog content element.
     */
    private clearError(): void {
        let dialogElem: HTMLElement = document.getElementsByClassName('e-sort-dialog')[0] as HTMLElement;
        let errorElem: HTMLElement = dialogElem.getElementsByClassName('e-sort-error')[0] as HTMLElement;
        if (errorElem.style.display !== 'none' && errorElem.innerHTML !== '') {
            errorElem.style.display = 'none';
            Array.prototype.forEach.call(dialogElem.getElementsByClassName('e-error'), (element: HTMLElement) => {
                element.classList.remove('e-error');
            });
        }
    }
}