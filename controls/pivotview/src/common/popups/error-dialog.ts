import { createElement, remove } from '@syncfusion/ej2-base';
import { PivotCommon } from '../base/pivot-common';
import * as cls from '../base/css-constant';
import { Dialog } from '@syncfusion/ej2-popups';
import { PivotFieldList } from '../../pivotfieldlist';

/**
 * `ErrorDialog` module to create error dialog.
 */

export class ErrorDialog {
    public parent: PivotCommon;

    public errorPopUp: Dialog;
    /**
     * Constructor for the dialog action.

     */
    constructor(parent: PivotCommon) {
        this.parent = parent;
    }

    /**
     * Creates the error dialog for the unexpected action done.
     * @method createErrorDialog
     * @return {void}

     */
    public createErrorDialog(title: string, description: string, target?: HTMLElement): void {
        let errorDialog: HTMLElement = createElement('div', {
            id: this.parent.parentID + '_ErrorDialog',
            className: cls.ERROR_DIALOG_CLASS
        });
        this.parent.element.appendChild(errorDialog);
        let zIndex: number = target ? Number(target.style.zIndex) + 1 : (this.parent.moduleName === 'pivotfieldlist' &&
            this.parent.renderMode === 'Popup' && this.parent.control ?
            (this.parent.control as PivotFieldList).dialogRenderer.fieldListDialog.zIndex + 1 : 1000001);
        this.errorPopUp = new Dialog({
            animationSettings: { effect: 'Fade' },
            allowDragging: false,
            header: title,
            content: description,
            isModal: true,
            visible: true,
            showCloseIcon: true,
            enableRtl: this.parent.enableRtl,
            width: 'auto',
            height: 'auto',
            zIndex: zIndex,
            position: { X: 'center', Y: 'center' },
            buttons: [
                {
                    click: this.closeErrorDialog.bind(this),
                    buttonModel: { cssClass: cls.OK_BUTTON_CLASS, content: this.parent.localeObj.getConstant('ok'), isPrimary: true }
                }
            ],
            closeOnEscape: true,
            target: document.body,
            close: this.removeErrorDialog.bind(this)
        });
        this.errorPopUp.isStringTemplate = true;
        this.errorPopUp.appendTo(errorDialog);
    }
    private closeErrorDialog(): void {
        this.errorPopUp.close();
    }
    private removeErrorDialog(): void {
        if (this.errorPopUp && !this.errorPopUp.isDestroyed) {
            this.errorPopUp.destroy();
        }
        if (document.getElementById(this.parent.parentID + '_ErrorDialog')) {
            remove(document.getElementById(this.parent.parentID + '_ErrorDialog'));
        }
    }
}