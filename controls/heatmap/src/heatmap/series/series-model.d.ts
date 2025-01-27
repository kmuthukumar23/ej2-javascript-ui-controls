import { Property, ChildProperty, extend, merge, Complex, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';import { HeatMap } from '../heatmap';import { Rect, TextBasic, Path, PathAttributes, RectOption, CircleOption, TextOption, CurrentRect, DrawSvgCanvas } from '../utils/helper';import { convertHexToColor, colorNameToHex, formatValue } from '../utils/helper';import { CellColor, RgbColor } from '../utils/colorMapping';import { BorderModel, FontModel, BubbleSizeModel } from '../model/base-model';import { Border, Font, BubbleTooltipData, BubbleSize } from '../model/base';import { IThemeStyle, ICellEventArgs } from '../model/interface';import { Theme } from '../model/theme';import { CellType, BubbleType } from '../utils/enum';import { DataModel } from '../datasource/adaptor-model';import { Axis } from '../axis/axis';

/**
 * Interface for a class CellSettings
 */
export interface CellSettingsModel {

    /**
     * Toggles the visibility of data label over the heatmap cells.

     */

    showLabel?: boolean;

    /**
     * Specifies the formatting options for the data label. 

     */

    format?: string;

    /**
     * Enable or disable the cell highlighting on mouse hover

     */
    enableCellHighlighting?: Boolean;

    /**
     * Specifies the minimum and maximum radius value of the cell in percentage.

     */
    bubbleSize?: BubbleSizeModel;

    /**
     * Specifies the cell border style. 

     */
    border?: BorderModel;

    /**
     * Specifies the cell label style. 

     */
    textStyle?: FontModel;

    /**
     * Defines cell Type. They are
     * * Rect: Render a HeatMap cells in rectangle shape.
     * * Bubble: Render a HeatMap cells in bubble shape.

     */
    tileType?: CellType;

    /**
     * Defines Bubble Type. They are
     * * Size: Define the bubble type is size.
     * * Color: Define the bubble type is color.
     * * Sector: Define the bubble type is sector.
     * * SizeAndColor: Define the bubble type is sizeandcolor.

     */
    bubbleType?: BubbleType;

    /**
     * Enable or disable the bubble to display in inverse

     */
    isInversedBubbleSize?: boolean;

}

/**
 * Interface for a class Series
 */
export interface SeriesModel {

}