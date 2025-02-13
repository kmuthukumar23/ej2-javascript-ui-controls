import { ChildProperty, Property, Complex, Collection } from '@syncfusion/ej2-base';
import { DataManager, Query} from '@syncfusion/ej2-data';
import { MarkerSettings, Trendline } from '../../chart/series/chart-series';
import { MarkerSettingsModel, TrendlineModel } from '../../chart/series/chart-series-model';
import { StockChart } from '../stock-chart';
import { ChartSeriesType, EmptyPointMode, TechnicalIndicators, MacdType, FinancialDataFields } from '../../chart/utils/enum';
import { Anchor, ZIndex, SizeType, LabelIntersectAction, LabelPlacement, AxisPosition, IntervalType } from '../../chart/utils/enum';
import { SkeletonType, ChartRangePadding, EdgeLabelPlacement, ValueType, LegendShape, TrendlineTypes } from '../../chart/utils/enum';
import { MajorGridLinesModel, MajorTickLinesModel, CrosshairTooltipModel, AxisLineModel } from '../../chart/axis/axis-model';
import { MinorGridLinesModel, MinorTickLinesModel } from '../../chart/axis/axis-model';
import { MajorGridLines, MajorTickLines, MinorTickLines, MinorGridLines, CrosshairTooltip, AxisLine } from '../../chart/axis/axis';
import { ConnectorType } from '../../accumulation-chart/model/enum';
import { CornerRadius } from '../../common/model/base';
import { TextOverflow, Alignment, Regions, Units, Position, FlagType } from '../../common/utils/enum';
import { Theme } from '../../common/model/theme';
import { AnimationModel, CornerRadiusModel, EmptyPointSettingsModel, ConnectorModel } from '../../index';
import {  StockChartBorderModel, StockChartConnectorModel, StockChartStripLineSettingsModel, StockSeriesModel } from './base-model';
import { StockChartFontModel } from './base-model';

export class StockChartFont extends ChildProperty<StockChartFont> {

    /**
     * Color for the text.

     */
    @Property('')
    public color: string;

    /**
     * Font size for the text.

     */
    @Property('16px')
    public size: string;

    /**
     * FontFamily for the text.
     */
    @Property('Segoe UI')
    public fontFamily: string;

    /**
     * FontStyle for the text.

     */
    @Property('Normal')
    public fontStyle: string;

    /**
     * FontWeight for the text.

     */
    @Property('Normal')
    public fontWeight: string;

    /**
     * Opacity for the text.

     */
    @Property(1)
    public opacity: number;

    /**
     * Specifies the chart title text overflow

     */
    @Property('Trim')
    public textOverflow: TextOverflow;

    /**
     * text alignment

     */
    @Property('Center')
    public textAlignment: Alignment;



}

/**
 * Border
 */
export class StockChartBorder extends ChildProperty<StockChartBorder> {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.

     */
    @Property('')
    public color: string;

    /**
     * The width of the border in pixels.

     */
    @Property(1)
    public width: number;
}

/**
 * Configures the chart area.
 */
export class StockChartArea extends ChildProperty<StockChartArea> {

    /**
     * Options to customize the border of the chart area.
     */
    @Complex<StockChartBorderModel>({}, StockChartBorder)
    public border: StockChartBorderModel;

    /**
     * The background of the chart area that accepts value in hex and rgba as a valid CSS color string..

     */
    @Property('transparent')
    public background: string;

    /**
     * The opacity for background.

     */
    @Property(1)
    public opacity: number;

}

/**
 * Configures the chart margins.
 */
export class StockMargin extends ChildProperty<StockMargin> {

    /**
     * Left margin in pixels.

     */
    @Property(10)
    public left: number;

    /**
     * Right margin in pixels.

     */
    @Property(10)
    public right: number;

    /**
     * Top margin in pixels.

     */
    @Property(10)
    public top: number;

    /**
     * Bottom margin in pixels.

     */
    @Property(10)
    public bottom: number;
}


/**
 * StockChart strip line settings
 */
export class StockChartStripLineSettings extends ChildProperty<StockChartStripLineSettings> {

    /**
     *  If set true, strip line get render from axis origin.

     */
    @Property(false)
    public startFromAxis: boolean;

    /**
     * If set true, strip line for axis renders.

     */
    @Property(true)
    public visible: boolean;

    /**
     * Start value of the strip line.


     */
    @Property(null)
    public start: number | Date;

    /**
     * Color of the strip line.

     */
    @Property('#808080')
    public color: string;

