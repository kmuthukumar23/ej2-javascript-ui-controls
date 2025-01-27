/**
 * HeatMap Axis file
 */
import { Property, Complex, ChildProperty, DateFormatOptions, isNullOrUndefined, Collection } from '@syncfusion/ej2-base';
import { DataUtil } from '@syncfusion/ej2-data';
import { Orientation } from '../utils/enum';
import { FontModel, TitleModel, AxisLabelBorderModel, MultiLevelLabelsModel, MultiLevelCategoriesModel } from '../model/base-model';
import { Font, Title, AxisLabelBorder, MultiLevelLabels, MultiLevelCategories } from '../model/base';
import { Theme } from '../model/theme';
import { Rect, measureText, Size, rotateTextSize, increaseDateTimeInterval, formatValue } from '../utils/helper';
import { MultiLevelPosition, textWrap } from '../utils/helper';
import { ValueType, IntervalType, LabelIntersectAction, LabelType } from '../utils/enum';
import { HeatMap } from '../heatmap'
    ;
export class Axis extends ChildProperty<Axis> {

    /**
     * Title of heat map axis

     */
    @Complex<TitleModel>({ text: '', textStyle: Theme.axisTitleFont }, Title)
    public title: TitleModel;
    /**
     * If set to true, the axis will render at the opposite side of its default position.

     */

    @Property(false)
    public opposedPosition: boolean;


    /**
     * Options for label assignment.
     */
    @Property(null)
    public labels: string[];

    /**
     * Options for customizing the label text.
     */
    @Complex<FontModel>(Theme.axisLabelFont, Font)
    public textStyle: FontModel;

    /**
     * The angle to rotate the axis label

     */

    @Property(0)
    public labelRotation: number;

    /**
     * It specifies whether the axis to be rendered in inversed manner or not.

     */

    @Property(false)
    public isInversed: boolean;

    /**
     * Specifies the type of data the axis is handling.
     * * Numeric:  Renders a numeric axis.
     * * DateTime: Renders a dateTime axis.
     * * Category: Renders a category axis.




     */

    @Property('Category')
    public valueType: ValueType;

    /**
     * Specifies the increment for an axis label.

     */

    @Property(1)
    public increment: number;

    /**
     * Defines the axis label display type for date time axis.
     * * None: Axis labels displayed based on the value type.
     * * Years: Define the axis labels display in every year.
     * * Months: Define the axis labels display in every month.
     * * Days: Define the axis labels display in every day.
     * * Hours: Define the axis labels display in every hour. 

     */

    @Property('None')
    public showLabelOn: LabelType;

    /**
     * Specifies the minimum range of an axis.

     */

    @Property(null)
    public minimum: Object;

    /**
     * Specifies the maximum range of an axis.

     */

    @Property(null)
    public maximum: Object;

    /**
     * Specifies the interval for an axis.

     */

    @Property(null)
    public interval: number;

    /**
     * Used to format the axis label that accepts any global string format like 'C', 'n1', 'P' etc.
     * It also accepts placeholder like '{value}°C' in which value represent the axis label, e.g, 20°C.

     */

    @Property('')
    public labelFormat: string;

    /**
     * Specifies the types like `Years`, `Months`, `Days`, `Hours`, `Minutes` in date time axis.They are,
     * * Years: Defines the interval of the axis in years.
     * * Months: Defines the interval of the axis in months.
     * * Days: Defines the interval of the axis in days.
     * * Hours: Defines the interval of the axis in hours.
     * * Minutes: Defines the interval of the axis in minutes.

     */

    @Property('Days')
    public intervalType: IntervalType;

    /** 
     * Specifies the actions like `Rotate45`, `None` and `Trim` when the axis labels intersect with each other.They are,
     * * None: Shows all the labels.
     * * Rotate45: Rotates the label to 45 degree when it intersects.
     * * Trim : Trim the label when label text width exceed the label width

     */

    @Property('Trim')
    public labelIntersectAction: LabelIntersectAction;

    /**
     * Border of the axis labels.
     */
    @Complex<AxisLabelBorderModel>({ color: '#b5b5b5', width: 0, type: 'Rectangle' }, AxisLabelBorder)
    public border: AxisLabelBorderModel;

    /**
     * Specifies the multi level labels collection for the axis
     */
    @Collection<MultiLevelLabels>([], MultiLevelLabels)
    public multiLevelLabels: MultiLevelLabelsModel[];

