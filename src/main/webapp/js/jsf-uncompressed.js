if (typeof OpenAjax !== "undefined" &&
    typeof OpenAjax.hub.registerLibrary !== "undefined") {
    OpenAjax.hub.registerLibrary("jsf", "www.sun.com", "2.0", null);
}

if (!((jsf && jsf.specversion && jsf.specversion >= 20000 ) &&
      (jsf.implversion && jsf.implversion >= 3))) {

    var jsf = {};

    jsf.ajax = function() {

        var eventListeners = [];
        var errorListeners = [];

        /**
         * Determine if the current browser is part of Microsoft's failed attempt at
         * standards modification.
         * @ignore
         */
        var isIE = function isIE() {
            if (typeof isIECache !== "undefined") {
                return isIECache;
            }
            isIECache =
                   document.all && window.ActiveXObject &&
                   navigator.userAgent.toLowerCase().indexOf("msie") > -1 &&
                   navigator.userAgent.toLowerCase().indexOf("opera") == -1;
            return isIECache;
        };
        var isIECache;

        /**
         * Determine if loading scripts into the page executes the script.
         * This is instead of doing a complicated browser detection algorithm.  Some do, some don't.
         * @returns {boolean} does including a script in the dom execute it?
         * @ignore
         */
        var isAutoExec = function isAutoExec() {
            try {
                if (typeof isAutoExecCache !== "undefined") {
                    return isAutoExecCache;
                }
                var autoExecTestString = "<script>var mojarra = mojarra || {};mojarra.autoExecTest = true;</script>";
                var tempElement = document.createElement('span');
                tempElement.innerHTML = autoExecTestString;
                var body = document.getElementsByTagName('body')[0];
                var tempNode = body.appendChild(tempElement);
                if (mojarra && mojarra.autoExecTest) {
                    isAutoExecCache = true;
                    delete mojarra.autoExecTest;
                } else {
                    isAutoExecCache = false;
                }
                deleteNode(tempNode);
                return isAutoExecCache;
            } catch (ex) {
                // OK, that didn't work, we'll have to make an assumption
                if (typeof isAutoExecCache === "undefined") {
                    isAutoExecCache = false;
                }
                return isAutoExecCache;
            }
        };
        var isAutoExecCache;

        /**
         * @ignore
         */
        var getTransport = function getTransport() {
            var methods = [
                function() {
                    return new XMLHttpRequest();
                },
                function() {
                    return new ActiveXObject('Msxml2.XMLHTTP');
                },
                function() {
                    return new ActiveXObject('Microsoft.XMLHTTP');
                }
            ];

            var returnVal;
            for (var i = 0, len = methods.length; i < len; i++) {
                try {
                    returnVal = methods[i]();
                } catch(e) {
                    continue;
                }
                return returnVal;
            }
            throw new Error('Could not create an XHR object.');
        };

        /**
         * Find instance of passed String via getElementById
         * @ignore
         */
        var $ = function $() {
            var results = [], element;
            for (var i = 0; i < arguments.length; i++) {
                element = arguments[i];
                if (typeof element == 'string') {
                    element = document.getElementById(element);
                }
                results.push(element);
            }
            return results.length > 1 ? results : results[0];
        };

        /**
         * Get the form element which encloses the supplied element.
         * @param element - element to act against in search
         * @returns form element representing enclosing form, or first form if none found.
         * @ignore
         */
        var getForm = function getForm(element) {
            if (element) {
                var form = $(element);
                while (form) {

                    if (form.nodeName && (form.nodeName.toLowerCase() == 'form')) {
                        return form;
                    }
                    if (form.form) {
                        return form.form;
                    }
                    if (form.parentNode) {
                        form = form.parentNode;
                    } else {
                        form = null;
                    }
                }
                return document.forms[0];
            }
            return null;
        };

        /**
         * Check if a value exists in an array
         * @ignore
         */
        var isInArray = function isInArray(array, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === value) {
                    return true;
                }
            }
            return false;
        };


        /**
         * Evaluate JavaScript code in a global context.
         * @param src JavaScript code to evaluate
         * @ignore
         */
        var globalEval = function globalEval(src) {
            if (window.execScript) {
                window.execScript(src);
                return;
            }
            // We have to wrap the call in an anon function because of a firefox bug, where this is incorrectly set
            // We need to explicitly call window.eval because of a Chrome peculiarity
            var fn = function() {
                window.eval.call(window,src);
            };
            fn();
        };

        var stripScripts = function stripScripts(str) {
            // Regex to find all scripts in a string
            var findscripts = /<script[^>]*>([\S\s]*?)<\/script>/igm;
            // Regex to find one script, to isolate it's content [2] and attributes [1]
            var findscript = /<script([^>]*)>([\S\s]*?)<\/script>/im;
            // Regex to remove leading cruft
            var stripStart = /^\s*(<!--)*\s*(\/\/)*\s*(\/\*)*\s*(<!\[CDATA\[)*/;
            // Regex to find src attribute
            var findsrc = /src="([\S]*?)"/im;
            var initialnodes = [];
            var scripts = [];
            initialnodes = str.match(findscripts);
            while (!!initialnodes && initialnodes.length > 0) {
                var scriptStr = [];
                scriptStr = initialnodes.shift().match(findscript);
                var src = [];
                // check if src specified
                src = scriptStr[1].match(findsrc);
                var script;
                if ( !!src && src[1]) {
                    // if this is a file, load it
                    var url = src[1];
                    // if this is another copy of jsf.js, don't load it
                    // it's never necessary, and can make debugging difficult
                    if (/\/javax.faces.resource\/jsf.js\?ln=javax\.faces/.test(url)) {
                        script = false;
                    } else {
                        script = loadScript(url);
                    }
                } else if (!!scriptStr && scriptStr[2]){
                    // else get content of tag, without leading CDATA and such
                    script = scriptStr[2].replace(stripStart,"");
                } else {
                    script = false;
                }
                if (!!script) {
                    scripts.push(script);
                }
            }
            return scripts;
        };

        var loadScript = function loadScript(url) {
            var xhr = getTransport();
            if (xhr === null) {
                return "";
            }

            xhr.open("GET", url, false);
            xhr.setRequestHeader("Content-Type", "application/x-javascript");
            xhr.send(null);

            if (xhr.readyState == 4 && xhr.status == 200) {
                    return xhr.responseText;
            }

            return "";
        };

        var runScripts = function runScripts(scripts) {
            if (!scripts || scripts.length === 0) {
                return;
            }

            var head = document.getElementsByTagName('head')[0] || document.documentElement;
            while (scripts.length) {
                // create script node
                var scriptNode = document.createElement('script');
                scriptNode.type = 'text/javascript';
                scriptNode.text = scripts.shift(); // add the code to the script node
                head.appendChild(scriptNode); // add it to the page
                head.removeChild(scriptNode); // then remove it
            }
        };

        var elementReplaceStr = function elementReplaceStr(element, tempTagName, src) {
            var temp = document.createElement(tempTagName);
            if (element.id) {
                temp.id = element.id;
            }

            if (element.nodeName.toLowerCase() === "head") {
                throw new Error("Attempted to replace a head element - this is not allowed.");
            } else {
                var scripts = [];
                if (isAutoExec()) {
                    temp.innerHTML = src;
                } else {
                    scripts = stripScripts(src);
                    src = src.replace(/<script[^>]*>([\S\s]*?)<\/script>/igm,"");
                    temp.innerHTML = src;
                }
            }

            replaceNode(temp, element);            
            runScripts(scripts);

        };

        var getText = function getText(oNode, deep) {
            var Node = {ELEMENT_NODE: 1, ATTRIBUTE_NODE: 2, TEXT_NODE: 3, CDATA_SECTION_NODE: 4,
                ENTITY_REFERENCE_NODE: 5,  ENTITY_NODE: 6, PROCESSING_INSTRUCTION_NODE: 7,
                COMMENT_NODE: 8, DOCUMENT_NODE: 9, DOCUMENT_TYPE_NODE: 10,
                DOCUMENT_FRAGMENT_NODE: 11, NOTATION_NODE: 12};

            var s = "";
            var nodes = oNode.childNodes;
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                var nodeType = node.nodeType;
                if (nodeType == Node.TEXT_NODE || nodeType == Node.CDATA_SECTION_NODE) {
                    s += node.data;
                } else if (deep === true && (nodeType == Node.ELEMENT_NODE ||
                                             nodeType == Node.DOCUMENT_NODE ||
                                             nodeType == Node.DOCUMENT_FRAGMENT_NODE)) {
                    s += getText(node, true);
                }
            }
            return s;
        };

        var PARSED_OK = "Document contains no parsing errors";
        var PARSED_EMPTY = "Document is empty";
        var PARSED_UNKNOWN_ERROR = "Not well-formed or other error";
        var getParseErrorText;
        if (isIE()) {
            getParseErrorText = function (oDoc) {
                var parseErrorText = PARSED_OK;
                if (oDoc && oDoc.parseError && oDoc.parseError.errorCode && oDoc.parseError.errorCode !== 0) {
                    parseErrorText = "XML Parsing Error: " + oDoc.parseError.reason +
                                     "\nLocation: " + oDoc.parseError.url +
                                     "\nLine Number " + oDoc.parseError.line + ", Column " +
                                     oDoc.parseError.linepos +
                                     ":\n" + oDoc.parseError.srcText +
                                     "\n";
                    for (var i = 0; i < oDoc.parseError.linepos; i++) {
                        parseErrorText += "-";
                    }
                    parseErrorText += "^\n";
                }
                else if (oDoc.documentElement === null) {
                    parseErrorText = PARSED_EMPTY;
                }
                return parseErrorText;
            };
        } else { // (non-IE)

            getParseErrorText = function (oDoc) {
                var parseErrorText = PARSED_OK;
                if ((!oDoc) || (!oDoc.documentElement)) {
                    parseErrorText = PARSED_EMPTY;
                } else if (oDoc.documentElement.tagName == "parsererror") {
                    parseErrorText = oDoc.documentElement.firstChild.data;
                    parseErrorText += "\n" + oDoc.documentElement.firstChild.nextSibling.firstChild.data;
                } else if (oDoc.getElementsByTagName("parsererror").length > 0) {
                    var parsererror = oDoc.getElementsByTagName("parsererror")[0];
                    parseErrorText = getText(parsererror, true) + "\n";
                } else if (oDoc.parseError && oDoc.parseError.errorCode !== 0) {
                    parseErrorText = PARSED_UNKNOWN_ERROR;
                }
                return parseErrorText;
            };
        }

        if ((typeof(document.importNode) == "undefined") && isIE()) {
            try {
                /**
                 * Implementation of importNode for the context window document in IE.
                 * If <code>oNode</code> is a TextNode, <code>bChildren</code> is ignored.
                 * @param oNode the Node to import
                 * @param bChildren whether to include the children of oNode
                 * @returns the imported node for further use
                 * @ignore
                 * Note:  This code orginally from Sarissa: http://dev.abiss.gr/sarissa
                 */
                document.importNode = function(oNode, bChildren) {
                    var tmp;
                    if (oNode.nodeName == '#text') {
                        return document.createTextNode(oNode.data);
                    }
                    else {
                        if (oNode.nodeName == "tbody" || oNode.nodeName == "tr") {
                            tmp = document.createElement("table");
                        }
                        else if (oNode.nodeName == "td") {
                            tmp = document.createElement("tr");
                        }
                        else if (oNode.nodeName == "option") {
                            tmp = document.createElement("select");
                        }
                        else {
                            tmp = document.createElement("div");
                        }
                        if (bChildren) {
                            tmp.innerHTML = oNode.xml ? oNode.xml : oNode.outerHTML;
                        } else {
                            tmp.innerHTML = oNode.xml ? oNode.cloneNode(false).xml : oNode.cloneNode(false).outerHTML;
                        }
                        return tmp.getElementsByTagName("*")[0];
                    }
                };
            } catch(e) {
            }
        }
        // Setup Node type constants for those browsers that don't have them (IE)
        var Node = {ELEMENT_NODE: 1, ATTRIBUTE_NODE: 2, TEXT_NODE: 3, CDATA_SECTION_NODE: 4,
            ENTITY_REFERENCE_NODE: 5,  ENTITY_NODE: 6, PROCESSING_INSTRUCTION_NODE: 7,
            COMMENT_NODE: 8, DOCUMENT_NODE: 9, DOCUMENT_TYPE_NODE: 10,
            DOCUMENT_FRAGMENT_NODE: 11, NOTATION_NODE: 12};

        // PENDING - add support for removing handlers added via DOM 2 methods
        /**
         * Delete all events attached to a node
         * @param node
         * @ignore
         */
        var clearEvents = function clearEvents(node) {
            if (!node) {
                return;
            }

            // don't do anything for text and comment nodes - unnecessary
            if (node.nodeType == Node.TEXT_NODE || node.nodeType == Node.COMMENT_NODE) {
                return;
            }

            var events = ['abort', 'blur', 'change', 'error', 'focus', 'load', 'reset', 'resize', 'scroll', 'select', 'submit', 'unload',
            'keydown', 'keypress', 'keyup', 'click', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'dblclick' ];
            try {
                for (var e in events) {
                    if (events.hasOwnProperty(e)) {
                        node[e] = null;
                    }
                }
            } catch (ex) {
                // it's OK if it fails, at least we tried
            }
        };

        /**
         * Determine if this current browser is IE9 or greater 
         * @param node
         * @ignore
         */
        var isIE9Plus = function isIE9Plus() {
            return typeof XDomainRequest !== "undefined" && typeof window.msPerformance !== "undefined";
        }
        
        /**
         * Deletes node
         * @param node
         * @ignore
         */
        var deleteNode = function deleteNode(node) {
            if (!node) {
                return;
            }
            if (!node.parentNode) {
                // if there's no parent, there's nothing to do
                return;
            }
            if (!isIE() || (isIE() && isIE9Plus())) {
                // nothing special required
                node.parentNode.removeChild(node);
                return;
            }
            // The rest of this code is specialcasing for IE
            if (node.nodeName.toLowerCase() === "body") {
                // special case for removing body under IE.
                deleteChildren(node);
                try {
                    node.outerHTML = '';
                } catch (ex) {
                    // fails under some circumstances, but not in RI
                    // supplied responses.  If we've gotten here, it's
                    // fairly safe to leave a lingering body tag rather than
                    // fail outright
                }
                return;
            }
            var temp = node.ownerDocument.createElement('div');
            var parent = node.parentNode;
            temp.appendChild(parent.removeChild(node));
            // Now clean up the temporary element
            try {
                temp.outerHTML = ''; //prevent leak in IE
            } catch (ex) {
                // at least we tried.  Fails in some circumstances,
                // but not in RI supplied responses.  Better to leave a lingering
                // temporary div than to fail outright.
            }
        };

        /**
         * Deletes all children of a node
         * @param node
         * @ignore
         */
        var deleteChildren = function deleteChildren(node) {
            if (!node) {
                return;
            }
            for (var x = node.childNodes.length - 1; x >= 0; x--) { //delete all of node's children
                var childNode = node.childNodes[x];
                deleteNode(childNode);
            }
        };

        /**
         * <p> Copies the childNodes of nodeFrom to nodeTo</p>
         *
         * @param  nodeFrom the Node to copy the childNodes from
         * @param  nodeTo the Node to copy the childNodes to
         * @ignore
         * Note:  This code originally from Sarissa:  http://dev.abiss.gr/sarissa
         * It has been modified to fit into the overall codebase
         */
        var copyChildNodes = function copyChildNodes(nodeFrom, nodeTo) {

            if ((!nodeFrom) || (!nodeTo)) {
                throw "Both source and destination nodes must be provided";
            }

            deleteChildren(nodeTo);
            var nodes = nodeFrom.childNodes;
            // if within the same doc, just move, else copy and delete
            if (nodeFrom.ownerDocument == nodeTo.ownerDocument) {
                while (nodeFrom.firstChild) {
                    nodeTo.appendChild(nodeFrom.firstChild);
                }
            } else {
                var ownerDoc = nodeTo.nodeType == Node.DOCUMENT_NODE ? nodeTo : nodeTo.ownerDocument;
                var i;
                if (typeof(ownerDoc.importNode) != "undefined") {
                    for (i = 0; i < nodes.length; i++) {
                        nodeTo.appendChild(ownerDoc.importNode(nodes[i], true));
                    }
                } else {
                    for (i = 0; i < nodes.length; i++) {
                        nodeTo.appendChild(nodes[i].cloneNode(true));
                    }
                }
            }
        };

        var replaceNode = function replaceNode(newNode, node) {
               if(isIE()){
                    node.parentNode.insertBefore(newNode, node);
                    deleteNode(node);
               } else {
                    node.parentNode.replaceChild(newNode, node);
               }
        };

        var cloneAttributes = function cloneAttributes(target, source) {

            // enumerate core element attributes - without 'dir' as special case
            var coreElementAttributes = ['className', 'title', 'lang', 'xml:lang'];

            // Enumerate additional input element attributes
            var inputElementAttributes =
                    [   'name', 'value', 'checked', 'disabled', 'readOnly',
                        'size', 'maxLength', 'src', 'alt', 'useMap', 'isMap',
                        'tabIndex', 'accessKey', 'accept', 'type'
                    ];

            // Enumerate all the names of the event listeners
            var listenerNames =
                    [ 'onclick', 'ondblclick', 'onmousedown', 'onmousemove', 'onmouseout',
                        'onmouseover', 'onmouseup', 'onkeydown', 'onkeypress', 'onkeyup',
                        'onhelp', 'onblur', 'onfocus', 'onchange', 'onload', 'onunload', 'onabort',
                        'onreset', 'onselect', 'onsubmit'
                    ];

            var iIndex, iLength; // for loop variables
            var attributeName; // name of the attribute to set
            var newValue, oldValue; // attribute values in each element

            // First, copy over core attributes
            for (iIndex = 0,iLength = coreElementAttributes.length; iIndex < iLength; iIndex++) {
                attributeName = coreElementAttributes[iIndex];
                newValue = source[attributeName];
                oldValue = target[attributeName];
                if (oldValue != newValue) {
                    target[attributeName] = newValue;
                }
            }

            // Next, if it's an input, copy those over
            if (target.nodeName.toLowerCase() === 'input') {
                for (iIndex = 0,iLength = inputElementAttributes.length; iIndex < iLength; iIndex++) {
                    attributeName = inputElementAttributes[iIndex];
                    newValue = source[attributeName];
                    oldValue = target[attributeName];
                    if (oldValue != newValue) {
                        target[attributeName] = newValue;
                    }
                }
            }
            //'style' attribute special case
            var newStyle = source.getAttribute('style');
            var oldStyle = target.getAttribute('style');
            if (newStyle != oldStyle) {
                if (isIE()) {
                    target.style.setAttribute('cssText', newStyle, 0);
                } else {
                    target.setAttribute('style',newStyle);
                }
            }
            for (var lIndex = 0, lLength = listenerNames.length; lIndex < lLength; lIndex++) {
                var name = listenerNames[lIndex];
                target[name] = source[name] ? source[name] : null;
                if (source[name]) {
                    source[name] = null;
                }
            }
            // Special case for 'dir' attribute
            if (!isIE() && source.dir != target.dir) {
                target.dir = source.dir ? source.dir : null;
            }
        };

        var elementReplace = function elementReplace(newElement, origElement) {
            copyChildNodes(newElement, origElement);
            // sadly, we have to reparse all over again
            // to reregister the event handlers and styles
            // PENDING do some performance tests on large pages
            origElement.innerHTML = origElement.innerHTML;

            try {
                cloneAttributes(origElement, newElement);
            } catch (ex) {
                // if in dev mode, report an error, else try to limp onward
                if (jsf.getProjectStage() == "Development") {
                    throw new Error("Error updating attributes");
                }
            }
            deleteNode(newElement);

        };

        /**
         * Create a new document, then select the body element within it
         * @param docStr Stringified version of document to create
         * @return element the body element
         * @ignore
         */
        var getBodyElement = function getBodyElement(docStr) {

            var doc;  // intermediate document we'll create
            var body; // Body element to return

            if (typeof DOMParser !== "undefined") {  // FF, S, Chrome
                doc = (new DOMParser()).parseFromString(docStr, "text/xml");
            } else if (typeof ActiveXObject !== "undefined") { // IE
                doc = new ActiveXObject("MSXML2.DOMDocument");
                doc.loadXML(docStr);
            } else {
                throw new Error("You don't seem to be running a supported browser");
            }

            if (getParseErrorText(doc) !== PARSED_OK) {
                throw new Error(getParseErrorText(doc));
            }

            body = doc.getElementsByTagName("body")[0];

            if (!body) {
                throw new Error("Can't find body tag in returned document.");
            }

            return body;
        };

        /**
         * Do update.
         * @param element element to update
         * @param context context of request
         * @ignore
         */
        var doUpdate = function doUpdate(element, context) {
            var id, content, markup, state;
            var stateForm;
            var scripts = []; // temp holding value for array of script nodes

            id = element.getAttribute('id');
            if (id === "javax.faces.ViewState") {

                state = element.firstChild;

                // Now set the view state from the server into the DOM
                // but only for the form that submitted the request.

                stateForm = document.getElementById(context.formid);
                if (!stateForm || !stateForm.elements) {
                    // if the form went away for some reason, or it lacks elements 
                    // we're going to just return silently.
                    return;
                }
                var field = stateForm.elements["javax.faces.ViewState"];
                if (typeof field == 'undefined') {
                    field = document.createElement("input");
                    field.type = "hidden";
                    field.name = "javax.faces.ViewState";
                    stateForm.appendChild(field);
                }
                field.value = state.nodeValue;

                // Now set the view state from the server into the DOM
                // for any form that is a render target.

                if (typeof context.render !== 'undefined' && context.render !== null) {
                    var temp = context.render.split(' ');
                    for (var i = 0; i < temp.length; i++) {
                        if (temp.hasOwnProperty(i)) {
                            // See if the element is a form and
                            // the form is not the one that caused the submission..
                            var f = document.forms[temp[i]];
                            if (typeof f !== 'undefined' && f !== null && f.id !== context.formid) {
                                field = f.elements["javax.faces.ViewState"];
                                if (typeof field === 'undefined') {
                                    field = document.createElement("input");
                                    field.type = "hidden";
                                    field.name = "javax.faces.ViewState";
                                    f.appendChild(field);
                                }
                                field.value = state.nodeValue;
                            }
                        }
                    }
                }
                return;
            }

            // join the CDATA sections in the markup
            markup = '';
            for (var j = 0; j < element.childNodes.length; j++) {
                content = element.childNodes[j];
                markup += content.nodeValue;
            }

            var src = markup;

            // If our special render all markup is present..
            if (id === "javax.faces.ViewRoot" || id === "javax.faces.ViewBody") {
                var bodyStartEx = new RegExp("< *body[^>]*>", "gi");
                var bodyEndEx = new RegExp("< */ *body[^>]*>", "gi");
                var newsrc;

                var docBody = document.getElementsByTagName("body")[0];
                var bodyStart = bodyStartEx.exec(src);

                if (bodyStart !== null) { // replace body tag
                    // First, try with XML manipulation
                    try {
                        // Get scripts from text
                        scripts = stripScripts(src);
                        // Remove scripts from text
                        newsrc = src.replace(/<script[^>]*>([\S\s]*?)<\/script>/igm, "");
                        elementReplace(getBodyElement(newsrc), docBody);
                        runScripts(scripts);
                    } catch (e) {
                        // OK, replacing the body didn't work with XML - fall back to quirks mode insert
                        var srcBody, bodyEnd;
                        // if src contains </body>
                        bodyEnd = bodyEndEx.exec(src);
                        if (bodyEnd !== null) {
                            srcBody = src.substring(bodyStartEx.lastIndex,
                                    bodyEnd.index);
                        } else { // can't find the </body> tag, punt
                            srcBody = src.substring(bodyStartEx.lastIndex);
                        }
                        // replace body contents with innerHTML - note, script handling happens within function
                        elementReplaceStr(docBody, "body", srcBody);

                    }

                } else {  // replace body contents with innerHTML - note, script handling happens within function
                    elementReplaceStr(docBody, "body", src);
                }
            } else if (id === "javax.faces.ViewHead") {
                throw new Error("javax.faces.ViewHead not supported - browsers cannot reliably replace the head's contents");
            } else {
                var d = $(id);
                if (!d) {
                    throw new Error("During update: " + id + " not found");
                }
                var parent = d.parentNode;
                // Trim space padding before assigning to innerHTML
                var html = src.replace(/^\s+/g, '').replace(/\s+$/g, '');
                var parserElement = document.createElement('div');
                var tag = d.nodeName.toLowerCase();
                var tableElements = ['td', 'th', 'tr', 'tbody', 'thead', 'tfoot'];
                var isInTable = false;
                for (var tei = 0, tel = tableElements.length; tei < tel; tei++) {
                    if (tableElements[tei] == tag) {
                        isInTable = true;
                        break;
                    }
                }
                if (isInTable) {

                    if (isAutoExec()) {
                        // Create html
                        parserElement.innerHTML = '<table>' + html + '</table>';
                    } else {
                        // Get the scripts from the text
                        scripts = stripScripts(html);
                        // Remove scripts from text
                        html = html.replace(/<script[^>]*>([\S\s]*?)<\/script>/igm,"");
                        parserElement.innerHTML = '<table>' + html + '</table>';
                    }
                    var newElement = parserElement.firstChild;
                    //some browsers will also create intermediary elements such as table>tbody>tr>td
                    while ((null !== newElement) && (id !== newElement.id)) {
                        newElement = newElement.firstChild;
                    }
                    parent.replaceChild(newElement, d);
                    runScripts(scripts);
                } else if (d.nodeName.toLowerCase() === 'input') {
                    // special case handling for 'input' elements
                    // in order to not lose focus when updating,
                    // input elements need to be added in place.
                    parserElement = document.createElement('div');
                    parserElement.innerHTML = html;
                    newElement = parserElement.firstChild;

                    cloneAttributes(d, newElement);
                    deleteNode(parserElement);
                } else if (html.length > 0) {
                    if (isAutoExec()) {
                        // Create html
                        parserElement.innerHTML = html;
                    } else {
                        // Get the scripts from the text
                        scripts = stripScripts(html);
                        // Remove scripts from text
                        html = html.replace(/<script[^>]*>([\S\s]*?)<\/script>/igm,"");
                        parserElement.innerHTML = html;
                    }
                    replaceNode(parserElement.firstChild, d);
                    deleteNode(parserElement);
                    runScripts(scripts);
                }
            }
        };

        /**
         * Delete a node specified by the element.
         * @param element
         * @ignore
         */
        var doDelete = function doDelete(element) {
            var id = element.getAttribute('id');
            var target = $(id);
            deleteNode(target);
        };

        /**
         * Insert a node specified by the element.
         * @param element
         * @ignore
         */
        var doInsert = function doInsert(element) {
            var tablePattern = new RegExp("<\\s*(td|th|tr|tbody|thead|tfoot)", "i");
            var scripts = [];
            var target = $(element.firstChild.getAttribute('id'));
            var parent = target.parentNode;
            var html = element.firstChild.firstChild.nodeValue;
            var isInTable = tablePattern.test(html);

            if (!isAutoExec())  {
                // Get the scripts from the text
                scripts = stripScripts(html);
                // Remove scripts from text
                html = html.replace(/<script[^>]*>([\S\s]*?)<\/script>/igm,"");
            }
            var tempElement = document.createElement('div');
            var newElement = null;
            if (isInTable)  {
                tempElement.innerHTML = '<table>' + html + '</table>';
                newElement = tempElement.firstChild;
                //some browsers will also create intermediary elements such as table>tbody>tr>td
                //test for presence of id on the new element since we do not have it directly
                while ((null !== newElement) && ("" == newElement.id)) {
                    newElement = newElement.firstChild;
                }
            } else {
                tempElement.innerHTML = html;
                newElement = tempElement.firstChild;
            }

            if (element.firstChild.nodeName === 'after') {
                // Get the next in the list, to insert before
                target = target.nextSibling;
            }  // otherwise, this is a 'before' element
            if (!!tempElement.innerHTML) { // check if only scripts were inserted - if so, do nothing here
                parent.insertBefore(newElement, target);
            }
            runScripts(scripts);
            deleteNode(tempElement);
        };

        /**
         * Modify attributes of given element id.
         * @param element
         * @ignore
         */
        var doAttributes = function doAttributes(element) {

            // Get id of element we'll act against
            var id = element.getAttribute('id');

            var target = $(id);

            if (!target) {
                throw new Error("The specified id: " + id + " was not found in the page.");
            }

            // There can be multiple attributes modified.  Loop through the list.
            var nodes = element.childNodes;
            for (var i = 0; i < nodes.length; i++) {
                var name = nodes[i].getAttribute('name');
                var value = nodes[i].getAttribute('value');
                if (!isIE()) {
                    target.setAttribute(name, value);
                } else { // if it's IE, then quite a bit more work is required
                    if (name === 'class') {
                        name = 'className';
                        target.setAttribute(name, value, 0);
                    } else if (name === "for") {
                        name = 'htmlFor';
                        target.setAttribute(name, value, 0);
                    } else if (name === 'style') {
                        target.style.setAttribute('cssText', value, 0);
                    } else if (name.substring(0, 2) === 'on') {
                        var fn = function(value) {
                            return function() {
                                window.execScript(value);
                            };
                        }(value);
                        target.setAttribute(name, fn, 0);
                    } else if (name === 'dir') {
                        if (jsf.getProjectStage() == 'Development') {
                            throw new Error("Cannot set 'dir' attribute in IE");
                        }
                    } else {
                        target.setAttribute(name, value, 0);
                    }
                }
            }
        };

        /**
         * Eval the CDATA of the element.
         * @param element to eval
         * @ignore
         */
        var doEval = function doEval(element) {
            var evalText = element.firstChild.nodeValue;
            globalEval(evalText);
        };

        /**
         * Ajax Request Queue
         * @ignore
         */
        var Queue = new function Queue() {

            // Create the internal queue
            var queue = [];


            // the amount of space at the front of the queue, initialised to zero
            var queueSpace = 0;

            /** Returns the size of this Queue. The size of a Queue is equal to the number
             * of elements that have been enqueued minus the number of elements that have
             * been dequeued.
             * @ignore
             */
            this.getSize = function getSize() {
                return queue.length - queueSpace;
            };

            /** Returns true if this Queue is empty, and false otherwise. A Queue is empty
             * if the number of elements that have been enqueued equals the number of
             * elements that have been dequeued.
             * @ignore
             */
            this.isEmpty = function isEmpty() {
                return (queue.length === 0);
            };

            /** Enqueues the specified element in this Queue.
             *
             * @param element - the element to enqueue
             * @ignore
             */
            this.enqueue = function enqueue(element) {
                // Queue the request
                queue.push(element);
            };


            /** Dequeues an element from this Queue. The oldest element in this Queue is
             * removed and returned. If this Queue is empty then undefined is returned.
             *
             * @returns Object The element that was removed from the queue.
             * @ignore
             */
            this.dequeue = function dequeue() {
                // initialise the element to return to be undefined
                var element = undefined;

                // check whether the queue is empty
                if (queue.length) {
                    // fetch the oldest element in the queue
                    element = queue[queueSpace];

                    // update the amount of space and check whether a shift should occur
                    if (++queueSpace * 2 >= queue.length) {
                        // set the queue equal to the non-empty portion of the queue
                        queue = queue.slice(queueSpace);
                        // reset the amount of space at the front of the queue
                        queueSpace = 0;
                    }
                }
                // return the removed element
                try {
                    return element;
                } finally {
                    element = null; // IE 6 leak prevention
                }
            };

            /** Returns the oldest element in this Queue. If this Queue is empty then
             * undefined is returned. This function returns the same value as the dequeue
             * function, but does not remove the returned element from this Queue.
             * @ignore
             */
            this.getOldestElement = function getOldestElement() {
                // initialise the element to return to be undefined
                var element = undefined;

                // if the queue is not element then fetch the oldest element in the queue
                if (queue.length) {
                    element = queue[queueSpace];
                }
                // return the oldest element
                try {
                    return element;
                } finally {
                    element = null; //IE 6 leak prevention
                }
            };
        }();


        /**
         * AjaxEngine handles Ajax implementation details.
         * @ignore
         */
        var AjaxEngine = function AjaxEngine() {

            var req = {};                  // Request Object
            req.url = null;                // Request URL
            req.context = {};              // Context of request and response
            req.context.sourceid = null;   // Source of this request
            req.context.onerror = null;    // Error handler for request
            req.context.onevent = null;    // Event handler for request
            req.context.formid = null;     // Form that's the context for this request
            req.xmlReq = null;             // XMLHttpRequest Object
            req.async = true;              // Default - Asynchronous
            req.parameters = {};           // Parameters For GET or POST
            req.queryString = null;        // Encoded Data For GET or POST
            req.method = null;             // GET or POST
            req.status = null;             // Response Status Code From Server
            req.fromQueue = false;         // Indicates if the request was taken off the queue
            // before being sent.  This prevents the request from
            // entering the queue redundantly.

            req.que = Queue;

            // Get an XMLHttpRequest Handle
            req.xmlReq = getTransport();
            if (req.xmlReq === null) {
                return null;
            }

            function noop() {}
            
            // Set up request/response state callbacks
            /**
             * @ignore
             */
            req.xmlReq.onreadystatechange = function() {
                if (req.xmlReq.readyState === 4) {
                    req.onComplete();
                    // next two lines prevent closure/ciruclar reference leaks
                    // of XHR instances in IE
                    req.xmlReq.onreadystatechange = noop;
                    req.xmlReq = null;
                }
            };

            /**
             * This function is called when the request/response interaction
             * is complete.  If the return status code is successfull,
             * dequeue all requests from the queue that have completed.  If a
             * request has been found on the queue that has not been sent,
             * send the request.
             * @ignore
             */
            req.onComplete = function onComplete() {
                if (req.xmlReq.status && (req.xmlReq.status >= 200 && req.xmlReq.status < 300)) {
                    sendEvent(req.xmlReq, req.context, "complete");
                    jsf.ajax.response(req.xmlReq, req.context);
                } else {
                    sendEvent(req.xmlReq, req.context, "complete");
                    sendError(req.xmlReq, req.context, "httpError");
                }

                // Regardless of whether the request completed successfully (or not),
                // dequeue requests that have been completed (readyState 4) and send
                // requests that ready to be sent (readyState 0).

                var nextReq = req.que.getOldestElement();
                if (nextReq === null || typeof nextReq === 'undefined') {
                    return;
                }
                while ((typeof nextReq.xmlReq !== 'undefined' && nextReq.xmlReq !== null) &&
                       nextReq.xmlReq.readyState === 4) {
                    req.que.dequeue();
                    nextReq = req.que.getOldestElement();
                    if (nextReq === null || typeof nextReq === 'undefined') {
                        break;
                    }
                }
                if (nextReq === null || typeof nextReq === 'undefined') {
                    return;
                }
                if ((typeof nextReq.xmlReq !== 'undefined' && nextReq.xmlReq !== null) &&
                    nextReq.xmlReq.readyState === 0) {
                    nextReq.fromQueue = true;
                    nextReq.sendRequest();
                }
            };

            /**
             * Utility method that accepts additional arguments for the AjaxEngine.
             * If an argument is passed in that matches an AjaxEngine property, the
             * argument value becomes the value of the AjaxEngine property.
             * Arguments that don't match AjaxEngine properties are added as
             * request parameters.
             * @ignore
             */
            req.setupArguments = function(args) {
                for (var i in args) {
                    if (args.hasOwnProperty(i)) {
                        if (typeof req[i] === 'undefined') {
                            req.parameters[i] = args[i];
                        } else {
                            req[i] = args[i];
                        }
                    }
                }
            };

            /**
             * This function does final encoding of parameters, determines the request method
             * (GET or POST) and sends the request using the specified url.
             * @ignore
             */
            req.sendRequest = function() {
                if (req.xmlReq !== null) {
                    // if there is already a request on the queue waiting to be processed..
                    // just queue this request
                    if (!req.que.isEmpty()) {
                        if (!req.fromQueue) {
                            req.que.enqueue(req);
                            return;
                        }
                    }
                    // If the queue is empty, queue up this request and send
                    if (!req.fromQueue) {
                        req.que.enqueue(req);
                    }
                    // Some logic to get the real request URL
                    if (req.generateUniqueUrl && req.method == "GET") {
                        req.parameters["AjaxRequestUniqueId"] = new Date().getTime() + "" + req.requestIndex;
                    }
                    var content = null; // For POST requests, to hold query string
                    for (var i in req.parameters) {
                        if (req.parameters.hasOwnProperty(i)) {
                            if (req.queryString.length > 0) {
                                req.queryString += "&";
                            }
                            req.queryString += encodeURIComponent(i) + "=" + encodeURIComponent(req.parameters[i]);
                        }
                    }
                    if (req.method === "GET") {
                        if (req.queryString.length > 0) {
                            req.url += ((req.url.indexOf("?") > -1) ? "&" : "?") + req.queryString;
                        }
                    }
                    req.xmlReq.open(req.method, req.url, req.async);
                    // note that we are including the charset=UTF-8 as part of the content type (even
                    // if encodeURIComponent encodes as UTF-8), because with some
                    // browsers it will not be set in the request.  Some server implementations need to 
                    // determine the character encoding from the request header content type.
                    if (req.method === "POST") {
                        if (typeof req.xmlReq.setRequestHeader !== 'undefined') {
                            req.xmlReq.setRequestHeader('Faces-Request', 'partial/ajax');
                            req.xmlReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                        }
                        content = req.queryString;
                    }
                    // note that async == false is not a supported feature.  We may change it in ways
                    // that break existing programs at any time, with no warning.
                    if(!req.async) {
                        req.xmlReq.onreadystatechange = null; // no need for readystate change listening
                    }
                    sendEvent(req.xmlReq, req.context, "begin");
                    req.xmlReq.send(content);
                    if(!req.async){
                        req.onComplete();
                }
                }
            };

            return req;
        };

        /**
         * Error handling callback.
         * Assumes that the request has completed.
         * @ignore
         */
        var sendError = function sendError(request, context, status, description, serverErrorName, serverErrorMessage) {

            // Possible errornames:
            // httpError
            // emptyResponse
            // serverError
            // malformedXML

            var sent = false;
            var data = {};  // data payload for function
            data.type = "error";
            data.status = status;
            data.source = context.sourceid;
            data.responseCode = request.status;
            data.responseXML = request.responseXML;
            data.responseText = request.responseText;

            // ensure data source is the dom element and not the ID
            // per 14.4.1 of the 2.0 specification.
            if (typeof data.source === 'string') {
                data.source = document.getElementById(data.source);
            }

            if (description) {
                data.description = description;
            } else if (status == "httpError") {
                if (data.responseCode === 0) {
                    data.description = "The Http Transport returned a 0 status code.  This is usually the result of mixing ajax and full requests.  This is usually undesired, for both performance and data integrity reasons.";
                } else {
                    data.description = "There was an error communicating with the server, status: " + data.responseCode;
                }
            } else if (status == "serverError") {
                data.description = serverErrorMessage;
            } else if (status == "emptyResponse") {
                data.description = "An empty response was received from the server.  Check server error logs.";
            } else if (status == "malformedXML") {
                if (getParseErrorText(data.responseXML) !== PARSED_OK) {
                    data.description = getParseErrorText(data.responseXML);
                } else {
                    data.description = "An invalid XML response was received from the server.";
                }
            }

            if (status == "serverError") {
                data.errorName = serverErrorName;
                data.errorMessage = serverErrorMessage;
            }

            // If we have a registered callback, send the error to it.
            if (context.onerror) {
                context.onerror.call(null, data);
                sent = true;
            }

            for (var i in errorListeners) {
                if (errorListeners.hasOwnProperty(i)) {
                    errorListeners[i].call(null, data);
                    sent = true;
                }
            }

            if (!sent && jsf.getProjectStage() === "Development") {
                if (status == "serverError") {
                    alert("serverError: " + serverErrorName + " " + serverErrorMessage);
                } else {
                    alert(status + ": " + data.description);
                }
            }
        };

        var sendEvent = function sendEvent(request, context, status) {

            var data = {};
            data.type = "event";
            data.status = status;
            data.source = context.sourceid;
            // ensure data source is the dom element and not the ID
            // per 14.4.1 of the 2.0 specification.
            if (typeof data.source === 'string') {
                data.source = document.getElementById(data.source);
            }
            if (status !== 'begin') {
                data.responseCode = request.status;
                data.responseXML = request.responseXML;
                data.responseText = request.responseText;
            }

            if (context.onevent) {
                context.onevent.call(null, data);
            }

            for (var i in eventListeners) {
                if (eventListeners.hasOwnProperty(i)) {
                    eventListeners[i].call(null, data);
                }
            }
        };

        return {
            addOnError: function addOnError(callback) {
                if (typeof callback === 'function') {
                    errorListeners[errorListeners.length] = callback;
                } else {
                    throw new Error("jsf.ajax.addOnError:  Added a callback that was not a function.");
                }
            },
            addOnEvent: function addOnEvent(callback) {
                if (typeof callback === 'function') {
                    eventListeners[eventListeners.length] = callback;
                } else {
                    throw new Error("jsf.ajax.addOnEvent: Added a callback that was not a function");
                }
            },
           
            request: function request(source, event, options) {
                var element, form;
                var all, none;

                if (typeof source === 'undefined' || source === null) {
                    throw new Error("jsf.ajax.request: source not set");
                }

                if (typeof source === 'string') {
                    element = document.getElementById(source);
                } else if (typeof source === 'object') {
                    element = source;
                } else {
                    throw new Error("jsf.request: source must be object or string");
                }
                
                if (!element.name) {
                    element.name = element.id;
                }

                if (typeof(options) === 'undefined' || options === null) {
                    options = {};
                }

                var onerror = false;

                if (options.onerror && typeof options.onerror === 'function') {
                    onerror = options.onerror;
                } else if (options.onerror && typeof options.onerror !== 'function') {
                    throw new Error("jsf.ajax.request: Added an onerror callback that was not a function");
                }

                var onevent = false;

                if (options.onevent && typeof options.onevent === 'function') {
                    onevent = options.onevent;
                } else if (options.onevent && typeof options.onevent !== 'function') {
                    throw new Error("jsf.ajax.request: Added an onevent callback that was not a function");
                }

                form = getForm(element);
                if (!form) {
                    throw new Error("jsf.ajax.request: Method must be called within a form");
                }
                var viewState = jsf.getViewState(form);

                var args = {};

                args["javax.faces.source"] = element.id;

                if (event && !!event.type) {
                    args["javax.faces.partial.event"] = event.type;
                }


                if (options.execute) {
                    none = options.execute.search(/@none/);
                    if (none < 0) {
                        all = options.execute.search(/@all/);
                        if (all < 0) {
                            options.execute = options.execute.replace("@this", element.id);
                            options.execute = options.execute.replace("@form", form.id);
                            var temp = options.execute.split(' ');
                            if (!isInArray(temp, element.name)) {
                                options.execute = element.name + " " + options.execute;
                            }
                        } else {
                            options.execute = "@all";
                        }
                        args["javax.faces.partial.execute"] = options.execute;
                    }
                } else {
                    options.execute = element.name + " " + element.id;
                    args["javax.faces.partial.execute"] = options.execute;
                }

                if (options.render) {
                    none = options.render.search(/@none/);
                    if (none < 0) {
                        all = options.render.search(/@all/);
                        if (all < 0) {
                            options.render = options.render.replace("@this", element.id);
                            options.render = options.render.replace("@form", form.id);
                        } else {
                            options.render = "@all";
                        }
                        args["javax.faces.partial.render"] = options.render;
                    }
                }

                // remove non-passthrough options
                delete options.execute;
                delete options.render;
                delete options.onerror;
                delete options.onevent;
                // copy all other options to args
                for (var property in options) {
                    if (options.hasOwnProperty(property)) {
                        args[property] = options[property];
                    }
                }

                args["javax.faces.partial.ajax"] = "true";
                args["method"] = "POST";

                // Determine the posting url

                var encodedUrlField = form.elements["javax.faces.encodedURL"];
                if (typeof encodedUrlField == 'undefined') {
                    args["url"] = form.action;
                } else {
                    args["url"] = encodedUrlField.value;
                }

                var ajaxEngine = new AjaxEngine();
                ajaxEngine.setupArguments(args);
                ajaxEngine.queryString = viewState;
                ajaxEngine.context.onevent = onevent;
                ajaxEngine.context.onerror = onerror;
                ajaxEngine.context.sourceid = element.id;
                ajaxEngine.context.formid = form.id;
                ajaxEngine.context.render = args["javax.faces.partial.render"];
                ajaxEngine.sendRequest();

                // null out element variables to protect against IE memory leak
                element = null;
                form = null;

            },
            
            response: function response(request, context) {
                if (!request) {
                    throw new Error("jsf.ajax.response: Request parameter is unset");
                }

                // ensure context source is the dom element and not the ID
                // per 14.4.1 of the 2.0 specification.  We're doing it here
                // *before* any errors or events are propagated becasue the
                // DOM element may be removed after the update has been processed.
                if (typeof context.sourceid === 'string') {
                    context.sourceid = document.getElementById(context.sourceid);
                }

                var xml = request.responseXML;
                if (xml === null) {
                    sendError(request, context, "emptyResponse");
                    return;
                }

                if (getParseErrorText(xml) !== PARSED_OK) {
                    sendError(request, context, "malformedXML");
                    return;
                }

                var responseType = xml.getElementsByTagName("partial-response")[0].firstChild;

                if (responseType.nodeName === "error") { // it's an error
                    var errorName = responseType.firstChild.firstChild.nodeValue;
                    var errorMessage = responseType.firstChild.nextSibling.firstChild.nodeValue;
                    sendError(request, context, "serverError", null, errorName, errorMessage);
                    sendEvent(request, context, "success");
                    return;
                }


                if (responseType.nodeName === "redirect") {
                    window.location = responseType.getAttribute("url");
                    return;
                }


                if (responseType.nodeName !== "changes") {
                    sendError(request, context, "malformedXML", "Top level node must be one of: changes, redirect, error, received: " + responseType.nodeName + " instead.");
                    return;
                }


                var changes = responseType.childNodes;

                try {
                    for (var i = 0; i < changes.length; i++) {
                        switch (changes[i].nodeName) {
                            case "update":
                                doUpdate(changes[i], context);
                                break;
                            case "delete":
                                doDelete(changes[i]);
                                break;
                            case "insert":
                                doInsert(changes[i]);
                                break;
                            case "attributes":
                                doAttributes(changes[i]);
                                break;
                            case "eval":
                                doEval(changes[i]);
                                break;
                            case "extension":
                                // no action
                                break;
                            default:
                                sendError(request, context, "malformedXML", "Changes allowed are: update, delete, insert, attributes, eval, extension.  Received " + changes[i].nodeName + " instead.");
                                return;
                        }
                    }
                } catch (ex) {
                    sendError(request, context, "malformedXML", ex.message);
                    return;
                }
                sendEvent(request, context, "success");

            }
        };
    }();

    jsf.getProjectStage = function() {
        // First, return cached value if available
        if (typeof mojarra !== 'undefined' && typeof mojarra.projectStageCache !== 'undefined') {
            return mojarra.projectStageCache;
        }
        var scripts = document.getElementsByTagName("script"); // nodelist of scripts
        var script; // jsf.js script
        var s = 0; // incremental variable for for loop
        var stage; // temp value for stage
        var match; // temp value for match
        while (s < scripts.length) {
            if (typeof scripts[s].src === 'string' && scripts[s].src.match('\/javax\.faces\.resource\/jsf\.js\?.*ln=javax\.faces')) {
                script = scripts[s].src;
                break;
            }
            s++;
        }
        if (typeof script == "string") {
            match = script.match("stage=(.*)");
            if (match) {
                stage = match[1];
            }
        }
        if (typeof stage === 'undefined' || !stage) {
            stage = "Production";
        }

        mojarra = mojarra || {};
        mojarra.projectStageCache = stage;

        return mojarra.projectStageCache;
    };


    jsf.getViewState = function(form) {
        if (!form) {
            throw new Error("jsf.getViewState:  form must be set");
        }
        var els = form.elements;
        var len = els.length;
        // create an array which we'll use to hold all the intermediate strings
        // this bypasses a problem in IE when repeatedly concatenating very
        // large strings - we'll perform the concatenation once at the end
        var qString = [];
        var addField = function(name, value) {
            var tmpStr = "";
            if (qString.length > 0) {
                tmpStr = "&";
            }
            tmpStr += encodeURIComponent(name) + "=" + encodeURIComponent(value);
            qString.push(tmpStr);
        };
        for (var i = 0; i < len; i++) {
            var el = els[i];
            if (!el.disabled) {
                switch (el.type) {
                    case 'text':
                    case 'password':
                    case 'hidden':
                    case 'textarea':
                        addField(el.name, el.value);
                        break;
                    case 'select-one':
                        if (el.selectedIndex >= 0) {
                            addField(el.name, el.options[el.selectedIndex].value);
                        }
                        break;
                    case 'select-multiple':
                        for (var j = 0; j < el.options.length; j++) {
                            if (el.options[j].selected) {
                                addField(el.name, el.options[j].value);
                            }
                        }
                        break;
                    case 'checkbox':
                    case 'radio':
                        if (el.checked) {
                            addField(el.name, el.value || 'on');
                        }
                        break;
                }
            }
        }
        // concatenate the array
        return qString.join("");
    };

    /**
     * The namespace for JavaServer Faces JavaScript utilities.
     * @name jsf.util
     * @namespace
     */
    jsf.util = {};

    jsf.util.chain = function(source, event) {

        if (arguments.length < 3) {
            return true;
        }

        // RELEASE_PENDING rogerk - shouldn't this be getElementById instead of null
        var thisArg = (typeof source === 'object') ? source : null;

        // Call back any scripts that were passed in
        for (var i = 2; i < arguments.length; i++) {

            var f = new Function("event", arguments[i]);
            var returnValue = f.call(thisArg, event);

            if (returnValue === false) {
                return false;
            }
        }
        return true;
        
    };

    /**
     * <p>An integer specifying the specification version that this file implements.
     * It's format is: rightmost two digits, bug release number, next two digits,
     * minor release number, leftmost digits, major release number.
     * This number may only be incremented by a new release of the specification.</p>
     */
    jsf.specversion = 20000;

    /**
     * <p>An integer specifying the implementation version that this file implements.
     * It's a monotonically increasing number, reset with every increment of
     * <code>jsf.specversion</code>
     * This number is implementation dependent.</p>
     */
    jsf.implversion = 3;


} //end if version detection block

