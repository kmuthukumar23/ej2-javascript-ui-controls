import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**  
 * Configuration that applies on each appointment field options of scheduler.
 */
export class FieldOptions extends ChildProperty<FieldOptions> {
    /** 
     * Denotes the field name to be mapped from the dataSource for every event fields.

     */
    @Property()
    public name: string;

    /** 
     * Assigns the specific default value to the fields, when no values are provided to those fields from dataSource.

     */
    @Property()
    public default: string;

    /** 
     * Assigns the label values to be displayed for the event editor fields.

     */
    @Property()
    public title: string;

    /**    
     * Defines the validation rules to be applied on the event fields within the event editor.
     * {% codeBlock src="schedule/validation-api/index.ts" %}{% endcodeBlock %}

     */
    @Property({})
    public validation: Object;

}
