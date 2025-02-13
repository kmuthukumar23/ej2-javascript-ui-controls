import { Property, ChildProperty, Complex } from '@syncfusion/ej2-base';import { VisibleType, EdgeLabelMode } from './enum';

/**
 * Interface for a class SparklineBorder
 */
export interface SparklineBorderModel {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     */
    color?: string;

    /**
     * The width of the border in pixels.
     */
    width?: number;

}

/**
 * Interface for a class SparklineFont
 */
export interface SparklineFontModel {

    /**
     * Font size for the text.
     */
    size?: string;

    /**
     * Color for the text.
     */
    color?: string;

    /**
     * FontFamily for the text.
     */
    fontFamily?: string;

    /**
     * FontWeight for the text.
     */
    fontWeight?: string;

    /**
     * FontStyle for the text.
     */
    fontStyle?: string;

    /**
     * Opacity for the text.

     */
    opacity?: number;

}

/**
 * Interface for a class TrackLineSettings
 */
export interface TrackLineSettingsModel {

    /**
     * Toggle the tracker line visibility.

     */
    visible?: boolean;

    /**
     * To config the tracker line color.
     */
    color?: string;

    /**
     * To config the tracker line width.

     */
    width?: number;

}

/**
 * Interface for a class SparklineTooltipSettings
 */
export interface SparklineTooltipSettingsModel {

    /**
     * Toggle the tooltip visibility.

     */
    visible?: boolean;

    /**
     * To customize the tooltip fill color.
     */
    fill?: string;

    /**
     * To customize the tooltip template.
     */
    template?: string;

    /**
     * To customize the tooltip format.
     */
    format?: string;

    /**
     * To configure tooltip border color and width.
     */
    border?: SparklineBorderModel;

    /**
     * To configure tooltip text styles.
     */
    // tslint:disable-next-line
    textStyle?: SparklineFontModel;

    /**
     * To configure the tracker line options.
     */
    trackLineSettings?: TrackLineSettingsModel;

}

/**
 * Interface for a class ContainerArea
 */
export interface ContainerAreaModel {

    /**
     * To configure Sparkline background color.

     */
    background?: string;

    /**
     * To configure Sparkline border color and width.
     */
    border?: SparklineBorderModel;

}

/**
 * Interface for a class LineSettings
 */
export interface LineSettingsModel {

    /**
     * To toggle the axis line visibility.

     */
    visible?: boolean;

    /**
     * To configure the sparkline axis line color.
     */
    color?: string;

    /**
     * To configure the sparkline axis line dashArray.

     */
    dashArray?: string;

    /**
     * To configure the sparkline axis line width.

     */
    width?: number;

    /**
     * To configure the sparkline axis line opacity.

     */
    opacity?: number;

}

/**
 * Interface for a class RangeBandSettings
 */
export interface RangeBandSettingsModel {

    /**
     * To configure sparkline start range

     */
    startRange?: number;

    /**
     * To configure sparkline end range

     */
    endRange?: number;

    /**
     * To configure sparkline rangeband color
     */
    color?: string;

    /**
     * To configure sparkline rangeband opacity

     */
    opacity?: number;

}

/**
 * Interface for a class AxisSettings
 */
export interface AxisSettingsModel {

    /**
     * To configure Sparkline x axis min value.


     */
    minX?: number;

    /**
     * To configure Sparkline x axis max value.


     */
    maxX?: number;

    /**
     * To configure Sparkline y axis min value.


     */
    minY?: number;

    /**
     * To configure Sparkline y axis max value.


     */
    maxY?: number;

    /**
     * To configure Sparkline horizontal axis line position.


     */
    value?: number;

    /**
     * To configure Sparkline axis line settings.
     */
    lineSettings?: LineSettingsModel;

}

/**
 * Interface for a class Padding
 */
export interface PaddingModel {

    /**
     * To configure Sparkline left padding.

     */
    left?: number;

    /**
     * To configure Sparkline right padding.

     */
    right?: number;

    /**
     * To configure Sparkline bottom padding.

     */
    bottom?: number;

    /**
     * To configure Sparkline top padding.

     */
    top?: number;

}

/**
 * Interface for a class SparklineMarkerSettings
 */
export interface SparklineMarkerSettingsModel {

    /**
     * To toggle the marker visibility.

     */
    visible?: VisibleType[];

    /**
     * To configure the marker opacity.

     */
    opacity?: number;

    /**
     * To configure the marker size.

     */
    size?: number;

    /**
     * To configure the marker fill color.

     */
    fill?: string;

    /**
     * To configure Sparkline marker border color and width.
     */
    border?: SparklineBorderModel;

}

/**
 * Interface for a class LabelOffset
 */
export interface LabelOffsetModel {

    /**
     * To move the datalabel horizontally.
     */
    x?: number;

    /**
     * To move the datalabel vertically.
     */
    y?: number;

}

/**
 * Interface for a class SparklineDataLabelSettings
 */
export interface SparklineDataLabelSettingsModel {

    /**
     * To toggle the dataLabel visibility.

     */
    visible?: VisibleType[];

    /**
     * To configure the dataLabel opacity.

     */
    opacity?: number;

    /**
     * To configure the dataLabel fill color.

     */
    fill?: string;

    /**
     * To configure the dataLabel format the value.

     */
    format?: string;

    /**
     * To configure Sparkline dataLabel border color and width.
     */
    border?: SparklineBorderModel;

    /**
     * To configure Sparkline dataLabel text styles.
     */
    // tslint:disable-next-line
    textStyle?: SparklineFontModel;

    /**
     * To configure Sparkline dataLabel offset.
     */
    offset?: LabelOffsetModel;

    /**
     * To change the edge dataLabel placement.

     */
    edgeLabelMode?: EdgeLabelMode;

}