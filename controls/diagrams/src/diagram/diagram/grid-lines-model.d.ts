import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';import { SnapConstraints } from '../enum/enum';

/**
 * Interface for a class Gridlines
 */
export interface GridlinesModel {

    /**
     * Sets the line color of gridlines

     */
    lineColor?: string;

    /**
     * Defines the pattern of dashes and gaps used to stroke horizontal grid lines

     */
    lineDashArray?: string;

    /**
     * A pattern of lines and gaps that defines a set of horizontal/vertical gridlines

     */
    lineIntervals?: number[];

    /**
     * Specifies a set of intervals to snap the objects
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let diagram: Diagram = new Diagram({
     * ...
     * snapSettings: {
     * horizontalGridlines: { lineIntervals: [0.95, 9.05, 0.2, 9.75], snapIntervals: [10] },
     * verticalGridlines: { lineIntervals: [0.95, 9.05, 0.2, 9.75], snapIntervals: [10] }
     * },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```

     */
    snapIntervals?: number[];

}

/**
 * Interface for a class SnapSettings
 */
export interface SnapSettingsModel {

    /**
     * Defines the horizontal gridlines
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let horizontalGridlines: GridlinesModel = {lineColor: 'black', lineDashArray: '1,1' };
     * let verticalGridlines: GridlinesModel = {lineColor: 'black', lineDashArray: '1,1'};
     * let diagram: Diagram = new Diagram({
     * ...
     * snapSettings: { horizontalGridlines, verticalGridlines, constraints: SnapConstraints.ShowLines,
     * snapObjectDistance: 5, snapAngle: 5 },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```

     */
    horizontalGridlines?: GridlinesModel;

    /**
     * Defines the vertical gridlines

     */
    verticalGridlines?: GridlinesModel;

    /**
     * Constraints for gridlines and snapping
     * * None - Snapping does not happen
     * * ShowHorizontalLines - Displays only the horizontal gridlines in diagram.
     * * ShowVerticalLines - Displays only the Vertical gridlines in diagram.
     * * ShowLines - Display both Horizontal and Vertical gridlines.
     * * SnapToHorizontalLines - Enables the object to snap only with horizontal gridlines.
     * * SnapToVerticalLines - Enables the object to snap only with horizontal gridlines.
     * * SnapToLines - Enables the object to snap with both horizontal and Vertical gridlines.
     * * snapToObject - Enables the object to snap with the other objects in the diagram.



     */
    constraints?: SnapConstraints;

    /**
     * Defines the angle by which the object needs to be snapped

     */
    snapAngle?: number;

    /**
     * Sets the minimum distance between the selected object and the nearest object

     */
    snapObjectDistance?: number;

}