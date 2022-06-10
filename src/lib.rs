//! Amfn Web Assembly.
// Copyright (c) 2021 ShiftLeft Software
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

use js_sys::Array;
use rust_decimal::prelude::*;
use wasm_bindgen::prelude::*;

use amfnengine::core::*;
use amfnengine::engine::*;
use amfnengine::*;

/// Version message.
pub const APP_VERSION: Option<&'static str> = option_env!("CARGO_PKG_VERSION");

/// Event table.
pub const TABLE_EVENT: u32 = 0;
/// Am table.
pub const TABLE_AM: u32 = 1;

/// Wasm parameter element.
#[wasm_bindgen]
pub struct WasmParameter {
    /// Parameter name.
    name: String,
    /// Parameter label.
    label: String,
    /// Parameter description.
    description: String,
    /// Type of symbol.
    sym_type: String,
    /// Integer value.
    int_value: i32,
    /// Decimal value.
    dec_value: String,
    /// String value.
    str_value: String,
}

/// Wasm parameter element implementation.
#[wasm_bindgen]
impl WasmParameter {
    /// Create and return a parameter.
    ///
    /// # Arguments
    ///
    /// * `name_param` - The parameter name.
    /// * `label_param` - The parameter label.
    /// * `desc_param` - The parameter description.
    /// * `sym_type_param` - The symbol type.
    /// * `int_value_param` - The integer value.
    /// * `dec_value_param` - The decimal value.
    /// * `str_value_param` - The string value.
    ///
    /// # Return
    ///
    /// * See description.

    #[wasm_bindgen(skip)]
    pub fn new(
        name_param: &str,
        label_param: &str,
        desc_param: &str,
        sym_type_param: &str,
        int_value_param: i32,
        dec_value_param: &str,
        str_value_param: &str,
    ) -> WasmParameter {
        WasmParameter {
            name: String::from(name_param),
            label: String::from(label_param),
            description: String::from(desc_param),
            sym_type: String::from(sym_type_param),
            int_value: int_value_param,
            dec_value: String::from(dec_value_param),
            str_value: String::from(str_value_param),
        }
    }

    /// Getter for name property
    #[wasm_bindgen(getter)]
    pub fn name(&self) -> String {
        self.name.clone()
    }

    /// Setter for name property
    #[wasm_bindgen(setter)]
    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    /// Getter for label property
    #[wasm_bindgen(getter)]
    pub fn label(&self) -> String {
        self.label.clone()
    }

    /// Setter for label property
    #[wasm_bindgen(setter)]
    pub fn set_label(&mut self, label: String) {
        self.label = label;
    }

    /// Getter for description property
    #[wasm_bindgen(getter)]
    pub fn description(&self) -> String {
        self.description.clone()
    }

    /// Setter for description property
    #[wasm_bindgen(setter)]
    pub fn set_description(&mut self, description: String) {
        self.description = description;
    }

    /// Getter for sym_type property
    #[wasm_bindgen(getter)]
    pub fn sym_type(&self) -> String {
        self.sym_type.clone()
    }

    /// Setter for sym_type property
    #[wasm_bindgen(setter)]
    pub fn set_sym_type(&mut self, sym_type: String) {
        self.sym_type = sym_type;
    }

    /// Getter for int_value property
    #[wasm_bindgen(getter)]
    pub fn int_value(&self) -> i32 {
        self.int_value
    }

    /// Setter for int_value property
    #[wasm_bindgen(setter)]
    pub fn set_int_value(&mut self, int_value: i32) {
        self.int_value = int_value;
    }

    /// Getter for dec_value property
    #[wasm_bindgen(getter)]
    pub fn dec_value(&self) -> String {
        self.dec_value.clone()
    }

    /// Setter for dec_value property
    #[wasm_bindgen(setter)]
    pub fn set_dec_value(&mut self, dec_value: String) {
        self.dec_value = dec_value;
    }

    /// Getter for str_value property
    #[wasm_bindgen(getter)]
    pub fn str_value(&self) -> String {
        self.str_value.clone()
    }

    /// Setter for str_value property
    #[wasm_bindgen(setter)]
    pub fn set_str_value(&mut self, str_value: String) {
        self.str_value = str_value;
    }
}

/// Wasm descriptor element.
#[wasm_bindgen]
pub struct WasmDescriptor {
    /// Group name of the descriptor.
    group: String,
    /// Name of the descriptor.
    name: String,
    /// Type of descriptor (locale | custom).
    desc_type: String,
    /// Code for the type of descriptor (ISO language code_ISO country code).
    code: String,
    /// Constant value or the result of an expression.
    value: String,
    /// Optional value expression.
    value_expr: String,
    /// Propagate to the next level if applicable.
    propagate: bool,
    /// Index of the event within the event list (applied by amortization).
    list_event_index: u32,
}

/// Wasm descriptor element implementation.
#[wasm_bindgen]
impl WasmDescriptor {
    /// Create and return a descriptor.
    ///
    /// # Arguments
    ///
    /// * `group_param` - The descriptor group.
    /// * `name_param` - The descriptor name.
    /// * `desc_type_param` - The descriptor type.
    /// * `code_param` - The descriptor code.
    /// * `value_param` - The descriptor value.
    /// * `value_expr_param` - The descriptor value expression.
    /// * `propagate_param` - The descriptor propagate.
    /// * `list_event_index_param` - The event list index.
    ///
    /// # Return
    ///
    /// * See description.

    #[allow(clippy::too_many_arguments)]
    #[wasm_bindgen(skip)]
    pub fn new(
        group_param: &str,
        name_param: &str,
        desc_type_param: &str,
        code_param: &str,
        value_param: &str,
        value_expr_param: &str,
        propagate_param: bool,
        list_event_index_param: u32,
    ) -> WasmDescriptor {
        WasmDescriptor {
            group: String::from(group_param),
            name: String::from(name_param),
            desc_type: String::from(desc_type_param),
            code: String::from(code_param),
            value: String::from(value_param),
            value_expr: String::from(value_expr_param),
            propagate: propagate_param,
            list_event_index: list_event_index_param,
        }
    }

    /// Getter for group property
    #[wasm_bindgen(getter)]
    pub fn group(&self) -> String {
        self.group.clone()
    }

    /// Setter for group property
    #[wasm_bindgen(setter)]
    pub fn set_group(&mut self, group: String) {
        self.group = group;
    }

    /// Getter for name property
    #[wasm_bindgen(getter)]
    pub fn name(&self) -> String {
        self.name.clone()
    }

    /// Setter for name property
    #[wasm_bindgen(setter)]
    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    /// Getter for desc_type property
    #[wasm_bindgen(getter)]
    pub fn desc_type(&self) -> String {
        self.desc_type.clone()
    }

    /// Setter for desc_type property
    #[wasm_bindgen(setter)]
    pub fn set_desc_type(&mut self, desc_type: String) {
        self.desc_type = desc_type;
    }

    /// Getter for code property
    #[wasm_bindgen(getter)]
    pub fn code(&self) -> String {
        self.code.clone()
    }

    /// Setter for code property
    #[wasm_bindgen(setter)]
    pub fn set_code(&mut self, code: String) {
        self.code = code;
    }

    /// Getter for value property
    #[wasm_bindgen(getter)]
    pub fn value(&self) -> String {
        self.value.clone()
    }

    /// Setter for value property
    #[wasm_bindgen(setter)]
    pub fn set_value(&mut self, value: String) {
        self.value = value;
    }

    /// Getter for value_expr property
    #[wasm_bindgen(getter)]
    pub fn value_expr(&self) -> String {
        self.value_expr.clone()
    }

    /// Setter for value_expr property
    #[wasm_bindgen(setter)]
    pub fn set_value_expr(&mut self, value_expr: String) {
        self.value_expr = value_expr;
    }

    /// Getter for propagate property
    #[wasm_bindgen(getter)]
    pub fn propagate(&self) -> bool {
        self.propagate
    }

    /// Setter for propagate property
    #[wasm_bindgen(setter)]
    pub fn set_propagate(&mut self, propagate: bool) {
        self.propagate = propagate;
    }

