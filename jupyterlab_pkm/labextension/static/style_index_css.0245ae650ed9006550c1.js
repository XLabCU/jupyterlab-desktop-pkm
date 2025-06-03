"use strict";
(self["webpackChunk_jupyterlab_pkm_extension"] = self["webpackChunk_jupyterlab_pkm_extension"] || []).push([["style_index_css"],{

/***/ "./node_modules/css-loader/dist/cjs.js!./style/index.css":
/*!***************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./style/index.css ***!
  \***************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_jupyterlab_application_style_index_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../node_modules/css-loader/dist/cjs.js!../node_modules/@jupyterlab/application/style/index.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/@jupyterlab/application/style/index.css");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3__);
// Imports




var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27currentColor%27%3e%3cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14%27/%3e%3c/svg%3e */ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27currentColor%27%3e%3cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14%27/%3e%3c/svg%3e"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_node_modules_jupyterlab_application_style_index_css__WEBPACK_IMPORTED_MODULE_2__["default"]);
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_3___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Main CSS file for JupyterLite PKM Extension */

/* Import JupyterLab CSS variables */

/* Wikilink styling */
.pkm-wikilink {
  color: var(--jp-content-link-color, #1976d2);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
  background-color: rgba(25, 118, 210, 0.1);
  padding: 1px 3px;
  border-radius: 3px;
}

.pkm-wikilink:hover {
  color: var(--jp-content-link-color, #1976d2);
  border-bottom-color: var(--jp-content-link-color, #1976d2);
  background-color: rgba(25, 118, 210, 0.15);
  text-decoration: none;
}

/* Broken wikilink styling */
.pkm-wikilink-broken {
  color: var(--jp-error-color1, #d32f2f);
  background-color: rgba(211, 47, 47, 0.1);
  border-bottom: 1px dashed var(--jp-error-color1, #d32f2f);
}

.pkm-wikilink-broken:hover {
  color: var(--jp-error-color1, #d32f2f);
  background-color: rgba(211, 47, 47, 0.15);
  border-bottom-color: var(--jp-error-color1, #d32f2f);
}

/* External link icon */
.pkm-external-link::after {
  content: "🔗";
  font-size: 0.8em;
  margin-left: 3px;
  opacity: 0.7;
}

/* Alternative external link with SVG icon */
.pkm-external-link-svg::after {
  content: "";
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-left: 3px;
  background-image: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
  background-size: contain;
  background-repeat: no-repeat;
  vertical-align: text-top;
  opacity: 0.6;
}

/* Search results styling */
.pkm-search-results {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid var(--jp-border-color1);
  border-radius: 4px;
  background: var(--jp-layout-color1);
}

.pkm-search-result {
  padding: 8px 12px;
  border-bottom: 1px solid var(--jp-border-color2);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.pkm-search-result:hover {
  background-color: var(--jp-layout-color2);
}

.pkm-search-result:last-child {
  border-bottom: none;
}

.pkm-search-result-file {
  font-weight: 600;
  color: var(--jp-ui-font-color1);
  margin-bottom: 4px;
}

.pkm-search-result-preview {
  font-size: 0.9em;
  color: var(--jp-ui-font-color2);
  line-height: 1.3;
}

/* Backlinks widget styling */
.pkm-backlinks-widget {
  background: var(--jp-layout-color1);
  border: 1px solid var(--jp-border-color1);
  border-radius: 4px;
  padding: 12px;
  margin-top: 16px;
}

.pkm-backlinks-title {
  font-weight: 600;
  color: var(--jp-ui-font-color1);
  margin-bottom: 8px;
  font-size: 1.1em;
}

.pkm-backlinks-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pkm-backlinks-item {
  padding: 4px 0;
}

.pkm-backlinks-link {
  color: var(--jp-content-link-color, #1976d2);
  text-decoration: none;
  cursor: pointer;
}

.pkm-backlinks-link:hover {
  text-decoration: underline;
}

/* Code block styling with copy functionality */
.jp-RenderedMarkdown pre {
  position: relative;
  background-color: var(--jp-layout-color2, #f5f5f5) !important;
  border: 1px solid var(--jp-border-color2, #e0e0e0);
  border-radius: 6px;
  padding: 16px;
  margin: 16px 0;
  overflow-x: auto;
  font-family: var(--jp-code-font-family, 'Source Code Pro', monospace);
  font-size: var(--jp-code-font-size, 13px);
  line-height: 1.4;
}

.jp-RenderedMarkdown pre:hover .pkm-code-copy-btn,
.jp-RenderedMarkdown pre:hover .pkm-code-language {
  opacity: 1;
}

/* Copy button styling */
.pkm-code-copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--jp-layout-color1, #ffffff);
  border: 1px solid var(--jp-border-color1, #c0c0c0);
  border-radius: 4px;
  padding: 6px 8px;
  cursor: pointer;
  font-size: 11px;
  font-family: var(--jp-ui-font-family, sans-serif);
  color: var(--jp-ui-font-color1, #333333);
  opacity: 0;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  line-height: 1;
}

.pkm-code-copy-btn:hover {
  background: var(--jp-layout-color0, #f8f9fa);
  border-color: var(--jp-brand-color1, #2196f3);
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.pkm-code-copy-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.pkm-code-copy-btn.copied {
  background: var(--jp-success-color1, #4caf50);
  color: white;
  border-color: var(--jp-success-color1, #4caf50);
}

/* Copy icon */
.pkm-copy-icon {
  width: 12px;
  height: 12px;
  fill: currentColor;
}

/* Language label styling */
.pkm-code-language {
  position: absolute;
  top: 8px;
  right: 90px; /* Position to the left of the copy button */
  background: var(--jp-brand-color1, #2196f3);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  font-family: var(--jp-ui-font-family, sans-serif);
  letter-spacing: 0.5px;
  opacity: 0; /* Hidden by default, shown on hover */
  z-index: 5;
  line-height: 1;
  transition: opacity 0.2s ease;
}

/* Language-specific colors */
.pkm-code-language.python {
  background: #3776ab;
}

.pkm-code-language.r {
  background: #276dc3;
}

.pkm-code-language.javascript {
  background: #f7df1e;
  color: #000000;
}

.pkm-code-language.bash, .pkm-code-language.shell {
  background: #4eaa25;
}

.pkm-code-language.sql {
  background: #e38c00;
}

.pkm-code-language.json {
  background: #292929;
}

.pkm-code-language.css {
  background: #1572b6;
}

.pkm-code-language.html {
  background: #e34f26;
}

/* Code block content adjustments */
.jp-RenderedMarkdown pre code {
  background: transparent !important;
  padding: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  font-size: inherit;
  line-height: inherit;
  display: block;
  overflow-x: auto;
}

/* Inline code styling (not affected by copy buttons) */
.jp-RenderedMarkdown p code,
.jp-RenderedMarkdown li code,
.jp-RenderedMarkdown td code,
.jp-RenderedMarkdown th code {
  background: var(--jp-layout-color2, #f5f5f5) !important;
  border: 1px solid var(--jp-border-color2, #e0e0e0);
  border-radius: 3px;
  padding: 2px 4px;
  font-family: var(--jp-code-font-family, 'Source Code Pro', monospace);
  font-size: 0.9em;
  color: var(--jp-content-font-color1, #333333);
}`, "",{"version":3,"sources":["webpack://./style/index.css"],"names":[],"mappings":"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","sourcesContent":["/* Main CSS file for JupyterLite PKM Extension */\n\n/* Import JupyterLab CSS variables */\n@import url('~@jupyterlab/application/style/index.css');\n\n/* Wikilink styling */\n.pkm-wikilink {\n  color: var(--jp-content-link-color, #1976d2);\n  text-decoration: none;\n  border-bottom: 1px solid transparent;\n  transition: all 0.2s ease;\n  cursor: pointer;\n  background-color: rgba(25, 118, 210, 0.1);\n  padding: 1px 3px;\n  border-radius: 3px;\n}\n\n.pkm-wikilink:hover {\n  color: var(--jp-content-link-color, #1976d2);\n  border-bottom-color: var(--jp-content-link-color, #1976d2);\n  background-color: rgba(25, 118, 210, 0.15);\n  text-decoration: none;\n}\n\n/* Broken wikilink styling */\n.pkm-wikilink-broken {\n  color: var(--jp-error-color1, #d32f2f);\n  background-color: rgba(211, 47, 47, 0.1);\n  border-bottom: 1px dashed var(--jp-error-color1, #d32f2f);\n}\n\n.pkm-wikilink-broken:hover {\n  color: var(--jp-error-color1, #d32f2f);\n  background-color: rgba(211, 47, 47, 0.15);\n  border-bottom-color: var(--jp-error-color1, #d32f2f);\n}\n\n/* External link icon */\n.pkm-external-link::after {\n  content: \"🔗\";\n  font-size: 0.8em;\n  margin-left: 3px;\n  opacity: 0.7;\n}\n\n/* Alternative external link with SVG icon */\n.pkm-external-link-svg::after {\n  content: \"\";\n  display: inline-block;\n  width: 12px;\n  height: 12px;\n  margin-left: 3px;\n  background-image: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'/%3e%3c/svg%3e\");\n  background-size: contain;\n  background-repeat: no-repeat;\n  vertical-align: text-top;\n  opacity: 0.6;\n}\n\n/* Search results styling */\n.pkm-search-results {\n  max-height: 400px;\n  overflow-y: auto;\n  border: 1px solid var(--jp-border-color1);\n  border-radius: 4px;\n  background: var(--jp-layout-color1);\n}\n\n.pkm-search-result {\n  padding: 8px 12px;\n  border-bottom: 1px solid var(--jp-border-color2);\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n}\n\n.pkm-search-result:hover {\n  background-color: var(--jp-layout-color2);\n}\n\n.pkm-search-result:last-child {\n  border-bottom: none;\n}\n\n.pkm-search-result-file {\n  font-weight: 600;\n  color: var(--jp-ui-font-color1);\n  margin-bottom: 4px;\n}\n\n.pkm-search-result-preview {\n  font-size: 0.9em;\n  color: var(--jp-ui-font-color2);\n  line-height: 1.3;\n}\n\n/* Backlinks widget styling */\n.pkm-backlinks-widget {\n  background: var(--jp-layout-color1);\n  border: 1px solid var(--jp-border-color1);\n  border-radius: 4px;\n  padding: 12px;\n  margin-top: 16px;\n}\n\n.pkm-backlinks-title {\n  font-weight: 600;\n  color: var(--jp-ui-font-color1);\n  margin-bottom: 8px;\n  font-size: 1.1em;\n}\n\n.pkm-backlinks-list {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n\n.pkm-backlinks-item {\n  padding: 4px 0;\n}\n\n.pkm-backlinks-link {\n  color: var(--jp-content-link-color, #1976d2);\n  text-decoration: none;\n  cursor: pointer;\n}\n\n.pkm-backlinks-link:hover {\n  text-decoration: underline;\n}\n\n/* Code block styling with copy functionality */\n.jp-RenderedMarkdown pre {\n  position: relative;\n  background-color: var(--jp-layout-color2, #f5f5f5) !important;\n  border: 1px solid var(--jp-border-color2, #e0e0e0);\n  border-radius: 6px;\n  padding: 16px;\n  margin: 16px 0;\n  overflow-x: auto;\n  font-family: var(--jp-code-font-family, 'Source Code Pro', monospace);\n  font-size: var(--jp-code-font-size, 13px);\n  line-height: 1.4;\n}\n\n.jp-RenderedMarkdown pre:hover .pkm-code-copy-btn,\n.jp-RenderedMarkdown pre:hover .pkm-code-language {\n  opacity: 1;\n}\n\n/* Copy button styling */\n.pkm-code-copy-btn {\n  position: absolute;\n  top: 8px;\n  right: 8px;\n  background: var(--jp-layout-color1, #ffffff);\n  border: 1px solid var(--jp-border-color1, #c0c0c0);\n  border-radius: 4px;\n  padding: 6px 8px;\n  cursor: pointer;\n  font-size: 11px;\n  font-family: var(--jp-ui-font-family, sans-serif);\n  color: var(--jp-ui-font-color1, #333333);\n  opacity: 0;\n  transition: all 0.2s ease;\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  z-index: 10;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n  line-height: 1;\n}\n\n.pkm-code-copy-btn:hover {\n  background: var(--jp-layout-color0, #f8f9fa);\n  border-color: var(--jp-brand-color1, #2196f3);\n  transform: translateY(-1px);\n  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);\n}\n\n.pkm-code-copy-btn:active {\n  transform: translateY(0);\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);\n}\n\n.pkm-code-copy-btn.copied {\n  background: var(--jp-success-color1, #4caf50);\n  color: white;\n  border-color: var(--jp-success-color1, #4caf50);\n}\n\n/* Copy icon */\n.pkm-copy-icon {\n  width: 12px;\n  height: 12px;\n  fill: currentColor;\n}\n\n/* Language label styling */\n.pkm-code-language {\n  position: absolute;\n  top: 8px;\n  right: 90px; /* Position to the left of the copy button */\n  background: var(--jp-brand-color1, #2196f3);\n  color: white;\n  padding: 4px 8px;\n  border-radius: 4px;\n  font-size: 10px;\n  font-weight: 500;\n  text-transform: uppercase;\n  font-family: var(--jp-ui-font-family, sans-serif);\n  letter-spacing: 0.5px;\n  opacity: 0; /* Hidden by default, shown on hover */\n  z-index: 5;\n  line-height: 1;\n  transition: opacity 0.2s ease;\n}\n\n/* Language-specific colors */\n.pkm-code-language.python {\n  background: #3776ab;\n}\n\n.pkm-code-language.r {\n  background: #276dc3;\n}\n\n.pkm-code-language.javascript {\n  background: #f7df1e;\n  color: #000000;\n}\n\n.pkm-code-language.bash, .pkm-code-language.shell {\n  background: #4eaa25;\n}\n\n.pkm-code-language.sql {\n  background: #e38c00;\n}\n\n.pkm-code-language.json {\n  background: #292929;\n}\n\n.pkm-code-language.css {\n  background: #1572b6;\n}\n\n.pkm-code-language.html {\n  background: #e34f26;\n}\n\n/* Code block content adjustments */\n.jp-RenderedMarkdown pre code {\n  background: transparent !important;\n  padding: 0 !important;\n  border: none !important;\n  border-radius: 0 !important;\n  font-size: inherit;\n  line-height: inherit;\n  display: block;\n  overflow-x: auto;\n}\n\n/* Inline code styling (not affected by copy buttons) */\n.jp-RenderedMarkdown p code,\n.jp-RenderedMarkdown li code,\n.jp-RenderedMarkdown td code,\n.jp-RenderedMarkdown th code {\n  background: var(--jp-layout-color2, #f5f5f5) !important;\n  border: 1px solid var(--jp-border-color2, #e0e0e0);\n  border-radius: 3px;\n  padding: 2px 4px;\n  font-family: var(--jp-code-font-family, 'Source Code Pro', monospace);\n  font-size: 0.9em;\n  color: var(--jp-content-font-color1, #333333);\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./style/index.css":
/*!*************************!*\
  !*** ./style/index.css ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./index.css */ "./node_modules/css-loader/dist/cjs.js!./style/index.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27currentColor%27%3e%3cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14%27/%3e%3c/svg%3e":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27currentColor%27%3e%3cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14%27/%3e%3c/svg%3e ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27currentColor%27%3e%3cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14%27/%3e%3c/svg%3e";

/***/ })

}]);
//# sourceMappingURL=style_index_css.0245ae650ed9006550c1.js.map