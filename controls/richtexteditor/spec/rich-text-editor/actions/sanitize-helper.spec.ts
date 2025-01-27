/**
 * Sanitize HTML helper renderer spec
 */
import { createElement, detach } from '@syncfusion/ej2-base';
import { RichTextEditor } from '../../../src/rich-text-editor/base/rich-text-editor';
import { renderRTE, destroy } from './../render.spec';
import { HtmlEditor, HTMLFormatter, BeforeSanitizeHtmlArgs } from "../../../src/rich-text-editor/index";

RichTextEditor.Inject(HtmlEditor);

describe('Sanitize Html Helper', () => {
    let innerHTML: string = `<div>
    <div id="inline-event" onmouseover='javascript:alert(1)'></div>
    <script>alert('hi')</script>
    <img src="javascript:alert('XSS Image');"/>
    <iframe src="http://evil.com/xss.html"></iframe>
    <input type="image" src="javascript:alert('XSS Image');"/>
    <link rel="stylesheet" href="javascript:alert('XSS CSS');"/>
    <div id="background" style="background-image: url(javascript:alert('XSS Background'))">BackGround Image</div>
    <div id="expression" style="width: expression(alert('XSS'));">Expression</div>
    <object type="text/x-scriptlet" data="http://hacker.com/xss.html">
    </object>
    </div>
    `;
    let encodeValue: string = `"&lt;div&gt;<br>    &lt;div id="inline-event" onmouseover='javascript:alert(1)'&gt;&lt;/div&gt;<br>    &lt;script&gt;alert('hi')&lt;/script&gt;<br>    &lt;img src="javascript:alert('XSS Image');"/&gt;<br>    &lt;iframe src="http://evil.com/xss.html"&gt;&lt;/iframe&gt;<br>    &lt;input type="image" src="javascript:alert('XSS Image');"/&gt;<br>    &lt;link rel="stylesheet" href="javascript:alert('XSS CSS');"/&gt;<br>    &lt;div id="background" style="background-image: url(javascript:alert('XSS Background'))"&gt;BackGround Image&lt;/div&gt;<br>    &lt;div id="expression" style="width: expression(alert('XSS'));"&gt;Expression&lt;/div&gt;<br>    &lt;object type="text/x-scriptlet" data="http://hacker.com/xss.html"&gt;<br>    &lt;/object&gt;<br>    &lt;/div&gt;"`;
    describe('xss attack while component initial rendering : ', () => {
        let rteObj: RichTextEditor;

        beforeAll(() => {
            rteObj = renderRTE({
                value: innerHTML
            });
        });

        it('check the script element', () => {
            expect(rteObj.inputElement.querySelectorAll('script').length).toBe(0);
        });
        it('check the iframe element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('iframe').length).toBe(0);
        });
        it('check the image element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('img').length).toBe(0);
        });
        it('check the link element while href set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('link').length).toBe(0);
        });
        it('check the object element while attribute set as type="text/x-scriptlet"', () => {
            expect(rteObj.inputElement.querySelectorAll('object').length).toBe(0);
        });
        it('check the input element while set the type="image" and srce as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('input').length).toBe(0);
        });

        it('check the div element attribute while background image style set as wrong', () => {
            expect(rteObj.inputElement.querySelector('#background').hasAttribute('style')).toBe(false);
            expect(rteObj.inputElement.querySelector('#expression').hasAttribute('style')).toBe(false);
        });

        it('check the div element attribute while inline event bind', () => {
            expect(rteObj.inputElement.querySelector('#inline-event').hasAttribute('onmouseover')).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    })

    describe('xss attack while dynamic set the value property : ', () => {
        let rteObj: RichTextEditor;

        beforeAll(() => {
            rteObj = renderRTE({
            });
            rteObj.value = innerHTML;
            rteObj.dataBind();
        });

        it('check the script element', () => {
            expect(rteObj.inputElement.querySelectorAll('script').length).toBe(0);
        });
        it('check the iframe element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('iframe').length).toBe(0);
        });
        it('check the image element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('img').length).toBe(0);
        });
        it('check the link element while href set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('link').length).toBe(0);
        });
        it('check the object element while attribute set as type="text/x-scriptlet"', () => {
            expect(rteObj.inputElement.querySelectorAll('object').length).toBe(0);
        });
        it('check the input element while set the type="image" and srce as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('input').length).toBe(0);
        });

        it('check the div element attribute while background image style set as wrong', () => {
            expect(rteObj.inputElement.querySelector('#background').hasAttribute('style')).toBe(false);
            expect(rteObj.inputElement.querySelector('#expression').hasAttribute('style')).toBe(false);
        });

        it('check the div element attribute while inline event bind', () => {
            expect(rteObj.inputElement.querySelector('#inline-event').hasAttribute('onmouseover')).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    })

    describe('xss attack while component initial rendering with enableHtmlEncode: ', () => {
        let rteObj: RichTextEditor;

        beforeAll(() => {
            rteObj = renderRTE({
                value: encodeValue,
                enableHtmlEncode: true
            });
        });

        it('check the script element', () => {
            expect(rteObj.inputElement.querySelectorAll('script').length).toBe(0);
        });
        it('check the iframe element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('iframe').length).toBe(0);
        });
        it('check the image element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('img').length).toBe(0);
        });
        it('check the link element while href set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('link').length).toBe(0);
        });
        it('check the object element while attribute set as type="text/x-scriptlet"', () => {
            expect(rteObj.inputElement.querySelectorAll('object').length).toBe(0);
        });
        it('check the input element while set the type="image" and srce as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('input').length).toBe(0);
        });

        it('check the div element attribute while background image style set as wrong', () => {
            expect(rteObj.inputElement.querySelector('#background').hasAttribute('style')).toBe(false);
            expect(rteObj.inputElement.querySelector('#expression').hasAttribute('style')).toBe(false);
        });

        it('check the div element attribute while inline event bind', () => {
            expect(rteObj.inputElement.querySelector('#inline-event').hasAttribute('onmouseover')).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    })

    describe('xss attack while dynamic set the value property with enableHtmlEncode : ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                enableHtmlEncode: true
            });
            rteObj.value = encodeValue;
            rteObj.dataBind();
        });

        it('check the script element', () => {
            expect(rteObj.inputElement.querySelectorAll('script').length).toBe(0);
        });
        it('check the iframe element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('iframe').length).toBe(0);
        });
        it('check the image element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('img').length).toBe(0);
        });
        it('check the link element while href set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('link').length).toBe(0);
        });
        it('check the object element while attribute set as type="text/x-scriptlet"', () => {
            expect(rteObj.inputElement.querySelectorAll('object').length).toBe(0);
        });
        it('check the input element while set the type="image" and srce as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('input').length).toBe(0);
        });

        it('check the div element attribute while background image style set as wrong', () => {
            expect(rteObj.inputElement.querySelector('#background').hasAttribute('style')).toBe(false);
            expect(rteObj.inputElement.querySelector('#expression').hasAttribute('style')).toBe(false);
        });

        it('check the div element attribute while inline event bind', () => {
            expect(rteObj.inputElement.querySelector('#inline-event').hasAttribute('onmouseover')).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    })

    describe('xss attack while source code to preview : ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['SourceCode']
                }
            });
            let trgEle: HTMLElement = <HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[0];
            (trgEle.firstElementChild as HTMLElement).click();
            let textArea: HTMLTextAreaElement = rteObj.element.querySelector('.e-rte-srctextarea');
            textArea.value = innerHTML;
            trgEle = <HTMLElement>rteObj.element.querySelectorAll(".e-toolbar-item")[0];
            (trgEle.firstElementChild as HTMLElement).click();
        });

        it('check the script element', () => {
            expect(rteObj.inputElement.querySelectorAll('script').length).toBe(0);
        });
        it('check the iframe element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('iframe').length).toBe(0);
        });
        it('check the image element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('img').length).toBe(0);
        });
        it('check the link element while href set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('link').length).toBe(0);
        });
        it('check the object element while attribute set as type="text/x-scriptlet"', () => {
            expect(rteObj.inputElement.querySelectorAll('object').length).toBe(0);
        });
        it('check the input element while set the type="image" and srce as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('input').length).toBe(0);
        });

        it('check the div element attribute while background image style set as wrong', () => {
            expect(rteObj.inputElement.querySelector('#background').hasAttribute('style')).toBe(false);
            expect(rteObj.inputElement.querySelector('#expression').hasAttribute('style')).toBe(false);
        });

        it('check the div element attribute while inline event bind', () => {
            expect(rteObj.inputElement.querySelector('#inline-event').hasAttribute('onmouseover')).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    })

    describe('xss attack while executeCommand insertHTML : ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
            });
            rteObj.focusIn();
            rteObj.executeCommand('insertHTML', innerHTML);
        });

        it('check the script element', () => {
            expect(rteObj.inputElement.querySelectorAll('script').length).toBe(0);
        });
        it('check the iframe element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('iframe').length).toBe(0);
        });
        it('check the image element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('img').length).toBe(0);
        });
        it('check the link element while href set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('link').length).toBe(0);
        });
        it('check the object element while attribute set as type="text/x-scriptlet"', () => {
            expect(rteObj.inputElement.querySelectorAll('object').length).toBe(0);
        });
        it('check the input element while set the type="image" and srce as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('input').length).toBe(0);
        });

        it('check the div element attribute while background image style set as wrong', () => {
            expect(rteObj.inputElement.querySelector('#background').hasAttribute('style')).toBe(false);
            expect(rteObj.inputElement.querySelector('#expression').hasAttribute('style')).toBe(false);
        });

        it('check the div element attribute while inline event bind', () => {
            expect(rteObj.inputElement.querySelector('#inline-event').hasAttribute('onmouseover')).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    })


    describe('prevent the xss attack in sanitizeHtml method : ', () => {
        let rteObj: RichTextEditor;
        let value: string;
        beforeAll(() => {
            rteObj = renderRTE({
            });
            value = rteObj.sanitizeHtml(innerHTML);
            rteObj.inputElement.innerHTML = value;
        });

        it('check the script element', () => {
            expect(rteObj.inputElement.querySelectorAll('script').length).toBe(0);
        });
        it('check the iframe element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('iframe').length).toBe(0);
        });
        it('check the image element while src set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('img').length).toBe(0);
        });
        it('check the link element while href set as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('link').length).toBe(0);
        });
        it('check the object element while attribute set as type="text/x-scriptlet"', () => {
            expect(rteObj.inputElement.querySelectorAll('object').length).toBe(0);
        });
        it('check the input element while set the type="image" and srce as wrong', () => {
            expect(rteObj.inputElement.querySelectorAll('input').length).toBe(0);
        });

        it('check the div element attribute while background image style set as wrong', () => {
            expect(rteObj.inputElement.querySelector('#background').hasAttribute('style')).toBe(false);
            expect(rteObj.inputElement.querySelector('#expression').hasAttribute('style')).toBe(false);
        });

        it('check the div element attribute while inline event bind', () => {
            expect(rteObj.inputElement.querySelector('#inline-event').hasAttribute('onmouseover')).toBe(false);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    })

    describe('xss attack while executeCommand createLink : ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
            });
            rteObj.focusIn();
            let range = rteObj.formatter.editorManager.nodeSelection.getRange(document);
            let selection = rteObj.formatter.editorManager.nodeSelection.save(range, document);
            rteObj.executeCommand('createLink', {
                selection: selection,
                selectParent: [],
                url: 'javascript:alert("XSS")',
                text: "Google"
            })
        });

        it('check the anchor tag href', () => {
            expect((rteObj.inputElement.querySelector('a') as HTMLElement).getAttribute('href') === '').toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    })

    describe('xss attack while executeCommand image : ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
            });
            rteObj.focusIn();
            let range = rteObj.formatter.editorManager.nodeSelection.getRange(document);
            let selection = rteObj.formatter.editorManager.nodeSelection.save(range, document);
            rteObj.executeCommand('insertImage', {
                selection: selection,
                selectParent: null,
                url: 'javascript:alert("XSS")'
            })
        });

        it('check the image tag src', () => {
            expect((rteObj.inputElement.querySelector('img') as HTMLElement).getAttribute('src') === '').toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    })

    describe('prevent xss attack via helper : ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<script>alert(1)</script>',
                beforeSanitizeHtml: (args: BeforeSanitizeHtmlArgs) => {
                    args.helper = (value: string) => {
                        args.cancel = true;
                        let temp: HTMLElement = document.createElement('div');
                        temp.innerHTML = value;
                        detach(temp.querySelector('script'));
                        return temp.innerHTML;
                    }
                }
            });

        });

        it('check the script element', () => {
            expect((rteObj.inputElement.querySelectorAll('script')).length).toBe(0);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    })

    describe('prevent xss attack by add the selectors : ', () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                value: '<style>bod{width:100px;}</style>',
                beforeSanitizeHtml: (args: BeforeSanitizeHtmlArgs) => {
                    args.selectors.tags.push('style');
                }
            });

        });

        it('check the style element', () => {
            expect((rteObj.inputElement.querySelectorAll('script')).length).toBe(0);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    })

});