import { Property, Complex, ChildProperty} from '@syncfusion/ej2-base';
import { measureText, Rect, TextOption, Size, PathOption, CanvasRenderer } from '@syncfusion/ej2-svg-base';
import { Chart, ILegendRegions } from '../../chart';
import { LegendSettingsModel, LocationModel } from './legend-model';
import { Font, Border, Margin } from '../model/base';
import { Theme } from '../model/theme';
import { MarginModel, FontModel, BorderModel } from '../model/base-model';
import { subtractThickness, Thickness, drawSymbol, ChartLocation } from '../utils/helper';
import { RectOption, textElement, stringToNumber } from '../utils/helper';
import { removeElement, showTooltip, getElement, appendChildElement } from '../utils/helper';
import { LegendPosition, LegendShape, ChartSeriesType, ChartShape } from '../../chart/utils/enum';
import { Legend } from '../../chart/legend/legend';
import { AccumulationType } from '../../accumulation-chart/model/enum';
import { AccumulationChart } from '../../accumulation-chart/accumulation';
import { AccumulationLegend } from '../../accumulation-chart/renderer/legend';
import { Alignment } from '../utils/enum';
/**
 * Configures the location for the legend.
 */
export class Location extends ChildProperty<Location>  {
    /**
     * X coordinate of the legend in pixels.

     */
    @Property(0)
    public x: number;

    /**
     * Y coordinate of the legend in pixels.

     */
    @Property(0)
    public y: number;
}

/**
 * Configures the legends in charts.
 */
export class LegendSettings extends ChildProperty<LegendSettings> {

    /**
     * If set to true, legend will be visible.

     */
    @Property(true)
    public visible: boolean;

    /**
     * The height of the legend in pixels.

     */
    @Property(null)
    public height: string;

    /**
     * The width of the legend in pixels.

     */
    @Property(null)
    public width: string;

    /**
     * Specifies the location of the legend, relative to the chart.
     * If x is 20, legend moves by 20 pixels to the right of the chart. It requires the `position` to be `Custom`.
     * ```html
     * <div id='Chart'></div>
     * ```
     * ```typescript
     * let chart: Chart = new Chart({
     * ...
     *   legendSettings: {
     *     visible: true,
     *     position: 'Custom',
     *     location: { x: 100, y: 150 },
     *   },
     * ...
     * });
     * chart.appendTo('#Chart');
     * ```
     */
    @Complex<LocationModel>({ x: 0, y: 0 }, Location)
    public location: LocationModel;

    /**
     * Position of the legend in the chart are,
     * * Auto: Places the legend based on area type.
     * * Top: Displays the legend at the top of the chart.
     * * Left: Displays the legend at the left of the chart.
     * * Bottom: Displays the legend at the bottom of the chart.
     * * Right: Displays the legend at the right of the chart.
     * * Custom: Displays the legend  based on the given x and y values.

     */
    @Property('Auto')
    public position: LegendPosition;

    /**
     * Option to customize the padding between legend items.

     */
    @Property(8)
    public padding: number;

    /**
     * Legend in chart can be aligned as follows:
     * * Near: Aligns the legend to the left of the chart.
     * * Center: Aligns the legend to the center of the chart.
     * * Far: Aligns the legend to the right of the chart.

     */
    @Property('Center')
    public alignment: Alignment;

    /**
     * Options to customize the legend text.
     */
    @Complex<FontModel>(Theme.legendLabelFont, Font)
    public textStyle: FontModel;

    /**
     * Shape height of the legend in pixels.

     */
    @Property(10)
    public shapeHeight: number;

    /**
     * Shape width of the legend in pixels.

     */
    @Property(10)
    public shapeWidth: number;

    /**
     * Options to customize the border of the legend.
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;

    /**
     *  Options to customize left, right, top and bottom margins of the chart.
     */

    @Complex<MarginModel>({left: 0, right: 0, top: 0, bottom: 0}, Margin)
    public margin: MarginModel;

