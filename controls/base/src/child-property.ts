import { getValue, setValue, merge, isBlazor } from './util';
import { Base } from './base';

/**
 * To detect the changes for inner properties.
 * @private
 */
export class ChildProperty<T> {
    // tslint:disable-next-line:no-any
    private parentObj: any;
    private controlParent: ParentObject;
    private propName: string;
    private isParentArray: boolean;
    protected properties: { [key: string]: Object } = {};
    protected changedProperties: { [key: string]: Object } = {};
    protected childChangedProperties: { [key: string]: Object } = {};
    protected oldProperties: { [key: string]: Object } = {};
    // tslint:disable-next-line:no-empty
    protected finalUpdate: Function = (): void => { };
    private callChildDataBind: Function = getValue('callChildDataBind', Base);
    constructor(parent: T, propName: string, defaultValue: Object, isArray?: boolean) {
        this.parentObj = <T & ParentObject>parent;
        this.controlParent = this.parentObj.controlParent || this.parentObj;
        this.propName = propName;
        this.setProperties(defaultValue, true);
        this.isParentArray = isArray;
    }
    /**
     * Updates the property changes
     * @param {boolean} val 
     * @param {string} propName 
     * @returns {void}
     */
    private updateChange(val: boolean, propName: string): void {
        if (val === true) {
            this.parentObj.childChangedProperties[propName] = val;
        } else {
            delete this.parentObj.childChangedProperties[propName];
        }
        if (this.parentObj.updateChange) {
            this.parentObj.updateChange(val, this.parentObj.propName);
        }
    }
    /**
     * Updates time out duration
     */
    private updateTimeOut(): void {
        if (this.parentObj.updateTimeOut) {
            this.parentObj.finalUpdate();
            this.parentObj.updateTimeOut();

        } else {
            let changeTime: number = setTimeout(this.parentObj.dataBind.bind(this.parentObj));
            let clearUpdate: Function = () => {
                clearTimeout(changeTime);
            };
            this.finalUpdate = clearUpdate;
        }
    }
    /**
     * Clears changed properties 
     */
    private clearChanges(): void {
        this.finalUpdate();
        this.updateChange(false, this.propName);
        this.oldProperties = {};
        this.changedProperties = {};
    }
    /**
     * Set property changes
     * @param {Object} prop 
     * @param {boolean} muteOnChange 
     * {void}
     */
    protected setProperties(prop: Object, muteOnChange: boolean): void {
        if (muteOnChange === true) {
            merge(this, prop);
            this.updateChange(false, this.propName);
            this.clearChanges();
        } else {
            merge(this, prop);
        }
    }
    /**
     * Binds data
     */
    protected dataBind(): void {
        this.callChildDataBind(this.childChangedProperties, this);
        if (this.isParentArray) {
            let curIndex: number = (this.parentObj[this.propName] as Object[]).indexOf(this);
            if (Object.keys(this.changedProperties).length) {
                setValue(this.propName + '.' + curIndex, this.changedProperties, this.parentObj.changedProperties);
                setValue(this.propName + '.' + curIndex, this.oldProperties, this.parentObj.oldProperties);
            }
        } else {
            this.parentObj.changedProperties[this.propName] = this.changedProperties;
            this.parentObj.oldProperties[this.propName] = this.oldProperties;
        }
        this.clearChanges();
    }
    /**
     * Saves changes to newer values
     * @param {string} key 
     * @param {Object} newValue 
     * @param {Object} oldValue 
     * @returns {void}
     */
    protected saveChanges(key: string, newValue: Object, oldValue: Object): void {
        if (this.controlParent.isRendered && isBlazor()) {
            let ejsInterop: string = 'ejsInterop';
            if (window && window[ejsInterop]) {
                window[ejsInterop].childSaveChanges.call(this, key, newValue, oldValue);
            }
        }
        if (this.controlParent.isProtectedOnChange) { return; }
        this.oldProperties[key] = oldValue;
        this.changedProperties[key] = newValue;
        this.updateChange(true, this.propName);
        this.finalUpdate();
        this.updateTimeOut();
    }
}
/**
 * Interface for parent object
 */
interface ParentObject {
    saveChanges: (key: string, newValue: Object, oldValue: Object) => void;
    changedProperties: { [key: string]: Object };
    childChangedProperties: { [key: string]: Object };
    oldProperties: { [key: string]: Object };
    parentObj: { [key: string]: Object };
    updateChange: (val: boolean, prop: string) => void;
    propName: string;
    finalUpdate: Function;
    updateTimeOut: Function;
    dataBind: Function;
    isProtectedOnChange: boolean;
    controlParent: ParentObject;
    isRendered: boolean;
}