    /** @private */
    public orientation: Orientation;

    /** @private */
    public rect: Rect = new Rect(undefined, undefined, 0, 0);

    /** @private */
    public nearSizes: number[] = [];
    /** @private */
    public farSizes: number[] = [];
    /** @private */
    public maxLabelSize: Size = new Size(0, 0);
    /** @private */
    public titleSize: Size = new Size(0, 0);

    /** @private */
    public axisLabels: string[] = [];
    /** @private */
    public tooltipLabels: string[] = [];
    /** @private */
    public labelValue: (string | number | Date)[] = [];
    /** @private */
    public axisLabelSize: number = 0;
    /** @private */
    public axisLabelInterval: number = 0;
    /** @private */
    public dateTimeAxisLabelInterval: number[] = [];
    /** @private */
    public maxLength: number = 0;
    /** @private */
    public min: number = 0;
    /** @private */
    public max: number = 0;
    /** @private */
    public format: Function;
    /** @private */
    public angle: number;
    /** @private */
    public isIntersect: boolean = false;
    /** @private */
    public jsonCellLabel: string[] = [];
    public multiLevelSize: Size[] = [];
    /** @private */
    public xAxisMultiLabelHeight: number[] = [];
    /** @private */
    public yAxisMultiLabelHeight: number[] = [];
    /** @private */
    public multiLevelPosition: MultiLevelPosition[] = [];
    /**
     * measure the axis title and label size
     * @param axis 
     * @param heatmap 
     * @private
     */
    public computeSize(axis: Axis, heatmap: HeatMap, rect: Rect): void {
        let size: Size = new Size(0, 0);
        let innerPadding: number = 10;
        this.titleSize = axis.getTitleSize(axis, innerPadding);
        this.maxLabelSize = axis.getMaxLabelSize(axis, heatmap);
        this.getMultilevelLabelsHeight(axis, rect, heatmap);
        for (let i: number = 0; i < this.multiLevelLabels.length; i++) {
            size = axis.multiLevelLabelSize(innerPadding, i);
            this.multiLevelSize.push(size);
        }
    }

    /**
     * calculating x, y position of multi level labels
     * @private
     */
    public multiPosition(axis: Axis, index: number): MultiLevelPosition {
        let innerPadding: number = axis.orientation === 'Horizontal' ? 10 : 20;
        let multiPosition: MultiLevelPosition = new MultiLevelPosition(0, 0);
        if (axis.orientation === 'Horizontal') {
            let level0: number = axis.maxLabelSize.height + innerPadding ;
            let level1: number = this.xAxisMultiLabelHeight[index - 1] ;
            multiPosition.x = (axis.isInversed ? axis.rect.x + axis.rect.width : axis.rect.x);
            multiPosition.y = index === 0 ? axis.rect.y + (axis.opposedPosition ? -level0 : level0) :
                axis.multiLevelPosition[index - 1].y + (axis.opposedPosition ? -level1 : level1 );
        } else {
            let level0: number =  axis.maxLabelSize.width + innerPadding;
            let level1: number = index !== 0 && (this.multiLevelSize[index - 1].width  );
            multiPosition.x = index === 0 ? axis.rect.x - (axis.opposedPosition ? -level0 : level0 ) :
            axis.multiLevelPosition[index - 1].x - (axis.opposedPosition ? - (level1 + innerPadding) : level1 + innerPadding);
            multiPosition.y =  axis.isInversed ? axis.rect.y : axis.rect.y + axis.rect.height;
        }
        return multiPosition;
    }

    private multiLevelLabelSize(innerPadding: number, index: number): Size {
        let labelSize: Size = new Size(0, 0);
        let multiLevel: MultiLevelLabelsModel[] = this.multiLevelLabels;
        let categoryLabel: MultiLevelCategoriesModel[] = multiLevel[index].categories;
        for (let i: number = 0; i < categoryLabel.length; i++) {
            let size: Size = measureText(categoryLabel[i].text, multiLevel[index].textStyle);
            labelSize.width = (labelSize.width > size.width) ? labelSize.width : size.width;
            labelSize.height = (labelSize.height > size.height) ? labelSize.height : size.height;
        }
        let size: number = (this.orientation === 'Horizontal') ? this.xAxisMultiLabelHeight[index] : this.yAxisMultiLabelHeight[index];
        if (this.opposedPosition) {
             this.farSizes.push(size );
        } else {
            this.nearSizes.push(size );
        }
        return labelSize;
    }

