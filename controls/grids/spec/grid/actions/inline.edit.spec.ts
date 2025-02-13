/**
 * Grid Inline edit spec document
 */
import { EmitType } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Filter } from '../../../src/grid/actions/filter';
import { Edit } from '../../../src/grid/actions/edit';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { DetailRow } from '../../../src/grid/actions/detail-row';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Page } from '../../../src/grid/actions/page';
import { Freeze } from '../../../src/grid/actions/freeze';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Selection } from '../../../src/grid/actions/selection';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { createGrid, destroy } from '../base/specutil.spec';
import { data, employeeData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import * as events from '../../../src/grid/base/constant';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';

Grid.Inject(Filter, Page, Selection, Group, Edit, Sort, Reorder, Toolbar, DetailRow, Freeze, VirtualScroll);

describe('Inline Editing module', () => {

    let dataSource: Function = (): Object[] => {
        let datasrc: Object[] = [];
        for (let i = 0; i < 11; i++) {
            datasrc.push(extend({}, {}, data[i], true));
        }
        return datasrc;
    };


    describe('Inline editing render => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('Edit start - args.cancel', (done: Function) => {
            actionBegin = (args?: any): void => {               
                if (args.requestType === 'beginEdit') {
                    args.cancel = true;
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };
            gridObj.actionBegin = actionBegin;
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });


        it('Edit start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                    let cells = gridObj.element.querySelector('.e-editedrow').querySelectorAll('.e-rowcell');
                    expect(cells.length).toBe(gridObj.columns.length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(1);
                    // allow Editing false
                    expect(cells[2].querySelectorAll('input.e-disabled').length).toBe(1);
                    // isIdentity check
                    expect(cells[6].querySelectorAll('input.e-disabled').length).toBe(1);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'CustomerID');
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
                    expect(gridObj.isEdit).toBeTruthy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            gridObj.clearSelection();
            let formFunc: any = (args?: any): void => {
                expect(args.name).toBe('edit-form');
                gridObj.off(events.beforeStartEdit, formFunc);
            };
            gridObj.on(events.beforeStartEdit, formFunc, this);
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('Edit complete - args.cancel', (done: Function) => {
            actionBegin = (args?: any): void => {
                if (args.requestType === 'save') {
                    args.cancel = true;
                    done();
                }
            };
            gridObj.actionBegin = actionBegin;
            (gridObj.editModule as any).editModule.endEdit();
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);

                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(11);
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.isEdit).toBeTruthy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('Add start - args.cancel', (done: Function) => {
            //form destroy check for last action
            expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
            actionBegin = (args?: any): void => {
                if (args.requestType === 'add') {
                    args.cancel = true;
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };
            gridObj.actionBegin = actionBegin;
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(1);
                    let cells = gridObj.element.querySelector('.e-addedrow').querySelectorAll('.e-rowcell');
                    expect(cells.length).toBe(gridObj.columns.length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(0);
                    // allow Editing false
                    expect(cells[2].querySelectorAll('input.e-disabled').length).toBe(1);
                    // isIdentity check
                    expect(cells[6].querySelectorAll('input.e-disabled').length).toBe(1);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'OrderID');
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
                    expect(gridObj.isEdit).toBeTruthy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check for last action
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            //edited class check for last action
            expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(0);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add complete - args.cancel', (done: Function) => {
            actionBegin = (args?: any): void => {
                if (args.requestType === 'save') {
                    args.cancel = true;
                    done();
                }
            };
            gridObj.actionBegin = actionBegin;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'OrderID') as any).value = 10247;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            (gridObj.editModule as any).editModule.endEdit();
        });

        it('Add complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);

                    //form destroy check
                    expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).OrderID).toBe(10247);
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(12);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(12);
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };

            actionBegin = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.isEdit).toBeTruthy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });


        it('Delete action', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'delete') {
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(11);
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'delete') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check for last action
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            //added class check for last action
            expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(0);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_delete' } });
        });

        it('Edit-cancel start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    expect(gridObj.isEdit).toBeTruthy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('Edit-cancel complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);

                    //form destroy check
                    expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).CustomerID).not.toBe('updatednew');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(11);
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    expect(gridObj.isEdit).toBeTruthy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updatednew';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_cancel' } });
        });

        it('Add-cancel start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    expect(gridObj.isEdit).toBeTruthy();
                    //for coverage
                    (gridObj.editModule as any).editModule.addRecord();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add-cancel complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);
                    //form destroy check
                    expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).OrderID).not.toBe(10247);
                    expect((gridObj.currentViewData[0] as any).CustomerID).not.toBe('updatednew');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(11);
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };

            actionBegin = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    expect(gridObj.isEdit).toBeTruthy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
            (gridObj.element.querySelector('#' + gridObj.element.id + 'OrderID') as any).value = 10247;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updatednew';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_cancel' } });
        });

        it('toolbar status check', () => {
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            (gridObj.element.querySelector('.e-rowcell') as any).click();
        });

        it('dbl edit start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    expect(gridObj.isEdit).toBeTruthy();
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = null;
            (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[1].firstElementChild });
        });

        it('click another row edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.currentViewData[1] as any).CustomerID).toBe('updated');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            (gridObj.element.querySelectorAll('.e-row')[2] as any).cells[0].click();
        });

        it('Add complete method with data testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(12);
                //record count check
                expect(gridObj.currentViewData.length).toBe(12);
                done();
            };

            gridObj.actionComplete = actionComplete;
            (<any>gridObj.editModule).editModule.addRecord({ OrderID: 10246, CustomerID: 'updated' });
        });

        it('dbl edit false testing', () => {
            gridObj.editSettings.allowEditOnDblClick = false;
            gridObj.dataBind();
            (gridObj as any).dblClickHandler({ target: gridObj.element.querySelectorAll('.e-row')[1].firstElementChild });
            expect(gridObj.isEdit).toBeFalsy();
        });

        it('end edit method call after editing completed', () => {
            (gridObj.editModule as any).editModule.endEdit();
            expect(gridObj.isEdit).toBeFalsy();
        });

        it('check validation msg width', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    gridObj.element.focus();
                    (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
                    let validationEle: HTMLElement = gridObj.element.querySelectorAll('.e-tooltip-wrap')[0] as HTMLElement;
                    expect(validationEle.style.maxWidth).not.toBe(null);
                    expect(validationEle.style.textAlign).toBe('center');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });


    describe('Keyboard shortcuts => ', () => {
        let gridObj: Grid;
        let preventDefault: Function = new Function();
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: false,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('Edit start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Add start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.keyboardModule.keyAction({ action: 'insert', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Add complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.currentViewData[0] as any).OrderID).toBe(10247);
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'OrderID') as any).value = 10247;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });


        it('Delete action', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'delete') {
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(11);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(11);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.keyboardModule.keyAction({ action: 'delete', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Edit-cancel start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Edit-cancel complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    expect((gridObj.currentViewData[0] as any).CustomerID).not.toBe('updatednew');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updatednew';
            gridObj.keyboardModule.keyAction({ action: 'escape', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = preventDefault = null;
        });
    });

    describe('Disable editing, edit mode change and delete alert => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', textAlign: 'Right' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity', textAlign: 'Center' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', textAlign: 'Left' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('editing disable testing', () => {
            gridObj.editSettings.allowAdding = false;
            gridObj.dataBind();
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
            gridObj.editSettings.allowDeleting = false;
            gridObj.dataBind();
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(5);
            gridObj.editSettings.allowEditing = false;
            gridObj.dataBind();
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(6);
            expect(gridObj.editModule).toBeUndefined();
            gridObj.editSettings.allowEditing = true;
            gridObj.dataBind();
            expect(gridObj.editModule).not.toBeUndefined();
        });

        it('adding disable testing', () => {
            gridObj.editModule.addRecord();
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(5);
        });

        it('deleting disable testing', () => {
            gridObj.clearSelection();
            gridObj.selectRow(3, true);
            gridObj.editModule.deleteRecord();
            expect((gridObj.editModule as any).editModule.editRowIndex).not.toBe(3);
            gridObj.editSettings.showDeleteConfirmDialog = true;
            gridObj.editSettings.allowDeleting = true;
            gridObj.dataBind();
        });

        it('deleting - no record alert', () => {
            gridObj.clearSelection();
            gridObj.deleteRecord();
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditAlert').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditAlert').querySelector('button').click();
        });

        it('deleting - delete confirm - cancel', () => {
            gridObj.clearSelection();
            gridObj.selectRow(3, true);
            gridObj.deleteRecord();
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[1].click();
        });

        it('deleting - delete confirm - ok', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'delete') {
                    done();
                }
            };
            gridObj.clearSelection();
            gridObj.selectRow(3, true);
            gridObj.actionComplete = actionComplete;
            gridObj.deleteRecord();
            expect(gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').classList.contains('e-popup-open')).toBeTruthy();
            gridObj.element.querySelector('#' + gridObj.element.id + 'EditConfirm').querySelectorAll('button')[0].click();
            gridObj.editSettings.allowAdding = true;
            gridObj.dataBind();
            gridObj.editSettings.allowEditing = true;
            gridObj.dataBind();
        });

        it('edit mode change', () => {
            gridObj.editSettings.mode = 'Batch';
            gridObj.dataBind();
            expect((gridObj.editModule as any).editModule.saveCell).not.toBeUndefined();
            gridObj.editSettings.mode = 'Dialog';
            gridObj.dataBind();
            gridObj.editSettings.mode = 'Normal';
            gridObj.dataBind();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });


    describe('Group, and text align => ', () => {
        let gridObj: Grid;
        let preventDefault: Function = new Function();
        let actionBegin: () => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', textAlign: 'Right' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity', textAlign: 'Center' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', textAlign: 'Left' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('text align check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    let row: Element = gridObj.element.querySelectorAll('.e-editedrow')[0];
                    expect((row.querySelector('#' + gridObj.element.id + 'CustomerID') as any).style.textAlign).toBe('right');
                    expect((row.querySelector('#' + gridObj.element.id + 'ShipCity') as any).style.textAlign).toBe('center');
                    expect((row.querySelector('#' + gridObj.element.id + 'ShipRegion') as any).style.textAlign).toBe('left');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: (<any>gridObj.getContent().querySelector('.e-row')).cells[0] } as any);
        });

        it('group column method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ShipCity');
        });

        it('group cell indent check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelector('.e-editedrow').querySelectorAll('.e-indentcell').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.getCurrentViewRecords()[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('ungroup column method - ok', (done: Function) => {
            actionComplete = (args: any): void => {
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('ShipCity');
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = preventDefault = actionComplete = null;
        });
    });

    describe('detail row editing => ', () => {
        let gridObj: Grid;
        let preventDefault: Function = new Function();
        let actionBegin: () => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    detailTemplate: '<div></div>',
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', textAlign: 'Right' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity', textAlign: 'Center' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', textAlign: 'Left' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('detail row edit check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelector('.e-editedrow').querySelectorAll('.e-detailrowcollapse').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.getCurrentViewRecords()[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = preventDefault = actionComplete = null;
        });
    });

    describe('cell edit template => ', () => {
        let gridObj: Grid;
        let elem: HTMLElement = createElement('div', { id: 'Grid55abc' });
        let preventDefault: Function = new Function();
        let actionBegin: () => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            let datePickerObj: DatePicker;
            gridObj = new Grid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', textAlign: 'Right' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        {
                            field: 'ShipCity', textAlign: 'Center', edit: {
                                create: () => {
                                    return '<input>';
                                }
                            }
                        },
                        { field: 'Verified', type: 'boolean' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        {
                            field: 'ShipRegion', type: 'string', textAlign: 'Left', edit: {
                                create: () => {
                                    elem = document.createElement('div').appendChild(document.createElement('input'));
                                    return elem;
                                }
                            }
                        },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        {
                            field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', edit: {
                                create: () => {
                                    elem = document.createElement('input');
                                    return elem;
                                },
                                read: () => {
                                    return datePickerObj.value;
                                },
                                destroy: () => {
                                    datePickerObj.destroy();
                                },
                                write: (args: any) => {
                                    datePickerObj = new DatePicker({
                                        value: new Date(args.rowData[args.column.field]),
                                        floatLabelType: 'Never'
                                    });
                                    datePickerObj.appendTo(elem);
                                }
                            }
                        }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                    dataBound: dataBound
                });
            gridObj.appendTo('#Grid55abc');
        });

        it('cell template edit check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.getCurrentViewRecords()[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            gridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: gridObj.getContent().querySelector('.e-row') } as any);
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            elem.remove();
            if (document.getElementById('Grid55abc')) {
                document.getElementById('Grid55abc').remove();
            }
            gridObj = actionBegin = elem = preventDefault = actionComplete = null;
        });
    });


    describe('validation testing => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string', textAlign: 'Right', validationRules: { required: true } },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity', textAlign: 'Center' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string', textAlign: 'Left' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('edit row check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('Edit with invalid data', () => {
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = '';
            expect(gridObj.editModule.editFormValidate()).toBeFalsy();
            expect(gridObj.editModule.formObj.element.querySelectorAll('.e-griderror').length).toBe(1);
            let errors: any = document.querySelectorAll('.e-griderror');
            // EJ2-7735 Grid Validation message is not shown in Essential JavaScript 2 compatibility theme
            expect(errors[0].classList.contains('e-control')).toBeTruthy();
            expect(errors.length).toBeGreaterThan(0);
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.getCurrentViewRecords()[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('Add start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add with invalid data', () => {
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
            expect(document.querySelectorAll('.e-griderror').length).toBeGreaterThan(0);
        });

        it('Add complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(12);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(12);
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'OrderID') as any).value = 10247;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        afterAll((done) => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            setTimeout(function () {
                done();
            }, 1000);
            gridObj = actionBegin = actionComplete = null;

        });
    });

    describe('Adding rows after hiding OrderID columnzz', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: false, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                }, done);
        });

        it('Add start-hiding column and clicking add button', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add complete - checking updation-hiding column and clicking add button', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updatedrow');
                    //row count check
                    expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(12);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(12);
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'save') {
                    done();
                }
            };
            gridObj.actionBegin = actionBegin;
            gridObj.actionComplete = actionComplete;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updatedrow';
            (gridObj.editModule as any).editModule.endEdit();
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });

    });
    describe('Datetime picker component rendering', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: false, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'datetime', editType: 'datetimepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                }, done);
        });

        it('render datetimepicker component while adding testing', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelector('.e-gridform').querySelectorAll('td')[6].querySelector('input').classList.contains('e-datetimepicker')).toBeTruthy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });

    });

    describe('Inline editing render with Freeze => ', () => {
        let gridObj: any;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    frozenColumns: 2,
                    frozenRows: 2,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, width: 75 },
                        { field: 'CustomerID', type: 'string', width: 75 },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit', width: 75 },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit', width: 75 },
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('Edit start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(2);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(2);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(2);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(2);
                    let cells = gridObj.element.querySelector('.e-editedrow').querySelectorAll('.e-rowcell');
                    let mCells = gridObj.element.querySelectorAll('.e-editedrow')[1].querySelectorAll('.e-rowcell');
                    expect(cells.length + mCells.length).toBe(gridObj.getVisibleColumns().length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(1);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'CustomerID');
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
                    expect(gridObj.isEdit).toBeTruthy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);

                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    //row count check
                    expect(gridObj.getContent().querySelector('.e-frozencontent').querySelectorAll('.e-row').length
                        + gridObj.getHeaderContent().querySelector('.e-frozenheader').querySelector('tbody').querySelectorAll('.e-row').length).toBe(11);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(11);
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.isEdit).toBeTruthy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('Add start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(2);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(2);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(2);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(2);
                    let cells = gridObj.element.querySelector('.e-addedrow').querySelectorAll('.e-rowcell');
                    let mCells = gridObj.element.querySelectorAll('.e-addedrow')[1].querySelectorAll('.e-rowcell');
                    expect(cells.length + mCells.length).toBe(gridObj.getVisibleColumns().length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(0);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'OrderID');
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
                    expect(gridObj.isEdit).toBeTruthy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check for last action
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            //edited class check for last action
            expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(0);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);

                    //form destroy check
                    expect(gridObj.editModule.formObj.isDestroyed).toBeTruthy();
                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).OrderID).toBe(10247);
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    //row count check
                    // expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(19);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(12);
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };

            actionBegin = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.isEdit).toBeTruthy();
                }
            };
            (gridObj.element.querySelector('#' + gridObj.element.id + 'OrderID') as any).value = 10247;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            // (gridObj.editModule as any).editModule.endEdit();
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('Delete action', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'delete') {
                    //row count check
                    // expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(19);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(11);
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
                    expect(gridObj.isEdit).toBeFalsy();
                    gridObj.dblClickHandler({ target: gridObj.getContent().querySelectorAll('.e-row')[0] });
                    setTimeout(()=>{
                        done();
                    },100);
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'delete') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check for last action
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            //added class check for last action
            expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(0);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_delete' } });
        });

        it('Ensure added row position', (done: Function) => {
            gridObj.editSettings.newRowPosition = "Bottom";
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    let editFormIndex: number = gridObj.element.querySelectorAll('.e-addedrow')[1].rowIndex;
                    let totalRowsCount: number = gridObj.element.querySelector('.e-movablecontent').querySelectorAll('.e-row').length;
                    expect((editFormIndex + 1)).toBe(totalRowsCount);
                    gridObj.closeEdit();
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });
        
        it('Edit start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(2);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(2);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(2);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(2);
                    let cells = gridObj.element.querySelector('.e-editedrow').querySelectorAll('.e-rowcell');
                    let mCells = gridObj.element.querySelectorAll('.e-editedrow')[1].querySelectorAll('.e-rowcell');
                    expect(cells.length + mCells.length).toBe(gridObj.getVisibleColumns().length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(1);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'CustomerID');
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
                    expect(gridObj.isEdit).toBeTruthy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            gridObj.clearSelection();
            gridObj.editModule.startEdit(gridObj.getContent().querySelector('.e-movablecontent').querySelector('tr'));
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('Inline editing render with Freeze => ', () => {
        let gridObj: any;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    allowFiltering: true,
                    frozenColumns: 2,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('Edit start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(2);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(2);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(2);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(2);
                    let cells = gridObj.element.querySelector('.e-editedrow').querySelectorAll('.e-rowcell');
                    let mCells = gridObj.element.querySelectorAll('.e-editedrow')[1].querySelectorAll('.e-rowcell');
                    expect(cells.length + mCells.length).toBe(gridObj.getVisibleColumns().length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(1);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'CustomerID');
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
                    expect(gridObj.isEdit).toBeTruthy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_edit' } });
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(0);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(0);

                    //updatated data cehck
                    expect((gridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    //row count check
                    expect(gridObj.getContent().querySelector('.e-frozencontent').querySelectorAll('.e-row').length).toBe(11);
                    //record count check
                    expect(gridObj.currentViewData.length).toBe(11);
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.isEdit).toBeTruthy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('Add start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(2);
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(2);
                    expect(gridObj.element.querySelectorAll('.e-gridform').length).toBe(2);
                    expect(gridObj.element.querySelectorAll('form').length).toBe(2);
                    let cells = gridObj.element.querySelector('.e-addedrow').querySelectorAll('.e-rowcell');
                    let mCells = gridObj.element.querySelectorAll('.e-addedrow')[1].querySelectorAll('.e-rowcell');
                    expect(cells.length + mCells.length).toBe(gridObj.getVisibleColumns().length);
                    //primary key check
                    expect(cells[0].querySelectorAll('input.e-disabled').length).toBe(0);
                    //focus check
                    expect(document.activeElement.id).toBe(gridObj.element.id + 'OrderID');
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
                    expect(gridObj.isEdit).toBeTruthy();
                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //toolbar status check for last action
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
            //edited class check for last action
            expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(0);
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('EJ2-6484 hierarchy testing => ', () => {
        let childData: Object[] = dataSource();
        let gridObj: Grid;
        let childGridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        let detailDataBound: () => void;
        let preventDefault: Function = new Function();

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData,
                    allowPaging: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                        { field: 'FirstName', headerText: 'First Name', textAlign: 'Left', width: 100 },
                    ],
                    detailDataBound: detailDataBound,
                    childGrid: {
                        dataSource: childData, queryString: 'EmployeeID',
                        allowPaging: false,
                        actionBegin: actionBegin,
                        actionComplete: actionComplete,
                        editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                        toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                        pageSettings: { pageCount: 5, pageSize: 5 },
                        columns: [
                            { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                            { field: 'CustomerID', type: 'string' },
                            { field: 'EmployeeID', type: 'number' },
                            { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                            { field: 'ShipCity' },
                            { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                            { field: 'ShipName', isIdentity: true },
                            { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                            { field: 'ShipRegion', type: 'string' },
                            { field: 'ShipAddress', allowFiltering: true, visible: false },
                            { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                        ],
                    }
                }, done);
        });

        it('Expand method testing', (done: Function) => {
            detailDataBound = (args?: any): void => {
                childGridObj = (gridObj.element.querySelector('.e-grid') as any).ej2_instances[0];
                done();
            };
            gridObj.detailDataBound = detailDataBound;
            gridObj.detailRowModule.expand(gridObj.getDataRows()[0].querySelector('.e-detailrowcollapse'));
        });

        it('Edit start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(childGridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    expect(childGridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    done();
                }
            };
            childGridObj.actionComplete = actionComplete;
            childGridObj.clearSelection();
            childGridObj.selectRow(0, true);
            childGridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: childGridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Edit complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((childGridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            childGridObj.actionComplete = actionComplete;
            (childGridObj.element.querySelector('#' + childGridObj.element.id + 'CustomerID') as any).value = 'updated';
            childGridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: childGridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Add start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(childGridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    expect(childGridObj.element.querySelectorAll('.e-gridform').length).toBe(1);
                    done();
                }
            };
            childGridObj.actionComplete = actionComplete;
            childGridObj.clearSelection();
            childGridObj.selectRow(0, true);
            childGridObj.keyboardModule.keyAction({ action: 'insert', preventDefault: preventDefault, target: childGridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Add complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((childGridObj.currentViewData[0] as any).OrderID).toBe(10247);
                    expect((childGridObj.currentViewData[0] as any).CustomerID).toBe('updated');
                    done();
                }
            };
            childGridObj.actionComplete = actionComplete;
            (childGridObj.element.querySelector('#' + childGridObj.element.id + 'OrderID') as any).value = 10247;
            (childGridObj.element.querySelector('#' + childGridObj.element.id + 'EmployeeID') as any).value = 1;
            (childGridObj.element.querySelector('#' + childGridObj.element.id + 'CustomerID') as any).value = 'updated';
            childGridObj.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: childGridObj.getContent().querySelector('.e-row') } as any);
        });


        it('Delete action', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'delete') {
                    //row count check
                    expect(childGridObj.getContent().querySelectorAll('.e-row').length).toBe(1);
                    //record count check
                    expect(childGridObj.currentViewData.length).toBe(1);
                    done();
                }
            };
            childGridObj.actionComplete = actionComplete;
            childGridObj.clearSelection();
            childGridObj.selectRow(0, true);
            childGridObj.keyboardModule.keyAction({ action: 'delete', preventDefault: preventDefault, target: childGridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Edit-cancel start', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'beginEdit') {
                    expect(childGridObj.element.querySelectorAll('.e-editedrow').length).toBe(1);
                    done();
                }
            };
            childGridObj.actionComplete = actionComplete;
            childGridObj.clearSelection();
            childGridObj.selectRow(0, true);
            childGridObj.keyboardModule.keyAction({ action: 'f2', preventDefault: preventDefault, target: childGridObj.getContent().querySelector('.e-row') } as any);
        });

        it('Edit-cancel complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'cancel') {
                    expect((childGridObj.currentViewData[0] as any).CustomerID).not.toBe('updatednew');
                    done();
                }
            };
            childGridObj.actionComplete = actionComplete;
            (childGridObj.element.querySelector('#' + childGridObj.element.id + 'CustomerID') as any).value = 'updatednew';
            childGridObj.keyboardModule.keyAction({ action: 'escape', preventDefault: preventDefault, target: childGridObj.getContent().querySelector('.e-row') } as any);
        });

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = childData = childGridObj = detailDataBound = actionComplete = null;
        });
    });

    describe('Editing with empty grid => ', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    allowPaging: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                        { field: 'FirstName', headerText: 'First Name', textAlign: 'Left', width: 100 },
                    ]
                }, done);
        });

        it('adding record', () => {
            (gridObj.editModule as any).editModule.addRecord();
            expect(gridObj.getContentTable().querySelector('.e-emptyrow')).toBe(null);
            expect(gridObj.getContentTable().querySelector('.e-hide')).toBe(null);
        });
        it('closing record', () => {
            (gridObj.editModule as any).editModule.closeEdit();
            expect(gridObj.getContentTable().querySelector('.e-emptyrow')).not.toBe(null);
            expect(gridObj.getContentTable().querySelector('.e-hide')).toBe(null);
        });


        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = null;
        });
    });


    describe('EJ2-7749 Disable edit, delete button when Grid is empty => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('Initial toolbar staus check', () => {
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(5);
        });


        it('Add start && EJ2-7012-script error on numeric text box click', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.element.querySelectorAll('.e-addedrow').length).toBe(1);
                    //toolbar status check
                    expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(4);
                    expect(gridObj.isEdit).toBeTruthy();
                    // double click script error while in edit state.
                    expect(gridObj.getRowInfo(<Element | EventTarget>gridObj.element).toString()).toBe({}.toString());

                    done();
                }
            };
            actionBegin = (args?: any): void => {
                if (args.requestType === 'add') {
                    expect(gridObj.isEdit).toBeFalsy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            //edited class check for last action
            expect(gridObj.element.querySelectorAll('.e-editedrow').length).toBe(0);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });

        it('Add complete', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.element.querySelectorAll('.e-normaledit').length).toBe(0);
                    expect(gridObj.isEdit).toBeFalsy();
                    done();
                }
            };

            actionBegin = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect(gridObj.isEdit).toBeTruthy();
                }
            };
            gridObj.actionComplete = actionComplete;
            gridObj.actionBegin = actionBegin;
            (gridObj.element.querySelector('#' + gridObj.element.id + 'CustomerID') as any).value = 'updated';
            (gridObj.element.querySelector('#' + gridObj.element.id + 'OrderID') as any).value = '23432';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });

        it('toolbar staus check after 1 record added', () => {
            expect(gridObj.element.querySelectorAll('.e-overlay').length).toBe(3);
        });
        it('memory leak', () => {     
            profile.sample();
            let average: any = inMB(profile.averageChange)
            //Check average change in memory samples to not be over 10MB
            expect(average).toBeLessThan(10);
            let memory: any = inMB(getMemoryProfile())
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });   

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });
    describe('EJ2-22823 Add and Delete operations current view check in virtualization => ', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource(),
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    enableVirtualization: true,
                    height: 300,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionComplete: actionComplete
                }, done);
        });

        it('Delete operation in current view check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType == 'delete') {
                    expect((gridObj.getCurrentViewRecords()[0] as any).OrderID).toBe(10249);
                    done();
                }
            }
            gridObj.actionComplete = actionComplete;
            gridObj.selectRow(0, true);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_delete' } });
        });

        it('Add operation in current view check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType == 'add') {
                    args.form.querySelector('td input').value = 10001;
                        gridObj.endEdit();
                        gridObj.actionComplete = (args: any) => {
                            if (args.requestType == 'save') {
                                expect((gridObj.getCurrentViewRecords()[0] as any).OrderID).toBe(10001);
                                done();
                            }
                        };
                }
            }
            gridObj.actionComplete = actionComplete;
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_add' } });
        });   

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('EJ2-24249 - reqType shown as paging instead of delete while deleting single last record in last page', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
    
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0,11),
                    allowPaging: true,
                    pageSettings: {pageSize: 5, currentPage: 3},
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                        { headerText: 'OrderDate', field: 'OrderDate', format: 'long', type: 'datetime' },
                    ],
                    actionComplete: actionComplete
                }, done);
        });
    
        it('Delete action- request type should be delete', (done: Function) => {
            actionComplete = (args?: any): void => {
                expect(args.requestType).toBe('delete');
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.selectRow(0);
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_delete' } });
        });
    
        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

});