    /**
     * End value of the strip line.


     */
    @Property(null)
    public end: number | Date;

    /**
     * Size of the strip line, when it starts from the origin.


     */
    @Property(null)
    public size: number;

    /**
     * Size type of the strip line

     */
    @Property('Auto')
    public sizeType: SizeType;

    /**
     * Dash Array of the strip line.


     */
    @Property(null)
    public dashArray: string;

    /**
     * isRepeat value of the strip line.


     */
    @Property(false)
    public isRepeat: boolean;

    /**
     * repeatEvery value of the strip line.


     */
    @Property(null)
    public repeatEvery: number | Date;

    /**
     * isSegmented value of the strip line


     */
    @Property(false)
    public isSegmented: boolean;

    /**
     * repeatUntil value of the strip line.


     */
    @Property(null)
    public repeatUntil: number | Date;

    /**
     * segmentStart value of the strip line.


     */
    @Property(null)
    public segmentStart: number | Date;

    /**
     * segmentAxisName of the strip line.


     */
    @Property(null)
    public segmentAxisName: string;

    /**
     * segmentEnd value of the strip line.


     */
    @Property(null)
    public segmentEnd: number | Date;

    /**
     * Strip line Opacity

     */
    @Property(1)
    public opacity: number;

    /**
     * Strip line text.

     */
    @Property('')
    public text: string;

    /**
     * Border of the strip line.
     */
    @Complex<StockChartBorderModel>({ color: 'transparent', width: 1 }, StockChartBorder)
    public border: StockChartBorderModel;

    /**
     * The angle to which the strip line text gets rotated.


     */
    @Property(null)
    public rotation: number;

    /**
     * Specifies the order of the strip line. They are,
     * * Behind: Places the strip line behind the series elements.
     * * Over: Places the strip line over the series elements.

     */
    @Property('Behind')
    public zIndex: ZIndex;

    /**
     * Defines the position of the strip line text horizontally. They are,
     * * Start: Places the strip line text at the start.
     * * Middle: Places the strip line text in the middle.
     * * End: Places the strip line text at the end.

     */
    @Property('Middle')
    public horizontalAlignment: Anchor;

    /**
     * Defines the position of the strip line text vertically. They are,
     * * Start: Places the strip line text at the start.
     * * Middle: Places the strip line text in the middle.
     * * End: Places the strip line text at the end.

     */
    @Property('Middle')
    public verticalAlignment: Anchor;

    /**
     * Options to customize the strip line text.
     */
    @Complex<StockChartFontModel>(Theme.stripLineLabelFont, StockChartFont)
    public textStyle: StockChartFontModel;


}

class Animation extends ChildProperty<Animation> {

    /**
     * The option to delay animation of the series.

     */

    @Property(0)
    public delay: number;

    /**
     * If set to true, series gets animated on initial loading.

     */

    @Property(false)
    public enable: boolean;

    /**
     * The duration of animation in milliseconds.

     */

    @Property(1000)
    public duration: number;
}

export class StockEmptyPointSettings extends ChildProperty<StockEmptyPointSettings> {

    /**
     * To customize the fill color of empty points.

     */
    @Property(null)
    public fill: string;

    /**
     * To customize the mode of empty points.

     */
    @Property('Gap')
    public mode: EmptyPointMode;

    /**
     * Options to customize the border of empty points.

     */
    @Complex<StockChartBorderModel>({color: 'transparent', width: 0}, StockChartBorder)
    public border: StockChartBorderModel;


}

export class StockChartConnector extends ChildProperty<StockChartConnector> {
    /**
     * specifies the type of the connector line. They are
     * * Smooth
     * * Line

     */
    @Property('Line')
    public type: ConnectorType;

    /**
     * Length of the connector line in pixels.

     */
    @Property(null)
    public length: string;

    /**
     * Color of the connector line.

     */
    @Property(null)
    public color: string;

    /**
     * dashArray of the connector line.

     */
    @Property('')
    public dashArray: string;

    /**
     * Width of the connector line in pixels.

     */
    @Property(1)
    public width: number;

}

/**
 * Configures the Annotation for chart.
 */
export class StockSeries extends ChildProperty<StockSeries> {
    /**
     * The DataSource field that contains the x value.
     * It is applicable for series and technical indicators

     */

    @Property('date')
    public xName: string;

    /**
     * The DataSource field that contains the y value.

     */

    @Property('close')
    public yName: string;

    /**
     * The DataSource field that contains the open value of y
     * It is applicable for series and technical indicators

     */