    /// Getter for list_event_index property
    #[wasm_bindgen(getter)]
    pub fn list_event_index(&self) -> u32 {
        self.list_event_index
    }

    /// Setter for list_event_index property
    #[wasm_bindgen(setter)]
    pub fn set_list_event_index(&mut self, list_event_index: u32) {
        self.list_event_index = list_event_index;
    }
}

/// Wasm chart element.
#[wasm_bindgen]
pub struct WasmElemChart {
    /// Name of the chart definition.
    name: String,
    /// Value of the chart definition.
    value: String,
}

/// Wasm chart element implementation.
#[wasm_bindgen]
impl WasmElemChart {
    /// Create and return a chart element.
    ///
    /// # Arguments
    ///
    /// * `name_param` - The chart name.
    /// * `value_param` - The chart value.
    ///
    /// # Return
    ///
    /// * See description.

    #[wasm_bindgen(skip)]
    pub fn new(name_param: &str, value_param: &str) -> WasmElemChart {
        WasmElemChart {
            name: String::from(name_param),
            value: String::from(value_param),
        }
    }

    /// Getter for name property
    #[wasm_bindgen(getter)]
    pub fn name(&self) -> String {
        self.name.clone()
    }

    /// Setter for name property
    #[wasm_bindgen(setter)]
    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    /// Getter for value property
    #[wasm_bindgen(getter)]
    pub fn value(&self) -> String {
        self.value.clone()
    }

    /// Setter for value property
    #[wasm_bindgen(setter)]
    pub fn set_value(&mut self, value: String) {
        self.value = value;
    }
}

/// Wasm column element.
#[wasm_bindgen]
pub struct WasmElemColumn {
    /// Name of the column.
    col_name: String,
    /// Index of the column name.
    col_name_index: u32,
    /// Header text of the column.
    col_header: String,
    /// Description of the column.
    col_description: String,
    /// Group of the descriptor.
    group: String,
    /// Name of the descriptor.
    name: String,
    /// Type of the descriptor.
    col_type: String,
    /// Code of the descriptor.
    code: String,
    /// Format of the column.
    format: u32,
    /// Number of significant decimal digits.
    decimal_digits: u32,
    /// Width of column.
    col_width: u32,
    /// Column editable.
    col_editable: bool,
}

/// Wasm column element implementation.
#[wasm_bindgen]
impl WasmElemColumn {
    /// Create and return a column.
    ///
    /// # Arguments
    ///
    /// * `col_name_param` - Column name.
    /// * `col_name_index_param` - Column index.
    /// * `col_header_param` - Column header.
    /// * `col_description_param` - Column description.
    /// * `group_param` - Group parameter.
    /// * `name_param` - Name parameter.
    /// * `col_type_param` - Column type.
    /// * `code_param` - Code parameter.
    /// * `format_param` - Column format.
    /// * `decimal_digits_param` - Decimal digits.
    /// * `column_width_param` - Column width.
    /// * `column_editable` - Column editable.
    ///
    /// # Return
    ///
    /// * See description.

    #[allow(clippy::too_many_arguments)]
    #[wasm_bindgen(skip)]
    pub fn new(
        col_name_param: &str,
        col_name_index_param: u32,
        col_header_param: &str,
        col_description_param: &str,
        group_param: &str,
        name_param: &str,
        col_type_param: &str,
        code_param: &str,
        format_param: u32,
        decimal_digits_param: u32,
        col_width_param: u32,
        col_editable_param: bool,
    ) -> WasmElemColumn {
        WasmElemColumn {
            col_name: String::from(col_name_param),
            col_name_index: col_name_index_param,
            col_header: String::from(col_header_param),
            col_description: String::from(col_description_param),
            group: String::from(group_param),
            name: String::from(name_param),
            col_type: String::from(col_type_param),
            code: String::from(code_param),
            format: format_param,
            decimal_digits: decimal_digits_param,
            col_width: col_width_param,
            col_editable: col_editable_param,
        }
    }

    /// Getter for col_name property
    #[wasm_bindgen(getter)]
    pub fn col_name(&self) -> String {
        self.col_name.clone()
    }

    /// Setter for col_name property
    #[wasm_bindgen(setter)]
    pub fn set_col_name(&mut self, col_name: String) {
        self.col_name = col_name;
    }

    /// Getter for col_name_index property
    #[wasm_bindgen(getter)]
    pub fn col_name_index(&self) -> u32 {
        self.col_name_index
    }

    /// Setter for col_name_index property
    #[wasm_bindgen(setter)]
    pub fn set_col_name_index(&mut self, col_name_index: u32) {
        self.col_name_index = col_name_index;
    }

    /// Getter for col_header property
    #[wasm_bindgen(getter)]
    pub fn col_header(&self) -> String {
        self.col_header.clone()
    }

    /// Setter for col_header property
    #[wasm_bindgen(setter)]
    pub fn set_col_header(&mut self, col_header: String) {
        self.col_header = col_header;
    }

    /// Getter for col_description property
    #[wasm_bindgen(getter)]
    pub fn col_description(&self) -> String {
        self.col_description.clone()
    }

    /// Setter for col_description property
    #[wasm_bindgen(setter)]
    pub fn set_col_description(&mut self, col_description: String) {
        self.col_description = col_description;
    }

    /// Getter for group property
    #[wasm_bindgen(getter)]
    pub fn group(&self) -> String {
        self.group.clone()
    }

    /// Setter for group property
    #[wasm_bindgen(setter)]
    pub fn set_group(&mut self, group: String) {
        self.group = group;
    }

    /// Getter for name property
    #[wasm_bindgen(getter)]
    pub fn name(&self) -> String {
        self.name.clone()
    }

    /// Setter for name property
    #[wasm_bindgen(setter)]
    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    /// Getter for col_type property
    #[wasm_bindgen(getter)]
    pub fn col_type(&self) -> String {
        self.col_type.clone()
    }

    /// Setter for col_type property
    #[wasm_bindgen(setter)]
    pub fn set_col_type(&mut self, col_type: String) {
        self.col_type = col_type;
    }

    /// Getter for code property
    #[wasm_bindgen(getter)]
    pub fn code(&self) -> String {
        self.code.clone()
    }

    /// Setter for code property
    #[wasm_bindgen(setter)]
    pub fn set_code(&mut self, code: String) {
        self.code = code;
    }

    /// Getter for format property
    #[wasm_bindgen(getter)]
    pub fn format(&self) -> u32 {
        self.format
    }

    /// Setter for format property
    #[wasm_bindgen(setter)]
    pub fn set_format(&mut self, format: u32) {
        self.format = format;
    }

    /// Getter for decimal_digits property
    #[wasm_bindgen(getter)]
    pub fn decimal_digits(&self) -> u32 {
        self.decimal_digits
    }

    /// Setter for decimal_digits property
    #[wasm_bindgen(setter)]
    pub fn set_decimal_digits(&mut self, decimal_digits: u32) {
        self.decimal_digits = decimal_digits;
    }

    /// Getter for col_width property
    #[wasm_bindgen(getter)]
    pub fn col_width(&self) -> u32 {
        self.col_width
    }

    /// Setter for col_width property
    #[wasm_bindgen(setter)]
    pub fn set_col_width(&mut self, col_width: u32) {
        self.col_width = col_width;
    }

    /// Getter for col_editable property
    #[wasm_bindgen(getter)]
    pub fn col_editable(&self) -> bool {
        self.col_editable
    }

    /// Setter for col_editable property
    #[wasm_bindgen(setter)]
    pub fn set_col_editable(&mut self, col_editable: bool) {
        self.col_editable = col_editable;
    }
}

/// Wasm preferences.
#[wasm_bindgen]
pub struct WasmElemPreferences {
    /// Locale string.
    locale_str: String,
    /// Template group name.
    group: String,
    /// Cross rate international currency code (e.g., USD, GBP, JPY, AUD, EUR, other currency code).
    cross_rate_code: String,
    /// Default encoding (us-ascii, iso-8859-1, utf-8, utf-16be, utf-16le, utf-16, other encoding).
    default_encoding: String,
    /// Start of fiscal year in MMDD format.
    fiscal_year_start: u32,
    /// Number of significant decimal digits.
    decimal_digits: u32,
    /// Target value.
    target: String,
}