    /**
     * Padding between the legend shape and text.

     */
    @Property(5)
    public shapePadding: number;

    /**
     * The background color of the legend that accepts value in hex and rgba as a valid CSS color string.

     */
    @Property('transparent')
    public background: string;

    /**
     * Opacity of the legend.

     */
    @Property(1)
    public opacity: number;

    /**
     * If set to true, series' visibility collapses based on the legend visibility.

     */
    @Property(true)
    public toggleVisibility: boolean;

    /**
     * Description for legends.

     */
    @Property(null)
    public description: string;

    /**
     * TabIndex value for the legend.

     */
    @Property(3)
    public tabIndex: number;
}
/**
 * Legend base class for Chart and Accumulation chart.
 * @private
 */
export class BaseLegend {

    // Internal variables
    protected chart: Chart | AccumulationChart;
    protected legend: LegendSettingsModel;
    protected maxItemHeight: number;
    protected isPaging: boolean;
    private clipPathHeight: number;
    public totalPages: number;
    protected isVertical: boolean;
    private rowCount: number = 0; // legend row counts per page
    private columnCount: number = 0; // legend column counts per page
    private pageButtonSize: number = 8;
    protected pageXCollections: number[] = []; // pages of x locations
    protected maxColumns: number = 0;
    private isTrimmed: boolean = false;
    public maxWidth: number = 0;
    protected legendID: string;
    private clipRect: Element;
    private legendTranslateGroup: Element;
    protected currentPage: number = 1;
    private isChartControl: boolean;
    protected library: Legend | AccumulationLegend;
    /**  @private */
    public position: LegendPosition;
    /**
     * Gets the legend bounds in chart.
     * @private
     */
    public legendBounds: Rect;
    /** @private */
    public legendCollections: LegendOptions[];
    /** @private */
    public clearTooltip: number;
    //this variable stores the legend clipRect co-oridinates and used to render clipRect in canvas mode.
    protected pagingClipRect: RectOption;
    protected currentPageNumber: number = 1;
    protected legendRegions: ILegendRegions[] = [];
    protected pagingRegions: Rect[] = [];
    protected totalNoOfPages: number;
    /** @private */
    public calTotalPage: boolean;

