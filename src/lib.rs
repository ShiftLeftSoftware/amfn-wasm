//! Amfn Web Assembly.
// Copyright (c) 2021 ShiftLeft Software
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

use js_sys::Array;
use wasm_bindgen::prelude::*;

use amfnengine::core::*;
use amfnengine::engine::*;
use amfnengine::*;

/// Event table.
pub const TABLE_EVENT: u32 = 0;
/// Am table.
pub const TABLE_AM: u32 = 1;

/// Wasm parameter element.
#[wasm_bindgen]
pub struct WasmParameter {
    /// Parameter name.
    name: String,
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
        sym_type_param: &str,
        int_value_param: i32,
        dec_value_param: &str,
        str_value_param: &str,
    ) -> WasmParameter {
        WasmParameter {
            name: String::from(name_param),
            sym_type: String::from(sym_type_param),
            int_value: int_value_param,
            dec_value: String::from(dec_value_param),
            str_value: String::from(str_value_param),
        }
    }

    /// Getter for name property
    #[wasm_bindgen(getter)]
    pub fn name(&self) -> String {
        String::from(self.name.as_str())
    }

    /// Setter for name property
    #[wasm_bindgen(setter)]
    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    /// Getter for sym_type property
    #[wasm_bindgen(getter)]
    pub fn sym_type(&self) -> String {
        String::from(self.sym_type.as_str())
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
        String::from(self.dec_value.as_str())
    }

    /// Setter for dec_value property
    #[wasm_bindgen(setter)]
    pub fn set_dec_value(&mut self, dec_value: String) {
        self.dec_value = dec_value;
    }

    /// Getter for str_value property
    #[wasm_bindgen(getter)]
    pub fn str_value(&self) -> String {
        String::from(self.str_value.as_str())
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
        String::from(self.group.as_str())
    }

    /// Setter for group property
    #[wasm_bindgen(setter)]
    pub fn set_group(&mut self, group: String) {
        self.group = group;
    }

    /// Getter for name property
    #[wasm_bindgen(getter)]
    pub fn name(&self) -> String {
        String::from(self.name.as_str())
    }

    /// Setter for name property
    #[wasm_bindgen(setter)]
    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    /// Getter for desc_type property
    #[wasm_bindgen(getter)]
    pub fn desc_type(&self) -> String {
        String::from(self.desc_type.as_str())
    }

    /// Setter for desc_type property
    #[wasm_bindgen(setter)]
    pub fn set_desc_type(&mut self, desc_type: String) {
        self.desc_type = desc_type;
    }

    /// Getter for code property
    #[wasm_bindgen(getter)]
    pub fn code(&self) -> String {
        String::from(self.code.as_str())
    }

    /// Setter for code property
    #[wasm_bindgen(setter)]
    pub fn set_code(&mut self, code: String) {
        self.code = code;
    }

    /// Getter for value property
    #[wasm_bindgen(getter)]
    pub fn value(&self) -> String {
        String::from(self.value.as_str())
    }

    /// Setter for value property
    #[wasm_bindgen(setter)]
    pub fn set_value(&mut self, value: String) {
        self.value = value;
    }

    /// Getter for value_expr property
    #[wasm_bindgen(getter)]
    pub fn value_expr(&self) -> String {
        String::from(self.value_expr.as_str())
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
        String::from(self.name.as_str())
    }

    /// Setter for name property
    #[wasm_bindgen(setter)]
    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    /// Getter for value property
    #[wasm_bindgen(getter)]
    pub fn value(&self) -> String {
        String::from(self.value.as_str())
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
    /// Column empty value (Enabled when >= 0).
    col_empty_value: String,
    /// Format of the column.
    format: u32,
    /// Number of significant decimal digits.
    decimal_digits: u32,
    /// Width of column.
    col_width: u32,
    /// Column exclude.
    col_exclude: bool,
    /// Column empty.
    col_empty: bool,
}