    @Property('open')
    public open: string;

    /**
     * The DataSource field that contains the close value of y
     * It is applicable for series and technical indicators

     */

    @Property('close')
    public close: string;

    /**
     * The DataSource field that contains the high value of y
     * It is applicable for series and technical indicators

     */

    @Property('high')
    public high: string;

    /**
     * The DataSource field that contains the low value of y
     * It is applicable for series and technical indicators

     */

    @Property('low')
    public low: string;

    /**
     * Defines the data source field that contains the volume value in candle charts
     * It is applicable for financial series and technical indicators

     */

    @Property('volume')
    public volume: string;

    /**
     * The DataSource field that contains the color value of point
     * It is applicable for series

     */

    @Property('')
    public pointColorMapping: string;

    /**
     * Options to customizing animation for the series.
     */

    @Complex<AnimationModel>(null, Animation)
    public animation: AnimationModel;

    /**
     * The name of the horizontal axis associated with the series. It requires `axes` of the chart.
     * It is applicable for series and technical indicators

     */

    @Property(null)
    public xAxisName: string;

    /**
     * The name of the vertical axis associated with the series. It requires `axes` of the chart.
     * It is applicable for series and technical indicators

     */

    @Property(null)
    public yAxisName: string;

    /**
     * The fill color for the series that accepts value in hex and rgba as a valid CSS color string.
     * It also represents the color of the signal lines in technical indicators.
     * For technical indicators, the default value is 'blue' and for series, it has null.

     */

    @Property(null)
    public fill: string;

    /**
     * Defines the pattern of dashes and gaps to stroke the lines in `Line` type series.

     */

    @Property('0')
    public dashArray: string;

    /**
     * The stroke width for the series that is applicable only for `Line` type series.
     * It also represents the stroke width of the signal lines in technical indicators.

     */

    @Property(1)
    public width: number;

    /**
     * The name of the series visible in legend.

     */

    @Property('')
    public name: string;

    /**
     * Specifies the DataSource for the series. It can be an array of JSON objects or an instance of DataManager.

     */

    @Property('')
    public dataSource: Object | DataManager;

    /**
     * Specifies query to select data from DataSource. This property is applicable only when the DataSource is `ej.DataManager`.

     */
    @Property()
    public query: Query;

    /**
     * This property is used in financial charts to visualize the price movements in stock.
     * It defines the color of the candle/point, when the opening price is higher than the closing price.

     */

    @Property('#e74c3d')
    public bullFillColor: string;

    /**
     * This property is used in stock charts to visualize the price movements in stock.
     * It defines the color of the candle/point, when the opening price is less than the closing price.

     */

    @Property('#2ecd71')
    public bearFillColor: string;

    /**
     * This property is applicable for candle series.
     * It enables/disables to visually compare the current values with the previous values in stock.

     */
    @Property(false)
    public enableSolidCandles: boolean;

    /**
     * Specifies the visibility of series.

     */

    @Property(true)
    public visible: boolean;

    /**
     * Options to customizing the border of the series. This is applicable only for `Column` and `Bar` type series.
     */

    @Complex<StockChartBorderModel>({ color: 'transparent', width: 0 }, StockChartBorder)
    public border: StockChartBorderModel;

    /**
     * The opacity of the series.

     */
    @Property(1)
    public opacity: number;

    /**
     * The type of the series are
     * * Line
     * * Column
     * * Area
     * * Spline
     * * Hilo
     * * HiloOpenClose
     * * Candle

     */

    @Property('Candle')
    public type: ChartSeriesType;

    /**
     * Options for displaying and customizing markers for individual points in a series.
     */
    @Complex<MarkerSettingsModel>(null, MarkerSettings)
    public marker: MarkerSettingsModel;

    /**
     * Defines the collection of trendlines that are used to predict the trend
     */
    @Collection<TrendlineModel>([], Trendline)
    public trendlines: TrendlineModel[];

    /**
     * If set true, the Tooltip for series will be visible.

     */
    @Property(true)
    public enableTooltip: boolean;

    /**
     * The provided value will be considered as a Tooltip name 

     */
    @Property('')
    public tooltipMappingName: string;

    /**
     * Custom style for the selected series or points.

     */
    @Property(null)
    public selectionStyle: string;

    /**
     * It defines tension of cardinal spline types

     */
    @Property(0.5)
    public cardinalSplineTension: number;