    private getMultilevelLabelsHeight(axis: Axis, rect: Rect, heatmap: HeatMap): void {
        let labelSize: Size; let gap: number;
        let height: number;
        let multiLevelLabelsHeight: number[] = [];
        let start: number | Date; let end: number | Date;
        let startPosition: number; let endPosition: number;
        let isVertical: boolean = axis.orientation === 'Vertical';
        let axisValue: number = (isVertical ? rect.height : rect.width) / axis.axisLabelSize;
        let padding: number = axis.orientation === 'Vertical' ? 20 : 10;
        this.multiLevelLabels.map((multiLevel: MultiLevelLabels, index: number) => {
            multiLevel.categories.map((categoryLabel: MultiLevelCategories) => {
                start = typeof categoryLabel.start === 'number' ? categoryLabel.start :  Number(new Date(<string>categoryLabel.start));
                end = typeof categoryLabel.end === 'number' ? categoryLabel.end : Number(new Date(<string>categoryLabel.end));
                if (categoryLabel.text !== '' && categoryLabel.start !== null && categoryLabel.end !== null) {
                    labelSize = measureText(categoryLabel.text, multiLevel.textStyle);
                    height = isVertical ? labelSize.width : labelSize.height;
                    startPosition =  heatmap.heatMapAxis.calculateLeftPosition(axis, start, categoryLabel.start, rect);
                    endPosition = heatmap.heatMapAxis.calculateWidth(axis, categoryLabel.end, end, rect);
                    labelSize = measureText(categoryLabel.text, multiLevel.textStyle);
                    gap = ((categoryLabel.maximumTextWidth === null) ? Math.abs(endPosition - startPosition) :
                     categoryLabel.maximumTextWidth);
                    if ((labelSize.width > gap - padding)  && (multiLevel.overflow === 'Wrap') && !isVertical) {
                        height = (height * (textWrap(categoryLabel.text, gap - padding, multiLevel.textStyle).length));
                    }
                    multiLevelLabelsHeight[index] = !multiLevelLabelsHeight[index] ? height + padding :
                        ((multiLevelLabelsHeight[index] < height) ? height + padding  : multiLevelLabelsHeight[index]);
                }
            });
        });
        if (isVertical) {
            this.yAxisMultiLabelHeight = multiLevelLabelsHeight;
        } else {
            this.xAxisMultiLabelHeight = multiLevelLabelsHeight;
        }
    }

    private getTitleSize(axis: Axis, innerPadding: number): Size {
        let titleSize: Size = new Size(0, 0);
        if (this.title.text) {
            titleSize = measureText(this.title.text, this.title.textStyle);
            titleSize.height += innerPadding;
        }
        if (axis.opposedPosition) {
            this.farSizes.push(titleSize.height);
        } else {
            this.nearSizes.push(titleSize.height);
        }
        return titleSize;
    }