/// Wasm column element implementation.
#[wasm_bindgen]
impl WasmElemColumn {
    /// Create and return a column.
    ///
    /// # Arguments
    ///
    /// * `col_name_param` - The descriptor group.
    /// * `col_name_index_param` - The descriptor name.
    /// * `col_header_param` - The descriptor type.
    /// * `col_description_param` - The descriptor code.
    /// * `group_param` - The descriptor code.
    /// * `name_param` - The descriptor code.
    /// * `col_type_param` - The descriptor code.
    /// * `code_param` - The descriptor value.
    /// * `col_empty_value_param` - The descriptor value expression.
    /// * `format_param` - The descriptor propagate.
    /// * `decimal_digits_param` - The event list index.
    /// * `col_width_param` - The event list index.
    /// * `col_exclude_param` - The event list index.
    /// * `col_empty_param` - The event list index.
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
        col_empty_value_param: &str,
        format_param: u32,
        decimal_digits_param: u32,
        col_width_param: u32,
        col_exclude_param: bool,
        col_empty_param: bool,
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
            col_empty_value: String::from(col_empty_value_param),
            format: format_param,
            decimal_digits: decimal_digits_param,
            col_width: col_width_param,
            col_exclude: col_exclude_param,
            col_empty: col_empty_param,
        }
    }

    /// Getter for col_name property
    #[wasm_bindgen(getter)]
    pub fn col_name(&self) -> String {
        String::from(self.col_name.as_str())
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
        String::from(self.col_header.as_str())
    }

    /// Setter for col_header property
    #[wasm_bindgen(setter)]
    pub fn set_col_header(&mut self, col_header: String) {
        self.col_header = col_header;
    }

    /// Getter for col_description property
    #[wasm_bindgen(getter)]
    pub fn col_description(&self) -> String {
        String::from(self.col_description.as_str())
    }

    /// Setter for col_description property
    #[wasm_bindgen(setter)]
    pub fn set_col_description(&mut self, col_description: String) {
        self.col_description = col_description;
    }

    /// Getter for group property
    #[wasm_bindgen(getter)]
    pub fn group(&self) -> String {
        String::from(self.group.as_str())
    }

    /// Setter for group property
    #[wasm_bindgen(setter)]
    pub fn set_group(&mut self, group: String) {
        self.group = group;
    }

    /// Getter for name property
    #[wasm_bindgen(getter)]
    pub fn name(&self) -> String {
        String::from(self.name.as_str())
    }

    /// Setter for name property
    #[wasm_bindgen(setter)]
    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    /// Getter for col_type property
    #[wasm_bindgen(getter)]
    pub fn col_type(&self) -> String {
        String::from(self.col_type.as_str())
    }

    /// Setter for col_type property
    #[wasm_bindgen(setter)]
    pub fn set_col_type(&mut self, col_type: String) {
        self.col_type = col_type;
    }

    /// Getter for code property
    #[wasm_bindgen(getter)]
    pub fn code(&self) -> String {
        String::from(self.code.as_str())
    }

    /// Setter for code property
    #[wasm_bindgen(setter)]
    pub fn set_code(&mut self, code: String) {
        self.code = code;
    }

    /// Getter for col_empty_value property
    #[wasm_bindgen(getter)]
    pub fn col_empty_value(&self) -> String {
        String::from(self.col_empty_value.as_str())
    }

    /// Setter for col_empty_value property
    #[wasm_bindgen(setter)]
    pub fn set_col_empty_value(&mut self, col_empty_value: String) {
        self.col_empty_value = col_empty_value;
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

    /// Getter for col_exclude property
    #[wasm_bindgen(getter)]
    pub fn col_exclude(&self) -> bool {
        self.col_exclude
    }

    /// Setter for col_exclude property
    #[wasm_bindgen(setter)]
    pub fn set_col_exclude(&mut self, col_exclude: bool) {
        self.col_exclude = col_exclude;
    }

    /// Getter for col_empty property
    #[wasm_bindgen(getter)]
    pub fn col_empty(&self) -> bool {
        self.col_empty
    }

    /// Setter for col_empty property
    #[wasm_bindgen(setter)]
    pub fn set_col_empty(&mut self, col_empty: bool) {
        self.col_empty = col_empty;
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
        String::from(self.name.as_str())
    }

    /// Setter for name property
    #[wasm_bindgen(setter)]
    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    /// Getter for label property
    #[wasm_bindgen(getter)]
    pub fn label(&self) -> String {
        String::from(self.label.as_str())
    }

    /// Setter for label property
    #[wasm_bindgen(setter)]
    pub fn set_label(&mut self, label: String) {
        self.label = label;
    }

    /// Getter for label_expr property
    #[wasm_bindgen(getter)]
    pub fn label_expr(&self) -> String {
        String::from(self.label_expr.as_str())
    }

    /// Setter for label_expr property
    #[wasm_bindgen(setter)]
    pub fn set_label_expr(&mut self, label_expr: String) {
        self.label_expr = label_expr;
    }

    /// Getter for result property
    #[wasm_bindgen(getter)]
    pub fn result(&self) -> String {
        String::from(self.result.as_str())
    }

    /// Setter for result property
    #[wasm_bindgen(setter)]
    pub fn set_result(&mut self, result: String) {
        self.result = result;
    }

    /// Getter for result_expr property
    #[wasm_bindgen(getter)]
    pub fn result_expr(&self) -> String {
        String::from(self.result_expr.as_str())
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
    /// # Arguments
    ///
    /// * `locale_str_param` - The optional locale string.
    ///
    /// # Return
    ///
    /// * Return the locale string, encoding, and default decimal digits.

    pub fn init(&mut self, locale_str_param: &str) -> String {
        let mut locale_str = String::from(locale_str_param);
        let mut encoding = String::from(amfnengine::DEFAULT_ENCODING);
        let mut decimal_digits = amfnengine::DEFAULT_DECIMAL_DIGITS;

        if self.initialized {
            return locale_str;
        }

        if locale_str.is_empty() {
            locale_str = String::from(self.engine.calc_mgr().preferences().locale_str());
        }

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

    pub fn get_cashflow_status(&self, cf_index: u32, status: &str) -> String {
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
                self.engine.format_integer(result_symbol.sym_integer())
            }
            amfnengine::TokenType::Decimal => {
                self.engine.format_decimal(result_symbol.sym_decimal())
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

    pub fn get_chart_definitions(&self, cf_index: u32) -> Array {
        let mgr = self.engine.calc_mgr();

        if !mgr.list_cashflow().get_element(cf_index as usize) {
            return Array::new();
        }

        let mut ary_chart: Vec<WasmElemChart> = Vec::new();
        let list_descriptor = mgr.preferences().list_descriptor();
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

        match mgr.list_cashflow().preferences() {
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

    /// Initialize the selected cashflow.
    ///
    /// # Arguments
    ///
    /// * `cf_index` - The cashflow index.
    ///
    /// # Return
    ///
    /// * Returns the user locale's input format information.

    pub fn init_cashflow(&self, cf_index: u32) -> String {
        if !self.engine.init_cashflow(cf_index) {
            return String::from("");
        }

        let calc_mgr = self.engine.calc_mgr();
        let mgr = calc_mgr.mgr();
        let locale = mgr.list_locale();
        let format_in = locale.format_in(false);

        format!(
            "{}|{}|{}|{}|{}|{}|{}|{}|{}",
            calc_mgr.list_cashflow().name(),
            format_in.date_regex(),
            format_in.date_replace(),
            format_in.integer_regex(),
            format_in.integer_replace(),
            format_in.decimal_regex(),
            format_in.decimal_replace(),
            format_in.currency_regex(),
            format_in.currency_replace()
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

    pub fn init_cashflow_status(&self, cf_index: u32) -> String {
        let calc_mgr = self.engine.calc_mgr();

        if !calc_mgr.list_cashflow().get_element(cf_index as usize) {
            return String::from("");
        }

        let mgr = calc_mgr.mgr();
        let locale = mgr.list_locale();
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

    pub fn parse_columns(&self, cf_index: u32, table_type_param: u32) -> Array {
        let mgr = self.engine.calc_mgr();

        if !mgr.list_cashflow().get_element(cf_index as usize) {
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
        let list_column = mgr.util_parse_columns(table_type);
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
                list_column.column_empty_value().to_string().as_str(),
                list_column.col_name(),
                list_column.format() as u32,
                list_column.decimal_digits() as u32,
                list_column.column_width() as u32,
                list_column.column_exclude(),
                list_column.column_empty(),
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

    pub fn parse_descriptors(&self, cf_index: u32, index: u32, table_type_param: u32) -> Array {
        let mgr = self.engine.calc_mgr();

        if !mgr.list_cashflow().get_element(cf_index as usize) {
            return Array::new();
        }

        match table_type_param {
            TABLE_AM => match mgr.list_cashflow().list_amortization() {
                None => Array::new(),
                Some(o) => {
                    if !o.get_element(index as usize) {
                        return Array::new();
                    }

                    match o.list_descriptor() {
                        None => Array::new(),
                        Some(o2) => {
                            let mut list: Vec<WasmDescriptor> = Vec::new();
                            for param in o2.list() {
                                list.push(WasmDescriptor::new(
                                    param.group(),
                                    param.name(),
                                    param.desc_type(),
                                    param.code(),
                                    param.value().as_str(),
                                    param.value_expr().as_str(),
                                    param.propagate(),
                                    param.list_event_index() as u32,
                                ));
                            }
                            list.into_iter().map(JsValue::from).collect()
                        }
                    }
                }
            },
            _ => match mgr.list_cashflow().list_event() {
                None => Array::new(),
                Some(o) => {
                    if !o.get_element(index as usize) {
                        return Array::new();
                    }

                    match o.list_descriptor() {
                        None => Array::new(),
                        Some(o2) => {
                            let mut list: Vec<WasmDescriptor> = Vec::new();
                            for param in o2.list() {
                                list.push(WasmDescriptor::new(
                                    param.group(),
                                    param.name(),
                                    param.desc_type(),
                                    param.code(),
                                    param.value().as_str(),
                                    param.value_expr().as_str(),
                                    param.propagate(),
                                    param.list_event_index() as u32,
                                ));
                            }
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

    pub fn parse_parameters(&self, cf_index: u32, index: u32, table_type_param: u32) -> Array {
        let mgr = self.engine.calc_mgr();

        if !mgr.list_cashflow().get_element(cf_index as usize) {
            return Array::new();
        }

        match table_type_param {
            TABLE_AM => match mgr.list_cashflow().list_amortization() {
                None => Array::new(),
                Some(o) => {
                    if !o.get_element(index as usize) {
                        return Array::new();
                    }

                    match o.list_parameter() {
                        None => Array::new(),
                        Some(o2) => {
                            let mut list: Vec<WasmParameter> = Vec::new();
                            for param in o2.list() {
                                list.push(WasmParameter::new(
                                    param.name(),
                                    CoreUtility::get_param_type(param.param_type()).as_str(),
                                    param.param_integeri(),
                                    param.param_decimal().to_string().as_str(),
                                    param.param_string(),
                                ));
                            }
                            list.into_iter().map(JsValue::from).collect()
                        }
                    }
                }
            },
            _ => match mgr.list_cashflow().list_event() {
                None => Array::new(),
                Some(o) => {
                    if !o.get_element(index as usize) {
                        return Array::new();
                    }

                    match o.list_parameter() {
                        None => Array::new(),
                        Some(o2) => {
                            let mut list: Vec<WasmParameter> = Vec::new();
                            for param in o2.list() {
                                list.push(WasmParameter::new(
                                    param.name(),
                                    CoreUtility::get_param_type(param.param_type()).as_str(),
                                    param.param_integeri(),
                                    param.param_decimal().to_string().as_str(),
                                    param.param_string(),
                                ));
                            }
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

    pub fn parse_summary(&self, cf_index: u32) -> Array {
        let mgr = self.engine.calc_mgr();

        if !mgr.list_cashflow().get_element(cf_index as usize) {
            return Array::new();
        }

        let mut ary_summary: Vec<WasmElemSummary> = Vec::new();
        let list_summary = mgr.util_parse_summary();
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

    /// Remove the selected cashflow.
    ///
    /// # Arguments
    ///
    /// * `cf_index` - The cashflow index.
    ///
    /// # Return
    ///
    /// * True if successful.

    pub fn remove_cashflow(&self, cf_index: u32) -> bool {
        {
            let mgr = self.engine.calc_mgr();

            if !mgr.list_cashflow().get_element(cf_index as usize) {
                return false;
            }
        }

        self.engine.calc_mgr_mut().list_cashflow_mut().remove()
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

    pub fn serialize(&self, cf_index: u32, options: u32) -> String {
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

    /// Return the extension information for the ElemExtension.
    ///
    /// # Arguments
    ///
    /// * `ext` - The ElemExtension.
    ///
    /// # Return
    ///
    /// * See description.

    fn table_extension(&self, ext: &ElemExtension) -> String {
        match ext.extension_type() {
            amfnengine::ExtensionType::CurrentValue => {
                format!(
                    "\"Extension\":{{\"Type\":\"CurrentValue\",\"Eom\":\"{}\",\"Passive\":\"{}\",\"Present\":\"{}\"}}",
                    ext.cv_eom(),
                    ext.cv_passive(),
                    ext.cv_present())
            }
            amfnengine::ExtensionType::InterestChange => {
                format!(
                    "\"Extension\":{{\"Type\":\"InterestChange\",\"Method\":\"{}\",\"DayCount\":\"{}\",\"DaysInYear\":\"{}\",\"EffFreq\":\"{}\",\"IntFreq\":\"{}\",\"RoundBal\":\"{}\",\"RoundDD\":\"{}\"}}",
                    amfnengine::core::CoreUtility::get_interest_method_mnemonic(ext.ic_method()),
                    amfnengine::core::CoreUtility::get_day_count_basis_mnemonic(ext.ic_day_count_basis()),
                    ext.ic_days_in_year(),
                    amfnengine::core::CoreUtility::get_frequency_mnemonic(ext.ic_effective_frequency()),
                    amfnengine::core::CoreUtility::get_frequency_mnemonic(ext.ic_interest_frequency()),
                    amfnengine::core::CoreUtility::get_round_balance(ext.ic_round_balance()),
                    ext.ic_round_decimal_digits().to_string())
            }
            amfnengine::ExtensionType::StatisticValue => {
                format!(
                    "\"Extension\":{{\"Type\":\"StatisticValue\",\"Name\":\"{}\",\"Eom\":\"{}\",\"Final\":\"{}\"}}",
                    ext.sv_name(),
                    ext.sv_eom(),
                    ext.sv_is_final())
            }
            _ => {
                format!(
                    "\"Extension\":{{\"Type\":\"PrincipalChange\",\"PcType\":\"{}\",\"Eom\":\"{}\",\"PrinFirst\":\"{}\",\"BalStats\":\"{}\",\"Auxiliary\":\"{}\",\"AuxPassive\":\"{}\"}}",
                    amfnengine::core::CoreUtility::get_principal_type_mnemonic(ext.pc_type()),
                    ext.pc_eom(),
                    ext.pc_principal_first(),
                    ext.pc_balance_statistics(),
                    ext.pc_auxiliary(),
                    ext.pc_aux_passive())
            }
        }
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

    pub fn table_values(&self, cf_index: u32, table_type_param: u32) -> String {
        let mgr = self.engine.calc_mgr();

        if !mgr.list_cashflow().get_element(cf_index as usize) {
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

        let list_column = mgr.util_parse_columns(table_type);

        match table_type_param {
            TABLE_AM => {
                let mut list_am: ListAmortization;
                let mut cresult = String::from("");
                match mgr
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
                    let mut row = self.table_extension(list_am.elem_extension());

                    for column in list_column.list() {
                        let val = mgr.util_am_value(column, &list_am);
                        row = format!("{},\"{}\":\"{}\"", row, column.col_name(), val);
                    }

                    let delimiter = if row_index == 0 { "" } else { "," };
                    cresult = format!("{}{}{{{}}}", cresult, delimiter, row);

                    row_index += 1;
                }

                cresult = format!("\"compressed\": [{}]", cresult);

                let mut eresult = String::from("");
                match mgr
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
                    let mut row = self.table_extension(list_am.elem_extension());

                    for column in list_column.list() {
                        let val = mgr.util_am_value(column, &list_am);
                        row = format!("{},\"{}\":\"{}\"", row, column.col_name(), val);
                    }

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
                    match mgr.list_cashflow().list_event() {
                        None => {
                            String::from("");
                        }
                        Some(o) => {
                            if !o.get_element(row_index as usize) {
                                break;
                            }
                            row = self.table_extension(o.elem_extension());
                        }
                    }

                    for column in list_column.list() {
                        let val = mgr.util_event_value(column);
                        row = format!("{},\"{}\":\"{}\"", row, column.col_name(), val);
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