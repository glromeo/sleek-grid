(function () {
    'use strict';

    if ('adoptedStyleSheets' in document) { return; }

    function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        return Constructor;
    }

    var hasShadyCss = 'ShadyCSS' in window && !window.ShadyCSS.nativeShadow;
    var deferredStyleSheets = [];
    var deferredDocumentStyleElements = [];
    var deferredAdopters = [];
    var adoptedSheetsRegistry = new WeakMap();
    var sheetMetadataRegistry = new WeakMap();
    var locationRegistry = new WeakMap();
    var shadowRootMap = new WeakMap();
    var observerRegistry = new WeakMap();
    var appliedActionsCursorRegistry = new WeakMap();
    var state = {
        loaded: false
    };
    var frame = {
        body: null,
        CSSStyleSheet: null
    };
    var OldCSSStyleSheet = CSSStyleSheet;

    var importPattern = /@import/;
    function checkAndPrepare(sheets, container) {
        var locationType = container === document ? 'Document' : 'ShadowRoot';
        if (!Array.isArray(sheets)) {
            throw new TypeError("Failed to set the 'adoptedStyleSheets' property on " + locationType + ": Iterator getter is not callable.");
        }
        if (!sheets.every(instanceOfStyleSheet)) {
            throw new TypeError("Failed to set the 'adoptedStyleSheets' property on " + locationType + ": Failed to convert value to 'CSSStyleSheet'");
        }
        var uniqueSheets = sheets.filter(function (value, index) {
            return sheets.indexOf(value) === index;
        });
        adoptedSheetsRegistry.set(container, uniqueSheets);
        return uniqueSheets;
    }
    function isDocumentLoading() {
        return document.readyState === 'loading';
    }
    function getAdoptedStyleSheet(location) {
        return adoptedSheetsRegistry.get(location.parentNode === document.documentElement ? document : location);
    }
    function rejectImports(contents) {
        if (contents === void 0) {
            contents = '';
        }
        var imports = contents.match(importPattern) || [];
        var sheetContent = contents;
        if (imports.length) {
            console.warn('@import rules are not allowed here. See https://github.com/WICG/construct-stylesheets/issues/119#issuecomment-588352418');
            imports.forEach(function (_import) {
                sheetContent = sheetContent.replace(_import, '');
            });
        }
        return sheetContent;
    }

    var cssStyleSheetMethods = ['addImport', 'addPageRule', 'addRule', 'deleteRule', 'insertRule', 'removeImport', 'removeRule'];
    var illegalInvocation = 'Illegal invocation';
    function updatePrototype(proto) {
        proto.replace = function () {
            return Promise.reject(new DOMException("Can't call replace on non-constructed CSSStyleSheets."));
        };
        proto.replaceSync = function () {
            throw new DOMException("Failed to execute 'replaceSync' on 'CSSStyleSheet': Can't call replaceSync on non-constructed CSSStyleSheets.");
        };
    }
    function updateAdopters(sheet) {
        var _sheetMetadataRegistr = sheetMetadataRegistry.get(sheet),
            adopters = _sheetMetadataRegistr.adopters,
            basicStyleElement = _sheetMetadataRegistr.basicStyleElement;
        adopters.forEach(function (styleElement) {
            styleElement.innerHTML = basicStyleElement.innerHTML;
        });
    }
    var ConstructStyleSheet =
        function () {
            function ConstructStyleSheet() {
                var basicStyleElement = document.createElement('style');
                if (state.loaded) {
                    frame.body.appendChild(basicStyleElement);
                } else {
                    document.head.appendChild(basicStyleElement);
                    basicStyleElement.disabled = true;
                    deferredStyleSheets.push(basicStyleElement);
                }
                sheetMetadataRegistry.set(this, {
                    adopters: new Map(),
                    actions: [],
                    basicStyleElement: basicStyleElement
                });
            }
            var _proto = ConstructStyleSheet.prototype;
            _proto.replace = function replace(contents) {
                var sanitized = rejectImports(contents);
                try {
                    if (!sheetMetadataRegistry.has(this)) {
                        throw new TypeError(illegalInvocation);
                    }
                    var _sheetMetadataRegistr2 = sheetMetadataRegistry.get(this),
                        basicStyleElement = _sheetMetadataRegistr2.basicStyleElement;
                    basicStyleElement.innerHTML = sanitized;
                    updateAdopters(this);
                    return Promise.resolve(this);
                } catch (ex) {
                    return Promise.reject(ex);
                }
            };
            _proto.replaceSync = function replaceSync(contents) {
                var sanitized = rejectImports(contents);
                if (!sheetMetadataRegistry.has(this)) {
                    throw new TypeError(illegalInvocation);
                }
                var _sheetMetadataRegistr3 = sheetMetadataRegistry.get(this),
                    basicStyleElement = _sheetMetadataRegistr3.basicStyleElement;
                basicStyleElement.innerHTML = sanitized;
                updateAdopters(this);
                return this;
            };
            _createClass(ConstructStyleSheet, [{
                key: "cssRules",
                get: function get() {
                    if (!sheetMetadataRegistry.has(this)) {
                        throw new TypeError(illegalInvocation);
                    }
                    var _sheetMetadataRegistr4 = sheetMetadataRegistry.get(this),
                        basicStyleElement = _sheetMetadataRegistr4.basicStyleElement;
                    return basicStyleElement.sheet.cssRules;
                }
            }]);
            return ConstructStyleSheet;
        }();
    cssStyleSheetMethods.forEach(function (method) {
        ConstructStyleSheet.prototype[method] = function () {
            if (!sheetMetadataRegistry.has(this)) {
                throw new TypeError(illegalInvocation);
            }
            var args = arguments;
            var _sheetMetadataRegistr5 = sheetMetadataRegistry.get(this),
                adopters = _sheetMetadataRegistr5.adopters,
                actions = _sheetMetadataRegistr5.actions,
                basicStyleElement = _sheetMetadataRegistr5.basicStyleElement;
            var result = basicStyleElement.sheet[method].apply(basicStyleElement.sheet, args);
            adopters.forEach(function (styleElement) {
                if (styleElement.sheet) {
                    styleElement.sheet[method].apply(styleElement.sheet, args);
                }
            });
            actions.push([method, args]);
            return result;
        };
    });
    function instanceOfStyleSheet(instance) {
        return instance && instance.constructor === ConstructStyleSheet || instance instanceof OldCSSStyleSheet || instance instanceof frame.CSSStyleSheet;
    }
    Object.defineProperty(ConstructStyleSheet, Symbol.hasInstance, {
        configurable: true,
        value: instanceOfStyleSheet
    });

    function adoptStyleSheets(location) {
        var newStyles = document.createDocumentFragment();
        var sheets = getAdoptedStyleSheet(location);
        var observer = observerRegistry.get(location);
        for (var i = 0, len = sheets.length; i < len; i++) {
            var _sheetMetadataRegistr = sheetMetadataRegistry.get(sheets[i]),
                adopters = _sheetMetadataRegistr.adopters,
                basicStyleElement = _sheetMetadataRegistr.basicStyleElement;
            var elementToAdopt = adopters.get(location);
            if (elementToAdopt) {
                observer.disconnect();
                newStyles.appendChild(elementToAdopt);
                if (!elementToAdopt.innerHTML || elementToAdopt.sheet && !elementToAdopt.sheet.cssText) {
                    elementToAdopt.innerHTML = basicStyleElement.innerHTML;
                }
                observer.observe();
            } else {
                elementToAdopt = document.createElement('style');
                elementToAdopt.innerHTML = basicStyleElement.innerHTML;
                locationRegistry.set(elementToAdopt, location);
                appliedActionsCursorRegistry.set(elementToAdopt, 0);
                adopters.set(location, elementToAdopt);
                newStyles.appendChild(elementToAdopt);
            }
            if (location === document.head) {
                deferredDocumentStyleElements.push(elementToAdopt);
            }
        }
        location.insertBefore(newStyles, location.lastChild);
        for (var _i = 0, _len = sheets.length; _i < _len; _i++) {
            var _sheetMetadataRegistr2 = sheetMetadataRegistry.get(sheets[_i]),
                _adopters = _sheetMetadataRegistr2.adopters,
                actions = _sheetMetadataRegistr2.actions;
            var adoptedStyleElement = _adopters.get(location);
            var cursor = appliedActionsCursorRegistry.get(adoptedStyleElement);
            if (actions.length > 0) {
                for (var _i2 = cursor, _len2 = actions.length; _i2 < _len2; _i2++) {
                    var _actions$_i = actions[_i2],
                        key = _actions$_i[0],
                        args = _actions$_i[1];
                    adoptedStyleElement.sheet[key].apply(adoptedStyleElement.sheet, args);
                }
                appliedActionsCursorRegistry.set(adoptedStyleElement, actions.length - 1);
            }
        }
    }
    function removeExcludedStyleSheets(location, oldSheets) {
        var sheets = getAdoptedStyleSheet(location);
        for (var i = 0, len = oldSheets.length; i < len; i++) {
            if (sheets.indexOf(oldSheets[i]) > -1) {
                continue;
            }
            var _sheetMetadataRegistr3 = sheetMetadataRegistry.get(oldSheets[i]),
                adopters = _sheetMetadataRegistr3.adopters;
            var observer = observerRegistry.get(location);
            var styleElement = adopters.get(location);
            if (!styleElement) {
                styleElement = adopters.get(document.head);
            }
            observer.disconnect();
            styleElement.remove();
            observer.observe();
        }
    }

    function adoptAndRestoreStylesOnMutationCallback(mutations) {
        if (!document) {
            return;
        }
        for (var i = 0, len = mutations.length; i < len; i++) {
            var _mutations$i = mutations[i],
                addedNodes = _mutations$i.addedNodes,
                removedNodes = _mutations$i.removedNodes;
            for (var _i = 0, _len = removedNodes.length; _i < _len; _i++) {
                var location = locationRegistry.get(removedNodes[_i]);
                if (location) {
                    adoptStyleSheets(location);
                }
            }
            if (!hasShadyCss) {
                for (var _i2 = 0, _len2 = addedNodes.length; _i2 < _len2; _i2++) {
                    var iter = document.createNodeIterator(addedNodes[_i2], NodeFilter.SHOW_ELEMENT, function (node) {
                            var shadowRoot = shadowRootMap.get(node);
                            return shadowRoot && shadowRoot.adoptedStyleSheets.length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                        },
                        null, false);
                    var node = void 0;
                    while (node = iter.nextNode()) {
                        adoptStyleSheets(shadowRootMap.get(node));
                    }
                }
            }
        }
    }
    function createObserver(location) {
        var observer = new MutationObserver(adoptAndRestoreStylesOnMutationCallback);
        var observerTool = {
            observe: function observe() {
                observer.observe(location, {
                    childList: true,
                    subtree: true
                });
            },
            disconnect: function disconnect() {
                observer.disconnect();
            }
        };
        observerRegistry.set(location, observerTool);
        observerTool.observe();
    }

    function initPolyfill() {
        var iframe = document.createElement('iframe');
        iframe.hidden = true;
        document.body.appendChild(iframe);
        frame.body = iframe.contentWindow.document.body;
        frame.CSSStyleSheet = iframe.contentWindow.CSSStyleSheet;
        updatePrototype(iframe.contentWindow.CSSStyleSheet.prototype);
        createObserver(document.body);
        state.loaded = true;
        var fragment = document.createDocumentFragment();
        for (var i = 0, len = deferredStyleSheets.length; i < len; i++) {
            deferredStyleSheets[i].disabled = false;
            fragment.appendChild(deferredStyleSheets[i]);
        }
        frame.body.appendChild(fragment);
        for (var _i = 0, _len = deferredDocumentStyleElements.length; _i < _len; _i++) {
            fragment.appendChild(deferredDocumentStyleElements[_i]);
        }
        document.body.insertBefore(fragment, document.body.firstChild);
        for (var _i2 = 0, _len2 = deferredAdopters.length; _i2 < _len2; _i2++) {
            adoptStyleSheets(deferredAdopters[_i2]);
        }
        deferredAdopters.length = 0;
        deferredStyleSheets.length = 0;
        deferredDocumentStyleElements.length = 0;
    }
    function initAdoptedStyleSheets() {
        var adoptedStyleSheetAccessors = {
            configurable: true,
            get: function get() {
                return adoptedSheetsRegistry.get(this) || [];
            },
            set: function set(sheets) {
                var oldSheets = adoptedSheetsRegistry.get(this) || [];
                checkAndPrepare(sheets, this);
                var location = this === document ?
                    isDocumentLoading() ? this.head : this.body : this;
                var isConnected = 'isConnected' in location ? location.isConnected : document.body.contains(location);
                if (isConnected) {
                    window.requestAnimationFrame(function () {
                        adoptStyleSheets(location);
                        removeExcludedStyleSheets(location, oldSheets);
                    });
                } else {
                    deferredAdopters.push(location);
                }
            }
        };
        Object.defineProperty(Document.prototype, 'adoptedStyleSheets', adoptedStyleSheetAccessors);
        if (typeof ShadowRoot !== 'undefined') {
            var attachShadow = Element.prototype.attachShadow;
            Element.prototype.attachShadow = function () {
                var location = hasShadyCss ? this : attachShadow.apply(this, arguments);
                shadowRootMap.set(this, location);
                createObserver(location);
                return location;
            };
            Object.defineProperty(ShadowRoot.prototype, 'adoptedStyleSheets', adoptedStyleSheetAccessors);
        }
    }

    updatePrototype(OldCSSStyleSheet.prototype);
    window.CSSStyleSheet = ConstructStyleSheet;
    initAdoptedStyleSheets();
    if (isDocumentLoading()) {
        document.addEventListener('DOMContentLoaded', initPolyfill);
    } else {
        initPolyfill();
    }

}());
