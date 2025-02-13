import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**  
 * Configures the paging behavior of the Grid.  
 */
export class PageSettings extends ChildProperty<PageSettings> {
    /** 
     * Defines the number of records to be displayed per page.


     */
    @Property(12)
    public pageSize: number;

    /** 
     * Defines the number of pages to be displayed in the pager container.  


     */
    @Property(8)
    public pageCount: number;

    /** 
     * Defines the current page number of the pager.


     */
    @Property(1)
    public currentPage: number;

    /** 

     * Gets the total records count of the Grid. 

     */
    @Property()
    public totalRecordsCount: number;

    /**   
     * If `enableQueryString` set to true,   
     * then it pass current page information as a query string along with the URL while navigating to other page.  

     */
    @Property(false)
    public enableQueryString: boolean;

    /**
     * If `pageSizes` set to true or Array of values,
     * It renders DropDownList in the pager which allow us to select pageSize from DropDownList.      

     */
    @Property(false)
    public pageSizes: boolean | (number | string)[];

    /**    
     * Defines the template which renders customized elements in pager instead of default elements.     
     * It accepts either [template string](../../common/template-engine/) or HTML element ID.   

     */
    @Property(null)
    public template: string;

}
