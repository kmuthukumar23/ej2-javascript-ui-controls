import { Property, Complex, Collection, ChildProperty, NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';
import { IDataSet, IDataOptions, IFieldOptions, IFilter, ISort, ICalculatedFieldSettings } from '../../base/engine';
import { IDrillOptions, IValueSortSettings, IFormatSettings, IConditionalFormatSettings, IGroupSettings } from '../../base/engine';
import { SummaryTypes, Sorting, FilterType, Operators, Condition, DateGroup, GroupType, ProviderType } from '../../base/types';
import { IStyle } from '../../base/engine';
import { FieldOptionsModel, FilterModel, SortModel, FormatSettingsModel, GroupSettingsModel } from './datasourcesettings-model';
import { DrillOptionsModel, ValueSortSettingsModel, CalculatedFieldSettingsModel } from './datasourcesettings-model';
import { DataManager } from '@syncfusion/ej2-data';
import { ConditionalFormatSettingsModel } from './datasourcesettings-model';

/** 
 * Configures the fields in dataSource. 
 */
export class FieldOptions extends ChildProperty<FieldOptions> implements IFieldOptions {

    /**
     * It allows to set field name.
     */
    @Property()
    public name: string;

    /**
     * It allows to set field caption.
     */
    @Property()
    public caption: string;

    /**
     * It allows to set the summary type of the field. The available types are,
     * * `Sum`: The summary cells calculated by the sum of its cells. 
     * * `Count`: The summary cells calculated by the count of its cells.
     * * `Min`: The summary cells shows the value which is the minimum value of its cells. 
     * * `Max`: The summary cells shows the value which is the maximum value of its cells.
     * * `Percentage`: The summary cells displays in percentage format.
     * * `Avg`: The summary cells calculated by the average of its cells.
     * * `CalculatedField`: It should set to include calculated fields.

     */
    @Property('Sum')
    public type: SummaryTypes;

    /**
     * It allows to set the axis to render the field in it.
     */
    @Property()
    public axis: string;

    /**
     * It allows to display all the items of its field even any items haven't data in its row/column intersection in data source.

     */
    @Property(false)
    public showNoDataItems: boolean;

    /**
     * It allows to set the base field to aggregate the values.
     */
    @Property()
    public baseField: string;

    /**
     * It allows to set the base item to aggregate the values.
     */
    @Property()
    public baseItem: string;

    /**
     * It allows to disable or enable sub totals in row/column axis.

     */
    @Property(true)
    public showSubTotals: boolean;

    /**
     * It allows to show a field has named set type.
     * Note: This option is applicable only for OLAP data source.

     */
    @Property(false)
    public isNamedSet: boolean;

    /**
     * It allows to show a field has calculated member type.
     * Note: This option is applicable only for OLAP data source.

     */
    @Property(false)
    public isCalculatedField: boolean;
}

export class FieldListFieldOptions extends FieldOptions { }

/** 
 * Configures the style settings. 
 */
export class Style extends ChildProperty<Style> implements IStyle {
    /**
     * It allows to set the background color.
     */
    @Property()
    public backgroundColor: string;

    /**
     * It allows to set the color.
     */
    @Property()
    public color: string;

    /**
     * It allows to set the font family.
     */
    @Property()
    public fontFamily: string;

    /**
     * It allows to set the font size.
     */
    @Property()
    public fontSize: string;
}

/** 
 * Configures the filter settings. 
 */
export class Filter extends ChildProperty<Filter> implements IFilter {

    /**
     * It allows to set the field name.
     */
    @Property()
    public name: string;

    /**
     * It allows to set the filter type.

     */
    @Property('Include')
    public type: FilterType;

    /**
     * It allows to set the filter items.
     */
    @Property()
    public items: string[];

    /**
     * It allows to set the filter conditions to the field.

     */
    @Property('DoesNotEquals')
    public condition: Operators;

    /**
     * It allows to set filter operand value for condition evaluation with single label.
     */
    @Property()
    public value1: string | Date;

    /**
     * It allows to set filter operand value for between condition evaluation.
     */
    @Property()
    public value2: string | Date;

    /**
     * It allows to set value field for evaluation using conditions and operands.
     */
    @Property()
    public measure: string;

    /**
     * It allows to set level count of the field to fetch data from the cube.
     * Note: This option is applicable only for user-defined hierarchies.

     */
    @Property(1)
    public levelCount: number;

    /**
     * It allows to set level name of a dimension, where the filtering settings to be applied.
     * Note: This option is applicable only for user-defined hierarchies.
     */
    @Property()
    public selectedField: string;
}

/** 
 * Configures the conditional format settings.
 */
export class ConditionalFormatSettings extends ChildProperty<ConditionalFormatSettings> implements IConditionalFormatSettings {

    /**
     * It allows to set the field name to apply conditional format.
     */
    @Property()
    public measure: string;

    /**
     * It allows to set the label name to apply conditional format.
     */
    @Property()
    public label: string;

    /**
     * It allows to set the conditions to apply format.
     */
    @Property()
    public conditions: Condition;

    /**
     * It allows to set the value1 to apply format.
     */
    @Property()
    public value1: number;

    /**
     * It allows to set the value2 to apply format.
     */
    @Property()
    public value2: number;

    /**
     * It allows to set the style to apply.
     */
    @Property()
    public style: IStyle;

    /**
     * It allows to apply conditional formatting to grand total
     */
    @Property(true)
    public applyGrandTotals: boolean;
}

/**
 * Configures the sort settings. 
 */
export class Sort extends ChildProperty<Sort> implements ISort {

    /**
     * It allows to set the field name to sort.
     */
    @Property()
    public name: string;

    /**
     * It allows to set the sort order. The types are,
     * * `Ascending`: It allows to display the field members in ascending order. 
     * * `Descending`: It allows to display the field members in descending order.
     * * `None`: It allows to display the field members based on JSON order. 

     */
    @Property('Ascending')
    public order: Sorting;
}

/** 
 * Configures the format settings of value fields. 
 */
export class FormatSettings extends ChildProperty<FormatSettings> implements NumberFormatOptions, DateFormatOptions, IFormatSettings {

    /**
     * It allows to set the field name to apply format settings.
     */
    @Property()
    public name: string;

    /**
     * It allows to specify minimum fraction digits in formatted value.
     */
    @Property()
    public minimumFractionDigits: number;

    /**
     * It allows to specify maximum fraction digits in formatted value.
     */
    @Property()
    public maximumFractionDigits: number;

    /**
     * It allows to specify minimum significant digits in formatted value.
     */
    @Property()
    public minimumSignificantDigits: number;

    /**
     * It allows to specify maximum significant digits in formatted value.
     */
    @Property()
    public maximumSignificantDigits: number;

    /**
     * It allows to specify whether to use grouping or not in formatted value,

     */
    @Property(true)
    public useGrouping: boolean;

    /**
     * It allows to specify the skeleton for perform formatting.
     */
    @Property()
    public skeleton: string;

    /**
     * It allows to specify the type of date formatting either date, dateTime or time.
     */
    @Property()
    public type: string;

    /**
     * It allows to specify the currency code to be used for formatting.
     */
    @Property()
    public currency: string;

    /**
     * It allows to specify minimum integer digits in formatted value.
     */
    @Property()
    public minimumIntegerDigits: number;

    /**
     * It allows to specify custom number format for formatting.
     */
    @Property()
    public format: string;
}

/** 
 * Configures the group settings of fields. 
 */
export class GroupSettings extends ChildProperty<GroupSettings> implements IGroupSettings {

    /**
     * It allows to set the field name to apply group settings.
     */
    @Property()
    public name: string;

    /**
     * It allows to set the group interval for group field.
     */
    @Property()
    public groupInterval: DateGroup[];

    /**
     * It allows to set the start time of group field.
     */
    @Property()
    public startingAt: string | Date | number;

    /**
     * It allows to set the end time of group field.
     */
    @Property()
    public endingAt: string | Date | number;

    /**
     * It allows to set the type of field.

     */
    @Property('Date')
    public type: GroupType;

    /**
     * It allows to set the interval range of group field.
     */
    @Property()
    public rangeInterval: number;
}
/** 
 * Configures the calculatedfields settings. 
 */
export class CalculatedFieldSettings extends ChildProperty<CalculatedFieldSettings> implements ICalculatedFieldSettings {

    /**
     * It allows to set the field name to sort.
     */
    @Property()
    public name: string;

    /**
     * It allows to set the formula for calculated fields. 
     */
    @Property()
    public formula: string;

    /**
     * It allows to set hierarchy unique name, that used to create calculated member.
     * Note: This option is applicable only for OLAP data source.
     */
    @Property()
    public hierarchyUniqueName: string;

    /**
     * It allows to set format string that used to create calculated member.
     * Note: This option is applicable only for OLAP data source.
     */
    @Property()
    public formatString: string;
}

/** 
 * Configures drilled state of field members. 
 */
export class DrillOptions extends ChildProperty<DrillOptions> implements IDrillOptions {

    /**
     * It allows to set the field name whose members to be drilled.
     */
    @Property()
    public name: string;

    /**
     * It allows to set the members to be drilled.
     */
    @Property()
    public items: string[];

    /**
     * It allows to set the delimiter.
     */
    @Property()
    public delimiter: string;

}

/** 
 * Configures value sort settings. 
 */
export class ValueSortSettings extends ChildProperty<ValueSortSettings> implements IValueSortSettings {

    /**
     * It allows to set the members name to achieve value sorting based on this.
     */
    @Property()
    public headerText: string;

    /**
     * It allows to set the delimiters to separate the members.

     */
    @Property('.')
    public headerDelimiter: string;

    /**
     * It allows to set the sort order. The types are,
     * * `Ascending`: It allows to display the field members in ascending order. 
     * * `Descending`: It allows to display the field members in descending order.

     */
    @Property('None')
    public sortOrder: Sorting;


    public columnIndex: number;

    /**
     * It allows to set the measure name to achieve value sorting based on this.
     */
    @Property()
    public measure: string;
}

/** 
 * Configures the settings of dataSource. 
 */
export class DataSourceSettings extends ChildProperty<DataSourceSettings> implements IDataOptions {

    /**
     * It allows to set the cube catalog name.
     */
    @Property()
    public catalog: string;

    /**
     * It allows to set the cube name.
     */
    @Property()
    public cube: string;

    /**
     * It allows to set the provider type.

     */
    @Property('Relational')
    public providerType: ProviderType;

    /**
     * It allows to set the url string.
     */
    @Property()
    public url: string;

    /**
     * It allows to set the locale code.

     */
    @Property(1033)
    public localeIdentifier: number;

    /**
     * It allows to set the data source.

     */
    @Property()
    public dataSource: IDataSet[] | DataManager;

    /**
     * It allows to set the row fields.

     */
    @Collection<FieldOptionsModel[]>([], FieldOptions)
    public rows: FieldOptionsModel[];

    /**
     * It allows to set the column fields.

     */
    @Collection<FieldOptionsModel[]>([], FieldOptions)
    public columns: FieldOptionsModel[];

    /**
     * It allows to set the value fields.

     */
    @Collection<FieldOptionsModel[]>([], FieldOptions)
    public values: FieldOptionsModel[];

    /**
     * It allows to set the filter fields.

     */
    @Collection<FieldOptionsModel[]>([], FieldOptions)
    public filters: FieldOptionsModel[];

    /**
     * It allows to hide fields from fieldlist.

     */
    @Property([])
    public excludeFields: string[];

    /**
     * It allows to set the expanded state of headers.

     */
    @Property(false)
    public expandAll: boolean;

    /**
     * It allows to set the value fields in both column and row axis.

     */
    @Property('column')
    public valueAxis: string;

    /**
     * It allows to set the settings of filtering operation.

     */
    @Collection<FilterModel[]>([], Filter)
    public filterSettings: FilterModel[];

    /**
     * It allows to set the settings of sorting operation.

     */
    @Collection<SortModel[]>([], Sort)
    public sortSettings: SortModel[];

    /**
     * It allows sorting operation UI.

     */
    @Property(true)
    public enableSorting: boolean;

    /**
     * It allows excel-like label filtering operation.

     */
    @Property(false)
    public allowLabelFilter: boolean;

    /**
     * It allows excel-like value filtering operation.

     */
    @Property(false)
    public allowValueFilter: boolean;

    /**
     * It allows enable/disable sub total in pivot table.

     */
    @Property(true)
    public showSubTotals: boolean;

    /**
     * It allows enable/disable row sub total in pivot table.

     */
    @Property(true)
    public showRowSubTotals: boolean;

    /**
     * It allows enable/disable column sub total in pivot table.

     */
    @Property(true)
    public showColumnSubTotals: boolean;

    /**
     * It allows enable/disable grand total in pivot table.

     */
    @Property(true)
    public showGrandTotals: boolean;

    /**
     * It allows enable/disable row grand total in pivot table.

     */
    @Property(true)
    public showRowGrandTotals: boolean;

    /**
     * It allows enable/disable column grand total in pivot table.

     */
    @Property(true)
    public showColumnGrandTotals: boolean;

    /**
     * It allows enable/disable single measure headers in pivot table.

     */
    @Property(false)
    public alwaysShowValueHeader: boolean;

    /**
     * If `showHeaderWhenEmpty` is set to false, then it will hide blank headers in pivot table.

     */
    @Property(true)
    public showHeaderWhenEmpty: boolean;

    /**
     * It allows enable/disable show aggregation on PivotButton.

     */
    @Property(true)
    public showAggregationOnValueField: boolean;

    /**
     * It allows to set the settings of number formatting.

     */
    @Collection<FormatSettingsModel[]>([], FormatSettings)
    public formatSettings: FormatSettingsModel[];

    /**
     * It allows to set the drilled state for desired field members.

     */
    @Collection<DrillOptionsModel[]>([], DrillOptions)
    public drilledMembers: DrillOptionsModel[];

    /**
     * It allows to set the settings of value sorting operation.
     */
    @Complex<ValueSortSettingsModel>({}, ValueSortSettings)
    public valueSortSettings: ValueSortSettingsModel;

    /**
     * It allows to set the settings of calculated field operation.

     */
    @Collection<CalculatedFieldSettingsModel[]>([], CalculatedFieldSettings)
    public calculatedFieldSettings: CalculatedFieldSettingsModel[];

    /**
     * It allows to set the settings of Conditional Format operation.

     */
    @Collection<ConditionalFormatSettingsModel[]>([], ConditionalFormatSettings)
    public conditionalFormatSettings: ConditionalFormatSettingsModel[];

    /**
     * It allows to set the custom values to empty value cells .
     */
    @Property()
    public emptyCellsTextContent: string;

    /**
     * It allows to set the settings for grouping the date.

     */
    @Collection<GroupSettingsModel[]>([], GroupSettings)
    public groupSettings: GroupSettingsModel[];

}