/// Wasm preferences implementation.
#[wasm_bindgen]
impl WasmElemPreferences {
    /// Create and return a preferences element.
    ///
    /// # Arguments
    ///
    /// * `locale_str_param` - Locale string.
    /// * `group_param` - Template group name.
    /// * `cross_rate_code_param` - Cross rate international currency code.
    /// * `default_encoding_param` - Default encoding.
    /// * `fiscal_year_start_param` - Start of fiscal year in MMDD format.
    /// * `decimal_digits_param` - Number of significant decimal digits.
    /// * `target_param` - Target value.
    ///
    /// # Return
    ///
    /// * See description.

    #[wasm_bindgen(constructor)]
    pub fn new(
        locale_str_param: &str,
        group_param: &str,
        cross_rate_code_param: &str,
        default_encoding_param: &str,
        fiscal_year_start_param: u32,
        decimal_digits_param: u32,
        target_param: &str,
    ) -> WasmElemPreferences {
        WasmElemPreferences {
            locale_str: String::from(locale_str_param),
            group: String::from(group_param),
            cross_rate_code: String::from(cross_rate_code_param),
            default_encoding: String::from(default_encoding_param),
            fiscal_year_start: fiscal_year_start_param,
            decimal_digits: decimal_digits_param,
            target: String::from(target_param),
        }
    }

    /// Getter for locale_str property
    #[wasm_bindgen(getter)]
    pub fn locale_str(&self) -> String {
        self.locale_str.clone()
    }

    /// Setter for locale_str property
    #[wasm_bindgen(setter)]
    pub fn set_locale_str(&mut self, locale_str: String) {
        self.locale_str = locale_str;
    }

    /// Getter for group property
    #[wasm_bindgen(getter)]
    pub fn group(&self) -> String {
        self.group.clone()
    }

    /// Setter for group property
    #[wasm_bindgen(setter)]
    pub fn set_group(&mut self, group: String) {
        self.group = group;
    }

    /// Getter for cross_rate_code property
    #[wasm_bindgen(getter)]
    pub fn cross_rate_code(&self) -> String {
        self.cross_rate_code.clone()
    }

    /// Setter for cross_rate_code property
    #[wasm_bindgen(setter)]
    pub fn set_cross_rate_code(&mut self, cross_rate_code: String) {
        self.cross_rate_code = cross_rate_code;
    }

    /// Getter for default_encoding property
    #[wasm_bindgen(getter)]
    pub fn default_encoding(&self) -> String {
        self.default_encoding.clone()
    }

    /// Setter for default_encoding property
    #[wasm_bindgen(setter)]
    pub fn set_default_encoding(&mut self, default_encoding: String) {
        self.default_encoding = default_encoding;
    }

    /// Getter for fiscal_year_start property
    #[wasm_bindgen(getter)]
    pub fn fiscal_year_start(&self) -> u32 {
        self.fiscal_year_start
    }

    /// Setter for fiscal_year_start property
    #[wasm_bindgen(setter)]
    pub fn set_fiscal_year_start(&mut self, fiscal_year_start: u32) {
        self.fiscal_year_start = fiscal_year_start;
    }

    /// Getter for decimal_digits property
    #[wasm_bindgen(getter)]
    pub fn decimal_digits(&self) -> u32 {
        self.decimal_digits
    }

    /// Setter for decimal_digits property
    #[wasm_bindgen(setter)]
    pub fn set_decimal_digits(&mut self, decimal_digits: u32) {
        self.decimal_digits = decimal_digits;
    }

    /// Getter for target property
    #[wasm_bindgen(getter)]
    pub fn target(&self) -> String {
        self.target.clone()
    }

    /// Setter for target property
    #[wasm_bindgen(setter)]
    pub fn set_target(&mut self, target: String) {
        self.target = target;
    }
}

/// Wasm summary element.
#[wasm_bindgen]
pub struct WasmElemSummary {
    /// Name of the summary item.
    name: String,
    /// Label text of the summary item.
    label: String,
    /// Label expression of the summary item.
    label_expr: String,
    /// Result text of the summary item.
    result: String,
    /// Result expression of the summary item.
    result_expr: String,
}

/// Wasm summary element implementation.
#[wasm_bindgen]
impl WasmElemSummary {
    /// Create and return a summary element.
    ///
    /// # Arguments
    ///
    /// * `name_param` - The descriptor code.
    /// * `label_param` - The descriptor code.
    /// * `label_expr_param` - The descriptor value.
    /// * `result_param` - The descriptor value expression.
    /// * `result_expr_param` - The descriptor propagate.
    ///
    /// # Return
    ///
    /// * See description.

    #[wasm_bindgen(skip)]
    pub fn new(
        name_param: &str,
        label_param: &str,
        label_expr_param: &str,
        result_param: &str,
        result_expr_param: &str,
    ) -> WasmElemSummary {
        WasmElemSummary {
            name: String::from(name_param),
            label: String::from(label_param),
            label_expr: String::from(label_expr_param),
            result: String::from(result_param),
            result_expr: String::from(result_expr_param),
        }
    }

    /// Getter for name property
    #[wasm_bindgen(getter)]
    pub fn name(&self) -> String {
        self.name.clone()
    }

    /// Setter for name property
    #[wasm_bindgen(setter)]
    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    /// Getter for label property
    #[wasm_bindgen(getter)]
    pub fn label(&self) -> String {
        self.label.clone()
    }

    /// Setter for label property
    #[wasm_bindgen(setter)]
    pub fn set_label(&mut self, label: String) {
        self.label = label;
    }

    /// Getter for label_expr property
    #[wasm_bindgen(getter)]
    pub fn label_expr(&self) -> String {
        self.label_expr.clone()
    }

    /// Setter for label_expr property
    #[wasm_bindgen(setter)]
    pub fn set_label_expr(&mut self, label_expr: String) {
        self.label_expr = label_expr;
    }

    /// Getter for result property
    #[wasm_bindgen(getter)]
    pub fn result(&self) -> String {
        self.result.clone()
    }

    /// Setter for result property
    #[wasm_bindgen(setter)]
    pub fn set_result(&mut self, result: String) {
        self.result = result;
    }

    /// Getter for result_expr property
    #[wasm_bindgen(getter)]
    pub fn result_expr(&self) -> String {
        self.result_expr.clone()
    }

    /// Setter for result_expr property
    #[wasm_bindgen(setter)]
    pub fn set_result_expr(&mut self, result_expr: String) {
        self.result_expr = result_expr;
    }
}

/// Wasm amfn engine.
#[wasm_bindgen]
pub struct Engine {
    /// AmFn engine.
    engine: CalcEngine,

    /// AmFn engine initialized.
    initialized: bool,
}

/// Wasm amfn engine default implementation.
impl Default for Engine {
    /// Create and return a Wasm AmFn engine.
    ///
    /// # Return
    ///
    /// * See description.

    fn default() -> Self {
        Engine::new()
    }
}

/// Wasm amfn engine implementation.
#[wasm_bindgen]
impl Engine {
    /// Create and return a Wasm AmFn engine.
    ///
    /// # Return
    ///
    /// * See description.

    #[wasm_bindgen(constructor)]
    pub fn new() -> Engine {
        let eng = CalcEngine::new();

        Engine {
            engine: eng,
            initialized: false,
        }
    }

    /// Initialize the engine with the user locale.
    ///
    /// # Return
    ///
    /// * Return the locale string, encoding, and default decimal digits.

    pub fn init_engine(&mut self) -> String {
        let mut encoding = String::from(amfnengine::DEFAULT_ENCODING);
        let mut decimal_digits = amfnengine::DEFAULT_DECIMAL_DIGITS;

        if self.initialized {
            return String::from("");
        }

        let locale_str = String::from(self.engine.calc_mgr().preferences().locale_str());

        if !self
            .engine
            .calc_mgr()
            .preferences()
            .default_encoding()
            .is_empty()
        {
            encoding = String::from(self.engine.calc_mgr().preferences().default_encoding());
        }

        if !self.engine.calc_mgr().preferences().decimal_digits() > 0 {
            decimal_digits = self.engine.calc_mgr().preferences().decimal_digits();
        }

        self.engine.init_engine(locale_str.as_str());

        self.initialized = true;

        format!("{}|{}|{}", locale_str, encoding, decimal_digits)
    }