    /**
     * To render the column series points with particular rounded corner.
     */
    @Complex<CornerRadiusModel>(null, CornerRadius)
    public cornerRadius: CornerRadiusModel;

    /**
     * options to customize the empty points in series
     */
    @Complex<EmptyPointSettingsModel>(null, StockEmptyPointSettings)
    public emptyPointSettings: EmptyPointSettingsModel;

    /**
     * To render the column series points with particular column width. If the series type is histogram the
     * default value is 1 otherwise 0.7.


     */
    @Property(null)
    public columnWidth: number;

    /**
     * To render the column series points with particular column spacing. It takes value from 0 - 1.

     */
    @Property(0)
    public columnSpacing: number;
    /** @private */
    public localData: Object = undefined;
}

export interface IStockChartEventArgs {
    /** name of the event */
    name: string;
    /** stock chart */
    stockChart: StockChart;
}

/**
 * Interface for changed events
 */
export interface IRangeChangeEventArgs {
    /** name of the event */
    name: string;
    /** Defines the start value */
    start: number | Date;
    /** Defines the end value */
    end: number | Date;
    /** Defines the data source */
    data: Object[];
    /** Defines the selected data */
    selectedData: Object[];
    /** Defined the zoomPosition of the Stock chart */
    zoomPosition: number;
    /** Defined the zoomFactor of the stock chart */
    zoomFactor: number;
}

/** Stock event render event */
export interface IStockEventRenderArgs {
    /** stockChart */
    stockChart: StockChart;
    /** Event text  */
    text: string;
    /** Event shape */
    type: FlagType;
     /** Defines the name of the event */
     name: string;
     /** Defines the event cancel status */
     cancel: boolean;
     /** Defines the stock series */
     series: StockSeriesModel;
}


export class StockChartIndicator extends ChildProperty<StockChartIndicator> {
    /**
     * Defines the type of the technical indicator

     */
    @Property('Sma')
    public type: TechnicalIndicators;

    /**
     * Defines the period, the price changes over which will be considered to predict the trend

     */
    @Property(14)
    public period: number;

    /**
     * Defines the period, the price changes over which will define the %D value in stochastic indicators

     */
    @Property(3)
    public dPeriod: number;

    /**
     * Defines the look back period, the price changes over which will define the %K value in stochastic indicators

     */
    @Property(14)
    public kPeriod: number;

    /**
     * Defines the over-bought(threshold) values. It is applicable for RSI and stochastic indicators

     */
    @Property(80)
    public overBought: number;

    /**
     * Defines the over-sold(threshold) values. It is applicable for RSI and stochastic indicators

     */
    @Property(20)
    public overSold: number;

    /**
     * Defines the field to compare the current value with previous values

     */
    @Property('Close')
    public field: FinancialDataFields;

    /**
     * Sets the standard deviation values that helps to define the upper and lower bollinger bands

     */
    @Property(2)
    public standardDeviation: number;

    /**
     * Sets the slow period to define the Macd line

     */
    @Property(12)
    public slowPeriod: number;

    /**
     * Enables/Disables the over-bought and over-sold regions

     */
    @Property(true)
    public showZones: boolean;

    /**
     * Sets the fast period to define the Macd line

     */
    @Property(26)
    public fastPeriod: number;


    /**
     * Defines the appearance of the the MacdLine of Macd indicator

     */
    @Complex<StockChartConnectorModel>({ color: '#ff9933', width: 2 }, StockChartConnector)
    public macdLine: StockChartConnectorModel;

    /**
     * Defines the type of the Macd indicator.

     */
    @Property('Both')
    public macdType: MacdType;

    /**
     * Defines the color of the negative bars in Macd indicators

     */
    @Property('#e74c3d')
    public macdNegativeColor: string;

    /**
     * Defines the color of the positive bars in Macd indicators

     */
    @Property('#2ecd71')
    public macdPositiveColor: string;


    /**
     * Options for customizing the BollingerBand in the indicator.

     */

    @Property('rgba(211,211,211,0.25)')
    public bandColor: string;

    /**
     * Defines the appearance of the upper line in technical indicators
     */
    @Complex<StockChartConnectorModel>({ color: '#ffb735', width: 1 }, StockChartConnector)
    public upperLine: StockChartConnectorModel;

    /**
     * Defines the name of the series, the data of which has to be depicted as indicator

     */
    @Property('')
    public seriesName: string;

    /**
     * Defines the appearance of period line in technical indicators
     */

    @Complex<StockChartConnectorModel>({ color: '#f2ec2f', width: 1 }, StockChartConnector)
    public periodLine: StockChartConnectorModel;

