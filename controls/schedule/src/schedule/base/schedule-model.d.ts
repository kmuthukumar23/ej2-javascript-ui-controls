import { Component, ModuleDeclaration, Property, Event, Animation, Collection, isBlazor } from '@syncfusion/ej2-base';import { EventHandler, EmitType, Browser, Internationalization, getDefaultDateObject, cldrData, L10n } from '@syncfusion/ej2-base';import { getValue, compile, extend, isNullOrUndefined, NotifyPropertyChanges, INotifyPropertyChanged, Complex } from '@syncfusion/ej2-base';import { getElement, removeClass, addClass, classList, remove, updateBlazorTemplate, resetBlazorTemplate } from '@syncfusion/ej2-base';import { createSpinner, hideSpinner, showSpinner } from '@syncfusion/ej2-popups';import { HeaderRenderer } from '../renderer/header-renderer';import { Scroll } from '../actions/scroll';import { ScheduleTouch } from '../actions/touch';import { KeyboardInteraction } from '../actions/keyboard';import { Data } from '../actions/data';import { View, CurrentAction, ReturnType } from '../base/type';import { EventBase } from '../event-renderer/event-base';import { QuickPopups } from '../popups/quick-popups';import { EventTooltip } from '../popups/event-tooltip';import { EventWindow } from '../popups/event-window';import { Render } from '../renderer/renderer';import { Day } from '../renderer/day';import { Week } from '../renderer/week';import { WorkWeek } from '../renderer/work-week';import { Month } from '../renderer/month';import { Year } from '../renderer/year';import { Agenda } from '../renderer/agenda';import { MonthAgenda } from '../renderer/month-agenda';import { TimelineViews } from '../renderer/timeline-view';import { TimelineMonth } from '../renderer/timeline-month';import { TimelineYear } from '../renderer/timeline-year';import { WorkHours } from '../models/work-hours';import { TimeScale } from '../models/time-scale';import { QuickInfoTemplates } from '../models/quick-info-templates';import { HeaderRows } from '../models/header-rows';import { Crud } from '../actions/crud';import { Resize } from '../actions/resize';import { DragAndDrop } from '../actions/drag';import { VirtualScroll } from '../actions/virtual-scroll';import { WorkCellInteraction } from '../actions/work-cells';import { WorkHoursModel, ViewsModel, EventSettingsModel, GroupModel, ResourcesModel, TimeScaleModel } from '../models/models';import { QuickInfoTemplatesModel, HeaderRowsModel } from '../models/models';import { EventSettings } from '../models/event-settings';import { Group } from '../models/group';import { Resources } from '../models/resources';import { ICalendarExport } from '../exports/calendar-export';import { ICalendarImport } from '../exports/calendar-import';import { ExcelExport } from '../exports/excel-export';import { Print } from '../exports/print';import { IRenderer, ActionEventArgs, NavigatingEventArgs, CellClickEventArgs, RenderCellEventArgs, ScrollCss } from '../base/interface';import { EventClickArgs, EventRenderedArgs, PopupOpenEventArgs, UIStateArgs, DragEventArgs, ResizeEventArgs } from '../base/interface';import { EventFieldsMapping, TdData, ResourceDetails, ResizeEdges, StateArgs, ExportOptions, SelectEventArgs } from '../base/interface';import { ViewsData, PopupCloseEventArgs, HoverEventArgs, MoreEventsClickArgs } from '../base/interface';import { CalendarUtil, Gregorian, Islamic, CalendarType } from '../../common/calendar-util';import { ResourceBase } from '../base/resource';import { Timezone } from '../timezone/timezone';import { RecurrenceEditor } from '../../recurrence-editor/recurrence-editor';import * as events from '../base/constant';import * as cls from '../base/css-constant';import * as util from '../base/util';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Schedule
 */
export interface ScheduleModel extends ComponentModel{

    /**
     * Sets the `width` of the Schedule component, accepting both string and number values.
     * The string value can be either pixel or percentage format.
     * When set to `auto`, the Schedule width gets auto-adjusted and display its content related to the viewable screen size.

     */
    width?: string | number;

    /**
     * Sets the `height` of the Schedule component, accepting both string and number values.
     * The string type includes either pixel or percentage values.
     * When `height` is set with specific pixel value, then the Schedule will be rendered to that specified space.
     * In case, if `auto` value is set, then the height of the Schedule gets auto-adjusted within the given container.

     */
    height?: string | number;

    /**
     * When set to `false`, hides the header bar of the Schedule from UI. By default,
     *  the header bar holds the date and view navigation options, to which the user can add their own custom items onto it.

     */
    showHeaderBar?: boolean;

