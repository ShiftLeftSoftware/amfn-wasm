/*
    Amfn Web Assembly.
    Copyright (c) 2021 ShiftLeft Software

    Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
    http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
    <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
    option. This file may not be copied, modified, or distributed
    except according to those terms.
*/

// Default locale if we cannot find an appropriate locale from navigator.languages
export const defaultLocaleStr = "en-US";

/// Locale file definitions
export const localeFolder = "./locales/";
export const localePreferences = "/preferences.json";
export const localeLocales = "/locales.json";
export const localeTemplates = "/templates.json";
export const localeHelpContext = "/help/context.json";
export const localeHelpConcepts = "/help/concepts.html";
export const localeHelpCashflow = "/help/cashflow.html";
export const localeTutorialLoan = "/tutorials/loan/loan.html";
export const localeTutorialAnnuity = "/tutorials/annuity/annuity.html";
export const localeTutorialBond = "/tutorials/bond/bond.html";
export const localeTutorialInvestment = "/tutorials/investment/investment.html";

// Serialize user preferences.
export const JSON_SERIALIZE_PREFERENCES = 1;
/// Serialize templates.
export const JSON_SERIALIZE_TEMPLATES = 2;
/// Serialize exchange rates.
export const JSON_SERIALIZE_EXCHANGE_RATES = 4;
/// Serialize cashflow preferences.
export const JSON_SERIALIZE_CASHFLOW_PREFERENCES = 8;
/// Serialize selected cashflow.
export const JSON_SERIALIZE_CASHFLOW_SELECTED = 16;
/// Serialize cashflows with event list.
export const JSON_SERIALIZE_EVENT_LIST = 32;
/// Serialize cashflows with amortization list and balance results
export const JSON_SERIALIZE_AMORTIZATION_LIST = 64;
/// Serialize cashflows with amortization list (with rollup elements)
export const JSON_SERIALIZE_AMORTIZATION_LIST_ROLLUPS = 128;
/// Serialize cashflows with amortization list (with rollup and detail elements)
export const JSON_SERIALIZE_AMORTIZATION_LIST_DETAILS = 256;

// Table type event.
export const TABLE_EVENT = 0;
// Table type amortization.
export const TABLE_AM = 1;

// Format - string.
export const FORMAT_STRING = 0;
// Format - date.
export const FORMAT_DATE = 1;
// Format - integer.
export const FORMAT_INTEGER = 2;
// Format - decimal.
export const FORMAT_DECIMAL = 3;
// Format - currency.
export const FORMAT_CURRENCY = 4;

// Column field names
export const FIELD_TYPE = "Type";
export const FIELD_DATE = "Date";
export const FIELD_SORT = "Sort";
export const FIELD_VALUE = "Value";
export const FIELD_PERIODS = "Periods";
export const FIELD_FREQUENCY = "Frequency";
export const FIELD_SKIP_PERIODS = "Skip-periods";
export const FIELD_PARAMETERS = "Parameter-list";
export const FIELD_DESCRIPTORS = "Descriptor-list";

// Resource button constant.
export const BUTTON_INSERT = "Button_Insert";
export const BUTTON_DELETE = "Button_Delete";
export const BUTTON_CALCULATE = "Button_Calculate";
export const BUTTON_EXPAND = "Button_Expand";
export const BUTTON_COMPRESS = "Button_Compress";
export const BUTTON_SUMMARY = "Button_Summary";
export const BUTTON_CHARTS = "Button_Charts";
export const BUTTON_INSERT2 = "Button_Insert2";
export const BUTTON_DELETE2 = "Button_Delete2";
export const BUTTON_CALCULATE2 = "Button_Calculate2";
export const BUTTON_EXPAND2 = "Button_Expand2";
export const BUTTON_COMPRESS2 = "Button_Compress2";
export const BUTTON_SUMMARY2 = "Button_Summary2";
export const BUTTON_CHARTS2 = "Button_Charts2";

// Resource compute method constants
export const METHOD_ACTUARIAL = "Method_Actuarial";
export const METHOD_SIMPLE_INTEREST = "Method_Simple_Interest";

// Resource day-count constant.
export const DAY_COUNT_PERIODIC = "Day_Count_Basis_Periodic";
export const DAY_COUNT_RULE_OF_78 = "Day_Count_Basis_Rule_Of_78";
export const DAY_COUNT_ACTUAL = "Day_Count_Basis_Actual";
export const DAY_COUNT_ACTUAL_ISMA = "Day_Count_Basis_Actual_Actual_ISMA";
export const DAY_COUNT_ACTUAL_AFB = "Day_Count_Basis_Actual_Actual_AFB";
export const DAY_COUNT_ACTUAL_365L = "Day_Count_Basis_Actual_365L";
export const DAY_COUNT_30 = "Day_Count_Basis_30";
export const DAY_COUNT_30E = "Day_Count_Basis_30E";
export const DAY_COUNT_30EP = "Day_Count_Basis_30EP";

