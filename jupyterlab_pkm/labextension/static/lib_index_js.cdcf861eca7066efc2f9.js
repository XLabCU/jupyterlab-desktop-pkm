"use strict";
(self["webpackChunk_jupyterlab_pkm_extension"] = self["webpackChunk_jupyterlab_pkm_extension"] || []).push([["lib_index_js"],{

/***/ "./lib/backlinks.js":
/*!**************************!*\
  !*** ./lib/backlinks.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   backlinksPlugin: () => (/* binding */ backlinksPlugin)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/fileeditor */ "webpack/sharing/consume/default/@jupyterlab/fileeditor");
/* harmony import */ var _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/markdownviewer */ "webpack/sharing/consume/default/@jupyterlab/markdownviewer");
/* harmony import */ var _jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jupyterlab/notebook */ "webpack/sharing/consume/default/@jupyterlab/notebook");
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jupyterlab/docmanager */ "webpack/sharing/consume/default/@jupyterlab/docmanager");
/* harmony import */ var _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_5__);






const COMMAND_TOGGLE_BACKLINKS = 'pkm:toggle-backlinks-panel';
const WIKILINK_INDEX_FILE = 'wikilink-index.json';
/**
 * Widget to display backlinks in a side panel
 */
class BacklinksPanelWidget extends _lumino_widgets__WEBPACK_IMPORTED_MODULE_5__.Widget {
    constructor(app, docManager, editorTracker, markdownTracker, notebookTracker) {
        super();
        this.app = app;
        this.docManager = docManager;
        this.editorTracker = editorTracker;
        this.markdownTracker = markdownTracker;
        this.notebookTracker = notebookTracker;
        this._backlinks = [];
        this._currentPath = '';
        this._wikilinkIndex = null;
        this.addClass('jp-pkm-backlinks-panel');
        this.title.label = 'Backlinks';
        this.title.closable = true;
        this.title.iconClass = 'jp-MaterialIcon jp-LinkIcon';
        this.createUI();
        this.loadWikilinkIndex();
        this.setupTracking();
        this.setupFileWatching();
        // Trigger initial update
        setTimeout(() => {
            this.handleCurrentChanged();
        }, 100);
    }
    createUI() {
        this._container = document.createElement('div');
        this._container.className = 'jp-pkm-backlinks-content';
        this._container.style.cssText = `
      padding: 16px;
      height: 100%;
      overflow-y: auto;
      font-family: var(--jp-ui-font-family);
    `;
        this.node.appendChild(this._container);
        this.showEmptyState();
    }
    async loadWikilinkIndex() {
        try {
            console.log('Backlinks: Loading wikilink index...');
            const indexContent = await this.docManager.services.contents.get(WIKILINK_INDEX_FILE, { content: true });
            if (typeof indexContent.content === 'string') {
                this._wikilinkIndex = JSON.parse(indexContent.content);
                console.log('Backlinks: Wikilink index loaded successfully');
            }
        }
        catch (error) {
            console.warn('Backlinks: Could not load wikilink index, building new one...', error);
            await this.buildWikilinkIndex();
        }
    }
    async buildWikilinkIndex() {
        console.log('Backlinks: Building wikilink index...');
        const index = {
            links: {},
            backlinks: {},
            contexts: {},
            lastUpdated: new Date().toISOString()
        };
        try {
            // Get all markdown and notebook files recursively
            const allFiles = await this.getAllMarkdownAndNotebookFiles('');
            console.log(`Backlinks: Found ${allFiles.length} files to index`);
            for (const filePath of allFiles) {
                try {
                    const fileName = filePath.split('/').pop() || '';
                    console.log(`Backlinks: Indexing ${filePath}`);
                    const content = await this.docManager.services.contents.get(filePath, { content: true });
                    let textContent = '';
                    if (fileName.endsWith('.md')) {
                        textContent = typeof content.content === 'string' ? content.content : '';
                    }
                    else if (fileName.endsWith('.ipynb')) {
                        textContent = this.extractNotebookText(content.content);
                    }
                    // Extract wikilinks from this file
                    const wikilinks = this.extractWikilinks(textContent);
                    if (wikilinks.length > 0) {
                        index.links[filePath] = wikilinks.map(link => link.target);
                        // Build backlinks and contexts
                        for (const wikilink of wikilinks) {
                            if (!index.backlinks[wikilink.target]) {
                                index.backlinks[wikilink.target] = [];
                            }
                            index.backlinks[wikilink.target].push(filePath);
                            const contextKey = `${filePath}->${wikilink.target}`;
                            index.contexts[contextKey] = {
                                context: wikilink.context,
                                lineNumber: wikilink.lineNumber
                            };
                        }
                    }
                }
                catch (error) {
                    console.warn(`Backlinks: Error indexing ${filePath}:`, error);
                }
            }
            this._wikilinkIndex = index;
            await this.saveWikilinkIndex();
            console.log('Backlinks: Index built and saved successfully');
        }
        catch (error) {
            console.error('Backlinks: Error building wikilink index:', error);
        }
    }
    async saveWikilinkIndex() {
        if (!this._wikilinkIndex)
            return;
        try {
            await this.docManager.services.contents.save(WIKILINK_INDEX_FILE, {
                type: 'file',
                format: 'text',
                content: JSON.stringify(this._wikilinkIndex, null, 2)
            });
            console.log('Backlinks: Wikilink index saved successfully');
        }
        catch (error) {
            console.error('Backlinks: Error saving wikilink index:', error);
        }
    }
    extractWikilinks(textContent) {
        const wikilinks = [];
        const wikilinkRegex = /\[\[([^\]]+)\]\]/g;
        let match;
        while ((match = wikilinkRegex.exec(textContent)) !== null) {
            const linkText = match[1];
            const [targetFile] = linkText.split('|');
            const target = targetFile.trim();
            const lineNumber = textContent.substring(0, match.index).split('\n').length;
            const context = this.extractContext(textContent, match.index);
            wikilinks.push({ target, context, lineNumber });
        }
        return wikilinks;
    }
    async getAllMarkdownAndNotebookFiles(path) {
        const files = [];
        try {
            const listing = await this.docManager.services.contents.get(path, { type: 'directory' });
            for (const item of listing.content) {
                if (item.type === 'directory') {
                    // Recursively search subdirectories
                    const subFiles = await this.getAllMarkdownAndNotebookFiles(item.path);
                    files.push(...subFiles);
                }
                else if (item.type === 'file' && (item.name.endsWith('.md') || item.name.endsWith('.ipynb'))) {
                    files.push(item.path);
                }
            }
        }
        catch (error) {
            console.warn(`Backlinks: Could not read directory ${path}:`, error);
        }
        return files;
    }
    setupTracking() {
        // Track when user switches between files
        this.editorTracker.currentChanged.connect(this.handleCurrentChanged, this);
        this.markdownTracker.currentChanged.connect(this.handleCurrentChanged, this);
        this.notebookTracker.currentChanged.connect(this.handleCurrentChanged, this);
    }
    setupFileWatching() {
        // Listen for file saves to update the index
        this.docManager.services.contents.fileChanged.connect(this.handleFileChanged, this);
    }
    async handleFileChanged(sender, change) {
        if (!change || !change.newValue || !change.newValue.path)
            return;
        const filePath = change.newValue.path;
        const fileName = filePath.split('/').pop() || '';
        // Only process markdown and notebook files
        if (!fileName.endsWith('.md') && !fileName.endsWith('.ipynb'))
            return;
        console.log(`Backlinks: File changed: ${filePath}, updating index...`);
        await this.updateFileInIndex(filePath);
    }
    async updateFileInIndex(filePath) {
        if (!this._wikilinkIndex) {
            await this.buildWikilinkIndex();
            return;
        }
        try {
            // Remove old entries for this file
            delete this._wikilinkIndex.links[filePath];
            // Remove old backlinks pointing to this file
            for (const [target, sources] of Object.entries(this._wikilinkIndex.backlinks)) {
                this._wikilinkIndex.backlinks[target] = sources.filter(source => source !== filePath);
                if (this._wikilinkIndex.backlinks[target].length === 0) {
                    delete this._wikilinkIndex.backlinks[target];
                }
            }
            // Remove old contexts for this file
            for (const contextKey of Object.keys(this._wikilinkIndex.contexts)) {
                if (contextKey.startsWith(`${filePath}->`)) {
                    delete this._wikilinkIndex.contexts[contextKey];
                }
            }
            // Re-index this file
            const content = await this.docManager.services.contents.get(filePath, { content: true });
            const fileName = filePath.split('/').pop() || '';
            let textContent = '';
            if (fileName.endsWith('.md')) {
                textContent = typeof content.content === 'string' ? content.content : '';
            }
            else if (fileName.endsWith('.ipynb')) {
                textContent = this.extractNotebookText(content.content);
            }
            const wikilinks = this.extractWikilinks(textContent);
            if (wikilinks.length > 0) {
                this._wikilinkIndex.links[filePath] = wikilinks.map(link => link.target);
                for (const wikilink of wikilinks) {
                    if (!this._wikilinkIndex.backlinks[wikilink.target]) {
                        this._wikilinkIndex.backlinks[wikilink.target] = [];
                    }
                    this._wikilinkIndex.backlinks[wikilink.target].push(filePath);
                    const contextKey = `${filePath}->${wikilink.target}`;
                    this._wikilinkIndex.contexts[contextKey] = {
                        context: wikilink.context,
                        lineNumber: wikilink.lineNumber
                    };
                }
            }
            this._wikilinkIndex.lastUpdated = new Date().toISOString();
            await this.saveWikilinkIndex();
            // Refresh backlinks if this affects the current file
            if (this._currentPath) {
                this.updateBacklinks();
            }
        }
        catch (error) {
            console.error(`Backlinks: Error updating index for ${filePath}:`, error);
        }
    }
    handleCurrentChanged() {
        console.log('Backlinks: handleCurrentChanged called');
        // Get the currently active widget from the shell
        const currentWidget = this.app.shell.currentWidget;
        let currentPath = '';
        if (currentWidget) {
            // Check if the current widget has a context with a path
            const context = currentWidget.context;
            if (context && context.path) {
                const path = context.path;
                if (path.endsWith('.md') || path.endsWith('.ipynb')) {
                    currentPath = path;
                }
            }
        }
        console.log(`Backlinks: Active widget path: "${currentPath}"`);
        console.log('Backlinks: Previous path:', this._currentPath);
        if (currentPath !== this._currentPath) {
            this._currentPath = currentPath;
            console.log('Backlinks: Path changed, updating backlinks for:', currentPath);
            this.updateBacklinks();
        }
        else {
            console.log('Backlinks: Path unchanged, no update needed');
        }
    }
    showEmptyState() {
        this._container.innerHTML = `
      <div class="jp-pkm-backlinks-empty" style="text-align: center; color: var(--jp-ui-font-color2); margin-top: 40px;">
        <div style="font-size: 24px; margin-bottom: 16px;">🔗</div>
        <div style="margin-bottom: 8px;">No backlinks found</div>
        <div style="font-size: 12px;">Open a markdown or notebook file to see its backlinks</div>
      </div>
    `;
    }
    updateBacklinks() {
        console.log('Backlinks: updateBacklinks called for path:', this._currentPath);
        this._backlinks = [];
        if (!this._currentPath) {
            this.showEmptyState();
            return;
        }
        if (!this._wikilinkIndex) {
            this._container.innerHTML = '<div class="jp-pkm-backlinks-empty">Wikilink index not loaded</div>';
            return;
        }
        // Get the target filename for lookup
        const currentFileName = (() => {
            const fullName = this._currentPath.split('/').pop() || '';
            if (fullName.endsWith('.ipynb')) {
                return fullName; // Keep full name for notebooks
            }
            return fullName.replace(/\.[^/.]+$/, ''); // Strip extension for markdown
        })();
        console.log('Backlinks: Looking for backlinks to file:', currentFileName);
        // Look up backlinks from the index
        const sourceFiles = this._wikilinkIndex.backlinks[currentFileName] || [];
        console.log('Backlinks: Found source files:', sourceFiles);
        this._backlinks = sourceFiles.map(sourceFile => {
            const contextKey = `${sourceFile}->${currentFileName}`;
            const contextData = this._wikilinkIndex.contexts[contextKey];
            return {
                sourceFile,
                targetFile: this._currentPath,
                context: (contextData === null || contextData === void 0 ? void 0 : contextData.context) || '',
                lineNumber: (contextData === null || contextData === void 0 ? void 0 : contextData.lineNumber) || 1
            };
        });
        console.log('Backlinks: Found', this._backlinks.length, 'backlinks:', this._backlinks);
        this.renderBacklinks();
    }
    extractNotebookText(notebookContent) {
        if (!notebookContent || !notebookContent.cells || !Array.isArray(notebookContent.cells)) {
            console.log('Backlinks: Invalid notebook content structure');
            return '';
        }
        const markdownCells = notebookContent.cells.filter((cell) => cell.cell_type === 'markdown');
        console.log(`Backlinks: Found ${markdownCells.length} markdown cells in notebook`);
        const textParts = [];
        for (const cell of markdownCells) {
            let cellText = '';
            if (typeof cell.source === 'string') {
                cellText = cell.source;
            }
            else if (Array.isArray(cell.source)) {
                cellText = cell.source.join('');
            }
            else if (cell.source) {
                // Handle any other source format
                cellText = String(cell.source);
            }
            if (cellText.trim()) {
                textParts.push(cellText);
            }
        }
        const result = textParts.join('\n');
        console.log(`Backlinks: Extracted ${result.length} characters from notebook markdown cells`);
        return result;
    }
    extractContext(content, matchIndex) {
        const lines = content.split('\n');
        const position = content.substring(0, matchIndex).split('\n').length - 1;
        const contextRadius = 1;
        const startLine = Math.max(0, position - contextRadius);
        const endLine = Math.min(lines.length - 1, position + contextRadius);
        return lines.slice(startLine, endLine + 1).join('\n').trim();
    }
    renderBacklinks() {
        this._container.innerHTML = '';
        if (this._backlinks.length === 0) {
            this.showEmptyState();
            return;
        }
        const header = document.createElement('div');
        header.className = 'jp-pkm-backlinks-header';
        header.textContent = `Backlinks (${this._backlinks.length})`;
        header.style.cssText = `
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--jp-ui-font-color0);
      border-bottom: 1px solid var(--jp-border-color1);
      padding-bottom: 0.5rem;
    `;
        this._container.appendChild(header);
        this._backlinks.forEach(backlink => {
            const item = document.createElement('div');
            item.className = 'jp-pkm-backlinks-item';
            item.style.cssText = `
        margin-bottom: 1rem;
        padding: 0.75rem;
        border: 1px solid var(--jp-border-color1);
        border-radius: 4px;
        background: var(--jp-layout-color1);
        cursor: pointer;
        transition: background-color 0.2s;
      `;
            const fileName = document.createElement('div');
            fileName.className = 'jp-pkm-backlinks-filename';
            fileName.textContent = backlink.sourceFile;
            fileName.style.cssText = `
        font-weight: 600;
        color: var(--jp-content-link-color);
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
      `;
            const context = document.createElement('div');
            context.className = 'jp-pkm-backlinks-context';
            context.textContent = backlink.context;
            context.style.cssText = `
        color: var(--jp-ui-font-color1);
        font-size: 0.85rem;
        line-height: 1.4;
        white-space: pre-wrap;
      `;
            item.addEventListener('click', () => {
                this.docManager.openOrReveal(backlink.sourceFile);
            });
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = 'var(--jp-layout-color2)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = 'var(--jp-layout-color1)';
            });
            item.appendChild(fileName);
            item.appendChild(context);
            this._container.appendChild(item);
        });
    }
    refresh() {
        console.log('Backlinks: Manual refresh called');
        this.handleCurrentChanged();
    }
    async rebuildIndex() {
        console.log('Backlinks: Rebuilding index...');
        await this.buildWikilinkIndex();
        this.updateBacklinks();
    }
}
/**
 * Plugin to display backlinks in a side panel
 */