if (typeof OpenAjax !== "undefined" &&
    typeof OpenAjax.hub.registerLibrary !== "undefined") {
    OpenAjax.hub.registerLibrary("mojarra", "www.sun.com", "1.0", null);
}

/**
 * @name mojarra
 * @namespace
 */

/*
 * Create our top level namespaces - mojarra
 */
var mojarra = mojarra || {};


/**
 * This function deletes any hidden parameters added
 * to the form by checking for a variable called 'adp'
 * defined on the form.  If present, this variable will
 * contain all the params added by 'apf'.
 *
 * @param f - the target form
 */
mojarra.dpf = function dpf(f) {
    var adp = f.adp;
    if (adp !== null) {
        for (var i = 0; i < adp.length; i++) {
            f.removeChild(adp[i]);
        }
    }
};

mojarra.apf = function apf(f, pvp) {
    var adp = new Array();
    f.adp = adp;
    var i = 0;
    for (var k in pvp) {
        if (pvp.hasOwnProperty(k)) {
            var p = document.createElement("input");
            p.type = "hidden";
            p.name = k;
            p.value = pvp[k];
            f.appendChild(p);
            adp[i++] = p;
        }
    }
};

mojarra.jsfcljs = function jsfcljs(f, pvp, t) {
    mojarra.apf(f, pvp);
    var ft = f.target;
    if (t) {
        f.target = t;
    }
    f.submit();
    f.target = ft;
    mojarra.dpf(f);
};

/*
 * This is called by functions that need access to their calling
 * context, in the form of <code>this</code> and <code>event</code>
 * objects.
 *
 *  @param f the function to execute
 *  @param t this of the calling function
 *  @param e event of the calling function
 *  @return object that f returns
 */
mojarra.jsfcbk = function jsfcbk(f, t, e) {
    return f.call(t,e);
};

/*
 * This is called by the AjaxBehaviorRenderer script to
 * trigger a jsf.ajax.request() call.
 *
 *  @param s the source element or id
 *  @param e event of the calling function
 *  @param n name of the behavior event that has fired
 *  @param ex execute list
 *  @param re render list
 *  @param op options object
 */
mojarra.ab = function ab(s, e, n, ex, re, op) {
	
    if (!op) {
        op = {};
    }

    if (n) {
        op["javax.faces.behavior.event"] = n;
    }

    if (ex) {
        op["execute"] = ex;
    }

    if (re) {
        op["render"] = re;
    }
    
    jsf.ajax.request(s, e, op);
};