    /**
     * When set to `false`, hides the current time indicator from the Schedule. Otherwise,
     *  it visually depicts the live current system time appropriately on the user interface.

     */
    showTimeIndicator?: boolean;

    /**
     * To set the active view on scheduler, the `currentView` property can be used and it usually accepts either of the following available
     *  view options. The view option specified in this property will be initially loaded on the schedule.
     * * Day
     * * Week
     * * WorkWeek
     * * Month
     * * Agenda
     * * MonthAgenda
     * * TimelineDay
     * * TimelineWeek
     * * TimelineWorkWeek
     * * TimelineMonth

     */
    currentView?: View;

    /**
     * This property holds the views collection and its configurations. It accepts either the array of view names or the array of view
     *  objects that holds different configurations for each views. By default,
     *  Schedule displays all the views namely `Day`, `Week`, `Work Week`, `Month` and `Agenda`.
     * Example for array of views:
     * {% codeBlock src="schedule/view-api/index.ts" %}{% endcodeBlock %}
     * Example for array of view objects:
     * {% codeBlock src="schedule/view-api/array.ts" %}{% endcodeBlock %}

     */
    views?: View[] | ViewsModel[];

    /**
     * To mark the active (current) date on the Schedule, `selectedDate` property can be defined.
     *  Usually, it defaults to the current System date.



     */
    selectedDate?: Date;

    /**
     * By default, Schedule follows the date-format as per the default culture assigned to it.
     *  It is also possible to manually set specific date format by using the `dateFormat` property. 
     * The format of the date range label in the header bar depends on the `dateFormat` value or else based on the 
     * locale assigned to the Schedule. 

     */
    dateFormat?: string;

    /**
     *  It allows the Scheduler to display in other calendar modes. 
     * By default, Scheduler is displayed in `Gregorian` calendar mode. 
     * To change the mode, you can set either `Gregorian` or `Islamic` as a value to this `calendarMode` property. 

     */
    calendarMode?: CalendarType;

    /**
     * When set to `false`, it hides the weekend days of a week from the Schedule. The days which are not defined in the working days
     *  collection are usually treated as weekend days.
     * Note: By default, this option is not applicable on `Work Week` view.
     * For example, if the working days are defined as [1, 2, 3, 4], then the remaining days of that week will be considered as
     *  the weekend days and will be hidden on all the views.

     */
    showWeekend?: boolean;

    /**
     * This option allows the user to set the first day of a week on Schedule. It should be based on the locale set to it and each culture
     *  defines its own first day of week values. If needed, the user can set it manually on his own by defining the value through
     *  this property. It usually accepts the integer values, whereby 0 is always denoted as Sunday, 1 as Monday and so on.

     */
    firstDayOfWeek?: number;

    /**
     * It is used to set the working days on Schedule. The only days that are defined in this collection will be rendered on the `workWeek`
     *  view whereas on other views, it will display all the usual days and simply highlights the working days with different shade.



     */
    workDays?: number[];

    /**
     * It is used to specify the starting hour, from which the Schedule starts to display. It accepts the time string in a short skeleton
     *  format and also, hides the time beyond the specified start time.

     */
    startHour?: string;

    /**
     * It is used to specify the end hour, at which the Schedule ends. It too accepts the time string in a short skeleton format.

     */
    endHour?: string;

    /**
     * When set to `true`, allows the resizing of appointments. It allows the rescheduling of appointments either by changing the
     *  start or end time by dragging the event resize handlers.

     */
    allowResizing?: boolean;

    /**
     * The working hours should be highlighted on Schedule with different color shade and an additional option must be provided to
     *  highlight it or not. This functionality is handled through `workHours` property and the start work hour should be 9 AM by default
     *  and end work hour should point to 6 PM. The start and end working hours needs to be provided as Time value of short skeleton type.

     */
    workHours?: WorkHoursModel;

    /**
     * Allows to set different time duration on Schedule along with the customized grid count. It also has template option to
     *  customize the time slots with required time values in its own format.
     * {% codeBlock src="schedule/timescale-api/index.ts" %}{% endcodeBlock %}

     */
    timeScale?: TimeScaleModel;

    /**
     * When set to `true`, allows the keyboard interaction to take place on Schedule.

     */
    allowKeyboardInteraction?: boolean;