const backlinksPlugin = {
    id: '@jupyterlab/pkm-extension:backlinks',
    description: 'Display backlinks for markdown and notebook files in a side panel',
    autoStart: true,
    requires: [_jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_1__.IEditorTracker, _jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_2__.IMarkdownViewerTracker, _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_3__.INotebookTracker, _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_4__.IDocumentManager],
    optional: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.ICommandPalette],
    activate: (app, editorTracker, markdownTracker, notebookTracker, docManager, palette) => {
        console.log('Backlinks plugin activated');
        let backlinksPanel = null;
        // Command to toggle backlinks panel
        app.commands.addCommand(COMMAND_TOGGLE_BACKLINKS, {
            label: 'PKM: Toggle Backlinks Panel',
            caption: 'Show or hide the backlinks panel',
            execute: () => {
                if (backlinksPanel && !backlinksPanel.isDisposed) {
                    if (backlinksPanel.isVisible) {
                        backlinksPanel.close();
                    }
                    else {
                        app.shell.add(backlinksPanel, 'right');
                        app.shell.activateById(backlinksPanel.id);
                    }
                }
                else {
                    // Create new backlinks panel
                    const widget = new BacklinksPanelWidget(app, docManager, editorTracker, markdownTracker, notebookTracker);
                    backlinksPanel = new _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.MainAreaWidget({ content: widget });
                    backlinksPanel.id = 'pkm-backlinks-panel';
                    backlinksPanel.title.label = 'Backlinks';
                    backlinksPanel.title.closable = true;
                    backlinksPanel.title.iconClass = 'jp-MaterialIcon jp-LinkIcon';
                    app.shell.add(backlinksPanel, 'right');
                    app.shell.activateById(backlinksPanel.id);
                }
            }
        });
        // Command to rebuild wikilink index
        app.commands.addCommand('pkm:rebuild-wikilink-index', {
            label: 'PKM: Rebuild Wikilink Index',
            caption: 'Rebuild the wikilink index from all files',
            execute: async () => {
                if (backlinksPanel && !backlinksPanel.isDisposed) {
                    const widget = backlinksPanel.content;
                    await widget.rebuildIndex();
                }
            }
        });
        // Add to command palette
        if (palette) {
            palette.addItem({
                command: COMMAND_TOGGLE_BACKLINKS,
                category: 'PKM'
            });
            palette.addItem({
                command: 'pkm:rebuild-wikilink-index',
                category: 'PKM'
            });
        }
        // Add keyboard shortcut
        app.commands.addKeyBinding({
            command: COMMAND_TOGGLE_BACKLINKS,
            keys: ['Alt B'],
            selector: 'body'
        });
        // Add CSS for backlinks panel
        const style = document.createElement('style');
        style.textContent = `
      .jp-pkm-backlinks-panel {
        min-width: 250px;
      }
      
      .jp-pkm-backlinks-content {
        font-family: var(--jp-ui-font-family);
      }
      
      .jp-pkm-backlinks-header {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: var(--jp-ui-font-color0);
        border-bottom: 1px solid var(--jp-border-color1);
        padding-bottom: 0.5rem;
      }
      
      .jp-pkm-backlinks-empty {
        color: var(--jp-ui-font-color2);
        font-style: italic;
        text-align: center;
        padding: 2rem 1rem;
      }
      
      .jp-pkm-backlinks-item {
        margin-bottom: 1rem;
        padding: 0.75rem;
        border: 1px solid var(--jp-border-color1);
        border-radius: 4px;
        background: var(--jp-layout-color1);
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      .jp-pkm-backlinks-item:hover {
        background: var(--jp-layout-color2);
      }
      
      .jp-pkm-backlinks-filename {
        font-weight: 600;
        color: var(--jp-content-link-color);
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
      }
      
      .jp-pkm-backlinks-context {
        color: var(--jp-ui-font-color1);
        font-size: 0.85rem;
        line-height: 1.4;
        white-space: pre-wrap;
      }
    `;
        document.head.appendChild(style);
    }
};


/***/ }),

/***/ "./lib/block-embedding.js":
/*!********************************!*\
  !*** ./lib/block-embedding.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   blockEmbeddingPlugin: () => (/* binding */ blockEmbeddingPlugin)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/fileeditor */ "webpack/sharing/consume/default/@jupyterlab/fileeditor");
/* harmony import */ var _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/markdownviewer */ "webpack/sharing/consume/default/@jupyterlab/markdownviewer");
/* harmony import */ var _jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jupyterlab/rendermime */ "webpack/sharing/consume/default/@jupyterlab/rendermime");
/* harmony import */ var _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jupyterlab/docmanager */ "webpack/sharing/consume/default/@jupyterlab/docmanager");
/* harmony import */ var _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_5__);






/**
 * Regular expression for block embedding syntax
 */
