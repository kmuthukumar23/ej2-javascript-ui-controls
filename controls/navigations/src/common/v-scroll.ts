import { Touch, ScrollEventArgs, TouchEventArgs, Component, EventHandler, selectAll, getUniqueID, removeClass } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged, Property, Browser, detach, createElement as buildTag } from '@syncfusion/ej2-base';
import { classList, SwipeEventArgs, isNullOrUndefined } from '@syncfusion/ej2-base';
import { VScrollModel } from './v-scroll-model';

type HTEle = HTMLElement;
type Str = string;

const CLS_ROOT: Str = 'e-vscroll';
const CLS_RTL: Str = 'e-rtl';
const CLS_DISABLE: Str = 'e-overlay';
const CLS_VSCROLLBAR: Str = 'e-vscroll-bar';
const CLS_VSCROLLCON: Str = 'e-vscroll-content';
const CLS_NAVARROW: Str = 'e-nav-arrow';
const CLS_NAVUPARROW: Str = 'e-nav-up-arrow';
const CLS_NAVDOWNARROW: Str = 'e-nav-down-arrow';
const CLS_VSCROLLNAV: Str = 'e-scroll-nav';
const CLS_VSCROLLNAVUP: Str = 'e-scroll-up-nav';
const CLS_VSCROLLNAVDOWN: Str = 'e-scroll-down-nav';
const CLS_DEVICE: Str = 'e-scroll-device';
const CLS_OVERLAY: Str = 'e-scroll-overlay';
const CLS_UPOVERLAY: Str = 'e-scroll-up-overlay';
const CLS_DOWNOVERLAY: Str = 'e-scroll-down-overlay';
const OVERLAY_MAXWID: number = 40;