// Resource error constants
export const ERROR_CALCULATE_INTEREST = "Error_Calculate_Interest";
export const ERROR_CALCULATE_PERIODS = "Error_Calculate_Periods";
export const ERROR_CALCULATE_PRINCIPAL = "Error_Calculate_Principal";

// Resource frequency constant.
export const FREQ_NONE = "Frequency_None";
export const FREQ_1_YEAR = "Frequency_1_Year";
export const FREQ_6_MONTHS = "Frequency_6_Months";
export const FREQ_4_MONTHS = "Frequency_4_Months";
export const FREQ_3_MONTHS = "Frequency_3_Months";
export const FREQ_2_MONTHS = "Frequency_2_Months";
export const FREQ_1_MONTH = "Frequency_1_Month";
export const FREQ_HALF_MONTH = "Frequency_Half_Month";
export const FREQ_4_WEEKS = "Frequency_4_Weeks";
export const FREQ_2_WEEKS = "Frequency_2_Weeks";
export const FREQ_1_WEEK = "Frequency_1_Week";
export const FREQ_1_DAY = "Frequency_1_Day";
export const FREQ_CONTINUOUS = "Frequency_Continuous";

// Resource menu constant.
export const MENU_NEW = "Menu_New";
export const MENU_OPEN = "Menu_Open";
export const MENU_CLOSE = "Menu_Close";
export const MENU_SAVE = "Menu_Save";

// Resource modal constant.
export const MODAL_CANCEL = "Modal_Cancel";
export const MODAL_OK = "Modal_OK";
export const MODAL_SUBMIT = "Modal_Submit";
export const MODAL_CONFIRMATION = "Modal_Confirmation"; 
export const MODAL_NO = "Modal_No"; 
export const MODAL_YES = "Modal_Yes"; 

// Resource modal titles.
export const MODAL_DESCRIPTOR_LIST = "Modal_Descriptor_List";
export const MODAL_CURRENT_VALUE = "Modal_Current_Value";
export const MODAL_INTEREST_CHANGE = "Modal_Interest_Change";
export const MODAL_STATISTIC_CHANGE = "Modal_Statistic_Value";
export const MODAL_PRINCIPAL_CHANGE = "Modal_Principal_Change";
export const MODAL_INSERT_EVENT = "Modal_Insert_Event";
export const MODAL_NEW_CASHFLOW = "Modal_New_Cashflow";
export const MODAL_PARAMETER_LIST = "Modal_Parameter_List";
export const MODAL_SKIP_PERIODS = "Modal_Skip_Periods";
export const MODAL_CASHFLOW_SUMMARY = "Modal_Cashflow_Summary";
export const MODAL_USER_PREFERENCES = "Modal_User_Preferences";
export const MODAL_CASHFLOW_PREFERENCES = "Modal_Cashflow_Preferences";

// Resource modal descriptors.
export const MODAL_DESC_GROUP = "Modal_Desc_Group";
export const MODAL_DESC_NAME = "Modal_Desc_Name";
export const MODAL_DESC_TYPE = "Modal_Desc_Type";
export const MODAL_DESC_CODE = "Modal_Desc_Code";
export const MODAL_DESC_VALUE = "Modal_Desc_Value";
export const MODAL_DESC_PROPAGATE = "Modal_Desc_Propagate";            

// Resource modal current value.
export const MODAL_CV_EOM = "Modal_Cv_Eom";
export const MODAL_CV_PASSIVE = "Modal_Cv_Passive";
export const MODAL_CV_PRESENT = "Modal_Cv_Present";            

// Resource modal interest change.
export const MODAL_IC_METHOD = "Modal_Ic_Method";
export const MODAL_IC_DAY_COUNT = "Modal_Ic_DayCount";
export const MODAL_IC_DAYS_IN_YEAR = "Modal_Ic_DaysInYear";
export const MODAL_IC_EFF_FREQ = "Modal_Ic_EffFreq";
export const MODAL_IC_INT_FREQ = "Modal_Ic_IntFreq";
export const MODAL_IC_ROUND_BAL = "Modal_Ic_RoundBal";
export const MODAL_IC_ROUND_DD = "Modal_Ic_RoundDD";
export const MODAL_IC_STAT_NAR = "Modal_Ic_Stat_Nar";
export const MODAL_IC_STAT_EAR = "Modal_Ic_Stat_Ear";
export const MODAL_IC_STAT_PR = "Modal_Ic_Stat_Pr";
export const MODAL_IC_STAT_DR = "Modal_Ic_Stat_Dr";

