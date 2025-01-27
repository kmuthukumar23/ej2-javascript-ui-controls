import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';import { ShapeStyle, Margin } from '../core/appearance';import { ShapeStyleModel, MarginModel } from '../core/appearance-model';import { Point } from '../primitives/point';import { PointModel } from '../primitives/point-model';import { HorizontalAlignment, VerticalAlignment, PortShapes, PortConstraints, PortVisibility } from '../enum/enum';

/**
 * Interface for a class Port
 */
export interface PortModel {

    /**
     * Defines the unique id of the port

     */
    id?: string;

    /**
     * Sets the horizontal alignment of the port with respect to its immediate parent(node/connector)
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Left - Aligns the diagram element at the left of its immediate parent
     * * Right - Aligns the diagram element at the right of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent

     */
    horizontalAlignment?: HorizontalAlignment;

    /**
     * Sets the vertical alignment of the port with respect to its immediate parent(node/connector)
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Top - Aligns the diagram element at the top of its immediate parent
     * * Bottom - Aligns the diagram element at the bottom of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent

     */
    verticalAlignment?: VerticalAlignment;

    /**
     * Defines the space that the port has to be moved from its actual position

     */
    margin?: MarginModel;

    /**
     * Sets the width of the port

     */
    width?: number;

    /**
     * Sets the height of the port

     */
    height?: number;

    /**
     * Defines the appearance of the port
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     *   let port: PointPortModel[] =
     * [{ id: 'port1', visibility: PortVisibility.Visible, shape: 'Circle', offset: { x: 0, y: 0 } },];
     * let nodes: NodeModel[] = [{
     * id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
     * }];
     * nodes.ports = port;
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes : nodes,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```

     */
    style?: ShapeStyleModel;

    /**
     * Defines the type of the port shape
     * * X - Sets the decorator shape as X
     * * Circle - Sets the decorator shape as Circle
     * * Square - Sets the decorator shape as Square
     * * Custom - Sets the decorator shape as Custom

     */
    shape?: PortShapes;

    /**
     * Defines the type of the port visibility
     * * Visible - Always shows the port
     * * Hidden - Always hides the port
     * * Hover - Shows the port when the mouse hovers over a node
     * * Connect - Shows the port when a connection end point is dragged over a node



     */
    visibility?: PortVisibility;

    /**
     * Defines the geometry of the port

     */
    pathData?: string;

    /**
     * Defines the constraints of port



     */
    constraints?: PortConstraints;

    /**
     * Allows the user to save custom information/data about a port



     */
    addInfo?: Object;

}

/**
 * Interface for a class PointPort
 */
export interface PointPortModel extends PortModel{

    /**
     * Defines the position of the port with respect to the boundaries of nodes/connector

     */
    offset?: PointModel;

}