    /**
     * Constructor for the dateTime module.
     * @private
     */
    constructor(chart?: Chart | AccumulationChart) {
        this.chart = chart;
        this.legend = chart.legendSettings;
        this.legendID = chart.element.id + '_chart_legend';
        this.isChartControl = (chart.getModuleName () === 'chart');
    }
    /**
     * Calculate the bounds for the legends.
     * @return {void}
     * @private
     */
    public calculateLegendBounds(rect: Rect, availableSize: Size): void {
        let legend: LegendSettingsModel = this.legend;
        this.getPosition(legend.position, availableSize);
        this.legendBounds = new Rect(rect.x, rect.y, 0, 0);
        this.isVertical = (this.position === 'Left' || this.position === 'Right');
        if (this.isVertical) {
            this.legendBounds.height = stringToNumber(
                legend.height, availableSize.height - (rect.y - this.chart.margin.top)) || rect.height;
            this.legendBounds.width = stringToNumber(legend.width || '20%', availableSize.width);
        } else {
            this.legendBounds.width = stringToNumber(legend.width, availableSize.width) || rect.width;
            this.legendBounds.height = stringToNumber(legend.height || '20%', availableSize.height);
        }
        this.library.getLegendBounds(availableSize, this.legendBounds, legend);
        this.getLocation(this.position, legend.alignment, this.legendBounds, rect, availableSize);
    }
    /**
     * To find legend position based on available size for chart and accumulation chart
     */
    private getPosition(position: LegendPosition, availableSize: Size): void {
        if (this.isChartControl) {
            this.position = (position !== 'Auto') ? position : 'Bottom';
        } else {
            if (position === 'Auto' && this.chart.visibleSeries &&
            (this.chart.visibleSeries[0].type === 'Funnel' || this.chart.visibleSeries[0].type === 'Pyramid')) {
                position = 'Top';
            }
            this.position = (position !== 'Auto') ? position :
            (availableSize.width > availableSize.height ? 'Right' : 'Bottom');
        }
    }
    /**
     * To set bounds for chart and accumulation chart
     */
    protected setBounds(computedWidth: number, computedHeight: number, legend: LegendSettingsModel, legendBounds: Rect): void {
        computedWidth = computedWidth < legendBounds.width ? computedWidth : legendBounds.width;
        computedHeight = computedHeight < legendBounds.height ? computedHeight : legendBounds.height;
        legendBounds.width = !legend.width ? computedWidth : legendBounds.width;
        legendBounds.height = !legend.height ? computedHeight : legendBounds.height;
        this.rowCount = Math.max(1, Math.ceil((legendBounds.height - legend.padding) / (this.maxItemHeight + legend.padding)));
    }
    /**
     * To find legend location based on position, alignment for chart and accumulation chart
     */
    private getLocation(position: LegendPosition, alignment: Alignment, legendBounds: Rect, rect: Rect, availableSize: Size): void {
        let padding: number = this.legend.border.width ;
        let legendHeight: number = legendBounds.height + padding + this.legend.margin.top + this.legend.margin.bottom ;
        let legendWidth: number = legendBounds.width + padding + this.legend.margin.left + this.legend.margin.right ;
        let marginBottom: number = this.chart.margin.bottom;
        if (position === 'Bottom') {
            legendBounds.x = this.alignLegend(legendBounds.x, availableSize.width, legendBounds.width, alignment);
            legendBounds.y = rect.y + (rect.height - legendHeight) + padding + this.legend.margin.top;
            subtractThickness(rect, new Thickness(0, 0, 0, legendHeight));
        } else if (position === 'Top') {
            legendBounds.x = this.alignLegend(legendBounds.x, availableSize.width, legendBounds.width, alignment);
            legendBounds.y = rect.y + padding + this.legend.margin.top;
            subtractThickness(rect, new Thickness(0, 0, legendHeight, 0));
        } else if (position === 'Right') {
            legendBounds.x = rect.x + (rect.width - legendBounds.width) - this.legend.margin.right;
            legendBounds.y = rect.y + this.alignLegend(0, availableSize.height - (rect.y + marginBottom),
                                                       legendBounds.height, alignment);
            subtractThickness(rect, new Thickness(0, legendWidth, 0, 0));
        } else if (position === 'Left') {
            legendBounds.x = legendBounds.x + this.legend.margin.left;
            legendBounds.y = rect.y + this.alignLegend(0, availableSize.height - (rect.y + marginBottom),
                                                       legendBounds.height, alignment);
            subtractThickness(rect, new Thickness(legendWidth, 0, 0, 0));
        } else {
            legendBounds.x = this.legend.location.x;
            legendBounds.y = this.legend.location.y;
            subtractThickness(rect, new Thickness(0, 0, 0, 0));
        }
    }
    /**
     * To find legend alignment for chart and accumulation chart
     */
    private alignLegend(start: number, size: number, legendSize: number, alignment: Alignment): number {
        switch (alignment) {
            case 'Far':
                start = (size - legendSize) - start;
                break;
            case 'Center':
                start = ((size - legendSize) / 2);
                break;
        }
        return start;
    }