    /// Return the AmFn engine version string.
    ///
    /// # Return
    ///
    /// * See description.

    pub fn get_engine_version(&self) -> String {
        match amfnengine::APP_VERSION {
            None => String::from(""),
            Some(o) => String::from(o),
        }
    }

    /// Return the AmFn wasm version string.
    ///
    /// # Return
    ///
    /// * See description.

    pub fn get_wasm_version(&self) -> String {
        match APP_VERSION {
            None => String::from(""),
            Some(o) => String::from(o),
        }
    }

    /// Calculates the value for an event.
    /// Calculates either an interest amount or a principal amount
    /// (depending upon the selected event type) that will satisfy
    /// the condition that the remaining balance of the cashflow
    /// is the smallest amount greater than or equal to the given
    /// parameter value.
    ///
    /// # Arguments
    ///
    /// * `cf_index` - The cashflow index.
    /// * `index` - The event index of the cashflow.
    ///
    /// # Return
    ///
    /// * The results from this method or an error code.

    pub fn calculate_value(&self, cf_index: i32, index: u32) -> String {
        {
            let calc_mgr = self.engine.calc_mgr();

            if !calc_mgr.list_cashflow().get_element(cf_index as usize) {
                return String::from("");
            }

            match calc_mgr.list_cashflow().list_event() {
                None => {
                    return String::from("");
                }
                Some(o) => {
                    if !o.get_element(index as usize) {
                        return String::from("");
                    }
                }
            }
        }

        match self.engine.calculate_value() {
            Err(_e) => String::from(""),
            Ok(o) => o.result_decimal().to_string(),
        }
    }

    /// Calculates the periods for an event.
    /// Calculates the number of periods that will satisfy the
    /// condition that the remaining balance of the cashflow
    /// is the smallest amount greater than or equal to the given
    /// parameter value.
    ///
    /// # Arguments
    ///
    /// * `cf_index` - The cashflow index.
    /// * `index` - The event index of the cashflow.
    ///
    /// # Return
    ///
    /// * The results from this method or an error code.

    pub fn calculate_periods(&self, cf_index: i32, index: u32) -> i32 {
        {
            let calc_mgr = self.engine.calc_mgr();

            if !calc_mgr.list_cashflow().get_element(cf_index as usize) {
                return 0;
            }

            match calc_mgr.list_cashflow().list_event() {
                None => {
                    return 0;
                }
                Some(o) => {
                    if !o.get_element(index as usize) {
                        return 0;
                    }
                }
            }
        }

        match self.engine.calculate_periods() {
            Err(_e) => 0,
            Ok(o) => o.result_integer(),
        }
    }

    /// Creates the events from the indicated template event list into
    /// the currently selected cashflow event list.
    ///
    /// # Arguments
    ///
    /// * `group_param` - The name of the template group.
    /// * `event_param` - The name of the template event.
    /// * `cf_index` - Cashflow index.
    ///
    /// # Return
    ///
    /// * True indicates the last template event index, otherwise false.

    pub fn create_template_events(
        &self,
        group_param: &str,
        event_param: &str,
        cf_index: i32,
    ) -> String {
        match self
            .engine
            .create_template_events(group_param, event_param, cf_index as usize)
        {
            Err(_e) => String::from(""),
            Ok(o) => {
                let mut events = String::from("");
                let orig_index = o.index();
                let mut index: usize = 0;
                loop {
                    if !o.get_element(index) {
                        break;
                    }
                    if !events.is_empty() {
                        events.push('|');
                    }
                    let new_date = o.event_date();
                    events.push_str(
                        format!(
                            "{:04}-{:02}-{:02}",
                            new_date / 10000,
                            new_date / 100 % 100,
                            new_date % 100
                        )
                        .as_str(),
                    );
                    events.push('~');
                    events.push_str(o.sort_order().to_string().as_str());
                    events.push('~');
                    let param_count: usize;
                    match o.list_parameter() {
                        None => {
                            param_count = 0;
                        }
                        Some(o) => {
                            param_count = o.count();
                        }
                    }
                    events.push_str(param_count.to_string().as_str());
                    index += 1;
                }
                o.get_element(orig_index);
                events
            }
        }
    }

    /// Creates a new cashflow from a named template group.
    ///
    /// # Arguments
    ///
    /// * `group_param` - The name of the template group.
    /// * `new_name_param` - The name of the new cashflow.
    ///
    /// # Return
    ///
    /// * True if successful, otherwise false.

    pub fn create_cashflow_from_template_group(
        &self,
        group_param: &str,
        new_name_param: &str,
    ) -> String {
        match self.engine.create_cashflow_from_template_group(
            group_param,
            new_name_param,
            group_param,
        ) {
            Err(_e) => String::from(""),
            Ok(_o) => {
                let mut initial_name = String::from("*");
                let calc_mgr = self.engine.calc_mgr();
                let list_template_event = calc_mgr.list_template_group().list_template_event();
                let orig_index = list_template_event.index();
                let mut index: usize = 0;
                loop {
                    if !list_template_event.get_element(index) {
                        break;
                    }
                    if list_template_event.initial_event() {
                        initial_name = String::from(list_template_event.name());
                        break;
                    }
                    index += 1;
                }
                list_template_event.get_element(orig_index);
                initial_name
            }
        }
    }

    /// Calculates number of intervals between two dates.
    /// If intDate2 is greater than or equal to intDate1,
    /// the result will be positive, otherwise the result
    /// will be negative.
    ///
    /// # Arguments
    ///
    /// * `date1` - First date in YYYY-MM-DD format.
    /// * `date2` - Second date in YYYY-MM-DD format.
    /// * `frequency` - Date frequency.
    /// * `intervals` - Number of intervals of frequency.
    /// * `eom_param` - Adjust successive dates to end of month.
    ///
    /// # Return
    ///
    /// * Number of intervals (positive or negative).

    pub fn date_diff(
        &self,
        date1: &str,
        date2: &str,
        frequency: &str,
        intervals: u32,
        eom_param: bool,
    ) -> i32 {
        let freq = CoreUtility::get_frequency(frequency);

        CoreUtility::date_diff(
            CoreUtility::parse_date(date1),
            CoreUtility::parse_date(date2),
            freq,
            intervals as usize,
            eom_param,
        ) as i32
    }

    /// Calculates a new date based upon a given date and number of intervals.
    ///
    /// # Arguments
    ///
    /// * `date_orig` - Original date in YYYY-MM-DD format.
    /// * `date_param` - Date in YYYY-MM-DD format.
    /// * `frequency` - Date frequency.
    /// * `intervals` - Number of intervals of frequency (positive or negative).
    /// * `eom_param` - Adjust successive dates to end of month.
    ///
    /// # Return
    ///
    /// * See description.

    pub fn date_new(
        &self,
        date_orig: &str,
        date_param: &str,
        frequency: &str,
        intervals: i32,
        eom_param: bool,
    ) -> String {
        let freq = CoreUtility::get_frequency(frequency);

        let new_date = CoreUtility::date_newi(
            CoreUtility::parse_date(date_orig),
            CoreUtility::parse_date(date_param),
            freq,
            intervals,
            eom_param,
        );

        self.engine.format_date_out(new_date)
    }

    /// Format a date and return the internal format.
    ///
    /// # Arguments
    ///
    /// * `display_val` - The display value to parse.
    ///
    /// # Return
    ///
    /// * See description.

    pub fn format_date_in(&self, display_val: &str) -> String {
        self.engine.format_date_in(display_val)
    }

    /// Format an integer and return the internal format.
    ///
    /// # Arguments
    ///
    /// * `display_val` - The display value to parse.
    ///
    /// # Return
    ///
    /// * See description.

    pub fn format_integer_in(&self, display_val: &str) -> String {
        self.engine.format_integer_in(display_val)
    }

