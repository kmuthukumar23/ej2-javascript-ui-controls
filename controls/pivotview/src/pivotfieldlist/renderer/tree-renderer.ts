import { createElement, addClass, removeClass, remove, EventHandler, isNullOrUndefined } from '@syncfusion/ej2-base';
import { MouseEventArgs, TouchEventArgs, closest } from '@syncfusion/ej2-base';
import { PivotFieldList } from '../base/field-list';
import * as cls from '../../common/base/css-constant';
import * as events from '../../common/base/constant';
import { IAction } from '../../common/base/interface';
import { TreeView, NodeCheckEventArgs, DragAndDropEventArgs, DrawNodeEventArgs, NodeExpandEventArgs } from '@syncfusion/ej2-navigations';
import { IFieldOptions, IField, IDataOptions } from '../../base/engine';
import { Dialog } from '@syncfusion/ej2-popups';
import { MaskedTextBox, MaskChangeEventArgs } from '@syncfusion/ej2-inputs';
import { PivotUtil } from '../../base/util';
import { IOlapField } from '../../base/olap/engine';

/**
 * Module to render Field List
 */

export class TreeViewRenderer implements IAction {
    public parent: PivotFieldList;

    public fieldTable: TreeView;

    private parentElement: HTMLElement;
    private treeViewElement: HTMLElement;
    private fieldDialog: Dialog;
    private editorSearch: MaskedTextBox;
    private selectedNodes: string[] = [];
    private fieldListSort: string;

