import { Collection, Property, ChildProperty } from '@syncfusion/ej2-base';import { ICustomOptr, FilterBarMode, FilterType, PredicateModel } from '@syncfusion/ej2-grids';import { FilterHierarchyMode } from '../enum';

/**
 * Interface for a class Predicate
 */
export interface PredicateModel {

    /**
   * Defines the field name of the filter column.

   */
    field?: string;

    /**
   * Defines the operator to filter records. The available operators and its supported data types are:
   * <table> 
   * <tr> 
   * <td colspan=1 rowspan=1> 
   * Operator<br/></td><td colspan=1 rowspan=1> 
   * Description<br/></td><td colspan=1 rowspan=1> 
   * Supported Types<br/></td></tr> 
   * <tr> 
   * <td colspan=1 rowspan=1> 
   * startswith<br/></td><td colspan=1 rowspan=1> 
   * Checks whether the value begins with the specified value.<br/></td><td colspan=1 rowspan=1> 
   * String<br/></td></tr> 
   * <tr> 
   * <td colspan=1 rowspan=1> 
   * endswith<br/></td><td colspan=1 rowspan=1> 
   * Checks whether the value ends with the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
   * <br/>String<br/></td></tr> 
   * <tr> 
   * <td colspan=1 rowspan=1> 
   * contains<br/></td><td colspan=1 rowspan=1> 
   * Checks whether the value contains the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
   * <br/>String<br/></td></tr> 
   * <tr> 
   * <td colspan=1 rowspan=1> 
   * equal<br/></td><td colspan=1 rowspan=1> 
   * Checks whether the value is equal to the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
   * <br/>String | Number | Boolean | Date<br/></td></tr> 
   * <tr> 
   * <td colspan=1 rowspan=1> 
   * notequal<br/></td><td colspan=1 rowspan=1> 
   * Checks for values that are not equal to the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
   * <br/>String | Number | Boolean | Date<br/></td></tr> 
   * <tr> 
   * <td colspan=1 rowspan=1> 
   * greaterthan<br/></td><td colspan=1 rowspan=1> 
   * Checks whether the value is greater than the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
   * Number | Date<br/></td></tr> 
   * <tr> 
   * <td colspan=1 rowspan=1> 
   * greaterthanorequal<br/></td><td colspan=1 rowspan=1> 
   * Checks whether the value is greater than or equal to the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
   * <br/>Number | Date<br/></td></tr> 
   * <tr> 
   * <td colspan=1 rowspan=1> 
   * lessthan<br/></td><td colspan=1 rowspan=1> 
   * Checks whether the value is less than the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
   * <br/>Number | Date<br/></td></tr> 
   * <tr> 
   * <td colspan=1 rowspan=1> 
   * lessthanorequal<br/></td><td colspan=1 rowspan=1> 
   * Checks whether the value is less than or equal to the specified value.<br/><br/></td><td colspan=1 rowspan=1> 
   * <br/>Number | Date<br/></td></tr> 
   * </table> 



   */
    operator?: string;

    /**
   * Defines the value used to filter records. 

   */
    value?: string | number | Date | boolean;

    /**
   * If match case set to true, then filter records with exact match or else  
   * filter records with case insensitive(uppercase and lowercase letters treated as same).  

   */
    matchCase?: boolean;

    /**
   * If ignoreAccent is set to true, then filter ignores the diacritic characters or accents while filtering.

   */
    ignoreAccent?: boolean;

    /**
   * Defines the relationship between one filter query and another by using AND or OR predicate.   

   */
    predicate?: string;

    /**

   * Defines the actual filter value for the filter column.  
   */
    actualFilterValue?: Object;

    /**

   * Defines the actual filter operator for the filter column.  
   */
    actualOperator?: Object;

    /**

   * Defines the type of the filter column.  
   */
    type?: string;

    /**

   * Defines the predicate of filter column.  
   */
    ejpredicate?: Object;

    /**

   * Defines the UID of filter column.  
   */
    uid?: string;

    /**

   * Defines the foreignKey availability in filtered columns.
   */
    isForeignKey?: boolean;

}

/**
 * Interface for a class FilterSettings
 */
export interface FilterSettingsModel {

    /**
     * Specifies the columns to be filtered at initial rendering of the TreeGrid. You can also get the columns that were currently filtered.

     */
    columns?: PredicateModel[];

    /**
     * Defines options for filtering type. The available options are
     * * `Menu` - Specifies the filter type as menu.
     * * `FilterBar` - Specifies the filter type as filterbar.

     */
    type?: FilterType;

    /**
     * Defines the filter bar modes. The available options are,
     * * `OnEnter`: Initiates filter operation after Enter key is pressed.
     * * `Immediate`: Initiates filter operation after a certain time interval. By default, time interval is 1500 ms.




     */
    mode?: FilterBarMode;

    /**
     * Shows or hides the filtered status message on the pager.

     */
    showFilterBarStatus?: boolean;

    /**
     * Defines the time delay (in milliseconds) in filtering records when the `Immediate` mode of filter bar is set.

     */
    immediateModeDelay?: number;

    /**
     * The `operators` is used to override the default operators in filter menu. This should be defined by type wise
     * (string, number, date and boolean). Based on the column type, this customize operator list will render in filter menu.
     *
     * > Check the `Filter Menu Operator` customization.

     */
    operators?: ICustomOptr;

    /**
     * If ignoreAccent set to true, then filter ignores the diacritic characters or accents while filtering.
     *
     * > Check the [`Diacritics`](../filtering/#diacritics) filtering.

     */
    ignoreAccent?: boolean;

    /**
     * Defines the filter types. The available options are,
     * `Parent`: Shows the filtered record with parent record.
     * `Child`: Shows the filtered record with child record. 
     * `Both` : shows the filtered record with both parent and child record.
     * `None` : Shows only filtered record.

     */
    hierarchyMode?: FilterHierarchyMode;

}