// Resource modal principal change.
export const MODAL_PC_TYPE = "Modal_Pc_Type";
export const MODAL_PC_EOM = "Modal_Pc_Eom";
export const MODAL_PC_PRIN_FIRST = "Modal_Pc_PrinFirst";
export const MODAL_PC_BAL_STAT = "Modal_Pc_BalStat";
export const MODAL_PC_AUXILIARY = "Modal_Pc_Auxiliary";
export const MODAL_PC_AUX_PASSIVE = "Modal_Pc_AuxPassive";

// Resource modal statistic value.
export const MODAL_SV_NAME = "Modal_Sv_Name";
export const MODAL_SV_EOM = "Modal_Sv_Eom";
export const MODAL_SV_FINAL = "Modal_Sv_Final";            

// Resource modal new cashflow.
export const MODAL_NC_NAME = "Modal_Nc_Name";
export const MODAL_NC_TEMPLATE = "Modal_Nc_Template";

// Resource modal preferences
export const MODAL_PREF_LOCALE = "Modal_Pref_Locale";
export const MODAL_PREF_CROSS_RATE = "Modal_Pref_Cross_Rate";
export const MODAL_PREF_ENCODING = "Modal_Pref_Encoding";
export const MODAL_PREF_GROUP = "Modal_Pref_Group";
export const MODAL_PREF_FISCAL_YEAR = "Modal_Pref_Fiscal_Year";
export const MODAL_PREF_DECIMAL_DIGITS = "Modal_Pref_Decimal_Digits";
export const MODAL_PREF_TARGET_VALUE = "Modal_Pref_Target_Value";

// Resource message constant.
export const MSG_INITIALIZED = "Msg_Initialized";
export const MSG_SELECT_FILE = "Msg_Select_File";
export const MSG_SELECT_TEMPLATE_EVENT = "Msg_Select_Template_Event";
export const MSG_SELECT_CASHFLOW_TEMPLATE = "Msg_Select_Cashflow_Template";
export const MSG_TAB_INDEX = "Msg_Tab_Index";
export const MSG_CHART_DEF = "Msg_Chart_Def";
export const MSG_ENGINE = "Msg_Engine";
export const MSG_LOCALES_LOAD = "Msg_Locales_Load";
export const MSG_TEMPLATES_LOAD = "Msg_Templates_Load";
export const MSG_HELP_LOAD = "Msg_Help_Load";
export const MSG_CASHFLOW_LOAD = "Msg_Cashflow_Load";
export const MSG_CASHFLOW_SAVE = "Msg_Cashflow_Save";

// Resource navigation constant.
export const NAV_FILE = "Nav_File";
export const NAV_VERSION = "Nav_Version";

// Principal type constants
export const PRIN_TYPE_INCREASE = "Principal_Type_Increase";
export const PRIN_TYPE_DECREASE = "Principal_Type_Decrease";
export const PRIN_TYPE_POSITIVE = "Principal_Type_Positive";
export const PRIN_TYPE_NEGATIVE = "Principal_Type_Negative";

// Rounding constants
export const ROUNDING_NONE = "Rounding_None";
export const ROUNDING_BIAS_UP = "Rounding_Bias_Up";
export const ROUNDING_BIAS_DOWN = "Rounding_Bias_Down";
export const ROUNDING_UP = "Rounding_Up";
export const ROUNDING_TRUNCATE = "Rounding_Truncate";
export const ROUNDING_BANKERS = "Rounding_Bankers";

// Help group constants
export const HelpCurrentValue = "CurrentValue";
export const HelpInterestChange = "InterestChange";
export const HelpPrincipalChange = "PrincipalChange";
export const HelpStatisticValue = "StatisticValue";
export const HelpSkipPeriods = "SkipPeriods";
export const HelpDescriptor = "Descriptor";
export const HelpParameter = "Parameter";
export const HelpPreferences = "Preferences";
export const HelpChart = "Chart";
export const HelpConfirm = "Confirm";
export const HelpInsertEvent = "InsertEvent";
export const HelpNewCashflow = "NewCashflow";
export const HelpSummary = "Summary";

// Help constants
export const HELP_CONCEPTS = "Help_Concepts";
export const HELP_CASHFLOW = "Help_Cashflow";
export const HELP_TITLE_INFO = "Help_Title_Info";
export const HELP_TITLE_ERROR = "Help_Title_Error";

// Tutorial constants
export const TUTORIAL_LOAN = "Tutorial_Loan";
export const TUTORIAL_ANNUITY = "Tutorial_Annuity";
export const TUTORIAL_BOND = "Tutorial_Bond";
export const TUTORIAL_INVESTMENT = "Tutorial_Investment";