    /**
     * When set to `true`, allows the appointments to move over the time slots. When an appointment is dragged, both its start
     *  and end time tends to change simultaneously allowing it to reschedule the appointment on some other time.

     */
    allowDragAndDrop?: boolean;

    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying it onto
     *  the date header cells. The field that can be accessed via this template is `date`.
     * {% codeBlock src="schedule/date-header-api/index.ts" %}{% endcodeBlock %}

     */
    dateHeaderTemplate?: string;

    /**
     * It accepts either the string or HTMLElement as template design content and parse it appropriately before displaying it onto
     *  the month date cells. This template is only applicable for month view day cells.

     */
    cellHeaderTemplate?: string;

    /**
     * The template option which is used to render the customized work cells on the Schedule. Here, the template accepts either
     *  the string or HTMLElement as template design and then the parsed design is displayed onto the work cells.
     *  The fields accessible via template are as follows.
     *  * date
     *  * groupIndex
     *  * type
     * {% codeBlock src="schedule/cell-template-api/index.html" %}{% endcodeBlock %}
     * {% codeBlock src="schedule/cell-template-api/index.ts" %}{% endcodeBlock %}

     */
    cellTemplate?: string;

    /**
     * When set to `true`, makes the Schedule to render in a read only mode. No CRUD actions will be allowed at this time.

     */
    readonly?: boolean;

    /**
     * When set to `true`, displays a quick popup with cell or event details on single clicking over the cells or on events.
     *  By default, it is set to `true`.

     */
    showQuickInfo?: boolean;

    /**
     * When set to `true`, displays the week number of the current view date range.
     *  By default, it is set to `false`.

     */
    showWeekNumber?: boolean;

    /**
     * when set to `true`, allows the height of the work-cells to adjust automatically 
     * based on the number of appointments present in those time ranges. 

     */
    rowAutoHeight?: boolean;

    /**
     * The template option to render the customized editor window. The form elements defined within this template should be accompanied
     *  with `e-field` class, so as to fetch and process it from internally.
     * {% codeBlock src="schedule/editor-api/index.html" %}{% endcodeBlock %}
     * {% codeBlock src="schedule/editor-api/index.ts" %}{% endcodeBlock %}

     */
    editorTemplate?: string;

    /**
     * The template option to customize the quick window. The three sections of the quick popup whereas the header, content,
     *  and footer can be easily customized with individual template option.
     * {% codeBlock src="schedule/quick-info-template-api/index.html" %}{% endcodeBlock %}
     * {% codeBlock src="schedule/quick-info-template-api/index.ts" %}{% endcodeBlock %}

     */
    quickInfoTemplates?: QuickInfoTemplatesModel;

    /**
     * Sets the number of days to be displayed by default in Agenda View and in case of virtual scrolling,
     *  the number of days will be fetched on each scroll-end based on this count.

     */
    agendaDaysCount?: number;

    /**
     * The days which does not has even a single event to display will be hidden from the UI of Agenda View by default.
     *  When this property is set to `false`, the empty dates will also be displayed on the Schedule.

     */
    hideEmptyAgendaDays?: boolean;

    /**
     * The recurrence validation will be done by default
     *  When this property is set to `false`, the recurrence validation will be skipped.

     */
    enableRecurrenceValidation?: boolean;

    /**
     * Schedule will be assigned with specific timezone, so as to display the events in it accordingly. By default,
     *  Schedule dates are processed with System timezone, as no timezone will be assigned specifically to the Schedule at the initial time.
     *  Whenever the Schedule is bound to remote data services, it is always recommended to set specific timezone to Schedule to make the
     *  events on it to display on the same time irrespective of the system timezone. It usually accepts
     *  the valid [IANA](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) timezone names.

     */
    timezone?: string;

    /**
     * Complete set of settings related to Schedule events to bind it to local or remote dataSource, map applicable database fields and
     *  other validation to be carried out on the available fields.

     */
    eventSettings?: EventSettingsModel;

    /**
     * Template option to customize the resource header bar. Here, the template accepts either
     *  the string or HTMLElement as template design and then the parsed design is displayed onto the resource header cells.
     * The following can be accessible via template.
     * * resource - All the resource fields.
     * * resourceData - object collection of current resource.
     * {% codeBlock src="schedule/resource-header-api/index.html" %}{% endcodeBlock %}
     * {% codeBlock src="schedule/resource-header-api/index.ts" %}{% endcodeBlock %}

     */
    resourceHeaderTemplate?: string;

    /**
     * Allows defining the group related settings of multiple resources. When this property is non-empty, it means
     *  that the resources will be grouped on the schedule layout based on the provided resource names.
     * {% codeBlock src="schedule/group-api/index.ts" %}{% endcodeBlock %}

     */
    group?: GroupModel;

