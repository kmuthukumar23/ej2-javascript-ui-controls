import { ChildProperty, Property, Complex, Collection } from '@syncfusion/ej2-base';
import { ZIndex, Anchor, BorderType, SizeType } from '../utils/enum';
import { Theme } from '../../common/model/theme';
import { Font, Border } from '../../common/model/base';
import { BorderModel, FontModel } from '../../common/model/base-model';
import { LabelBorderModel, MultiLevelCategoriesModel, ScrollbarSettingsRangeModel  } from '../../chart/model/chart-base-model';
import { Units, Alignment, Regions, Position, TextOverflow } from '../../common/utils/enum';

/**
 * Configures the Annotation for chart.
 */
export class ChartAnnotationSettings extends ChildProperty<ChartAnnotationSettings> {
    /**
     * if set coordinateUnit as `Pixel` X specifies the axis value
     * else is specifies pixel or percentage of coordinate

     */
    @Property('0')
    public x: string | Date | number;

    /**
     * if set coordinateUnit as `Pixel` Y specifies the axis value
     * else is specifies pixel or percentage of coordinate

     */
    @Property('0')
    public y: string | number;

    /**
     * Content of the annotation, which accepts the id of the custom element.

     */
    @Property(null)
    public content: string;

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
     * Specifies the regions of the annotation. They are
     * * Chart - Annotation renders based on chart coordinates.
     * * Series - Annotation renders based on series coordinates.

     */

    @Property('Chart')
    public region: Regions;

    /**
     * Specifies the position of the annotation. They are
     * * Top - Align the annotation element as top side.
     * * Bottom - Align the annotation element as bottom side.
     * * Middle - Align the annotation element as mid point.

     */

    @Property('Middle')
    public verticalAlignment: Position;

    /**
     * The name of horizontal axis associated with the annotation.
     * It requires `axes` of chart.

     */

    @Property(null)
    public xAxisName: string;

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
}

/**
 * label border properties.
 */
export class LabelBorder extends ChildProperty<LabelBorder> {

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

    /**
     * Border type for labels
     * * Rectangle
     * * Without Top Border
     * * Without Top and BottomBorder
     * * Without Border
     * * Brace
     * * CurlyBrace

     */
    @Property('Rectangle')
    public type: BorderType;

}
/**
 * categories for multi level labels
 */
export class MultiLevelCategories extends ChildProperty<MultiLevelCategories> {

    /**
     * Start value of the multi level labels


     */
    @Property(null)
    public start: number | Date | string;
    /**
     * End value of the multi level labels


     */
    @Property(null)
    public end: number | Date | string;
    /**
     * multi level labels text.

     */
    @Property('')
    public text: string;

    /**
     * Maximum width of the text for multi level labels.


     */
    @Property(null)
    public maximumTextWidth: number;

    /**
     * multi level labels custom data.

     */
    @Property(null)
    public customAttributes: object;

    /**
     * Border type for labels
     * * Rectangle
     * * Without Top Border
     * * Without Top and BottomBorder
     * * Without Border
     * * Brace
     * * CurlyBrace



     */
    @Property('')
    public type: BorderType;

}
/**
 * Strip line properties
 */
export class StripLineSettings extends ChildProperty<StripLineSettings> {

    /**
     * If set true, strip line for axis renders.

     */
    @Property(true)
    public visible: boolean;

    /**
     *  If set true, strip line get render from axis origin.

     */
    @Property(false)
    public startFromAxis: boolean;

    /**
     * Start value of the strip line.


     */
    @Property(null)
    public start: number | Date;

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
     * Color of the strip line.

     */
    @Property('#808080')
    public color: string;

    /**
     * Dash Array of the strip line.


     */
    @Property(null)
    public dashArray: string;

    /**
     * Size type of the strip line

     */
    @Property('Auto')
    public sizeType: SizeType;

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
     * repeatUntil value of the strip line.


     */
    @Property(null)
    public repeatUntil: number | Date;

    /**
     * isSegmented value of the strip line


     */
    @Property(false)
    public isSegmented: boolean;

    /**
     * segmentStart value of the strip line.


     */
    @Property(null)
    public segmentStart: number | Date;

    /**
     * segmentEnd value of the strip line.


     */
    @Property(null)
    public segmentEnd: number | Date;

    /**
     * segmentAxisName of the strip line.


     */
    @Property(null)
    public segmentAxisName: string;

    /**
     * Border of the strip line.
     */
    @Complex<BorderModel>({ color: 'transparent', width: 1 }, Border)
    public border: BorderModel;

    /**
     * Strip line text.

     */
    @Property('')
    public text: string;

    /**
     * The angle to which the strip line text gets rotated.


     */
    @Property(null)
    public rotation: number;

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
    @Complex<FontModel>(Theme.stripLineLabelFont, Font)
    public textStyle: FontModel;

    /**
     * Specifies the order of the strip line. They are,
     * * Behind: Places the strip line behind the series elements.
     * * Over: Places the strip line over the series elements.

     */
    @Property('Behind')
    public zIndex: ZIndex;

    /**
     * Strip line Opacity

     */
    @Property(1)
    public opacity: number;
}

/**
 * MultiLevelLabels properties
 */
export class MultiLevelLabels extends ChildProperty<MultiLevelLabels[]> {

    /**
     * Defines the position of the multi level labels. They are,
     * * Near: Places the multi level labels at Near.
     * * Center: Places the multi level labels at Center.
     * * Far: Places the multi level labels at Far.

     */
    @Property('Center')
    public alignment: Alignment;

    /**
     * Defines the textOverFlow for multi level labels. They are,
     * * Trim: Trim textOverflow for multi level labels.
     * * Wrap: Wrap textOverflow for multi level labels.
     * * none: None textOverflow for multi level labels.

     */
    @Property('Wrap')
    public overflow: TextOverflow;
    /**
     * Options to customize the multi level labels.
     */
    @Complex<FontModel>(Theme.axisLabelFont, Font)
    public textStyle: FontModel;
    /**
     * Border of the multi level labels.
     */
    @Complex<LabelBorderModel>({ color: null, width: 1, type: 'Rectangle' }, LabelBorder)
    public border: LabelBorderModel;
    /**
     * multi level categories for multi level labels.
     */
    @Collection<MultiLevelCategories>([], MultiLevelCategories)
    public categories: MultiLevelCategoriesModel[];

}

/**
 * Specifies range for scrollbarSettings property
 * @public
 */
export class ScrollbarSettingsRange extends ChildProperty<ScrollbarSettingsRange> {

    /**
     * Specifies the minimum range of an scrollbar.

     */

     @Property(null)
     public minimum: Date | string | number;

     /**
      * Specifies the maximum range of an scrollbar.

      */

     @Property(null)
     public maximum: Date | string | number;

  }

  /**
   * Scrollbar Settings Properties for Lazy Loading
   */
  export class ScrollbarSettings extends ChildProperty<ScrollbarSettings> {
      /**
       * Enables the scrollbar for lazy loading.

       */
     @Property(false)
     public enable: boolean;

      /**
       * Defines the length of the points for numeric and logarithmic values.

       */
     @Property(null)
     public pointsLength: number;

     /**
      * Specifies the range for date time values alone.
      */
     @Complex<ScrollbarSettingsRangeModel>({}, ScrollbarSettingsRange)
     public range: ScrollbarSettingsRangeModel;
  }
