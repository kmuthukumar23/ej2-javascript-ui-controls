﻿import { Base, Event, getUniqueID, NotifyPropertyChanges, INotifyPropertyChanged, Property  } from '@syncfusion/ej2-base';import { closest, Draggable, DragPosition, MouseEventArgs, remove, compareElementParent } from '@syncfusion/ej2-base';import { addClass, isNullOrUndefined, getComponent, isBlazor, BlazorDragEventArgs } from '@syncfusion/ej2-base';

/**
 * Interface for a class Sortable
 */
export interface SortableModel {

    /**
     * It is used to enable or disable the built-in animations. The default value is `false`

     */
    enableAnimation?: boolean;

    /**
     * Specifies the sortable item class.

     */
    itemClass?: string;

    /**
     * Defines the scope value to group sets of sortable libraries.
     * More than one Sortable with same scope allows to transfer elements between different sortable libraries which has same scope value.
     */
    scope?: string;

    /**
     * Defines the callback function for customizing the cloned element.
     */
    helper?: Function;

    /**
     * Defines the callback function for customizing the placeHolder element.
     */
    placeHolder?: Function;

    /**
     * Specifies the callback function for drag event.
     * @event
     */
    drag?: Function;

    /**
     * Specifies the callback function for dragStart event.
     * @event
     */
    dragStart?: Function;

    /**
     * Specifies the callback function for drop event.
     * @event
     */
    drop?: Function;

}