    /**
     * Defines the appearance of lower line in technical indicators
     */

    @Complex<ConnectorModel>({ color: '#f2ec2f', width: 1 }, StockChartConnector)
    public lowerLine: ConnectorModel;


    /**
     * The DataSource field that contains the high value of y
     * It is applicable for series and technical indicators

     */

    @Property('')
    public high: string;

    /**
     * The DataSource field that contains the open value of y
     * It is applicable for series and technical indicators

     */

    @Property('')
    public open: string;

    /**
     * The DataSource field that contains the low value of y
     * It is applicable for series and technical indicators

     */

    @Property('')
    public low: string;

    /**
     * The DataSource field that contains the x value.
     * It is applicable for series and technical indicators

     */

    @Property('')
    public xName: string;

    /**
     * The DataSource field that contains the close value of y
     * It is applicable for series and technical indicators

     */

    @Property('')
    public close: string;

    /**
     * The DataSource field that contains the color value of point
     * It is applicable for series

     */

    @Property('')
    public pointColorMapping: string;

    /**
     * Defines the data source field that contains the volume value in candle charts
     * It is applicable for financial series and technical indicators

     */

    @Property('')
    public volume: string;



    /**
     * The name of the horizontal axis associated with the series. It requires `axes` of the chart.
     * It is applicable for series and technical indicators
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *     columns: [{ width: '50%' },
     *               { width: '50%' }],
     *     axes: [{
     *                name: 'xAxis 1',
     *                columnIndex: 1,
     *            }],
     *     series: [{
     *                dataSource: data,
     *                xName: 'x', yName: 'y',
     *                xAxisName: 'xAxis 1',
     *     }],
     * });
     * chart.appendTo('#Chart');
     * ```

     */

    @Property(null)
    public xAxisName: string;

    /**
     * The name of the vertical axis associated with the series. It requires `axes` of the chart.
     * It is applicable for series and technical indicators
     * ```html
     * <div id='Chart'></div>
     * ```

     */

    @Property(null)
    public yAxisName: string;

    /**
     * Options to customizing animation for the series.
     */

    @Complex<AnimationModel>(null, Animation)
    public animation: AnimationModel;

    /**
     * The fill color for the series that accepts value in hex and rgba as a valid CSS color string.
     * It also represents the color of the signal lines in technical indicators.
     * For technical indicators, the default value is 'blue' and for series, it has null.

     */

    @Property(null)
    public fill: string;

    /**
     * Defines the pattern of dashes and gaps to stroke the lines in `Line` type series.

     */

    @Property('0')
    public dashArray: string;

    /**
     * The stroke width for the series that is applicable only for `Line` type series.
     * It also represents the stroke width of the signal lines in technical indicators.

     */

    @Property(1)
    public width: number;


    /**
     * Specifies query to select data from DataSource. This property is applicable only when the DataSource is `ej.DataManager`.

     */
    @Property()
    public query: Query;

    /**
     * Specifies the DataSource for the series. It can be an array of JSON objects or an instance of DataManager.
     * ```html
     * <div id='Chart'></div>
     * ```

     */

    @Property('')
    public dataSource: Object | DataManager;


}

export class StockChartAxis extends ChildProperty<StockChartAxis> {

    /**
     * Options to customize the crosshair ToolTip.
     */

    @Complex<CrosshairTooltipModel>({}, CrosshairTooltip)
    public crosshairTooltip: CrosshairTooltipModel;

    /**
     * Options to customize the axis label.
     */

    @Complex<StockChartFontModel>(Theme.axisLabelFont, StockChartFont)
    public labelStyle: StockChartFontModel;

    /**
     * Specifies the title of an axis.

     */

    @Property('')
    public title: string;

    /**
     * Options for customizing the axis title.
     */

    @Complex<StockChartFontModel>(Theme.axisTitleFont, StockChartFont)
    public titleStyle: StockChartFontModel;

    /**
     * Used to format the axis label that accepts any global string format like 'C', 'n1', 'P' etc.
     * It also accepts placeholder like '{value}°C' in which value represent the axis label, e.g, 20°C.

     */

    @Property('')
    public labelFormat: string;

    /**
     * It specifies the type of format to be used in dateTime format process.

     */

    @Property('DateTime')
    public skeletonType: SkeletonType;

    /**
     * Specifies the skeleton format in which the dateTime format will process.

     */

    @Property('')
    public skeleton: string;