    private getMaxLabelSize(axis: Axis, heatmap: HeatMap): Size {
        let labelSize: Size = new Size(0, 0);
        let labels: string[] = this.axisLabels;
        let padding: number = (axis.border.width > 0 || axis.multiLevelLabels.length > 0) ? 10 : 0;
        axis.angle = axis.labelRotation;
        axis.isIntersect = false;
        if (axis.orientation === 'Horizontal' && (axis.labelIntersectAction === 'Rotate45' ||
            (axis.labelRotation % 180 === 0 && axis.labelIntersectAction === 'Trim'))) {
            let interval: number = (axis.valueType === 'DateTime' && axis.showLabelOn !== 'None') ?
                heatmap.initialClipRect.width / axis.axisLabelSize : heatmap.initialClipRect.width / axis.axisLabels.length;
            let startX: number = heatmap.initialClipRect.x + ((!axis.isInversed) ? 0 : heatmap.initialClipRect.width);
            let previousEnd: number; let previousStart: number;
            for (let i: number = 0, len: number = labels.length; i < len; i++) {
                let label: string = labels[i];
                let elementSize: Size = measureText(label, axis.textStyle);
                let axisInterval: number = (axis.valueType === 'DateTime' && axis.showLabelOn !== 'None') ?
                    axis.dateTimeAxisLabelInterval[i] * interval : interval;
                let startPoint: number = startX + (!axis.isInversed ?
                    ((interval - elementSize.width) / 2) : -((interval + elementSize.width) / 2));
                startPoint = startPoint < heatmap.initialClipRect.x ? heatmap.initialClipRect.x : startPoint;
                let endPoint: number = startPoint + elementSize.width;
                if (!axis.isInversed) {
                    if (isNullOrUndefined(previousEnd)) {
                        previousEnd = endPoint;
                    } else if ((startPoint < previousEnd)) {
                        if (axis.labelIntersectAction === 'Rotate45') {
                            axis.angle = 45;
                        } else {
                            axis.isIntersect = true;
                        }
                        break;
                    }
                    previousEnd = endPoint;
                } else {
                    if (isNullOrUndefined(previousStart)) {
                        previousStart = startPoint;
                    } else if ((previousStart < endPoint)) {
                        if (axis.labelIntersectAction === 'Rotate45') {
                            axis.angle = 45;
                        } else {
                            axis.isIntersect = true;
                        }
                        break;
                    }
                    previousStart = startPoint;
                }
                startX += axis.isInversed ? -axisInterval : axisInterval;
            }
        }
        for (let i: number = 0; i < labels.length; i++) {
            let size: Size = (axis.angle % 180 === 0) ?
                measureText(labels[i], axis.textStyle) : rotateTextSize(axis.textStyle, labels[i], axis.angle);
            labelSize.width = (labelSize.width > size.width) ? labelSize.width : size.width;
            labelSize.height = (labelSize.height > size.height) ? labelSize.height : size.height;
        }
        if (axis.opposedPosition) {
            this.farSizes.push((axis.orientation === 'Horizontal') ? labelSize.height : labelSize.width + padding);
        } else {
            this.nearSizes.push((axis.orientation === 'Horizontal') ? labelSize.height : labelSize.width + padding);
        }
        return labelSize;
    }

    /**
     * Generate the axis lables for numeric axis
     * @param heatmap 
     * @private
     */
    public calculateNumericAxisLabels(heatmap: HeatMap): void {

        //Axis Min
        let min: number = 0;
        let max: number = 0;
        let interval: number = this.interval ? this.interval : 1;
        let adaptorMin: Object;
        let adaptorMax: Object;
        if (heatmap.adaptorModule && heatmap.isCellData) {
            adaptorMin = this.orientation === 'Horizontal' ?
                heatmap.adaptorModule.adaptiveXMinMax.min : heatmap.adaptorModule.adaptiveYMinMax.min;
            adaptorMax = this.orientation === 'Horizontal' ?
                heatmap.adaptorModule.adaptiveXMinMax.max : heatmap.adaptorModule.adaptiveYMinMax.max;
        }
        min = !isNullOrUndefined(this.minimum) ? <number>this.minimum : ((adaptorMin) ? <number>adaptorMin : 0);
        max = !isNullOrUndefined(this.maximum) ? <number>this.maximum :
            ((adaptorMax) ? <number>adaptorMax : (this.maxLength * this.increment));
        let temp: number;
        if (this.minimum && this.maximum && min > max) {
            temp = min;
            min = max;
            max = temp;
        }
        max = !isNullOrUndefined(this.maximum) ? max : (adaptorMax ? <number>adaptorMax : (max + min));
        let format: string = this.labelFormat;
        let isCustom: boolean = format.match('{value}') !== null;
        this.format = heatmap.intl.getNumberFormat({
            format: isCustom ? '' : format
        });
        for (let i: number = min; i <= max; i = i + (interval * this.increment)) {
            let value: string = formatValue(isCustom, format, i, this.format);
            this.axisLabels.push(value);
        }
        this.min = 0;
        this.axisLabelSize = Math.floor(((max - min) / this.increment) + 1);
        this.max = this.axisLabelSize - 1;
        this.axisLabelInterval = interval;
        for (let i: number = min; i <= max; i = i + this.increment) {
            let value: string = formatValue(isCustom, format, i, this.format);
            this.tooltipLabels.push(value);
            this.labelValue.push(i);
        }
        this.labelValue = this.isInversed ? this.labelValue.reverse() : this.labelValue;
    }