    /**
     * Renders the legend.
     * @return {void}
     * @private
     */
    public renderLegend(
        chart: Chart | AccumulationChart, legend: LegendSettingsModel, legendBounds: Rect, redraw?: boolean
    ): void {
        let firstLegend: number = this.findFirstLegendPosition(this.legendCollections);
        let padding: number = legend.padding;
        this.legendRegions = [];
        this.maxItemHeight = Math.max(this.legendCollections[0].textSize.height, legend.shapeHeight);
        let legendGroup: Element = chart.renderer.createGroup({ id: this.legendID + '_g' });
        let legendTranslateGroup: Element = this.createLegendElements(chart, legendBounds, legendGroup, legend, this.legendID, redraw);
        if (firstLegend !== this.legendCollections.length) {
            let legendSeriesGroup: Element; // legendItem group for each series group element
            let start: ChartLocation; // starting shape center x,y position && to resolve lint error used new line for declaration
            start = new ChartLocation(legendBounds.x + padding + (legend.shapeWidth / 2),
                                      legendBounds.y + padding + this.maxItemHeight / 2);
            let textOptions: TextOption = new TextOption('', start.x, start.y, 'start');
            //  initialization for totalPages legend click totalpage again calculate
            this.totalPages = this.isChartControl ? this.totalPages : 0;
            let textPadding: number = legend.shapePadding + padding + legend.shapeWidth;
            let count: number = 0;
            this.pageXCollections = [];
            this.legendCollections[firstLegend].location = start;
            let previousLegend: LegendOptions = this.legendCollections[firstLegend];
            for (let legendOption of this.legendCollections) {
                if (this.chart.getModuleName() === 'accumulationchart') {
                    legendOption.fill = this.chart.visibleSeries[0].points[legendOption.pointIndex].color;
                }
                if (legendOption.render && legendOption.text !== '') {
                    legendSeriesGroup = chart.renderer.createGroup({
                        id: this.legendID + this.generateId(legendOption, '_g_', count)});
                    if  (legendSeriesGroup) {
                        legendSeriesGroup.setAttribute('tabindex', legend.tabIndex.toString());
                        legendSeriesGroup.setAttribute('aria-label', legend.description ||
                                    'Click to show or hide the ' + legendOption.text + ' series');
                    }
                    this.library.getRenderPoint(legendOption, start, textPadding, previousLegend, legendBounds, count, firstLegend);

                    this.renderSymbol(legendOption, legendSeriesGroup, count);

                    this.renderText(chart, legendOption, legendSeriesGroup, textOptions, count);

                    if (legendSeriesGroup) {
                        legendSeriesGroup.setAttribute(
                            'style', 'cursor: ' + ((!legend.toggleVisibility && chart.selectionMode === 'None') ? 'auto' : 'pointer'));
                    }

                    if (legendTranslateGroup) {
                        legendTranslateGroup.appendChild(legendSeriesGroup);
                    }
                    previousLegend = legendOption;
                }
                count++;
            }
            if (this.isPaging) {
                this.renderPagingElements(chart, legendBounds, textOptions, legendGroup);
            } else {
                this.totalPages = 1;
            }
        }
        appendChildElement((chart as Chart).enableCanvas, chart.svgObject, legendGroup, redraw);
    }
    /**
     * To find first valid legend text index for chart and accumulation chart
     */
    private findFirstLegendPosition(legendCollection: LegendOptions[]): number {
        let count: number = 0;
        for ( let legend of legendCollection) {
            if (legend.render && legend.text !== '') {
                break;
            }
            count++;
        }
        return count;
    }
    /**
     * To create legend rendering elements for chart and accumulation chart
     */
    private createLegendElements(chart: Chart | AccumulationChart, legendBounds: Rect, legendGroup: Element, legend: LegendSettingsModel,
                                 id: string, redraw?: boolean): Element {
        let padding: number = legend.padding;
        let options: RectOption = new RectOption(id + '_element', legend.background, legend.border, legend.opacity, legendBounds);
        legendGroup ? legendGroup.appendChild(chart.renderer.drawRectangle(options)) : chart.renderer.drawRectangle(options);
        let legendItemsGroup: Element = chart.renderer.createGroup({ id: id + '_collections' });
        let isCanvas: boolean = (chart as Chart).enableCanvas;
        if (!isCanvas) {
        legendGroup.appendChild(legendItemsGroup);
        }
        this.legendTranslateGroup = chart.renderer.createGroup({ id: id + '_translate_g' });
        if (!isCanvas) {
        legendItemsGroup.appendChild(this.legendTranslateGroup);
        }
        let clippath: Element = chart.renderer.createClipPath({ id: id + '_clipPath' });
        options.y += padding;
        options.id += '_clipPath_rect';
        options.width = (!this.isChartControl && this.isVertical) ? this.maxWidth - padding : legendBounds.width;

        if (!isCanvas) {
            this.clipRect = chart.renderer.drawRectangle(options);
            clippath.appendChild(this.clipRect);
        } else {
            this.pagingClipRect = options;
        }
        appendChildElement(isCanvas, chart.svgObject, clippath, redraw);
        if (!isCanvas) {
        legendItemsGroup.setAttribute('style', 'clip-path:url(#' + clippath.id + ')');
        }
        return this.legendTranslateGroup;
    }
    /**
     * To render legend symbols for chart and accumulation chart
     */
    protected renderSymbol(legendOption: LegendOptions, group: Element, i: number): void {
        let symbolColor: string = legendOption.visible ? legendOption.fill : '#D3D3D3';
        let shape: string = (legendOption.shape === 'SeriesType') ? legendOption.type : legendOption.shape;
        shape = shape === 'Scatter' ? legendOption.markerShape : shape;
        let isStrokeWidth: boolean = (this.chart.getModuleName() === 'chart' && (legendOption.shape === 'SeriesType') &&
        (legendOption.type.toLowerCase().indexOf('line') > -1) && (legendOption.type.toLowerCase().indexOf('area') === -1));
        let strokewidth: number  =  isStrokeWidth ? (this.chart as Chart).visibleSeries[i].width : 1;
        let symbolOption: PathOption = new PathOption(
            this.legendID + this.generateId(legendOption, '_shape_', i), symbolColor, strokewidth, symbolColor, 1, '', '');
        let regionPadding: number;
        let isCanvas: boolean = (this.chart as Chart).enableCanvas;
        if (!isCanvas) {
        group.appendChild(drawSymbol(legendOption.location, shape, new Size(this.legend.shapeWidth, this.legend.shapeHeight), '',
                                     symbolOption, 'Click to show or hide the ' + legendOption.text + ' series', this.chart.renderer));
        } else {
            regionPadding = -this.translatePage(null, this.currentPageNumber - 1, this.currentPageNumber);
            drawSymbol(legendOption.location, shape, new Size(this.legend.shapeWidth, this.legend.shapeHeight), '',
                       symbolOption, 'Click to show or hide the ' + legendOption.text + ' series', this.chart.renderer,
                       this.currentPageNumber ? new Rect(0, regionPadding, 0, 0) : null);
            this.legendRegions.push({rect: new Rect(legendOption.location.x, legendOption.location.y,
                                                    this.legend.shapeWidth, this.legend.shapeHeight + regionPadding), index: i});
        }
        if (shape === 'Line' && legendOption.markerVisibility && legendOption.markerShape !== 'Image' ||
        legendOption.type === <AccumulationType>'Doughnut') {
            symbolOption.id = this.legendID + this.generateId(legendOption, '_shape_marker_', i);
            shape = legendOption.type === <AccumulationType>'Doughnut' ? 'Circle' : legendOption.markerShape;
            symbolOption.fill = legendOption.type === <AccumulationType>'Doughnut' ? '#FFFFFF' : symbolOption.fill;
            if (!isCanvas) {
            group.appendChild(drawSymbol(legendOption.location, shape, new Size(this.legend.shapeWidth / 2, this.legend.shapeHeight / 2),
                                         '', symbolOption, 'Click to show or hide the ' + legendOption.text + ' series'));
            } else {
                drawSymbol(legendOption.location, shape, new Size(this.legend.shapeWidth / 2, this.legend.shapeHeight / 2),
                           '', symbolOption, 'Click to show or hide the ' + legendOption.text + ' series', this.chart.renderer,
                           this.currentPageNumber ?
                            new Rect(0, -this.translatePage(null, this.currentPageNumber - 1, this.currentPageNumber ), 0, 0) : null);

            }
        }
    }
    /**
     * To render legend text for chart and accumulation chart
     */
    protected renderText(chart: Chart | AccumulationChart, legendOption: LegendOptions, group: Element, textOptions: TextOption,
                         i: number): void {
        let legend: LegendSettingsModel = chart.legendSettings;
        let hiddenColor: string = '#D3D3D3';
        textOptions.id = this.legendID + this.generateId(legendOption, '_text_', i);
        let fontcolor: string = legendOption.visible ? legend.textStyle.color || chart.themeStyle.legendLabel : hiddenColor;
        textOptions.text = legendOption.text;
        textOptions.x = legendOption.location.x + (legend.shapeWidth / 2) + legend.shapePadding;
        textOptions.y = legendOption.location.y + this.maxItemHeight / 4;
        let isCanvas: boolean = (this.chart as Chart).enableCanvas;
        let element : Element =
        textElement(chart.renderer, textOptions, legend.textStyle, fontcolor, group, false, false, false, false,
                    null, this.currentPageNumber &&  isCanvas ?
                    new Rect(0, -this.translatePage(null, this.currentPageNumber - 1, this.currentPageNumber ), 0, 0) : null);
        if (element) {
            element.setAttribute('aria-label', legend.description || 'Click to show or hide the ' + legendOption.text + ' series');
        }
        if (isCanvas) {
            let textSize: Size = measureText(textOptions.text, legend.textStyle);
            this.legendRegions[i].rect.y = textOptions.y < this.legendRegions[i].rect.y ? textOptions.y : this.legendRegions[i].rect.y;
            this.legendRegions[i].rect.width += textSize.width;
            this.legendRegions[i].rect.height = textSize.height;
            this.legendRegions[i].rect.y -= textSize.height * 0.5;
        }
    }
    /**
     * To render legend paging elements for chart and accumulation chart
     */
    private renderPagingElements(chart: Chart | AccumulationChart, bounds: Rect, textOption: TextOption, legendGroup: Element): void {
        let paginggroup: Element = chart.renderer.createGroup({ id: this.legendID + '_navigation' });
        this.pagingRegions = [];
        let isCanvas: boolean = (chart as Chart).enableCanvas;
        if (!isCanvas) {
        legendGroup.appendChild(paginggroup);
        }
        let grayColor: string = '#545454';
        let legend: LegendSettingsModel = chart.legendSettings; // to solve parameter lint error, legend declaration is here
        let padding: number = 8; // const padding for paging elements
        if (this.isChartControl || !this.isVertical) {
            this.totalPages = Math.ceil(this.totalPages / Math.max(1, this.rowCount - 1));
        } else {
            this.totalPages = Math.ceil(this.totalPages / this.maxColumns);
        }
        let symbolOption: PathOption = new PathOption(this.legendID + '_pageup', 'transparent', 5, grayColor, 1, '', '');
        let iconSize: number = this.pageButtonSize;
        if (paginggroup) {
            paginggroup.setAttribute('style', 'cursor: pointer');
        }
        // Page left arrow drawing calculation started here
        this.clipPathHeight = (this.rowCount - 1) * (this.maxItemHeight + legend.padding);
        if (!isCanvas) {
        this.clipRect.setAttribute('height', this.clipPathHeight.toString());
        } else {
            //paging clipRect only for canvas mode
            this.pagingClipRect.height = this.legendBounds.height - this.clipPathHeight -
                                        (this.pagingClipRect.y - this.legendBounds.y) - legend.border.width;
            this.pagingClipRect.y = this.pagingClipRect.y + this.clipPathHeight;
            this.pagingClipRect.x += legend.border.width;
            this.pagingClipRect.width -= (legend.border.width + legend.border.width / 2);
            (this.chart.renderer as CanvasRenderer).clearRect(new Rect(this.pagingClipRect.x, this.pagingClipRect.y,
                                                                       this.pagingClipRect.width, this.pagingClipRect.height));
        }
        let x: number = bounds.x + iconSize / 2;
        let y: number = bounds.y + this.clipPathHeight + ((bounds.height - this.clipPathHeight) / 2);
        let size: Size = measureText(this.totalPages + '/' + this.totalPages, legend.textStyle);
        if (!isCanvas) {
        paginggroup.appendChild(drawSymbol({ x: x, y: y }, 'LeftArrow', new Size(iconSize, iconSize), '', symbolOption, 'LeftArrow'));
        } else {
            drawSymbol({ x: x, y: y }, 'LeftArrow', new Size(iconSize, iconSize), '', symbolOption, 'LeftArrow', this.chart.renderer,
                       new Rect(bounds.width - (2 * (iconSize + padding) + padding + size.width), 0, 0, 0));

        }
        this.pagingRegions.push(new Rect(x + bounds.width - (2 * (iconSize + padding) + padding + size.width) - iconSize * 0.5,
                                         y - iconSize * 0.5, iconSize, iconSize));
        // Page numbering rendering calculation started here
        textOption.x = x + (iconSize / 2) + padding;
        textOption.y = y + (size.height / 4);
        textOption.id = this.legendID + '_pagenumber';
        textOption.text = '1/' + this.totalPages;
        if (isCanvas && this.totalNoOfPages) {
            textOption.text = this.currentPageNumber  + '/' + this.totalNoOfPages;
        }
        let pageTextElement: Element = textElement(chart.renderer, textOption, legend.textStyle, legend.textStyle.color, paginggroup,
                                                   false, false, false, false, null,
                                                   new Rect(bounds.width - (2 * (iconSize + padding) + padding + size.width), 0, 0, 0));
        // Page right arrow rendering calculation started here
        x = (textOption.x + padding + (iconSize / 2) + size.width);
        symbolOption.id = this.legendID + '_pagedown';
        if (!isCanvas) {
        paginggroup.appendChild(drawSymbol({ x: x, y: y }, 'RightArrow', new Size(iconSize, iconSize), '', symbolOption,
                                           'RightArrow'));
        } else {
            drawSymbol({ x: x, y: y }, 'RightArrow', new Size(iconSize, iconSize), '', symbolOption,
                       'RightArrow', this.chart.renderer,
                       new Rect(bounds.width - (2 * (iconSize + padding) + padding + size.width), 0, 0, 0));
        }
        this.pagingRegions.push(new Rect(x + (bounds.width - (2 * (iconSize + padding) + padding + size.width) - iconSize * 0.5),
                                         y - iconSize * 0.5, iconSize, iconSize));
        if (!isCanvas) {
        //placing the navigation buttons and page numbering in legend right corner
        paginggroup.setAttribute('transform', 'translate(' + (bounds.width - (2 * (iconSize + padding) +
        padding + size.width)) + ', ' + 0 + ')');
        } else {
            if (this.currentPageNumber === 1 && this.calTotalPage) {
                this.totalNoOfPages = this.totalPages;
                this.calTotalPage = false;
            }
        }
        this.translatePage(pageTextElement, this.currentPage - 1, this.currentPage);
    }
    /**
     * To translate legend pages for chart and accumulation chart
     */
    protected translatePage(pagingText: Element, page: number, pageNumber: number): number {
        let size: number = (this.clipPathHeight) * page;
        let translate: string = 'translate(0,-' + size + ')';
        if (!this.isChartControl && this.isVertical) {
            let pageLength: number = page * this.maxColumns;
            size = this.pageXCollections[page * this.maxColumns] - this.legendBounds.x;
            size = size < 0 ? 0 : size; // to avoid small pixel variation
            translate = 'translate(-' + size + ',0)';
        }
        if (!(this.chart as Chart).enableCanvas) {
        this.legendTranslateGroup.setAttribute('transform', translate);
        }
        if (!(this.chart as Chart).enableCanvas) {
            pagingText.textContent = (pageNumber) + '/' + this.totalPages;
        }
        this.currentPage = pageNumber;
        return size;
    }
    /**
     * To change legend pages for chart and accumulation chart
     */
    protected changePage(event: Event, pageUp: boolean): void {
        let pageText: Element = document.getElementById(this.legendID + '_pagenumber');
        let page: number = parseInt(pageText.textContent.split('/')[0], 10);
        if (pageUp && page > 1) {
            this.translatePage(pageText, (page - 2), (page - 1));
        } else if (!pageUp && page < this.totalPages) {
            this.translatePage(pageText, page, (page + 1));
        }
    }
    /**
     * To find legend elements id based on chart or accumulation chart
     * @private
     */
    public generateId(option: LegendOptions, prefix: string, count: number, ): string {
        if (this.isChartControl) {
           return prefix + count;
        } else {
           return prefix + option.pointIndex;
        }
    }