    /**
     * Left and right padding for the plot area in pixels.

     */

    @Property(0)
    public plotOffset: number;

    /**
     * The base value for logarithmic axis. It requires `valueType` to be `Logarithmic`.

     */
    @Property(10)
    public logBase: number;


    /**
     * Specifies the index of the row where the axis is associated, when the chart area is divided into multiple plot areas by using `rows`.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *     rows: [{ height: '50%' },
     *            { height: '50%' }],
     *     axes: [{
     *                name: 'yAxis 1',
     *                rowIndex: 1,
     *      }],
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```

     */

    @Property(0)
    public rowIndex: number;


    /**
     * Specifies the number of `columns` or `rows` an axis has to span horizontally or vertically.

     */

    @Property(1)
    public span: number;

    /**
     * The maximum number of label count per 100 pixels with respect to the axis length.

     */

    @Property(3)
    public maximumLabels: number;

    /**
     * With this property, you can request axis to calculate intervals approximately equal to your specified interval.


     */

    @Property(null)
    public desiredIntervals: number;

    /**
     * The axis is scaled by this factor. When zoomFactor is 0.5, the chart is scaled by 200% along this axis. Value ranges from 0 to 1.

     */

    @Property(1)
    public zoomFactor: number;

    /**
     * Position of the zoomed axis. Value ranges from 0 to 1.

     */

    @Property(0)
    public zoomPosition: number;

    /**
     * If set to true, the axis will render at the opposite side of its default position.

     */

    @Property(false)
    public opposedPosition: boolean;

    /**
     * If set to true, axis interval will be calculated automatically with respect to the zoomed range.

     */

    @Property(true)
    public enableAutoIntervalOnZooming: boolean;

    /**
     * Specifies the type of data the axis is handling.
     * * Double:  Renders a numeric axis.
     * * DateTime: Renders a dateTime axis.
     * * Category: Renders a category axis.
     * * Logarithmic: Renders a log axis.



     */

    @Property('Double')
    public valueType: ValueType;

    /**
     * Specifies the padding for the axis range in terms of interval.They are,
     * * none: Padding cannot be applied to the axis.
     * * normal: Padding is applied to the axis based on the range calculation.
     * * additional: Interval of the axis is added as padding to the minimum and maximum values of the range.
     * * round: Axis range is rounded to the nearest possible value divided by the interval.

     */

    @Property('Auto')
    public rangePadding: ChartRangePadding;


    /**
     * Specifies the position of labels at the edge of the axis.They are,
     * * None: No action will be performed.
     * * Hide: Edge label will be hidden.
     * * Shift: Shifts the edge labels.

     */

    @Property('None')
    public edgeLabelPlacement: EdgeLabelPlacement;

    /**
     * Specifies the placement of a label for category axis. They are,
     * * betweenTicks: Renders the label between the ticks.
     * * onTicks: Renders the label on the ticks.

     */

    @Property('BetweenTicks')
    public labelPlacement: LabelPlacement;

    /**
     * Specifies the types like `Years`, `Months`, `Days`, `Hours`, `Minutes`, `Seconds` in date time axis.They are,
     * * Auto: Defines the interval of the axis based on data.
     * * Years: Defines the interval of the axis in years.
     * * Months: Defines the interval of the axis in months.
     * * Days: Defines the interval of the axis in days.
     * * Hours: Defines the interval of the axis in hours.
     * * Minutes: Defines the interval of the axis in minutes.

     */

    @Property('Auto')
    public intervalType: IntervalType;


    /**
     * Specifies the placement of a ticks to the axis line. They are,
     * * inside: Renders the ticks inside to the axis line.
     * * outside: Renders the ticks outside to the axis line.

     */

    @Property('Outside')
    public tickPosition: AxisPosition;

    /**
     * Unique identifier of an axis.
     * To associate an axis with the series, set this name to the xAxisName/yAxisName properties of the series.

     */

    @Property('')
    public name: string;

    /**
     * Specifies the placement of a labels to the axis line. They are,
     * * inside: Renders the labels inside to the axis line.
     * * outside: Renders the labels outside to the axis line.

     */

    @Property('Outside')
    public labelPosition: AxisPosition;


    /**
     * If set to true, axis label will be visible.

     */

    @Property(true)
    public visible: boolean;

    /**
     * The angle to which the axis label gets rotated.

     */

    @Property(0)
    public labelRotation: number;

    /**
     * Specifies the number of minor ticks per interval.

     */

    @Property(0)
    public minorTicksPerInterval: number;