const BLOCK_EMBED_REGEX = /!\[\[([^#\]]+)#([^\]|]+)(?:\|([^\]]+))?\]\]/g;
/**
 * Find file by name across all directories, supporting multiple extensions
 */
async function findFile(docManager, filename) {
    const contents = docManager.services.contents;
    // Determine target filename with proper extension
    const targetName = filename.includes('.') ? filename : `${filename}.md`;
    console.log('Block embedding - searching for file:', filename, '-> target:', targetName);
    async function searchDirectory(path) {
        try {
            const listing = await contents.get(path, { content: true });
            if (listing.type !== 'directory' || !listing.content) {
                return null;
            }
            console.log(`Block embedding - searching in directory: ${path || 'root'}, found ${listing.content.length} items`);
            for (const item of listing.content) {
                console.log(`  - ${item.name} (${item.type})`);
                if ((item.type === 'file' || item.type === 'notebook') && item.name === targetName) {
                    console.log(`Block embedding - found match: ${item.path}`);
                    return item.path;
                }
                else if (item.type === 'directory') {
                    const found = await searchDirectory(item.path);
                    if (found) {
                        return found;
                    }
                }
            }
        }
        catch (error) {
            console.error(`Block embedding - error searching directory ${path}:`, error);
        }
        return null;
    }
    return searchDirectory('');
}
/**
 * Extract content from markdown file by heading
 */
async function extractByHeading(docManager, filePath, heading) {
    try {
        console.log(`Attempting to extract heading "${heading}" from file: ${filePath}`);
        const fileModel = await docManager.services.contents.get(filePath, { content: true });
        if (fileModel.type !== 'file') {
            console.warn(`File ${filePath} is not a file type, got: ${fileModel.type}`);
            return null;
        }
        // Handle different content formats
        let content;
        if (typeof fileModel.content === 'string') {
            content = fileModel.content;
        }
        else if (fileModel.content && typeof fileModel.content === 'object') {
            // If content is an object, it might be the parsed JSON - we need the raw content
            console.warn(`File ${filePath} content is not a string:`, typeof fileModel.content);
            return null;
        }
        else {
            console.warn(`File ${filePath} has no content`);
            return null;
        }
        const lines = content.split('\n');
        console.log(`File has ${lines.length} lines`);
        console.log('Looking for headings in file:', lines.slice(0, 10).map((line, i) => `${i}: ${line}`));
        // Find the heading line - be more flexible with whitespace and matching
        const normalizedHeading = heading.trim().toLowerCase();
        let startIndex = -1;
        let headingLevel = 0;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const match = line.match(/^(#{1,6})\s+(.+)$/);
            if (match) {
                const lineHeading = match[2].trim().toLowerCase();
                console.log(`Found heading at line ${i}: "${match[2]}" (level ${match[1].length})`);
                if (lineHeading === normalizedHeading) {
                    startIndex = i;
                    headingLevel = match[1].length;
                    console.log(`Matched heading "${heading}" at line ${i}`);
                    break;
                }
            }
        }
        if (startIndex === -1) {
            console.warn(`Heading "${heading}" not found in ${filePath}`);
            console.log('Available headings:');
            lines.forEach((line, i) => {
                const match = line.match(/^(#{1,6})\s+(.+)$/);
                if (match) {
                    console.log(`  Line ${i}: ${match[1]} ${match[2]}`);
                }
            });
            return null;
        }
        // Find the end of this section (next heading of same or higher level)
        let endIndex = lines.length;
        for (let i = startIndex + 1; i < lines.length; i++) {
            const line = lines[i].trim();
            const match = line.match(/^(#{1,6})\s/);
            if (match && match[1].length <= headingLevel) {
                endIndex = i;
                break;
            }
        }
        // Extract the content (excluding the heading itself)
        const sectionLines = lines.slice(startIndex + 1, endIndex);
        const extractedContent = sectionLines.join('\n').trim();
        console.log(`Extracted ${sectionLines.length} lines of content`);
        console.log('First 200 chars:', extractedContent.substring(0, 200));
        return extractedContent;
    }
    catch (error) {
        console.error(`Error extracting heading "${heading}" from ${filePath}:`, error);
        if (error instanceof SyntaxError && error.message.includes('JSON.parse')) {
            console.warn(`File ${filePath} may not exist or be accessible`);
        }
        return null;
    }
}
/**
 * Extract content from markdown file by block ID
 */
async function extractByBlockId(docManager, filePath, blockId) {
    try {
        console.log(`Attempting to extract block ID "${blockId}" from file: ${filePath}`);
        const fileModel = await docManager.services.contents.get(filePath, { content: true });
        if (fileModel.type !== 'file') {
            console.warn(`File ${filePath} is not a file type, got: ${fileModel.type}`);
            return null;
        }
        // Handle different content formats
        let content;
        if (typeof fileModel.content === 'string') {
            content = fileModel.content;
        }
        else if (fileModel.content && typeof fileModel.content === 'object') {
            console.warn(`File ${filePath} content is not a string:`, typeof fileModel.content);
            return null;
        }
        else {
            console.warn(`File ${filePath} has no content`);
            return null;
        }
        const lines = content.split('\n');
        // Look for block ID marker: ^block-id at end of line or paragraph
        const blockIdPattern = new RegExp(`\\^${blockId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`);
        let blockLineIndex = -1;
        console.log(`Looking for block ID pattern: ${blockIdPattern}`);
        for (let i = 0; i < lines.length; i++) {
            if (blockIdPattern.test(lines[i])) {
                blockLineIndex = i;
                console.log(`Found block ID "${blockId}" at line ${i}: "${lines[i]}"`);
                break;
            }
        }
        if (blockLineIndex === -1) {
            console.warn(`Block ID "${blockId}" not found in ${filePath}`);
            console.log('Available block IDs:');
            lines.forEach((line, i) => {
                const blockMatch = line.match(/\^([a-zA-Z0-9-_]+)\s*$/);
                if (blockMatch) {
                    console.log(`  Line ${i}: ^${blockMatch[1]}`);
                }
            });
            return null;
        }
        // Extract the paragraph containing the block ID
        // Go backwards to find the start of the paragraph
        let startIndex = blockLineIndex;
        for (let i = blockLineIndex - 1; i >= 0; i--) {
            if (lines[i].trim() === '') {
                startIndex = i + 1;
                break;
            }
            if (i === 0) {
                startIndex = 0;
            }
        }
        // Go forwards to find the end of the paragraph
        let endIndex = blockLineIndex;
        for (let i = blockLineIndex + 1; i < lines.length; i++) {
            if (lines[i].trim() === '') {
                endIndex = i - 1;
                break;
            }
            if (i === lines.length - 1) {
                endIndex = i;
            }
        }
        // Extract the block content and remove the block ID marker
        const blockLines = lines.slice(startIndex, endIndex + 1);
        const blockContent = blockLines
            .map(line => line.replace(blockIdPattern, '').trimEnd())
            .join('\n')
            .trim();
        console.log(`Extracted block content (${blockLines.length} lines):`, blockContent.substring(0, 200));
        return blockContent;
    }
    catch (error) {
        console.error(`Error extracting block ID "${blockId}" from ${filePath}:`, error);
        if (error instanceof SyntaxError && error.message.includes('JSON.parse')) {
            console.warn(`File ${filePath} may not exist or be accessible`);
        }
        return null;
    }
}
/**
 * Extract a specific cell from a Jupyter notebook
 */
async function extractNotebookCell(docManager, filePath, cellIndex, cellType = 'full') {
    try {
        console.log(`Extracting cell ${cellIndex} (${cellType}) from notebook: ${filePath}`);
        const fileModel = await docManager.services.contents.get(filePath, { content: true });
        if (fileModel.type !== 'notebook') {
            console.warn(`File ${filePath} is not a notebook type, got: ${fileModel.type}`);
            return null;
        }
        // Parse notebook content
        let notebookData;
        if (typeof fileModel.content === 'string') {
            notebookData = JSON.parse(fileModel.content);
        }
        else {
            notebookData = fileModel.content;
        }
        if (!notebookData || !notebookData.cells || !Array.isArray(notebookData.cells)) {
            console.warn(`Invalid notebook structure in ${filePath}`);
            return null;
        }
        const cells = notebookData.cells;
        if (cellIndex < 0 || cellIndex >= cells.length) {
            console.warn(`Cell index ${cellIndex} out of range (0-${cells.length - 1}) in ${filePath}`);
            return null;
        }
        const cell = cells[cellIndex];
        const executionCount = cell.execution_count || undefined;
        console.log(`Found cell ${cellIndex}: type=${cell.cell_type}, execution_count=${executionCount}`);
        let content = '';
        if (cellType === 'code' || (cellType === 'full' && cell.cell_type === 'code')) {
            // Extract source code
            let source = '';
            if (typeof cell.source === 'string') {
                source = cell.source;
            }
            else if (Array.isArray(cell.source)) {
                source = cell.source.join('');
            }
            if (cellType === 'code') {
                content = source;
            }
            else {
                // Full cell - include both code and output
                content = source;
                if (cell.outputs && cell.outputs.length > 0) {
                    content += '\n\n<!-- Output -->\n';
                    content += extractCellOutputs(cell.outputs);
                }
            }
        }
        else if (cellType === 'output' && cell.cell_type === 'code') {
            // Extract only outputs
            if (cell.outputs && cell.outputs.length > 0) {
                content = extractCellOutputs(cell.outputs);
            }
            else {
                content = '(No output)';
            }
        }
        else if (cellType === 'markdown' || cell.cell_type === 'markdown') {
            // Extract markdown source
            if (typeof cell.source === 'string') {
                content = cell.source;
            }
            else if (Array.isArray(cell.source)) {
                content = cell.source.join('');
            }
        }
        else {
            console.warn(`Unsupported cell type or extraction type: cell_type=${cell.cell_type}, cellType=${cellType}`);
            return null;
        }
        console.log(`Extracted cell content (${content.length} chars):`, content.substring(0, 100));
        return { content: content.trim(), executionCount };
    }
    catch (error) {
        console.error(`Error extracting cell ${cellIndex} from ${filePath}:`, error);
        return null;
    }
}
/**
 * Extract text content from notebook cell outputs
 */
function extractCellOutputs(outputs) {
    const outputTexts = [];
    for (const output of outputs) {
        if (output.output_type === 'stream') {
            // Stream output (print statements, etc.)
            let text = '';
            if (typeof output.text === 'string') {
                text = output.text;
            }
            else if (Array.isArray(output.text)) {
                text = output.text.join('');
            }
            if (text.trim()) {
                outputTexts.push(`[${output.name || 'stream'}]\n${text.trim()}`);
            }
        }
        else if (output.output_type === 'execute_result' || output.output_type === 'display_data') {
            // Execution results or display data
            if (output.data) {
                if (output.data['text/plain']) {
                    let text = output.data['text/plain'];
                    if (Array.isArray(text)) {
                        text = text.join('');
                    }
                    outputTexts.push(`[result]\n${text.trim()}`);
                }
                else if (output.data['text/html']) {
                    outputTexts.push(`[html]\n${output.data['text/html']}`);
                }
                else if (output.data['image/png']) {
                    outputTexts.push(`[image: base64 PNG data]`);
                }
                else if (output.data['image/jpeg']) {
                    outputTexts.push(`[image: base64 JPEG data]`);
                }
                else {
                    outputTexts.push(`[data: ${Object.keys(output.data).join(', ')}]`);
                }
            }
        }
        else if (output.output_type === 'error') {
            // Error output
            const errorName = output.ename || 'Error';
            const errorValue = output.evalue || '';
            outputTexts.push(`[error: ${errorName}]\n${errorValue}`);
        }
    }
    return outputTexts.join('\n\n');
}
/**
 * Extract block content based on reference type
 */
async function extractBlockContent(docManager, sourceFile, blockRef) {
    const extractedAt = new Date();
    console.log(`Block embedding - extracting from "${sourceFile}" block/heading "${blockRef}"`);
    // First, resolve the file path
    const resolvedPath = await findFile(docManager, sourceFile);
    if (!resolvedPath) {
        console.warn(`Block embedding - could not find file: ${sourceFile}`);
        return {
            content: '',
            title: blockRef,
            sourceFile,
            blockRef,
            extractedAt,
            found: false
        };
    }
    console.log(`Block embedding - resolved "${sourceFile}" to "${resolvedPath}"`);
    // Check if this is a notebook cell reference: cell:N or cell:N:type
    const cellMatch = blockRef.match(/^cell:(\d+)(?::(code|output|markdown|full))?$/);
    if (cellMatch && resolvedPath.endsWith('.ipynb')) {
        const cellIndex = parseInt(cellMatch[1], 10);
        const cellType = cellMatch[2] || 'full';
        console.log(`Notebook cell reference detected: cell ${cellIndex}, type ${cellType}`);
        const cellResult = await extractNotebookCell(docManager, resolvedPath, cellIndex, cellType);
        if (cellResult) {
            return {
                content: cellResult.content,
                title: `Cell ${cellIndex}${cellType !== 'full' ? `:${cellType}` : ''}`,
                sourceFile,
                blockRef,
                extractedAt,
                found: true,
                isNotebookCell: true,
                cellIndex,
                cellType,
                executionCount: cellResult.executionCount
            };
        }
        else {
            return {
                content: '',
                title: `Cell ${cellIndex}`,
                sourceFile,
                blockRef,
                extractedAt,
                found: false,
                isNotebookCell: true,
                cellIndex,
                cellType
            };
        }
    }
    // For non-notebook files or non-cell references, use existing logic
    // Determine if it's likely a block ID based on naming patterns
    // Block IDs typically use kebab-case, headings use normal text
    const isLikelyBlockId = /^[a-z0-9-_]+$/.test(blockRef) && blockRef.includes('-');
    let content = null;
    let title = blockRef;
    if (isLikelyBlockId) {
        // Try as block ID first
        console.log(`"${blockRef}" looks like a block ID, trying block extraction first`);
        content = await extractByBlockId(docManager, resolvedPath, blockRef);
        if (content === null) {
            console.log(`Block ID extraction failed, trying as heading`);
            content = await extractByHeading(docManager, resolvedPath, blockRef);
        }
        title = content !== null ? `Block: ${blockRef}` : blockRef;
    }
    else {
        // Try as heading first
        console.log(`"${blockRef}" looks like a heading, trying heading extraction first`);
        content = await extractByHeading(docManager, resolvedPath, blockRef);
        if (content === null) {
            console.log(`Heading extraction failed, trying as block ID`);
            content = await extractByBlockId(docManager, resolvedPath, blockRef);
            title = content !== null ? `Block: ${blockRef}` : blockRef;
        }
    }
    return {
        content: content || '',
        title,
        sourceFile,
        blockRef,
        extractedAt,
        found: content !== null
    };
}
/**
 * Parse block embeds from text, excluding those inside code blocks
 */
function parseBlockEmbeds(text) {
    var _a;
    const embeds = [];
    // Find all code blocks (both ``` and ` inline code)
    const codeBlocks = [];
    // Find fenced code blocks (```)
    const fencedCodeRegex = /```[\s\S]*?```/g;
    let codeMatch;
    while ((codeMatch = fencedCodeRegex.exec(text)) !== null) {
        codeBlocks.push({
            start: codeMatch.index,
            end: codeMatch.index + codeMatch[0].length
        });
    }
    // Find inline code blocks (`)
    const inlineCodeRegex = /`[^`]+`/g;
    while ((codeMatch = inlineCodeRegex.exec(text)) !== null) {
        codeBlocks.push({
            start: codeMatch.index,
            end: codeMatch.index + codeMatch[0].length
        });
    }
    // Helper function to check if a position is inside a code block
    const isInCodeBlock = (position) => {
        return codeBlocks.some(block => position >= block.start && position < block.end);
    };
    let match;
    BLOCK_EMBED_REGEX.lastIndex = 0;
    while ((match = BLOCK_EMBED_REGEX.exec(text)) !== null) {
        // Skip if this match is inside a code block
        if (isInCodeBlock(match.index)) {
            continue;
        }
        embeds.push({
            fullMatch: match[0],
            sourceFile: match[1].trim(),
            blockRef: match[2].trim(),
            displayTitle: (_a = match[3]) === null || _a === void 0 ? void 0 : _a.trim(),
            startIndex: match.index,
            endIndex: match.index + match[0].length
        });
    }
    return embeds;
}
/**
 * Render an embedded block as markdown with a visual container
 */
function renderEmbedBlock(extractedBlock, displayTitle) {
    const timestamp = extractedBlock.extractedAt.toLocaleString();
    const title = displayTitle || extractedBlock.title;
    if (!extractedBlock.found) {
        const statusIcon = extractedBlock.isNotebookCell ? '📓❌' : '❌';
        return `
> **${statusIcon} ${extractedBlock.sourceFile}#${extractedBlock.blockRef}**
> 
> *${extractedBlock.isNotebookCell ? 'Notebook cell' : 'Block'} not found*
`;
    }
    // Handle notebook cells with special formatting
    if (extractedBlock.isNotebookCell) {
        const cellTypeIcon = getCellTypeIcon(extractedBlock.cellType);
        const executionInfo = extractedBlock.executionCount !== undefined
            ? ` *[${extractedBlock.executionCount}]*`
            : '';
        const headerLine = `**${cellTypeIcon} ${extractedBlock.sourceFile}#${title}**${executionInfo} *(🕒 ${timestamp})*`;
        // Format notebook cell content with appropriate syntax highlighting
        let formattedContent = '';
        if (extractedBlock.cellType === 'code' || extractedBlock.cellType === 'full') {
            // Determine language from notebook metadata or default to python
            const language = 'python'; // Could be enhanced to detect from notebook metadata
            if (extractedBlock.cellType === 'full' && extractedBlock.content.includes('<!-- Output -->')) {
                // Split code and output for full cells
                const parts = extractedBlock.content.split('<!-- Output -->');
                formattedContent = `\`\`\`${language}\n${parts[0].trim()}\n\`\`\`\n\n**Output:**\n\`\`\`\n${parts[1].trim()}\n\`\`\``;
            }
            else {
                formattedContent = `\`\`\`${language}\n${extractedBlock.content.trim()}\n\`\`\``;
            }
        }
        else if (extractedBlock.cellType === 'output') {
            formattedContent = `\`\`\`\n${extractedBlock.content.trim()}\n\`\`\``;
        }
        else {
            // Markdown cell - render as-is
            formattedContent = extractedBlock.content.trim();
        }
        return `
---

${headerLine}

${formattedContent}

---
`;
    }
    // Original formatting for non-notebook blocks
    const statusIcon = '📄';
    const headerLine = `**${statusIcon} ${extractedBlock.sourceFile}#${title}** *(🕒 ${timestamp})*`;
    const contentLines = extractedBlock.content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    return `
---

${headerLine}

${contentLines.join('\n\n')}

---
`;
}
/**
 * Get appropriate icon for notebook cell type
 */
function getCellTypeIcon(cellType) {
    switch (cellType) {
        case 'code': return '📓💻';
        case 'output': return '📓📊';
        case 'markdown': return '📓📝';
        case 'full': return '📓';
        default: return '📓';
    }
}
/**
 * Generate a cell overview for a notebook file
 */
async function generateNotebookCellOverview(docManager, filePath) {
    try {
        console.log(`Generating cell overview for notebook: ${filePath}`);
        const fileModel = await docManager.services.contents.get(filePath, { content: true });
        if (fileModel.type !== 'notebook') {
            return `Error: ${filePath} is not a notebook file.`;
        }
        // Parse notebook content
        let notebookData;
        if (typeof fileModel.content === 'string') {
            notebookData = JSON.parse(fileModel.content);
        }
        else {
            notebookData = fileModel.content;
        }
        if (!notebookData || !notebookData.cells || !Array.isArray(notebookData.cells)) {
            return `Error: Invalid notebook structure in ${filePath}`;
        }
        const cells = notebookData.cells;
        const overview = [];
        overview.push(`# 📓 Notebook Cell Overview: ${filePath}`);
        overview.push(`Total cells: ${cells.length}\n`);
        overview.push('| Index | Type | ID | Tags | Execution | Preview |');
        overview.push('|-------|------|----|----- |-----------|---------|');
        cells.forEach((cell, index) => {
            var _a, _b, _c;
            const cellType = cell.cell_type || 'unknown';
            const cellIcon = cellType === 'code' ? '💻' : cellType === 'markdown' ? '📝' : '❓';
            // Extract cell ID
            const cellId = cell.id || ((_a = cell.metadata) === null || _a === void 0 ? void 0 : _a.id) || '-';
            // Extract tags
            const tags = ((_b = cell.metadata) === null || _b === void 0 ? void 0 : _b.tags) || [];
            const tagString = tags.length > 0 ? tags.join(', ') : '-';
            // Execution count for code cells
            const executionCount = cell.execution_count !== null && cell.execution_count !== undefined
                ? `[${cell.execution_count}]`
                : '-';
            // Generate preview (first line of source)
            let preview = '';
            if (cell.source) {
                let sourceText = '';
                if (typeof cell.source === 'string') {
                    sourceText = cell.source;
                }
                else if (Array.isArray(cell.source)) {
                    sourceText = cell.source.join('');
                }
                const firstLine = ((_c = sourceText.split('\n')[0]) === null || _c === void 0 ? void 0 : _c.trim()) || '';
                preview = firstLine.length > 40 ? firstLine.substring(0, 37) + '...' : firstLine;
                // Clean up markdown syntax for preview
                if (cellType === 'markdown') {
                    preview = preview.replace(/^#+\s*/, '').replace(/\*\*/g, '');
                }
            }
            overview.push(`| ${index} | ${cellIcon} ${cellType} | \`${cellId}\` | ${tagString} | ${executionCount} | ${preview} |`);
        });
        overview.push('\n## 🔗 Embedding Examples:');
        overview.push('```');
        const fileName = filePath.split('/').pop() || filePath;
        overview.push(`![[${fileName}#cell:0]]        <!-- Full cell 0 -->`);
        overview.push(`![[${fileName}#cell:0:code]]   <!-- Code only from cell 0 -->`);
        overview.push(`![[${fileName}#cell:0:output]] <!-- Output only from cell 0 -->`);
        if (cells.some((cell) => { var _a, _b; return ((_b = (_a = cell.metadata) === null || _a === void 0 ? void 0 : _a.tags) === null || _b === void 0 ? void 0 : _b.length) > 0; })) {
            const taggedCell = cells.find((cell) => { var _a, _b; return ((_b = (_a = cell.metadata) === null || _a === void 0 ? void 0 : _a.tags) === null || _b === void 0 ? void 0 : _b.length) > 0; });
            const firstTag = taggedCell.metadata.tags[0];
            overview.push(`![[${fileName}#tag:${firstTag}]]   <!-- Cell with tag "${firstTag}" (future feature) -->`);
        }
        overview.push('```');
        return overview.join('\n');
    }
    catch (error) {
        console.error(`Error generating cell overview for ${filePath}:`, error);
        return `Error: Could not read notebook file ${filePath}`;
    }
}
/**
 * Plugin to handle block embedding in markdown files
 */
const blockEmbeddingPlugin = {
    id: '@jupyterlab/pkm-extension:block-embedding',
    description: 'Handle block embedding in markdown files',
    autoStart: true,
    requires: [
        _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_1__.IEditorTracker,
        _jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_2__.IMarkdownViewerTracker,
        _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_4__.IDocumentManager,
        _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_3__.IRenderMimeRegistry
    ],
    optional: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.ICommandPalette],
    activate: (app, editorTracker, markdownTracker, docManager, rendermime, palette) => {
        console.log('Block embedding plugin activated');
        // Override the default markdown renderer to process block embeds
        const defaultFactory = rendermime.getFactory('text/markdown');
        if (defaultFactory) {
            rendermime.removeMimeType('text/markdown');
            rendermime.addFactory({
                safe: true,
                mimeTypes: ['text/markdown'],
                createRenderer: (options) => {
                    const renderer = defaultFactory.createRenderer(options);
                    const originalRenderModel = renderer.renderModel.bind(renderer);
                    renderer.renderModel = async (model) => {
                        // Get the markdown source
                        let source;
                        if (typeof model.data === 'string') {
                            source = model.data;
                        }
                        else if (model.data['text/markdown']) {
                            source = model.data['text/markdown'];
                        }
                        else if (model.data['text/plain']) {
                            source = model.data['text/plain'];
                        }
                        else {
                            return originalRenderModel(model);
                        }
                        // Parse block embeds
                        const embeds = parseBlockEmbeds(source);
                        if (embeds.length === 0) {
                            return originalRenderModel(model);
                        }
                        console.log(`Found ${embeds.length} block embeds`);
                        // Process embeds
                        let processedSource = source;
                        let offset = 0;
                        for (const embed of embeds) {
                            console.log('Processing embed:', embed.sourceFile, '#', embed.blockRef);
                            const extractedBlock = await extractBlockContent(docManager, embed.sourceFile, embed.blockRef);
                            const embedHtml = renderEmbedBlock(extractedBlock, embed.displayTitle);
                            const adjustedStart = embed.startIndex + offset;
                            const adjustedEnd = embed.endIndex + offset;
                            processedSource =
                                processedSource.slice(0, adjustedStart) +
                                    embedHtml +
                                    processedSource.slice(adjustedEnd);
                            offset += embedHtml.length - embed.fullMatch.length;
                        }
                        // Update the model with processed source
                        const processedModel = {
                            ...model,
                            data: typeof model.data === 'string' ? { 'text/markdown': processedSource } : {
                                ...model.data,
                                'text/markdown': processedSource
                            },
                            metadata: model.metadata || {},
                            trusted: model.trusted !== undefined ? model.trusted : true
                        };
                        return originalRenderModel(processedModel);
                    };
                    return renderer;
                }
            }, 0);
        }
        // Add command to show notebook cell overview
        app.commands.addCommand('pkm:show-notebook-cell-overview', {
            label: 'PKM: Show Notebook Cell Overview',
            caption: 'Show an overview of all cells in the current notebook',
            execute: async () => {
                var _a;
                // Get the currently active notebook file
                const currentWidget = app.shell.currentWidget;
                let notebookPath = '';
                if (currentWidget && ((_a = currentWidget.context) === null || _a === void 0 ? void 0 : _a.path)) {
                    const path = currentWidget.context.path;
                    if (path.endsWith('.ipynb')) {
                        notebookPath = path;
                    }
                }
                if (!notebookPath) {
                    // If no notebook is currently open, prompt user for a path
                    const result = prompt('Enter notebook path:', '');
                    if (result) {
                        notebookPath = result;
                    }
                    else {
                        return;
                    }
                }
                try {
                    const overview = await generateNotebookCellOverview(docManager, notebookPath);
                    // Create a widget to display the overview
                    const widget = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_5__.Widget();
                    widget.addClass('pkm-notebook-overview');
                    widget.title.label = `Cell Overview: ${notebookPath.split('/').pop()}`;
                    widget.title.closable = true;
                    // Create markdown content area
                    const content = document.createElement('div');
                    content.style.cssText = `
            padding: 16px;
            font-family: var(--jp-content-font-family);
            overflow-y: auto;
            height: 100%;
          `;
                    // Render the overview as markdown
                    const markdownRenderer = rendermime.createRenderer('text/markdown');
                    // Create a simple model object with required properties
                    const modelData = { 'text/markdown': overview };
                    const modelMetadata = {};
                    let modelTrusted = true;
                    const model = {
                        data: modelData,
                        metadata: modelMetadata,
                        trusted: modelTrusted,
                        setData: (options) => {
                            // Implementation for setData method (required by interface)
                            Object.assign(modelData, options.data || {});
                            Object.assign(modelMetadata, options.metadata || {});
                            if (options.trusted !== undefined) {
                                modelTrusted = options.trusted;
                            }
                        }
                    };
                    markdownRenderer.renderModel(model).then(() => {
                        content.appendChild(markdownRenderer.node);
                    });
                    widget.node.appendChild(content);
                    // Show the widget
                    const main = new _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.MainAreaWidget({ content: widget });
                    main.title.label = widget.title.label;
                    main.title.closable = true;
                    app.shell.add(main, 'main');
                    app.shell.activateById(main.id);
                }
                catch (error) {
                    console.error('Error showing notebook cell overview:', error);
                    alert(`Error: Could not read notebook file ${notebookPath}`);
                }
            }
        });
        // Add to command palette
        if (palette) {
            palette.addItem({
                command: 'pkm:show-notebook-cell-overview',
                category: 'PKM'
            });
        }
        // No custom CSS needed - using markdown formatting instead
    }
};


/***/ }),

/***/ "./lib/code-copy.js":
/*!**************************!*\
  !*** ./lib/code-copy.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   codeCopyPlugin: () => (/* binding */ codeCopyPlugin)
/* harmony export */ });
/* harmony import */ var _jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/markdownviewer */ "webpack/sharing/consume/default/@jupyterlab/markdownviewer");
/* harmony import */ var _jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/rendermime */ "webpack/sharing/consume/default/@jupyterlab/rendermime");
/* harmony import */ var _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_1__);