interface TapEventArgs {
    name: string;
    originalEvent: TouchEventArgs | TouchEvent | KeyboardEvent;
}
/**
 * VScroll module is introduces vertical scroller when content exceeds the current viewing area.
 * It can be useful for the components like Toolbar, Tab which needs vertical scrolling alone.
 * Hidden content can be view by touch moving or icon click.
 * ```html
 * <div id="scroll"/>
 * <script>
 *   var scrollObj = new VScroll();
 *   scrollObj.appendTo("#scroll");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class VScroll extends Component<HTMLElement> implements INotifyPropertyChanged {
    private touchModule: Touch;
    private scrollEle: HTEle;
    private scrollItems: HTEle;
    private uniqueId: Boolean;
    private timeout: number;
    private keyTimeout: Boolean;
    private keyTimer: number;
    private browser: String;
    private browserCheck: Boolean;
    private ieCheck: Boolean;
    private isDevice: Boolean;
    private customStep: Boolean;

    /**
     * Specifies the up or down scrolling distance of the vertical scrollbar moving.

     */
    @Property(null)
    public scrollStep: number;
    /**
     * Initialize the event handler
     * @private
     */
    protected preRender(): void {
        this.browser = Browser.info.name;
        this.browserCheck = this.browser === 'mozilla';
        this.isDevice = Browser.isDevice;
        this.customStep = true;
        let ele: HTEle = this.element;
        this.ieCheck = this.browser === 'edge' || this.browser === 'msie';
        this.initialize();
        if (ele.id === '') {
            ele.id = getUniqueID('vscroll');
            this.uniqueId = true;
        }
        ele.style.display = 'block';
        if (this.enableRtl) {
            ele.classList.add(CLS_RTL);
        }
    }
    /**
     * To Initialize the vertical scroll rendering
     * @private
     */
    protected render(): void {
        this.touchModule = new Touch(this.element, { scroll: this.touchHandler.bind(this), swipe: this.swipeHandler.bind(this) });
        EventHandler.add(this.scrollEle, 'scroll', this.scrollEventHandler, this);
        if (!this.isDevice) {
            this.createNavIcon(this.element);
        } else {
            this.element.classList.add(CLS_DEVICE);
            this.createOverlayElement(this.element);
        }
        this.setScrollState();
        EventHandler.add(this.element, 'wheel', this.wheelEventHandler, this);
    }
    private setScrollState(): void {
        if (isNullOrUndefined(this.scrollStep) || this.scrollStep < 0) {
            this.scrollStep = this.scrollEle.offsetHeight;
            this.customStep = false;
        } else {
            this.customStep = true;
        }
    }
    /**
     * Initializes a new instance of the VScroll class.
     * @param options  - Specifies VScroll model properties as options.
     * @param element  - Specifies the element for which vertical scrolling applies.
     */
    constructor(options?: VScrollModel, element?: string | HTMLElement) {
        super(options, <HTEle | string>element);
    }
    private initialize(): void {
        let scrollCnt: HTEle = buildTag('div', { className: CLS_VSCROLLCON });
        let scrollBar: HTEle = buildTag('div', { className: CLS_VSCROLLBAR });
        scrollBar.setAttribute('tabindex', '-1');
        let ele: HTEle = this.element;
        let innerEle: HTEle[] = [].slice.call(ele.children);
        for (let ele of innerEle) {
            scrollCnt.appendChild(ele);
        }
        scrollBar.appendChild(scrollCnt);
        ele.appendChild(scrollBar);
        scrollBar.style.overflowY = 'hidden';
        this.scrollEle = scrollBar;
        this.scrollItems = scrollCnt;
    }
    protected getPersistData(): string {
        let keyEntity: string[] = ['scrollStep'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    protected getModuleName(): string {
        return 'vScroll';
    }
    /**
     * Removes the control from the DOM and also removes all its related events.
     * @returns void
     */
    public destroy(): void {
        let el: HTEle = this.element;
        el.style.display = '';
        removeClass([this.element], [CLS_ROOT, CLS_DEVICE]);
        let navs: HTEle[] = selectAll('.e-' + el.id + '_nav.' + CLS_VSCROLLNAV, el);
        let overlays: HTEle[] = selectAll('.' + CLS_OVERLAY, el);
        [].slice.call(overlays).forEach((ele: HTMLElement) => {
            detach(ele);
        });
        for (let elem of [].slice.call(this.scrollItems.children)) {
            el.appendChild(elem);
        }
        if (this.uniqueId) {
            this.element.removeAttribute('id');
        }
        detach(this.scrollEle);
        if (navs.length > 0) {
            detach(navs[0]);
            if (!isNullOrUndefined(navs[1])) { detach(navs[1]); }
        }
        EventHandler.remove(this.scrollEle, 'scroll', this.scrollEventHandler);
        this.touchModule.destroy();
        this.touchModule = null;
        super.destroy();
    }
    /**
     * Specifies the value to disable/enable the VScroll component.
     * When set to `true` , the component will be disabled.
     * @param  {boolean} value - Based on this Boolean value, VScroll will be enabled (false) or disabled (true).
     * @returns void.
     */
    public disable(value: boolean): void {
        let navEle: HTMLElement[] = selectAll('.e-scroll-nav:not(.' + CLS_DISABLE + ')', this.element);
        value ? this.element.classList.add(CLS_DISABLE) : this.element.classList.remove(CLS_DISABLE);
        [].slice.call(navEle).forEach((el: HTMLElement) => {
            el.setAttribute('tabindex', !value ? '0' : '-1');
        });
    }
    private createOverlayElement(element: HTEle): void {
        let id: string = element.id.concat('_nav');
        let downOverlayEle: HTEle = buildTag('div', { className: CLS_OVERLAY + ' ' + CLS_DOWNOVERLAY });
        let clsDown: string = 'e-' + element.id.concat('_nav ' + CLS_VSCROLLNAV + ' ' + CLS_VSCROLLNAVDOWN);
        let downEle: HTEle = buildTag('div', { id: id.concat('down'), className: clsDown });
        let navItem: HTEle = buildTag('div', { className: CLS_NAVDOWNARROW + ' ' + CLS_NAVARROW + ' e-icons' });
        downEle.appendChild(navItem);
        let upEle: HTEle = buildTag('div', { className: CLS_OVERLAY + ' ' + CLS_UPOVERLAY });
        if (this.ieCheck) {
            downEle.classList.add('e-ie-align');
        }
        element.appendChild(downOverlayEle);
        element.appendChild(downEle);
        element.insertBefore(upEle, element.firstChild);
        this.eventBinding([downEle]);
    }
    private createNavIcon(element: HTEle): void {
        let id: string = element.id.concat('_nav');
        let clsDown: string = 'e-' + element.id.concat('_nav ' + CLS_VSCROLLNAV + ' ' + CLS_VSCROLLNAVDOWN);
        let nav: HTEle = buildTag('div', { id: id.concat('_down'), className: clsDown });
        nav.setAttribute('aria-disabled', 'false');
        let navItem: HTEle = buildTag('div', { className: CLS_NAVDOWNARROW + ' ' + CLS_NAVARROW + ' e-icons' });
        let clsUp: string = 'e-' + element.id.concat('_nav ' + CLS_VSCROLLNAV + ' ' + CLS_VSCROLLNAVUP);
        let navElement: HTEle = buildTag('div', { id: id.concat('_up'), className: clsUp + ' ' + CLS_DISABLE });
        navElement.setAttribute('aria-disabled', 'true');
        let navUpItem: HTEle = buildTag('div', { className: CLS_NAVUPARROW + ' ' + CLS_NAVARROW + ' e-icons' });
        navElement.appendChild(navUpItem);
        nav.appendChild(navItem);
        nav.setAttribute('tabindex', '0');
        element.appendChild(nav);
        element.insertBefore(navElement, element.firstChild);
        if (this.ieCheck) {
            nav.classList.add('e-ie-align');
            navElement.classList.add('e-ie-align');
        }
        this.eventBinding([nav, navElement]);
    }
    private onKeyPress(ev: KeyboardEvent): void {
        if (ev.key === 'Enter') {
            let timeoutFun: Function = () => {
                this.keyTimeout = true;
                this.eleScrolling(10, <HTEle>ev.target, true);
            };
            this.keyTimer = window.setTimeout(() => { timeoutFun(); }, 100);
        }
    }
    private onKeyUp(ev: KeyboardEvent): void {
        if (ev.key !== 'Enter') { return; }
        if (this.keyTimeout) {
            this.keyTimeout = false;
        } else {
            (<HTEle>ev.target).click();
        }
        clearTimeout(this.keyTimer);
    }
    private eventBinding(element: HTEle[]): void {
        [].slice.call(element).forEach((ele: HTEle) => {
            new Touch(ele, { tapHold: this.tabHoldHandler.bind(this), tapHoldThreshold: 500 });
            ele.addEventListener('keydown', this.onKeyPress.bind(this));
            ele.addEventListener('keyup', this.onKeyUp.bind(this));
            ele.addEventListener('mouseup', this.repeatScroll.bind(this));
            ele.addEventListener('touchend', this.repeatScroll.bind(this));
            ele.addEventListener('contextmenu', (e: Event) => {
                e.preventDefault();
            });
            EventHandler.add(ele, 'click', this.clickEventHandler, this);
        });
    }
    private repeatScroll(): void {
        clearInterval(this.timeout);
    }
    private tabHoldHandler(ev: TapEventArgs): void {
        let trgt: HTEle = ev.originalEvent.target as HTEle;
        trgt = this.contains(trgt, CLS_VSCROLLNAV) ? <HTEle>trgt.firstElementChild : trgt;
        let scrollDistance: number = 10;
        let timeoutFun: Function = () => {
            this.eleScrolling(scrollDistance, trgt, true);
        };
        this.timeout = window.setInterval(() => { timeoutFun(); }, 50);
    }
    private contains(element: HTEle, className: string): boolean {
        return element.classList.contains(className);
    }
    private eleScrolling(scrollDis: number, trgt: HTEle, isContinuous: boolean): void {
        let rootElement: HTEle = this.element;
        let classList: DOMTokenList = trgt.classList;
        if (classList.contains(CLS_VSCROLLNAV)) {
            classList = trgt.querySelector('.' + CLS_NAVARROW).classList;
        }
        if (classList.contains(CLS_NAVDOWNARROW)) {
            this.frameScrollRequest(scrollDis, 'add', isContinuous);
        } else if (classList.contains(CLS_NAVUPARROW)) {
            this.frameScrollRequest(scrollDis, '', isContinuous);
        }
    }
    private clickEventHandler(event: Event): void {
        this.eleScrolling(this.scrollStep, <HTEle>event.target, false);
    }
    private wheelEventHandler(e: WheelEvent): void {
        e.preventDefault();
        this.frameScrollRequest(this.scrollStep, (e.deltaY > 0 ? 'add' : ''), false);
    }

    private swipeHandler(e: SwipeEventArgs): void {
        let swipeElement: HTEle = this.scrollEle;
        let distance: number;
        if (e.velocity <= 1) {
            distance = e.distanceY / (e.velocity * 10);
        } else {
            distance = e.distanceY / e.velocity;
        }
        let start: number = 0.5;
        let animate: Function = () => {
            let step: number = Math.sin(start);
            if (step <= 0) {
                window.cancelAnimationFrame(step);
            } else {
                if (e.swipeDirection === 'Up') {
                    swipeElement.scrollTop += distance * step;
                } else if (e.swipeDirection === 'Down') {
                    swipeElement.scrollTop -= distance * step;
                }
                start -= 0.02;
                window.requestAnimationFrame(animate as FrameRequestCallback);
            }
        };
        animate();
    }

    private scrollUpdating(scrollVal: number, action: string): void {
        if (action === 'add') {
            this.scrollEle.scrollTop += scrollVal;
        } else {
            this.scrollEle.scrollTop -= scrollVal;
        }
    }

    private frameScrollRequest(scrollValue: number, action: string, isContinuous: boolean): void {
        let step: number = 10;
        if (isContinuous) {
            this.scrollUpdating(scrollValue, action);
            return;
        }
        if (!this.customStep) {
            [].slice.call(selectAll('.' + CLS_OVERLAY, this.element)).forEach((el: HTMLElement) => {
                scrollValue -= el.offsetHeight;
            });
        }
        let animate: Function = () => {
            if (scrollValue < step) {
                window.cancelAnimationFrame(step);
            } else {
                this.scrollUpdating(step, action);
                scrollValue -= step;
                window.requestAnimationFrame(animate as FrameRequestCallback);
            }
        };
        animate();
    }

    private touchHandler(e: ScrollEventArgs): void {
        let el: HTEle = this.scrollEle;
        let distance: number;
        distance = e.distanceY;
        if (e.scrollDirection === 'Up') {
            el.scrollTop = el.scrollTop + distance;
        } else if (e.scrollDirection === 'Down') {
            el.scrollTop = el.scrollTop - distance;
        }
    }
    private arrowDisabling(addDisableCls: HTEle, removeDisableCls: HTEle): void {
        if (this.isDevice) {
            let arrowEle: HTMLElement = isNullOrUndefined(addDisableCls) ? removeDisableCls : addDisableCls;
            let arrowIcon: HTMLElement = arrowEle.querySelector('.' + CLS_NAVARROW) as HTMLElement;
            if (isNullOrUndefined(addDisableCls)) {
                classList(arrowIcon, [CLS_NAVDOWNARROW], [CLS_NAVUPARROW]);
            } else {
                classList(arrowIcon, [CLS_NAVUPARROW], [CLS_NAVDOWNARROW]);
            }
        } else {
            addDisableCls.classList.add(CLS_DISABLE);
            addDisableCls.setAttribute('aria-disabled', 'true');
            addDisableCls.removeAttribute('tabindex');
            removeDisableCls.classList.remove(CLS_DISABLE);
            removeDisableCls.setAttribute('aria-disabled', 'false');
            removeDisableCls.setAttribute('tabindex', '0');
        }
        this.repeatScroll();
    }
    private scrollEventHandler(e: Event): void {
        let target: HTEle = <HTEle>e.target;
        let height: number = target.offsetHeight;
        let rootEle: HTEle = this.element;
        let navUpEle: HTEle = (<HTEle>this.element.querySelector('.' + CLS_VSCROLLNAVUP));
        let navDownEle: HTEle = (<HTEle>this.element.querySelector('.' + CLS_VSCROLLNAVDOWN));
        let upOverlay: HTEle = (<HTEle>this.element.querySelector('.' + CLS_UPOVERLAY));
        let downOverlay: HTEle = (<HTEle>this.element.querySelector('.' + CLS_DOWNOVERLAY));
        let scrollTop: number = target.scrollTop;
        if (scrollTop <= 0) {
            scrollTop = -scrollTop;
        }
        if (this.isDevice) {
            if (scrollTop < OVERLAY_MAXWID) {
                upOverlay.style.height = scrollTop + 'px';
            } else {
                upOverlay.style.height = '40px';
            }
            if ((target.scrollHeight - Math.ceil(height + scrollTop)) < OVERLAY_MAXWID) {
                downOverlay.style.height = (target.scrollHeight - Math.ceil(height + scrollTop)) + 'px';
            } else {
                downOverlay.style.height = '40px';
            }
        }
        if (scrollTop === 0) {
            this.arrowDisabling(navUpEle, navDownEle);
        } else if (Math.ceil(height + scrollTop + .1) >= target.scrollHeight) {
            this.arrowDisabling(navDownEle, navUpEle);
        } else {
            let disEle: HTEle = <HTEle>this.element.querySelector('.' + CLS_VSCROLLNAV + '.' + CLS_DISABLE);
            if (disEle) {
                disEle.classList.remove(CLS_DISABLE);
                disEle.setAttribute('aria-disabled', 'false');
                disEle.setAttribute('tabindex', '0');
            }
        }
    }
    /**
     * Gets called when the model property changes.The data that describes the old and new values of property that changed.
     * @param  {VScrollModel} newProp
     * @param  {VScrollModel} oldProp
     * @returns void
     * @private
     */
    public onPropertyChanged(newProp: VScrollModel, oldProp: VScrollModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'scrollStep':
                    this.setScrollState();
                    break;
                case 'enableRtl':
                    newProp.enableRtl ? this.element.classList.add(CLS_RTL) : this.element.classList.remove(CLS_RTL);
                    break;
            }
        }
    }
}
