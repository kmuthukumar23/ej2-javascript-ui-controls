import { createElement, removeClass, addClass, remove, isNullOrUndefined, setStyleAttribute } from '@syncfusion/ej2-base';
import { PivotCommon } from '../base/pivot-common';
import * as cls from '../base/css-constant';
import {
    TreeView, NodeCheckEventArgs, Tab, TabItemModel, EJ2Instance, NodeClickEventArgs, NodeExpandEventArgs
} from '@syncfusion/ej2-navigations';
import { Dialog } from '@syncfusion/ej2-popups';
import { MaskedTextBox, MaskChangeEventArgs, NumericTextBox, ChangeEventArgs as NumericChangeEventArgs } from '@syncfusion/ej2-inputs';
import { setStyleAndAttributes } from '@syncfusion/ej2-grids';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { IFilter, IFieldOptions, IFormatSettings } from '../../base/engine';
import { Operators, FilterType } from '../../base/types';
import { ChangedEventArgs, DateTimePicker } from '@syncfusion/ej2-calendars';
import { ItemModel, DropDownButton, BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { OlapEngine, IOlapField } from '../../base/olap/engine';
import { PivotUtil } from '../../base/util';

/**
 * `FilterDialog` module to create filter dialog.
 */

export class FilterDialog {
    public parent: PivotCommon;

    public dropMenu: DropDownButton;

    public memberTreeView: TreeView;

    public allMemberSelect: TreeView;

    public editorSearch: MaskedTextBox;

    public dialogPopUp: Dialog;

    public tabObj: Tab;

    public allowExcelLikeFilter: boolean;

    public isSearchEnabled: boolean;
    public filterObject: IFilter;
    /* tslint:disable-next-line:no-any */
    private timeOutObj: any;

    /**
     * Constructor for the dialog action.

     */
    constructor(parent?: PivotCommon) {
        this.parent = parent;
    }

    /**
     * Creates the member filter dialog for the selected field.
     * @method createFilterDialog
     * @return {void}

     */
    public createFilterDialog(treeData: { [key: string]: Object }[], fieldName: string, fieldCaption: string, target: HTMLElement): void {
        let editorDialog: HTMLElement = createElement('div', {
            id: this.parent.parentID + '_EditorTreeView',
            className: cls.MEMBER_EDITOR_DIALOG_CLASS + ' ' + (this.parent.dataType === 'olap' ? 'e-olap-editor-dialog' : ''),
            attrs: { 'data-fieldName': fieldName, 'aria-label': fieldCaption },
            styles: 'visibility:hidden;'
        });
        let filterCaption: string = this.parent.engineModule.fieldList[fieldName].caption;
        let headerTemplate: string = this.parent.localeObj.getConstant('filter') + ' ' +
            '"' + fieldCaption + '"' + ' ' + this.parent.localeObj.getConstant('by');
        this.filterObject = this.getFilterObject(fieldName);
        this.isSearchEnabled = false;
        this.allowExcelLikeFilter = this.isExcelFilter(fieldName);
        this.parent.element.appendChild(editorDialog);
        this.dialogPopUp = new Dialog({
            animationSettings: { effect: (this.allowExcelLikeFilter ? 'None' : 'Fade') },
            allowDragging: false,
            header: (this.allowExcelLikeFilter ? headerTemplate : filterCaption),
            content: (this.allowExcelLikeFilter ? '' : this.createTreeView(treeData, fieldCaption, fieldName)),
            isModal: this.parent.renderMode === 'Popup' ? true : this.parent.isAdaptive ? true : false,
            visible: true,
            showCloseIcon: this.allowExcelLikeFilter ? true : false,
            enableRtl: this.parent.enableRtl,
            width: 'auto',
            height: this.parent.isDataOverflow ? (this.allowExcelLikeFilter ? '440px' : '400px') :
                (this.allowExcelLikeFilter ? '400px' : '350px'),
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    buttonModel: {
                        cssClass: cls.OK_BUTTON_CLASS, content: this.parent.localeObj.getConstant('ok'), isPrimary: true
                    }
                },
                {
                    buttonModel: {
                        cssClass: 'e-clear-filter-button' + (this.allowExcelLikeFilter ? '' : ' ' + cls.ICON_DISABLE),
                        iconCss: 'e-icons e-clear-filter-icon', enableRtl: this.parent.enableRtl,
                        content: this.parent.localeObj.getConstant('clearFilter'), disabled: (this.filterObject ? false : true)
                    }
                },
                {
                    click: this.closeFilterDialog.bind(this),
                    buttonModel: { cssClass: cls.CANCEL_BUTTON_CLASS, content: this.parent.localeObj.getConstant('cancel') }
                }],
            closeOnEscape: true,
            target: target,
            close: this.removeFilterDialog.bind(this)
        });
        this.dialogPopUp.isStringTemplate = true;
        this.dialogPopUp.appendTo(editorDialog);
        // this.dialogPopUp.element.querySelector('.e-dlg-header').innerHTML = (this.allowExcelLikeFilter ? headerTemplate : filterCaption);
        if (this.allowExcelLikeFilter) {
            this.createTabMenu(treeData, fieldCaption, fieldName);
            addClass([this.dialogPopUp.element], 'e-excel-filter');
            this.updateCheckedState(fieldCaption);
        } else {
            this.updateCheckedState(fieldCaption);
        }
        setStyleAttribute(this.dialogPopUp.element, { 'visibility': 'visible' });
        if (this.allowExcelLikeFilter) {
            (this.dialogPopUp.element.querySelector('.e-dlg-closeicon-btn') as HTMLElement).focus();
        } else {
            return;
        }
    }
    /* tslint:disable */
    private createTreeView(treeData: { [key: string]: Object }[], fieldCaption: string, fieldName?: string): HTMLElement {
        let editorTreeWrapper: HTMLElement = createElement('div', {
            id: this.parent.parentID + 'EditorDiv',
            className: cls.EDITOR_TREE_WRAPPER_CLASS + (this.allowExcelLikeFilter ? ' e-excelfilter' : '')
        });
        let levelWrapper: HTMLElement = createElement('button', {
            id: this.parent.parentID + '_LevelDiv',
            className: 'e-level-wrapper-class'
        });
        let searchWrapper: HTMLElement = createElement('div', {
            id: this.parent.parentID + '_SearchDiv', attrs: { 'tabindex': '-1' },
            className: cls.EDITOR_SEARCH_WRAPPER_CLASS
        });
        let filterCaption: string = this.parent.engineModule.fieldList[fieldName].caption;
        let editorSearch: HTMLInputElement = createElement('input', { attrs: { 'type': 'text' } }) as HTMLInputElement;
        let nodeLimitText: string = this.parent.isDataOverflow ?
            ((this.parent.currentTreeItems.length - this.parent.control.maxNodeLimitInMemberEditor) +
                this.parent.control.localeObj.getConstant('editorDataLimitMsg')) : '';
        let labelWrapper: HTMLElement = createElement('div', {
            id: this.parent.parentID + '_LabelDiv',
            attrs: { 'tabindex': '-1', 'title': nodeLimitText },
            className: cls.EDITOR_LABEL_WRAPPER_CLASS
        });
        this.parent.editorLabelElement = createElement('label', { className: cls.EDITOR_LABEL_CLASS }) as HTMLLabelElement;
        this.parent.editorLabelElement.innerText = nodeLimitText;
        labelWrapper.style.display = this.parent.isDataOverflow ? 'block' : 'none';
        labelWrapper.appendChild(this.parent.editorLabelElement);
        searchWrapper.appendChild(editorSearch);
        searchWrapper.appendChild(levelWrapper);
        let selectAllWrapper: HTMLElement = createElement('div', {
            id: this.parent.parentID + '_AllDiv', attrs: { 'tabindex': '-1' },
            className: cls.SELECT_ALL_WRAPPER_CLASS
        });
        let selectAllContainer: HTMLElement = createElement('div', { className: cls.SELECT_ALL_CLASS });
        let treeOuterDiv: HTMLElement = createElement('div', { className: cls.EDITOR_TREE_CONTAINER_CLASS + '-outer-div' });
        let treeViewContainer: HTMLElement = createElement('div', { className: cls.EDITOR_TREE_CONTAINER_CLASS });
        let promptDiv: HTMLElement = createElement('div', {
            className: cls.EMPTY_MEMBER_CLASS + ' ' + cls.ICON_DISABLE,
            innerHTML: this.parent.localeObj.getConstant('noMatches')
        });
        if (this.parent.dataType === 'olap' && this.parent.control.loadOnDemandInMemberEditor &&
            !(this.parent.engineModule as OlapEngine).fieldList[fieldName].isHierarchy &&
            !(this.parent.engineModule as OlapEngine).fieldList[fieldName].isNamedSets) {
            this.createLevelWrapper(levelWrapper, fieldName);
        } else {
            levelWrapper.style.display = 'none';
        }
        selectAllWrapper.appendChild(selectAllContainer);
        editorTreeWrapper.appendChild(searchWrapper);
        editorTreeWrapper.appendChild(selectAllWrapper);
        editorTreeWrapper.appendChild(promptDiv);
        this.editorSearch = new MaskedTextBox({
            placeholder: this.parent.localeObj.getConstant('search') + ' ' + '"' + filterCaption + '"',
            enableRtl: this.parent.enableRtl,
            cssClass: cls.EDITOR_SEARCH_CLASS,
            showClearButton: true,
            change: (e: MaskChangeEventArgs) => {
                if (this.parent.dataType === 'olap') {
                    this.searchOlapTreeView(e, promptDiv, fieldCaption);
                } else {
                    this.parent.eventBase.searchTreeNodes(e, this.memberTreeView, false);
                    let filterDialog: Element = this.dialogPopUp.element;
                    let liList: HTMLElement[] = [].slice.call(this.memberTreeView.element.querySelectorAll('li')) as HTMLElement[];
                    if (liList.length === 0) {
                        this.allMemberSelect.disableNodes([this.allMemberSelect.element.querySelector('li')]);
                        filterDialog.querySelector('.' + cls.OK_BUTTON_CLASS).setAttribute('disabled', 'disabled');
                        removeClass([promptDiv], cls.ICON_DISABLE);
                    } else {
                        this.allMemberSelect.enableNodes([this.allMemberSelect.element.querySelector('li')]);
                        filterDialog.querySelector('.' + cls.OK_BUTTON_CLASS).removeAttribute('disabled');
                        addClass([promptDiv], cls.ICON_DISABLE);
                    }
                    this.updateCheckedState(fieldCaption);
                }
            }
        });
        this.editorSearch.isStringTemplate = true;
        this.editorSearch.appendTo(editorSearch);
        let nodeAttr: { [key: string]: string } = { 'data-fieldName': fieldName };
        let data: { [key: string]: Object }[] = [{ id: 'all', name: 'All', isSelected: true, htmlAttributes: nodeAttr }];
        this.allMemberSelect = new TreeView({
            fields: { dataSource: data, id: 'id', text: 'name', isChecked: 'isSelected' },
            showCheckBox: true,
            expandOn: 'None',
            enableRtl: this.parent.enableRtl,
            nodeClicked: this.nodeCheck.bind(this, true),
            keyPress: this.nodeCheck.bind(this, true)
        });
        this.allMemberSelect.isStringTemplate = true;
        this.allMemberSelect.appendTo(selectAllContainer);
        treeOuterDiv.appendChild(treeViewContainer);
        editorTreeWrapper.appendChild(treeOuterDiv);
        this.memberTreeView = new TreeView({
            fields: { dataSource: treeData, id: 'id', text: 'name', isChecked: 'isSelected', parentID: 'pid' },
            showCheckBox: true,
            enableRtl: this.parent.enableRtl,
            nodeChecking: this.validateTreeNode.bind(this),
            nodeClicked: this.nodeCheck.bind(this, false),
            keyPress: this.nodeCheck.bind(this, false),
            nodeExpanding: this.updateChildNodes.bind(this),
            expandOn: 'None'
        });
        this.memberTreeView.isStringTemplate = true;
        this.memberTreeView.appendTo(treeViewContainer);
        editorTreeWrapper.appendChild(labelWrapper);
        return editorTreeWrapper;
    }
    private createLevelWrapper(levelWrapper: HTMLElement, fieldName: string): void {
        let engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
        let levels: IOlapField[] = engineModule.fieldList[fieldName].levels;
        let levelCount: number = engineModule.fieldList[fieldName].levelCount;
        let items: ItemModel[] = [];
        for (let i: number = 0, cnt: number = levels.length; i < cnt; i++) {
            items.push({ id: levels[i].id, text: levels[i].name });
        }
        this.dropMenu = new DropDownButton({
            cssClass: 'e-level-drop',
            items: items, iconCss: 'e-icons e-dropdown-icon',
            disabled: (levelCount === levels.length),
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs) => {
                let items: HTMLLIElement[] = [].slice.call(args.element.querySelectorAll('li'));
                let engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
                let levelCount: number = engineModule.fieldList[fieldName].levelCount;
                removeClass(items, cls.MENU_DISABLE);
                for (let i: number = 0, cnt: number = items.length; i < cnt; i++) {
                    if (i < levelCount) {
                        addClass([items[i]], cls.MENU_DISABLE);
                    }
                }
            },
            select: (args: MenuEventArgs) => {
                let fieldName: string = this.dialogPopUp.element.getAttribute('data-fieldname');
                let engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
                let selectedLevel: number;
                for (let i: number = 0, cnt: number = items.length; i < cnt; i++) {
                    if (items[i].id === args.item.id) {
                        selectedLevel = i;
                    }
                }
                engineModule.getFilterMembers(this.parent.dataSourceSettings, fieldName, selectedLevel + 1, false, true);
            },
            close: () => {
                let engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
                let levels: IOlapField[] = engineModule.fieldList[fieldName].levels;
                let levelCount: number = engineModule.fieldList[fieldName].levelCount;
                if (levelCount === levels.length) {
                    this.dropMenu.disabled = true;
                    this.dropMenu.dataBind();
                } else {
                    this.dropMenu.disabled = false;
                }
            }
        });
        this.dropMenu.appendTo(levelWrapper);
    }
    private searchOlapTreeView(e: MaskChangeEventArgs, promptDiv: HTMLElement, fieldCaption: string): void {
        let popupInstance: FilterDialog = this;
        clearTimeout(this.timeOutObj);
        this.timeOutObj = setTimeout(function () {
            let engineModule: OlapEngine = popupInstance.parent.engineModule as OlapEngine;
            let filterDialog: Element = popupInstance.dialogPopUp.element;
            let fieldName: string = filterDialog.getAttribute('data-fieldname');
            let nodeLimit: number = popupInstance.parent.control.maxNodeLimitInMemberEditor ?
                popupInstance.parent.control.maxNodeLimitInMemberEditor : 5000;
            if (!engineModule.fieldList[fieldName].isHierarchy) {
                if (popupInstance.dropMenu && e.value !== '') {
                    popupInstance.dropMenu.disabled = true;
                } else {
                    popupInstance.dropMenu.disabled = false;
                }
                if (!popupInstance.parent.control.loadOnDemandInMemberEditor) {
                    engineModule.getSearchMembers(popupInstance.parent.dataSourceSettings, fieldName, e.value.toLowerCase(), nodeLimit, true);
                } else {
                    let levelCount: number = engineModule.fieldList[fieldName].levelCount ? engineModule.fieldList[fieldName].levelCount : 1;
                    engineModule.getSearchMembers(popupInstance.parent.dataSourceSettings, fieldName, e.value.toLowerCase(), nodeLimit, false, levelCount);
                }
                popupInstance.parent.eventBase.searchTreeNodes(e, popupInstance.memberTreeView, false, false);
            } else {
                popupInstance.parent.eventBase.searchTreeNodes(e, popupInstance.memberTreeView, false, true);
            }
            let liList: HTMLElement[] = [].slice.call(popupInstance.memberTreeView.element.querySelectorAll('li')) as HTMLElement[];
            // for (let element of liList) {
            //     if (element.querySelector('.interaction')) {
            //         setStyleAttribute(element.querySelector('.interaction'), { display: 'none' });
            //     }
            // }
            if (liList.length === 0) {
                popupInstance.allMemberSelect.disableNodes([popupInstance.allMemberSelect.element.querySelector('li')]);
                filterDialog.querySelector('.' + cls.OK_BUTTON_CLASS).setAttribute('disabled', 'disabled');
                removeClass([promptDiv], cls.ICON_DISABLE);
            } else {
                popupInstance.allMemberSelect.enableNodes([popupInstance.allMemberSelect.element.querySelector('li')]);
                filterDialog.querySelector('.' + cls.OK_BUTTON_CLASS).removeAttribute('disabled');
                addClass([promptDiv], cls.ICON_DISABLE);
            }
            popupInstance.updateCheckedState(fieldCaption);
        }, 500);

    }
    /* tslint:enable */
    /* tslint:disable:no-any */
    private nodeCheck(isAllMember: boolean, args: NodeClickEventArgs): void {
        let checkedNode: any = [args.node];
        if ((args.event.target as HTMLElement).classList.contains('e-fullrow') || (args.event as any).key === 'Enter') {
            let memberObj: TreeView = isAllMember ? this.allMemberSelect : this.memberTreeView;
            let getNodeDetails: any = memberObj.getNode(args.node);
            if (getNodeDetails.isChecked === 'true') {
                memberObj.uncheckAll(checkedNode);
            } else {
                memberObj.checkAll(checkedNode);
            }
        }
    }
    private updateChildNodes(args: NodeExpandEventArgs): void {
        if (this.parent.dataType === 'olap') {
            let engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
            let fieldName: string = args.node.getAttribute('data-fieldname');
            let fieldList: IOlapField = engineModule.fieldList[fieldName];
            let filterItems: string[] = [];
            if (fieldList && fieldList.filterMembers.length > 0 && !this.isSearchEnabled &&
                !fieldList.members[args.nodeData.id as string].isNodeExpand) {
                let childNodes: IOlapField[] = [];
                for (let item of fieldList.filterMembers) {
                    if (item.pid === args.nodeData.id.toString()) {
                        childNodes.push(item);
                    }
                }
                if (childNodes.length === 0) {
                    fieldList.childMembers = [];
                    engineModule.getChildMembers(this.parent.dataSourceSettings, args.nodeData.id.toString(), fieldName);
                    childNodes = fieldList.childMembers;
                    fieldList.childMembers = [];
                }
                let treeData: { [key: string]: Object }[] = PivotUtil.getClonedData(childNodes as { [key: string]: Object }[]);
                let curTreeData: { [key: string]: Object }[] = (this.memberTreeView.fields.dataSource as { [key: string]: Object }[]);
                let isInclude: boolean = false;
                if (!isNullOrUndefined(this.filterObject)) {
                    isInclude = this.filterObject.type === 'Include' ? true : false;
                    filterItems = this.filterObject.items ? this.filterObject.items : [];
                }
                treeData = this.updateChildData(isInclude, treeData, filterItems, fieldName, args.nodeData);
                treeData = this.parent.eventBase.sortOlapFilterData(treeData, engineModule.fieldList[fieldName].sort);
                for (let node of treeData) {
                    curTreeData.push(node);
                }
                fieldList.members[args.nodeData.id as string].isNodeExpand = true;
                this.memberTreeView.addNodes(treeData, args.node);
            }
        }
    }
    /* tslint:disable-next-line:max-line-length */
    private updateChildData(isInclude: boolean, members: { [key: string]: Object }[], filterItems: string[], fieldName: string, parentNode: { [key: string]: Object }): { [key: string]: Object }[] {
        let memberCount: number = Object.keys(this.parent.currentTreeItemsPos).length;
        let fieldList: IOlapField = this.parent.engineModule.fieldList[fieldName];
        let list: { [key: string]: Object }[] = [];
        let childMemberCount: number = 1;
        for (let member of members) {
            let obj: { [key: string]: Object } = member;
            let memberName: string = member.id.toString();
            fieldList.members[memberName].isNodeExpand = false;
            member.isSelected = (parentNode.isChecked === 'true');
            if (childMemberCount <= this.parent.control.maxNodeLimitInMemberEditor) {
                list.push(obj);
            }
            this.parent.currentTreeItems.push(obj);
            this.parent.searchTreeItems.push(obj);
            this.parent.currentTreeItemsPos[memberName] = memberCount;
            memberCount++;
            childMemberCount++;
        }
        this.parent.isDataOverflow = false;
        return list;
    }
    private createTabMenu(treeData: { [key: string]: Object }[], fieldCaption: string, fieldName: string): void {
        let wrapper: HTMLElement = createElement('div', {
            className: 'e-filter-tab-wrapper'
        });
        this.dialogPopUp.content = wrapper;
        this.dialogPopUp.dataBind();
        let types: FilterType[] = ['Label', 'Value', 'Include', 'Exclude'];
        let regx: string = '((-|\\+)?[0-9]+(\\.[0-9]+)?)+';
        let member: string = Object.keys(this.parent.engineModule.fieldList[fieldName].members)[0];
        let fieldType: string = this.parent.engineModule.fieldList[fieldName].type;
        let formatObj: IFormatSettings = this.parent.eventBase.getFormatItemByName(fieldName);
        let items: TabItemModel[] = [
            {
                header: {
                    text: this.parent.localeObj.getConstant('member'),
                    iconCss: (this.filterObject && types.indexOf(this.filterObject.type) > 1 ? cls.SELECTED_OPTION_ICON_CLASS : '')
                },
                content: this.createTreeView(treeData, fieldCaption, fieldName)
            }
        ];
        for (let type of types) {
            if (((type === 'Label') && this.parent.dataSourceSettings.allowLabelFilter) ||
                (type === 'Value' && this.parent.dataSourceSettings.allowValueFilter)) {
                let filterType: FilterType = (type === 'Label' && ((member).match(regx) &&
                    (member).match(regx)[0].length === (member).length) && fieldType === 'number') ? 'Number' :
                    (type === 'Label' && (new Date(member).toString() !== 'Invalid Date') &&
                        ((formatObj && formatObj.type) || (this.filterObject && this.filterObject.type === 'Date'))) ? 'Date' : type;
                let item: TabItemModel = {
                    header: {
                        text: (filterType === 'Number' ? this.parent.localeObj.getConstant('label') :
                            this.parent.localeObj.getConstant(filterType.toLowerCase())),
                        iconCss: (this.filterObject && this.filterObject.type === filterType ? cls.SELECTED_OPTION_ICON_CLASS : '')
                    },
                    /* tslint:disable-next-line:max-line-length */
                    content: this.createCustomFilter(fieldName, (this.filterObject && this.filterObject.type === filterType ? this.filterObject : undefined), filterType.toLowerCase())
                };
                items.push(item);
            }
        }
        let selectedIndex: number =
            (this.filterObject ? ((['Label', 'Date', 'Number'] as FilterType[]).indexOf(this.filterObject.type) >= 0) ?
                1 : this.filterObject.type === 'Value' ?
                    (this.parent.dataSourceSettings.allowLabelFilter && this.parent.dataSourceSettings.allowValueFilter) ? 2 : 1 : 0 : 0);
        this.tabObj = new Tab({
            heightAdjustMode: 'Auto',
            items: items,
            height: '100%',
            selectedItem: selectedIndex,
            enableRtl: this.parent.enableRtl
        });
        this.tabObj.isStringTemplate = true;
        this.tabObj.appendTo(wrapper);
        if (selectedIndex > 0) {
            /* tslint:disable-next-line:max-line-length */
            addClass([this.dialogPopUp.element.querySelector('.e-filter-div-content' + '.' + (selectedIndex === 1 && this.parent.dataSourceSettings.allowLabelFilter ? 'e-label-filter' : 'e-value-filter'))], 'e-selected-tab');
        }
    }
    /* tslint:disable */
    private createCustomFilter(fieldName: string, filterObject: IFilter, type: string): HTMLElement {
        let dataSource: { [key: string]: Object }[] = [];
        let valueOptions: { [key: string]: Object }[] = [];
        let levelOptions: { [key: string]: Object }[] = [];
        let measures: IFieldOptions[] = this.parent.dataSourceSettings.values;
        let selectedOption: string = 'DoesNotEquals';
        let selectedValueIndex: number = 0;
        let selectedLevelIndex: number = 0;
        let options: { label: string[], value: string[], date: string[] } = {
            label: ['Equals', 'DoesNotEquals', 'BeginWith', 'DoesNotBeginWith', 'EndsWith',
                'DoesNotEndsWith', 'Contains', 'DoesNotContains', 'GreaterThan',
                'GreaterThanOrEqualTo', 'LessThan', 'LessThanOrEqualTo', 'Between', 'NotBetween'],
            date: ['Equals', 'DoesNotEquals', 'Before', 'BeforeOrEqualTo', 'After', 'AfterOrEqualTo',
                'Between', 'NotBetween'],
            value: ['Equals', 'DoesNotEquals', 'GreaterThan', 'GreaterThanOrEqualTo', 'LessThan',
                'LessThanOrEqualTo', 'Between', 'NotBetween']
        };
        let betweenOperators: Operators[] = ['Between', 'NotBetween'];
        let operatorCollection: string[] = (type === 'label' ? options.label : type === 'date' ? options.date : options.value);
        for (let operator of operatorCollection) {
            selectedOption = ((filterObject && operator === filterObject.condition) ?
                operatorCollection.indexOf(filterObject.condition) >= 0 ?
                    filterObject.condition : operatorCollection[0] : selectedOption);
            dataSource.push({ value: operator, text: this.parent.localeObj.getConstant(operator) });
        }
        let len: number = measures.length;
        while (len--) {
            valueOptions.unshift({ value: measures[len].name, text: (measures[len].caption ? measures[len].caption : measures[len].name) });
            selectedValueIndex = filterObject && filterObject.type === 'Value' &&
                filterObject.measure === measures[len].name &&
                filterObject.condition === selectedOption ? len : selectedValueIndex;
        }
        if (this.parent.dataType === 'olap') {
            let engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
            let levels: IOlapField[] = engineModule.fieldList[fieldName].levels;
            if ((this.parent.engineModule as OlapEngine).fieldList[fieldName].isHierarchy) {
                let levelObj: IOlapField;
                let fieldlistData: IOlapField[] = (this.parent.engineModule as OlapEngine).fieldListData;
                for (let item of fieldlistData) {
                    if (item && item.pid === fieldName) {
                        levelObj = item;
                        break;
                    }
                }
                levelOptions.push({
                    value: levelObj ? levelObj.id : fieldName,
                    text: levelObj ? levelObj.caption : engineModule.fieldList[fieldName].name
                });
                selectedLevelIndex = 0;
                if (filterObject && filterObject.name === fieldName && filterObject.type.toLowerCase() === type) {
                    levelOptions[levelOptions.length - 1]['iconClass'] = cls.ICON + ' ' + cls.SELECTED_LEVEL_ICON_CLASS;
                }
            } else {
                for (let i: number = 0, cnt: number = levels.length; i < cnt; i++) {
                    selectedLevelIndex = (filterObject &&
                        filterObject.selectedField === levels[i].id ? i : selectedLevelIndex);
                    levelOptions.push({ value: levels[i].id, text: levels[i].name });
                    for (let field of this.parent.dataSourceSettings.filterSettings) {
                        if (field.name === fieldName && field.selectedField === levels[i].id && field.type.toLowerCase() === type) {
                            levelOptions[levelOptions.length - 1]['iconClass'] = cls.ICON + ' ' + cls.SELECTED_LEVEL_ICON_CLASS;
                            break;
                        }
                    }
                }
            }
        }
        let mainDiv: HTMLElement = createElement('div', {
            className: cls.FILTER_DIV_CONTENT_CLASS + ' e-' + ((['date', 'number']).indexOf(type) >= 0 ? 'label' : type) + '-filter',
            id: this.parent.parentID + '_' + type + '_filter_div_content',
            attrs: {
                'data-type': type, 'data-fieldName': fieldName, 'data-operator': selectedOption,
                'data-selectedField': (this.parent.dataType === 'olap' &&
                    levelOptions.length > 0 ? levelOptions[selectedLevelIndex].value.toString() : ''),
                'data-measure': (this.parent.dataSourceSettings.values.length > 0 ?
                    this.parent.dataSourceSettings.values[selectedValueIndex].name : ''),
                'data-value1': (filterObject && selectedOption === filterObject.condition ?
                    filterObject.value1 ? filterObject.value1.toString() : '' : ''),
                'data-value2': (filterObject && selectedOption === filterObject.condition ?
                    filterObject.value2 ? filterObject.value2.toString() : '' : '')
            }
        });
        let textContentdiv: HTMLElement = createElement('div', {
            className: cls.FILTER_TEXT_DIV_CLASS,
            innerHTML: this.parent.localeObj.getConstant(type + 'TextContent')
        });
        let betweenTextContentdiv: HTMLElement = createElement('div', {
            className: cls.BETWEEN_TEXT_DIV_CLASS + ' ' +
                (betweenOperators.indexOf(selectedOption as Operators) === -1 ? cls.ICON_DISABLE : ''),
            innerHTML: this.parent.localeObj.getConstant('And')
        });
        let separatordiv: HTMLElement = createElement('div', { className: cls.SEPARATOR_DIV_CLASS });
        let filterWrapperDiv1: HTMLElement = createElement('div', { className: cls.FILTER_OPTION_WRAPPER_1_CLASS });
        let levelWrapperDiv: HTMLElement = createElement('div', {
            className: 'e-level-option-wrapper' + ' ' +
                (this.parent.dataType === 'olap' ? '' : cls.ICON_DISABLE),
        });
        let optionWrapperDiv1: HTMLElement = createElement('div', {
            className: 'e-measure-option-wrapper' + ' ' + (((['label', 'date', 'number']).indexOf(type) >= 0) ? cls.ICON_DISABLE : ''),
        });
        let optionWrapperDiv2: HTMLElement = createElement('div', { className: 'e-condition-option-wrapper' });
        let filterWrapperDiv2: HTMLElement = createElement('div', { className: cls.FILTER_OPTION_WRAPPER_2_CLASS });
        let levelDropOption: HTMLElement = createElement('div', { id: this.parent.parentID + '_' + type + '_level_option_wrapper' });
        let dropOptionDiv1: HTMLElement = createElement('div', { id: this.parent.parentID + '_' + type + '_measure_option_wrapper' });
        let dropOptionDiv2: HTMLElement = createElement('div', { id: this.parent.parentID + '_' + type + '_contition_option_wrapper' });
        let inputDiv1: HTMLElement = createElement('div', { className: cls.FILTER_INPUT_DIV_1_CLASS });
        let inputDiv2: HTMLElement = createElement('div', {
            className: cls.FILTER_INPUT_DIV_2_CLASS + ' ' +
                (betweenOperators.indexOf(selectedOption as Operators) === -1 ? cls.ICON_DISABLE : '')
        });
        let inputField1: HTMLInputElement = createElement('input', {
            id: this.parent.parentID + '_' + type + '_input_option_1', attrs: { 'type': 'text' }
        }) as HTMLInputElement;
        let inputField2: HTMLInputElement = createElement('input', {
            id: this.parent.parentID + '_' + type + '_input_option_2', attrs: { 'type': 'text' }
        }) as HTMLInputElement;
        inputDiv1.appendChild(inputField1);
        inputDiv2.appendChild(inputField2);
        levelWrapperDiv.appendChild(levelDropOption);
        levelWrapperDiv.appendChild(separatordiv.cloneNode(true));
        optionWrapperDiv1.appendChild(dropOptionDiv1);
        optionWrapperDiv1.appendChild(separatordiv);
        optionWrapperDiv2.appendChild(dropOptionDiv2);
        filterWrapperDiv1.appendChild(levelWrapperDiv);
        filterWrapperDiv1.appendChild(optionWrapperDiv1);
        filterWrapperDiv1.appendChild(optionWrapperDiv2);
        filterWrapperDiv2.appendChild(inputDiv1);
        filterWrapperDiv2.appendChild(betweenTextContentdiv);
        filterWrapperDiv2.appendChild(inputDiv2);
        /* tslint:disable-next-line:max-line-length */
        this.createElements(filterObject, betweenOperators, dropOptionDiv1, dropOptionDiv2, inputField1, inputField2, valueOptions, dataSource, selectedValueIndex, selectedOption, type, levelDropOption, levelOptions, selectedLevelIndex);
        mainDiv.appendChild(textContentdiv);
        mainDiv.appendChild(filterWrapperDiv1);
        mainDiv.appendChild(filterWrapperDiv2);
        return mainDiv;
    }
    private createElements(filterObj: IFilter, operators: Operators[], optionDiv1: HTMLElement, optionDiv2:
        HTMLElement, inputDiv1: HTMLInputElement, inputDiv2: HTMLInputElement, vDataSource: { [key: string]: Object }[],
        oDataSource: { [key: string]: Object }[], valueIndex: number, option: string, type: string,
        levelDropOption: HTMLElement, lDataSource: { [key: string]: Object }[], levelIndex: number): void {
        let popupInstance: FilterDialog = this;
        if (this.parent.dataType === 'olap') {
            let levelWrapper: DropDownList = new DropDownList({
                dataSource: lDataSource, enableRtl: this.parent.enableRtl,
                fields: { value: 'value', text: 'text', iconCss: 'iconClass' },
                index: levelIndex,
                cssClass: cls.LEVEL_OPTIONS_CLASS, width: '100%',
                change(args: ChangeEventArgs): void {
                    let element: Element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    let fieldName: string = element.getAttribute('data-fieldName');
                    let type: string = element.getAttribute('data-type');
                    if (!isNullOrUndefined(element)) {
                        popupInstance.updateInputValues(element, type, inputDiv1, inputDiv2);
                        setStyleAndAttributes(element, { 'data-selectedField': args.value });
                        let filterObj: IFilter;
                        for (let field of popupInstance.parent.dataSourceSettings.filterSettings) {
                            if (field.name === fieldName && field.selectedField === args.value) {
                                filterObj = field;
                                break;
                            }
                        }
                        if (filterObj) {
                            if (type === 'value' && filterObj.measure && filterObj.measure !== '') {
                                optionWrapper1.value = filterObj.measure ? filterObj.measure : vDataSource[0].value as string;
                            } else {

                            }
                            if (filterObj.condition) {
                                optionWrapper.value = filterObj.condition ? filterObj.condition : 'DoesNotEquals';
                            } else {
                                optionWrapper.value = 'DoesNotEquals';
                            }
                            let inputObj1: MaskedTextBox | NumericTextBox;
                            let inputObj2: MaskedTextBox | NumericTextBox;
                            if (type === 'value') {
                                inputObj1 = ((<HTMLElement>inputDiv1) as EJ2Instance).ej2_instances[0] as NumericTextBox;
                                inputObj2 = ((<HTMLElement>inputDiv2) as EJ2Instance).ej2_instances[0] as NumericTextBox;
                                if (inputObj1) {
                                    inputObj1.value = filterObj.value1 ? parseInt(filterObj.value1 as string, 10) : undefined;
                                }
                                if (inputObj2) {
                                    inputObj2.value = filterObj.value2 ? parseInt(filterObj.value2 as string, 10) : undefined;
                                }
                            } else {
                                inputObj1 = ((<HTMLElement>inputDiv1) as EJ2Instance).ej2_instances[0] as MaskedTextBox;
                                inputObj2 = ((<HTMLElement>inputDiv2) as EJ2Instance).ej2_instances[0] as MaskedTextBox;
                                if (inputObj1) {
                                    inputObj1.value = filterObj.value1 ? filterObj.value1 as string : '';
                                }
                                if (inputObj2) {
                                    inputObj2.value = filterObj.value2 ? filterObj.value2 as string : '';
                                }
                            }
                        }
                        popupInstance.updateInputValues(element, type, inputDiv1, inputDiv2);
                    } else {
                        return;
                    }
                }
            });
            levelWrapper.isStringTemplate = true;
            levelWrapper.appendTo(levelDropOption);
        }
        let optionWrapper1: DropDownList = new DropDownList({
            dataSource: vDataSource, enableRtl: this.parent.enableRtl,
            fields: { value: 'value', text: 'text' }, index: valueIndex,
            cssClass: cls.VALUE_OPTIONS_CLASS, width: '100%',
            change(args: ChangeEventArgs): void {
                let element: Element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                if (!isNullOrUndefined(element)) {
                    popupInstance.updateInputValues(element, type, inputDiv1, inputDiv2);
                    setStyleAndAttributes(element, { 'data-measure': args.value });
                } else {
                    return;
                }
            }
        });
        optionWrapper1.isStringTemplate = true;
        optionWrapper1.appendTo(optionDiv1);
        let optionWrapper: DropDownList = new DropDownList({
            dataSource: oDataSource, enableRtl: this.parent.enableRtl,
            fields: { value: 'value', text: 'text' }, value: option,
            cssClass: cls.FILTER_OPERATOR_CLASS, width: '100%',
            change(args: ChangeEventArgs): void {
                let element: Element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                if (!isNullOrUndefined(element)) {
                    popupInstance.updateInputValues(element, type, inputDiv1, inputDiv2);
                    let disabledClasses: string[] = [cls.BETWEEN_TEXT_DIV_CLASS, cls.FILTER_INPUT_DIV_2_CLASS];
                    for (let className of disabledClasses) {
                        if (operators.indexOf(args.value as Operators) >= 0) {
                            removeClass([element.querySelector('.' + className)], cls.ICON_DISABLE);
                        } else {
                            addClass([element.querySelector('.' + className)], cls.ICON_DISABLE);
                        }
                    }
                    setStyleAndAttributes(element, { 'data-operator': args.value as Operators });
                } else {
                    return;
                }
            }
        });
        optionWrapper.isStringTemplate = true;
        optionWrapper.appendTo(optionDiv2);
        if (type === 'date') {
            let inputObj1: DateTimePicker = new DateTimePicker({
                placeholder: this.parent.localeObj.getConstant('chooseDate'),
                enableRtl: this.parent.enableRtl,
                format: 'dd/MM/yyyy hh:mm:ss a',
                showClearButton: true,
                value: (filterObj && option === filterObj.condition ?
                    (typeof (filterObj.value1) === 'string' ? new Date(filterObj.value1) : filterObj.value1) : null),
                change: (e: ChangedEventArgs) => {
                    let element: Element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, { 'data-value1': e.value, 'data-value2': inputObj2.value });
                    } else {
                        return;
                    }
                },
                width: '100%',
            });
            let inputObj2: DateTimePicker = new DateTimePicker({
                placeholder: this.parent.localeObj.getConstant('chooseDate'),
                enableRtl: this.parent.enableRtl,
                format: 'dd/MM/yyyy hh:mm:ss a',
                showClearButton: true,
                value: (filterObj && option === filterObj.condition ?
                    (typeof (filterObj.value2) === 'string' ? new Date(filterObj.value2) : filterObj.value2) : null),
                change: (e: ChangedEventArgs) => {
                    let element: Element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, { 'data-value1': inputObj1.value, 'data-value2': e.value });
                    } else {
                        return;
                    }
                },
                width: '100%',
            });
            inputObj1.isStringTemplate = true;
            inputObj1.appendTo(inputDiv1);
            inputObj2.isStringTemplate = true;
            inputObj2.appendTo(inputDiv2);
        } else if (type === 'value') {
            let inputObj1: NumericTextBox = new NumericTextBox({
                placeholder: this.parent.localeObj.getConstant('enterValue'),
                enableRtl: this.parent.enableRtl,
                showClearButton: true,
                format: '###.##',
                value: (filterObj && option === filterObj.condition ? parseInt(filterObj.value1 as string, 10) : undefined),
                change: (e: NumericChangeEventArgs) => {
                    let element: Element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, {
                            'data-value1': (e.value ? e.value.toString() : '0'),
                            'data-value2': (inputObj2.value ? inputObj2.value.toString() : '0')
                        });
                    } else {
                        return;
                    }
                }, width: '100%'
            });
            let inputObj2: NumericTextBox = new NumericTextBox({
                placeholder: this.parent.localeObj.getConstant('enterValue'),
                enableRtl: this.parent.enableRtl,
                showClearButton: true,
                format: '###.##',
                value: (filterObj && option === filterObj.condition ? parseInt(filterObj.value2 as string, 10) : undefined),
                change: (e: NumericChangeEventArgs) => {
                    let element: Element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, {
                            'data-value1': (inputObj1.value ? inputObj1.value.toString() : '0'),
                            'data-value2': (e.value ? e.value.toString() : '0')
                        });
                    } else {
                        return;
                    }
                }, width: '100%'
            });
            inputObj1.isStringTemplate = true;
            inputObj1.appendTo(inputDiv1);
            inputObj2.isStringTemplate = true;
            inputObj2.appendTo(inputDiv2);
        } else {
            let inputObj1: MaskedTextBox = new MaskedTextBox({
                placeholder: this.parent.localeObj.getConstant('enterValue'),
                enableRtl: this.parent.enableRtl,
                showClearButton: true,
                value: (filterObj && option === filterObj.condition ? filterObj.value1 as string : ''),
                change: (e: MaskChangeEventArgs) => {
                    let element: Element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, { 'data-value1': e.value, 'data-value2': inputObj2.value });
                    } else {
                        return;
                    }
                }, width: '100%'
            });
            let inputObj2: MaskedTextBox = new MaskedTextBox({
                placeholder: this.parent.localeObj.getConstant('enterValue'),
                enableRtl: this.parent.enableRtl,
                showClearButton: true,
                value: (filterObj && option === filterObj.condition ? filterObj.value2 as string : ''),
                change: (e: MaskChangeEventArgs) => {
                    let element: Element = popupInstance.dialogPopUp.element.querySelector('.e-selected-tab');
                    if (!isNullOrUndefined(element)) {
                        setStyleAndAttributes(element, { 'data-value1': inputObj1.value, 'data-value2': e.value });
                    } else {
                        return;
                    }
                }, width: '100%'
            });
            inputObj1.isStringTemplate = true;
            inputObj1.appendTo(inputDiv1);
            inputObj2.isStringTemplate = true;
            inputObj2.appendTo(inputDiv2);
        }
    }
    /* tslint:enable */
    private updateInputValues(element: Element, type: string, inputDiv1: HTMLInputElement, inputDiv2: HTMLInputElement): void {
        let value1: string;
        let value2: string;
        if (type === 'date') {
            let inputObj1: DateTimePicker = ((<HTMLElement>inputDiv1) as EJ2Instance).ej2_instances[0] as DateTimePicker;
            let inputObj2: DateTimePicker = ((<HTMLElement>inputDiv2) as EJ2Instance).ej2_instances[0] as DateTimePicker;
            value1 = !isNullOrUndefined(inputObj1.value) ? inputObj1.value.toString() : '';
            value2 = !isNullOrUndefined(inputObj2.value) ? inputObj2.value.toString() : '';
        } else {
            let inputObj1: MaskedTextBox = ((<HTMLElement>inputDiv1) as EJ2Instance).ej2_instances[0] as MaskedTextBox;
            let inputObj2: MaskedTextBox = ((<HTMLElement>inputDiv2) as EJ2Instance).ej2_instances[0] as MaskedTextBox;
            value1 = inputObj1.value;
            value2 = inputObj2.value;
        }
        setStyleAndAttributes(element, { 'data-value1': value1, 'data-value2': value2 });
    }
    private validateTreeNode(e: NodeCheckEventArgs): void {
        if (e.node.classList.contains(cls.ICON_DISABLE)) {
            e.cancel = true;
        } else {
            return;
        }
    }
    /**
     * Update filter state while Member check/uncheck.

     */
    public updateCheckedState(fieldCaption?: string): void {
        let filterDialog: Element = this.dialogPopUp.element;
        setStyleAndAttributes(filterDialog, { 'role': 'menu', 'aria-haspopup': 'true' });
        let list: HTMLElement[] = [].slice.call(this.memberTreeView.element.querySelectorAll('li')) as HTMLElement[];
        let fieldName: string = filterDialog.getAttribute('data-fieldname');
        let uncheckedNodes: number = this.getUnCheckedNodes(fieldName);
        let checkedNodes: number = this.getCheckedNodes(fieldName);
        let firstNode: Element =
            this.allMemberSelect.element.querySelector('li').querySelector('span.' + cls.CHECK_BOX_FRAME_CLASS);
        if (list.length > 0) {
            if (checkedNodes > 0) {
                if (uncheckedNodes > 0) {
                    removeClass([firstNode], cls.NODE_CHECK_CLASS);
                    addClass([firstNode], cls.NODE_STOP_CLASS);
                } else if (uncheckedNodes === 0) {
                    removeClass([firstNode], cls.NODE_STOP_CLASS);
                    addClass([firstNode], cls.NODE_CHECK_CLASS);
                }
                this.dialogPopUp.buttons[0].buttonModel.disabled = false;
                filterDialog.querySelector('.' + cls.OK_BUTTON_CLASS).removeAttribute('disabled');
            } else if (uncheckedNodes > 0 && checkedNodes === 0) {
                removeClass([firstNode], [cls.NODE_CHECK_CLASS, cls.NODE_STOP_CLASS]);
                if (this.getCheckedNodes(fieldName) === checkedNodes) {
                    this.dialogPopUp.buttons[0].buttonModel.disabled = true;
                    filterDialog.querySelector('.' + cls.OK_BUTTON_CLASS).setAttribute('disabled', 'disabled');
                }
            }
        } else {
            this.dialogPopUp.buttons[0].buttonModel.disabled = true;
            filterDialog.querySelector('.' + cls.OK_BUTTON_CLASS).setAttribute('disabled', 'disabled');
        }
    }
    private getCheckedNodes(fieldName: string): number {
        let engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
        let nodeList: string[] = [];
        let checkeNodes: { [key: string]: object }[] = [];
        if (this.parent.dataType === 'olap' && engineModule &&
            !engineModule.fieldList[fieldName].isHierarchy) {
            nodeList = this.memberTreeView.getAllCheckedNodes();
            return nodeList.length;
        } else {
            for (let item of this.parent.searchTreeItems) {
                if (item.isSelected) {
                    checkeNodes.push(item);
                }
            }
            return checkeNodes.length;
        }
    }
    private getUnCheckedNodes(fieldName: string): number {
        let unCheckeNodes: { [key: string]: object }[] = [];
        let nodeList: string[] = [];
        let engineModule: OlapEngine = this.parent.engineModule as OlapEngine;
        if (this.parent.dataType === 'olap' && engineModule && !engineModule.fieldList[fieldName].isHierarchy) {
            nodeList = this.memberTreeView.getAllCheckedNodes();
            return ((this.memberTreeView.fields.dataSource as { [key: string]: object }[]).length -
                nodeList.length);
        } else {
            // unCheckeNodes = this.parent.searchTreeItems.filter((item: { [key: string]: object }) => {
            //     return !item.isSelected;
            // });
            for (let item of this.parent.searchTreeItems) {
                if (!item.isSelected) {
                    unCheckeNodes.push(item);
                }
            }
            return unCheckeNodes.length;
        }
    }
    private isExcelFilter(fieldName: string): boolean {
        let isFilterField: boolean = false;
        for (let field of this.parent.dataSourceSettings.filters) {
            if (field.name === fieldName) {
                isFilterField = true;
                break;
            }
        }
        if (!isFilterField && (this.parent.dataSourceSettings.allowLabelFilter || this.parent.dataSourceSettings.allowValueFilter)) {
            return true;
        } else {
            return false;
        }
    }
    private getFilterObject(fieldName: string): IFilter {
        let filterObj: IFilter = this.parent.eventBase.getFilterItemByName(fieldName);
        if (filterObj && ((((['Label', 'Date', 'Number'] as FilterType[]).indexOf(filterObj.type) >= 0) &&
            this.parent.dataSourceSettings.allowLabelFilter) ||
            (filterObj.type === 'Value' && this.parent.dataSourceSettings.allowValueFilter) ||
            ((['Include', 'Exclude'] as FilterType[]).indexOf(filterObj.type) >= 0))) {
            return filterObj;
        }
        return undefined;
    }
    /**
     * To close filter dialog.

     */
    public closeFilterDialog(): void {
        if (this.allowExcelLikeFilter) {
            if (this.tabObj && !this.tabObj.isDestroyed) {
                this.tabObj.destroy();
            }
        }
        if (this.dropMenu && !this.dropMenu.isDestroyed) {
            this.dropMenu.destroy();
        }
        if (document.getElementById(this.parent.parentID + '_LevelDiv-popup')) {
            remove(document.getElementById(this.parent.parentID + '_LevelDiv-popup'));
        }
        this.dialogPopUp.close();
    }
    private removeFilterDialog(): void {
        if (this.dialogPopUp && !this.dialogPopUp.isDestroyed) {
            this.dialogPopUp.destroy();
        }
        if (document.getElementById(this.parent.parentID + '_EditorTreeView')) {
            remove(document.getElementById(this.parent.parentID + '_EditorTreeView'));
        }
    }
}