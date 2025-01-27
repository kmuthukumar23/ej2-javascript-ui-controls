import { Property, ChildProperty, Collection, Complex } from '@syncfusion/ej2-base';
import { IElement, ThumbsConstraints } from '@syncfusion/ej2-drawings';
import { Container } from '@syncfusion/ej2-drawings';

import { PointModel } from '@syncfusion/ej2-drawings';
import { Point } from '@syncfusion/ej2-drawings';
import { Size } from '@syncfusion/ej2-drawings';
import { PdfAnnotationBaseModel } from './pdf-annotation-model';
import { PdfAnnotationBase } from './pdf-annotation';

/**
 * Defines the size and position of selected items and defines the appearance of selector

 */
export class Selector extends ChildProperty<Selector> implements IElement {
    /**
     * Defines the size and position of the container

     */
    @Property(null)
    public wrapper: Container;

    /**
     * Defines the collection of selected nodes
     */

    @Collection<PdfAnnotationBaseModel>([], PdfAnnotationBase)
    public annotations: PdfAnnotationBaseModel[];

    /**
     * Sets/Gets the width of the container


     */
    @Property()
    public width: number;

    /**
     * Sets/Gets the height of the container


     */
    @Property()
    public height: number;

    /**
     * Sets the rotate angle of the container

     */
    @Property(0)
    public rotateAngle: number;

    /**
     * Sets the positionX of the container

     */
    @Property(0)
    public offsetX: number;

    /**
     * Sets the positionY of the container

     */
    @Property(0)
    public offsetY: number;

    /**
     * Sets the pivot of the selector

     */
    @Complex<PointModel>({ x: 0.5, y: 0.5 }, Point)
    public pivot: PointModel;

    /**
     * set the constraint of the container
     * * Rotate - Enable Rotate Thumb
     * * ConnectorSource - Enable Connector source point
     * * ConnectorTarget - Enable Connector target point
     * * ResizeNorthEast - Enable ResizeNorthEast Resize
     * * ResizeEast - Enable ResizeEast Resize
     * * ResizeSouthEast - Enable ResizeSouthEast Resize
     * * ResizeSouth - Enable ResizeSouth Resize
     * * ResizeSouthWest - Enable ResizeSouthWest Resize
     * * ResizeWest - Enable ResizeWest Resize
     * * ResizeNorthWest - Enable ResizeNorthWest Resize
     * * ResizeNorth - Enable ResizeNorth Resize
     * @private

     */
    public thumbsConstraints: ThumbsConstraints;
    /**
     * Initializes the UI of the container
     */
    // tslint:disable-next-line
    public init(diagram: any): Container {
        let container: Container = new Container();
        container.measureChildren = false;
        let consize: Size = new Size();
        container.children = [];
        if (this.annotations) {
            for (let i: number = 0; i < this.annotations.length; i++) {
                let node: PdfAnnotationBaseModel = diagram.pdfViewer.nameTable[this.annotations[i].id];
                let wrapper: Container = node.wrapper;
                container.children.push(wrapper);
            }
        }
        this.wrapper = container;
        return container;
    }
}