    /// Format a decimal and return the internal format.
    ///
    /// # Arguments
    ///
    /// * `display_val` - The display value to parse.
    ///
    /// # Return
    ///
    /// * See description.

    pub fn format_decimal_in(&self, display_val: &str) -> String {
        self.engine.format_decimal_in(display_val)
    }

    /// Format a currency and return the internal format.
    ///
    /// # Arguments
    ///
    /// * `display_val` - The display value to parse.
    ///
    /// # Return
    ///
    /// * See description.

    pub fn format_currency_in(&self, display_val: &str) -> String {
        self.engine.format_currency_in(display_val)
    }

    /// Format and return a date string.
    ///
    /// # Arguments
    ///
    /// * `val` - The usize date value to format.
    ///
    /// # Return
    ///
    /// * See description.

    pub fn format_date_out(&self, val: &str) -> String {
        self.engine.format_date_out(CoreUtility::parse_date(val))
    }

    /// Format and return an integer string.
    ///
    /// # Arguments
    ///
    /// * `val` - The usize value to format.
    ///
    /// # Return
    ///
    /// * See description.

    pub fn format_integer_out(&self, val: u32) -> String {
        self.engine.format_integer_out(val as usize)
    }

    /// Format and return a decimal string.
    ///
    /// # Arguments
    ///
    /// * `val` - The decimal value to format.
    ///
    /// # Return
    ///
    /// * See description.

    pub fn format_decimal_out(&self, val: &str) -> String {
        match val.parse::<Decimal>() {
            Err(_e) => String::from("0.0"),
            Ok(o) => self.engine.format_decimal_out(o),
        }
    }

    /// Format and return a currency string.
    ///
    /// # Arguments
    ///
    /// * `val` - The currency value to format.
    ///
    /// # Return
    ///
    /// * See description.

    pub fn format_currency_out(&self, val: &str) -> String {
        match val.parse::<Decimal>() {
            Err(_e) => String::from("0.0"),
            Ok(o) => self.engine.format_currency_out(o),
        }
    }

    /// Clear the cashflows and template group lists.

    pub fn clear_lists(&self) {

        self.engine.calc_mgr().list_locale().select_cashflow_locale("");
        self.engine.calc_mgr_mut().list_cashflow_mut().clear();
        self.engine.calc_mgr_mut().list_template_group_mut().clear();
    }

    /// Deserialize and ingest the json input.
    ///
    /// # Arguments
    ///
    /// * `json_input` - The json input string.
    ///
    /// # Return
    ///
    /// * Returns empty string if successful or an error.

    pub fn deserialize(&self, json_input: &str) -> String {
        let json = CalcJsonDeserialize::new(self.engine.calc_manager());

        match json.deserialize(String::from(json_input)) {
            Err(_e) => {
                return String::from("Json error");
            }
            Ok(_o) => {}
        }

        String::from("")
    }

    /// Get the status string for the selected cashflow
    /// as status expression.
    ///
    /// # Arguments
    ///
    /// * `cf_index` - The cashflow index.
    /// * `status` - Status expression to evaluate.
    ///
    /// # Return
    ///
    /// * Returns the cashflow status string.

    pub fn get_cashflow_status(&self, cf_index: i32, status: &str) -> String {
        let calc_mgr = self.engine.calc_mgr();

        if !calc_mgr.list_cashflow().get_element(cf_index as usize) {
            return String::from("");
        }

        let mut list_parameter: Option<&ListParameter> = None;
        match calc_mgr.list_cashflow().preferences() {
            None => {}
            Some(o) => {
                list_parameter = Option::from(o.list_parameter());
            }
        }

        let result_symbol = self
            .engine
            .evaluate_expression(list_parameter, status, true);

        match result_symbol.sym_type() {
            amfnengine::TokenType::Integer => {
                self.engine.format_integer_out(result_symbol.sym_integer())
            }
            amfnengine::TokenType::Decimal => {
                self.engine.format_decimal_out(result_symbol.sym_decimal())
            }
            _ => String::from(result_symbol.sym_string()),
        }
    }

    /// Get the chart definitions for the selected cashflow.
    ///
    /// # Arguments
    ///
    /// * `cf_index` - The cashflow index.
    ///
    /// # Return
    ///
    /// * Returns an array of chart definition elements.

    pub fn get_chart_definitions(&self, cf_index: i32) -> Array {
        let calc_mgr = self.engine.calc_mgr();

        if !calc_mgr.list_cashflow().get_element(cf_index as usize) {
            return Array::new();
        }

        let mut ary_chart: Vec<WasmElemChart> = Vec::new();
        let list_descriptor = calc_mgr.preferences().list_descriptor();
        let mut index: usize = 0;

        loop {
            if !list_descriptor.get_element(index) {
                break;
            }

            if list_descriptor.group() == "Chart" && list_descriptor.desc_type() == "custom" {
                ary_chart.push(WasmElemChart::new(
                    list_descriptor.name(),
                    list_descriptor.value().as_str(),
                ));
            }

            index += 1;
        }

        match calc_mgr.list_cashflow().preferences() {
            None => {}
            Some(o) => {
                let list_descriptor = o.list_descriptor();
                let mut index: usize = 0;

                loop {
                    if !list_descriptor.get_element(index) {
                        break;
                    }

                    if list_descriptor.group() == "Chart" && list_descriptor.desc_type() == "custom"
                    {
                        ary_chart.push(WasmElemChart::new(
                            list_descriptor.name(),
                            list_descriptor.value().as_str(),
                        ));
                    }

                    index += 1;
                }
            }
        }

        ary_chart.into_iter().map(JsValue::from).collect()
    }

    /// Get the event by date and sort order.
    ///
    /// # Arguments
    ///
    /// * `cf_index` - The cashflow index.
    /// * `date_param` - The date to select.
    /// * `sort_param` - The sort order to select.
    ///
    /// # Return
    ///
    /// * The event index or -1.

    pub fn get_event_by_date(&self, cf_index: i32, date_param: &str, sort_param: u32) -> u32 {
        let calc_mgr = self.engine.calc_mgr();

        if !calc_mgr.list_cashflow().get_element(cf_index as usize) {
            return 0;
        }

        let date_in = CoreUtility::parse_date(self.engine.format_date_in(date_param).as_str());

        match calc_mgr.list_cashflow().list_event() {
            None => 0,
            Some(o) => {
                if !o.get_element_by_date(date_in, sort_param as usize) {
                    return 0;
                }
                o.index() as u32
            }
        }
    }

    /// Get selected user or cashflow preferences.
    ///
    /// # Arguments
    ///
    /// * `cf_index` - The cashflow index or -1 for user preferences.
    ///
    /// # Return
    ///
    /// * See description.

    pub fn get_preferences(&self, cf_index: i32) -> WasmElemPreferences {
        let calc_mgr = self.engine.calc_mgr();
        let prefs: &ElemPreferences;

        if cf_index >= 0 {
            calc_mgr.list_cashflow().get_element(cf_index as usize);

            match calc_mgr.list_cashflow().preferences() {
                None => {
                    prefs = calc_mgr.preferences();
                }
                Some(o) => {
                    prefs = o;
                }
            }
        } else {
            prefs = calc_mgr.preferences();
        }

        WasmElemPreferences::new(
            prefs.locale_str(),
            prefs.group(),
            prefs.cross_rate_code(),
            prefs.default_encoding(),
            prefs.fiscal_year_start() as u32,
            prefs.decimal_digits() as u32,
            prefs.target().to_string().as_str(),
        )
    }

    /// Get a specific resource.
    ///
    /// # Arguments
    ///
    /// * `cf_index` - The cashflow index.
    /// * `key` - The resource key.
    ///
    /// # Return
    ///
    /// * See description.

    pub fn get_resource(&self, cf_index: i32, key: &str) -> String {
        let calc_mgr = self.engine.calc_mgr();

        if cf_index >= 0 {
            calc_mgr.list_cashflow().get_element(cf_index as usize);
        }

        let locale = calc_mgr.list_locale();
        String::from(locale.get_resource(key))
    }

    /// Get the loaded template names.
    ///
    /// # Return
    ///
    /// * Returns an array of template group names.