/**
 * SVG icon for copy button
 */
const COPY_ICON_SVG = `
<svg class="pkm-copy-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
</svg>
`;
/**
 * SVG icon for success state
 */
const CHECK_ICON_SVG = `
<svg class="pkm-copy-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
</svg>
`;
/**
 * Language mapping for common aliases
 */
const LANGUAGE_ALIASES = {
    'py': 'python',
    'js': 'javascript',
    'ts': 'typescript',
    'sh': 'bash',
    'yml': 'yaml',
    'md': 'markdown',
    'htm': 'html'
};
/**
 * Create copy button element
 */
function createCopyButton(codeText, language) {
    const button = document.createElement('button');
    button.className = 'pkm-code-copy-btn';
    button.title = 'Copy code to clipboard';
    button.innerHTML = `${COPY_ICON_SVG}<span>Copy</span>`;
    button.addEventListener('click', async (event) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            await navigator.clipboard.writeText(codeText);
            // Update button to show success state
            button.innerHTML = `${CHECK_ICON_SVG}<span>Copied!</span>`;
            button.classList.add('copied');
            // Reset button after 2 seconds
            setTimeout(() => {
                button.innerHTML = `${COPY_ICON_SVG}<span>Copy</span>`;
                button.classList.remove('copied');
            }, 2000);
        }
        catch (error) {
            console.error('Failed to copy code:', error);
            // Fallback for older browsers
            try {
                const textArea = document.createElement('textarea');
                textArea.value = codeText;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                button.innerHTML = `${CHECK_ICON_SVG}<span>Copied!</span>`;
                button.classList.add('copied');
                setTimeout(() => {
                    button.innerHTML = `${COPY_ICON_SVG}<span>Copy</span>`;
                    button.classList.remove('copied');
                }, 2000);
            }
            catch (fallbackError) {
                console.error('Fallback copy failed:', fallbackError);
                button.innerHTML = `${COPY_ICON_SVG}<span>Failed</span>`;
                setTimeout(() => {
                    button.innerHTML = `${COPY_ICON_SVG}<span>Copy</span>`;
                }, 2000);
            }
        }
    });
    return button;
}
/**
 * Create language label element
 */
function createLanguageLabel(language) {
    const label = document.createElement('div');
    const normalizedLang = LANGUAGE_ALIASES[language.toLowerCase()] || language.toLowerCase();
    label.className = `pkm-code-language ${normalizedLang}`;
    label.textContent = normalizedLang;
    return label;
}
/**
 * Extract language from code block class names
 */
function extractLanguage(codeElement) {
    const classes = codeElement.className.split(' ');
    for (const className of classes) {
        if (className.startsWith('language-')) {
            return className.replace('language-', '');
        }
        if (className.startsWith('hljs-')) {
            continue; // Skip highlight.js classes
        }
        // Check if it's a direct language class
        if (['python', 'javascript', 'typescript', 'bash', 'shell', 'r', 'sql', 'json', 'css', 'html', 'markdown', 'yaml'].includes(className.toLowerCase())) {
            return className.toLowerCase();
        }
    }
    return undefined;
}
/**
 * Extract language from fence notation (```python)
 */
function extractLanguageFromContent(preElement) {
    // Look for the code element inside the pre
    const codeElement = preElement.querySelector('code');
    if (codeElement) {
        return extractLanguage(codeElement);
    }
    return undefined;
}
/**
 * Process code blocks to add copy buttons and language labels
 */
function processCodeBlocks(container) {
    const codeBlocks = container.querySelectorAll('pre');
    codeBlocks.forEach((preElement) => {
        // Skip if already processed
        if (preElement.querySelector('.pkm-code-copy-btn')) {
            return;
        }
        const codeElement = preElement.querySelector('code');
        if (!codeElement) {
            return;
        }
        // Extract code text
        const codeText = codeElement.textContent || '';
        if (!codeText.trim()) {
            return;
        }
        // Extract language
        const language = extractLanguageFromContent(preElement);
        // Add language label if language is detected
        if (language) {
            const languageLabel = createLanguageLabel(language);
            preElement.appendChild(languageLabel);
        }
        // Add copy button
        const copyButton = createCopyButton(codeText, language);
        preElement.appendChild(copyButton);
        // Ensure pre element has relative positioning
        if (getComputedStyle(preElement).position === 'static') {
            preElement.style.position = 'relative';
        }
    });
}
/**
 * Plugin to add copy functionality to code blocks
 */
const codeCopyPlugin = {
    id: '@jupyterlab/pkm-extension:code-copy',
    description: 'Add copy functionality to code blocks in markdown',
    autoStart: true,
    requires: [
        _jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_0__.IMarkdownViewerTracker,
        _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_1__.IRenderMimeRegistry
    ],
    activate: (app, markdownTracker, rendermime) => {
        console.log('Code copy plugin activated');
        // Override the markdown renderer to add copy buttons
        const defaultFactory = rendermime.getFactory('text/markdown');
        if (defaultFactory) {
            rendermime.removeMimeType('text/markdown');
            rendermime.addFactory({
                safe: true,
                mimeTypes: ['text/markdown'],
                createRenderer: (options) => {
                    const renderer = defaultFactory.createRenderer(options);
                    const originalRenderModel = renderer.renderModel.bind(renderer);
                    renderer.renderModel = async (model) => {
                        // Call the original render method first
                        const result = await originalRenderModel(model);
                        // Process code blocks after rendering
                        if (renderer.node) {
                            // Use a slight delay to ensure DOM is fully ready
                            setTimeout(() => {
                                processCodeBlocks(renderer.node);
                            }, 100);
                        }
                        return result;
                    };
                    return renderer;
                }
            }, 1); // Higher priority than the block embedding plugin
        }
        // Also process existing markdown viewers
        markdownTracker.widgetAdded.connect((tracker, widget) => {
            // Wait for the widget to be fully rendered
            setTimeout(() => {
                if (widget.content.node) {
                    processCodeBlocks(widget.content.node);
                }
            }, 200);
        });
        // Process code blocks when content changes
        markdownTracker.currentChanged.connect((tracker, widget) => {
            if (widget && widget.content.node) {
                setTimeout(() => {
                    processCodeBlocks(widget.content.node);
                }, 100);
            }
        });
        console.log('Code copy functionality ready');
    }
};


/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/fileeditor */ "webpack/sharing/consume/default/@jupyterlab/fileeditor");
/* harmony import */ var _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/markdownviewer */ "webpack/sharing/consume/default/@jupyterlab/markdownviewer");
/* harmony import */ var _jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jupyterlab/notebook */ "webpack/sharing/consume/default/@jupyterlab/notebook");
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _markdown_preview__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./markdown-preview */ "./lib/markdown-preview.js");
/* harmony import */ var _wikilinks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./wikilinks */ "./lib/wikilinks.js");
/* harmony import */ var _search__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./search */ "./lib/search.js");
/* harmony import */ var _backlinks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./backlinks */ "./lib/backlinks.js");
/* harmony import */ var _block_embedding__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./block-embedding */ "./lib/block-embedding.js");
/* harmony import */ var _notebook_embed__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./notebook-embed */ "./lib/notebook-embed.js");
/* harmony import */ var _code_copy__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./code-copy */ "./lib/code-copy.js");




// Adding plugins back one by one







// import { welcomePlugin } from './welcome'; // Causes JupyterLab to not load
/**
 * The main extension that combines all PKM features
 */
const extension = {
    id: '@jupyterlab/pkm-extension:plugin',
    description: 'Personal Knowledge Management extension for JupyterLab Desktop',
    autoStart: true,
    requires: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.ICommandPalette, _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_1__.IEditorTracker, _jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_2__.IMarkdownViewerTracker, _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_3__.INotebookTracker],
    activate: (app, palette, editorTracker, markdownTracker, notebookTracker) => {
        console.log('🎉 JupyterLab PKM extension activated');
        // Add a test command to verify it's working
        const testCommand = 'pkm:test-full';
        app.commands.addCommand(testCommand, {
            label: 'PKM: Test Full Extension',
            execute: () => {
                console.log('Full PKM Extension is working!');
                alert('Full PKM Extension loaded successfully!');
            }
        });
        palette.addItem({
            command: testCommand,
            category: 'PKM'
        });
    }
};
/**
 * Export all plugins
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([
    extension,
    // welcomePlugin, // Causes JupyterLab to not load
    _markdown_preview__WEBPACK_IMPORTED_MODULE_4__.markdownPreviewPlugin,
    _wikilinks__WEBPACK_IMPORTED_MODULE_5__.wikilinkPlugin,
    _search__WEBPACK_IMPORTED_MODULE_6__.searchPlugin,
    _backlinks__WEBPACK_IMPORTED_MODULE_7__.backlinksPlugin,
    _block_embedding__WEBPACK_IMPORTED_MODULE_8__.blockEmbeddingPlugin,
    _notebook_embed__WEBPACK_IMPORTED_MODULE_9__.notebookEmbedPlugin,
    _code_copy__WEBPACK_IMPORTED_MODULE_10__.codeCopyPlugin
    // All working plugins added!
    // searchPlugin,
    // backlinksPlugin,
    // notebookEmbedPlugin
]);


/***/ }),

/***/ "./lib/markdown-preview.js":
/*!*********************************!*\
  !*** ./lib/markdown-preview.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   markdownPreviewPlugin: () => (/* binding */ markdownPreviewPlugin)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/statedb */ "webpack/sharing/consume/default/@jupyterlab/statedb");
/* harmony import */ var _jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/fileeditor */ "webpack/sharing/consume/default/@jupyterlab/fileeditor");
/* harmony import */ var _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jupyterlab/markdownviewer */ "webpack/sharing/consume/default/@jupyterlab/markdownviewer");
/* harmony import */ var _jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jupyterlab/docmanager */ "webpack/sharing/consume/default/@jupyterlab/docmanager");
/* harmony import */ var _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./state */ "./lib/state.js");







const COMMAND_TOGGLE_MODE = 'pkm:toggle-markdown-mode';
const COMMAND_OPEN_START = 'pkm:open-start-file';
const STATE_KEY = 'pkm:markdown-mode';
/**
 * Plugin for global markdown mode toggle and startup behavior
 */