    /**
     * Specifies the value at which the axis line has to be intersect with the vertical axis or vice versa.

     */

    @Property(null)
    public crossesAt: Object;

    /**
     * Specifies axis name with which the axis line has to be crossed

     */

    @Property(null)
    public crossesInAxis: string;

    /**
     * Specifies whether axis elements like axis labels, axis title, etc has to be crossed with axis line

     */

    @Property(true)
    public placeNextToAxisLine: boolean;


    /**
     * Specifies the minimum range of an axis.

     */

    @Property(null)
    public minimum: Object;

    /**
     * Specifies the interval for an axis.


     */

    @Property(null)
    public interval: number;

    /**
     * Specifies the maximum range of an axis.

     */

    @Property(null)
    public maximum: Object;


    /**
     * Specifies the maximum width of an axis label.

     */
    @Property(34)
    public maximumLabelWidth: number;

    /**
     * Options for customizing major tick lines.
     */

    @Complex<MajorTickLinesModel>({}, MajorTickLines)
    public majorTickLines: MajorTickLinesModel;

    /**
     * Specifies the Trim property for an axis.

     */
    @Property(false)
    public enableTrim: boolean;

    /**
     * Options for customizing minor tick lines.
     */

    @Complex<MinorTickLinesModel>({}, MinorTickLines)
    public minorTickLines: MinorTickLinesModel;

    /**
     * Options for customizing minor grid lines.
     */

    @Complex<MinorGridLinesModel>({}, MinorGridLines)
    public minorGridLines: MinorGridLinesModel;

    /**
     * Options for customizing major grid lines.
     */

    @Complex<MajorGridLinesModel>({}, MajorGridLines)
    public majorGridLines: MajorGridLinesModel;



    /**
     * Options for customizing axis lines.
     */

    @Complex<AxisLineModel>({}, AxisLine)
    public lineStyle: AxisLineModel;

    /**
     * It specifies whether the axis to be rendered in inversed manner or not.

     */
    @Property(false)
    public isInversed: boolean;

    /**
     * Specifies the actions like `Hide`, `Rotate45`, and `Rotate90` when the axis labels intersect with each other.They are,
     * * None: Shows all the labels.
     * * Hide: Hides the label when it intersects.
     * * Rotate45: Rotates the label to 45 degree when it intersects.
     * * Rotate90: Rotates the label to 90 degree when it intersects.

     */

    @Property('Trim')
    public labelIntersectAction: LabelIntersectAction;


    /**
     * The polar radar radius position.

     */

    @Property(100)
    public coefficient: number;

    /**
     * The start angle for the series.

     */

    @Property(0)
    public startAngle: number;

    /**
     * TabIndex value for the axis.

     */
    @Property(2)
    public tabIndex: number;

    /**
     * Specifies the stripLine collection for the axis
     */
    @Collection<StockChartStripLineSettingsModel>([], StockChartStripLineSettings)
    public stripLines: StockChartStripLineSettingsModel[];

    /**
     * Description for axis and its element.

     */
    @Property(null)
    public description: string;


}

/**
 * StockChart row
 */
export class StockChartRow extends ChildProperty<StockChartRow> {

    /**
     * The height of the row as a string accept input both as '100px' and '100%'.
     * If specified as '100%, row renders to the full height of its chart.

     */

    @Property('100%')
    public height: string;

    /**
     * Options to customize the border of the rows.
     */

    @Complex<StockChartBorderModel>({}, StockChartBorder)
    public border: StockChartBorderModel;

}

export class StockChartTrendline extends ChildProperty<StockChartTrendline> {

    /**
     * Defines the period, the price changes over which will be considered to predict moving average trend line

     */
    @Property(2)
    public period: number;

    /**
     * Defines the name of trendline

     */
    @Property('')
    public name: string;

    /**
     * Defines the type of the trendline

     */
    @Property('Linear')
    public type: TrendlineTypes;

    /**
     * Defines the polynomial order of the polynomial trendline

     */
    @Property(2)
    public polynomialOrder: number;

    /**
     * Defines the period, by which the trend has to forward forecast

     */
    @Property(0)
    public forwardForecast: number;

    /**
     * Defines the period, by which the trend has to backward forecast

     */
    @Property(0)
    public backwardForecast: number;

    /**
     * Options to customize the animation for trendlines
     */
    @Complex<AnimationModel>({}, Animation)
    public animation: AnimationModel;

    /**
     * Enables/disables tooltip for trendlines

     */
    @Property(true)
    public enableTooltip: boolean;