    pub fn get_template_names(&self) -> Array {
        let calc_mgr = self.engine.calc_mgr();
        let list_template_group = calc_mgr.list_template_group();
        let mut ary_template_groups: Vec<String> = Vec::new();

        let orig_index = list_template_group.index();
        let mut index: usize = 0;
        loop {
            if !list_template_group.get_element(index) {
                break;
            }
            ary_template_groups.push(String::from(list_template_group.group()));
            index += 1;
        }
        list_template_group.get_element(orig_index);

        ary_template_groups.into_iter().map(JsValue::from).collect()
    }

    /// Get the loaded template event names for a template group.
    ///
    /// # Arguments
    ///
    /// * `group_param` - The template group name.
    ///
    /// # Return
    ///
    /// * Returns an array of template event names.

    pub fn get_template_event_names(&self, group_param: &str) -> Array {
        let calc_mgr = self.engine.calc_mgr();
        let list_template_group = calc_mgr.list_template_group();

        let mut ary_template_events: Vec<String> = Vec::new();

        if !list_template_group.get_element_by_group(group_param, true) {
            return ary_template_events.into_iter().map(JsValue::from).collect();
        }

        let list_template_event = list_template_group.list_template_event();

        let orig_index = list_template_event.index();
        let mut index: usize = 0;
        loop {
            if !list_template_event.get_element(index) {
                break;
            }
            ary_template_events.push(String::from(list_template_event.name()));
            index += 1;
        }
        list_template_event.get_element(orig_index);

        ary_template_events.into_iter().map(JsValue::from).collect()
    }

    /// Initialize the selected cashflow.
    ///
    /// # Arguments
    ///
    /// * `cf_index` - The cashflow index.
    ///
    /// # Return
    ///
    /// * Returns the cashflow's name.

    pub fn init_cashflow(&self, cf_index: i32) -> String {
        if cf_index < 0 {
            return String::from("");
        }

        if !self.engine.init_cashflow(cf_index as u32) {
            return String::from("");
        }

        let calc_mgr = self.engine.calc_mgr();

        let locale_str: &str;
        let group: &str;
        match calc_mgr.list_cashflow().preferences() {
            None => {
                locale_str = calc_mgr.preferences().locale_str();
                group = "";
            }
            Some(o) => {
                if o.locale_str().is_empty() {
                    locale_str = calc_mgr.preferences().locale_str();
                } else {
                    locale_str = o.locale_str();
                }
                group = o.group();
            }
        }

        format!(
            "{}|{}|{}",
            calc_mgr.list_cashflow().name(),
            locale_str,
            group
        )
    }

    /// Initialize and return the selected cashflow's
    /// status expression.
    ///
    /// # Arguments
    ///
    /// * `cf_index` - The cashflow index.
    ///
    /// # Return
    ///
    /// * See description.

    pub fn init_cashflow_status(&self, cf_index: i32) -> String {
        if cf_index < 0 {
            return String::from("");
        }

        let calc_mgr = self.engine.calc_mgr();
        if !calc_mgr.list_cashflow().get_element(cf_index as usize) {
            return String::from("");
        }

        let locale = calc_mgr.list_locale();
        let cashflow_locale_str = locale.cashflow_locale().locale_str();

        let mut status = self.engine.calc_mgr().descriptor_value(
            amfnengine::GROUP_GENERAL,
            amfnengine::NAME_STATUS,
            amfnengine::TYPE_LOCALE,
            cashflow_locale_str,
            true,
            false,
        );
        if status.is_empty() {
            status = self.engine.calc_mgr().descriptor_value(
                amfnengine::GROUP_GENERAL,
                amfnengine::NAME_STATUS,
                "",
                "",
                true,
                false,
            );
            if status.is_empty() {
                status = String::from(locale.get_resource(amfnengine::USER_STATUS));
            }
        }

        status
    }

    /// Parse and return an array of WasmElemColumns.
    ///
    /// # Arguments
    ///
    /// * `cf_index` - The cashflow index.
    /// * `table_type_param` - The type of table (event or amortization).
    ///
    /// # Return
    ///
    /// * See description.

    pub fn parse_columns(&self, cf_index: i32, table_type_param: u32) -> Array {
        if cf_index < 0 {
            return Array::new();
        }

        let calc_mgr = self.engine.calc_mgr();
        if !calc_mgr.list_cashflow().get_element(cf_index as usize) {
            return Array::new();
        }

        let table_type: TableType;
        match table_type_param {
            TABLE_AM => {
                table_type = TableType::Amortization;
            }
            _ => {
                table_type = TableType::Event;
            }
        }

        let mut ary_column: Vec<WasmElemColumn> = Vec::new();
        let list_column = self.engine.parse_columns(table_type);
        let mut index: usize = 0;

        loop {
            if !list_column.get_element(index) {
                break;
            }

            ary_column.push(WasmElemColumn::new(
                list_column.col_name(),
                list_column.col_name_index() as u32,
                list_column.col_header(),
                list_column.col_description(),
                list_column.group(),
                list_column.name(),
                list_column.col_type(),
                list_column.col_name(),
                list_column.format() as u32,
                list_column.decimal_digits() as u32,
                list_column.column_width() as u32,
                list_column.column_editable(),
            ));

            index += 1;
        }

        ary_column.into_iter().map(JsValue::from).collect()
    }

    /// Parse and return an array of WasmDescriptors.
    ///
    /// # Arguments
    ///
    /// * `cf_index` - The cashflow index.
    /// * `index` - The event index of the cashflow.
    /// * `table_type_param` - The type of table (event or amortization).
    ///
    /// # Return
    ///
    /// * See description.

    pub fn parse_descriptors(&self, cf_index: i32, index: u32, table_type_param: u32) -> Array {
        if cf_index < 0 {
            return Array::new();
        }

        let calc_mgr = self.engine.calc_mgr();
        if !calc_mgr.list_cashflow().get_element(cf_index as usize) {
            return Array::new();
        }

        match table_type_param {
            TABLE_AM => match calc_mgr.list_cashflow().list_amortization() {
                None => Array::new(),
                Some(o) => {
                    if !o.get_element(index as usize) {
                        return Array::new();
                    }

                    match o.list_descriptor() {
                        None => Array::new(),
                        Some(o2) => {
                            let mut list: Vec<WasmDescriptor> = Vec::new();
                            let orig_index = o2.index();
                            let mut index: usize = 0;
                            loop {
                                if !o2.get_element(index) {
                                    break;
                                }
                                list.push(WasmDescriptor::new(
                                    o2.group(),
                                    o2.name(),
                                    o2.desc_type(),
                                    o2.code(),
                                    o2.value().as_str(),
                                    o2.value_expr().as_str(),
                                    o2.propagate(),
                                    o2.list_event_index() as u32,
                                ));
                                index += 1;
                            }
                            o2.get_element(orig_index);
                            list.into_iter().map(JsValue::from).collect()
                        }
                    }
                }
            },
            _ => match calc_mgr.list_cashflow().list_event() {
                None => Array::new(),
                Some(o) => {
                    if !o.get_element(index as usize) {
                        return Array::new();
                    }

                    match o.list_descriptor() {
                        None => Array::new(),
                        Some(o2) => {
                            let mut list: Vec<WasmDescriptor> = Vec::new();
                            let orig_index = o2.index();
                            let mut index: usize = 0;
                            loop {
                                if !o2.get_element(index) {
                                    break;
                                }
                                list.push(WasmDescriptor::new(
                                    o2.group(),
                                    o2.name(),
                                    o2.desc_type(),
                                    o2.code(),
                                    o2.value().as_str(),
                                    o2.value_expr().as_str(),
                                    o2.propagate(),
                                    o2.list_event_index() as u32,
                                ));
                                index += 1;
                            }
                            o2.get_element(orig_index);
                            list.into_iter().map(JsValue::from).collect()
                        }
                    }
                }
            },
        }
    }

    /// Parse and return an array of WasmParameters.
    ///
    /// # Arguments
    ///
    /// * `cf_index` - The cashflow index.
    /// * `index` - The event index of the cashflow.
    /// * `table_type_param` - The type of table (event or amortization).
    ///
    /// # Return
    ///
    /// * See description.