const markdownPreviewPlugin = {
    id: '@jupyterlab/pkm-extension:markdown-mode',
    description: 'Global markdown mode toggle and startup file',
    autoStart: true,
    requires: [_jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_2__.IEditorTracker, _jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_3__.IMarkdownViewerTracker, _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_4__.IDocumentManager, _jupyterlab_statedb__WEBPACK_IMPORTED_MODULE_1__.IStateDB, _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.ICommandPalette],
    activate: (app, editorTracker, markdownTracker, docManager, stateDB, palette) => {
        console.log('PKM Markdown mode plugin activated');
        // Load saved mode from state
        stateDB.fetch(STATE_KEY).then((value) => {
            if (value === 'preview' || value === 'edit') {
                _state__WEBPACK_IMPORTED_MODULE_6__.pkmState.setMarkdownMode(value);
            }
        });
        // Create mode toggle button widget
        const createModeToggleWidget = () => {
            const widget = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_5__.Widget();
            widget.addClass('pkm-mode-toggle');
            widget.node.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: calc(var(--jp-sidebar-min-width, 240px) - 40px);
        max-width: 280px;
        z-index: 1000;
        background: var(--jp-layout-color0, #ffffff);
        border: 2px solid var(--jp-brand-color1, #1976d2);
        border-radius: 8px;
        padding: 12px;
        margin: 0;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      `;
            widget.node.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button id="pkm-mode-btn" style="
            padding: 10px 12px; 
            border: 2px solid var(--jp-brand-color1, #1976d2); 
            background: var(--jp-brand-color1, #1976d2);
            color: white;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.2s ease;
            width: 100%;
            text-align: center;
          ">
            📝 Edit Mode
          </button>
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <span style="color: var(--jp-ui-font-color1); font-size: 12px; font-weight: 500; text-align: center;">
              Markdown files will open in edit mode
            </span>
            <span style="color: var(--jp-ui-font-color2); font-size: 11px; text-align: center;">
              Press Alt+M to toggle
            </span>
          </div>
        </div>
      `;
            const button = widget.node.querySelector('#pkm-mode-btn');
            const statusSpan = widget.node.querySelector('span');
            const getCurrentFileMode = () => {
                // Check if current focused widget is a markdown file
                const editorWidget = editorTracker.currentWidget;
                const previewWidget = markdownTracker.currentWidget;
                if (editorWidget && editorWidget.context.path.endsWith('.md')) {
                    return 'edit';
                }
                else if (previewWidget && previewWidget.context.path.endsWith('.md')) {
                    return 'preview';
                }
                return 'none';
            };
            const updateButton = () => {
                const currentMode = getCurrentFileMode();
                if (currentMode === 'edit') {
                    button.innerHTML = '👁 Switch to Preview';
                    button.style.background = 'var(--jp-brand-color1, #1976d2)';
                    button.style.borderColor = 'var(--jp-brand-color1, #1976d2)';
                    statusSpan.textContent = 'Currently viewing in edit mode';
                    button.disabled = false;
                }
                else if (currentMode === 'preview') {
                    button.innerHTML = '📝 Switch to Edit';
                    button.style.background = 'var(--jp-warn-color1, #ff9800)';
                    button.style.borderColor = 'var(--jp-warn-color1, #ff9800)';
                    statusSpan.textContent = 'Currently viewing in preview mode';
                    button.disabled = false;
                }
                else {
                    button.innerHTML = '📄 No Markdown File';
                    button.style.background = 'var(--jp-layout-color3, #ccc)';
                    button.style.borderColor = 'var(--jp-layout-color3, #ccc)';
                    statusSpan.textContent = 'Focus a markdown file to toggle view';
                    button.disabled = true;
                }
            };
            // Add hover effect
            button.addEventListener('mouseenter', () => {
                button.style.opacity = '0.8';
            });
            button.addEventListener('mouseleave', () => {
                button.style.opacity = '1';
            });
            button.addEventListener('click', async () => {
                const currentMode = getCurrentFileMode();
                if (currentMode === 'none') {
                    // No markdown file is focused, do nothing
                    return;
                }
                // Determine which widget and path to work with
                let currentWidget = null;
                let currentPath = '';
                if (currentMode === 'edit') {
                    currentWidget = editorTracker.currentWidget;
                    if (currentWidget && currentWidget.context.path.endsWith('.md')) {
                        currentPath = currentWidget.context.path;
                    }
                }
                else if (currentMode === 'preview') {
                    currentWidget = markdownTracker.currentWidget;
                    if (currentWidget && currentWidget.context.path.endsWith('.md')) {
                        currentPath = currentWidget.context.path;
                    }
                }
                if (!currentWidget || !currentPath) {
                    console.warn('No valid markdown file found to toggle');
                    return;
                }
                // Determine target mode
                const targetMode = currentMode === 'edit' ? 'preview' : 'edit';
                const targetFactory = targetMode === 'edit' ? 'Editor' : 'Markdown Preview';
                try {
                    // Show loading state
                    statusSpan.textContent = `Switching to ${targetMode}...`;
                    statusSpan.style.color = 'var(--jp-brand-color1, #1976d2)';
                    // Close the current widget first
                    if (currentWidget && !currentWidget.isDisposed) {
                        currentWidget.close();
                    }
                    // Small delay to ensure cleanup
                    await new Promise(resolve => setTimeout(resolve, 100));
                    // Open the file in the new mode
                    await docManager.openOrReveal(currentPath, targetFactory);
                    // Show success confirmation
                    statusSpan.textContent = `Switched to ${targetMode} mode!`;
                    statusSpan.style.color = 'var(--jp-success-color1, #4caf50)';
                    setTimeout(() => {
                        updateButton(); // This will reset the text and color
                    }, 1500);
                    console.log(`Toggled ${currentPath} from ${currentMode} to ${targetMode} mode`);
                }
                catch (error) {
                    console.error('Failed to toggle file mode:', error);
                    statusSpan.textContent = 'Failed to switch mode';
                    statusSpan.style.color = 'var(--jp-error-color1, #f44336)';
                    setTimeout(() => {
                        updateButton();
                    }, 2000);
                }
            });
            // Listen for focus changes to update button state
            editorTracker.currentChanged.connect(updateButton);
            markdownTracker.currentChanged.connect(updateButton);
            // Initial button update
            updateButton();
            return widget;
        };
        // Add toggle command
        app.commands.addCommand(COMMAND_TOGGLE_MODE, {
            label: 'PKM: Toggle Current Markdown File View',
            execute: async () => {
                // Use the same logic as the button click
                const getCurrentFileMode = () => {
                    const editorWidget = editorTracker.currentWidget;
                    const previewWidget = markdownTracker.currentWidget;
                    if (editorWidget && editorWidget.context.path.endsWith('.md')) {
                        return 'edit';
                    }
                    else if (previewWidget && previewWidget.context.path.endsWith('.md')) {
                        return 'preview';
                    }
                    return 'none';
                };
                const currentMode = getCurrentFileMode();
                if (currentMode === 'none') {
                    (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.showDialog)({
                        title: 'No Markdown File',
                        body: 'Please focus a markdown file to toggle its view mode.',
                        buttons: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.Dialog.okButton()]
                    });
                    return;
                }
                // Determine which widget and path to work with
                let currentWidget = null;
                let currentPath = '';
                if (currentMode === 'edit') {
                    currentWidget = editorTracker.currentWidget;
                    if (currentWidget && currentWidget.context.path.endsWith('.md')) {
                        currentPath = currentWidget.context.path;
                    }
                }
                else if (currentMode === 'preview') {
                    currentWidget = markdownTracker.currentWidget;
                    if (currentWidget && currentWidget.context.path.endsWith('.md')) {
                        currentPath = currentWidget.context.path;
                    }
                }
                if (!currentWidget || !currentPath) {
                    console.warn('No valid markdown file found to toggle');
                    return;
                }
                // Determine target mode
                const targetMode = currentMode === 'edit' ? 'preview' : 'edit';
                const targetFactory = targetMode === 'edit' ? 'Editor' : 'Markdown Preview';
                try {
                    // Close the current widget first
                    if (currentWidget && !currentWidget.isDisposed) {
                        currentWidget.close();
                    }
                    // Small delay to ensure cleanup
                    await new Promise(resolve => setTimeout(resolve, 100));
                    // Open the file in the new mode
                    await docManager.openOrReveal(currentPath, targetFactory);
                    console.log(`Toggled ${currentPath} from ${currentMode} to ${targetMode} mode via keyboard`);
                    // Show brief confirmation
                    (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.showDialog)({
                        title: 'View Mode Changed',
                        body: `Switched to ${targetMode} mode for ${currentPath.split('/').pop()}`,
                        buttons: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.Dialog.okButton()]
                    });
                }
                catch (error) {
                    console.error('Failed to toggle file mode:', error);
                    (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.showDialog)({
                        title: 'Error',
                        body: 'Failed to switch view mode. Please try again.',
                        buttons: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.Dialog.okButton()]
                    });
                }
            }
        });
        // Add command to open start.md
        app.commands.addCommand(COMMAND_OPEN_START, {
            label: 'PKM: Open Start File',
            execute: async () => {
                try {
                    const factory = _state__WEBPACK_IMPORTED_MODULE_6__.pkmState.markdownMode === 'edit' ? 'Editor' : 'Markdown Preview';
                    await docManager.openOrReveal('start.md', factory);
                }
                catch (error) {
                    console.log('start.md not found, creating it...');
                    // Create start.md if it doesn't exist
                    try {
                        await docManager.services.contents.save('start.md', {
                            type: 'file',
                            format: 'text',
                            content: `# Welcome to Your PKM System

This is your starting note. Try creating wikilinks:

- [[My First Note]] - Creates a new note
- [[https://example.com|External Link]] - Links to external sites

## Features:
- **Wikilinks**: Use [[Note Name]] syntax
- **Search**: Alt+F to search all notes  
- **Auto-save**: Your changes are saved automatically
- **Mode Toggle**: Use the button above or Alt+M to switch between edit and preview modes

Start building your knowledge graph!
`
                        });
                        const factory = _state__WEBPACK_IMPORTED_MODULE_6__.pkmState.markdownMode === 'edit' ? 'Editor' : 'Markdown Preview';
                        await docManager.openOrReveal('start.md', factory);
                    }
                    catch (createError) {
                        console.error('Failed to create start.md:', createError);
                    }
                }
            }
        });
        // Add commands to palette
        if (palette) {
            palette.addItem({
                command: COMMAND_TOGGLE_MODE,
                category: 'PKM'
            });
            palette.addItem({
                command: COMMAND_OPEN_START,
                category: 'PKM'
            });
        }
        // Add keyboard shortcut for mode toggle
        app.commands.addKeyBinding({
            command: COMMAND_TOGGLE_MODE,
            keys: ['Alt M'],
            selector: 'body'
        });
        // Create a single global toggle widget
        let globalToggleWidget = null;
        const showToggleWidget = () => {
            if (!globalToggleWidget) {
                globalToggleWidget = createModeToggleWidget();
                document.body.appendChild(globalToggleWidget.node);
                console.log('Created global toggle widget');
            }
            globalToggleWidget.node.style.display = 'block';
        };
        const hideToggleWidget = () => {
            if (globalToggleWidget) {
                globalToggleWidget.node.style.display = 'none';
            }
        };
        // Show/hide toggle widget based on current file
        const updateToggleVisibility = () => {
            const currentEditorWidget = editorTracker.currentWidget;
            const currentViewerWidget = markdownTracker.currentWidget;
            // Show if we have a markdown file open (either editor or viewer)
            const hasMarkdownFile = (currentEditorWidget && currentEditorWidget.context.path.endsWith('.md')) ||
                (currentViewerWidget && currentViewerWidget.context.path.endsWith('.md'));
            if (hasMarkdownFile) {
                showToggleWidget();
            }
            else {
                hideToggleWidget();
            }
        };
        // Track current widget changes
        editorTracker.currentChanged.connect(updateToggleVisibility);
        markdownTracker.currentChanged.connect(updateToggleVisibility);
        // Track when widgets are added/removed
        editorTracker.widgetAdded.connect(updateToggleVisibility);
        markdownTracker.widgetAdded.connect(updateToggleVisibility);
        // Auto-open start.md on startup in preview mode (with delay to ensure UI is ready)
        setTimeout(async () => {
            try {
                // Force preview mode on startup regardless of current mode setting
                await docManager.openOrReveal('start.md', 'Markdown Preview');
            }
            catch (error) {
                console.log('start.md not found on startup, creating it...');
                // Create start.md if it doesn't exist
                try {
                    await docManager.services.contents.save('start.md', {
                        type: 'file',
                        format: 'text',
                        content: `# Welcome to Your PKM System

This is your starting note. Try creating wikilinks:

- [[My First Note]] - Creates a new note
- [[https://example.com|External Link]] - Links to external sites

## Features:
- **Wikilinks**: Use [[Note Name]] syntax
- **Search**: Alt+F to search all notes  
- **Auto-save**: Your changes are saved automatically
- **Mode Toggle**: Use the button above or Alt+M to switch between edit and preview modes

Start building your knowledge graph!
`
                    });
                    // Open the newly created file in preview mode
                    await docManager.openOrReveal('start.md', 'Markdown Preview');
                }
                catch (createError) {
                    console.error('Failed to create start.md:', createError);
                }
            }
        }, 1000);
    }
};


/***/ }),

/***/ "./lib/notebook-embed.js":
/*!*******************************!*\
  !*** ./lib/notebook-embed.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   notebookEmbedPlugin: () => (/* binding */ notebookEmbedPlugin)
/* harmony export */ });
/* harmony import */ var _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/fileeditor */ "webpack/sharing/consume/default/@jupyterlab/fileeditor");
/* harmony import */ var _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/markdownviewer */ "webpack/sharing/consume/default/@jupyterlab/markdownviewer");
/* harmony import */ var _jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/notebook */ "webpack/sharing/consume/default/@jupyterlab/notebook");
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jupyterlab/docmanager */ "webpack/sharing/consume/default/@jupyterlab/docmanager");
/* harmony import */ var _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jupyterlab/rendermime */ "webpack/sharing/consume/default/@jupyterlab/rendermime");
/* harmony import */ var _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_4__);





/**
 * Regular expression for notebook embed syntax
 */
const NOTEBOOK_EMBED_REGEX = /!\[\[([^#\]]+\.ipynb)#([^\]]+)\]\]/g;
/**
 * Plugin to handle notebook block embedding
 */
const notebookEmbedPlugin = {
    id: '@jupyterlab/pkm-extension:notebook-embed',
    description: 'Embed notebook cells in markdown files',
    autoStart: true,
    requires: [
        _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_0__.IEditorTracker,
        _jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_1__.IMarkdownViewerTracker,
        _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_2__.INotebookTracker,
        _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_3__.IDocumentManager,
        _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_4__.IRenderMimeRegistry
    ],
    activate: (app, editorTracker, markdownTracker, notebookTracker, docManager, rendermime) => {
        console.log('Notebook embed plugin activated');
        // For now, we'll just add the CSS and leave the embedding functionality
        // as a placeholder since it requires more complex integration
        // Add CSS for embedded cells
        const style = document.createElement('style');
        style.textContent = `
      .pkm-embedded-cell {
        margin: 1rem 0;
        border: 1px solid var(--jp-border-color2);
        border-radius: 4px;
        overflow: hidden;
      }
      
      .pkm-embedded-cell-header {
        background-color: var(--jp-layout-color2);
        padding: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.875rem;
      }
      
      .pkm-embedded-cell-source {
        color: var(--jp-ui-font-color2);
      }
      
      .pkm-embedded-cell-status {
        color: var(--jp-ui-font-color3);
        font-style: italic;
      }
      
      .pkm-embedded-cell-status.modified {
        color: var(--jp-warn-color1);
      }
      
      .pkm-embedded-cell-content {
        border: none !important;
      }
      
      .pkm-notebook-embed-placeholder {
        margin: 1rem 0;
      }
      
      .pkm-embed-loading {
        padding: 1rem;
        background-color: var(--jp-layout-color1);
        border: 1px dashed var(--jp-border-color2);
        border-radius: 4px;
        color: var(--jp-ui-font-color2);
        text-align: center;
      }
    `;
        document.head.appendChild(style);
        // Log when notebook embeds are found in markdown
        markdownTracker.widgetAdded.connect((sender, widget) => {
            widget.context.ready.then(() => {
                widget.content.ready.then(() => {
                    const content = widget.content.node.textContent || '';
                    const matches = content.match(NOTEBOOK_EMBED_REGEX);
                    if (matches) {
                        console.log('Found notebook embeds:', matches);
                    }
                });
            });
        });
    }
};


/***/ }),

/***/ "./lib/search.js":
/*!***********************!*\
  !*** ./lib/search.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   searchPlugin: () => (/* binding */ searchPlugin)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/docmanager */ "webpack/sharing/consume/default/@jupyterlab/docmanager");
/* harmony import */ var _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_2__);



const COMMAND_SEARCH = 'pkm:search-notes';
/**
 * Search widget for PKM
 */
