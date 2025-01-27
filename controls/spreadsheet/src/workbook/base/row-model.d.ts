import { Property, Collection, ChildProperty } from '@syncfusion/ej2-base';import { CellModel, SheetModel, RowModel } from './index';import { Cell } from './cell';

/**
 * Interface for a class Row
 */
export interface RowModel {

    /**
     * Specifies cell and its properties for the row.
     * @default []
     */
    cells?: CellModel[];

    /**
     * Specifies the index to the row. Based on the index, row properties are applied.
     * @default 0
     * @asptype int
     */
    index?: number;

    /**
     * Specifies height of the row.
     * @default 20
     * @asptype int
     */
    height?: number;

    /**
     * specifies custom height of the row.
     * @default false
     */
    customHeight?: boolean;

}