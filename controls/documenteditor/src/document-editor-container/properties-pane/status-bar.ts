import { DocumentEditor, ViewChangeEventArgs } from '../../document-editor/index';
import { createElement, KeyboardEventArgs, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DropDownButton, ItemModel, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { DocumentEditorContainer } from '../document-editor-container';
/**
 * Represents document editor status bar.
 * @private
 */
export class StatusBar {
    private container: DocumentEditorContainer;
    private statusBarDiv: HTMLElement;
    private pageCount: HTMLElement;
    private zoom: DropDownButton;
    private pageNumberLabel: HTMLElement;
    private editablePageNumber: HTMLElement;
    public startPage: number = 1;
    public localObj: L10n;
    private spellCheckButton: DropDownButton;
    private currentLanguage: number;
    private allowSuggestion: boolean;

    get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }
    get editorPageCount(): number {
        return this.documentEditor.pageCount;
    }
    constructor(parentElement: HTMLElement, docEditor: DocumentEditorContainer) {
        this.statusBarDiv = parentElement;
        this.container = docEditor;
        this.initializeStatusBar();
        this.wireEvents();
    }
    private initializeStatusBar = (): void => {
        let isRtl: boolean = this.container.enableRtl;
        this.documentEditor.enableSpellCheck = (this.container.enableSpellCheck) ? true : false;
        // tslint:disable-next-line:max-line-length
        this.localObj = new L10n('documenteditorcontainer', this.container.defaultLocale, this.container.locale);
        // tslint:disable-next-line:max-line-length
        let styles: string = 'padding-top:8px;';
        styles += isRtl ? 'padding-right:16px' : 'padding-left:16px';
        // tslint:disable-next-line:max-line-length
        let div: HTMLElement = createElement('div', { className: (this.container.enableSpellCheck) ? 'e-de-ctnr-pg-no' : 'e-de-ctnr-pg-no-spellout', styles: styles });
        this.statusBarDiv.appendChild(div);
        let label: HTMLElement = createElement('label');
        label.textContent = this.localObj.getConstant('Page') + ' ';
        div.appendChild(label);
        // tslint:disable-next-line:max-line-length
        this.pageNumberLabel = createElement('label', { styles: 'text-transform:capitalize;white-space:pre;overflow:hidden;user-select:none;cursor:text;height:17px;max-width:150px' });
        this.editablePageNumber = createElement('div', { styles: 'display: inline-flex;height: 17px;padding: 0px 4px;', className: 'e-input e-de-pagenumber-text' });
        this.editablePageNumber.appendChild(this.pageNumberLabel);
        if (isRtl) {
            label.style.marginLeft = '6px';
            this.editablePageNumber.style.marginLeft = '6px';
        } else {
            label.style.marginRight = '6px';
            this.editablePageNumber.style.marginRight = '6px';
        }
        this.updatePageNumber();
        div.appendChild(this.editablePageNumber);
        // tslint:disable-next-line:max-line-length
        this.editablePageNumber.setAttribute('title', this.localObj.getConstant('The current page number in the document. Click or tap to navigate specific page.'));
        let label1: HTMLElement = createElement('label', { styles: 'width:16px' });
        label1.textContent = ' ' + this.localObj.getConstant('of') + ' ';
        div.appendChild(label1);
        this.pageCount = createElement('label');
        div.appendChild(this.pageCount);
        this.updatePageCount();
        if (this.documentEditor.enableSpellCheck) {
            let verticalLine: HTMLElement = createElement('div', { className: 'e-de-statusbar-seperator' });
            this.statusBarDiv.appendChild(verticalLine);
            let spellCheckBtn: HTMLButtonElement = this.addSpellCheckElement();
            this.spellCheckButton.appendTo(spellCheckBtn);
        }
        let zoomBtn: HTMLButtonElement = createElement('button', {
            // tslint:disable-next-line:max-line-length
            className: (this.container.enableSpellCheck) ? 'e-de-statusbar-zoom-spell' : 'e-de-statusbar-zoom', attrs: { type: 'button' }
        }) as HTMLButtonElement;
        this.statusBarDiv.appendChild(zoomBtn);
        zoomBtn.setAttribute('title', 'Zoom level. Click or tap to open the Zoom options.');
        let items: ItemModel[] = [
            {
                text: '200%',
            },
            {
                text: '175%',
            },
            {
                text: '150%',
            },
            {
                text: '125%',
            },
            {
                text: '100%',
            },
            {
                text: '75%',
            },
            {
                text: '50%',
            },
            {
                text: '25%',
            },
            {
                separator: true
            },
            {
                text: this.localObj.getConstant('Fit one page')
            },
            {
                text: this.localObj.getConstant('Fit page width'),
            },
        ];
        // tslint:disable-next-line:max-line-length
        this.zoom = new DropDownButton({ content: '100%', items: items, enableRtl: this.container.enableRtl, select: this.onZoom }, zoomBtn);
    }
    private addSpellCheckElement(): HTMLButtonElement {
        let spellCheckBtn: HTMLButtonElement = createElement('button', {
            className: 'e-de-statusbar-spellcheck'
        }) as HTMLButtonElement;
        this.statusBarDiv.appendChild(spellCheckBtn);
        spellCheckBtn.setAttribute('title', 'Spell Checker options');
        let spellCheckItems: ItemModel[] = [
            {
                text: 'Spell Check',
            },
            {
                text: 'Underline errors',
            },
        ];
        // tslint:disable-next-line:max-line-length
        this.spellCheckButton = new DropDownButton({
            content: 'Spelling', items: spellCheckItems, enableRtl: this.container.enableRtl, select: this.onSpellCheck,
            beforeItemRender: (args: MenuEventArgs) => {
                args.element.innerHTML = '<span></span>' + args.item.text;
                if (isNullOrUndefined(this.currentLanguage)) {
                    this.currentLanguage = this.documentEditor.spellChecker.languageID;
                }
                if (isNullOrUndefined(this.allowSuggestion)) {
                    this.allowSuggestion = this.documentEditor.spellChecker.allowSpellCheckAndSuggestion;
                }
                let span: HTMLElement = args.element.children[0] as HTMLElement;
                if (args.item.text === 'Spell Check' && this.documentEditor.enableSpellCheck) {
                    span.style.marginRight = '10px';
                    span.setAttribute('class', 'e-de-selected-spellcheck-item');
                    // tslint:disable-next-line:max-line-length
                } else if (args.item.text === 'Underline errors' && this.documentEditor.enableSpellCheck && !this.documentEditor.spellChecker.removeUnderline) {
                    span.style.marginRight = '10px';
                    span.setAttribute('class', 'e-de-selected-underline-item');
                } else {
                    span.style.marginRight = '25px';
                    (args.element.children[0] as HTMLElement).classList.remove('e-de-selected-spellcheck-item');
                    (args.element.children[0] as HTMLElement).classList.remove('e-de-selected-underline-item');
                }
            }
        });

        return spellCheckBtn;
    }
    private onZoom = (args: MenuEventArgs) => {
        this.setZoomValue(args.item.text);
        this.updateZoomContent();
    }
    private onSpellCheck = (args: MenuEventArgs) => {
        this.setSpellCheckValue(args.item.text, args.element);
    }
    public updateZoomContent = (): void => {
        this.zoom.content = Math.round(this.documentEditor.zoomFactor * 100) + '%';
    }
    private setSpellCheckValue = (text: string, element: HTMLElement): void => {
        this.spellCheckButton.content = 'Spelling';
        if (text.match(this.localObj.getConstant('Spell Check'))) {
            this.documentEditor.enableSpellCheck = (this.documentEditor.enableSpellCheck) ? false : true;
            setTimeout(() => {
                if (this.documentEditor.enableSpellCheck) {
                    this.documentEditor.spellChecker.languageID = this.currentLanguage;
                    this.documentEditor.spellChecker.allowSpellCheckAndSuggestion = this.allowSuggestion;
                    this.documentEditor.viewer.triggerElementsOnLoading = true;
                    this.documentEditor.viewer.triggerSpellCheck = true;
                }
                this.documentEditor.editor.reLayout(this.documentEditor.viewer.selection);
            /* tslint:disable */
            }, 50);
             /* tslint:enable */
            this.documentEditor.viewer.triggerSpellCheck = false;
            this.documentEditor.viewer.triggerElementsOnLoading = false;
            // tslint:disable-next-line:max-line-length
        } else if (text.match(this.localObj.getConstant('Underline errors'))) {
            if (this.documentEditor.enableSpellCheck) {
                // tslint:disable-next-line:max-line-length
                this.documentEditor.spellChecker.removeUnderline = (this.documentEditor.spellChecker.removeUnderline) ? false : true;
                this.documentEditor.editor.reLayout(this.documentEditor.viewer.selection);
            }
        }
    }
    private setZoomValue = (text: string): void => {
        if (text.match(this.localObj.getConstant('Fit one page'))) {
            this.documentEditor.fitPage('FitOnePage');
        } else if (text.match(this.localObj.getConstant('Fit page width'))) {
            this.documentEditor.fitPage('FitPageWidth');
        } else {
            this.documentEditor.zoomFactor = parseInt(text, 0) / 100;
        }
    }
    /**
     * Updates page count.
     */
    public updatePageCount = (): void => {
        this.pageCount.textContent = this.editorPageCount.toString();
    }
    /**
     * Updates page number.
     */
    public updatePageNumber = (): void => {
        this.pageNumberLabel.textContent = this.startPage.toString();
    }
    public updatePageNumberOnViewChange = (args: ViewChangeEventArgs): void => {
        if (this.documentEditor.selection
            && this.documentEditor.selection.startPage >= args.startPage && this.documentEditor.selection.startPage <= args.endPage) {
            this.startPage = this.documentEditor.selection.startPage;
        } else {
            this.startPage = args.startPage;
        }
        this.updatePageNumber();
    }
    private wireEvents = (): void => {
        this.editablePageNumber.addEventListener('keydown', (e: KeyboardEventArgs) => {
            if (e.which === 13) {
                e.preventDefault();
                let pageNumber: number = parseInt(this.editablePageNumber.textContent, 0);
                if (pageNumber > this.editorPageCount) {
                    this.updatePageNumber();
                } else {
                    if (this.documentEditor.selection) {
                        this.documentEditor.selection.goToPage(parseInt(this.editablePageNumber.textContent, 0));
                    } else {
                        this.documentEditor.scrollToPage(parseInt(this.editablePageNumber.textContent, 0));
                    }
                }
                this.editablePageNumber.contentEditable = 'false';
                if (this.editablePageNumber.textContent === '') {
                    this.updatePageNumber();
                }
            }
            if (e.which > 64) {
                e.preventDefault();
            }
        });
        this.editablePageNumber.addEventListener('blur', (): void => {
            if (this.editablePageNumber.textContent === '' || parseInt(this.editablePageNumber.textContent, 0) > this.editorPageCount) {
                this.updatePageNumber();
            }
            this.editablePageNumber.contentEditable = 'false';
            this.editablePageNumber.style.border = 'none';
        });
        this.editablePageNumber.addEventListener('focus', (): void => {
            this.editablePageNumber.style.border = '1px solid #F1F1F1';
        });
        this.editablePageNumber.addEventListener('click', (): void => {
            this.updateDocumentEditorPageNumber();
        });
    }
    private updateDocumentEditorPageNumber = (): void => {
        this.editablePageNumber.contentEditable = 'true';
        this.editablePageNumber.focus();
        window.getSelection().selectAllChildren(this.editablePageNumber);
    }
    private destroy(): void {
        this.container = undefined;
        if (this.zoom) {
            this.zoom.destroy();
            this.zoom = undefined;
        }
    }
}