class SearchWidget extends _lumino_widgets__WEBPACK_IMPORTED_MODULE_2__.Panel {
    constructor(docManager) {
        super();
        this.docManager = docManager;
        this.addClass('pkm-search-widget');
        this.title.label = 'Search Notes';
        this.title.closable = true;
        this.createUI();
    }
    createUI() {
        // Search input
        const searchContainer = document.createElement('div');
        searchContainer.className = 'pkm-search-container';
        this.searchInput = document.createElement('input');
        this.searchInput.type = 'text';
        this.searchInput.placeholder = 'Search in all notes...';
        this.searchInput.className = 'pkm-search-input';
        const searchButton = document.createElement('button');
        searchButton.textContent = 'Search';
        searchButton.className = 'pkm-search-button';
        searchContainer.appendChild(this.searchInput);
        searchContainer.appendChild(searchButton);
        // Results container
        this.resultsContainer = document.createElement('div');
        this.resultsContainer.className = 'pkm-search-results';
        // Add to widget
        this.node.appendChild(searchContainer);
        this.node.appendChild(this.resultsContainer);
        // Event handlers
        const performSearch = () => {
            const query = this.searchInput.value.trim();
            if (query) {
                this.search(query);
            }
        };
        searchButton.addEventListener('click', performSearch);
        this.searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }
    async search(query) {
        this.resultsContainer.innerHTML = '<div class="pkm-search-loading">Searching...</div>';
        try {
            const results = await this.searchInFiles(query);
            this.displayResults(results);
        }
        catch (error) {
            console.error('Search error:', error);
            this.resultsContainer.innerHTML = '<div class="pkm-search-error">Search failed</div>';
        }
    }
    async searchInFiles(query) {
        const contents = this.docManager.services.contents;
        const results = [];
        const queryLower = query.toLowerCase();
        async function searchInFile(path) {
            const fileName = path.split('/').pop();
            const fileNameLower = fileName.toLowerCase();
            const matches = [];
            // Check if filename contains the query
            if (fileNameLower.includes(queryLower)) {
                matches.push({
                    line: 0,
                    text: `[Filename match: ${fileName}]`,
                    matchStart: fileNameLower.indexOf(queryLower),
                    matchEnd: fileNameLower.indexOf(queryLower) + query.length
                });
            }
            try {
                const file = await contents.get(path, { content: true });
                if (file.type === 'file' && file.content) {
                    // Handle markdown files
                    if (path.endsWith('.md')) {
                        const content = file.content;
                        const lines = content.split('\n');
                        lines.forEach((line, index) => {
                            const lineLower = line.toLowerCase();
                            let matchIndex = lineLower.indexOf(queryLower);
                            while (matchIndex !== -1) {
                                matches.push({
                                    line: index + 1,
                                    text: line,
                                    matchStart: matchIndex,
                                    matchEnd: matchIndex + query.length
                                });
                                matchIndex = lineLower.indexOf(queryLower, matchIndex + 1);
                            }
                        });
                    }
                    // Handle notebook files
                    else if (path.endsWith('.ipynb')) {
                        const notebook = file.content;
                        if (notebook.cells && Array.isArray(notebook.cells)) {
                            notebook.cells.forEach((cell, cellIndex) => {
                                if (cell.source) {
                                    const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
                                    const lines = source.split('\n');
                                    lines.forEach((line, lineIndex) => {
                                        const lineLower = line.toLowerCase();
                                        let matchIndex = lineLower.indexOf(queryLower);
                                        while (matchIndex !== -1) {
                                            matches.push({
                                                line: cellIndex + 1,
                                                text: `[Cell ${cellIndex + 1}] ${line}`,
                                                matchStart: matchIndex + 9 + cellIndex.toString().length,
                                                matchEnd: matchIndex + 9 + cellIndex.toString().length + query.length
                                            });
                                            matchIndex = lineLower.indexOf(queryLower, matchIndex + 1);
                                        }
                                    });
                                }
                            });
                        }
                    }
                    if (matches.length > 0) {
                        const title = fileName.endsWith('.md') ? fileName.slice(0, -3) :
                            fileName.endsWith('.ipynb') ? fileName.slice(0, -6) : fileName;
                        results.push({
                            path,
                            title,
                            matches
                        });
                    }
                }
            }
            catch (error) {
                console.error(`Error searching file ${path}:`, error);
            }
        }
        async function searchDirectory(path) {
            try {
                const listing = await contents.get(path, { content: true });
                if (listing.type !== 'directory' || !listing.content) {
                    return;
                }
                const promises = [];
                for (const item of listing.content) {
                    if (item.type === 'file' && (item.name.endsWith('.md') || item.name.endsWith('.ipynb'))) {
                        promises.push(searchInFile(item.path));
                    }
                    else if (item.type === 'directory') {
                        promises.push(searchDirectory(item.path));
                    }
                }
                await Promise.all(promises);
            }
            catch (error) {
                console.error(`Error searching directory ${path}:`, error);
            }
        }
        await searchDirectory('');
        return results;
    }
    displayResults(results) {
        if (results.length === 0) {
            this.resultsContainer.innerHTML = '<div class="pkm-search-no-results">No results found</div>';
            return;
        }
        this.resultsContainer.innerHTML = '';
        const summary = document.createElement('div');
        summary.className = 'pkm-search-summary';
        summary.textContent = `Found ${results.length} files with matches`;
        this.resultsContainer.appendChild(summary);
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'pkm-search-result-item';
            const header = document.createElement('div');
            header.className = 'pkm-search-result-header';
            const title = document.createElement('a');
            title.href = '#';
            title.className = 'pkm-search-result-title';
            title.textContent = result.title;
            title.addEventListener('click', async (event) => {
                event.preventDefault();
                await this.docManager.openOrReveal(result.path);
            });
            header.appendChild(title);
            const matchCount = document.createElement('span');
            matchCount.className = 'pkm-search-match-count';
            matchCount.textContent = `(${result.matches.length} matches)`;
            header.appendChild(matchCount);
            resultItem.appendChild(header);
            // Show first few matches
            const matchList = document.createElement('ul');
            matchList.className = 'pkm-search-match-list';
            result.matches.slice(0, 3).forEach(match => {
                const matchItem = document.createElement('li');
                matchItem.className = 'pkm-search-match-item';
                // Highlight the match
                const before = match.text.substring(0, match.matchStart);
                const matched = match.text.substring(match.matchStart, match.matchEnd);
                const after = match.text.substring(match.matchEnd);
                matchItem.innerHTML = `
          <span class="pkm-search-line-number">Line ${match.line}:</span>
          <span class="pkm-search-match-text">
            ${this.escapeHtml(before)}<mark>${this.escapeHtml(matched)}</mark>${this.escapeHtml(after)}
          </span>
        `;
                matchList.appendChild(matchItem);
            });
            if (result.matches.length > 3) {
                const more = document.createElement('li');
                more.className = 'pkm-search-more-matches';
                more.textContent = `...and ${result.matches.length - 3} more matches`;
                matchList.appendChild(more);
            }
            resultItem.appendChild(matchList);
            this.resultsContainer.appendChild(resultItem);
        });
    }
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    focus() {
        this.searchInput.focus();
    }
}
/**
 * Plugin for full-text search
 */
const searchPlugin = {
    id: '@jupyterlab/pkm-extension:search',
    description: 'Full-text search for markdown and notebook files',
    autoStart: true,
    requires: [_jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_1__.IDocumentManager],
    optional: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.ICommandPalette],
    activate: (app, docManager, palette) => {
        console.log('Search plugin activated');
        // Add search command
        app.commands.addCommand(COMMAND_SEARCH, {
            label: 'PKM: Search Notes',
            execute: () => {
                const widget = new SearchWidget(docManager);
                const main = new _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.MainAreaWidget({ content: widget });
                main.title.label = 'Search Notes';
                main.title.closable = true;
                app.shell.add(main, 'main');
                app.shell.activateById(main.id);
                widget.focus();
            }
        });
        // Add to command palette
        if (palette) {
            palette.addItem({
                command: COMMAND_SEARCH,
                category: 'PKM'
            });
        }
        // Add keyboard shortcut
        app.commands.addKeyBinding({
            command: COMMAND_SEARCH,
            keys: ['Alt F'],
            selector: 'body'
        });
        // Add CSS for search
        const style = document.createElement('style');
        style.textContent = `
      .pkm-search-widget {
        padding: 1rem;
        height: 100%;
        overflow-y: auto;
      }
      
      .pkm-search-container {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      
      .pkm-search-input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid var(--jp-border-color1);
        border-radius: 4px;
        font-size: 14px;
      }
      
      .pkm-search-button {
        padding: 0.5rem 1rem;
        background-color: var(--jp-brand-color1);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      
      .pkm-search-button:hover {
        background-color: var(--jp-brand-color2);
      }
      
      .pkm-search-loading,
      .pkm-search-error,
      .pkm-search-no-results {
        text-align: center;
        padding: 2rem;
        color: var(--jp-ui-font-color2);
      }
      
      .pkm-search-summary {
        margin-bottom: 1rem;
        color: var(--jp-ui-font-color2);
        font-size: 0.875rem;
      }
      
      .pkm-search-result-item {
        margin-bottom: 1.5rem;
        padding: 1rem;
        background-color: var(--jp-layout-color1);
        border-radius: 4px;
      }
      
      .pkm-search-result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }
      
      .pkm-search-result-title {
        font-weight: bold;
        color: var(--jp-content-link-color);
        text-decoration: none;
      }
      
      .pkm-search-result-title:hover {
        text-decoration: underline;
      }
      
      .pkm-search-match-count {
        font-size: 0.875rem;
        color: var(--jp-ui-font-color2);
      }
      
      .pkm-search-match-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .pkm-search-match-item {
        margin-bottom: 0.25rem;
        font-size: 0.875rem;
        color: var(--jp-ui-font-color1);
      }
      
      .pkm-search-line-number {
        color: var(--jp-ui-font-color2);
        margin-right: 0.5rem;
      }
      
      .pkm-search-match-text {
        font-family: var(--jp-code-font-family);
      }
      
      .pkm-search-match-text mark {
        background-color: var(--jp-warn-color2);
        padding: 0 2px;
      }
      
      .pkm-search-more-matches {
        color: var(--jp-ui-font-color2);
        font-style: italic;
      }
    `;
        document.head.appendChild(style);
    }
};


/***/ }),

/***/ "./lib/state.js":
/*!**********************!*\
  !*** ./lib/state.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PKMState: () => (/* binding */ PKMState),
/* harmony export */   pkmState: () => (/* binding */ pkmState)
/* harmony export */ });
/* harmony import */ var _lumino_signaling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lumino/signaling */ "webpack/sharing/consume/default/@lumino/signaling");
/* harmony import */ var _lumino_signaling__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lumino_signaling__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Implementation of PKM state service
 */
class PKMState {
    constructor() {
        this._markdownMode = 'edit';
        this._markdownModeChanged = new _lumino_signaling__WEBPACK_IMPORTED_MODULE_0__.Signal(this);
        this._isDisposed = false;
    }
    get markdownMode() {
        return this._markdownMode;
    }
    get markdownModeChanged() {
        return this._markdownModeChanged;
    }
    setMarkdownMode(mode) {
        if (this._markdownMode !== mode) {
            this._markdownMode = mode;
            this._markdownModeChanged.emit(mode);
        }
    }
    get isDisposed() {
        return this._isDisposed;
    }
    dispose() {
        if (this._isDisposed) {
            return;
        }
        this._isDisposed = true;
        _lumino_signaling__WEBPACK_IMPORTED_MODULE_0__.Signal.clearData(this);
    }
}
// Create a singleton instance
const pkmState = new PKMState();


/***/ }),

/***/ "./lib/wikilink-completer.js":
/*!***********************************!*\
  !*** ./lib/wikilink-completer.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setupWikilinkCompletion: () => (/* binding */ setupWikilinkCompletion)
/* harmony export */ });
/**
 * Collect all linkable files in the workspace (.md and .ipynb)
 */
async function getAllLinkableFiles(docManager) {
    const contents = docManager.services.contents;
    const files = [];
    async function collectFiles(path) {
        try {
            const listing = await contents.get(path, { content: true });
            if (listing.type !== 'directory' || !listing.content) {
                return;
            }
            for (const item of listing.content) {
                if (item.type === 'file' || item.type === 'notebook') {
                    if (item.name.endsWith('.md')) {
                        // Store filename without extension for .md files
                        const nameWithoutExt = item.name.slice(0, -3);
                        files.push({
                            name: nameWithoutExt,
                            path: item.path,
                            type: 'md'
                        });
                    }
                    else if (item.name.endsWith('.ipynb')) {
                        // Store full filename for .ipynb files (extension required for linking)
                        files.push({
                            name: item.name,
                            path: item.path,
                            type: 'ipynb'
                        });
                    }
                }
                else if (item.type === 'directory') {
                    await collectFiles(item.path);
                }
            }
        }
        catch (error) {
            console.error(`Error collecting files from ${path}:`, error);
        }
    }
    await collectFiles('');
    return files;
}
/**
 * Create autocomplete dropdown element
 */
function createAutocompleteDropdown() {
    const dropdown = document.createElement('div');
    dropdown.className = 'pkm-autocomplete-dropdown';
    dropdown.style.cssText = `
    position: absolute;
    background: var(--jp-layout-color1);
    border: 1px solid var(--jp-border-color1);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    display: none;
    font-family: var(--jp-code-font-family);
    font-size: var(--jp-code-font-size);
  `;
    document.body.appendChild(dropdown);
    return dropdown;
}
/**
 * Position dropdown relative to the [[ position, not cursor
 */
function positionDropdown(dropdown, editor, wikilinkStartColumn) {
    try {
        const position = editor.getCursorPosition();
        // Create a temporary position at the start of the wikilink
        const wikilinkPosition = {
            line: position.line,
            column: wikilinkStartColumn
        };
        const coords = editor.getCoordinateForPosition(wikilinkPosition);
        const editorRect = editor.host.getBoundingClientRect();
        // Ensure coordinates are valid
        if (coords && editorRect) {
            const left = Math.max(0, editorRect.left + (coords.left || 0));
            const top = Math.max(0, editorRect.top + (coords.top || 0));
            dropdown.style.left = `${left}px`;
            dropdown.style.top = `${top}px`;
        }
    }
    catch (error) {
        console.warn('Failed to position dropdown:', error);
        // Fallback positioning
        dropdown.style.left = '100px';
        dropdown.style.top = '100px';
    }
}
/**
 * Setup wikilink auto-completion for markdown editors
 */
