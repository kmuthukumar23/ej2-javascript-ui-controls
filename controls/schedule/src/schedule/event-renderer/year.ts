import { addClass, append, createElement, extend, remove } from '@syncfusion/ej2-base';
import { setStyleAttribute, EventHandler } from '@syncfusion/ej2-base';
import { Schedule } from '../base/schedule';
import { EventRenderedArgs } from '../base/interface';
import { TimelineEvent } from './timeline-view';
import * as util from '../base/util';
import * as events from '../base/constant';
import * as cls from '../base/css-constant';

const EVENT_GAP: number = 2;

/**
 * Year view events render
 */

export class YearEvent extends TimelineEvent {
    public cellHeader: number;

    /**
     * Constructor for year events
     */

    constructor(parent: Schedule) {
        super(parent, 'day');
    }

    public renderAppointments(): void {
        this.fields = this.parent.eventFields;
        let eventWrapper: NodeListOf<Element> = this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_WRAPPER_CLASS);
        eventWrapper.forEach((node: Element) => remove(node));
        this.renderedEvents = [];
        if (this.parent.currentView !== 'TimelineYear') {
            this.yearViewEvents();
        } else {
            this.timelineYearViewEvents();
        }
        this.parent.notify(events.contentReady, {});
    }

    private yearViewEvents(): void {
        for (let month: number = 0; month < 12; month++) {
            let queryString: string = `.e-month-calendar:nth-child(${month + 1}) td.e-work-cells`;
            let workCells: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll(queryString));
            let monthDate: Date = new Date(this.parent.selectedDate.getFullYear(), month, this.parent.selectedDate.getDate());
            let monthStart: Date = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
            let monthEnd: Date = this.parent.calendarUtil.getMonthEndDate(new Date(monthDate.getTime()));
            let startDate: Date = util.getWeekFirstDate(monthStart, this.parent.firstDayOfWeek);
            let endDate: Date = util.addDays(util.getWeekLastDate(monthEnd, this.parent.firstDayOfWeek), 1);
            for (let index: number = 0; startDate.getTime() < endDate.getTime(); index++) {
                let start: Date = util.resetTime(new Date(startDate.getTime()));
                let end: Date = util.addDays(new Date(start.getTime()), 1);
                let filterEvents: Object[] = this.parent.eventBase.filterEvents(start, end);
                if (filterEvents.length > 0) {
                    let workCell: HTMLElement = workCells[index];
                    if (workCell) {
                        workCell.appendChild(createElement('div', { className: cls.APPOINTMENT_CLASS }));
                    }
                }
                startDate = util.addDays(new Date(startDate.getTime()), 1);
            }
        }
    }

    private timelineYearViewEvents(): void {
        let workCell: HTMLElement = this.parent.element.querySelector('.' + cls.WORK_CELLS_CLASS);
        this.cellWidth = workCell.offsetWidth;
        this.cellHeight = workCell.offsetHeight;
        this.cellHeader = (workCell.querySelector('.' + cls.DATE_HEADER_CLASS) as HTMLElement).offsetHeight;
        let eventTable: Element = this.parent.element.querySelector('.' + cls.EVENT_TABLE_CLASS);
        this.eventHeight = util.getElementHeightFromClass(eventTable, cls.APPOINTMENT_CLASS);
        let wrapperCollection: NodeListOf<Element> = this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CONTAINER_CLASS);
        for (let row: number = 0; row < 12; row++) {
            let wrapper: Element = wrapperCollection.item(row);
            let eventWrapper: HTMLElement = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
            wrapper.appendChild(eventWrapper);
            let monthStart: Date = new Date(this.parent.selectedDate.getFullYear(), row, 1);
            let monthEnd: Date = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
            let dayIndex: number = monthStart.getDay();
            while (monthStart.getTime() <= monthEnd.getTime()) {
                let leftValue: number;
                if (this.parent.activeViewOptions.orientation === 'Vertical') {
                    let wrapper: Element = wrapperCollection.item(dayIndex);
                    let eventWrapper: HTMLElement = wrapper.querySelector('.' + cls.APPOINTMENT_WRAPPER_CLASS) as HTMLElement;
                    if (!eventWrapper) {
                        eventWrapper = createElement('div', { className: cls.APPOINTMENT_WRAPPER_CLASS });
                        wrapper.appendChild(eventWrapper);
                    }
                    leftValue = row * this.cellWidth;
                } else {
                    leftValue = ((dayIndex + monthStart.getDate()) - 1) * this.cellWidth;
                }
                let dayStart: Date = util.resetTime(new Date(monthStart.getTime()));
                let dayEnd: Date = util.addDays(new Date(dayStart.getTime()), 1);
                let dayEvents: Object[] = this.parent.eventBase.filterEvents(dayStart, dayEnd);
                for (let index: number = 0, count: number = dayEvents.length; index < count; index++) {
                    let eventData: { [key: string]: Object } = extend({}, dayEvents[index], null, true) as { [key: string]: Object };
                    let overlapIndex: number = this.getIndex(eventData[this.fields.startTime] as Date);
                    eventData.Index = overlapIndex;
                    let availedHeight: number = this.cellHeader + (this.eventHeight * (index + 1)) + EVENT_GAP + this.moreIndicatorHeight;
                    if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                        let isRendered: Object[] = this.renderedEvents.filter((eventObj: { [key: string]: Object }) =>
                            eventObj.Guid === eventData.Guid);
                        if (isRendered.length > 0) { continue; }
                    }
                    if (this.cellHeight > availedHeight) {
                        this.renderEvent(eventWrapper, eventData, row, leftValue, overlapIndex, dayIndex);
                    } else {
                        let moreIndex: number = this.parent.activeViewOptions.orientation === 'Horizontal' ? row : dayIndex;
                        this.renderMoreIndicatior(eventWrapper, count - index, dayStart, moreIndex, leftValue, dayEvents);
                        if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                            for (let a: number = index; a < dayEvents.length; a++) {
                                let moreData: { [key: string]: Object } =
                                    extend({}, dayEvents[a], { Index: overlapIndex + a }, true) as { [key: string]: Object };
                                this.renderedEvents.push(moreData);
                            }
                        }
                        break;
                    }
                }
                monthStart = util.addDays(new Date(monthStart.getTime()), 1);
                if (this.parent.activeViewOptions.orientation === 'Vertical') {
                    dayIndex++;
                    this.renderedEvents = [];
                }
            }
        }
    }

    private renderEvent(wrapper: HTMLElement, eventData: Object, row: number, left: number, overlapCount: number, rowIndex?: number): void {
        let eventObj: { [key: string]: Object } = this.isSpannedEvent(eventData as { [key: string]: Object }, row);
        let wrap: HTMLElement = this.createEventElement(eventObj);
        let width: number;
        let top: number;
        if (this.parent.activeViewOptions.orientation === 'Horizontal') {
            width = (<{ [key: string]: number }>eventObj.isSpanned).count * this.cellWidth;
            top = this.cellHeader + (this.eventHeight * overlapCount) + EVENT_GAP + (this.cellHeight * row);
        } else {
            width = this.cellWidth;
            top = (this.cellHeight * rowIndex) + this.cellHeader + (this.eventHeight * overlapCount) + EVENT_GAP;
        }
        setStyleAttribute(wrap, { 'width': width + 'px', 'height': this.eventHeight + 'px', 'left': left + 'px', 'top': top + 'px' });
        let args: EventRenderedArgs = { data: eventObj, element: wrap, cancel: false, type: 'event' };
        this.parent.trigger(events.eventRendered, args, (eventArgs: EventRenderedArgs) => {
            if (!eventArgs.cancel) {
                wrapper.appendChild(wrap);
                this.wireAppointmentEvents(wrap, null, eventObj);
                this.renderedEvents.push(extend({}, eventObj, null, true));
            }
        });
    }

    private renderMoreIndicatior(wrapper: HTMLElement, count: number, startDate: Date, row: number, left: number, events: Object[]): void {
        let endDate: Date = util.addDays(new Date(startDate.getTime()), 1);
        let moreIndicator: HTMLElement = this.getMoreIndicatorElement(count, startDate, endDate);
        let rowTr: HTMLElement = this.parent.element.querySelector(`.e-content-wrap tr:nth-child(${row + 1})`) as HTMLElement;
        let top: number = rowTr.offsetTop + (this.cellHeight - this.moreIndicatorHeight);
        left = (Math.floor(left / this.cellWidth) * this.cellWidth);
        setStyleAttribute(moreIndicator, { 'width': this.cellWidth + 'px', 'left': left + 'px', 'top': top + 'px' });
        wrapper.appendChild(moreIndicator);
        EventHandler.add(moreIndicator, 'click', this.moreIndicatorClick, this);
    }

    private createEventElement(record: { [key: string]: Object }): HTMLElement {
        let eventSubject: string = (record[this.fields.subject] || this.parent.eventSettings.fields.subject.default) as string;
        let eventWrapper: HTMLElement = createElement('div', {
            className: cls.APPOINTMENT_CLASS,
            attrs: {
                'data-id': 'Appointment_' + record[this.fields.id],
                'data-guid': record.Guid as string,
                'role': 'button', 'tabindex': '0',
                'aria-readonly': this.parent.eventBase.getReadonlyAttribute(record), 'aria-selected': 'false', 'aria-grabbed': 'true',
                'aria-label': eventSubject
            }
        });
        if (this.cssClass) {
            addClass([eventWrapper], this.cssClass);
        }
        if (record[this.fields.isReadonly]) {
            addClass([eventWrapper], cls.READ_ONLY);
        }
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            let resIndex: number = this.getGroupIndexFromEvent(record);
            eventWrapper.setAttribute('data-group-index', resIndex.toString());
        }
        let templateElement: HTMLElement[] = [];
        let eventObj: { [key: string]: Object } = extend({}, record, null, true) as { [key: string]: Object };
        if (this.parent.activeViewOptions.eventTemplate) {
            let templateId: string = this.parent.element.id + '_' + this.parent.activeViewOptions.eventTemplateName + 'eventTemplate';
            templateElement = this.parent.getAppointmentTemplate()(eventObj, this.parent, 'eventTemplate', templateId, false);
        } else {
            let locationEle: string = (record[this.fields.location] || this.parent.eventSettings.fields.location.default || '') as string;
            let subjectEle: HTMLElement = createElement('div', {
                className: cls.SUBJECT_CLASS,
                innerHTML: (eventSubject + (locationEle ? ';&nbsp' + locationEle : ''))
            });
            let startTimeEle: HTMLElement = createElement('div', {
                className: cls.APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + cls.DISABLE_CLASS : ''),
                innerHTML: this.parent.getTimeString(eventObj[this.fields.startTime] as Date)
            });
            let endTimeEle: HTMLElement = createElement('div', {
                className: cls.APPOINTMENT_TIME + (this.parent.isAdaptive ? ' ' + cls.DISABLE_CLASS : ''),
                innerHTML: this.parent.getTimeString(eventObj[this.fields.endTime] as Date)
            });
            addClass([subjectEle], 'e-text-center');
            if (record[this.fields.isAllDay]) {
                templateElement = [subjectEle];
            } else if (!eventObj.isLeft && !eventObj.isRight) {
                templateElement = [startTimeEle, subjectEle, endTimeEle];
            } else {
                if (!eventObj.isLeft) {
                    templateElement.push(startTimeEle);
                }
                templateElement.push(subjectEle);
                if (!eventObj.isRight) {
                    templateElement.push(endTimeEle);
                }
            }
        }
        let appointmentDetails: HTMLElement = createElement('div', { className: cls.APPOINTMENT_DETAILS });
        append(templateElement, appointmentDetails);
        eventWrapper.appendChild(appointmentDetails);
        this.applyResourceColor(eventWrapper, eventObj, 'backgroundColor', this.groupOrder);
        return eventWrapper;
    }

    private isSpannedEvent(eventObj: { [key: string]: Object }, month: number): { [key: string]: Object } {
        let monthStart: Date = new Date(this.parent.selectedDate.getFullYear(), month, 1);
        let monthEnd: Date = util.addDays(new Date(this.parent.selectedDate.getFullYear(), month + 1, 0), 1);
        let eventData: { [key: string]: Object } = extend({}, eventObj, null, true) as { [key: string]: Object };
        let eventStart: Date = eventData[this.fields.startTime] as Date;
        let eventEnd: Date = eventData[this.fields.endTime] as Date;
        eventData.isSpanned = {
            count: Math.ceil((eventEnd.getTime() - eventStart.getTime()) / util.MS_PER_DAY),
            isLeft: eventStart.getTime() < monthStart.getTime(),
            isRight: eventEnd.getTime() > monthEnd.getTime()
        };
        return eventData;
    }

    public getOverlapEvents(date: Date, appointments: { [key: string]: Object }[]): Object[] {
        let appointmentsList: Object[] = [];
        for (let app of appointments as { [key: string]: Date }[]) {
            let appStart: Date = new Date(app[this.fields.startTime].getTime());
            let appEnd: Date = new Date(app[this.fields.endTime].getTime());
            if ((util.resetTime(appStart).getTime() <= util.resetTime(new Date(date.getTime())).getTime()) &&
                (util.resetTime(appEnd).getTime() >= util.resetTime(new Date(date.getTime())).getTime())) {
                appointmentsList.push(app);
            }
        }
        return appointmentsList;
    }
}
