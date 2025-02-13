/**
 * Spreadsheet default sample
 */
import { Spreadsheet, SheetModel, ColumnModel } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { switchTheme } from '../../../common/switch-theme';
import { defaultData as dataSource } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';

enableRipple(true);

let wrapper: HTMLElement = document.getElementById('wrapper');

wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;

let columns: ColumnModel[] = [
    {
        width: 130
    },
    {
        width: 92
    },
    {
        width: 96
    }
];

let sheet: SheetModel[] = [{
    rangeSettings: [{
        dataSource: dataSource,
        startCell: 'A1'
    }],
    rowCount: 200,
    columns: columns
}];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
    beforeDataBound: (): void => {
        if (spreadsheet.sheets[spreadsheet.activeSheetTab - 1].name === 'Sheet1') {
            spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
        }
    },
    openUrl: 'https://ej2services.syncfusion.com/development/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/development/web-services/api/spreadsheet/save'
});

spreadsheet.appendTo('#spreadsheet');

window.addEventListener('resize', onResize);

function onResize(): void {
    wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;
    spreadsheet.resize();
}

switchTheme('#select-theme', spreadsheet);