function setupWikilinkCompletion(editorTracker, docManager) {
    const dropdown = createAutocompleteDropdown();
    let currentEditor = null;
    let selectedIndex = 0;
    let suggestions = [];
    let cachedFiles = [];
    let lastCacheTime = 0;
    const CACHE_DURATION = 5000; // 5 seconds
    let isInWikilinkContext = false;
    let wikilinkStartColumn = 0; // Track where the [[ starts
    // Hide dropdown when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
            isInWikilinkContext = false;
        }
    });
    // Global keydown handler for autocomplete navigation
    document.addEventListener('keydown', (event) => {
        if (dropdown.style.display === 'none' || !isInWikilinkContext || !currentEditor) {
            return;
        }
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                event.stopPropagation();
                selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
                updateDropdownSelection();
                break;
            case 'ArrowUp':
                event.preventDefault();
                event.stopPropagation();
                selectedIndex = Math.max(selectedIndex - 1, 0);
                updateDropdownSelection();
                break;
            case 'Enter':
            case 'Tab':
                if (suggestions.length > 0 && suggestions[selectedIndex]) {
                    event.preventDefault();
                    event.stopPropagation();
                    insertSuggestion(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                event.preventDefault();
                event.stopPropagation();
                dropdown.style.display = 'none';
                isInWikilinkContext = false;
                break;
        }
    }, true);
    // Function to get files with caching
    async function getFilesWithCache() {
        const now = Date.now();
        if (now - lastCacheTime > CACHE_DURATION || cachedFiles.length === 0) {
            console.log('Refreshing file cache...');
            cachedFiles = await getAllLinkableFiles(docManager);
            lastCacheTime = now;
            console.log(`Found ${cachedFiles.length} linkable files:`, cachedFiles.map(f => `${f.name} (${f.type})`));
        }
        return cachedFiles;
    }
    // Monitor for new editor widgets
    editorTracker.widgetAdded.connect(async (sender, widget) => {
        if (!widget.context.path.endsWith('.md')) {
            return;
        }
        const editor = widget.content.editor;
        const model = editor.model;
        // Cleanup function for when widget is disposed
        const cleanup = () => {
            if (currentEditor === editor) {
                dropdown.style.display = 'none';
                currentEditor = null;
                isInWikilinkContext = false;
            }
        };
        // Connect cleanup to widget disposal
        widget.disposed.connect(cleanup);
        // Monitor model changes for autocomplete trigger
        model.sharedModel.changed.connect(async () => {
            // Only process if this editor is currently active
            const activeWidget = editorTracker.currentWidget;
            if (!activeWidget || activeWidget !== widget) {
                return;
            }
            currentEditor = editor;
            const position = editor.getCursorPosition();
            const line = position.line;
            const column = position.column;
            // Get only the current line text up to cursor position
            const text = model.sharedModel.getSource();
            const lines = text.split('\n');
            const currentLine = lines[line] || '';
            const beforeCursorOnLine = currentLine.substring(0, column);
            // Check if we're in an INCOMPLETE wikilink context
            // Must have [[ before cursor, but NO ]] after the last [[
            const lastOpenBracket = beforeCursorOnLine.lastIndexOf('[[');
            if (lastOpenBracket === -1) {
                dropdown.style.display = 'none';
                isInWikilinkContext = false;
                return;
            }
            // Check if there's a ]] after the last [[ but before cursor
            const textAfterLastOpen = beforeCursorOnLine.substring(lastOpenBracket);
            if (textAfterLastOpen.includes(']]')) {
                dropdown.style.display = 'none';
                isInWikilinkContext = false;
                return;
            }
            // Extract the prefix after the last [[
            const prefix = textAfterLastOpen.substring(2); // Remove the [[
            // Also check that there's no | character (for link aliases)
            if (prefix.includes('|')) {
                dropdown.style.display = 'none';
                isInWikilinkContext = false;
                return;
            }
            isInWikilinkContext = true;
            wikilinkStartColumn = lastOpenBracket; // Store position of [[ for dropdown positioning
            console.log('Wikilink context detected:', {
                prefix,
                beforeCursorOnLine,
                lastOpenBracket,
                wikilinkStartColumn,
                textAfterLastOpen,
                line: line,
                column: column
            });
            // Get all linkable files (with caching)
            const files = await getFilesWithCache();
            // Filter files by prefix
            suggestions = files
                .filter(file => file.name.toLowerCase().includes(prefix.toLowerCase()))
                .sort((a, b) => {
                const aStarts = a.name.toLowerCase().startsWith(prefix.toLowerCase());
                const bStarts = b.name.toLowerCase().startsWith(prefix.toLowerCase());
                if (aStarts && !bStarts)
                    return -1;
                if (!aStarts && bStarts)
                    return 1;
                return a.name.localeCompare(b.name);
            })
                .slice(0, 10);
            console.log(`Found ${suggestions.length} suggestions for prefix "${prefix}"`);
            if (suggestions.length > 0) {
                selectedIndex = 0;
                showDropdown();
            }
            else {
                dropdown.style.display = 'none';
                isInWikilinkContext = false;
            }
        });
    });
    function showDropdown() {
        dropdown.innerHTML = '';
        suggestions.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'pkm-autocomplete-item';
            item.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        border-bottom: 1px solid var(--jp-border-color2);
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;
            const nameSpan = document.createElement('span');
            nameSpan.textContent = file.name;
            nameSpan.style.fontWeight = index === selectedIndex ? 'bold' : 'normal';
            const typeSpan = document.createElement('span');
            typeSpan.textContent = file.type === 'ipynb' ? '📓' : '📝';
            typeSpan.style.cssText = `
        font-size: 12px;
        opacity: 0.7;
        margin-left: 8px;
      `;
            item.appendChild(nameSpan);
            item.appendChild(typeSpan);
            if (index === selectedIndex) {
                item.style.backgroundColor = 'var(--jp-brand-color3)';
            }
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Clicked on suggestion:', file.name);
                insertSuggestion(file);
            });
            dropdown.appendChild(item);
        });
        dropdown.style.display = 'block';
        if (currentEditor) {
            positionDropdown(dropdown, currentEditor, wikilinkStartColumn);
        }
    }
    function updateDropdownSelection() {
        const items = dropdown.querySelectorAll('.pkm-autocomplete-item');
        items.forEach((item, index) => {
            const nameSpan = item.querySelector('span');
            if (nameSpan) {
                nameSpan.style.fontWeight = index === selectedIndex ? 'bold' : 'normal';
            }
            item.style.backgroundColor =
                index === selectedIndex ? 'var(--jp-brand-color3)' : 'transparent';
            // Scroll selected item into view
            if (index === selectedIndex) {
                item.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        });
    }
    function insertSuggestion(file) {
        if (!currentEditor) {
            console.warn('No current editor for insertion');
            return;
        }
        try {
            const position = currentEditor.getCursorPosition();
            const model = currentEditor.model;
            const text = model.sharedModel.getSource();
            const lines = text.split('\n');
            const currentLine = lines[position.line] || '';
            const beforeCursorOnLine = currentLine.substring(0, position.column);
            // Find the last [[ before cursor on current line
            const lastOpenBracket = beforeCursorOnLine.lastIndexOf('[[');
            if (lastOpenBracket !== -1) {
                const matchStartOnLine = lastOpenBracket + 2; // +2 to skip the [[
                const replacement = file.name + ']]';
                // Calculate the absolute position in the document
                let absoluteOffset = 0;
                for (let i = 0; i < position.line; i++) {
                    absoluteOffset += lines[i].length + 1; // +1 for newline
                }
                const absoluteMatchStart = absoluteOffset + matchStartOnLine;
                const absoluteCursorPos = absoluteOffset + position.column;
                console.log('Inserting suggestion:', {
                    file: file.name,
                    line: position.line,
                    column: position.column,
                    matchStartOnLine,
                    absoluteMatchStart,
                    absoluteCursorPos,
                    replacement,
                    lastOpenBracket,
                    beforeCursorOnLine
                });
                // Simple direct text replacement
                const beforeMatch = text.substring(0, absoluteMatchStart);
                const afterCursor = text.substring(absoluteCursorPos);
                const newText = beforeMatch + replacement + afterCursor;
                // Replace entire text content
                model.sharedModel.setSource(newText);
                // Position cursor after the inserted text
                const prefixLength = position.column - matchStartOnLine;
                const newColumn = position.column + replacement.length - prefixLength;
                const newPosition = {
                    line: position.line,
                    column: newColumn
                };
                // Set cursor position immediately
                currentEditor.setCursorPosition(newPosition);
                console.log('Insertion completed');
            }
            else {
                console.warn('No wikilink [[ found for insertion');
            }
        }
        catch (error) {
            console.error('Error inserting suggestion:', error);
        }
        dropdown.style.display = 'none';
        isInWikilinkContext = false;
    }
}


/***/ }),

/***/ "./lib/wikilinks.js":
/*!**************************!*\
  !*** ./lib/wikilinks.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   wikilinkPlugin: () => (/* binding */ wikilinkPlugin)
/* harmony export */ });
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state */ "./lib/state.js");
/* harmony import */ var _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/fileeditor */ "webpack/sharing/consume/default/@jupyterlab/fileeditor");
/* harmony import */ var _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/markdownviewer */ "webpack/sharing/consume/default/@jupyterlab/markdownviewer");
/* harmony import */ var _jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jupyterlab/rendermime */ "webpack/sharing/consume/default/@jupyterlab/rendermime");
/* harmony import */ var _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jupyterlab/docmanager */ "webpack/sharing/consume/default/@jupyterlab/docmanager");
/* harmony import */ var _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wikilink_completer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./wikilink-completer */ "./lib/wikilink-completer.js");







/**
 * Regular expressions for wikilink parsing
 */
const WIKILINK_REGEX = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
/**
 * Global mapping from display text to target for wikilinks
 * This survives HTML sanitization since it's stored in JavaScript, not DOM
 */
const wikilinkDisplayToTarget = new Map();
/**
 * Find all code spans in the text (inline code with backticks)
 */
function findCodeSpans(text) {
    const codeSpans = [];
    // Match both single and multiple backticks
    const codeRegex = /(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/g;
    let match;
    while ((match = codeRegex.exec(text)) !== null) {
        codeSpans.push({
            start: match.index,
            end: match.index + match[0].length
        });
    }
    return codeSpans;
}
/**
 * Check if a position is inside any code span
 */
function isInsideCodeSpan(position, codeSpans) {
    return codeSpans.some(span => position >= span.start && position < span.end);
}
/**
 * Parse wikilinks from text, excluding those inside code spans
 */
function parseWikilinks(text) {
    var _a, _b;
    console.log('parseWikilinks called with text containing:', text.includes('[[project-ideas|My Project Ideas]]') ? 'target wikilink' : 'other content');
    const links = [];
    const codeSpans = findCodeSpans(text);
    let match;
    WIKILINK_REGEX.lastIndex = 0; // Reset regex state
    while ((match = WIKILINK_REGEX.exec(text)) !== null) {
        // Skip wikilinks that are inside code spans
        if (!isInsideCodeSpan(match.index, codeSpans)) {
            console.log('Wikilink parsing:', {
                fullMatch: match[0],
                group1: match[1],
                group2: match[2],
                target: match[1].trim(),
                display: (_a = match[2]) === null || _a === void 0 ? void 0 : _a.trim()
            });
            links.push({
                fullMatch: match[0],
                target: match[1].trim(),
                display: (_b = match[2]) === null || _b === void 0 ? void 0 : _b.trim(),
                startIndex: match.index,
                endIndex: match.index + match[0].length
            });
        }
    }
    return links;
}
/**
 * Supported file extensions for wikilinks
 */
const SUPPORTED_EXTENSIONS = ['.md', '.ipynb', '.csv', '.json', '.geojson'];
/**
 * Get the appropriate file extension based on the filename
 */
function getFileExtension(filename) {
    // If filename already has a supported extension, use it
    for (const ext of SUPPORTED_EXTENSIONS) {
        if (filename.endsWith(ext)) {
            return ext;
        }
    }
    // Default to .md for files without extension
    return '.md';
}
/**
 * Get the base name without extension
 */
function getBaseName(filename) {
    for (const ext of SUPPORTED_EXTENSIONS) {
        if (filename.endsWith(ext)) {
            return filename.slice(0, -ext.length);
        }
    }
    return filename;
}
/**
 * Find file by name across all directories, supporting multiple extensions
 */
async function findFile(docManager, filename) {
    const contents = docManager.services.contents;
    // Determine target filename with proper extension
    const targetName = filename.includes('.') ? filename : `${filename}.md`;
    console.log('Searching for file:', filename, '-> target:', targetName);
    async function searchDirectory(path) {
        try {
            const listing = await contents.get(path, { content: true });
            if (listing.type !== 'directory' || !listing.content) {
                return null;
            }
            console.log(`Searching in directory: ${path || 'root'}, found ${listing.content.length} items`);
            for (const item of listing.content) {
                console.log(`  - ${item.name} (${item.type})`);
                if ((item.type === 'file' || item.type === 'notebook') && item.name === targetName) {
                    console.log(`Found match: ${item.path}`);
                    return item.path;
                }
                else if (item.type === 'directory') {
                    const found = await searchDirectory(item.path);
                    if (found) {
                        return found;
                    }
                }
            }
        }
        catch (error) {
            console.error(`Error searching directory ${path}:`, error);
        }
        return null;
    }
    return searchDirectory('');
}
/**
 * Set up Shift+click handling for wikilinks in markdown source editors
 */
function setupSourceWikilinkHandling(editorTracker, docManager) {
    // Function to handle Shift+click in editor
    const handleEditorClick = async (editor, event) => {
        var _a;
        if (!event.shiftKey) {
            return; // Only handle Shift+click
        }
        // Get cursor position and text
        const cursor = editor.getCursorPosition();
        const text = editor.model.sharedModel.getSource();
        // Convert cursor position to character offset
        const lines = text.split('\n');
        let offset = 0;
        for (let i = 0; i < cursor.line; i++) {
            offset += lines[i].length + 1; // +1 for newline
        }
        offset += cursor.column;
        // Find wikilink at cursor position
        const wikilink = findWikilinkAtPosition(text, offset);
        if (!wikilink) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        console.log('Shift+click on wikilink in source:', wikilink.target);
        // Try to find and open the file
        const filePath = await findFile(docManager, wikilink.target);
        if (filePath) {
            // File exists - open it
            let factory = undefined;
            if (filePath.endsWith('.md')) {
                factory = 'Editor'; // Open in source mode for Shift+click
            }
            await docManager.openOrReveal(filePath, factory);
        }
        else {
            // File doesn't exist - offer to create it
            const result = await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_5__.showDialog)({
                title: 'Create New Note',
                body: `Create new note "${wikilink.target}"?`,
                buttons: [
                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_5__.Dialog.cancelButton(),
                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_5__.Dialog.okButton({ label: 'Create' })
                ]
            });
            if (result.button.accept) {
                await createNewFile(docManager, wikilink.target, ((_a = editorTracker.currentWidget) === null || _a === void 0 ? void 0 : _a.context.path) || '');
            }
        }
    };
    // Set up click handlers for all current and future markdown editors
    editorTracker.widgetAdded.connect((sender, widget) => {
        if (widget.context.path.endsWith('.md')) {
            const editor = widget.content.editor;
            // Add click handler to the editor's DOM node
            const editorNode = editor.host;
            editorNode.addEventListener('click', (event) => {
                handleEditorClick(editor, event);
            });
        }
    });
    // Handle existing editors
    editorTracker.forEach(widget => {
        if (widget.context.path.endsWith('.md')) {
            const editor = widget.content.editor;
            const editorNode = editor.host;
            editorNode.addEventListener('click', (event) => {
                handleEditorClick(editor, event);
            });
        }
    });
}
/**
 * Find wikilink at a specific character position in text
 */
function findWikilinkAtPosition(text, position) {
    const codeSpans = findCodeSpans(text);
    // Skip if position is inside a code span
    if (isInsideCodeSpan(position, codeSpans)) {
        return null;
    }
    const links = parseWikilinks(text);
    // Find link that contains the position
    for (const link of links) {
        if (position >= link.startIndex && position <= link.endIndex) {
            return link;
        }
    }
    return null;
}
/**
 * Create a new file with appropriate content
 */
async function createNewFile(docManager, targetName, currentPath) {
    // Get current directory
    const currentDir = currentPath ? currentPath.substring(0, currentPath.lastIndexOf('/')) : '';
    // Determine file extension and content
    const extension = getFileExtension(targetName);
    const baseName = getBaseName(targetName);
    const fileName = targetName.includes('.') ? targetName : `${targetName}${extension}`;
    // Create new file path
    const newPath = currentDir ? `${currentDir}/${fileName}` : fileName;
    console.log('Creating new file at:', newPath);
    if (extension === '.ipynb') {
        // Use JupyterLab's built-in notebook creation
        try {
            const widget = await docManager.createNew(newPath, 'notebook');
            if (widget) {
                console.log('Created notebook successfully:', newPath);
                return;
            }
        }
        catch (error) {
            console.error('Failed to create notebook with factory:', error);
        }
    }
    // Create appropriate content
    let content;
    let format = 'text';
    switch (extension) {
        case '.ipynb':
            content = JSON.stringify({
                cells: [],
                metadata: {
                    kernelspec: {
                        display_name: 'Python 3',
                        language: 'python',
                        name: 'python3'
                    }
                },
                nbformat: 4,
                nbformat_minor: 4
            }, null, 2);
            format = 'json';
            break;
        case '.json':
            content = JSON.stringify({
                name: baseName,
                description: 'Description here'
            }, null, 2);
            format = 'json';
            break;
        case '.geojson':
            content = JSON.stringify({
                type: 'FeatureCollection',
                features: []
            }, null, 2);
            format = 'json';
            break;
        case '.csv':
            content = 'name,value\nexample,1\n';
            break;
        default: // .md
            content = `# ${baseName}\n\n`;
            break;
    }
    await docManager.services.contents.save(newPath, {
        type: 'file',
        format: format,
        content: content
    });
    // Open the new file in editor mode
    await docManager.openOrReveal(newPath, 'Editor');
}
/**
 * Plugin to handle wikilinks in markdown files
 */