    /**
     * Options to customize the marker for trendlines
     */
    @Complex<MarkerSettingsModel>({}, MarkerSettings)
    public marker: MarkerSettingsModel;




    /**
     * Defines the intercept of the trendline


     */
    @Property(null)
    public intercept: number;

    /**
     * Defines the fill color of trendline

     */
    @Property('')
    public fill: string;

    /**
     * Sets the legend shape of the trendline

     */
    @Property('SeriesType')
    public legendShape: LegendShape;

    /**
     * Defines the width of the trendline

     */
    @Property(1)
    public width: number;



}

export class StockChartAnnotationSettings extends ChildProperty<StockChartAnnotationSettings> {

    /**
     * if set coordinateUnit as `Pixel` Y specifies the axis value
     * else is specifies pixel or percentage of coordinate

     */
    @Property('0')
    public y: string | number;
    /**
     * if set coordinateUnit as `Pixel` X specifies the axis value
     * else is specifies pixel or percentage of coordinate

     */
    @Property('0')
    public x: string | Date | number;


    /**
     * Content of the annotation, which accepts the id of the custom element.

     */
    @Property(null)
    public content: string;

    /**
     * Specifies the regions of the annotation. They are
     * * Chart - Annotation renders based on chart coordinates.
     * * Series - Annotation renders based on series coordinates.

     */

    @Property('Chart')
    public region: Regions;

    /**
     * Specifies the alignment of the annotation. They are
     * * Near - Align the annotation element as left side.
     * * Far - Align the annotation element as right side.
     * * Center - Align the annotation element as mid point.

     */

    @Property('Center')
    public horizontalAlignment: Alignment;

    /**
     * Specifies the coordinate units of the annotation. They are
     * * Pixel - Annotation renders based on x and y pixel value.
     * * Point - Annotation renders based on x and y axis value.

     */

    @Property('Pixel')
    public coordinateUnits: Units;

    /**
     * Specifies the position of the annotation. They are
     * * Top - Align the annotation element as top side.
     * * Bottom - Align the annotation element as bottom side.
     * * Middle - Align the annotation element as mid point.

     */

    @Property('Middle')
    public verticalAlignment: Position;

    /**
     * The name of vertical axis associated with the annotation.
     * It requires `axes` of chart.

     */

    @Property(null)
    public yAxisName: string;

    /**
     * Information about annotation for assistive technology.

     */
    @Property(null)
    public description: string;

    /**
     * The name of horizontal axis associated with the annotation.
     * It requires `axes` of chart.

     */

    @Property(null)
    public xAxisName: string;


}

export class StockChartIndexes extends ChildProperty<StockChartIndexes> {

    /**
     * Specifies index of point


     */
    @Property(0)
    public point: number;

    /**
     * Specifies index of series


     */
    @Property(0)
    public series: number;

}

/**
 * Configures the Stock events for stock chart.
 */
export class StockEventsSettings extends ChildProperty<StockEventsSettings> {
    /**
     * Specifies type of stock events
     * * Circle 
     * * Square
     * * Flag
     * * Text
     * * Sign
     * * Triangle
     * * InvertedTriangle
     * * ArrowUp
     * * ArrowDown
     * * ArrowLeft
     * * ArrowRight

     */
    @Property('Circle')
    public type: FlagType;

    /**
     * Specifies the text for the stock chart text.
     */
    @Property('')
    public text: string;

    /**
     * Specifies the description for the chart which renders in tooltip for stock event.
     */
    @Property('')
    public description: string;

    /**
     * Date value of stock event in which stock event shows.
     */
    @Property()
    public date: Date;

    /**
     * Options to customize the border of the stock events.
     */
    @Complex<StockChartBorderModel>({color: 'black', width: 1}, StockChartBorder)
    public border: StockChartBorderModel;

    /**
     * The background of the stock event that accepts value in hex and rgba as a valid CSS color string.

     */
    @Property('transparent')
    public background: string;

    /**
     * Enables the stock events to be render on series. If it disabled, stock event rendered on primaryXAxis.

     */
    @Property(true)
    public showOnSeries: boolean;

    /**
     * Corresponding values in which stock event placed.
     * * Close
     * * Open
     * * High
     * * Close

     */
    @Property('close')
    public placeAt: string;

    /**
     * Options to customize the styles for stock events text.
     */
    @Complex<StockChartFontModel>(Theme.stockEventFont, StockChartFont)
    public textStyle: StockChartFontModel;
}