    /**
     * To show or hide trimmed text tooltip for legend.
     * @return {void}
     * @private
     */
    public move(event: Event): void {
        let x: number = this.chart.mouseX;
        let y: number = this.chart.mouseY;
        if ((<HTMLElement>event.target).textContent.indexOf('...') > -1) {
            let targetId: string[] = (<HTMLElement>event.target).id.split(this.legendID + '_text_');
            if (targetId.length === 2) {
                let index: number = parseInt(targetId[1], 10);
                let element: HTMLElement = this.chart.element;
                if (!isNaN(index)) {
                    if (this.chart.isTouch) {
                        removeElement(this.chart.element.id + '_EJ2_Legend_Tooltip');
                    }
                    if (this.isChartControl) {
                        showTooltip(
                            (<Chart>this.chart).series[index].name, x, y, element.offsetWidth, element.id + '_EJ2_Legend_Tooltip',
                            getElement(this.chart.element.id + '_Secondary_Element')
                        );
                    } else {
                        showTooltip(
                            (<AccumulationChart>this.chart).visibleSeries[0].points[index].x.toString(), x + 10, y + 10,
                            element.offsetWidth, element.id + '_EJ2_Legend_Tooltip',
                            getElement(this.chart.element.id + '_Secondary_Element')
                        );
                    }
                }
            }
        } else {
            removeElement(this.chart.element.id + '_EJ2_Legend_Tooltip');
        }
        if (this.chart.isTouch) {
            clearTimeout(this.clearTooltip);
            this.clearTooltip = setTimeout(() => { removeElement(this.chart.element.id + '_EJ2_Legend_Tooltip'); }, 1000);
        }
    }
}
/**
 * Class for legend options
 * @private
 */
export class LegendOptions {
    public render: boolean;
    public text: string;
    public fill: string;
    public shape: LegendShape;
    public visible: boolean;
    public type: ChartSeriesType | AccumulationType;
    public textSize: Size;
    public location: ChartLocation = { x: 0, y: 0 };
    public pointIndex?: number;
    public seriesIndex?: number;
    public markerShape?: ChartShape;
    public markerVisibility?: boolean;
    constructor(
        text: string, fill: string, shape: LegendShape, visible: boolean, type: ChartSeriesType | AccumulationType,
        markerShape?: ChartShape, markerVisibility?: boolean, pointIndex?: number, seriesIndex?: number
        ) {
        this.text =  text;
        this.fill = fill;
        this.shape = shape;
        this.visible =  visible;
        this.type = type;
        this.markerVisibility = markerVisibility;
        this.markerShape = markerShape;
        this.pointIndex = pointIndex;
        this.seriesIndex = seriesIndex;
    }
}