const wikilinkPlugin = {
    id: '@jupyterlab/pkm-extension:wikilinks',
    description: 'Handle wikilinks in markdown files',
    autoStart: true,
    requires: [
        _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_1__.IEditorTracker,
        _jupyterlab_markdownviewer__WEBPACK_IMPORTED_MODULE_2__.IMarkdownViewerTracker,
        _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_4__.IDocumentManager,
        _jupyterlab_rendermime__WEBPACK_IMPORTED_MODULE_3__.IRenderMimeRegistry
    ],
    activate: (app, editorTracker, markdownTracker, docManager, rendermime) => {
        console.log('Wikilinks plugin activated');
        // Set up wikilink auto-completion
        (0,_wikilink_completer__WEBPACK_IMPORTED_MODULE_6__.setupWikilinkCompletion)(editorTracker, docManager);
        // Set up Shift+click handling for markdown source editors
        setupSourceWikilinkHandling(editorTracker, docManager);
        // Override the default markdown renderer
        const defaultFactory = rendermime.getFactory('text/markdown');
        if (defaultFactory) {
            rendermime.removeMimeType('text/markdown');
            rendermime.addFactory({
                safe: true,
                mimeTypes: ['text/markdown'],
                createRenderer: (options) => {
                    const renderer = defaultFactory.createRenderer(options);
                    const originalRenderModel = renderer.renderModel.bind(renderer);
                    renderer.renderModel = async (model) => {
                        // Ensure model has proper structure
                        if (!model || !model.data) {
                            console.warn('Invalid model structure:', model);
                            return originalRenderModel(model);
                        }
                        // Get the markdown source - handle different data structures
                        let source;
                        if (typeof model.data === 'string') {
                            source = model.data;
                        }
                        else if (model.data['text/markdown']) {
                            source = model.data['text/markdown'];
                        }
                        else if (model.data['text/plain']) {
                            source = model.data['text/plain'];
                        }
                        else {
                            console.warn('No markdown content found in model:', model);
                            return originalRenderModel(model);
                        }
                        // Parse wikilinks
                        const links = parseWikilinks(source);
                        // Process the markdown to convert wikilinks to standard links
                        let processedSource = source;
                        let offset = 0;
                        for (const link of links) {
                            console.log('Processing wikilink:', link.target);
                            const linkPath = await findFile(docManager, link.target);
                            console.log('Found path for', link.target, ':', linkPath);
                            const displayText = link.display || link.target;
                            // Store the mapping from display text to target (survives HTML sanitization)
                            wikilinkDisplayToTarget.set(displayText, link.target);
                            if (linkPath) {
                                wikilinkDisplayToTarget.set(displayText + '_PATH', linkPath);
                            }
                            console.log('Creating wikilink HTML:', {
                                originalTarget: link.target,
                                displayText: displayText,
                                linkPath: linkPath,
                                'stored in map': wikilinkDisplayToTarget.get(displayText)
                            });
                            let replacement;
                            // Check if this is an external link (starts with http:// or https://)
                            const isExternalLink = link.target.startsWith('http://') || link.target.startsWith('https://');
                            if (isExternalLink) {
                                // External link - create a regular link with external icon
                                replacement = `<a href="${link.target}" class="pkm-external-link" target="_blank" rel="noopener noreferrer">${displayText}</a>`;
                            }
                            else if (linkPath) {
                                // File exists - create a simple clickable link (HTML sanitization will remove all custom attributes)
                                replacement = `<a class="pkm-wikilink">${displayText}</a>`;
                                console.log('Generated HTML for existing file:', replacement);
                            }
                            else {
                                // File doesn't exist - create a broken link
                                replacement = `<a class="pkm-wikilink pkm-wikilink-broken">${displayText}</a>`;
                                console.log('Generated HTML for non-existing file:', replacement);
                            }
                            const adjustedStart = link.startIndex + offset;
                            const adjustedEnd = link.endIndex + offset;
                            processedSource =
                                processedSource.slice(0, adjustedStart) +
                                    replacement +
                                    processedSource.slice(adjustedEnd);
                            offset += replacement.length - link.fullMatch.length;
                        }
                        // Update the model with processed source - handle metadata
                        const processedModel = {
                            ...model,
                            data: typeof model.data === 'string' ? { 'text/markdown': processedSource } : {
                                ...model.data,
                                'text/markdown': processedSource
                            },
                            metadata: model.metadata || {},
                            trusted: model.trusted !== undefined ? model.trusted : true
                        };
                        // Render with the original method
                        await originalRenderModel(processedModel);
                        // Add click handlers to wikilinks after rendering
                        setTimeout(() => {
                            // Check if renderer is still valid and attached
                            if (!renderer.node || !renderer.node.isConnected) {
                                console.warn('Renderer node is not connected to DOM');
                                return;
                            }
                            const node = renderer.node;
                            // JupyterLab transforms our links, so we need to find them by class or by checking commandlinker-args
                            const allLinks = node.querySelectorAll('a');
                            const wikilinks = [];
                            allLinks.forEach((link) => {
                                // Check if it's our wikilink by class, attributes, or custom protocol
                                const href = link.getAttribute('href');
                                const commandlinkerArgs = link.getAttribute('commandlinker-args');
                                const isWikilink = link.classList.contains('pkm-wikilink') ||
                                    link.hasAttribute('data-wikilink') ||
                                    link.hasAttribute('data-target') ||
                                    link.hasAttribute('data-path') ||
                                    (href && href.startsWith('pkm-wikilink:'));
                                // Also check if commandlinker-args contains our wikilink data
                                if (isWikilink || (commandlinkerArgs && commandlinkerArgs.includes('"path"'))) {
                                    wikilinks.push(link);
                                }
                            });
                            console.log(`Found ${wikilinks.length} wikilinks in rendered content`);
                            wikilinks.forEach((link) => {
                                var _a;
                                console.log('Setting up click handler for link:', {
                                    outerHTML: link.outerHTML,
                                    attributes: Array.from(link.attributes).map(attr => `${attr.name}="${attr.value}"`),
                                    textContent: link.textContent
                                });
                                // Remove any existing click handlers to prevent duplicates
                                const newLink = link.cloneNode(true);
                                (_a = link.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(newLink, link);
                                newLink.addEventListener('click', async (event) => {
                                    var _a;
                                    event.preventDefault();
                                    event.stopPropagation();
                                    try {
                                        // Get the display text (only thing that survives HTML sanitization)
                                        const displayText = ((_a = newLink.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
                                        console.log('Click handler - displayText:', displayText, 'shiftKey:', event.shiftKey);
                                        // Look up the original target from our mapping
                                        const targetName = wikilinkDisplayToTarget.get(displayText) || '';
                                        const path = wikilinkDisplayToTarget.get(displayText + '_PATH') || '';
                                        console.log('Click handler - lookup results:', {
                                            displayText,
                                            targetName,
                                            path,
                                            'map size': wikilinkDisplayToTarget.size
                                        });
                                        // Log for debugging
                                        console.log('Wikilink clicked:', {
                                            path,
                                            targetName,
                                            displayText,
                                            classList: newLink.classList.toString()
                                        });
                                        // A link is broken ONLY if it explicitly has the broken class
                                        // Don't assume it's broken just because we can't extract the path from transformed HTML
                                        const isBrokenClass = newLink.classList.contains('pkm-wikilink-broken');
                                        const isBroken = isBrokenClass;
                                        if (isBroken) {
                                            // Handle broken link - prompt to create file
                                            if (!targetName || targetName.trim() === '') {
                                                console.error('Target name is undefined for broken wikilink', {
                                                    element: newLink,
                                                    classList: newLink.classList.toString(),
                                                    text: newLink.textContent,
                                                    href: newLink.getAttribute('href'),
                                                    allAttributes: Array.from(newLink.attributes).map(a => `${a.name}="${a.value}"`).join(' ')
                                                });
                                                return;
                                            }
                                            const result = await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_5__.showDialog)({
                                                title: 'Create New Note',
                                                body: `Create new note "${targetName}"?`,
                                                buttons: [
                                                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_5__.Dialog.cancelButton(),
                                                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_5__.Dialog.okButton({ label: 'Create' })
                                                ]
                                            });
                                            if (result.button.accept) {
                                                // Get current directory from the current file
                                                const currentWidget = markdownTracker.currentWidget || editorTracker.currentWidget;
                                                const currentPath = (currentWidget === null || currentWidget === void 0 ? void 0 : currentWidget.context.path) || '';
                                                const currentDir = currentPath ? currentPath.substring(0, currentPath.lastIndexOf('/')) : '';
                                                // Determine the appropriate file extension and content
                                                const extension = getFileExtension(targetName);
                                                const baseName = getBaseName(targetName);
                                                const fileName = targetName.includes('.') ? targetName : `${targetName}${extension}`;
                                                // Create new file path
                                                const newPath = currentDir ? `${currentDir}/${fileName}` : fileName;
                                                console.log('Creating new file at:', newPath);
                                                if (extension === '.ipynb') {
                                                    // Use JupyterLab's built-in notebook creation
                                                    try {
                                                        // Create notebook using the notebook factory
                                                        const widget = await docManager.createNew(newPath, 'notebook');
                                                        if (widget) {
                                                            console.log('Created notebook successfully:', newPath);
                                                            return; // Exit early since we've created and opened the notebook
                                                        }
                                                    }
                                                    catch (error) {
                                                        console.error('Failed to create notebook with factory, trying manual creation:', error);
                                                        // Fall back to manual creation if factory fails
                                                    }
                                                }
                                                // Create appropriate content based on file type
                                                let content;
                                                let format = 'text';
                                                switch (extension) {
                                                    case '.ipynb':
                                                        // Fallback manual creation with a very basic template
                                                        content = JSON.stringify({
                                                            cells: [],
                                                            metadata: {
                                                                kernelspec: {
                                                                    display_name: 'Python 3',
                                                                    language: 'python',
                                                                    name: 'python3'
                                                                }
                                                            },
                                                            nbformat: 4,
                                                            nbformat_minor: 4
                                                        }, null, 2);
                                                        format = 'json';
                                                        break;
                                                    case '.json':
                                                        content = JSON.stringify({
                                                            name: baseName,
                                                            description: 'Description here'
                                                        }, null, 2);
                                                        format = 'json';
                                                        break;
                                                    case '.geojson':
                                                        content = JSON.stringify({
                                                            type: 'FeatureCollection',
                                                            features: []
                                                        }, null, 2);
                                                        format = 'json';
                                                        break;
                                                    case '.csv':
                                                        content = 'name,value\nexample,1\n';
                                                        break;
                                                    default: // .md
                                                        content = `# ${baseName}\n\n`;
                                                        break;
                                                }
                                                await docManager.services.contents.save(newPath, {
                                                    type: 'file',
                                                    format: format,
                                                    content: content
                                                });
                                                // Open the new file with appropriate factory
                                                let factory = undefined;
                                                if (extension === '.md') {
                                                    factory = _state__WEBPACK_IMPORTED_MODULE_0__.pkmState.markdownMode === 'edit' ? 'Editor' : 'Markdown Preview';
                                                }
                                                // For other file types, let JupyterLab choose the default factory
                                                const widget = await docManager.openOrReveal(newPath, factory);
                                                // Enable auto-save for the new document
                                                if (widget && widget.context) {
                                                    widget.context.model.sharedModel.changed.connect(() => {
                                                        if (widget.context.model.dirty) {
                                                            widget.context.save();
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                        else {
                                            // Handle existing link - open the file
                                            console.log('Opening existing file. Path from data:', path, 'Target:', targetName, 'Shift+click:', event.shiftKey);
                                            if (path && path !== '' && path !== '#') {
                                                // We have a valid path, open it in the appropriate mode
                                                let factory = undefined;
                                                // Only use markdown mode for .md files
                                                if (path.endsWith('.md')) {
                                                    // Shift+click always opens in source mode, regular click respects current mode
                                                    factory = event.shiftKey ? 'Editor' : (_state__WEBPACK_IMPORTED_MODULE_0__.pkmState.markdownMode === 'edit' ? 'Editor' : 'Markdown Preview');
                                                }
                                                // For other file types, let JupyterLab choose the default factory
                                                await docManager.openOrReveal(path, factory);
                                            }
                                            else if (targetName) {
                                                // No path but we have targetName - try to find the file
                                                const foundPath = await findFile(docManager, targetName);
                                                if (foundPath) {
                                                    console.log('Found file at:', foundPath);
                                                    // Use appropriate factory based on file type
                                                    let factory = undefined;
                                                    // Only use markdown mode for .md files
                                                    if (foundPath.endsWith('.md')) {
                                                        // Shift+click always opens in source mode, regular click respects current mode
                                                        factory = event.shiftKey ? 'Editor' : (_state__WEBPACK_IMPORTED_MODULE_0__.pkmState.markdownMode === 'edit' ? 'Editor' : 'Markdown Preview');
                                                    }
                                                    // For other file types, let JupyterLab choose the default factory
                                                    await docManager.openOrReveal(foundPath, factory);
                                                }
                                                else {
                                                    console.error('Could not find file for target:', targetName);
                                                }
                                            }
                                            else {
                                                console.error('No path or target name available for existing wikilink');
                                            }
                                        }
                                    }
                                    catch (error) {
                                        console.error('Error handling wikilink click:', error);
                                        console.error('Target element:', newLink);
                                        console.error('All attributes:', Array.from(newLink.attributes).map(attr => ({ name: attr.name, value: attr.value })));
                                    }
                                });
                            });
                        }, 100);
                    };
                    return renderer;
                }
            }, 0);
        }
        // Add CSS for wikilinks
        const style = document.createElement('style');
        style.textContent = `
      .pkm-wikilink {
        color: #0969da;
        text-decoration: none;
        cursor: pointer;
      }
      
      .pkm-wikilink:hover {
        text-decoration: underline;
      }
      
      .pkm-wikilink-broken {
        color: #cf222e;
        text-decoration: none;
        cursor: pointer;
      }
      
      .pkm-wikilink-broken:hover {
        text-decoration: underline;
      }
    `;
        document.head.appendChild(style);
        // Set up auto-save for all markdown files
        editorTracker.widgetAdded.connect((sender, widget) => {
            if (widget.context.path.endsWith('.md')) {
                // Enable auto-save with a 2-second delay
                let saveTimeout = null;
                widget.context.model.contentChanged.connect(() => {
                    if (saveTimeout) {
                        clearTimeout(saveTimeout);
                    }
                    saveTimeout = setTimeout(() => {
                        if (widget.context.model.dirty) {
                            widget.context.save().catch(error => {
                                console.error('Auto-save failed:', error);
                            });
                        }
                    }, 2000);
                });
            }
        });
    }
};


/***/ })

}]);
//# sourceMappingURL=lib_index_js.cdcf861eca7066efc2f9.js.map