    /**
     * Generate the axis lables for category axis
     * @private
     */
    public calculateCategoryAxisLabels(): void {
        let labels: string[] = this.labels ? this.labels : [];
        labels = (labels.length > 0) ? labels : this.jsonCellLabel;
        let min: number = !isNullOrUndefined(this.minimum) ? <number>this.minimum : 0;
        let max: number = !isNullOrUndefined(this.maximum) ? <number>this.maximum : this.maxLength;
        let interval: number = this.interval ? this.interval : 1;
        let temp: number;
        if (!isNullOrUndefined(this.minimum) && !isNullOrUndefined(this.maximum) && min > max) {
            temp = min;
            min = max;
            max = temp;
        }
        if (labels && labels.length > 0) {
            for (let i: number = min; i <= max; i = i + interval) {
                let value: string = labels[i] ? labels[i].toString() : i.toString();
                this.axisLabels.push(value);
            }
        } else {
            for (let i: number = min; i <= max; i = i + interval) {
                this.axisLabels.push(i.toString());
            }
        }
        for (let i: number = min; i <= max; i++) {
            this.tooltipLabels.push(labels[i] ? labels[i].toString() : i.toString());
            this.labelValue.push(labels[i] ? labels[i].toString() : i.toString());
        }
        this.min = min;
        this.max = max;
        this.axisLabelSize = max - min + 1;
        this.axisLabelInterval = interval;
        this.labelValue = this.isInversed ? this.labelValue.reverse() : this.labelValue;
    }

    /**
     * Generate the axis labels for date time axis.
     * @param heatmap 
     * @private
     */
    public calculateDateTimeAxisLabel(heatmap: HeatMap): void {
        let interval: number = this.interval ? this.interval : 1;
        let option: DateFormatOptions = {
            skeleton: 'full',
            type: 'dateTime'
        };
        let dateParser: Function = heatmap.intl.getDateParser(option);
        let dateFormatter: Function = heatmap.intl.getDateFormat(option);
        let min: number;
        let max: number;
        let adaptorMin: Object = null;
        let adaptorMax: Object = null;
        if (heatmap.adaptorModule && heatmap.isCellData) {
            adaptorMin = this.orientation === 'Horizontal' ? heatmap.adaptorModule.adaptiveXMinMax.min :
                heatmap.adaptorModule.adaptiveYMinMax.min;
            adaptorMax = this.orientation === 'Horizontal' ? heatmap.adaptorModule.adaptiveXMinMax.max :
                heatmap.adaptorModule.adaptiveYMinMax.max;
        }
        let minimum: object = this.minimum ? this.minimum : (adaptorMin ? adaptorMin : null);
        let maximum: object = this.maximum ? this.maximum : (adaptorMax ? adaptorMax : null);
        if (minimum === null && maximum === null) {
            min = 0;
            max = this.maxLength * this.increment;
            for (let i: number = min; i <= max; i = i + (interval * this.increment)) {
                this.axisLabels.push(i.toString());
                this.tooltipLabels.push(i.toString());
                this.labelValue.push(i.toString());
            }
            this.min = 0;
            this.max = this.maxLength;
            this.axisLabelSize = (max - min) / this.increment + 1;
            this.axisLabelInterval = interval;
        } else {
            if (minimum !== null && maximum === null) {
                min = Date.parse(dateParser(dateFormatter(new Date(
                    DataUtil.parse.parseJson({ val: minimum }).val
                ))));
                max = increaseDateTimeInterval(min, this.maxLength, this.intervalType, this.increment).getTime();
            } else if (minimum === null && maximum !== null) {
                max = Date.parse(dateParser(dateFormatter(new Date(
                    DataUtil.parse.parseJson({ val: maximum }).val
                ))));
                min = increaseDateTimeInterval(max, -this.maxLength, this.intervalType, this.increment).getTime();
            } else {
                min = Date.parse(dateParser(dateFormatter(new Date(
                    DataUtil.parse.parseJson({ val: minimum }).val
                ))));
                max = Date.parse(dateParser(dateFormatter(new Date(
                    DataUtil.parse.parseJson({ val: maximum }).val
                ))));
            }
            this.format = heatmap.intl.getDateFormat({
                format: this.labelFormat, skeleton: this.getSkeleton()
            });
            let tempInterval: number = min;
            while (tempInterval <= max) {
                let value: string = this.format(new Date(tempInterval));
                this.axisLabels.push(value);
                if (this.showLabelOn !== 'None') {
                    interval = this.calculateLabelInterval(tempInterval);
                    this.dateTimeAxisLabelInterval.push(interval);
                }
                tempInterval = increaseDateTimeInterval(tempInterval, interval, this.intervalType, this.increment).getTime();
            }
            this.min = 0;
            this.axisLabelInterval = interval;
            this.axisLabelSize = this.getTotalLabelLength(min, max); // this.tooltipLabels.length;
            this.max = this.axisLabelSize - 1;
            tempInterval = min;
            while (tempInterval <= max) {
                let value: string = this.format(new Date(tempInterval));
                this.tooltipLabels.push(value);
                this.labelValue.push(new Date(tempInterval));
                tempInterval = increaseDateTimeInterval(tempInterval, 1, this.intervalType, this.increment).getTime();
            }
        }
        this.labelValue = this.isInversed ? this.labelValue.reverse() : this.labelValue;
    }