    pub fn parse_parameters(&self, cf_index: i32, index: u32, table_type_param: u32) -> Array {
        if cf_index < 0 {
            return Array::new();
        }

        let calc_mgr = self.engine.calc_mgr();
        if !calc_mgr.list_cashflow().get_element(cf_index as usize) {
            return Array::new();
        }

        match table_type_param {
            TABLE_AM => match calc_mgr.list_cashflow().list_amortization() {
                None => Array::new(),
                Some(o) => {
                    if !o.get_element(index as usize) {
                        return Array::new();
                    }

                    match o.list_parameter() {
                        None => Array::new(),
                        Some(o2) => {
                            let mut list: Vec<WasmParameter> = Vec::new();
                            let orig_index = o2.index();
                            let mut index: usize = 0;
                            loop {
                                if !o2.get_element(index) {
                                    break;
                                }
                                list.push(WasmParameter::new(
                                    o2.name(),
                                    o2.label(),
                                    o2.description(),
                                    CoreUtility::get_param_type(o2.param_type()).as_str(),
                                    o2.param_integeri(),
                                    o2.param_decimal().to_string().as_str(),
                                    o2.param_string(),
                                ));
                                index += 1;
                            }
                            o2.get_element(orig_index);
                            list.into_iter().map(JsValue::from).collect()
                        }
                    }
                }
            },
            _ => match calc_mgr.list_cashflow().list_event() {
                None => Array::new(),
                Some(o) => {
                    if !o.get_element(index as usize) {
                        return Array::new();
                    }

                    match o.list_parameter() {
                        None => Array::new(),
                        Some(o2) => {
                            let mut list: Vec<WasmParameter> = Vec::new();
                            let orig_index = o2.index();
                            let mut index: usize = 0;
                            loop {
                                if !o2.get_element(index) {
                                    break;
                                }
                                list.push(WasmParameter::new(
                                    o2.name(),
                                    o2.label(),
                                    o2.description(),
                                    CoreUtility::get_param_type(o2.param_type()).as_str(),
                                    o2.param_integeri(),
                                    o2.param_decimal().to_string().as_str(),
                                    o2.param_string(),
                                ));
                                index += 1;
                            }
                            o2.get_element(orig_index);
                            list.into_iter().map(JsValue::from).collect()
                        }
                    }
                }
            },
        }
    }

    /// Parse and return an array of WasmSummary elements.
    ///
    /// # Arguments
    ///
    /// * `cf_index` - The cashflow index.
    ///
    /// # Return
    ///
    /// * See description.

    pub fn parse_summary(&self, cf_index: i32) -> Array {
        if cf_index < 0 {
            return Array::new();
        }

        let calc_mgr = self.engine.calc_mgr();
        if !calc_mgr.list_cashflow().get_element(cf_index as usize) {
            return Array::new();
        }

        let mut ary_summary: Vec<WasmElemSummary> = Vec::new();
        let list_summary = self.engine.parse_summary();
        let mut index: usize = 0;

        loop {
            if !list_summary.get_element(index) {
                break;
            }

            ary_summary.push(WasmElemSummary::new(
                list_summary.name(),
                list_summary.label(),
                list_summary.label_expr(),
                list_summary.result(),
                list_summary.result_expr(),
            ));

            index += 1;
        }

        ary_summary.into_iter().map(JsValue::from).collect()
    }

    /// Remove the indicated cashflow.
    ///
    /// # Arguments
    ///
    /// * `cf_index` - The cashflow index.
    ///
    /// # Return
    ///
    /// * True if successful.

    pub fn remove_cashflow(&self, cf_index: i32) -> bool {
        if cf_index < 0 {
            return false;
        }

        {
            let calc_mgr = self.engine.calc_mgr();

            if !calc_mgr.list_cashflow().get_element(cf_index as usize) {
                return false;
            }
        }

        self.engine.calc_mgr_mut().list_cashflow_mut().remove()
    }

    /// Remove the indicated event for the selected cashflow.
    ///
    /// # Arguments
    ///
    /// * `cf_index` - The cashflow index.
    /// * `index` - The event index.
    ///
    /// # Return
    ///
    /// * True if successful.

    pub fn remove_event(&self, cf_index: i32, index: u32) -> bool {
        let mut result: bool = false;
        if cf_index < 0 {
            return result;
        }

        {
            let calc_mgr = self.engine.calc_mgr();

            if !calc_mgr.list_cashflow().get_element(cf_index as usize) {
                return result;
            }

            match calc_mgr.list_cashflow().list_event() {
                None => {
                    return result;
                }
                Some(o) => {
                    if !o.get_element(index as usize) {
                        return result;
                    }
                }
            }
        }

        match self
            .engine
            .calc_mgr_mut()
            .list_cashflow_mut()
            .list_event_mut()
        {
            None => return result,
            Some(o) => {
                result = o.remove();
            }
        }

        match self.engine.balance_cashflow() {
            Err(_e) => {}
            Ok(_o) => {}
        }

        result
    }

    /// Serialize and return the selected cashflow.
    ///
    /// # Arguments
    ///
    /// * `cf_index` - The cashflow index.
    /// * `options` - Serialization options.
    ///
    /// # Return
    ///
    /// * Returns serialized cashflow.

    pub fn serialize(&self, cf_index: i32, options: u32) -> String {
        if cf_index < 0 {
            return String::from("");
        }

        if !self
            .engine
            .calc_mgr()
            .list_cashflow()
            .get_element(cf_index as usize)
        {
            return String::from("");
        }

        let json = CalcJsonSerialize::new(self.engine.calc_manager());

        json.serialize(options as usize)
    }

    /// Set the appropriate event list value and
    /// return it as a string.
    ///
    /// # Arguments
    ///
    /// * `col_name_index_param` - Column name index.
    /// * `type_param` - Column type.
    /// * `code_param` - Column code.
    /// * `cf_index_param` - The cashflow index.
    /// * `index_param` - Event row index.
    /// * `value_param` - Value to set as a string.
    ///
    /// # Return
    ///
    /// * See description.

    pub fn set_event_value(
        &self,
        col_name_index_param: u32,
        type_param: &str,
        code_param: &str,
        cf_index_param: i32,
        index_param: u32,
        value_param: &str,
    ) -> String {
        if cf_index_param < 0 {
            return String::from("");
        }

        {
            let calc_mgr = self.engine.calc_mgr();

            if !calc_mgr
                .list_cashflow()
                .get_element(cf_index_param as usize)
            {
                return String::from("");
            }

            match calc_mgr.list_cashflow().list_event() {
                None => {
                    return String::from("");
                }
                Some(o) => {
                    o.get_element(index_param as usize);
                }
            }
        }

        let mut event_date = String::from("");
        let mut sort_order: usize = 0;

        {
            let calc_mgr = self.engine.calc_mgr();
            let list_locale = calc_mgr.list_locale();

            match calc_mgr.list_cashflow().list_event() {
                None => {}
                Some(o) => {
                    event_date = list_locale.format_date_out(o.event_date());
                    sort_order = o.sort_order();
                }
            }
        }

        let result = self.engine.set_event_value(
            col_name_index_param as usize,
            type_param,
            code_param,
            index_param as usize,
            value_param,
        );

        match self.engine.balance_cashflow() {
            Err(_e) => String::from(""),
            Ok(_o) => format!("{}|{}|{}", event_date, sort_order, result),
        }
    }

    /// Set the appropriate event list extension values.
    ///
    /// # Arguments
    ///
    /// * `cf_index_param` - The cashflow index.
    /// * `index_param` - Event row index.
    /// * `ext_param` - Extension values to set.
    ///
    /// # Return
    ///
    /// * True if successful, otherwise false.