    /**
     * Allows defining the collection of resources to be displayed on the Schedule. The resource collection needs to be defined
     *  with unique resource names to identify it along with the respective dataSource and field mapping options.
     * {% codeBlock src="schedule/resources-api/index.ts" %}{% endcodeBlock %}

     */
    resources?: ResourcesModel[];

    /**
     * Allows defining the collection of custom header rows to display the year, month, week, date and hour label as an individual row
     *  on the timeline view of the scheduler.
     * {% codeBlock src="schedule/header-rows-api/index.ts" %}{% endcodeBlock %}

     */
    headerRows?: HeaderRowsModel[];

    /**
     * It is used to customize the Schedule which accepts custom CSS class names that defines specific user-defined styles and themes
     *  to be applied on the Schedule element.

     */
    cssClass?: string;

    /**
     * It enables the external drag and drop support for appointments on scheduler, to be able to move them out of the scheduler layout.
     *  When the drag area is explicitly set with specific DOM element name,
     *  the appointments can be dragged anywhere within the specified drag area location.

     */
    eventDragArea?: string;

    /**
     * Triggers after the scheduler component is created.
     * @event

     */
    created?: EmitType<Object>;

    /**
     * Triggers when the scheduler component is destroyed.
     * @event

     */
    destroyed?: EmitType<Object>;

    /**
     * Triggers when the scheduler cells are single clicked or on single tap on the same cells in mobile devices.
     * @event

     */
    cellClick?: EmitType<CellClickEventArgs>;

    /**
     * Triggers when the scheduler cells are double clicked.
     * @event

     */
    cellDoubleClick?: EmitType<CellClickEventArgs>;

    /**
     * Triggers when the more events indicator are clicked.
     * @event

     */
    moreEventsClick?: EmitType<MoreEventsClickArgs>;

    /**
     * Triggers when the scheduler elements are hovered.
     * @event


     */
    hover?: EmitType<HoverEventArgs>;

    /**
     * Triggers when multiple cells or events are selected on the Scheduler.
     * @event


     */
    select?: EmitType<SelectEventArgs>;

    /**
     * Triggers on beginning of every scheduler action.
     * @event


     */
    actionBegin?: EmitType<ActionEventArgs>;

    /**
     * Triggers on successful completion of the scheduler actions.
     * @event


     */
    actionComplete?: EmitType<ActionEventArgs>;

    /**
     * Triggers when a scheduler action gets failed or interrupted and an error information will be returned.
     * @event


     */
    actionFailure?: EmitType<ActionEventArgs>;

    /**
     * Triggers before the date or view navigation takes place on scheduler.
     * @event

     */
    navigating?: EmitType<NavigatingEventArgs>;

    /**
     * Triggers before each element of the schedule rendering on the page.
     * @event


     */
    renderCell?: EmitType<RenderCellEventArgs>;

    /**
     * Triggers when the events are single clicked or on single tapping the events on the mobile devices.
     * @event


     */
    eventClick?: EmitType<EventClickArgs>;

    /**
     * Triggers before each of the event getting rendered on the scheduler user interface.
     * @event


     */
    eventRendered?: EmitType<EventRenderedArgs>;

    /**
     * Triggers before the data binds to the scheduler.
     * @event


     */
    dataBinding?: EmitType<ReturnType>;

    /**
     * Triggers before any of the scheduler popups opens on the page.
     * @event


     */
    popupOpen?: EmitType<PopupOpenEventArgs>;

    /**
     * Triggers before any of the scheduler popups close on the page.
     * @event


     */
    popupClose?: EmitType<PopupCloseEventArgs>;

    /**
     * Triggers when an appointment is started to drag.
     * @event

     */
    dragStart?: EmitType<DragEventArgs>;

    /**
     * Triggers when an appointment is being in a dragged state.
     * @event


     */
    drag?: EmitType<DragEventArgs>;

    /**
     * Triggers when the dragging of appointment is stopped.
     * @event

     */
    dragStop?: EmitType<DragEventArgs>;

    /**
     * Triggers when an appointment is started to resize.
     * @event

     */
    resizeStart?: EmitType<ResizeEventArgs>;

    /**
     * Triggers when an appointment is being in a resizing action.
     * @event


     */
    resizing?: EmitType<ResizeEventArgs>;

    /**
     * Triggers when the resizing of appointment is stopped.
     * @event

     */
    resizeStop?: EmitType<ResizeEventArgs>;

    /**
     * Triggers once the event data is bound to the scheduler.
     * @event


     */
    dataBound?: EmitType<ReturnType>;

}