    private calculateLabelInterval(interval: number): number {
        let year: number = new Date(interval).getFullYear();
        let month: number = new Date(interval).getMonth() + 1;
        let day: number = new Date(interval).getDate();
        let numberOfDays: number;
        let tempInterval: number;
        if (this.showLabelOn === 'Years' || this.showLabelOn === 'Months') {
            if (this.showLabelOn === 'Years' && this.intervalType === 'Months') {
                tempInterval = Math.ceil(12 / this.increment);
            } else {
                numberOfDays = this.showLabelOn === 'Years' ? year % 4 === 0 ? 366 : 365 : new Date(year, month, 0).getDate();
                numberOfDays += 1 - day;
                tempInterval = this.intervalType === 'Days' ? Math.ceil(numberOfDays / this.increment) : this.intervalType === 'Hours' ?
                    Math.ceil((numberOfDays * 24) / this.increment) : this.intervalType === 'Minutes' ?
                        Math.ceil((numberOfDays * 24 * 60) / this.increment) : 1;
            }
        } else if (this.showLabelOn === 'Days') {
            tempInterval = this.intervalType === 'Hours' ? Math.ceil(24 / this.increment) : this.intervalType === 'Minutes' ?
                Math.ceil((24 * 60) / this.increment) : 1;
        } else if (this.showLabelOn === 'Hours') {
            let minutes: number = new Date(interval).getMinutes();
            tempInterval = this.intervalType === 'Minutes' ? Math.ceil((60 - minutes) / this.increment) : 1;
        } else {
            tempInterval = 1;
        }
        return tempInterval;
    }
    /**
     * @private
     */
    public getSkeleton(): string {
        let skeleton: string;
        if (this.intervalType === 'Years') {
            skeleton = 'yMMM';
        } else if (this.intervalType === 'Months') {
            skeleton = 'MMMd';
        } else if (this.intervalType === 'Days') {
            skeleton = 'yMd';
        } else if (this.intervalType === 'Hours') {
            skeleton = 'EHm';
        } else if (this.intervalType === 'Minutes') {
            skeleton = 'Hms';
        } else {
            skeleton = 'Hms';
        }
        return skeleton;
    }

    /** @private */
    public getTotalLabelLength(min: number, max: number): number {
        let length: number = 0;
        let minimum: Date = new Date(min);
        let maximum: Date = new Date(max);
        let difference: number;
        let days: number;
        switch (this.intervalType) {
            case 'Years':
                let years: number = ((maximum.getFullYear() - minimum.getFullYear()) / this.increment) + 1;
                length = Math.floor(years);
                break;
            case 'Months':
                let months: number = (maximum.getFullYear() - minimum.getFullYear()) * 12;
                months -= minimum.getMonth();
                months += maximum.getMonth();
                length = months <= 0 ? 1 : Math.floor((months / this.increment) + 1);
                break;
            case 'Days':
                difference = Math.abs(minimum.getTime() - maximum.getTime());
                days = Math.floor(difference / (1000 * 3600 * 24));
                length = Math.floor((days / this.increment) + 1);
                break;
            case 'Hours':
                difference = Math.abs(minimum.getTime() - maximum.getTime());
                let hours: number = Math.floor(difference / (1000 * 3600));
                length = Math.floor(hours / this.increment) + 1;
                break;

            case 'Minutes':
                difference = Math.abs(minimum.getTime() - maximum.getTime());
                let minutes: number = Math.floor(difference / (1000 * 60));
                length = Math.floor(minutes / this.increment) + 1;
                break;
        }
        return length;
    }

    /**
     * Clear the axis label collection
     * @private
     */
    public clearAxisLabel(): void {
        this.axisLabels = [];
        this.tooltipLabels = [];
        this.dateTimeAxisLabelInterval = [];
        this.labelValue = [];
    }
}