    pub fn set_extension_values(
        &self,
        cf_index_param: i32,
        index_param: u32,
        ext_param: &str,
    ) -> String {
        if cf_index_param < 0 {
            return String::from("");
        }

        {
            let calc_mgr = self.engine.calc_mgr();

            if !calc_mgr
                .list_cashflow()
                .get_element(cf_index_param as usize)
            {
                return String::from("");
            }
        }

        let ext: ElemExtension;

        {
            let json = CalcJsonDeserialize::new(self.engine.calc_manager());
            match json.deserialize_extension_from_str(ext_param) {
                Err(_e) => {
                    return String::from("");
                }
                Ok(o) => {
                    ext = o;
                }
            }
        }

        if !self.engine.set_extension_values(index_param as usize, &ext) {
            return String::from("");
        }

        self.engine.evaluate_cashflow_event_type_all();

        let mut result = String::from("");

        {
            let calc_mgr = self.engine.calc_mgr();
            let list_cashflow = calc_mgr.list_cashflow();
            let list_event_opt = list_cashflow.list_event();

            match list_event_opt {
                None => {}
                Some(o) => {
                    let orig_index = o.index();
                    if o.get_element(index_param as usize) {
                        result = String::from(o.event_type());
                        o.get_element(orig_index);
                    }
                }
            }
        }

        match self.engine.balance_cashflow() {
            Err(_e) => String::from(""),
            Ok(_o) => result,
        }
    }

    /// Set the appropriate event list parameter values.
    ///
    /// # Arguments
    ///
    /// * `cf_index` - The cashflow index.
    /// * `index_param` - Event row index.
    /// * `parameters` - Parameters to set.
    ///
    /// # Return
    ///
    /// * True if successful, otherwise false.

    pub fn set_parameter_values(&self, cf_index: i32, index_param: u32, parameters: &str) -> bool {
        if cf_index < 0 {
            return false;
        }

        {
            let calc_mgr = self.engine.calc_mgr();

            if !calc_mgr.list_cashflow().get_element(cf_index as usize) {
                return false;
            }
        }

        let mut values: Vec<String> = Vec::new();
        for param in parameters.split('|') {
            values.push(String::from(param));
        }

        if !self
            .engine
            .set_parameter_values(index_param as usize, values)
        {
            return false;
        }

        true
    }

    /// Set selected user or cashflow preferences.
    ///
    /// # Arguments
    ///
    /// * `cf_index` - The cashflow index or -1 for user preferences.
    ///
    /// # Return
    ///
    /// * See description.

    pub fn set_preferences(&self, cf_index: i32, prefs: &WasmElemPreferences) -> bool {
        if cf_index >= 0 {
            let calc_mgr = self.engine.calc_mgr();
            calc_mgr.list_cashflow().get_element(cf_index as usize);
        }

        let mut calc_mgr = self.engine.calc_mgr_mut();
        let elem_prefs: &mut ElemPreferences;

        if cf_index >= 0 {
            match calc_mgr.list_cashflow_mut().preferences_mut() {
                None => {
                    elem_prefs = calc_mgr.preferences_mut();
                }
                Some(o) => {
                    elem_prefs = o;
                }
            }
        } else {
            elem_prefs = calc_mgr.preferences_mut();
        }

        elem_prefs.set_cross_rate_code(prefs.cross_rate_code().as_str());
        elem_prefs.set_default_encoding(prefs.default_encoding().as_str());
        elem_prefs.set_fiscal_year_start(prefs.fiscal_year_start() as usize);
        elem_prefs.set_decimal_digits(prefs.decimal_digits() as usize);
        elem_prefs.set_target(CoreUtility::parse_decimal(prefs.target().as_str()));

        true
    }

    /// Parse and return the cashflow's event values for the table type.
    ///
    /// # Arguments
    ///
    /// * `cf_index` - The cashflow index.
    /// * `table_type_param` - The type of table (event or amortization).
    ///
    /// # Return
    ///
    /// * Return a string that can be directly loaded into ag-grid.

    pub fn table_values(&self, cf_index: i32, table_type_param: u32) -> String {
        if cf_index < 0 {
            return String::from("");
        }

        let calc_mgr = self.engine.calc_mgr();

        if !calc_mgr.list_cashflow().get_element(cf_index as usize) {
            return String::from("");
        }

        let table_type: TableType;
        match table_type_param {
            TABLE_AM => {
                table_type = TableType::Amortization;
            }
            _ => {
                table_type = TableType::Event;
            }
        }

        let list_column = self.engine.parse_columns(table_type);

        let json = CalcJsonSerialize::new(self.engine.calc_manager());

        match table_type_param {
            TABLE_AM => {
                let mut list_am: ListAmortization;
                let mut cresult = String::from("");
                match calc_mgr
                    .list_cashflow()
                    .create_cashflow_output(true, false, false, false, true)
                {
                    Err(_e) => {
                        return cresult;
                    }
                    Ok(o) => {
                        list_am = o;
                    }
                }

                let mut row_index: usize = 0;
                loop {
                    if !list_am.get_element(row_index as usize) {
                        break;
                    }
                    let mut row = json.serialize_extension(
                        list_am.elem_extension(),
                        list_am.value(),
                        list_am.frequency(),
                        false,
                        true,
                    );

                    let orig_index = list_column.index();
                    let mut index: usize = 0;
                    loop {
                        if !list_column.get_element(index) {
                            break;
                        }
                        let val = self.engine.am_value(list_column.column(), &list_am);
                        row = format!("{},\"{}\":\"{}\"", row, list_column.col_name(), val);
                        index += 1;
                    }
                    list_column.get_element(orig_index);

                    let delimiter = if row_index == 0 { "" } else { "," };
                    cresult = format!("{}{}{{{}}}", cresult, delimiter, row);

                    row_index += 1;
                }

                cresult = format!("\"compressed\": [{}]", cresult);

                let mut eresult = String::from("");
                match calc_mgr
                    .list_cashflow()
                    .create_cashflow_output(false, false, false, false, true)
                {
                    Err(_e) => {
                        return eresult;
                    }
                    Ok(o) => {
                        list_am = o;
                    }
                }

                row_index = 0;
                loop {
                    if !list_am.get_element(row_index as usize) {
                        break;
                    }
                    let mut row = json.serialize_extension(
                        list_am.elem_extension(),
                        list_am.value(),
                        list_am.frequency(),
                        false,
                        true,
                    );

                    let orig_index = list_column.index();
                    let mut index: usize = 0;
                    loop {
                        if !list_column.get_element(index) {
                            break;
                        }
                        let val = self.engine.am_value(list_column.column(), &list_am);
                        row = format!("{},\"{}\":\"{}\"", row, list_column.col_name(), val);
                        index += 1;
                    }
                    list_column.get_element(orig_index);

                    let delimiter = if row_index == 0 { "" } else { "," };
                    eresult = format!("{}{}{{{}}}", eresult, delimiter, row);

                    row_index += 1;
                }

                eresult = format!("\"expanded\": [{}]", eresult);

                format!("{{{},{}}}", cresult, eresult)
            }
            _ => {
                let mut result = String::from("");
                let mut row_index: usize = 0;
                loop {
                    let mut row = String::from("");
                    let mut next_name = String::from("");
                    match calc_mgr.list_cashflow().list_event() {
                        None => {
                            String::from("");
                        }
                        Some(o) => {
                            if !o.get_element(row_index as usize) {
                                break;
                            }

                            row = json.serialize_extension(
                                o.elem_extension(),
                                dec!(0.0),
                                o.frequency(),
                                false,
                                true,
                            );
                            next_name = String::from(o.next_name());
                        }
                    }

                    let mut next_name_seen = false;
                    let orig_index = list_column.index();
                    let mut index: usize = 0;
                    loop {
                        if !list_column.get_element(index) {
                            break;
                        }
                        let val = self.engine.event_value(list_column.column());
                        row = format!("{},\"{}\":\"{}\"", row, list_column.col_name(), val);
                        if !next_name_seen {
                            next_name_seen = list_column.col_name() == "Next-name";
                        }
                        index += 1;
                    }
                    list_column.get_element(orig_index);

                    if !next_name_seen {
                        row = format!("{},\"{}\":\"{}\"", row, "Next-name", next_name);
                    }

                    let delimiter = if row_index == 0 { "" } else { "," };
                    result = format!("{}{}{{{}}}", result, delimiter, row);

                    row_index += 1;
                }

                format!("[{}]", result)
            }
        }
    }
}