    /** Constructor for render module */
    constructor(parent: PivotFieldList) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * Initialize the field list tree rendering
     * @returns void
     * @private
     */
    public render(axis?: number): void {
        this.parentElement = this.parent.dialogRenderer.parentElement;
        this.fieldListSort = 'None';
        if (!this.parent.isAdaptive) {
            let fieldTable: Element = createElement('div', {
                className: cls.FIELD_TABLE_CLASS + ' ' + (this.parent.dataType === 'olap' ? cls.OLAP_FIELD_TABLE_CLASS : '')
            });
            let treeHeader: Element = createElement('div', {
                className: cls.FIELD_HEADER_CLASS,
                innerHTML: this.parent.localeObj.getConstant('allFields')
            });
            let treeOuterDiv: HTMLElement = createElement('div', { className: cls.FIELD_LIST_TREE_CLASS + '-outer-div' });
            this.treeViewElement = createElement('div', {
                id: this.parent.element.id + '_TreeView',
                className: cls.FIELD_LIST_CLASS + ' ' + (this.parent.dataType === 'olap' ? cls.OLAP_FIELD_LIST_CLASS : '')
            });
            let fieldHeaderWrappper: Element = createElement('div', { className: 'e-field-header-wrapper' });
            fieldHeaderWrappper.appendChild(treeHeader);
            fieldTable.appendChild(fieldHeaderWrappper);
            this.updateSortElements(fieldHeaderWrappper);
            treeOuterDiv.appendChild(this.treeViewElement);
            fieldTable.appendChild(treeOuterDiv);
            this.parentElement.appendChild(fieldTable);
            if (this.parent.renderMode === 'Fixed') {
                let centerDiv: Element = createElement('div', { className: cls.STATIC_CENTER_DIV_CLASS });
                let axisHeader: Element = createElement('div', {
                    className: cls.STATIC_CENTER_HEADER_CLASS,
                    innerHTML: this.parent.localeObj.getConstant('centerHeader')
                });
                this.parentElement.appendChild(centerDiv);
                this.parentElement.appendChild(axisHeader);
            }
            this.renderTreeView();
        } else {
            this.renderTreeDialog(axis);
        }
    }
    private updateSortElements(headerWrapper: Element): void {
        let options: string[] = ['None', 'Ascend', 'Descend'];
        for (let option of options) {
            let spanElement: Element = createElement('span', {
                attrs: {
                    'tabindex': '0',
                    'aria-disabled': 'false',
                    'aria-label': 'Sort ' + option,
                    'data-sort': option
                },
                className: cls.ICON + ' ' + 'e-sort-' + option.toLowerCase() + ' ' +
                    (this.fieldListSort === option ? 'e-selected' : '')
            });
            headerWrapper.appendChild(spanElement);
            this.unWireFieldListEvent(spanElement);
            this.wireFieldListEvent(spanElement);
        }
    }
    private renderTreeView(): void {
        this.fieldTable = new TreeView({
            /* tslint:disable-next-line:max-line-length */
            fields: { dataSource: this.getTreeData(), id: 'id', text: 'caption', isChecked: 'isSelected', parentID: 'pid', iconCss: 'spriteCssClass' },
            nodeChecked: this.nodeStateChange.bind(this),
            cssClass: cls.FIELD_LIST_TREE_CLASS,
            showCheckBox: true,
            allowDragAndDrop: true,
            sortOrder: 'None',
            autoCheck: false,
            loadOnDemand: false,
            enableRtl: this.parent.enableRtl,
            nodeDragStart: this.dragStart.bind(this),
            nodeDragStop: this.dragStop.bind(this),
            drawNode: this.updateTreeNode.bind(this),
            nodeExpanding: this.updateNodeIcon.bind(this),
            nodeCollapsed: this.updateNodeIcon.bind(this),
        });
        this.treeViewElement.innerHTML = '';
        this.fieldTable.isStringTemplate = true;
        this.fieldTable.appendTo(this.treeViewElement);
    }
    private updateNodeIcon(args: NodeExpandEventArgs): void {
        if (this.parent.dataType === 'olap') {
            if (args.node && args.node.querySelector('.e-list-icon') &&
                (args.node.querySelector('.e-list-icon').className.indexOf('e-folderCDB-icon') > -1)) {
                let node: HTMLElement = args.node.querySelector('.e-list-icon');
                removeClass([node], 'e-folderCDB-icon');
                addClass([node], 'e-folderCDB-open-icon');
            } else if (args.node && args.node.querySelector('.e-list-icon') &&
                (args.node.querySelector('.e-list-icon').className.indexOf('e-folderCDB-open-icon') > -1)) {
                let node: HTMLElement = args.node.querySelector('.e-list-icon');
                removeClass([node], 'e-folderCDB-open-icon');
                addClass([node], 'e-folderCDB-icon');
            }
        }
    }
    private updateTreeNode(args: DrawNodeEventArgs): void {
        let allowDrag: boolean = false;
        let dragVisibility: boolean = true;
        if (this.parent.dataType === 'olap') {
            allowDrag = this.updateOlapTreeNode(args);
        } else {
            allowDrag = true;
        }
        let liTextElement: HTMLElement = args.node.querySelector('.' + cls.TEXT_CONTENT_CLASS);
        if (args.node.querySelector('.e-list-icon') && liTextElement) {
            let liIconElement: HTMLElement = args.node.querySelector('.e-list-icon');
            liTextElement.insertBefore(liIconElement, args.node.querySelector('.e-list-text'));
        }
        if (allowDrag && !this.parent.isAdaptive) {
            allowDrag = false;
            let dragElement: Element = createElement('span', {
                attrs: {
                    'tabindex': '-1',
                    title: this.parent.localeObj.getConstant('drag'),
                    'aria-disabled': 'false'
                },
                styles: 'visibility:' + (dragVisibility ? 'visible;' : 'hidden;'),
                className: cls.ICON + ' ' + cls.DRAG_CLASS
            });
            if (args.node.querySelector('.e-checkbox-wrapper') &&
                !args.node.querySelector('.cls.DRAG_CLASS') && liTextElement) {
                liTextElement.insertBefore(dragElement, args.node.querySelector('.e-checkbox-wrapper'));
            }
        }
        if (args.node.querySelector('.' + cls.NODE_CHECK_CLASS)) {
            addClass([args.node.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
        }
    }
    private updateOlapTreeNode(args: DrawNodeEventArgs): boolean {
        let allowDrag: boolean = false;
        if (this.parent.dataType === 'olap') {
            /* tslint:disable-next-line:max-line-length */
            if (args.node && args.node.querySelector('.e-calcMemberGroupCDB,.e-measureGroupCDB-icon,.e-folderCDB-icon,.e-folderCDB-open-icon,.e-dimensionCDB-icon,.e-kpiCDB-icon')) {
                (args.node.querySelector('.e-checkbox-wrapper') as HTMLElement).style.display = 'none';
            }
            if (args.node && args.node.querySelector('.e-list-icon') &&
                (args.node.querySelector('.e-list-icon').className.indexOf('e-level-members') > -1)) {
                if (this.parent.isAdaptive) {
                    (args.node.querySelector('.e-checkbox-wrapper') as HTMLElement).style.display = 'none';
                } else {
                    (args.node.querySelector('.e-checkbox-wrapper') as HTMLElement).style.visibility = 'hidden';
                }
            }
            if (args.node && (args.node.querySelector('.e-hierarchyCDB-icon,.e-attributeCDB-icon,.e-namedSetCDB-icon') ||
                args.node.querySelector('.e-measure-icon,.e-kpiGoal-icon,.e-kpiStatus-icon,.e-kpiTrend-icon,.e-kpiValue-icon') ||
                args.node.querySelector('.e-calc-measure-icon,.e-calc-dimension-icon'))) {
                if (args.node.querySelector('.e-measure-icon')) {
                    (args.node.querySelector('.e-list-icon') as HTMLElement).style.display = 'none';
                    allowDrag = true;
                } else {
                    allowDrag = true;
                }
            }
        } else {
            allowDrag = true;
        }
        return allowDrag;
    }
    private renderTreeDialog(axis?: number): void {
        let fieldListDialog: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_FieldListTreeView',
            className: cls.ADAPTIVE_FIELD_LIST_DIALOG_CLASS + ' ' + (this.parent.dataType === 'olap' ? 'e-olap-editor-dialog' : ''),
        });
        this.parentElement.appendChild(fieldListDialog);
        this.fieldDialog = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: false,
            header: this.parent.localeObj.getConstant('adaptiveFieldHeader'),
            content: this.createTreeView(this.getTreeData(axis)),
            isModal: true,
            visible: true,
            showCloseIcon: false,
            enableRtl: this.parent.enableRtl,
            width: 'auto',
            height: '350px',
            position: { X: 'center', Y: 'center' },
            buttons: [{
                click: this.closeTreeDialog.bind(this),
                buttonModel: {
                    cssClass: cls.CANCEL_BUTTON_CLASS, content: this.parent.localeObj.getConstant('cancel')
                }
            }, {
                click: this.onFieldAdd.bind(this),
                buttonModel: {
                    cssClass: cls.OK_BUTTON_CLASS, content: this.parent.localeObj.getConstant('add'),
                    isPrimary: true
                }
            }],
            closeOnEscape: true,
            target: this.parentElement.parentElement,
            close: this.dialogClose.bind(this)
        });
        this.fieldDialog.isStringTemplate = true;
        this.fieldDialog.appendTo(fieldListDialog);
        // this.fieldDialog.element.querySelector('.e-dlg-header').innerHTML = this.parent.localeObj.getConstant('adaptiveFieldHeader');
    }

    private dialogClose(): void {
        if (document.getElementById(this.parent.element.id + '_FieldListTreeView')) {
            remove(document.getElementById(this.parent.element.id + '_FieldListTreeView'));
        }
    }

    private createTreeView(treeData: { [key: string]: Object }[]): HTMLElement {
        let editorTreeWrapper: HTMLElement = createElement('div', {
            id: this.parent.element.id + 'EditorDiv',
            className: cls.EDITOR_TREE_WRAPPER_CLASS
        });
        let searchWrapper: HTMLElement = createElement('div', {
            id: this.parent.element.id + '_SearchDiv', attrs: { 'tabindex': '-1' },
            className: cls.EDITOR_SEARCH_WRAPPER_CLASS
        });
        let editorSearch: HTMLInputElement = createElement('input', { attrs: { 'type': 'text' } }) as HTMLInputElement;
        searchWrapper.appendChild(editorSearch);
        let treeOuterDiv: HTMLElement = createElement('div', { className: cls.EDITOR_TREE_CONTAINER_CLASS + '-outer-div' });
        let treeViewContainer: HTMLElement = createElement('div', {
            className: cls.EDITOR_TREE_CONTAINER_CLASS + ' ' + (this.parent.dataType === 'olap' ? 'e-olap-field-list-tree' : '')
        });
        editorTreeWrapper.appendChild(searchWrapper);
        this.editorSearch = new MaskedTextBox({
            showClearButton: true,
            placeholder: this.parent.localeObj.getConstant('search'),
            enableRtl: this.parent.enableRtl,
            cssClass: cls.EDITOR_SEARCH_CLASS,
            change: this.textChange.bind(this)
        });
        this.editorSearch.isStringTemplate = true;
        this.editorSearch.appendTo(editorSearch);
        let promptDiv: HTMLElement = createElement('div', {
            className: cls.EMPTY_MEMBER_CLASS + ' ' + cls.ICON_DISABLE,
            innerHTML: this.parent.localeObj.getConstant('noMatches')
        });
        editorTreeWrapper.appendChild(promptDiv);
        treeOuterDiv.appendChild(treeViewContainer);
        editorTreeWrapper.appendChild(treeOuterDiv);
        this.fieldTable = new TreeView({
            /* tslint:disable-next-line:max-line-length */
            fields: { dataSource: treeData, id: 'id', text: 'caption', isChecked: 'isSelected', parentID: 'pid', iconCss: 'spriteCssClass' },
            showCheckBox: true,
            autoCheck: false,
            loadOnDemand: false,
            sortOrder: this.parent.dataType === 'olap' ? 'None' : 'Ascending',
            enableRtl: this.parent.enableRtl,
            nodeChecked: this.addNode.bind(this),
            drawNode: this.updateTreeNode.bind(this),
            nodeExpanding: this.updateNodeIcon.bind(this),
            nodeCollapsed: this.updateNodeIcon.bind(this),
        });
        this.fieldTable.isStringTemplate = true;
        this.fieldTable.appendTo(treeViewContainer);
        return editorTreeWrapper;
    }

    private textChange(e: MaskChangeEventArgs): void {
        this.parent.pivotCommon.eventBase.searchTreeNodes(e, this.fieldTable, true);
        let promptDiv: HTMLElement = this.fieldDialog.element.querySelector('.' + cls.EMPTY_MEMBER_CLASS);
        let liList: HTMLElement[] = [].slice.call(this.fieldTable.element.querySelectorAll('li')) as HTMLElement[];
        /* tslint:disable-next-line:max-line-length */
        let disabledList: HTMLElement[] = [].slice.call(this.fieldTable.element.querySelectorAll('li.' + cls.ICON_DISABLE)) as HTMLElement[];
        if (liList.length === disabledList.length) {
            removeClass([promptDiv], cls.ICON_DISABLE);
        } else {
            addClass([promptDiv], cls.ICON_DISABLE);
        }
    }

    private dragStart(args: DragAndDropEventArgs): void {
        if ((args.event.target as HTMLElement).classList.contains(cls.DRAG_CLASS)) {
            this.parent.isDragging = true;
            addClass([args.draggedNode.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.SELECTED_NODE_CLASS);
            let data: IField;
            if (this.parent.dataType === 'olap') {
                data = this.parent.olapEngineModule.fieldList[args.draggedNode.getAttribute('data-uid')];
            } else {
                data = this.parent.engineModule.fieldList[args.draggedNode.getAttribute('data-uid')];
            }
            let axis: string[] = [cls.ROW_AXIS_CLASS, cls.COLUMN_AXIS_CLASS, cls.FILTER_AXIS_CLASS];
            if (data && data.aggregateType === 'CalculatedField') {
                for (let axisContent of axis) {
                    addClass([this.parentElement.querySelector('.' + axisContent)], cls.NO_DRAG_CLASS);
                }
            }
            let dragItem: HTMLElement = args.clonedNode;
            if (dragItem && (this.parent.getModuleName() === 'pivotfieldlist' &&
                this.parent.renderMode) === 'Popup') {
                dragItem.style.zIndex = (this.parent.dialogRenderer.fieldListDialog.zIndex + 1).toString();
            }
        } else {
            args.cancel = true;
        }
    }
    private dragStop(args: DragAndDropEventArgs): void {
        args.cancel = true;
        this.parent.isDragging = false;
        let axis: string[] = [cls.ROW_AXIS_CLASS, cls.COLUMN_AXIS_CLASS, cls.FILTER_AXIS_CLASS];
        for (let axisElement of axis) {
            removeClass([this.parentElement.querySelector('.' + axisElement)], cls.NO_DRAG_CLASS);
        }
        removeClass([args.draggedNode.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.SELECTED_NODE_CLASS);
        if (this.parent.pivotCommon.filterDialog.dialogPopUp) {
            this.parent.pivotCommon.filterDialog.dialogPopUp.close();
        }
        let fieldName: string = args.draggedNodeData.id.toString();
        if (!this.isNodeDropped(args, fieldName)) { return; }
        let list: { [key: string]: Object } = this.parent.pivotFieldList;
        let selectedNode: { [key: string]: Object } = list[fieldName] as { [key: string]: Object };
        this.parent.pivotCommon.dataSourceUpdate.control = this.parent.getModuleName() === 'pivotview' ? this.parent :
            ((this.parent as PivotFieldList).pivotGridModule ? (this.parent as PivotFieldList).pivotGridModule : this.parent);
        if (this.parent.pivotCommon.nodeStateModified.onStateModified(args, fieldName)) {
            if (this.parent.allowDeferLayoutUpdate) {
                selectedNode.isSelected = true;
                this.updateDataSource();
            } else {
                this.parent.updateDataSource();
            }
            let parent: PivotFieldList = this.parent;
            //setTimeout(() => {
            parent.axisFieldModule.render();
            //});
        }
    }
    private isNodeDropped(args: DragAndDropEventArgs, targetID: string): boolean {
        let isDropped: boolean = true;
        if (args.draggedNodeData.isChecked === 'true') {
            let target: HTMLElement = this.getButton(targetID);
            let axisPanel: HTMLElement = closest(target, '.' + cls.DROPPABLE_CLASS) as HTMLElement;
            let droppableElement: HTMLElement = closest(args.target, '.' + cls.DROPPABLE_CLASS) as HTMLElement;
            if (target && axisPanel === droppableElement) {
                let pivotButtons: HTMLElement[] = [].slice.call(axisPanel.querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
                let dropTarget: HTMLElement = closest(args.target, '.' + cls.PIVOT_BUTTON_WRAPPER_CLASS) as HTMLElement;
                let sourcePosition: number;
                let dropPosition: number = -1;
                for (let i: number = 0, n: number = pivotButtons.length; i < n; i++) {
                    if (pivotButtons[i].id === target.id) {
                        sourcePosition = i;
                    }
                    if (dropTarget) {
                        let droppableButton: HTMLElement = dropTarget.querySelector('.' + cls.PIVOT_BUTTON_CLASS) as HTMLElement;
                        if (pivotButtons[i].id === droppableButton.id) {
                            dropPosition = i;
                        }
                    }
                }
                if (sourcePosition === dropPosition || (sourcePosition === (pivotButtons.length - 1) && dropPosition === -1)) {
                    let parentElement: HTMLElement = document.getElementById(this.parent.element.id + '_Wrapper');
                    removeClass([].slice.call(parentElement.querySelectorAll('.' + cls.DROP_INDICATOR_CLASS)), cls.INDICATOR_HOVER_CLASS);
                    isDropped = false;
                }
            }
        }
        return isDropped;
    }
    private getButton(fieldName: string): HTMLElement {
        let wrapperElement: HTMLElement = document.getElementById(this.parent.element.id + '_Wrapper');
        let pivotButtons: HTMLElement[] = [].slice.call(wrapperElement.querySelectorAll('.' + cls.PIVOT_BUTTON_CLASS));
        let buttonElement: HTMLElement;
        for (let i: number = 0, n: number = pivotButtons.length; i < n; i++) {
            if (pivotButtons[i].id === fieldName) {
                buttonElement = pivotButtons[i];
                break;
            }
        }
        return buttonElement;
    }
    private nodeStateChange(args: NodeCheckEventArgs): void {
        let node: HTMLElement = closest(args.node, '.' + cls.TEXT_CONTENT_CLASS) as HTMLElement;
        if (!isNullOrUndefined(node)) {
            let li: HTMLElement = closest(node, 'li') as HTMLElement;
            let id: string = li.getAttribute('data-uid');
            if (this.parent.pivotCommon.filterDialog.dialogPopUp) {
                this.parent.pivotCommon.filterDialog.dialogPopUp.close();
            }
            let list: { [key: string]: Object } = this.parent.pivotFieldList;
            let selectedNode: { [key: string]: Object } = list[id] as { [key: string]: Object };
            if (args.action === 'check') {
                addClass([node.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
                this.updateSelectedNodes(li, args.action);
                let addNode: IFieldOptions = this.parent.pivotCommon.dataSourceUpdate.getNewField(id);
                if (selectedNode.type === 'number' || (selectedNode.type === 'CalculatedField' &&
                    selectedNode.formula && (selectedNode.formula as string).indexOf('Measure') > -1 &&
                    this.parent.dataType === 'olap')) {
                    this.parent.dataSourceSettings.values.push(addNode);
                    if (this.parent.dataType === 'olap' && this.parent.olapEngineModule && !(this.parent.olapEngineModule).isMeasureAvail) {
                        let measureField: IFieldOptions = {
                            name: '[Measures]', caption: 'Measures', baseField: undefined, baseItem: undefined,
                        };
                        let fieldAxis: IFieldOptions[] = this.parent.dataSourceSettings.valueAxis === 'row' ?
                            this.parent.dataSourceSettings.rows : this.parent.dataSourceSettings.columns;
                        fieldAxis.push(measureField);
                    }
                } else {
                    this.parent.dataSourceSettings.rows.push(addNode);
                }
            } else {
                removeClass([node.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
                this.updateSelectedNodes(li, args.action);
                this.parent.pivotCommon.dataSourceUpdate.removeFieldFromReport(id);
                if (this.parent.dataType === 'olap' && this.parent.dataSourceSettings.values.length === 0) {
                    this.parent.pivotCommon.dataSourceUpdate.removeFieldFromReport('[Measures]');
                }
            }
            if (!this.parent.allowDeferLayoutUpdate) {
                this.parent.updateDataSource(true);
            } else {
                selectedNode.isSelected = args.action === 'check';
                if (this.parent.dataType === 'olap') {
                    this.parent.olapEngineModule.updateFieldlistData(id, args.action === 'check');
                }
                this.updateDataSource();
            }
            let parent: PivotFieldList = this.parent;
            setTimeout(() => {
                parent.axisFieldModule.render();
            });
        }
    }
    private updateSelectedNodes(li: HTMLElement, state: string): void {
        if (li && li.querySelector('ul')) {
            for (let element of [].slice.call(li.querySelectorAll('li'))) {
                if (state === 'check') {
                    addClass([element.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
                } else {
                    removeClass([element.querySelector('.' + cls.LIST_TEXT_CLASS)], cls.LIST_SELECT_CLASS);
                }
            }
        }
    }

    private updateDataSource(): void {
        if (this.parent.getModuleName() === 'pivotfieldlist' && (this.parent as PivotFieldList).renderMode === 'Popup') {
            if (this.parent.dataType === 'olap') {
                (this.parent as PivotFieldList).pivotGridModule.olapEngineModule = (this.parent as PivotFieldList).olapEngineModule;
            } else {
                (this.parent as PivotFieldList).pivotGridModule.engineModule = (this.parent as PivotFieldList).engineModule;
            }
            /* tslint:disable-next-line:max-line-length */
            (this.parent as PivotFieldList).pivotGridModule.setProperties({ dataSourceSettings: (<{ [key: string]: Object }>this.parent.dataSourceSettings).properties as IDataOptions }, true);
            (this.parent as PivotFieldList).pivotGridModule.notify(events.uiUpdate, this);
        } else {
            this.parent.triggerPopulateEvent();
        }
    }

    private addNode(args: NodeCheckEventArgs): void {
        let fieldList: { [key: string]: Object } = this.parent.pivotFieldList;
        let selectedNode: { [key: string]: Object } = fieldList[args.data[0].id.toString()] as { [key: string]: Object };
        if (args.action === 'check') {
            this.selectedNodes.push(selectedNode.id.toString());
        } else {
            let count: number = this.selectedNodes.length;
            while (count--) {
                if (this.selectedNodes[count] === selectedNode.id.toString()) {
                    this.selectedNodes.splice(count, 1);
                    break;
                }
            }
        }
    }

    private refreshTreeView(): void {
        if (this.fieldTable) {
            let treeData: { [key: string]: Object }[] = this.getUpdatedData();
            this.fieldTable.fields = {
                dataSource: treeData, id: 'id', text: 'caption', isChecked: 'isSelected', parentID: 'pid', iconCss: 'spriteCssClass'
            };
            this.fieldTable.dataBind();
        }
    }

    private getUpdatedData(): { [key: string]: Object }[] {
        let treeData: { [key: string]: Object }[] = this.getTreeData();
        let expandedNodes: string[] = this.fieldTable.expandedNodes;
        this.updateExpandedNodes(treeData, expandedNodes);
        return this.applySorting(treeData, this.fieldListSort);
    }
    private getTreeData(axis?: number): { [key: string]: Object }[] {
        let data: { [key: string]: Object }[] = [];
        if (this.parent.dataType === 'olap') {
            data = this.getOlapTreeData(axis);
        } else {
            let keys: string[] = Object.keys(this.parent.pivotFieldList);
            let fieldList: { [key: string]: { id?: string; caption?: string; isSelected?: boolean; } } = {};
            for (let key of keys) {
                let member: IField = this.parent.pivotFieldList[key];
                fieldList[key] = { id: member.id, caption: member.caption, isSelected: member.isSelected };
            }
            if (this.parent.isAdaptive) {
                /* tslint:disable-next-line:max-line-length */
                let fields: IFieldOptions[][] = [this.parent.dataSourceSettings.filters, this.parent.dataSourceSettings.columns, this.parent.dataSourceSettings.rows,
                this.parent.dataSourceSettings.values];
                let currentFieldSet: IFieldOptions[] = fields[axis];
                let len: number = keys.length;
                while (len--) {
                    fieldList[keys[len]].isSelected = false;
                }
                for (let item of currentFieldSet) {
                    fieldList[item.name].isSelected = true;
                }
            }
            let list: { [key: string]: Object } = fieldList as { [key: string]: Object };
            for (let member of keys) {
                let obj: { [key: string]: Object } = list[member] as { [key: string]: Object };
                data.push(obj);
            }
        }

        return data;
    }
    private getOlapTreeData(axis?: number): { [key: string]: Object }[] {
        let data: { [key: string]: Object }[] = [];
        let fieldListData: IOlapField[] = this.parent.olapEngineModule.fieldListData;
        if (this.parent.isAdaptive) {
            /* tslint:disable-next-line:max-line-length */
            let fields: IFieldOptions[][] = [
                this.parent.dataSourceSettings.filters, this.parent.dataSourceSettings.columns,
                this.parent.dataSourceSettings.rows, this.parent.dataSourceSettings.values];
            let currentFieldSet: IFieldOptions[] = fields[axis];
            let i: number = 0;
            while (i < fieldListData.length) {
                let item: IOlapField = fieldListData[i];
                /* tslint:disable */
                let framedSet: { [key: string]: any };
                /* tslint:enable */
                if (axis === 3) {
                    if ((item.id as string).toLowerCase() !== '[measures]' &&
                        ((item.id as string).toLowerCase().indexOf('[measures]') === 0 ||
                            (item.spriteCssClass && item.spriteCssClass.indexOf('e-measureCDB') !== -1)) ||
                        ((item.id as string).toLowerCase() === '[calculated members].[_0]' ||
                            (item.spriteCssClass && item.spriteCssClass.indexOf('e-calc-measure-icon') !== -1))) {
                        framedSet = {
                            id: item.id, caption: item.caption, hasChildren: item.hasChildren,
                            type: item.type, aggregateType: item.aggregateType,
                            isSelected: item.isSelected, pid: item.pid, spriteCssClass: item.spriteCssClass
                        };
                        framedSet.isSelected = false;
                        if (framedSet.spriteCssClass && framedSet.spriteCssClass.indexOf('e-measureCDB') !== -1) {
                            framedSet.spriteCssClass = framedSet.spriteCssClass.replace('e-folderCDB-icon', 'e-measureGroupCDB-icon');
                            framedSet.pid = undefined;
                        }
                        for (let field of currentFieldSet) {
                            if (framedSet.id === field.name) {
                                framedSet.isSelected = true;
                                break;
                            }
                        }
                        data.push(framedSet);
                    }
                } else {
                    if (!((item.id as string).toLowerCase().indexOf('[measures]') === 0) &&
                        !(item.spriteCssClass && item.spriteCssClass.indexOf('e-measureCDB') !== -1) &&
                        !(item.spriteCssClass && item.spriteCssClass.indexOf('e-calc-measure-icon') !== -1)) {
                        framedSet = {
                            id: item.id, caption: item.caption, hasChildren: item.hasChildren,
                            type: item.type, aggregateType: item.aggregateType,
                            isSelected: item.isSelected, pid: item.pid, spriteCssClass: item.spriteCssClass
                        };
                        framedSet.isSelected = false;
                        for (let item of currentFieldSet) {
                            if (framedSet.id === item.name) {
                                framedSet.isSelected = true;
                                break;
                            }
                        }
                        data.push(framedSet);
                    }
                }
                i++;
            }
        } else {
            data = PivotUtil.getClonedData(this.parent.olapEngineModule.fieldListData as { [key: string]: Object }[]);
        }
        return data;
    }
    private updateExpandedNodes(data: { [key: string]: Object }[], expandedNodes: string[]): void {
        if (expandedNodes.length > 0) {
            let i: number = 0;
            for (let field of data) {
                if (expandedNodes.indexOf((field as IOlapField).id) > -1) {
                    i++;
                    (field as IOlapField).expanded = true;
                    (field as IOlapField).spriteCssClass = ((field as IOlapField).spriteCssClass &&
                        (field as IOlapField).spriteCssClass.toString().indexOf('e-folderCDB-icon') > -1 ?
                        (field as IOlapField).spriteCssClass.toString().replace('e-folderCDB-icon', 'e-folderCDB-open-icon') :
                        (field as IOlapField).spriteCssClass);
                    if (i === (expandedNodes.length)) {
                        break;
                    }
                }
            }
        }
    }
    private updateSorting(args: Event): void {
        let target: HTMLElement = (args.target as HTMLElement);
        let option: string = target.getAttribute('data-sort');
        if (target.className.indexOf('e-selected') === -1) {
            switch (option) {
                case 'None':
                    this.fieldListSort = 'None';
                    addClass([target], 'e-selected');
                    removeClass([this.parentElement.querySelector('.e-sort-ascend')], 'e-selected');
                    removeClass([this.parentElement.querySelector('.e-sort-descend')], 'e-selected');
                    break;
                case 'Ascend':
                    this.fieldListSort = 'Ascend';
                    addClass([target], 'e-selected');
                    removeClass([this.parentElement.querySelector('.e-sort-none')], 'e-selected');
                    removeClass([this.parentElement.querySelector('.e-sort-descend')], 'e-selected');
                    break;
                case 'Descend':
                    this.fieldListSort = 'Descend';
                    addClass([target], 'e-selected');
                    removeClass([this.parentElement.querySelector('.e-sort-ascend')], 'e-selected');
                    removeClass([this.parentElement.querySelector('.e-sort-none')], 'e-selected');
                    break;
            }
            this.refreshTreeView();
        }
    }
    private applySorting(treeData: { [key: string]: Object }[], sortOrder: string): { [key: string]: Object }[] {
        if (this.parent.dataType === 'olap') {
            let measure: { [key: string]: Object };
            let calcMember: { [key: string]: Object };
            if (this.parent.dataSourceSettings.calculatedFieldSettings.length > 0 &&
                (treeData[0].id as string).toLowerCase() === '[calculated members].[_0]') {
                calcMember = treeData[0];
                measure = treeData[1];
                treeData.splice(0, 2);
            } else {
                measure = treeData[0];
                treeData.splice(0, 1);
            }
            /* tslint:disable:typedef */
            treeData = sortOrder === 'Ascend' ?
                (treeData.sort((a, b) => (a.caption > b.caption) ? 1 : ((b.caption > a.caption) ? -1 : 0))) :
                sortOrder === 'Descend' ?
                    (treeData.sort((a, b) => (a.caption < b.caption) ? 1 : ((b.caption < a.caption) ? -1 : 0))) :
                    treeData;
            /* tslint:enable:typedef */
            if (calcMember) {
                treeData.splice(0, 0, calcMember, measure);
            } else {
                treeData.splice(0, 0, measure);
            }
        } else {
            this.fieldTable.sortOrder = ((sortOrder === 'Ascend' ? 'Ascending' : (sortOrder === 'Descend' ? 'Descending' : 'None')));
        }
        return treeData;
    }
    private onFieldAdd(e: MouseEventArgs & TouchEventArgs): void {
        this.parent.dialogRenderer.updateDataSource(this.selectedNodes);
        this.closeTreeDialog();
    }

    private closeTreeDialog(): void {
        this.selectedNodes = [];
        this.fieldDialog.hide();
    }
    private keyPress(e: KeyboardEvent): void {
        let target: Element = (e.target as HTMLElement);
        if (e.keyCode === 13 && e.target) {
            (e.target as HTMLElement).click();
            e.preventDefault();
            return;
        }
    }

    private wireFieldListEvent(element: Element): void {
        EventHandler.add(element, 'keydown', this.keyPress, this);
        EventHandler.add(element, 'click', this.updateSorting, this);
    }

    private unWireFieldListEvent(element: Element): void {
        EventHandler.remove(element, 'keydown', this.keyPress);
        EventHandler.remove(element, 'click', this.updateSorting);
    }

    /**

     */
    public addEventListener(): void {
        this.parent.on(events.treeViewUpdate, this.refreshTreeView, this);
    }

    /**

     */
    public removeEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.off(events.treeViewUpdate, this.refreshTreeView);
    }

    /**
     * To destroy the tree view event listener 
     * @return {void}

     */

    public destroy(): void {
        this.removeEventListener();
    }
}