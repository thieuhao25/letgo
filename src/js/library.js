/*!
  Javascript library:
  - Popper.min.js
  - Bootstrap v4.1.0
  - Clipboard.js v2.0.0
  - Holder v2.9.4
  - JavaScript for Bootstrap's docs
  - Datetimepicker for Bootstrap 4
*//*
/*!
 * jQuery Migrate - v1.2.1 - 2013-05-08
 * https://github.com/jquery/jquery-migrate
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors; Licensed MIT
 */
/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */
(function(d){function e(a){var b=a||window.event,c=[].slice.call(arguments,1),f=0,e=0,g=0,a=d.event.fix(b);a.type="mousewheel";b.wheelDelta&&(f=b.wheelDelta/120);b.detail&&(f=-b.detail/3);g=f;b.axis!==void 0&&b.axis===b.HORIZONTAL_AXIS&&(g=0,e=-1*f);b.wheelDeltaY!==void 0&&(g=b.wheelDeltaY/120);b.wheelDeltaX!==void 0&&(e=-1*b.wheelDeltaX/120);c.unshift(a,f,e,g);return(d.event.dispatch||d.event.handle).apply(this,c)}var c=["DOMMouseScroll","mousewheel"];if(d.event.fixHooks)for(var h=c.length;h;)d.event.fixHooks[c[--h]]=
d.event.mouseHooks;d.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=c.length;a;)this.addEventListener(c[--a],e,false);else this.onmousewheel=e},teardown:function(){if(this.removeEventListener)for(var a=c.length;a;)this.removeEventListener(c[--a],e,false);else this.onmousewheel=null}};d.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})})(jQuery);
(function( jQuery, window, undefined ) {
    // See http://bugs.jquery.com/ticket/13335
    // "use strict";
    
    
    var warnedAbout = {};
    
    // List of warnings already given; public read only
    jQuery.migrateWarnings = [];
    
    // Set to true to prevent console output; migrateWarnings still maintained
    // jQuery.migrateMute = false;
    
    // Show a message on the console so devs know we're active
    if ( !jQuery.migrateMute && window.console && window.console.log ) {
        window.console.log("JQMIGRATE: Logging is active");
    }
    
    // Set to false to disable traces that appear with warnings
    if ( jQuery.migrateTrace === undefined ) {
        jQuery.migrateTrace = true;
    }
    
    // Forget any warnings we've already given; public
    jQuery.migrateReset = function() {
        warnedAbout = {};
        jQuery.migrateWarnings.length = 0;
    };
    
    function migrateWarn( msg) {
        var console = window.console;
        if ( !warnedAbout[ msg ] ) {
            warnedAbout[ msg ] = true;
            jQuery.migrateWarnings.push( msg );
            if ( console && console.warn && !jQuery.migrateMute ) {
                console.warn( "JQMIGRATE: " + msg );
                if ( jQuery.migrateTrace && console.trace ) {
                    console.trace();
                }
            }
        }
    }
    
    function migrateWarnProp( obj, prop, value, msg ) {
        if ( Object.defineProperty ) {
            // On ES5 browsers (non-oldIE), warn if the code tries to get prop;
            // allow property to be overwritten in case some other plugin wants it
            try {
                Object.defineProperty( obj, prop, {
                    configurable: true,
                    enumerable: true,
                    get: function() {
                        migrateWarn( msg );
                        return value;
                    },
                    set: function( newValue ) {
                        migrateWarn( msg );
                        value = newValue;
                    }
                });
                return;
            } catch( err ) {
                // IE8 is a dope about Object.defineProperty, can't warn there
            }
        }
    
        // Non-ES5 (or broken) browser; just set the property
        jQuery._definePropertyBroken = true;
        obj[ prop ] = value;
    }
    
    if ( document.compatMode === "BackCompat" ) {
        // jQuery has never supported or tested Quirks Mode
        migrateWarn( "jQuery is not compatible with Quirks Mode" );
    }
    
    
    var attrFn = jQuery( "<input/>", { size: 1 } ).attr("size") && jQuery.attrFn,
        oldAttr = jQuery.attr,
        valueAttrGet = jQuery.attrHooks.value && jQuery.attrHooks.value.get ||
            function() { return null; },
        valueAttrSet = jQuery.attrHooks.value && jQuery.attrHooks.value.set ||
            function() { return undefined; },
        rnoType = /^(?:input|button)$/i,
        rnoAttrNodeType = /^[238]$/,
        rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        ruseDefault = /^(?:checked|selected)$/i;
    
    // jQuery.attrFn
    migrateWarnProp( jQuery, "attrFn", attrFn || {}, "jQuery.attrFn is deprecated" );
    
    jQuery.attr = function( elem, name, value, pass ) {
        var lowerName = name.toLowerCase(),
            nType = elem && elem.nodeType;
    
        if ( pass ) {
            // Since pass is used internally, we only warn for new jQuery
            // versions where there isn't a pass arg in the formal params
            if ( oldAttr.length < 4 ) {
                migrateWarn("jQuery.fn.attr( props, pass ) is deprecated");
            }
            if ( elem && !rnoAttrNodeType.test( nType ) &&
                (attrFn ? name in attrFn : jQuery.isFunction(jQuery.fn[name])) ) {
                return jQuery( elem )[ name ]( value );
            }
        }
    
        // Warn if user tries to set `type`, since it breaks on IE 6/7/8; by checking
        // for disconnected elements we don't warn on $( "<button>", { type: "button" } ).
        if ( name === "type" && value !== undefined && rnoType.test( elem.nodeName ) && elem.parentNode ) {
            migrateWarn("Can't change the 'type' of an input or button in IE 6/7/8");
        }
    
        // Restore boolHook for boolean property/attribute synchronization
        if ( !jQuery.attrHooks[ lowerName ] && rboolean.test( lowerName ) ) {
            jQuery.attrHooks[ lowerName ] = {
                get: function( elem, name ) {
                    // Align boolean attributes with corresponding properties
                    // Fall back to attribute presence where some booleans are not supported
                    var attrNode,
                        property = jQuery.prop( elem, name );
                    return property === true || typeof property !== "boolean" &&
                        ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
    
                        name.toLowerCase() :
                        undefined;
                },
                set: function( elem, value, name ) {
                    var propName;
                    if ( value === false ) {
                        // Remove boolean attributes when set to false
                        jQuery.removeAttr( elem, name );
                    } else {
                        // value is true since we know at this point it's type boolean and not false
                        // Set boolean attributes to the same name and set the DOM property
                        propName = jQuery.propFix[ name ] || name;
                        if ( propName in elem ) {
                            // Only set the IDL specifically if it already exists on the element
                            elem[ propName ] = true;
                        }
    
                        elem.setAttribute( name, name.toLowerCase() );
                    }
                    return name;
                }
            };
    
            // Warn only for attributes that can remain distinct from their properties post-1.9
            if ( ruseDefault.test( lowerName ) ) {
                migrateWarn( "jQuery.fn.attr('" + lowerName + "') may use property instead of attribute" );
            }
        }
    
        return oldAttr.call( jQuery, elem, name, value );
    };
    
    // attrHooks: value
    jQuery.attrHooks.value = {
        get: function( elem, name ) {
            var nodeName = ( elem.nodeName || "" ).toLowerCase();
            if ( nodeName === "button" ) {
                return valueAttrGet.apply( this, arguments );
            }
            if ( nodeName !== "input" && nodeName !== "option" ) {
                migrateWarn("jQuery.fn.attr('value') no longer gets properties");
            }
            return name in elem ?
                elem.value :
                null;
        },
        set: function( elem, value ) {
            var nodeName = ( elem.nodeName || "" ).toLowerCase();
            if ( nodeName === "button" ) {
                return valueAttrSet.apply( this, arguments );
            }
            if ( nodeName !== "input" && nodeName !== "option" ) {
                migrateWarn("jQuery.fn.attr('value', val) no longer sets properties");
            }
            // Does not return so that setAttribute is also used
            elem.value = value;
        }
    };
    
    
    var matched, browser,
        oldInit = jQuery.fn.init,
        oldParseJSON = jQuery.parseJSON,
        // Note: XSS check is done below after string is trimmed
        rquickExpr = /^([^<]*)(<[\w\W]+>)([^>]*)$/;
    
    // $(html) "looks like html" rule change
    jQuery.fn.init = function( selector, context, rootjQuery ) {
        var match;
    
        if ( selector && typeof selector === "string" && !jQuery.isPlainObject( context ) &&
                (match = rquickExpr.exec( jQuery.trim( selector ) )) && match[ 0 ] ) {
            // This is an HTML string according to the "old" rules; is it still?
            if ( selector.charAt( 0 ) !== "<" ) {
                migrateWarn("$(html) HTML strings must start with '<' character");
            }
            if ( match[ 3 ] ) {
                migrateWarn("$(html) HTML text after last tag is ignored");
            }
            // Consistently reject any HTML-like string starting with a hash (#9521)
            // Note that this may break jQuery 1.6.x code that otherwise would work.
            if ( match[ 0 ].charAt( 0 ) === "#" ) {
                migrateWarn("HTML string cannot start with a '#' character");
                jQuery.error("JQMIGRATE: Invalid selector string (XSS)");
            }
            // Now process using loose rules; let pre-1.8 play too
            if ( context && context.context ) {
                // jQuery object as context; parseHTML expects a DOM object
                context = context.context;
            }
            if ( jQuery.parseHTML ) {
                return oldInit.call( this, jQuery.parseHTML( match[ 2 ], context, true ),
                        context, rootjQuery );
            }
        }
        return oldInit.apply( this, arguments );
    };
    jQuery.fn.init.prototype = jQuery.fn;
    
    // Let $.parseJSON(falsy_value) return null
    jQuery.parseJSON = function( json ) {
        if ( !json && json !== null ) {
            migrateWarn("jQuery.parseJSON requires a valid JSON string");
            return null;
        }
        return oldParseJSON.apply( this, arguments );
    };
    
    jQuery.uaMatch = function( ua ) {
        ua = ua.toLowerCase();
    
        var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
            /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
            /(msie) ([\w.]+)/.exec( ua ) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
            [];
    
        return {
            browser: match[ 1 ] || "",
            version: match[ 2 ] || "0"
        };
    };
    
    // Don't clobber any existing jQuery.browser in case it's different
    if ( !jQuery.browser ) {
        matched = jQuery.uaMatch( navigator.userAgent );
        browser = {};
    
        if ( matched.browser ) {
            browser[ matched.browser ] = true;
            browser.version = matched.version;
        }
    
        // Chrome is Webkit, but Webkit is also Safari.
        if ( browser.chrome ) {
            browser.webkit = true;
        } else if ( browser.webkit ) {
            browser.safari = true;
        }
    
        jQuery.browser = browser;
    }
    
    // Warn if the code tries to get jQuery.browser
    migrateWarnProp( jQuery, "browser", jQuery.browser, "jQuery.browser is deprecated" );
    
    jQuery.sub = function() {
        function jQuerySub( selector, context ) {
            return new jQuerySub.fn.init( selector, context );
        }
        jQuery.extend( true, jQuerySub, this );
        jQuerySub.superclass = this;
        jQuerySub.fn = jQuerySub.prototype = this();
        jQuerySub.fn.constructor = jQuerySub;
        jQuerySub.sub = this.sub;
        jQuerySub.fn.init = function init( selector, context ) {
            if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
                context = jQuerySub( context );
            }
    
            return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
        };
        jQuerySub.fn.init.prototype = jQuerySub.fn;
        var rootjQuerySub = jQuerySub(document);
        migrateWarn( "jQuery.sub() is deprecated" );
        return jQuerySub;
    };
    
    
    // Ensure that $.ajax gets the new parseJSON defined in core.js
    jQuery.ajaxSetup({
        converters: {
            "text json": jQuery.parseJSON
        }
    });
    
    
    var oldFnData = jQuery.fn.data;
    
    jQuery.fn.data = function( name ) {
        var ret, evt,
            elem = this[0];
    
        // Handles 1.7 which has this behavior and 1.8 which doesn't
        if ( elem && name === "events" && arguments.length === 1 ) {
            ret = jQuery.data( elem, name );
            evt = jQuery._data( elem, name );
            if ( ( ret === undefined || ret === evt ) && evt !== undefined ) {
                migrateWarn("Use of jQuery.fn.data('events') is deprecated");
                return evt;
            }
        }
        return oldFnData.apply( this, arguments );
    };
    
    
    var rscriptType = /\/(java|ecma)script/i,
        oldSelf = jQuery.fn.andSelf || jQuery.fn.addBack;
    
    jQuery.fn.andSelf = function() {
        migrateWarn("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()");
        return oldSelf.apply( this, arguments );
    };
    
    // Since jQuery.clean is used internally on older versions, we only shim if it's missing
    if ( !jQuery.clean ) {
        jQuery.clean = function( elems, context, fragment, scripts ) {
            // Set context per 1.8 logic
            context = context || document;
            context = !context.nodeType && context[0] || context;
            context = context.ownerDocument || context;
    
            migrateWarn("jQuery.clean() is deprecated");
    
            var i, elem, handleScript, jsTags,
                ret = [];
    
            jQuery.merge( ret, jQuery.buildFragment( elems, context ).childNodes );
    
            // Complex logic lifted directly from jQuery 1.8
            if ( fragment ) {
                // Special handling of each script element
                handleScript = function( elem ) {
                    // Check if we consider it executable
                    if ( !elem.type || rscriptType.test( elem.type ) ) {
                        // Detach the script and store it in the scripts array (if provided) or the fragment
                        // Return truthy to indicate that it has been handled
                        return scripts ?
                            scripts.push( elem.parentNode ? elem.parentNode.removeChild( elem ) : elem ) :
                            fragment.appendChild( elem );
                    }
                };
    
                for ( i = 0; (elem = ret[i]) != null; i++ ) {
                    // Check if we're done after handling an executable script
                    if ( !( jQuery.nodeName( elem, "script" ) && handleScript( elem ) ) ) {
                        // Append to fragment and handle embedded scripts
                        fragment.appendChild( elem );
                        if ( typeof elem.getElementsByTagName !== "undefined" ) {
                            // handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
                            jsTags = jQuery.grep( jQuery.merge( [], elem.getElementsByTagName("script") ), handleScript );
    
                            // Splice the scripts into ret after their former ancestor and advance our index beyond them
                            ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
                            i += jsTags.length;
                        }
                    }
                }
            }
    
            return ret;
        };
    }
    
    var eventAdd = jQuery.event.add,
        eventRemove = jQuery.event.remove,
        eventTrigger = jQuery.event.trigger,
        oldToggle = jQuery.fn.toggle,
        oldLive = jQuery.fn.live,
        oldDie = jQuery.fn.die,
        ajaxEvents = "ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",
        rajaxEvent = new RegExp( "\\b(?:" + ajaxEvents + ")\\b" ),
        rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
        hoverHack = function( events ) {
            if ( typeof( events ) !== "string" || jQuery.event.special.hover ) {
                return events;
            }
            if ( rhoverHack.test( events ) ) {
                migrateWarn("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'");
            }
            return events && events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
        };
    
    // Event props removed in 1.9, put them back if needed; no practical way to warn them
    if ( jQuery.event.props && jQuery.event.props[ 0 ] !== "attrChange" ) {
        jQuery.event.props.unshift( "attrChange", "attrName", "relatedNode", "srcElement" );
    }
    
    // Undocumented jQuery.event.handle was "deprecated" in jQuery 1.7
    if ( jQuery.event.dispatch ) {
        migrateWarnProp( jQuery.event, "handle", jQuery.event.dispatch, "jQuery.event.handle is undocumented and deprecated" );
    }
    
    // Support for 'hover' pseudo-event and ajax event warnings
    jQuery.event.add = function( elem, types, handler, data, selector ){
        if ( elem !== document && rajaxEvent.test( types ) ) {
            migrateWarn( "AJAX events should be attached to document: " + types );
        }
        eventAdd.call( this, elem, hoverHack( types || "" ), handler, data, selector );
    };
    jQuery.event.remove = function( elem, types, handler, selector, mappedTypes ){
        eventRemove.call( this, elem, hoverHack( types ) || "", handler, selector, mappedTypes );
    };
    
    jQuery.fn.error = function() {
        var args = Array.prototype.slice.call( arguments, 0);
        migrateWarn("jQuery.fn.error() is deprecated");
        args.splice( 0, 0, "error" );
        if ( arguments.length ) {
            return this.bind.apply( this, args );
        }
        // error event should not bubble to window, although it does pre-1.7
        this.triggerHandler.apply( this, args );
        return this;
    };
    
    jQuery.fn.toggle = function( fn, fn2 ) {
    
        // Don't mess with animation or css toggles
        if ( !jQuery.isFunction( fn ) || !jQuery.isFunction( fn2 ) ) {
            return oldToggle.apply( this, arguments );
        }
        migrateWarn("jQuery.fn.toggle(handler, handler...) is deprecated");
    
        // Save reference to arguments for access in closure
        var args = arguments,
            guid = fn.guid || jQuery.guid++,
            i = 0,
            toggler = function( event ) {
                // Figure out which function to execute
                var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
                jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );
    
                // Make sure that clicks stop
                event.preventDefault();
    
                // and execute the function
                return args[ lastToggle ].apply( this, arguments ) || false;
            };
    
        // link all the functions, so any of them can unbind this click handler
        toggler.guid = guid;
        while ( i < args.length ) {
            args[ i++ ].guid = guid;
        }
    
        return this.click( toggler );
    };
    
    jQuery.fn.live = function( types, data, fn ) {
        migrateWarn("jQuery.fn.live() is deprecated");
        if ( oldLive ) {
            return oldLive.apply( this, arguments );
        }
        jQuery( this.context ).on( types, this.selector, data, fn );
        return this;
    };
    
    jQuery.fn.die = function( types, fn ) {
        migrateWarn("jQuery.fn.die() is deprecated");
        if ( oldDie ) {
            return oldDie.apply( this, arguments );
        }
        jQuery( this.context ).off( types, this.selector || "**", fn );
        return this;
    };
    
    // Turn global events into document-triggered events
    jQuery.event.trigger = function( event, data, elem, onlyHandlers  ){
        if ( !elem && !rajaxEvent.test( event ) ) {
            migrateWarn( "Global events are undocumented and deprecated" );
        }
        return eventTrigger.call( this,  event, data, elem || document, onlyHandlers  );
    };
    jQuery.each( ajaxEvents.split("|"),
        function( _, name ) {
            jQuery.event.special[ name ] = {
                setup: function() {
                    var elem = this;
    
                    // The document needs no shimming; must be !== for oldIE
                    if ( elem !== document ) {
                        jQuery.event.add( document, name + "." + jQuery.guid, function() {
                            jQuery.event.trigger( name, null, elem, true );
                        });
                        jQuery._data( this, name, jQuery.guid++ );
                    }
                    return false;
                },
                teardown: function() {
                    if ( this !== document ) {
                        jQuery.event.remove( document, name + "." + jQuery._data( this, name ) );
                    }
                    return false;
                }
            };
        }
    );
    
    
    })( jQuery, window );
    /*
 Popper.min.js
 Copyright (C) Federico Zivolo 2018
 Distributed under the MIT License (license terms are at http://opensource.org/licenses/MIT).
 */(function(e,t){'object'==typeof exports&&'undefined'!=typeof module?module.exports=t():'function'==typeof define&&define.amd?define(t):e.Popper=t()})(this,function(){'use strict';function e(e){return e&&'[object Function]'==={}.toString.call(e)}function t(e,t){if(1!==e.nodeType)return[];var o=getComputedStyle(e,null);return t?o[t]:o}function o(e){return'HTML'===e.nodeName?e:e.parentNode||e.host}function n(e){if(!e)return document.body;switch(e.nodeName){case'HTML':case'BODY':return e.ownerDocument.body;case'#document':return e.body;}var i=t(e),r=i.overflow,p=i.overflowX,s=i.overflowY;return /(auto|scroll|overlay)/.test(r+s+p)?e:n(o(e))}function r(e){return 11===e?re:10===e?pe:re||pe}function p(e){if(!e)return document.documentElement;for(var o=r(10)?document.body:null,n=e.offsetParent;n===o&&e.nextElementSibling;)n=(e=e.nextElementSibling).offsetParent;var i=n&&n.nodeName;return i&&'BODY'!==i&&'HTML'!==i?-1!==['TD','TABLE'].indexOf(n.nodeName)&&'static'===t(n,'position')?p(n):n:e?e.ownerDocument.documentElement:document.documentElement}function s(e){var t=e.nodeName;return'BODY'!==t&&('HTML'===t||p(e.firstElementChild)===e)}function d(e){return null===e.parentNode?e:d(e.parentNode)}function a(e,t){if(!e||!e.nodeType||!t||!t.nodeType)return document.documentElement;var o=e.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_FOLLOWING,n=o?e:t,i=o?t:e,r=document.createRange();r.setStart(n,0),r.setEnd(i,0);var l=r.commonAncestorContainer;if(e!==l&&t!==l||n.contains(i))return s(l)?l:p(l);var f=d(e);return f.host?a(f.host,t):a(e,d(t).host)}function l(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:'top',o='top'===t?'scrollTop':'scrollLeft',n=e.nodeName;if('BODY'===n||'HTML'===n){var i=e.ownerDocument.documentElement,r=e.ownerDocument.scrollingElement||i;return r[o]}return e[o]}function f(e,t){var o=2<arguments.length&&void 0!==arguments[2]&&arguments[2],n=l(t,'top'),i=l(t,'left'),r=o?-1:1;return e.top+=n*r,e.bottom+=n*r,e.left+=i*r,e.right+=i*r,e}function m(e,t){var o='x'===t?'Left':'Top',n='Left'==o?'Right':'Bottom';return parseFloat(e['border'+o+'Width'],10)+parseFloat(e['border'+n+'Width'],10)}function h(e,t,o,n){return $(t['offset'+e],t['scroll'+e],o['client'+e],o['offset'+e],o['scroll'+e],r(10)?o['offset'+e]+n['margin'+('Height'===e?'Top':'Left')]+n['margin'+('Height'===e?'Bottom':'Right')]:0)}function c(){var e=document.body,t=document.documentElement,o=r(10)&&getComputedStyle(t);return{height:h('Height',e,t,o),width:h('Width',e,t,o)}}function g(e){return le({},e,{right:e.left+e.width,bottom:e.top+e.height})}function u(e){var o={};try{if(r(10)){o=e.getBoundingClientRect();var n=l(e,'top'),i=l(e,'left');o.top+=n,o.left+=i,o.bottom+=n,o.right+=i}else o=e.getBoundingClientRect()}catch(t){}var p={left:o.left,top:o.top,width:o.right-o.left,height:o.bottom-o.top},s='HTML'===e.nodeName?c():{},d=s.width||e.clientWidth||p.right-p.left,a=s.height||e.clientHeight||p.bottom-p.top,f=e.offsetWidth-d,h=e.offsetHeight-a;if(f||h){var u=t(e);f-=m(u,'x'),h-=m(u,'y'),p.width-=f,p.height-=h}return g(p)}function b(e,o){var i=2<arguments.length&&void 0!==arguments[2]&&arguments[2],p=r(10),s='HTML'===o.nodeName,d=u(e),a=u(o),l=n(e),m=t(o),h=parseFloat(m.borderTopWidth,10),c=parseFloat(m.borderLeftWidth,10);i&&'HTML'===o.nodeName&&(a.top=$(a.top,0),a.left=$(a.left,0));var b=g({top:d.top-a.top-h,left:d.left-a.left-c,width:d.width,height:d.height});if(b.marginTop=0,b.marginLeft=0,!p&&s){var y=parseFloat(m.marginTop,10),w=parseFloat(m.marginLeft,10);b.top-=h-y,b.bottom-=h-y,b.left-=c-w,b.right-=c-w,b.marginTop=y,b.marginLeft=w}return(p&&!i?o.contains(l):o===l&&'BODY'!==l.nodeName)&&(b=f(b,o)),b}function y(e){var t=1<arguments.length&&void 0!==arguments[1]&&arguments[1],o=e.ownerDocument.documentElement,n=b(e,o),i=$(o.clientWidth,window.innerWidth||0),r=$(o.clientHeight,window.innerHeight||0),p=t?0:l(o),s=t?0:l(o,'left'),d={top:p-n.top+n.marginTop,left:s-n.left+n.marginLeft,width:i,height:r};return g(d)}function w(e){var n=e.nodeName;return'BODY'===n||'HTML'===n?!1:'fixed'===t(e,'position')||w(o(e))}function E(e){if(!e||!e.parentElement||r())return document.documentElement;for(var o=e.parentElement;o&&'none'===t(o,'transform');)o=o.parentElement;return o||document.documentElement}function v(e,t,i,r){var p=4<arguments.length&&void 0!==arguments[4]&&arguments[4],s={top:0,left:0},d=p?E(e):a(e,t);if('viewport'===r)s=y(d,p);else{var l;'scrollParent'===r?(l=n(o(t)),'BODY'===l.nodeName&&(l=e.ownerDocument.documentElement)):'window'===r?l=e.ownerDocument.documentElement:l=r;var f=b(l,d,p);if('HTML'===l.nodeName&&!w(d)){var m=c(),h=m.height,g=m.width;s.top+=f.top-f.marginTop,s.bottom=h+f.top,s.left+=f.left-f.marginLeft,s.right=g+f.left}else s=f}return s.left+=i,s.top+=i,s.right-=i,s.bottom-=i,s}function x(e){var t=e.width,o=e.height;return t*o}function O(e,t,o,n,i){var r=5<arguments.length&&void 0!==arguments[5]?arguments[5]:0;if(-1===e.indexOf('auto'))return e;var p=v(o,n,r,i),s={top:{width:p.width,height:t.top-p.top},right:{width:p.right-t.right,height:p.height},bottom:{width:p.width,height:p.bottom-t.bottom},left:{width:t.left-p.left,height:p.height}},d=Object.keys(s).map(function(e){return le({key:e},s[e],{area:x(s[e])})}).sort(function(e,t){return t.area-e.area}),a=d.filter(function(e){var t=e.width,n=e.height;return t>=o.clientWidth&&n>=o.clientHeight}),l=0<a.length?a[0].key:d[0].key,f=e.split('-')[1];return l+(f?'-'+f:'')}function L(e,t,o){var n=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null,i=n?E(t):a(t,o);return b(o,i,n)}function S(e){var t=getComputedStyle(e),o=parseFloat(t.marginTop)+parseFloat(t.marginBottom),n=parseFloat(t.marginLeft)+parseFloat(t.marginRight),i={width:e.offsetWidth+n,height:e.offsetHeight+o};return i}function T(e){var t={left:'right',right:'left',bottom:'top',top:'bottom'};return e.replace(/left|right|bottom|top/g,function(e){return t[e]})}function C(e,t,o){o=o.split('-')[0];var n=S(e),i={width:n.width,height:n.height},r=-1!==['right','left'].indexOf(o),p=r?'top':'left',s=r?'left':'top',d=r?'height':'width',a=r?'width':'height';return i[p]=t[p]+t[d]/2-n[d]/2,i[s]=o===s?t[s]-n[a]:t[T(s)],i}function D(e,t){return Array.prototype.find?e.find(t):e.filter(t)[0]}function N(e,t,o){if(Array.prototype.findIndex)return e.findIndex(function(e){return e[t]===o});var n=D(e,function(e){return e[t]===o});return e.indexOf(n)}function P(t,o,n){var i=void 0===n?t:t.slice(0,N(t,'name',n));return i.forEach(function(t){t['function']&&console.warn('`modifier.function` is deprecated, use `modifier.fn`!');var n=t['function']||t.fn;t.enabled&&e(n)&&(o.offsets.popper=g(o.offsets.popper),o.offsets.reference=g(o.offsets.reference),o=n(o,t))}),o}function k(){if(!this.state.isDestroyed){var e={instance:this,styles:{},arrowStyles:{},attributes:{},flipped:!1,offsets:{}};e.offsets.reference=L(this.state,this.popper,this.reference,this.options.positionFixed),e.placement=O(this.options.placement,e.offsets.reference,this.popper,this.reference,this.options.modifiers.flip.boundariesElement,this.options.modifiers.flip.padding),e.originalPlacement=e.placement,e.positionFixed=this.options.positionFixed,e.offsets.popper=C(this.popper,e.offsets.reference,e.placement),e.offsets.popper.position=this.options.positionFixed?'fixed':'absolute',e=P(this.modifiers,e),this.state.isCreated?this.options.onUpdate(e):(this.state.isCreated=!0,this.options.onCreate(e))}}function W(e,t){return e.some(function(e){var o=e.name,n=e.enabled;return n&&o===t})}function B(e){for(var t=[!1,'ms','Webkit','Moz','O'],o=e.charAt(0).toUpperCase()+e.slice(1),n=0;n<t.length;n++){var i=t[n],r=i?''+i+o:e;if('undefined'!=typeof document.body.style[r])return r}return null}function H(){return this.state.isDestroyed=!0,W(this.modifiers,'applyStyle')&&(this.popper.removeAttribute('x-placement'),this.popper.style.position='',this.popper.style.top='',this.popper.style.left='',this.popper.style.right='',this.popper.style.bottom='',this.popper.style.willChange='',this.popper.style[B('transform')]=''),this.disableEventListeners(),this.options.removeOnDestroy&&this.popper.parentNode.removeChild(this.popper),this}function A(e){var t=e.ownerDocument;return t?t.defaultView:window}function M(e,t,o,i){var r='BODY'===e.nodeName,p=r?e.ownerDocument.defaultView:e;p.addEventListener(t,o,{passive:!0}),r||M(n(p.parentNode),t,o,i),i.push(p)}function I(e,t,o,i){o.updateBound=i,A(e).addEventListener('resize',o.updateBound,{passive:!0});var r=n(e);return M(r,'scroll',o.updateBound,o.scrollParents),o.scrollElement=r,o.eventsEnabled=!0,o}function F(){this.state.eventsEnabled||(this.state=I(this.reference,this.options,this.state,this.scheduleUpdate))}function R(e,t){return A(e).removeEventListener('resize',t.updateBound),t.scrollParents.forEach(function(e){e.removeEventListener('scroll',t.updateBound)}),t.updateBound=null,t.scrollParents=[],t.scrollElement=null,t.eventsEnabled=!1,t}function U(){this.state.eventsEnabled&&(cancelAnimationFrame(this.scheduleUpdate),this.state=R(this.reference,this.state))}function Y(e){return''!==e&&!isNaN(parseFloat(e))&&isFinite(e)}function j(e,t){Object.keys(t).forEach(function(o){var n='';-1!==['width','height','top','right','bottom','left'].indexOf(o)&&Y(t[o])&&(n='px'),e.style[o]=t[o]+n})}function K(e,t){Object.keys(t).forEach(function(o){var n=t[o];!1===n?e.removeAttribute(o):e.setAttribute(o,t[o])})}function q(e,t,o){var n=D(e,function(e){var o=e.name;return o===t}),i=!!n&&e.some(function(e){return e.name===o&&e.enabled&&e.order<n.order});if(!i){var r='`'+t+'`';console.warn('`'+o+'`'+' modifier is required by '+r+' modifier in order to work, be sure to include it before '+r+'!')}return i}function G(e){return'end'===e?'start':'start'===e?'end':e}function z(e){var t=1<arguments.length&&void 0!==arguments[1]&&arguments[1],o=me.indexOf(e),n=me.slice(o+1).concat(me.slice(0,o));return t?n.reverse():n}function V(e,t,o,n){var i=e.match(/((?:\-|\+)?\d*\.?\d*)(.*)/),r=+i[1],p=i[2];if(!r)return e;if(0===p.indexOf('%')){var s;switch(p){case'%p':s=o;break;case'%':case'%r':default:s=n;}var d=g(s);return d[t]/100*r}if('vh'===p||'vw'===p){var a;return a='vh'===p?$(document.documentElement.clientHeight,window.innerHeight||0):$(document.documentElement.clientWidth,window.innerWidth||0),a/100*r}return r}function _(e,t,o,n){var i=[0,0],r=-1!==['right','left'].indexOf(n),p=e.split(/(\+|\-)/).map(function(e){return e.trim()}),s=p.indexOf(D(p,function(e){return-1!==e.search(/,|\s/)}));p[s]&&-1===p[s].indexOf(',')&&console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');var d=/\s*,\s*|\s+/,a=-1===s?[p]:[p.slice(0,s).concat([p[s].split(d)[0]]),[p[s].split(d)[1]].concat(p.slice(s+1))];return a=a.map(function(e,n){var i=(1===n?!r:r)?'height':'width',p=!1;return e.reduce(function(e,t){return''===e[e.length-1]&&-1!==['+','-'].indexOf(t)?(e[e.length-1]=t,p=!0,e):p?(e[e.length-1]+=t,p=!1,e):e.concat(t)},[]).map(function(e){return V(e,i,t,o)})}),a.forEach(function(e,t){e.forEach(function(o,n){Y(o)&&(i[t]+=o*('-'===e[n-1]?-1:1))})}),i}function X(e,t){var o,n=t.offset,i=e.placement,r=e.offsets,p=r.popper,s=r.reference,d=i.split('-')[0];return o=Y(+n)?[+n,0]:_(n,p,s,d),'left'===d?(p.top+=o[0],p.left-=o[1]):'right'===d?(p.top+=o[0],p.left+=o[1]):'top'===d?(p.left+=o[0],p.top-=o[1]):'bottom'===d&&(p.left+=o[0],p.top+=o[1]),e.popper=p,e}for(var J=Math.min,Q=Math.round,Z=Math.floor,$=Math.max,ee='undefined'!=typeof window&&'undefined'!=typeof document,te=['Edge','Trident','Firefox'],oe=0,ne=0;ne<te.length;ne+=1)if(ee&&0<=navigator.userAgent.indexOf(te[ne])){oe=1;break}var i=ee&&window.Promise,ie=i?function(e){var t=!1;return function(){t||(t=!0,window.Promise.resolve().then(function(){t=!1,e()}))}}:function(e){var t=!1;return function(){t||(t=!0,setTimeout(function(){t=!1,e()},oe))}},re=ee&&!!(window.MSInputMethodContext&&document.documentMode),pe=ee&&/MSIE 10/.test(navigator.userAgent),se=function(e,t){if(!(e instanceof t))throw new TypeError('Cannot call a class as a function')},de=function(){function e(e,t){for(var o,n=0;n<t.length;n++)o=t[n],o.enumerable=o.enumerable||!1,o.configurable=!0,'value'in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}return function(t,o,n){return o&&e(t.prototype,o),n&&e(t,n),t}}(),ae=function(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e},le=Object.assign||function(e){for(var t,o=1;o<arguments.length;o++)for(var n in t=arguments[o],t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e},fe=['auto-start','auto','auto-end','top-start','top','top-end','right-start','right','right-end','bottom-end','bottom','bottom-start','left-end','left','left-start'],me=fe.slice(3),he={FLIP:'flip',CLOCKWISE:'clockwise',COUNTERCLOCKWISE:'counterclockwise'},ce=function(){function t(o,n){var i=this,r=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{};se(this,t),this.scheduleUpdate=function(){return requestAnimationFrame(i.update)},this.update=ie(this.update.bind(this)),this.options=le({},t.Defaults,r),this.state={isDestroyed:!1,isCreated:!1,scrollParents:[]},this.reference=o&&o.jquery?o[0]:o,this.popper=n&&n.jquery?n[0]:n,this.options.modifiers={},Object.keys(le({},t.Defaults.modifiers,r.modifiers)).forEach(function(e){i.options.modifiers[e]=le({},t.Defaults.modifiers[e]||{},r.modifiers?r.modifiers[e]:{})}),this.modifiers=Object.keys(this.options.modifiers).map(function(e){return le({name:e},i.options.modifiers[e])}).sort(function(e,t){return e.order-t.order}),this.modifiers.forEach(function(t){t.enabled&&e(t.onLoad)&&t.onLoad(i.reference,i.popper,i.options,t,i.state)}),this.update();var p=this.options.eventsEnabled;p&&this.enableEventListeners(),this.state.eventsEnabled=p}return de(t,[{key:'update',value:function(){return k.call(this)}},{key:'destroy',value:function(){return H.call(this)}},{key:'enableEventListeners',value:function(){return F.call(this)}},{key:'disableEventListeners',value:function(){return U.call(this)}}]),t}();return ce.Utils=('undefined'==typeof window?global:window).PopperUtils,ce.placements=fe,ce.Defaults={placement:'bottom',positionFixed:!1,eventsEnabled:!0,removeOnDestroy:!1,onCreate:function(){},onUpdate:function(){},modifiers:{shift:{order:100,enabled:!0,fn:function(e){var t=e.placement,o=t.split('-')[0],n=t.split('-')[1];if(n){var i=e.offsets,r=i.reference,p=i.popper,s=-1!==['bottom','top'].indexOf(o),d=s?'left':'top',a=s?'width':'height',l={start:ae({},d,r[d]),end:ae({},d,r[d]+r[a]-p[a])};e.offsets.popper=le({},p,l[n])}return e}},offset:{order:200,enabled:!0,fn:X,offset:0},preventOverflow:{order:300,enabled:!0,fn:function(e,t){var o=t.boundariesElement||p(e.instance.popper);e.instance.reference===o&&(o=p(o));var n=B('transform'),i=e.instance.popper.style,r=i.top,s=i.left,d=i[n];i.top='',i.left='',i[n]='';var a=v(e.instance.popper,e.instance.reference,t.padding,o,e.positionFixed);i.top=r,i.left=s,i[n]=d,t.boundaries=a;var l=t.priority,f=e.offsets.popper,m={primary:function(e){var o=f[e];return f[e]<a[e]&&!t.escapeWithReference&&(o=$(f[e],a[e])),ae({},e,o)},secondary:function(e){var o='right'===e?'left':'top',n=f[o];return f[e]>a[e]&&!t.escapeWithReference&&(n=J(f[o],a[e]-('right'===e?f.width:f.height))),ae({},o,n)}};return l.forEach(function(e){var t=-1===['left','top'].indexOf(e)?'secondary':'primary';f=le({},f,m[t](e))}),e.offsets.popper=f,e},priority:['left','right','top','bottom'],padding:5,boundariesElement:'scrollParent'},keepTogether:{order:400,enabled:!0,fn:function(e){var t=e.offsets,o=t.popper,n=t.reference,i=e.placement.split('-')[0],r=Z,p=-1!==['top','bottom'].indexOf(i),s=p?'right':'bottom',d=p?'left':'top',a=p?'width':'height';return o[s]<r(n[d])&&(e.offsets.popper[d]=r(n[d])-o[a]),o[d]>r(n[s])&&(e.offsets.popper[d]=r(n[s])),e}},arrow:{order:500,enabled:!0,fn:function(e,o){var n;if(!q(e.instance.modifiers,'arrow','keepTogether'))return e;var i=o.element;if('string'==typeof i){if(i=e.instance.popper.querySelector(i),!i)return e}else if(!e.instance.popper.contains(i))return console.warn('WARNING: `arrow.element` must be child of its popper element!'),e;var r=e.placement.split('-')[0],p=e.offsets,s=p.popper,d=p.reference,a=-1!==['left','right'].indexOf(r),l=a?'height':'width',f=a?'Top':'Left',m=f.toLowerCase(),h=a?'left':'top',c=a?'bottom':'right',u=S(i)[l];d[c]-u<s[m]&&(e.offsets.popper[m]-=s[m]-(d[c]-u)),d[m]+u>s[c]&&(e.offsets.popper[m]+=d[m]+u-s[c]),e.offsets.popper=g(e.offsets.popper);var b=d[m]+d[l]/2-u/2,y=t(e.instance.popper),w=parseFloat(y['margin'+f],10),E=parseFloat(y['border'+f+'Width'],10),v=b-e.offsets.popper[m]-w-E;return v=$(J(s[l]-u,v),0),e.arrowElement=i,e.offsets.arrow=(n={},ae(n,m,Q(v)),ae(n,h,''),n),e},element:'[x-arrow]'},flip:{order:600,enabled:!0,fn:function(e,t){if(W(e.instance.modifiers,'inner'))return e;if(e.flipped&&e.placement===e.originalPlacement)return e;var o=v(e.instance.popper,e.instance.reference,t.padding,t.boundariesElement,e.positionFixed),n=e.placement.split('-')[0],i=T(n),r=e.placement.split('-')[1]||'',p=[];switch(t.behavior){case he.FLIP:p=[n,i];break;case he.CLOCKWISE:p=z(n);break;case he.COUNTERCLOCKWISE:p=z(n,!0);break;default:p=t.behavior;}return p.forEach(function(s,d){if(n!==s||p.length===d+1)return e;n=e.placement.split('-')[0],i=T(n);var a=e.offsets.popper,l=e.offsets.reference,f=Z,m='left'===n&&f(a.right)>f(l.left)||'right'===n&&f(a.left)<f(l.right)||'top'===n&&f(a.bottom)>f(l.top)||'bottom'===n&&f(a.top)<f(l.bottom),h=f(a.left)<f(o.left),c=f(a.right)>f(o.right),g=f(a.top)<f(o.top),u=f(a.bottom)>f(o.bottom),b='left'===n&&h||'right'===n&&c||'top'===n&&g||'bottom'===n&&u,y=-1!==['top','bottom'].indexOf(n),w=!!t.flipVariations&&(y&&'start'===r&&h||y&&'end'===r&&c||!y&&'start'===r&&g||!y&&'end'===r&&u);(m||b||w)&&(e.flipped=!0,(m||b)&&(n=p[d+1]),w&&(r=G(r)),e.placement=n+(r?'-'+r:''),e.offsets.popper=le({},e.offsets.popper,C(e.instance.popper,e.offsets.reference,e.placement)),e=P(e.instance.modifiers,e,'flip'))}),e},behavior:'flip',padding:5,boundariesElement:'viewport'},inner:{order:700,enabled:!1,fn:function(e){var t=e.placement,o=t.split('-')[0],n=e.offsets,i=n.popper,r=n.reference,p=-1!==['left','right'].indexOf(o),s=-1===['top','left'].indexOf(o);return i[p?'left':'top']=r[o]-(s?i[p?'width':'height']:0),e.placement=T(t),e.offsets.popper=g(i),e}},hide:{order:800,enabled:!0,fn:function(e){if(!q(e.instance.modifiers,'hide','preventOverflow'))return e;var t=e.offsets.reference,o=D(e.instance.modifiers,function(e){return'preventOverflow'===e.name}).boundaries;if(t.bottom<o.top||t.left>o.right||t.top>o.bottom||t.right<o.left){if(!0===e.hide)return e;e.hide=!0,e.attributes['x-out-of-boundaries']=''}else{if(!1===e.hide)return e;e.hide=!1,e.attributes['x-out-of-boundaries']=!1}return e}},computeStyle:{order:850,enabled:!0,fn:function(e,t){var o=t.x,n=t.y,i=e.offsets.popper,r=D(e.instance.modifiers,function(e){return'applyStyle'===e.name}).gpuAcceleration;void 0!==r&&console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');var s,d,a=void 0===r?t.gpuAcceleration:r,l=p(e.instance.popper),f=u(l),m={position:i.position},h={left:Z(i.left),top:Q(i.top),bottom:Q(i.bottom),right:Z(i.right)},c='bottom'===o?'top':'bottom',g='right'===n?'left':'right',b=B('transform');if(d='bottom'==c?-f.height+h.bottom:h.top,s='right'==g?-f.width+h.right:h.left,a&&b)m[b]='translate3d('+s+'px, '+d+'px, 0)',m[c]=0,m[g]=0,m.willChange='transform';else{var y='bottom'==c?-1:1,w='right'==g?-1:1;m[c]=d*y,m[g]=s*w,m.willChange=c+', '+g}var E={'x-placement':e.placement};return e.attributes=le({},E,e.attributes),e.styles=le({},m,e.styles),e.arrowStyles=le({},e.offsets.arrow,e.arrowStyles),e},gpuAcceleration:!0,x:'bottom',y:'right'},applyStyle:{order:900,enabled:!0,fn:function(e){return j(e.instance.popper,e.styles),K(e.instance.popper,e.attributes),e.arrowElement&&Object.keys(e.arrowStyles).length&&j(e.arrowElement,e.arrowStyles),e},onLoad:function(e,t,o,n,i){var r=L(i,t,e,o.positionFixed),p=O(o.placement,r,t,e,o.modifiers.flip.boundariesElement,o.modifiers.flip.padding);return t.setAttribute('x-placement',p),j(t,{position:o.positionFixed?'fixed':'absolute'}),o},gpuAcceleration:void 0}}},ce});/*!
 * Bootstrap v4.1.0 (https://getbootstrap.com/)
 * Copyright 2011-2018 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
*/!function(t,e){'object'==typeof exports&&'undefined'!=typeof module?e(exports,require('jquery'),require('popper.js')):'function'==typeof define&&define.amd?define(['exports','jquery','popper.js'],e):e(t.bootstrap={},t.jQuery,t.Popper)}(this,function(t,e,c){'use strict';function i(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,'value'in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function o(t,e,n){return e&&i(t.prototype,e),n&&i(t,n),t}function h(r){for(var t=1;t<arguments.length;t++){var s=null!=arguments[t]?arguments[t]:{},e=Object.keys(s);'function'==typeof Object.getOwnPropertySymbols&&(e=e.concat(Object.getOwnPropertySymbols(s).filter(function(t){return Object.getOwnPropertyDescriptor(s,t).enumerable}))),e.forEach(function(t){var e,n,i;e=r,i=s[n=t],n in e?Object.defineProperty(e,n,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[n]=i})}return r}e=e&&e.hasOwnProperty('default')?e.default:e,c=c&&c.hasOwnProperty('default')?c.default:c;var r,n,s,a,l,u,f,d,_,g,m,p,v,E,y,T,C,I,A,D,b,S,w,N,O,k,P,L,j,R,H,W,M,x,U,K,F,V,Q,B,Y,G,q,z,X,J,Z,$,tt,et,nt,it,rt,st,ot,at,lt,ht,ct,ut,ft,dt,_t,gt,mt,pt,vt,Et,yt,Tt,Ct,It,At,Dt,bt,St,wt,Nt,Ot,kt,Pt,Lt,jt,Rt,Ht,Wt,Mt,xt,Ut,Kt,Ft,Vt,Qt,Bt,Yt,Gt,qt,zt,Xt,Jt,Zt,$t,te,ee,ne,ie,re,se,oe,ae,le,he,ce,ue,fe,de,_e,ge,me,pe,ve,Ee,ye,Te,Ce,Ie,Ae,De,be,Se,we,Ne,Oe,ke,Pe,Le,je,Re,He,We,Me,xe,Ue,Ke,Fe,Ve,Qe,Be,Ye,Ge,qe,ze,Xe,Je,Ze,$e,tn,en,nn,rn,sn,on,an,ln,hn,cn,un,fn,dn,_n,gn,mn,pn,vn,En,yn,Tn,Cn=function(i){var e='transitionend';function t(t){var e=this,n=!1;return i(this).one(l.TRANSITION_END,function(){n=!0}),setTimeout(function(){n||l.triggerTransitionEnd(e)},t),this}var l={TRANSITION_END:'bsTransitionEnd',getUID:function(t){for(;t+=~~(1e6*Math.random()),document.getElementById(t););return t},getSelectorFromElement:function(t){var e=t.getAttribute('data-target');e&&'#'!==e||(e=t.getAttribute('href')||'');try{return 0<i(document).find(e).length?e:null}catch(t){return null}},getTransitionDurationFromElement:function(t){if(!t)return 0;var e=i(t).css('transition-duration');return parseFloat(e)?(e=e.split(',')[0],1e3*parseFloat(e)):0},reflow:function(t){return t.offsetHeight},triggerTransitionEnd:function(t){i(t).trigger(e)},supportsTransitionEnd:function(){return Boolean(e)},isElement:function(t){return(t[0]||t).nodeType},typeCheckConfig:function(t,e,n){for(var i in n)if(Object.prototype.hasOwnProperty.call(n,i)){var r=n[i],s=e[i],o=s&&l.isElement(s)?'element':(a=s,{}.toString.call(a).match(/\s([a-z]+)/i)[1].toLowerCase());if(!new RegExp(r).test(o))throw new Error(t.toUpperCase()+': Option "'+i+'" provided type "'+o+'" but expected type "'+r+'".')}var a}};return i.fn.emulateTransitionEnd=t,i.event.special[l.TRANSITION_END]={bindType:e,delegateType:e,handle:function(t){if(i(t.target).is(this))return t.handleObj.handler.apply(this,arguments)}},l}(e),In=(n='alert',a='.'+(s='bs.alert'),l=(r=e).fn[n],u={CLOSE:'close'+a,CLOSED:'closed'+a,CLICK_DATA_API:'click'+a+'.data-api'},f='alert',d='fade',_='show',g=function(){function i(t){this._element=t}var t=i.prototype;return t.close=function(t){t=t||this._element;var e=this._getRootElement(t);this._triggerCloseEvent(e).isDefaultPrevented()||this._removeElement(e)},t.dispose=function(){r.removeData(this._element,s),this._element=null},t._getRootElement=function(t){var e=Cn.getSelectorFromElement(t),n=!1;return e&&(n=r(e)[0]),n||(n=r(t).closest('.'+f)[0]),n},t._triggerCloseEvent=function(t){var e=r.Event(u.CLOSE);return r(t).trigger(e),e},t._removeElement=function(e){var n=this;if(r(e).removeClass(_),r(e).hasClass(d)){var t=Cn.getTransitionDurationFromElement(e);r(e).one(Cn.TRANSITION_END,function(t){return n._destroyElement(e,t)}).emulateTransitionEnd(t)}else this._destroyElement(e)},t._destroyElement=function(t){r(t).detach().trigger(u.CLOSED).remove()},i._jQueryInterface=function(n){return this.each(function(){var t=r(this),e=t.data(s);e||(e=new i(this),t.data(s,e)),'close'===n&&e[n](this)})},i._handleDismiss=function(e){return function(t){t&&t.preventDefault(),e.close(this)}},o(i,null,[{key:'VERSION',get:function(){return'4.1.0'}}]),i}(),r(document).on(u.CLICK_DATA_API,'[data-dismiss="alert"]',g._handleDismiss(new g)),r.fn[n]=g._jQueryInterface,r.fn[n].Constructor=g,r.fn[n].noConflict=function(){return r.fn[n]=l,g._jQueryInterface},g),An=(p='button',E='.'+(v='bs.button'),y='.data-api',T=(m=e).fn[p],C='active',I='btn',D='[data-toggle^="button"]',b='[data-toggle="buttons"]',S='input',w='.active',N='.btn',O={CLICK_DATA_API:'click'+E+y,FOCUS_BLUR_DATA_API:(A='focus')+E+y+' blur'+E+y},k=function(){function n(t){this._element=t}var t=n.prototype;return t.toggle=function(){var t=!0,e=!0,n=m(this._element).closest(b)[0];if(n){var i=m(this._element).find(S)[0];if(i){if('radio'===i.type)if(i.checked&&m(this._element).hasClass(C))t=!1;else{var r=m(n).find(w)[0];r&&m(r).removeClass(C)}if(t){if(i.hasAttribute('disabled')||n.hasAttribute('disabled')||i.classList.contains('disabled')||n.classList.contains('disabled'))return;i.checked=!m(this._element).hasClass(C),m(i).trigger('change')}i.focus(),e=!1}}e&&this._element.setAttribute('aria-pressed',!m(this._element).hasClass(C)),t&&m(this._element).toggleClass(C)},t.dispose=function(){m.removeData(this._element,v),this._element=null},n._jQueryInterface=function(e){return this.each(function(){var t=m(this).data(v);t||(t=new n(this),m(this).data(v,t)),'toggle'===e&&t[e]()})},o(n,null,[{key:'VERSION',get:function(){return'4.1.0'}}]),n}(),m(document).on(O.CLICK_DATA_API,D,function(t){t.preventDefault();var e=t.target;m(e).hasClass(I)||(e=m(e).closest(N)),k._jQueryInterface.call(m(e),'toggle')}).on(O.FOCUS_BLUR_DATA_API,D,function(t){var e=m(t.target).closest(N)[0];m(e).toggleClass(A,/^focus(in)?$/.test(t.type))}),m.fn[p]=k._jQueryInterface,m.fn[p].Constructor=k,m.fn[p].noConflict=function(){return m.fn[p]=T,k._jQueryInterface},k),Dn=(L='carousel',R='.'+(j='bs.carousel'),H='.data-api',W=(P=e).fn[L],M={interval:5e3,keyboard:!0,slide:!1,pause:'hover',wrap:!0},x={interval:'(number|boolean)',keyboard:'boolean',slide:'(boolean|string)',pause:'(string|boolean)',wrap:'boolean'},U='next',K='prev',F='left',V='right',Q={SLIDE:'slide'+R,SLID:'slid'+R,KEYDOWN:'keydown'+R,MOUSEENTER:'mouseenter'+R,MOUSELEAVE:'mouseleave'+R,TOUCHEND:'touchend'+R,LOAD_DATA_API:'load'+R+H,CLICK_DATA_API:'click'+R+H},B='carousel',Y='active',G='slide',q='carousel-item-right',z='carousel-item-left',X='carousel-item-next',J='carousel-item-prev',Z={ACTIVE:'.active',ACTIVE_ITEM:'.active.carousel-item',ITEM:'.carousel-item',NEXT_PREV:'.carousel-item-next, .carousel-item-prev',INDICATORS:'.carousel-indicators',DATA_SLIDE:'[data-slide], [data-slide-to]',DATA_RIDE:'[data-ride="carousel"]'},$=function(){function s(t,e){this._items=null,this._interval=null,this._activeElement=null,this._isPaused=!1,this._isSliding=!1,this.touchTimeout=null,this._config=this._getConfig(e),this._element=P(t)[0],this._indicatorsElement=P(this._element).find(Z.INDICATORS)[0],this._addEventListeners()}var t=s.prototype;return t.next=function(){this._isSliding||this._slide(U)},t.nextWhenVisible=function(){!document.hidden&&P(this._element).is(':visible')&&'hidden'!==P(this._element).css('visibility')&&this.next()},t.prev=function(){this._isSliding||this._slide(K)},t.pause=function(t){t||(this._isPaused=!0),P(this._element).find(Z.NEXT_PREV)[0]&&(Cn.triggerTransitionEnd(this._element),this.cycle(!0)),clearInterval(this._interval),this._interval=null},t.cycle=function(t){t||(this._isPaused=!1),this._interval&&(clearInterval(this._interval),this._interval=null),this._config.interval&&!this._isPaused&&(this._interval=setInterval((document.visibilityState?this.nextWhenVisible:this.next).bind(this),this._config.interval))},t.to=function(t){var e=this;this._activeElement=P(this._element).find(Z.ACTIVE_ITEM)[0];var n=this._getItemIndex(this._activeElement);if(!(t>this._items.length-1||t<0))if(this._isSliding)P(this._element).one(Q.SLID,function(){return e.to(t)});else{if(n===t)return this.pause(),void this.cycle();var i=n<t?U:K;this._slide(i,this._items[t])}},t.dispose=function(){P(this._element).off(R),P.removeData(this._element,j),this._items=null,this._config=null,this._element=null,this._interval=null,this._isPaused=null,this._isSliding=null,this._activeElement=null,this._indicatorsElement=null},t._getConfig=function(t){return t=h({},M,t),Cn.typeCheckConfig(L,t,x),t},t._addEventListeners=function(){var e=this;this._config.keyboard&&P(this._element).on(Q.KEYDOWN,function(t){return e._keydown(t)}),'hover'===this._config.pause&&(P(this._element).on(Q.MOUSEENTER,function(t){return e.pause(t)}).on(Q.MOUSELEAVE,function(t){return e.cycle(t)}),'ontouchstart'in document.documentElement&&P(this._element).on(Q.TOUCHEND,function(){e.pause(),e.touchTimeout&&clearTimeout(e.touchTimeout),e.touchTimeout=setTimeout(function(t){return e.cycle(t)},500+e._config.interval)}))},t._keydown=function(t){if(!/input|textarea/i.test(t.target.tagName))switch(t.which){case 37:t.preventDefault(),this.prev();break;case 39:t.preventDefault(),this.next();}},t._getItemIndex=function(t){return this._items=P.makeArray(P(t).parent().find(Z.ITEM)),this._items.indexOf(t)},t._getItemByDirection=function(t,e){var n=t===U,i=t===K,r=this._getItemIndex(e),s=this._items.length-1;if((i&&0===r||n&&r===s)&&!this._config.wrap)return e;var o=(r+(t===K?-1:1))%this._items.length;return-1===o?this._items[this._items.length-1]:this._items[o]},t._triggerSlideEvent=function(t,e){var n=this._getItemIndex(t),i=this._getItemIndex(P(this._element).find(Z.ACTIVE_ITEM)[0]),r=P.Event(Q.SLIDE,{relatedTarget:t,direction:e,from:i,to:n});return P(this._element).trigger(r),r},t._setActiveIndicatorElement=function(t){if(this._indicatorsElement){P(this._indicatorsElement).find(Z.ACTIVE).removeClass(Y);var e=this._indicatorsElement.children[this._getItemIndex(t)];e&&P(e).addClass(Y)}},t._slide=function(t,e){var n,i,r,s=this,o=P(this._element).find(Z.ACTIVE_ITEM)[0],a=this._getItemIndex(o),l=e||o&&this._getItemByDirection(t,o),h=this._getItemIndex(l),c=Boolean(this._interval);if(t===U?(n=z,i=X,r=F):(n=q,i=J,r=V),l&&P(l).hasClass(Y))this._isSliding=!1;else if(!this._triggerSlideEvent(l,r).isDefaultPrevented()&&o&&l){this._isSliding=!0,c&&this.pause(),this._setActiveIndicatorElement(l);var u=P.Event(Q.SLID,{relatedTarget:l,direction:r,from:a,to:h});if(P(this._element).hasClass(G)){P(l).addClass(i),Cn.reflow(l),P(o).addClass(n),P(l).addClass(n);var f=Cn.getTransitionDurationFromElement(o);P(o).one(Cn.TRANSITION_END,function(){P(l).removeClass(n+' '+i).addClass(Y),P(o).removeClass(Y+' '+i+' '+n),s._isSliding=!1,setTimeout(function(){return P(s._element).trigger(u)},0)}).emulateTransitionEnd(f)}else P(o).removeClass(Y),P(l).addClass(Y),this._isSliding=!1,P(this._element).trigger(u);c&&this.cycle()}},s._jQueryInterface=function(i){return this.each(function(){var t=P(this).data(j),e=h({},M,P(this).data());'object'==typeof i&&(e=h({},e,i));var n='string'==typeof i?i:e.slide;if(t||(t=new s(this,e),P(this).data(j,t)),'number'==typeof i)t.to(i);else if('string'==typeof n){if('undefined'==typeof t[n])throw new TypeError('No method named "'+n+'"');t[n]()}else e.interval&&(t.pause(),t.cycle())})},s._dataApiClickHandler=function(t){var e=Cn.getSelectorFromElement(this);if(e){var n=P(e)[0];if(n&&P(n).hasClass(B)){var i=h({},P(n).data(),P(this).data()),r=this.getAttribute('data-slide-to');r&&(i.interval=!1),s._jQueryInterface.call(P(n),i),r&&P(n).data(j).to(r),t.preventDefault()}}},o(s,null,[{key:'VERSION',get:function(){return'4.1.0'}},{key:'Default',get:function(){return M}}]),s}(),P(document).on(Q.CLICK_DATA_API,Z.DATA_SLIDE,$._dataApiClickHandler),P(window).on(Q.LOAD_DATA_API,function(){P(Z.DATA_RIDE).each(function(){var t=P(this);$._jQueryInterface.call(t,t.data())})}),P.fn[L]=$._jQueryInterface,P.fn[L].Constructor=$,P.fn[L].noConflict=function(){return P.fn[L]=W,$._jQueryInterface},$),bn=(et='collapse',it='.'+(nt='bs.collapse'),rt=(tt=e).fn[et],st={toggle:!0,parent:''},ot={toggle:'boolean',parent:'(string|element)'},at={SHOW:'show'+it,SHOWN:'shown'+it,HIDE:'hide'+it,HIDDEN:'hidden'+it,CLICK_DATA_API:'click'+it+'.data-api'},lt='show',ht='collapse',ct='collapsing',ut='collapsed',ft='width',dt='height',_t={ACTIVES:'.show, .collapsing',DATA_TOGGLE:'[data-toggle="collapse"]'},gt=function(){function a(t,e){this._isTransitioning=!1,this._element=t,this._config=this._getConfig(e),this._triggerArray=tt.makeArray(tt('[data-toggle="collapse"][href="#'+t.id+'"],[data-toggle="collapse"][data-target="#'+t.id+'"]'));for(var n=tt(_t.DATA_TOGGLE),i=0;i<n.length;i++){var r=n[i],s=Cn.getSelectorFromElement(r);null!==s&&0<tt(s).filter(t).length&&(this._selector=s,this._triggerArray.push(r))}this._parent=this._config.parent?this._getParent():null,this._config.parent||this._addAriaAndCollapsedClass(this._element,this._triggerArray),this._config.toggle&&this.toggle()}var t=a.prototype;return t.toggle=function(){tt(this._element).hasClass(lt)?this.hide():this.show()},t.show=function(){var t,e,n=this;if(!this._isTransitioning&&!tt(this._element).hasClass(lt)&&(this._parent&&0===(t=tt.makeArray(tt(this._parent).find(_t.ACTIVES).filter('[data-parent="'+this._config.parent+'"]'))).length&&(t=null),!(t&&(e=tt(t).not(this._selector).data(nt))&&e._isTransitioning))){var i=tt.Event(at.SHOW);if(tt(this._element).trigger(i),!i.isDefaultPrevented()){t&&(a._jQueryInterface.call(tt(t).not(this._selector),'hide'),e||tt(t).data(nt,null));var r=this._getDimension();tt(this._element).removeClass(ht).addClass(ct),(this._element.style[r]=0)<this._triggerArray.length&&tt(this._triggerArray).removeClass(ut).attr('aria-expanded',!0),this.setTransitioning(!0);var s='scroll'+(r[0].toUpperCase()+r.slice(1)),o=Cn.getTransitionDurationFromElement(this._element);tt(this._element).one(Cn.TRANSITION_END,function(){tt(n._element).removeClass(ct).addClass(ht).addClass(lt),n._element.style[r]='',n.setTransitioning(!1),tt(n._element).trigger(at.SHOWN)}).emulateTransitionEnd(o),this._element.style[r]=this._element[s]+'px'}}},t.hide=function(){var t=this;if(!this._isTransitioning&&tt(this._element).hasClass(lt)){var e=tt.Event(at.HIDE);if(tt(this._element).trigger(e),!e.isDefaultPrevented()){var n=this._getDimension();if(this._element.style[n]=this._element.getBoundingClientRect()[n]+'px',Cn.reflow(this._element),tt(this._element).addClass(ct).removeClass(ht).removeClass(lt),0<this._triggerArray.length)for(var i=0;i<this._triggerArray.length;i++){var r=this._triggerArray[i],s=Cn.getSelectorFromElement(r);if(null!==s)tt(s).hasClass(lt)||tt(r).addClass(ut).attr('aria-expanded',!1)}this.setTransitioning(!0);this._element.style[n]='';var o=Cn.getTransitionDurationFromElement(this._element);tt(this._element).one(Cn.TRANSITION_END,function(){t.setTransitioning(!1),tt(t._element).removeClass(ct).addClass(ht).trigger(at.HIDDEN)}).emulateTransitionEnd(o)}}},t.setTransitioning=function(t){this._isTransitioning=t},t.dispose=function(){tt.removeData(this._element,nt),this._config=null,this._parent=null,this._element=null,this._triggerArray=null,this._isTransitioning=null},t._getConfig=function(t){return(t=h({},st,t)).toggle=Boolean(t.toggle),Cn.typeCheckConfig(et,t,ot),t},t._getDimension=function(){return tt(this._element).hasClass(ft)?ft:dt},t._getParent=function(){var n=this,t=null;Cn.isElement(this._config.parent)?(t=this._config.parent,'undefined'!=typeof this._config.parent.jquery&&(t=this._config.parent[0])):t=tt(this._config.parent)[0];var e='[data-toggle="collapse"][data-parent="'+this._config.parent+'"]';return tt(t).find(e).each(function(t,e){n._addAriaAndCollapsedClass(a._getTargetFromElement(e),[e])}),t},t._addAriaAndCollapsedClass=function(t,e){if(t){var n=tt(t).hasClass(lt);0<e.length&&tt(e).toggleClass(ut,!n).attr('aria-expanded',n)}},a._getTargetFromElement=function(t){var e=Cn.getSelectorFromElement(t);return e?tt(e)[0]:null},a._jQueryInterface=function(i){return this.each(function(){var t=tt(this),e=t.data(nt),n=h({},st,t.data(),'object'==typeof i&&i);if(!e&&n.toggle&&/show|hide/.test(i)&&(n.toggle=!1),e||(e=new a(this,n),t.data(nt,e)),'string'==typeof i){if('undefined'==typeof e[i])throw new TypeError('No method named "'+i+'"');e[i]()}})},o(a,null,[{key:'VERSION',get:function(){return'4.1.0'}},{key:'Default',get:function(){return st}}]),a}(),tt(document).on(at.CLICK_DATA_API,_t.DATA_TOGGLE,function(t){'A'===t.currentTarget.tagName&&t.preventDefault();var n=tt(this),e=Cn.getSelectorFromElement(this);tt(e).each(function(){var t=tt(this),e=t.data(nt)?'toggle':n.data();gt._jQueryInterface.call(t,e)})}),tt.fn[et]=gt._jQueryInterface,tt.fn[et].Constructor=gt,tt.fn[et].noConflict=function(){return tt.fn[et]=rt,gt._jQueryInterface},gt),Sn=(pt='dropdown',Et='.'+(vt='bs.dropdown'),yt='.data-api',Tt=(mt=e).fn[pt],Ct=new RegExp('38|40|27'),It={HIDE:'hide'+Et,HIDDEN:'hidden'+Et,SHOW:'show'+Et,SHOWN:'shown'+Et,CLICK:'click'+Et,CLICK_DATA_API:'click'+Et+yt,KEYDOWN_DATA_API:'keydown'+Et+yt,KEYUP_DATA_API:'keyup'+Et+yt},At='disabled',Dt='show',bt='dropup',St='dropright',wt='dropleft',Nt='dropdown-menu-right',Ot='position-static',kt='[data-toggle="dropdown"]',Pt='.dropdown form',Lt='.dropdown-menu',jt='.navbar-nav',Rt='.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)',Ht='top-start',Wt='top-end',Mt='bottom-start',xt='bottom-end',Ut='right-start',Kt='left-start',Ft={offset:0,flip:!0,boundary:'scrollParent',reference:'toggle',display:'dynamic'},Vt={offset:'(number|string|function)',flip:'boolean',boundary:'(string|element)',reference:'(string|element)',display:'string'},Qt=function(){function l(t,e){this._element=t,this._popper=null,this._config=this._getConfig(e),this._menu=this._getMenuElement(),this._inNavbar=this._detectNavbar(),this._addEventListeners()}var t=l.prototype;return t.toggle=function(){if(!this._element.disabled&&!mt(this._element).hasClass(At)){var t=l._getParentFromElement(this._element),e=mt(this._menu).hasClass(Dt);if(l._clearMenus(),!e){var n={relatedTarget:this._element},i=mt.Event(It.SHOW,n);if(mt(t).trigger(i),!i.isDefaultPrevented()){if(!this._inNavbar){if('undefined'==typeof c)throw new TypeError('Bootstrap dropdown require Popper.js (https://popper.js.org)');var r=this._element;'parent'===this._config.reference?r=t:Cn.isElement(this._config.reference)&&(r=this._config.reference,'undefined'!=typeof this._config.reference.jquery&&(r=this._config.reference[0])),'scrollParent'!==this._config.boundary&&mt(t).addClass(Ot),this._popper=new c(r,this._menu,this._getPopperConfig())}'ontouchstart'in document.documentElement&&0===mt(t).closest(jt).length&&mt(document.body).children().on('mouseover',null,mt.noop),this._element.focus(),this._element.setAttribute('aria-expanded',!0),mt(this._menu).toggleClass(Dt),mt(t).toggleClass(Dt).trigger(mt.Event(It.SHOWN,n))}}}},t.dispose=function(){mt.removeData(this._element,vt),mt(this._element).off(Et),this._element=null,(this._menu=null)!==this._popper&&(this._popper.destroy(),this._popper=null)},t.update=function(){this._inNavbar=this._detectNavbar(),null!==this._popper&&this._popper.scheduleUpdate()},t._addEventListeners=function(){var e=this;mt(this._element).on(It.CLICK,function(t){t.preventDefault(),t.stopPropagation(),e.toggle()})},t._getConfig=function(t){return t=h({},this.constructor.Default,mt(this._element).data(),t),Cn.typeCheckConfig(pt,t,this.constructor.DefaultType),t},t._getMenuElement=function(){if(!this._menu){var t=l._getParentFromElement(this._element);this._menu=mt(t).find(Lt)[0]}return this._menu},t._getPlacement=function(){var t=mt(this._element).parent(),e=Mt;return t.hasClass(bt)?(e=Ht,mt(this._menu).hasClass(Nt)&&(e=Wt)):t.hasClass(St)?e=Ut:t.hasClass(wt)?e=Kt:mt(this._menu).hasClass(Nt)&&(e=xt),e},t._detectNavbar=function(){return 0<mt(this._element).closest('.navbar').length},t._getPopperConfig=function(){var e=this,t={};'function'==typeof this._config.offset?t.fn=function(t){return t.offsets=h({},t.offsets,e._config.offset(t.offsets)||{}),t}:t.offset=this._config.offset;var n={placement:this._getPlacement(),modifiers:{offset:t,flip:{enabled:this._config.flip},preventOverflow:{boundariesElement:this._config.boundary}}};return'static'===this._config.display&&(n.modifiers.applyStyle={enabled:!1}),n},l._jQueryInterface=function(e){return this.each(function(){var t=mt(this).data(vt);if(t||(t=new l(this,'object'==typeof e?e:null),mt(this).data(vt,t)),'string'==typeof e){if('undefined'==typeof t[e])throw new TypeError('No method named "'+e+'"');t[e]()}})},l._clearMenus=function(t){if(!t||3!==t.which&&('keyup'!==t.type||9===t.which))for(var e=mt.makeArray(mt(kt)),n=0;n<e.length;n++){var i=l._getParentFromElement(e[n]),r=mt(e[n]).data(vt),s={relatedTarget:e[n]};if(r){var o=r._menu;if(mt(i).hasClass(Dt)&&!(t&&('click'===t.type&&/input|textarea/i.test(t.target.tagName)||'keyup'===t.type&&9===t.which)&&mt.contains(i,t.target))){var a=mt.Event(It.HIDE,s);mt(i).trigger(a),a.isDefaultPrevented()||('ontouchstart'in document.documentElement&&mt(document.body).children().off('mouseover',null,mt.noop),e[n].setAttribute('aria-expanded','false'),mt(o).removeClass(Dt),mt(i).removeClass(Dt).trigger(mt.Event(It.HIDDEN,s)))}}}},l._getParentFromElement=function(t){var e,n=Cn.getSelectorFromElement(t);return n&&(e=mt(n)[0]),e||t.parentNode},l._dataApiKeydownHandler=function(t){if((/input|textarea/i.test(t.target.tagName)?!(32===t.which||27!==t.which&&(40!==t.which&&38!==t.which||mt(t.target).closest(Lt).length)):Ct.test(t.which))&&(t.preventDefault(),t.stopPropagation(),!this.disabled&&!mt(this).hasClass(At))){var e=l._getParentFromElement(this),n=mt(e).hasClass(Dt);if((n||27===t.which&&32===t.which)&&(!n||27!==t.which&&32!==t.which)){var i=mt(e).find(Rt).get();if(0!==i.length){var r=i.indexOf(t.target);38===t.which&&0<r&&r--,40===t.which&&r<i.length-1&&r++,r<0&&(r=0),i[r].focus()}}else{if(27===t.which){var s=mt(e).find(kt)[0];mt(s).trigger('focus')}mt(this).trigger('click')}}},o(l,null,[{key:'VERSION',get:function(){return'4.1.0'}},{key:'Default',get:function(){return Ft}},{key:'DefaultType',get:function(){return Vt}}]),l}(),mt(document).on(It.KEYDOWN_DATA_API,kt,Qt._dataApiKeydownHandler).on(It.KEYDOWN_DATA_API,Lt,Qt._dataApiKeydownHandler).on(It.CLICK_DATA_API+' '+It.KEYUP_DATA_API,Qt._clearMenus).on(It.CLICK_DATA_API,kt,function(t){t.preventDefault(),t.stopPropagation(),Qt._jQueryInterface.call(mt(this),'toggle')}).on(It.CLICK_DATA_API,Pt,function(t){t.stopPropagation()}),mt.fn[pt]=Qt._jQueryInterface,mt.fn[pt].Constructor=Qt,mt.fn[pt].noConflict=function(){return mt.fn[pt]=Tt,Qt._jQueryInterface},Qt),wn=(Yt='modal',qt='.'+(Gt='bs.modal'),zt=(Bt=e).fn[Yt],Xt={backdrop:!0,keyboard:!0,focus:!0,show:!0},Jt={backdrop:'(boolean|string)',keyboard:'boolean',focus:'boolean',show:'boolean'},Zt={HIDE:'hide'+qt,HIDDEN:'hidden'+qt,SHOW:'show'+qt,SHOWN:'shown'+qt,FOCUSIN:'focusin'+qt,RESIZE:'resize'+qt,CLICK_DISMISS:'click.dismiss'+qt,KEYDOWN_DISMISS:'keydown.dismiss'+qt,MOUSEUP_DISMISS:'mouseup.dismiss'+qt,MOUSEDOWN_DISMISS:'mousedown.dismiss'+qt,CLICK_DATA_API:'click'+qt+'.data-api'},$t='modal-scrollbar-measure',te='modal-backdrop',ee='modal-open',ne='fade',ie='show',re={DIALOG:'.modal-dialog',DATA_TOGGLE:'[data-toggle="modal"]',DATA_DISMISS:'[data-dismiss="modal"]',FIXED_CONTENT:'.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',STICKY_CONTENT:'.sticky-top',NAVBAR_TOGGLER:'.navbar-toggler'},se=function(){function r(t,e){this._config=this._getConfig(e),this._element=t,this._dialog=Bt(t).find(re.DIALOG)[0],this._backdrop=null,this._isShown=!1,this._isBodyOverflowing=!1,this._ignoreBackdropClick=!1,this._scrollbarWidth=0}var t=r.prototype;return t.toggle=function(t){return this._isShown?this.hide():this.show(t)},t.show=function(t){var e=this;if(!this._isTransitioning&&!this._isShown){Bt(this._element).hasClass(ne)&&(this._isTransitioning=!0);var n=Bt.Event(Zt.SHOW,{relatedTarget:t});Bt(this._element).trigger(n),this._isShown||n.isDefaultPrevented()||(this._isShown=!0,this._checkScrollbar(),this._setScrollbar(),this._adjustDialog(),Bt(document.body).addClass(ee),this._setEscapeEvent(),this._setResizeEvent(),Bt(this._element).on(Zt.CLICK_DISMISS,re.DATA_DISMISS,function(t){return e.hide(t)}),Bt(this._dialog).on(Zt.MOUSEDOWN_DISMISS,function(){Bt(e._element).one(Zt.MOUSEUP_DISMISS,function(t){Bt(t.target).is(e._element)&&(e._ignoreBackdropClick=!0)})}),this._showBackdrop(function(){return e._showElement(t)}))}},t.hide=function(t){var e=this;if(t&&t.preventDefault(),!this._isTransitioning&&this._isShown){var n=Bt.Event(Zt.HIDE);if(Bt(this._element).trigger(n),this._isShown&&!n.isDefaultPrevented()){this._isShown=!1;var i=Bt(this._element).hasClass(ne);if(i&&(this._isTransitioning=!0),this._setEscapeEvent(),this._setResizeEvent(),Bt(document).off(Zt.FOCUSIN),Bt(this._element).removeClass(ie),Bt(this._element).off(Zt.CLICK_DISMISS),Bt(this._dialog).off(Zt.MOUSEDOWN_DISMISS),i){var r=Cn.getTransitionDurationFromElement(this._element);Bt(this._element).one(Cn.TRANSITION_END,function(t){return e._hideModal(t)}).emulateTransitionEnd(r)}else this._hideModal()}}},t.dispose=function(){Bt.removeData(this._element,Gt),Bt(window,document,this._element,this._backdrop).off(qt),this._config=null,this._element=null,this._dialog=null,this._backdrop=null,this._isShown=null,this._isBodyOverflowing=null,this._ignoreBackdropClick=null,this._scrollbarWidth=null},t.handleUpdate=function(){this._adjustDialog()},t._getConfig=function(t){return t=h({},Xt,t),Cn.typeCheckConfig(Yt,t,Jt),t},t._showElement=function(t){var e=this,n=Bt(this._element).hasClass(ne);this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE||document.body.appendChild(this._element),this._element.style.display='block',this._element.removeAttribute('aria-hidden'),this._element.scrollTop=0,n&&Cn.reflow(this._element),Bt(this._element).addClass(ie),this._config.focus&&this._enforceFocus();var i=Bt.Event(Zt.SHOWN,{relatedTarget:t}),r=function(){e._config.focus&&e._element.focus(),e._isTransitioning=!1,Bt(e._element).trigger(i)};if(n){var s=Cn.getTransitionDurationFromElement(this._element);Bt(this._dialog).one(Cn.TRANSITION_END,r).emulateTransitionEnd(s)}else r()},t._enforceFocus=function(){var e=this;Bt(document).off(Zt.FOCUSIN).on(Zt.FOCUSIN,function(t){document!==t.target&&e._element!==t.target&&0===Bt(e._element).has(t.target).length&&e._element.focus()})},t._setEscapeEvent=function(){var e=this;this._isShown&&this._config.keyboard?Bt(this._element).on(Zt.KEYDOWN_DISMISS,function(t){27===t.which&&(t.preventDefault(),e.hide())}):this._isShown||Bt(this._element).off(Zt.KEYDOWN_DISMISS)},t._setResizeEvent=function(){var e=this;this._isShown?Bt(window).on(Zt.RESIZE,function(t){return e.handleUpdate(t)}):Bt(window).off(Zt.RESIZE)},t._hideModal=function(){var t=this;this._element.style.display='none',this._element.setAttribute('aria-hidden',!0),this._isTransitioning=!1,this._showBackdrop(function(){Bt(document.body).removeClass(ee),t._resetAdjustments(),t._resetScrollbar(),Bt(t._element).trigger(Zt.HIDDEN)})},t._removeBackdrop=function(){this._backdrop&&(Bt(this._backdrop).remove(),this._backdrop=null)},t._showBackdrop=function(t){var e=this,n=Bt(this._element).hasClass(ne)?ne:'';if(this._isShown&&this._config.backdrop){if(this._backdrop=document.createElement('div'),this._backdrop.className=te,n&&Bt(this._backdrop).addClass(n),Bt(this._backdrop).appendTo(document.body),Bt(this._element).on(Zt.CLICK_DISMISS,function(t){e._ignoreBackdropClick?e._ignoreBackdropClick=!1:t.target===t.currentTarget&&('static'===e._config.backdrop?e._element.focus():e.hide())}),n&&Cn.reflow(this._backdrop),Bt(this._backdrop).addClass(ie),!t)return;if(!n)return void t();var i=Cn.getTransitionDurationFromElement(this._backdrop);Bt(this._backdrop).one(Cn.TRANSITION_END,t).emulateTransitionEnd(i)}else if(!this._isShown&&this._backdrop){Bt(this._backdrop).removeClass(ie);var r=function(){e._removeBackdrop(),t&&t()};if(Bt(this._element).hasClass(ne)){var s=Cn.getTransitionDurationFromElement(this._backdrop);Bt(this._backdrop).one(Cn.TRANSITION_END,r).emulateTransitionEnd(s)}else r()}else t&&t()},t._adjustDialog=function(){var t=this._element.scrollHeight>document.documentElement.clientHeight;!this._isBodyOverflowing&&t&&(this._element.style.paddingLeft=this._scrollbarWidth+'px'),this._isBodyOverflowing&&!t&&(this._element.style.paddingRight=this._scrollbarWidth+'px')},t._resetAdjustments=function(){this._element.style.paddingLeft='',this._element.style.paddingRight=''},t._checkScrollbar=function(){var t=document.body.getBoundingClientRect();this._isBodyOverflowing=t.left+t.right<window.innerWidth,this._scrollbarWidth=this._getScrollbarWidth()},t._setScrollbar=function(){var r=this;if(this._isBodyOverflowing){Bt(re.FIXED_CONTENT).each(function(t,e){var n=Bt(e)[0].style.paddingRight,i=Bt(e).css('padding-right');Bt(e).data('padding-right',n).css('padding-right',parseFloat(i)+r._scrollbarWidth+'px')}),Bt(re.STICKY_CONTENT).each(function(t,e){var n=Bt(e)[0].style.marginRight,i=Bt(e).css('margin-right');Bt(e).data('margin-right',n).css('margin-right',parseFloat(i)-r._scrollbarWidth+'px')}),Bt(re.NAVBAR_TOGGLER).each(function(t,e){var n=Bt(e)[0].style.marginRight,i=Bt(e).css('margin-right');Bt(e).data('margin-right',n).css('margin-right',parseFloat(i)+r._scrollbarWidth+'px')});var t=document.body.style.paddingRight,e=Bt(document.body).css('padding-right');Bt(document.body).data('padding-right',t).css('padding-right',parseFloat(e)+this._scrollbarWidth+'px')}},t._resetScrollbar=function(){Bt(re.FIXED_CONTENT).each(function(t,e){var n=Bt(e).data('padding-right');'undefined'!=typeof n&&Bt(e).css('padding-right',n).removeData('padding-right')}),Bt(re.STICKY_CONTENT+', '+re.NAVBAR_TOGGLER).each(function(t,e){var n=Bt(e).data('margin-right');'undefined'!=typeof n&&Bt(e).css('margin-right',n).removeData('margin-right')});var t=Bt(document.body).data('padding-right');'undefined'!=typeof t&&Bt(document.body).css('padding-right',t).removeData('padding-right')},t._getScrollbarWidth=function(){var t=document.createElement('div');t.className=$t,document.body.appendChild(t);var e=t.getBoundingClientRect().width-t.clientWidth;return document.body.removeChild(t),e},r._jQueryInterface=function(n,i){return this.each(function(){var t=Bt(this).data(Gt),e=h({},r.Default,Bt(this).data(),'object'==typeof n&&n);if(t||(t=new r(this,e),Bt(this).data(Gt,t)),'string'==typeof n){if('undefined'==typeof t[n])throw new TypeError('No method named "'+n+'"');t[n](i)}else e.show&&t.show(i)})},o(r,null,[{key:'VERSION',get:function(){return'4.1.0'}},{key:'Default',get:function(){return Xt}}]),r}(),Bt(document).on(Zt.CLICK_DATA_API,re.DATA_TOGGLE,function(t){var e,n=this,i=Cn.getSelectorFromElement(this);i&&(e=Bt(i)[0]);var r=Bt(e).data(Gt)?'toggle':h({},Bt(e).data(),Bt(this).data());'A'!==this.tagName&&'AREA'!==this.tagName||t.preventDefault();var s=Bt(e).one(Zt.SHOW,function(t){t.isDefaultPrevented()||s.one(Zt.HIDDEN,function(){Bt(n).is(':visible')&&n.focus()})});se._jQueryInterface.call(Bt(e),r,this)}),Bt.fn[Yt]=se._jQueryInterface,Bt.fn[Yt].Constructor=se,Bt.fn[Yt].noConflict=function(){return Bt.fn[Yt]=zt,se._jQueryInterface},se),Nn=(ae='tooltip',he='.'+(le='bs.tooltip'),ce=(oe=e).fn[ae],ue='bs-tooltip',fe=new RegExp('(^|\\s)'+ue+'\\S+','g'),ge={animation:!0,template:'<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',trigger:'hover focus',title:'',delay:0,html:!(_e={AUTO:'auto',TOP:'top',RIGHT:'right',BOTTOM:'bottom',LEFT:'left'}),selector:!(de={animation:'boolean',template:'string',title:'(string|element|function)',trigger:'string',delay:'(number|object)',html:'boolean',selector:'(string|boolean)',placement:'(string|function)',offset:'(number|string)',container:'(string|element|boolean)',fallbackPlacement:'(string|array)',boundary:'(string|element)'}),placement:'top',offset:0,container:!1,fallbackPlacement:'flip',boundary:'scrollParent'},pe='out',ve={HIDE:'hide'+he,HIDDEN:'hidden'+he,SHOW:(me='show')+he,SHOWN:'shown'+he,INSERTED:'inserted'+he,CLICK:'click'+he,FOCUSIN:'focusin'+he,FOCUSOUT:'focusout'+he,MOUSEENTER:'mouseenter'+he,MOUSELEAVE:'mouseleave'+he},Ee='fade',ye='show',Te='.tooltip-inner',Ce='.arrow',Ie='hover',Ae='focus',De='click',be='manual',Se=function(){function i(t,e){if('undefined'==typeof c)throw new TypeError('Bootstrap tooltips require Popper.js (https://popper.js.org)');this._isEnabled=!0,this._timeout=0,this._hoverState='',this._activeTrigger={},this._popper=null,this.element=t,this.config=this._getConfig(e),this.tip=null,this._setListeners()}var t=i.prototype;return t.enable=function(){this._isEnabled=!0},t.disable=function(){this._isEnabled=!1},t.toggleEnabled=function(){this._isEnabled=!this._isEnabled},t.toggle=function(t){if(this._isEnabled)if(t){var e=this.constructor.DATA_KEY,n=oe(t.currentTarget).data(e);n||(n=new this.constructor(t.currentTarget,this._getDelegateConfig()),oe(t.currentTarget).data(e,n)),n._activeTrigger.click=!n._activeTrigger.click,n._isWithActiveTrigger()?n._enter(null,n):n._leave(null,n)}else{if(oe(this.getTipElement()).hasClass(ye))return void this._leave(null,this);this._enter(null,this)}},t.dispose=function(){clearTimeout(this._timeout),oe.removeData(this.element,this.constructor.DATA_KEY),oe(this.element).off(this.constructor.EVENT_KEY),oe(this.element).closest('.modal').off('hide.bs.modal'),this.tip&&oe(this.tip).remove(),this._isEnabled=null,this._timeout=null,this._hoverState=null,(this._activeTrigger=null)!==this._popper&&this._popper.destroy(),this._popper=null,this.element=null,this.config=null,this.tip=null},t.show=function(){var e=this;if('none'===oe(this.element).css('display'))throw new Error('Please use show on visible elements');var t=oe.Event(this.constructor.Event.SHOW);if(this.isWithContent()&&this._isEnabled){oe(this.element).trigger(t);var n=oe.contains(this.element.ownerDocument.documentElement,this.element);if(t.isDefaultPrevented()||!n)return;var i=this.getTipElement(),r=Cn.getUID(this.constructor.NAME);i.setAttribute('id',r),this.element.setAttribute('aria-describedby',r),this.setContent(),this.config.animation&&oe(i).addClass(Ee);var s='function'==typeof this.config.placement?this.config.placement.call(this,i,this.element):this.config.placement,o=this._getAttachment(s);this.addAttachmentClass(o);var a=!1===this.config.container?document.body:oe(this.config.container);oe(i).data(this.constructor.DATA_KEY,this),oe.contains(this.element.ownerDocument.documentElement,this.tip)||oe(i).appendTo(a),oe(this.element).trigger(this.constructor.Event.INSERTED),this._popper=new c(this.element,i,{placement:o,modifiers:{offset:{offset:this.config.offset},flip:{behavior:this.config.fallbackPlacement},arrow:{element:Ce},preventOverflow:{boundariesElement:this.config.boundary}},onCreate:function(t){t.originalPlacement!==t.placement&&e._handlePopperPlacementChange(t)},onUpdate:function(t){e._handlePopperPlacementChange(t)}}),oe(i).addClass(ye),'ontouchstart'in document.documentElement&&oe(document.body).children().on('mouseover',null,oe.noop);var l=function(){e.config.animation&&e._fixTransition();var t=e._hoverState;e._hoverState=null,oe(e.element).trigger(e.constructor.Event.SHOWN),t===pe&&e._leave(null,e)};if(oe(this.tip).hasClass(Ee)){var h=Cn.getTransitionDurationFromElement(this.tip);oe(this.tip).one(Cn.TRANSITION_END,l).emulateTransitionEnd(h)}else l()}},t.hide=function(t){var e=this,n=this.getTipElement(),i=oe.Event(this.constructor.Event.HIDE),r=function(){e._hoverState!==me&&n.parentNode&&n.parentNode.removeChild(n),e._cleanTipClass(),e.element.removeAttribute('aria-describedby'),oe(e.element).trigger(e.constructor.Event.HIDDEN),null!==e._popper&&e._popper.destroy(),t&&t()};if(oe(this.element).trigger(i),!i.isDefaultPrevented()){if(oe(n).removeClass(ye),'ontouchstart'in document.documentElement&&oe(document.body).children().off('mouseover',null,oe.noop),this._activeTrigger[De]=!1,this._activeTrigger[Ae]=!1,this._activeTrigger[Ie]=!1,oe(this.tip).hasClass(Ee)){var s=Cn.getTransitionDurationFromElement(n);oe(n).one(Cn.TRANSITION_END,r).emulateTransitionEnd(s)}else r();this._hoverState=''}},t.update=function(){null!==this._popper&&this._popper.scheduleUpdate()},t.isWithContent=function(){return Boolean(this.getTitle())},t.addAttachmentClass=function(t){oe(this.getTipElement()).addClass(ue+'-'+t)},t.getTipElement=function(){return this.tip=this.tip||oe(this.config.template)[0],this.tip},t.setContent=function(){var t=oe(this.getTipElement());this.setElementContent(t.find(Te),this.getTitle()),t.removeClass(Ee+' '+ye)},t.setElementContent=function(t,e){var n=this.config.html;'object'==typeof e&&(e.nodeType||e.jquery)?n?oe(e).parent().is(t)||t.empty().append(e):t.text(oe(e).text()):t[n?'html':'text'](e)},t.getTitle=function(){var t=this.element.getAttribute('data-original-title');return t||(t='function'==typeof this.config.title?this.config.title.call(this.element):this.config.title),t},t._getAttachment=function(t){return _e[t.toUpperCase()]},t._setListeners=function(){var i=this;this.config.trigger.split(' ').forEach(function(t){if('click'===t)oe(i.element).on(i.constructor.Event.CLICK,i.config.selector,function(t){return i.toggle(t)});else if(t!==be){var e=t===Ie?i.constructor.Event.MOUSEENTER:i.constructor.Event.FOCUSIN,n=t===Ie?i.constructor.Event.MOUSELEAVE:i.constructor.Event.FOCUSOUT;oe(i.element).on(e,i.config.selector,function(t){return i._enter(t)}).on(n,i.config.selector,function(t){return i._leave(t)})}oe(i.element).closest('.modal').on('hide.bs.modal',function(){return i.hide()})}),this.config.selector?this.config=h({},this.config,{trigger:'manual',selector:''}):this._fixTitle()},t._fixTitle=function(){var t=typeof this.element.getAttribute('data-original-title');(this.element.getAttribute('title')||'string'!==t)&&(this.element.setAttribute('data-original-title',this.element.getAttribute('title')||''),this.element.setAttribute('title',''))},t._enter=function(t,e){var n=this.constructor.DATA_KEY;(e=e||oe(t.currentTarget).data(n))||(e=new this.constructor(t.currentTarget,this._getDelegateConfig()),oe(t.currentTarget).data(n,e)),t&&(e._activeTrigger['focusin'===t.type?Ae:Ie]=!0),oe(e.getTipElement()).hasClass(ye)||e._hoverState===me?e._hoverState=me:(clearTimeout(e._timeout),e._hoverState=me,e.config.delay&&e.config.delay.show?e._timeout=setTimeout(function(){e._hoverState===me&&e.show()},e.config.delay.show):e.show())},t._leave=function(t,e){var n=this.constructor.DATA_KEY;(e=e||oe(t.currentTarget).data(n))||(e=new this.constructor(t.currentTarget,this._getDelegateConfig()),oe(t.currentTarget).data(n,e)),t&&(e._activeTrigger['focusout'===t.type?Ae:Ie]=!1),e._isWithActiveTrigger()||(clearTimeout(e._timeout),e._hoverState=pe,e.config.delay&&e.config.delay.hide?e._timeout=setTimeout(function(){e._hoverState===pe&&e.hide()},e.config.delay.hide):e.hide())},t._isWithActiveTrigger=function(){for(var t in this._activeTrigger)if(this._activeTrigger[t])return!0;return!1},t._getConfig=function(t){return'number'==typeof(t=h({},this.constructor.Default,oe(this.element).data(),t)).delay&&(t.delay={show:t.delay,hide:t.delay}),'number'==typeof t.title&&(t.title=t.title.toString()),'number'==typeof t.content&&(t.content=t.content.toString()),Cn.typeCheckConfig(ae,t,this.constructor.DefaultType),t},t._getDelegateConfig=function(){var t={};if(this.config)for(var e in this.config)this.constructor.Default[e]!==this.config[e]&&(t[e]=this.config[e]);return t},t._cleanTipClass=function(){var t=oe(this.getTipElement()),e=t.attr('class').match(fe);null!==e&&0<e.length&&t.removeClass(e.join(''))},t._handlePopperPlacementChange=function(t){this._cleanTipClass(),this.addAttachmentClass(this._getAttachment(t.placement))},t._fixTransition=function(){var t=this.getTipElement(),e=this.config.animation;null===t.getAttribute('x-placement')&&(oe(t).removeClass(Ee),this.config.animation=!1,this.hide(),this.show(),this.config.animation=e)},i._jQueryInterface=function(n){return this.each(function(){var t=oe(this).data(le),e='object'==typeof n&&n;if((t||!/dispose|hide/.test(n))&&(t||(t=new i(this,e),oe(this).data(le,t)),'string'==typeof n)){if('undefined'==typeof t[n])throw new TypeError('No method named "'+n+'"');t[n]()}})},o(i,null,[{key:'VERSION',get:function(){return'4.1.0'}},{key:'Default',get:function(){return ge}},{key:'NAME',get:function(){return ae}},{key:'DATA_KEY',get:function(){return le}},{key:'Event',get:function(){return ve}},{key:'EVENT_KEY',get:function(){return he}},{key:'DefaultType',get:function(){return de}}]),i}(),oe.fn[ae]=Se._jQueryInterface,oe.fn[ae].Constructor=Se,oe.fn[ae].noConflict=function(){return oe.fn[ae]=ce,Se._jQueryInterface},Se),On=(Ne='popover',ke='.'+(Oe='bs.popover'),Pe=(we=e).fn[Ne],Le='bs-popover',je=new RegExp('(^|\\s)'+Le+'\\S+','g'),Re=h({},Nn.Default,{placement:'right',trigger:'click',content:'',template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'}),He=h({},Nn.DefaultType,{content:'(string|element|function)'}),We='fade',xe='.popover-header',Ue='.popover-body',Ke={HIDE:'hide'+ke,HIDDEN:'hidden'+ke,SHOW:(Me='show')+ke,SHOWN:'shown'+ke,INSERTED:'inserted'+ke,CLICK:'click'+ke,FOCUSIN:'focusin'+ke,FOCUSOUT:'focusout'+ke,MOUSEENTER:'mouseenter'+ke,MOUSELEAVE:'mouseleave'+ke},Fe=function(t){var e,n;function i(){return t.apply(this,arguments)||this}n=t,(e=i).prototype=Object.create(n.prototype),(e.prototype.constructor=e).__proto__=n;var r=i.prototype;return r.isWithContent=function(){return this.getTitle()||this._getContent()},r.addAttachmentClass=function(t){we(this.getTipElement()).addClass(Le+'-'+t)},r.getTipElement=function(){return this.tip=this.tip||we(this.config.template)[0],this.tip},r.setContent=function(){var t=we(this.getTipElement());this.setElementContent(t.find(xe),this.getTitle());var e=this._getContent();'function'==typeof e&&(e=e.call(this.element)),this.setElementContent(t.find(Ue),e),t.removeClass(We+' '+Me)},r._getContent=function(){return this.element.getAttribute('data-content')||this.config.content},r._cleanTipClass=function(){var t=we(this.getTipElement()),e=t.attr('class').match(je);null!==e&&0<e.length&&t.removeClass(e.join(''))},i._jQueryInterface=function(n){return this.each(function(){var t=we(this).data(Oe),e='object'==typeof n?n:null;if((t||!/destroy|hide/.test(n))&&(t||(t=new i(this,e),we(this).data(Oe,t)),'string'==typeof n)){if('undefined'==typeof t[n])throw new TypeError('No method named "'+n+'"');t[n]()}})},o(i,null,[{key:'VERSION',get:function(){return'4.1.0'}},{key:'Default',get:function(){return Re}},{key:'NAME',get:function(){return Ne}},{key:'DATA_KEY',get:function(){return Oe}},{key:'Event',get:function(){return Ke}},{key:'EVENT_KEY',get:function(){return ke}},{key:'DefaultType',get:function(){return He}}]),i}(Nn),we.fn[Ne]=Fe._jQueryInterface,we.fn[Ne].Constructor=Fe,we.fn[Ne].noConflict=function(){return we.fn[Ne]=Pe,Fe._jQueryInterface},Fe),kn=(Qe='scrollspy',Ye='.'+(Be='bs.scrollspy'),Ge=(Ve=e).fn[Qe],qe={offset:10,method:'auto',target:''},ze={offset:'number',method:'string',target:'(string|element)'},Xe={ACTIVATE:'activate'+Ye,SCROLL:'scroll'+Ye,LOAD_DATA_API:'load'+Ye+'.data-api'},Je='dropdown-item',Ze='active',$e={DATA_SPY:'[data-spy="scroll"]',ACTIVE:'.active',NAV_LIST_GROUP:'.nav, .list-group',NAV_LINKS:'.nav-link',NAV_ITEMS:'.nav-item',LIST_ITEMS:'.list-group-item',DROPDOWN:'.dropdown',DROPDOWN_ITEMS:'.dropdown-item',DROPDOWN_TOGGLE:'.dropdown-toggle'},tn='offset',en='position',nn=function(){function n(t,e){var n=this;this._element=t,this._scrollElement='BODY'===t.tagName?window:t,this._config=this._getConfig(e),this._selector=this._config.target+' '+$e.NAV_LINKS+','+this._config.target+' '+$e.LIST_ITEMS+','+this._config.target+' '+$e.DROPDOWN_ITEMS,this._offsets=[],this._targets=[],this._activeTarget=null,this._scrollHeight=0,Ve(this._scrollElement).on(Xe.SCROLL,function(t){return n._process(t)}),this.refresh(),this._process()}var t=n.prototype;return t.refresh=function(){var e=this,t=this._scrollElement===this._scrollElement.window?tn:en,r='auto'===this._config.method?t:this._config.method,s=r===en?this._getScrollTop():0;this._offsets=[],this._targets=[],this._scrollHeight=this._getScrollHeight(),Ve.makeArray(Ve(this._selector)).map(function(t){var e,n=Cn.getSelectorFromElement(t);if(n&&(e=Ve(n)[0]),e){var i=e.getBoundingClientRect();if(i.width||i.height)return[Ve(e)[r]().top+s,n]}return null}).filter(function(t){return t}).sort(function(t,e){return t[0]-e[0]}).forEach(function(t){e._offsets.push(t[0]),e._targets.push(t[1])})},t.dispose=function(){Ve.removeData(this._element,Be),Ve(this._scrollElement).off(Ye),this._element=null,this._scrollElement=null,this._config=null,this._selector=null,this._offsets=null,this._targets=null,this._activeTarget=null,this._scrollHeight=null},t._getConfig=function(t){if('string'!=typeof(t=h({},qe,t)).target){var e=Ve(t.target).attr('id');e||(e=Cn.getUID(Qe),Ve(t.target).attr('id',e)),t.target='#'+e}return Cn.typeCheckConfig(Qe,t,ze),t},t._getScrollTop=function(){return this._scrollElement===window?this._scrollElement.pageYOffset:this._scrollElement.scrollTop},t._getScrollHeight=function(){return this._scrollElement.scrollHeight||Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)},t._getOffsetHeight=function(){return this._scrollElement===window?window.innerHeight:this._scrollElement.getBoundingClientRect().height},t._process=function(){var t=this._getScrollTop()+this._config.offset,e=this._getScrollHeight(),n=this._config.offset+e-this._getOffsetHeight();if(this._scrollHeight!==e&&this.refresh(),n<=t){var i=this._targets[this._targets.length-1];this._activeTarget!==i&&this._activate(i)}else{if(this._activeTarget&&t<this._offsets[0]&&0<this._offsets[0])return this._activeTarget=null,void this._clear();for(var r=this._offsets.length;r--;){this._activeTarget!==this._targets[r]&&t>=this._offsets[r]&&('undefined'==typeof this._offsets[r+1]||t<this._offsets[r+1])&&this._activate(this._targets[r])}}},t._activate=function(e){this._activeTarget=e,this._clear();var t=this._selector.split(',');t=t.map(function(t){return t+'[data-target="'+e+'"],'+t+'[href="'+e+'"]'});var n=Ve(t.join(','));n.hasClass(Je)?(n.closest($e.DROPDOWN).find($e.DROPDOWN_TOGGLE).addClass(Ze),n.addClass(Ze)):(n.addClass(Ze),n.parents($e.NAV_LIST_GROUP).prev($e.NAV_LINKS+', '+$e.LIST_ITEMS).addClass(Ze),n.parents($e.NAV_LIST_GROUP).prev($e.NAV_ITEMS).children($e.NAV_LINKS).addClass(Ze)),Ve(this._scrollElement).trigger(Xe.ACTIVATE,{relatedTarget:e})},t._clear=function(){Ve(this._selector).filter($e.ACTIVE).removeClass(Ze)},n._jQueryInterface=function(e){return this.each(function(){var t=Ve(this).data(Be);if(t||(t=new n(this,'object'==typeof e&&e),Ve(this).data(Be,t)),'string'==typeof e){if('undefined'==typeof t[e])throw new TypeError('No method named "'+e+'"');t[e]()}})},o(n,null,[{key:'VERSION',get:function(){return'4.1.0'}},{key:'Default',get:function(){return qe}}]),n}(),Ve(window).on(Xe.LOAD_DATA_API,function(){for(var t=Ve.makeArray(Ve($e.DATA_SPY)),e=t.length;e--;){var n=Ve(t[e]);nn._jQueryInterface.call(n,n.data())}}),Ve.fn[Qe]=nn._jQueryInterface,Ve.fn[Qe].Constructor=nn,Ve.fn[Qe].noConflict=function(){return Ve.fn[Qe]=Ge,nn._jQueryInterface},nn),Pn=(on='.'+(sn='bs.tab'),an=(rn=e).fn.tab,ln={HIDE:'hide'+on,HIDDEN:'hidden'+on,SHOW:'show'+on,SHOWN:'shown'+on,CLICK_DATA_API:'click'+on+'.data-api'},hn='dropdown-menu',cn='active',un='disabled',fn='fade',dn='show',_n='.dropdown',gn='.nav, .list-group',mn='.active',pn='> li > .active',vn='[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',En='.dropdown-toggle',yn='> .dropdown-menu .active',Tn=function(){function i(t){this._element=t}var t=i.prototype;return t.show=function(){var n=this;if(!(this._element.parentNode&&this._element.parentNode.nodeType===Node.ELEMENT_NODE&&rn(this._element).hasClass(cn)||rn(this._element).hasClass(un))){var t,i,e=rn(this._element).closest(gn)[0],r=Cn.getSelectorFromElement(this._element);if(e){var s='UL'===e.nodeName?pn:mn;i=(i=rn.makeArray(rn(e).find(s)))[i.length-1]}var o=rn.Event(ln.HIDE,{relatedTarget:this._element}),a=rn.Event(ln.SHOW,{relatedTarget:i});if(i&&rn(i).trigger(o),rn(this._element).trigger(a),!a.isDefaultPrevented()&&!o.isDefaultPrevented()){r&&(t=rn(r)[0]),this._activate(this._element,e);var l=function(){var t=rn.Event(ln.HIDDEN,{relatedTarget:n._element}),e=rn.Event(ln.SHOWN,{relatedTarget:i});rn(i).trigger(t),rn(n._element).trigger(e)};t?this._activate(t,t.parentNode,l):l()}}},t.dispose=function(){rn.removeData(this._element,sn),this._element=null},t._activate=function(t,e,n){var i=this,r=('UL'===e.nodeName?rn(e).find(pn):rn(e).children(mn))[0],s=n&&r&&rn(r).hasClass(fn),o=function(){return i._transitionComplete(t,r,n)};if(r&&s){var a=Cn.getTransitionDurationFromElement(r);rn(r).one(Cn.TRANSITION_END,o).emulateTransitionEnd(a)}else o()},t._transitionComplete=function(t,e,n){if(e){rn(e).removeClass(dn+' '+cn);var i=rn(e.parentNode).find(yn)[0];i&&rn(i).removeClass(cn),'tab'===e.getAttribute('role')&&e.setAttribute('aria-selected',!1)}if(rn(t).addClass(cn),'tab'===t.getAttribute('role')&&t.setAttribute('aria-selected',!0),Cn.reflow(t),rn(t).addClass(dn),t.parentNode&&rn(t.parentNode).hasClass(hn)){var r=rn(t).closest(_n)[0];r&&rn(r).find(En).addClass(cn),t.setAttribute('aria-expanded',!0)}n&&n()},i._jQueryInterface=function(n){return this.each(function(){var t=rn(this),e=t.data(sn);if(e||(e=new i(this),t.data(sn,e)),'string'==typeof n){if('undefined'==typeof e[n])throw new TypeError('No method named "'+n+'"');e[n]()}})},o(i,null,[{key:'VERSION',get:function(){return'4.1.0'}}]),i}(),rn(document).on(ln.CLICK_DATA_API,vn,function(t){t.preventDefault(),Tn._jQueryInterface.call(rn(this),'show')}),rn.fn.tab=Tn._jQueryInterface,rn.fn.tab.Constructor=Tn,rn.fn.tab.noConflict=function(){return rn.fn.tab=an,Tn._jQueryInterface},Tn);!function(t){if('undefined'==typeof t)throw new TypeError('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.');var e=t.fn.jquery.split(' ')[0].split('.');if(e[0]<2&&e[1]<9||1===e[0]&&9===e[1]&&e[2]<1||4<=e[0])throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0')}(e),t.Util=Cn,t.Alert=In,t.Button=An,t.Carousel=Dn,t.Collapse=bn,t.Dropdown=Sn,t.Modal=wn,t.Popover=On,t.Scrollspy=kn,t.Tab=Pn,t.Tooltip=Nn,Object.defineProperty(t,'__esModule',{value:!0})});/*!
* Clipboard.js v2.0.0
* https://zenorocha.github.io/clipboard.js
* 
* Licensed MIT © Zeno Rocha
*/!function(e,t){'object'==typeof exports&&'object'==typeof module?module.exports=t():'function'==typeof define&&define.amd?define([],t):'object'==typeof exports?exports.ClipboardJS=t():e.ClipboardJS=t()}(this,function(){return function(n){function r(e){if(i[e])return i[e].exports;var t=i[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,r),t.l=!0,t.exports}var i={};return r.m=n,r.c=i,r.i=function(e){return e},r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:n})},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,'a',t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p='',r(r.s=3)}([function(n,r,i){var o,a,s;!function(e,t){a=[n,i(7)],o=t,void 0!==(s='function'==typeof o?o.apply(r,a):o)&&(n.exports=s)}(0,function(e,t){'use strict';function n(e,t){if(!(e instanceof t))throw new TypeError('Cannot call a class as a function')}var r=function(e){return e&&e.__esModule?e:{default:e}}(t),i='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&'function'==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?'symbol':typeof e},o=function(){function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,'value'in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}}(),a=function(){function t(e){n(this,t),this.resolveOptions(e),this.initSelection()}return o(t,[{key:'resolveOptions',value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.action=e.action,this.container=e.container,this.emitter=e.emitter,this.target=e.target,this.text=e.text,this.trigger=e.trigger,this.selectedText=''}},{key:'initSelection',value:function(){this.text?this.selectFake():this.target&&this.selectTarget()}},{key:'selectFake',value:function(){var e=this,t='rtl'==document.documentElement.getAttribute('dir');this.removeFake(),this.fakeHandlerCallback=function(){return e.removeFake()},this.fakeHandler=this.container.addEventListener('click',this.fakeHandlerCallback)||!0,this.fakeElem=document.createElement('textarea'),this.fakeElem.style.fontSize='12pt',this.fakeElem.style.border='0',this.fakeElem.style.padding='0',this.fakeElem.style.margin='0',this.fakeElem.style.position='absolute',this.fakeElem.style[t?'right':'left']='-9999px';var n=window.pageYOffset||document.documentElement.scrollTop;this.fakeElem.style.top=n+'px',this.fakeElem.setAttribute('readonly',''),this.fakeElem.value=this.text,this.container.appendChild(this.fakeElem),this.selectedText=(0,r.default)(this.fakeElem),this.copyText()}},{key:'removeFake',value:function(){this.fakeHandler&&(this.container.removeEventListener('click',this.fakeHandlerCallback),this.fakeHandler=null,this.fakeHandlerCallback=null),this.fakeElem&&(this.container.removeChild(this.fakeElem),this.fakeElem=null)}},{key:'selectTarget',value:function(){this.selectedText=(0,r.default)(this.target),this.copyText()}},{key:'copyText',value:function(){var t=void 0;try{t=document.execCommand(this.action)}catch(e){t=!1}this.handleResult(t)}},{key:'handleResult',value:function(e){this.emitter.emit(e?'success':'error',{action:this.action,text:this.selectedText,trigger:this.trigger,clearSelection:this.clearSelection.bind(this)})}},{key:'clearSelection',value:function(){this.trigger&&this.trigger.focus(),window.getSelection().removeAllRanges()}},{key:'destroy',value:function(){this.removeFake()}},{key:'action',set:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:'copy';if(this._action=e,'copy'!==this._action&&'cut'!==this._action)throw new Error('Invalid "action" value, use either "copy" or "cut"')},get:function(){return this._action}},{key:'target',set:function(e){if(void 0!==e){if(!e||'object'!==(void 0===e?'undefined':i(e))||1!==e.nodeType)throw new Error('Invalid "target" value, use a valid Element');if('copy'===this.action&&e.hasAttribute('disabled'))throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if('cut'===this.action&&(e.hasAttribute('readonly')||e.hasAttribute('disabled')))throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');this._target=e}},get:function(){return this._target}}]),t}();e.exports=a})},function(e,t,n){function r(e,t,n){if(!e&&!t&&!n)throw new Error('Missing required arguments');if(!s.string(t))throw new TypeError('Second argument must be a String');if(!s.fn(n))throw new TypeError('Third argument must be a Function');if(s.node(e))return i(e,t,n);if(s.nodeList(e))return o(e,t,n);if(s.string(e))return a(e,t,n);throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList')}function i(e,t,n){return e.addEventListener(t,n),{destroy:function(){e.removeEventListener(t,n)}}}function o(e,t,n){return Array.prototype.forEach.call(e,function(e){e.addEventListener(t,n)}),{destroy:function(){Array.prototype.forEach.call(e,function(e){e.removeEventListener(t,n)})}}}function a(e,t,n){return l(document.body,e,t,n)}var s=n(6),l=n(5);e.exports=r},function(e,t){function n(){}n.prototype={on:function(e,t,n){var r=this.e||(this.e={});return(r[e]||(r[e]=[])).push({fn:t,ctx:n}),this},once:function(e,t,n){function r(){i.off(e,r),t.apply(n,arguments)}var i=this;return r._=t,this.on(e,r,n)},emit:function(e){var t=[].slice.call(arguments,1),n=((this.e||(this.e={}))[e]||[]).slice(),r=0,i=n.length;for(r;r<i;r++)n[r].fn.apply(n[r].ctx,t);return this},off:function(e,t){var n=this.e||(this.e={}),r=n[e],i=[];if(r&&t)for(var o=0,a=r.length;o<a;o++)r[o].fn!==t&&r[o].fn._!==t&&i.push(r[o]);return i.length?n[e]=i:delete n[e],this}},e.exports=n},function(n,r,i){var o,a,s;!function(e,t){a=[n,i(0),i(2),i(1)],o=t,void 0!==(s='function'==typeof o?o.apply(r,a):o)&&(n.exports=s)}(0,function(e,t,n,r){'use strict';function i(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError('Cannot call a class as a function')}function a(e,t){if(!e)throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');return!t||'object'!=typeof t&&'function'!=typeof t?e:t}function s(e,t){if('function'!=typeof t&&null!==t)throw new TypeError('Super expression must either be null or a function, not '+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t){var n='data-clipboard-'+e;if(t.hasAttribute(n))return t.getAttribute(n)}var c=i(t),u=i(n),h=i(r),d='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&'function'==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?'symbol':typeof e},f=function(){function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,'value'in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}}(),A=function(e){function r(e,t){o(this,r);var n=a(this,(r.__proto__||Object.getPrototypeOf(r)).call(this));return n.resolveOptions(t),n.listenClick(e),n}return s(r,e),f(r,[{key:'resolveOptions',value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.action='function'==typeof e.action?e.action:this.defaultAction,this.target='function'==typeof e.target?e.target:this.defaultTarget,this.text='function'==typeof e.text?e.text:this.defaultText,this.container='object'===d(e.container)?e.container:document.body}},{key:'listenClick',value:function(e){var t=this;this.listener=(0,h.default)(e,'click',function(e){return t.onClick(e)})}},{key:'onClick',value:function(e){var t=e.delegateTarget||e.currentTarget;this.clipboardAction&&(this.clipboardAction=null),this.clipboardAction=new c.default({action:this.action(t),target:this.target(t),text:this.text(t),container:this.container,trigger:t,emitter:this})}},{key:'defaultAction',value:function(e){return l('action',e)}},{key:'defaultTarget',value:function(e){var t=l('target',e);if(t)return document.querySelector(t)}},{key:'defaultText',value:function(e){return l('text',e)}},{key:'destroy',value:function(){this.listener.destroy(),this.clipboardAction&&(this.clipboardAction.destroy(),this.clipboardAction=null)}}],[{key:'isSupported',value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:['copy','cut'],t='string'==typeof e?[e]:e,n=!!document.queryCommandSupported;return t.forEach(function(e){n=n&&!!document.queryCommandSupported(e)}),n}}]),r}(u.default);e.exports=A})},function(e,t){function n(e,t){for(;e&&e.nodeType!==r;){if('function'==typeof e.matches&&e.matches(t))return e;e=e.parentNode}}var r=9;if('undefined'!=typeof Element&&!Element.prototype.matches){var i=Element.prototype;i.matches=i.matchesSelector||i.mozMatchesSelector||i.msMatchesSelector||i.oMatchesSelector||i.webkitMatchesSelector}e.exports=n},function(e,t,n){function o(e,t,n,r,i){var o=a.apply(this,arguments);return e.addEventListener(n,o,i),{destroy:function(){e.removeEventListener(n,o,i)}}}function r(e,t,n,r,i){return'function'==typeof e.addEventListener?o.apply(null,arguments):'function'==typeof n?o.bind(null,document).apply(null,arguments):('string'==typeof e&&(e=document.querySelectorAll(e)),Array.prototype.map.call(e,function(e){return o(e,t,n,r,i)}))}function a(t,n,e,r){return function(e){e.delegateTarget=i(e.target,n),e.delegateTarget&&r.call(t,e)}}var i=n(4);e.exports=r},function(e,n){n.node=function(e){return void 0!==e&&e instanceof HTMLElement&&1===e.nodeType},n.nodeList=function(e){var t=Object.prototype.toString.call(e);return void 0!==e&&('[object NodeList]'===t||'[object HTMLCollection]'===t)&&'length'in e&&(0===e.length||n.node(e[0]))},n.string=function(e){return'string'==typeof e||e instanceof String},n.fn=function(e){return'[object Function]'===Object.prototype.toString.call(e)}},function(e,t){function n(e){var t;if('SELECT'===e.nodeName)e.focus(),t=e.value;else if('INPUT'===e.nodeName||'TEXTAREA'===e.nodeName){var n=e.hasAttribute('readonly');n||e.setAttribute('readonly',''),e.select(),e.setSelectionRange(0,e.value.length),n||e.removeAttribute('readonly'),t=e.value}else{e.hasAttribute('contenteditable')&&e.focus();var r=window.getSelection(),i=document.createRange();i.selectNodeContents(e),r.removeAllRanges(),r.addRange(i),t=r.toString()}return t}e.exports=n}])});/*!

Holder - client side image placeholders
Version 2.9.4+cabil
© 2016 Ivan Malopinsky - http://imsky.co

Site:     http://holderjs.com
Issues:   https://github.com/imsky/holder/issues
License:  MIT

*/!function(i){if(i.document){var o=i.document;o.querySelectorAll||(o.querySelectorAll=function(e){var t,n=o.createElement('style'),r=[];for(o.documentElement.firstChild.appendChild(n),o._qsa=[],n.styleSheet.cssText=e+'{x-qsa:expression(document._qsa && document._qsa.push(this))}',i.scrollBy(0,0),n.parentNode.removeChild(n);o._qsa.length;)t=o._qsa.shift(),t.style.removeAttribute('x-qsa'),r.push(t);return o._qsa=null,r}),o.querySelector||(o.querySelector=function(e){var t=o.querySelectorAll(e);return t.length?t[0]:null}),o.getElementsByClassName||(o.getElementsByClassName=function(e){return e=String(e).replace(/^|\s+/g,'.'),o.querySelectorAll(e)}),Object.keys||(Object.keys=function(e){if(e!==Object(e))throw TypeError('Object.keys called on non-object');var t,n=[];for(t in e)Object.prototype.hasOwnProperty.call(e,t)&&n.push(t);return n}),Array.prototype.forEach||(Array.prototype.forEach=function(e){if(void 0===this||null===this)throw TypeError();var t=Object(this),n=t.length>>>0;if('function'!=typeof e)throw TypeError();var r,i=arguments[1];for(r=0;r<n;r++)r in t&&e.call(i,t[r],r,t)}),function(e){var u='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';e.atob=e.atob||function(e){e=String(e);var t,n=0,r=[],i=0,o=0;if(e=e.replace(/\s/g,''),e.length%4===0&&(e=e.replace(/=+$/,'')),e.length%4===1)throw Error('InvalidCharacterError');if(/[^+\/0-9A-Za-z]/.test(e))throw Error('InvalidCharacterError');for(;n<e.length;)t=u.indexOf(e.charAt(n)),i=i<<6|t,o+=6,24===o&&(r.push(String.fromCharCode(i>>16&255)),r.push(String.fromCharCode(i>>8&255)),r.push(String.fromCharCode(255&i)),o=0,i=0),n+=1;return 12===o?(i>>=4,r.push(String.fromCharCode(255&i))):18===o&&(i>>=2,r.push(String.fromCharCode(i>>8&255)),r.push(String.fromCharCode(255&i))),r.join('')},e.btoa=e.btoa||function(e){e=String(e);var t,n,r,i,o,a,s,l=0,c=[];if(/[^\x00-\xFF]/.test(e))throw Error('InvalidCharacterError');for(;l<e.length;)t=e.charCodeAt(l++),n=e.charCodeAt(l++),r=e.charCodeAt(l++),i=t>>2,o=(3&t)<<4|n>>4,a=(15&n)<<2|r>>6,s=63&r,l===e.length+2?(a=64,s=64):l===e.length+1&&(s=64),c.push(u.charAt(i),u.charAt(o),u.charAt(a),u.charAt(s));return c.join('')}}(i),Object.prototype.hasOwnProperty||(Object.prototype.hasOwnProperty=function(e){var t=this.__proto__||this.constructor.prototype;return e in this&&(!(e in t)||t[e]!==this[e])}),function(){if('performance'in i==!1&&(i.performance={}),Date.now=Date.now||function(){return new Date().getTime()},'now'in i.performance==!1){var e=Date.now();performance.timing&&performance.timing.navigationStart&&(e=performance.timing.navigationStart),i.performance.now=function(){return Date.now()-e}}}(),i.requestAnimationFrame||(i.webkitRequestAnimationFrame&&i.webkitCancelAnimationFrame?!function(t){t.requestAnimationFrame=function(e){return webkitRequestAnimationFrame(function(){e(t.performance.now())})},t.cancelAnimationFrame=t.webkitCancelAnimationFrame}(i):i.mozRequestAnimationFrame&&i.mozCancelAnimationFrame?!function(t){t.requestAnimationFrame=function(e){return mozRequestAnimationFrame(function(){e(t.performance.now())})},t.cancelAnimationFrame=t.mozCancelAnimationFrame}(i):!function(t){t.requestAnimationFrame=function(e){return t.setTimeout(e,1e3/60)},t.cancelAnimationFrame=t.clearTimeout}(i))}}(this),function(e,t){'object'==typeof exports&&'object'==typeof module?module.exports=t():'function'==typeof define&&define.amd?define([],t):'object'==typeof exports?exports.Holder=t():e.Holder=t()}(this,function(){return function(n){function r(e){if(i[e])return i[e].exports;var t=i[e]={exports:{},id:e,loaded:!1};return n[e].call(t.exports,t,t.exports,r),t.loaded=!0,t.exports}var i={};return r.m=n,r.c=i,r.p='',r(0)}([function(e,t,n){e.exports=n(1)},function(L,e,F){(function(h){function o(e,t,n,r){var i=d(n.substr(n.lastIndexOf(e.domain)),e);i&&f({mode:null,el:r,flags:i,engineSettings:t})}function d(e,t){var n={theme:E(O.settings.themes.gray,null),stylesheets:t.stylesheets,instanceOptions:t},r=e.indexOf('?'),i=[e];r!==-1&&(i=[e.slice(0,r),e.slice(r+1)]);var o=i[0].split('/');n.holderURL=e;var a=o[1],s=a.match(/([\d]+p?)x([\d]+p?)/);if(!s)return!1;if(n.fluid=a.indexOf('p')!==-1,n.dimensions={width:s[1].replace('p','%'),height:s[2].replace('p','%')},2===i.length){var l=A.parse(i[1]);if(b.truthy(l.ratio)){n.fluid=!0;var c=parseFloat(n.dimensions.width.replace('%','')),u=parseFloat(n.dimensions.height.replace('%',''));u=Math.floor(100*(u/c)),c=100,n.dimensions.width=c+'%',n.dimensions.height=u+'%'}if(n.auto=b.truthy(l.auto),l.bg&&(n.theme.bg=b.parseColor(l.bg)),l.fg&&(n.theme.fg=b.parseColor(l.fg)),l.bg&&!l.fg&&(n.autoFg=!0),l.theme&&n.instanceOptions.themes.hasOwnProperty(l.theme)&&(n.theme=E(n.instanceOptions.themes[l.theme],null)),l.text&&(n.text=l.text),l.textmode&&(n.textmode=l.textmode),l.size&&(n.size=l.size),l.font&&(n.font=l.font),l.align&&(n.align=l.align),l.lineWrap&&(n.lineWrap=l.lineWrap),n.nowrap=b.truthy(l.nowrap),n.outline=b.truthy(l.outline),b.truthy(l.random)){O.vars.cache.themeKeys=O.vars.cache.themeKeys||Object.keys(n.instanceOptions.themes);var h=O.vars.cache.themeKeys[0|Math.random()*O.vars.cache.themeKeys.length];n.theme=E(n.instanceOptions.themes[h],null)}}return n}function f(e){var t=e.mode,n=e.el,r=e.flags,i=e.engineSettings,o=r.dimensions,a=r.theme,s=o.width+'x'+o.height;t=null==t?r.fluid?'fluid':'image':t;var l=/holder_([a-z]+)/g,c=!1;if(null!=r.text&&(a.text=r.text,'object'===n.nodeName.toLowerCase())){for(var u=a.text.split('\\n'),h=0;h<u.length;h++)u[h]=b.encodeHtmlEntity(u[h]);a.text=u.join('\\n')}if(a.text){var d=a.text.match(l);null!==d&&d.forEach(function(e){'holder_dimensions'===e&&(a.text=a.text.replace(e,s))})}var f=r.holderURL,A=E(i,null);if(r.font&&(a.font=r.font,!A.noFontFallback&&'img'===n.nodeName.toLowerCase()&&O.setup.supportsCanvas&&'svg'===A.renderer&&(A=E(A,{renderer:'canvas'}))),r.font&&'canvas'==A.renderer&&(A.reRender=!0),'background'==t)null==n.getAttribute('data-background-src')&&x.setAttr(n,{'data-background-src':f});else{var p={};p[O.vars.dataAttr]=f,x.setAttr(n,p)}r.theme=a,n.holderData={flags:r,engineSettings:A},'image'!=t&&'fluid'!=t||x.setAttr(n,{alt:a.text?c?a.text:a.text+' ['+s+']':s});var g={mode:t,el:n,holderSettings:{dimensions:o,theme:a,flags:r},engineSettings:A};'image'==t?(r.auto||(n.style.width=o.width+'px',n.style.height=o.height+'px'),'html'==A.renderer?n.style.backgroundColor=a.bg:(m(g),'exact'==r.textmode&&(n.holderData.resizeUpdate=!0,O.vars.resizableImages.push(n),v(n)))):'background'==t&&'html'!=A.renderer?m(g):'fluid'==t&&(n.holderData.resizeUpdate=!0,'%'==o.height.slice(-1)?n.style.height=o.height:null!=r.auto&&r.auto||(n.style.height=o.height+'px'),'%'==o.width.slice(-1)?n.style.width=o.width:null!=r.auto&&r.auto||(n.style.width=o.width+'px'),'inline'!=n.style.display&&''!==n.style.display&&'none'!=n.style.display||(n.style.display='block'),y(n),'html'==A.renderer?n.style.backgroundColor=a.bg:(O.vars.resizableImages.push(n),v(n)))}function m(t){function n(){var e=null;switch(a.renderer){case'canvas':e=g(l,t);break;case'svg':e=p(l,t);break;default:throw'Holder: invalid renderer: '+a.renderer;}return e}var e=null,r=t.mode,i=t.el,o=t.holderSettings,a=t.engineSettings;switch(a.renderer){case'svg':if(!O.setup.supportsSVG)return;break;case'canvas':if(!O.setup.supportsCanvas)return;break;default:return;}var s={width:o.dimensions.width,height:o.dimensions.height,theme:o.theme,flags:o.flags},l=c(s);if(e=n(),null==e)throw'Holder: couldn\'t render placeholder';'background'==r?(i.style.backgroundImage='url('+e+')',a.noBackgroundSize||(i.style.backgroundSize=s.width+'px '+s.height+'px')):('img'===i.nodeName.toLowerCase()?x.setAttr(i,{src:e}):'object'===i.nodeName.toLowerCase()&&x.setAttr(i,{data:e,type:'image/svg+xml'}),a.reRender&&h.setTimeout(function(){var e=n();if(null==e)throw'Holder: couldn\'t render placeholder';'img'===i.nodeName.toLowerCase()?x.setAttr(i,{src:e}):'object'===i.nodeName.toLowerCase()&&x.setAttr(i,{data:e,type:'image/svg+xml'})},150)),x.setAttr(i,{'data-holder-rendered':!0})}function c(e){function t(e,t,n,r){t.width=n,t.height=r,e.width=Math.max(e.width,t.width),e.height+=t.height}var n=O.defaults.size;switch(parseFloat(e.theme.size)?n=e.theme.size:parseFloat(e.flags.size)&&(n=e.flags.size),e.font={family:e.theme.font?e.theme.font:'Arial, Helvetica, Open Sans, sans-serif',size:C(e.width,e.height,n,O.defaults.scale),units:e.theme.units?e.theme.units:O.defaults.units,weight:e.theme.fontweight?e.theme.fontweight:'bold'},e.text=e.theme.text||Math.floor(e.width)+'x'+Math.floor(e.height),e.noWrap=e.theme.nowrap||e.flags.nowrap,e.align=e.theme.align||e.flags.align||'center',e.flags.textmode){case'literal':e.text=e.flags.dimensions.width+'x'+e.flags.dimensions.height;break;case'exact':if(!e.flags.exactDimensions)break;e.text=Math.floor(e.flags.exactDimensions.width)+'x'+Math.floor(e.flags.exactDimensions.height);}var r=e.flags.lineWrap||O.setup.lineWrapRatio,i=e.width*r,o=i,a=new k({width:e.width,height:e.height}),s=a.Shape,l=new s.Rect('holderBg',{fill:e.theme.bg});if(l.resize(e.width,e.height),a.root.add(l),e.flags.outline){var c=new T(l.properties.fill);c=c.lighten(c.lighterThan('7f7f7f')?-.1:.1),l.properties.outline={fill:c.toHex(!0),width:2}}var u=e.theme.fg;if(e.flags.autoFg){var h=new T(l.properties.fill),d=new T('fff'),f=new T('000',{alpha:.285714});u=h.blendAlpha(h.lighterThan('7f7f7f')?f:d).toHex(!0)}var A=new s.Group('holderTextGroup',{text:e.text,align:e.align,font:e.font,fill:u});A.moveTo(null,null,1),a.root.add(A);var p=A.textPositionData=M(a);if(!p)throw'Holder: staging fallback not supported yet.';A.properties.leading=p.boundingBox.height;var g=null,m=null;if(p.lineCount>1){var v,y=0,b=0,w=0;m=new s.Group('line'+w),'left'!==e.align&&'right'!==e.align||(o=e.width*(1-2*(1-r)));for(var x=0;x<p.words.length;x++){var E=p.words[x];g=new s.Text(E.text);var S='\\n'==E.text;!e.noWrap&&(y+E.width>=o||S===!0)&&(t(A,m,y,A.properties.leading),A.add(m),y=0,b+=A.properties.leading,w+=1,m=new s.Group('line'+w),m.y=b),S!==!0&&(g.moveTo(y,0),y+=p.spaceWidth+E.width,m.add(g))}if(t(A,m,y,A.properties.leading),A.add(m),'left'===e.align)A.moveTo(e.width-i,null,null);else if('right'===e.align){for(v in A.children)m=A.children[v],m.moveTo(e.width-m.width,null,null);A.moveTo(0-(e.width-i),null,null)}else{for(v in A.children)m=A.children[v],m.moveTo((A.width-m.width)/2,null,null);A.moveTo((e.width-A.width)/2,null,null)}A.moveTo(null,(e.height-A.height)/2,null),(e.height-A.height)/2<0&&A.moveTo(null,0,null)}else g=new s.Text(e.text),m=new s.Group('line0'),m.add(g),A.add(m),'left'===e.align?A.moveTo(e.width-i,null,null):'right'===e.align?A.moveTo(0-(e.width-i),null,null):A.moveTo((e.width-p.boundingBox.width)/2,null,null),A.moveTo(null,(e.height-p.boundingBox.height)/2,null);return a}function C(e,t,n,r){var i=parseInt(e,10),o=parseInt(t,10),a=Math.max(i,o),s=Math.min(i,o),l=.8*Math.min(s,a*r);return Math.round(Math.max(n,l))}function v(e){var t;t=null==e||null==e.nodeType?O.vars.resizableImages:[e];for(var n=0,r=t.length;n<r;n++){var i=t[n];if(i.holderData){var o=i.holderData.flags,a=S(i);if(a){if(!i.holderData.resizeUpdate)continue;if(o.fluid&&o.auto){var s=i.holderData.fluidConfig;switch(s.mode){case'width':a.height=a.width/s.ratio;break;case'height':a.width=a.height*s.ratio;}}var l={mode:'image',holderSettings:{dimensions:a,theme:o.theme,flags:o},el:i,engineSettings:i.holderData.engineSettings};'exact'==o.textmode&&(o.exactDimensions=a,l.holderSettings.dimensions=o.dimensions),m(l)}else u(i)}}}function y(e){if(e.holderData){var t=S(e);if(t){var n=e.holderData.flags,r={fluidHeight:'%'==n.dimensions.height.slice(-1),fluidWidth:'%'==n.dimensions.width.slice(-1),mode:null,initialDimensions:t};r.fluidWidth&&!r.fluidHeight?(r.mode='width',r.ratio=r.initialDimensions.width/parseFloat(n.dimensions.height)):!r.fluidWidth&&r.fluidHeight&&(r.mode='height',r.ratio=parseFloat(n.dimensions.width)/r.initialDimensions.height),e.holderData.fluidConfig=r}else u(e)}}function r(){var t,n=[],e=Object.keys(O.vars.invisibleImages);e.forEach(function(e){t=O.vars.invisibleImages[e],S(t)&&'img'==t.nodeName.toLowerCase()&&(n.push(t),delete O.vars.invisibleImages[e])}),n.length&&s.run({images:n}),setTimeout(function(){h.requestAnimationFrame(r)},10)}function e(){O.vars.visibilityCheckStarted||(h.requestAnimationFrame(r),O.vars.visibilityCheckStarted=!0)}function u(e){e.holderData.invisibleId||(O.vars.invisibleId+=1,O.vars.invisibleImages['i'+O.vars.invisibleId]=e,e.holderData.invisibleId=O.vars.invisibleId)}function t(e){O.vars.debounceTimer||e.call(this),O.vars.debounceTimer&&h.clearTimeout(O.vars.debounceTimer),O.vars.debounceTimer=h.setTimeout(function(){O.vars.debounceTimer=null,e.call(this)},O.setup.debounce)}function n(){t(function(){v(null)})}var i=F(2),A=F(3),k=F(6),b=F(7),w=F(8),x=F(9),T=F(10),a=F(11),p=F(12),g=F(15),E=b.extend,S=b.dimensionCheck,j=a.svg_ns,s={version:a.version,addTheme:function(e,t){return null!=e&&null!=t&&(O.settings.themes[e]=t),delete O.vars.cache.themeKeys,this},addImage:function(r,e){var t=x.getNodeArray(e);return t.forEach(function(e){var t=x.newEl('img'),n={};n[O.setup.dataAttr]=r,x.setAttr(t,n),e.appendChild(t)}),this},setResizeUpdate:function(e,t){e.holderData&&(e.holderData.resizeUpdate=!!t,e.holderData.resizeUpdate&&v(e))},run:function(e){e=e||{};var c={},u=E(O.settings,e);O.vars.preempted=!0,O.vars.dataAttr=u.dataAttr||O.setup.dataAttr,c.renderer=u.renderer?u.renderer:O.setup.renderer,O.setup.renderers.join(',').indexOf(c.renderer)===-1&&(c.renderer=O.setup.supportsSVG?'svg':O.setup.supportsCanvas?'canvas':'html');var t=x.getNodeArray(u.images),n=x.getNodeArray(u.bgnodes),r=x.getNodeArray(u.stylenodes),i=x.getNodeArray(u.objects);return c.stylesheets=[],c.svgXMLStylesheet=!0,c.noFontFallback=!!u.noFontFallback,c.noBackgroundSize=!!u.noBackgroundSize,r.forEach(function(e){if(e.attributes.rel&&e.attributes.href&&'stylesheet'==e.attributes.rel.value){var t=e.attributes.href.value,n=x.newEl('a');n.href=t;var r=n.protocol+'//'+n.host+n.pathname+n.search;c.stylesheets.push(r)}}),n.forEach(function(e){if(h.getComputedStyle){var t=h.getComputedStyle(e,null).getPropertyValue('background-image'),n=e.getAttribute('data-background-src'),r=n||t,i=null,o=u.domain+'/',a=r.indexOf(o);if(0===a)i=r;else if(1===a&&'?'===r[0])i=r.slice(1);else{var s=r.substr(a).match(/([^\"]*)"?\)/);if(null!==s)i=s[1];else if(0===r.indexOf('url('))throw'Holder: unable to parse background URL: '+r}if(i){var l=d(i,u);l&&f({mode:'background',el:e,flags:l,engineSettings:c})}}}),i.forEach(function(e){var t={};try{t.data=e.getAttribute('data'),t.dataSrc=e.getAttribute(O.vars.dataAttr)}catch(e){}var n=null!=t.data&&0===t.data.indexOf(u.domain),r=null!=t.dataSrc&&0===t.dataSrc.indexOf(u.domain);n?o(u,c,t.data,e):r&&o(u,c,t.dataSrc,e)}),t.forEach(function(e){var t={};try{t.src=e.getAttribute('src'),t.dataSrc=e.getAttribute(O.vars.dataAttr),t.rendered=e.getAttribute('data-holder-rendered')}catch(e){}var n=null!=t.src,r=null!=t.dataSrc&&0===t.dataSrc.indexOf(u.domain),i=null!=t.rendered&&'true'==t.rendered;n?0===t.src.indexOf(u.domain)?o(u,c,t.src,e):r&&(i?o(u,c,t.dataSrc,e):!function(e,t,n,r,i){b.imageExists(e,function(e){e||o(t,n,r,i)})}(t.src,u,c,t.dataSrc,e)):r&&o(u,c,t.dataSrc,e)}),this}},O={settings:{domain:'holder.js',images:'img',objects:'object',bgnodes:'body .holderjs',stylenodes:'head link.holderjs',themes:{gray:{bg:'#EEEEEE',fg:'#AAAAAA'},social:{bg:'#3a5a97',fg:'#FFFFFF'},industrial:{bg:'#434A52',fg:'#C2F200'},sky:{bg:'#0D8FDB',fg:'#FFFFFF'},vine:{bg:'#39DBAC',fg:'#1E292C'},lava:{bg:'#F8591A',fg:'#1C2846'}}},defaults:{size:10,units:'pt',scale:1/16}},M=function(){var g=null,m=null,v=null;return function(e){var t=e.root;if(O.setup.supportsSVG){var n=!1,r=function(e){return document.createTextNode(e)};null!=g&&g.parentNode===document.body||(n=!0),g=w.initSVG(g,t.properties.width,t.properties.height),g.style.display='block',n&&(m=x.newEl('text',j),v=r(null),x.setAttr(m,{x:0}),m.appendChild(v),g.appendChild(m),document.body.appendChild(g),g.style.visibility='hidden',g.style.position='absolute',g.style.top='-100%',g.style.left='-100%');var i=t.children.holderTextGroup,o=i.properties;x.setAttr(m,{y:o.font.size,style:b.cssProps({'font-weight':o.font.weight,'font-size':o.font.size+o.font.units,'font-family':o.font.family})}),v.nodeValue=o.text;var a=m.getBBox(),s=Math.ceil(a.width/t.properties.width),l=o.text.split(' '),c=o.text.match(/\\n/g);s+=null==c?0:c.length,v.nodeValue=o.text.replace(/[ ]+/g,'');var u=m.getComputedTextLength(),h=a.width-u,d=Math.round(h/Math.max(1,l.length-1)),f=[];if(s>1){v.nodeValue='';for(var A=0;A<l.length;A++)if(0!==l[A].length){v.nodeValue=b.decodeHtmlEntity(l[A]);var p=m.getBBox();f.push({text:l[A],width:p.width})}}return g.style.display='none',{spaceWidth:d,lineCount:s,boundingBox:a,words:f}}return!1}}();for(var l in O.flags)O.flags.hasOwnProperty(l)&&(O.flags[l].match=function(e){return e.match(this.regex)});O.setup={renderer:'html',debounce:100,ratio:1,supportsCanvas:!1,supportsSVG:!1,lineWrapRatio:.9,dataAttr:'data-src',renderers:['html','canvas','svg']},O.vars={preempted:!1,resizableImages:[],invisibleImages:{},invisibleId:0,visibilityCheckStarted:!1,debounceTimer:null,cache:{}},function(){var e=x.newEl('canvas');e.getContext&&e.toDataURL('image/png').indexOf('data:image/png')!=-1&&(O.setup.renderer='canvas',O.setup.supportsCanvas=!0),document.createElementNS&&document.createElementNS(j,'svg').createSVGRect&&(O.setup.renderer='svg',O.setup.supportsSVG=!0)}(),e(),i&&i(function(){O.vars.preempted||s.run(),h.addEventListener?(h.addEventListener('resize',n,!1),h.addEventListener('orientationchange',n,!1)):h.attachEvent('onresize',n),'object'==typeof h.Turbolinks&&h.document.addEventListener('page:change',function(){s.run()})}),L.exports=s}).call(e,function(){return this}())},function(e,t){function n(e){function n(e){if(!w){if(!a.body)return i(n);for(w=!0;e=x.shift();)i(e)}}function t(e){(y||e.type===l||a[d]===h)&&(r(),n())}function r(){y?(a[v](g,t,c),e[v](l,t,c)):(a[A](m,t),e[A](u,t))}function i(e,t){setTimeout(e,+t>=0?t:1)}function o(e){w?i(e):x.push(e)}null==document.readyState&&document.addEventListener&&(document.addEventListener('DOMContentLoaded',function e(){document.removeEventListener('DOMContentLoaded',e,!1),document.readyState='complete'},!1),document.readyState='loading');var a=e.document,s=a.documentElement,l='load',c=!1,u='on'+l,h='complete',d='readyState',f='attachEvent',A='detachEvent',p='addEventListener',g='DOMContentLoaded',m='onreadystatechange',v='removeEventListener',y=p in a,b=c,w=c,x=[];if(a[d]===h)i(n);else if(y)a[p](g,t,c),e[p](l,t,c);else{a[f](m,t),e[f](u,t);try{b=null==e.frameElement&&s}catch(e){}b&&b.doScroll&&!function t(){if(!w){try{b.doScroll('left')}catch(e){return i(t,50)}r(),n()}}()}return o.version='1.4.0',o.isReady=function(){return w},o}e.exports='undefined'!=typeof window&&n(window)},function(e,t,n){var o=encodeURIComponent,c=decodeURIComponent,u=n(4),a=n(5),h=/(\w+)\[(\d+)\]/,d=/\w+\.\w+/;t.parse=function(e){if('string'!=typeof e)return{};if(e=u(e),''===e)return{};'?'===e.charAt(0)&&(e=e.slice(1));for(var t={},n=e.split('&'),r=0;r<n.length;r++){var i,o,a,s=n[r].split('='),l=c(s[0]);if(i=h.exec(l))t[i[1]]=t[i[1]]||[],t[i[1]][i[2]]=c(s[1]);else if(i=d.test(l)){for(i=l.split('.'),o=t;i.length;)if(a=i.shift(),a.length){if(o[a]){if(o[a]&&'object'!=typeof o[a])break}else o[a]={};i.length||(o[a]=c(s[1])),o=o[a]}}else t[s[0]]=null==s[1]?'':c(s[1])}return t},t.stringify=function(e){if(!e)return'';var t=[];for(var n in e){var r=e[n];if('array'!=a(r))t.push(o(n)+'='+o(e[n]));else for(var i=0;i<r.length;++i)t.push(o(n+'['+i+']')+'='+o(r[i]))}return t.join('&')}},function(e,t){function n(e){return e.replace(/^\s*|\s*$/g,'')}t=e.exports=n,t.left=function(e){return e.replace(/^\s*/,'')},t.right=function(e){return e.replace(/\s*$/,'')}},function(e,t){function n(e){return!(null==e||!(e._isBuffer||e.constructor&&'function'==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)))}var r=Object.prototype.toString;e.exports=function(e){switch(r.call(e)){case'[object Date]':return'date';case'[object RegExp]':return'regexp';case'[object Arguments]':return'arguments';case'[object Array]':return'array';case'[object Error]':return'error';}return null===e?'null':void 0===e?'undefined':e!==e?'nan':e&&1===e.nodeType?'element':n(e)?'buffer':(e=e.valueOf?e.valueOf():Object.prototype.valueOf.apply(e),typeof e)}},function(e,t){var n=function(e){function n(e,t){for(var n in t)e[n]=t[n];return e}var t=1,r=function(e){t++,this.parent=null,this.children={},this.id=t,this.name='n'+t,'undefined'!=typeof e&&(this.name=e),this.x=this.y=this.z=0,this.width=this.height=0};r.prototype.resize=function(e,t){null!=e&&(this.width=e),null!=t&&(this.height=t)},r.prototype.moveTo=function(e,t,n){this.x=null!=e?e:this.x,this.y=null!=t?t:this.y,this.z=null!=n?n:this.z},r.prototype.add=function(e){var t=e.name;if('undefined'!=typeof this.children[t])throw'SceneGraph: child already exists: '+t;this.children[t]=e,e.parent=this};var i=function(){r.call(this,'root'),this.properties=e};i.prototype=new r;var o=function(e,t){if(r.call(this,e),this.properties={fill:'#000000'},'undefined'!=typeof t)n(this.properties,t);else if('undefined'!=typeof e&&'string'!=typeof e)throw'SceneGraph: invalid node name'};o.prototype=new r;var a=function(){o.apply(this,arguments),this.type='group'};a.prototype=new o;var s=function(){o.apply(this,arguments),this.type='rect'};s.prototype=new o;var l=function(e){o.call(this),this.type='text',this.properties.text=e};l.prototype=new o;var c=new i;return this.Shape={Rect:s,Text:l,Group:a},this.root=c,this};e.exports=n},function(e,t){(function(i){t.extend=function(e,t){var n={};for(var r in e)e.hasOwnProperty(r)&&(n[r]=e[r]);if(null!=t)for(var i in t)t.hasOwnProperty(i)&&(n[i]=t[i]);return n},t.cssProps=function(e){var t=[];for(var n in e)e.hasOwnProperty(n)&&t.push(n+':'+e[n]);return t.join(';')},t.encodeHtmlEntity=function(e){for(var t=[],n=0,r=e.length-1;r>=0;r--)n=e.charCodeAt(r),n>128?t.unshift(['&#',n,';'].join('')):t.unshift(e[r]);return t.join('')},t.imageExists=function(e,t){var n=new Image;n.onerror=function(){t.call(this,!1)},n.onload=function(){t.call(this,!0)},n.src=e},t.decodeHtmlEntity=function(e){return e.replace(/&#(\d+);/g,function(e,t){return String.fromCharCode(t)})},t.dimensionCheck=function(e){var t={height:e.clientHeight,width:e.clientWidth};return!(!t.height||!t.width)&&t},t.truthy=function(e){return'string'==typeof e?'true'===e||'yes'===e||'1'===e||'on'===e||'\u2713'===e:!!e},t.parseColor=function(e){var t,n=/(^(?:#?)[0-9a-f]{6}$)|(^(?:#?)[0-9a-f]{3}$)/i,r=/^rgb\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,i=/^rgba\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0\.\d{1,}|1)\)$/,o=e.match(n);return null!==o?(t=o[1]||o[2],'#'!==t[0]?'#'+t:t):(o=e.match(r),null!==o?t='rgb('+o.slice(1).join(',')+')':(o=e.match(i),null!==o?t='rgba('+o.slice(1).join(',')+')':null))},t.canvasRatio=function(){var e=1,t=1;if(i.document){var n=i.document.createElement('canvas');if(n.getContext){var r=n.getContext('2d');e=i.devicePixelRatio||1,t=r.webkitBackingStorePixelRatio||r.mozBackingStorePixelRatio||r.msBackingStorePixelRatio||r.oBackingStorePixelRatio||r.backingStorePixelRatio||1}}return e/t}}).call(t,function(){return this}())},function(e,t,n){(function(c){var u=n(9),s='http://www.w3.org/2000/svg',l=8;t.initSVG=function(e,t,n){var r,i,o=!1;e&&e.querySelector?(i=e.querySelector('style'),null===i&&(o=!0)):(e=u.newEl('svg',s),o=!0),o&&(r=u.newEl('defs',s),i=u.newEl('style',s),u.setAttr(i,{type:'text/css'}),r.appendChild(i),e.appendChild(r)),e.webkitMatchesSelector&&e.setAttribute('xmlns',s);for(var a=0;a<e.childNodes.length;a++)e.childNodes[a].nodeType===l&&e.removeChild(e.childNodes[a]);for(;i.childNodes.length;)i.removeChild(i.childNodes[0]);return u.setAttr(e,{width:t,height:n,viewBox:'0 0 '+t+' '+n,preserveAspectRatio:'none'}),e},t.svgStringToDataURI=function(){var n='data:image/svg+xml;charset=UTF-8,',r='data:image/svg+xml;charset=UTF-8;base64,';return function(e,t){return t?r+btoa(c.unescape(encodeURIComponent(e))):n+encodeURIComponent(e)}}(),t.serializeSVG=function(e,t){if(c.XMLSerializer){var n=new XMLSerializer,r='',i=t.stylesheets;if(t.svgXMLStylesheet){for(var o=u.createXML(),a=i.length-1;a>=0;a--){var s=o.createProcessingInstruction('xml-stylesheet','href="'+i[a]+'" rel="stylesheet"');o.insertBefore(s,o.firstChild)}o.removeChild(o.documentElement),r=n.serializeToString(o)}var l=n.serializeToString(e);return l=l.replace(/\&amp;(\#[0-9]{2,}\;)/g,'&$1'),r+l}}}).call(t,function(){return this}())},function(e,t){(function(n){t.newEl=function(e,t){if(n.document)return null==t?n.document.createElement(e):n.document.createElementNS(t,e)},t.setAttr=function(e,t){for(var n in t)e.setAttribute(n,t[n])},t.createXML=function(){if(n.DOMParser)return new DOMParser().parseFromString('<xml />','application/xml')},t.getNodeArray=function(e){var t=null;return'string'==typeof e?t=document.querySelectorAll(e):n.NodeList&&e instanceof n.NodeList?t=e:n.Node&&e instanceof n.Node?t=[e]:n.HTMLCollection&&e instanceof n.HTMLCollection?t=e:e instanceof Array?t=e:null===e&&(t=[]),t=Array.prototype.slice.call(t)}}).call(t,function(){return this}())},function(e,t){var s=function(e,t){'string'==typeof e&&(this.original=e,'#'===e.charAt(0)&&(e=e.slice(1)),/[^a-f0-9]+/i.test(e)||(3===e.length&&(e=e.replace(/./g,'$&$&')),6===e.length&&(this.alpha=1,t&&t.alpha&&(this.alpha=t.alpha),this.set(parseInt(e,16)))))};s.rgb2hex=function(e,t,n){function r(e){var t=(0|e).toString(16);return e<16&&(t='0'+t),t}return[e,t,n].map(r).join('')},s.hsl2rgb=function(e,t,n){var r=e/60,i=(1-Math.abs(2*n-1))*t,o=i*(1-Math.abs(parseInt(r)%2-1)),a=n-i/2,s=0,l=0,c=0;return r>=0&&r<1?(s=i,l=o):r>=1&&r<2?(s=o,l=i):r>=2&&r<3?(l=i,c=o):r>=3&&r<4?(l=o,c=i):r>=4&&r<5?(s=o,c=i):r>=5&&r<6&&(s=i,c=o),s+=a,l+=a,c+=a,s=parseInt(255*s),l=parseInt(255*l),c=parseInt(255*c),[s,l,c]},s.prototype.set=function(e){this.raw=e;var t=(16711680&this.raw)>>16,n=(65280&this.raw)>>8,r=255&this.raw,i=.2126*t+.7152*n+.0722*r,o=-.09991*t-.33609*n+.436*r,a=.615*t-.55861*n-.05639*r;return this.rgb={r:t,g:n,b:r},this.yuv={y:i,u:o,v:a},this},s.prototype.lighten=function(e){var t=Math.min(1,Math.max(0,Math.abs(e)))*(e<0?-1:1),n=255*t|0,r=Math.min(255,Math.max(0,this.rgb.r+n)),i=Math.min(255,Math.max(0,this.rgb.g+n)),o=Math.min(255,Math.max(0,this.rgb.b+n)),a=s.rgb2hex(r,i,o);return new s(a)},s.prototype.toHex=function(e){return(e?'#':'')+this.raw.toString(16)},s.prototype.lighterThan=function(e){return e instanceof s||(e=new s(e)),this.yuv.y>e.yuv.y},s.prototype.blendAlpha=function(e){e instanceof s||(e=new s(e));var t=e,n=this,r=t.alpha*t.rgb.r+(1-t.alpha)*n.rgb.r,i=t.alpha*t.rgb.g+(1-t.alpha)*n.rgb.g,o=t.alpha*t.rgb.b+(1-t.alpha)*n.rgb.b;return new s(s.rgb2hex(r,i,o))},e.exports=s},function(e,t){e.exports={version:'2.9.4',svg_ns:'http://www.w3.org/2000/svg'}},function(e,t,n){function w(e,t){return T.element({tag:t,width:e.width,height:e.height,fill:e.properties.fill})}function x(e){return i.cssProps({fill:e.fill,'font-weight':e.font.weight,'font-family':e.font.family+', monospace','font-size':e.font.size+e.font.units})}function E(e,t,n){var r=n/2;return['M',r,r,'H',e-r,'V',t-r,'H',r,'V',0,'M',0,r,'L',e,t-r,'M',0,t-r,'L',e,r].join(' ')}var S=n(13),C=n(8),r=n(11),i=n(7),k=r.svg_ns,T={element:function(e){var t=e.tag,n=e.content||'';return delete e.tag,delete e.content,[t,n,e]}};e.exports=function(e,t){var n=t.engineSettings,r=n.stylesheets,i=r.map(function(e){return'<?xml-stylesheet rel="stylesheet" href="'+e+'"?>'}).join('\n'),o='holder_'+Number(new Date).toString(16),a=e.root,s=a.children.holderTextGroup,l='#'+o+' text { '+x(s.properties)+' } ';s.y+=.8*s.textPositionData.boundingBox.height;var c=[];Object.keys(s.children).forEach(function(e){var o=s.children[e];Object.keys(o.children).forEach(function(e){var t=o.children[e],n=s.x+o.x+t.x,r=s.y+o.y+t.y,i=T.element({tag:'text',content:t.properties.text,x:n,y:r});c.push(i)})});var u=T.element({tag:'g',content:c}),h=null;if(a.children.holderBg.properties.outline){var d=a.children.holderBg.properties.outline;h=T.element({tag:'path',d:E(a.children.holderBg.width,a.children.holderBg.height,d.width),'stroke-width':d.width,stroke:d.fill,fill:'none'})}var f=w(a.children.holderBg,'rect'),A=[];A.push(f),d&&A.push(h),A.push(u);var p=T.element({tag:'g',id:o,content:A}),g=T.element({tag:'style',content:l,type:'text/css'}),m=T.element({tag:'defs',content:g}),v=T.element({tag:'svg',content:[m,p],width:a.properties.width,height:a.properties.height,xmlns:k,viewBox:[0,0,a.properties.width,a.properties.height].join(' '),preserveAspectRatio:'none'}),y=S(v);y=i+y[0];var b=C.svgStringToDataURI(y,'background'===t.mode);return b}},function(e,t,n){n(14);e.exports=function e(t,n,a){'use strict';function r(e){var t=e.match(/^[\w-]+/),n={tag:t?t[0]:'div',attr:{},children:[]},r=e.match(/#([\w-]+)/),i=e.match(/\$([\w-]+)/),o=e.match(/\.[\w-]+/g);return r&&(n.attr.id=r[1],a[r[1]]=n),i&&(a[i[1]]=n),o&&(n.attr['class']=o.join(' ').replace(/\./g,'')),e.match(/&$/g)&&(f=!1),n}function i(e,t){if(null!==t&&t!==!1&&void 0!==t)return'string'!=typeof t&&'object'!=typeof t?String(t):t}function o(e){return e||0===e?String(e).replace(/&/g,'&amp;').replace(/"/g,'&quot;'):''}function s(e){return String(e).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&apos;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}var l,c,u,h,d=1,f=!0;if(a=a||{},'string'==typeof t[0])t[0]=r(t[0]);else{if(!Array.isArray(t[0]))throw new Error('First element of array must be a string, or an array and not '+JSON.stringify(t[0]));d=0}for(;d<t.length;d++){if(t[d]===!1||null===t[d]){t[0]=!1;break}if(void 0!==t[d]&&t[d]!==!0)if('string'==typeof t[d])f&&(t[d]=s(t[d])),t[0].children.push(t[d]);else if('number'==typeof t[d])t[0].children.push(t[d]);else if(Array.isArray(t[d])){if(Array.isArray(t[d][0])){if(t[d].reverse().forEach(function(e){t.splice(d+1,0,e)}),0!==d)continue;d++}e(t[d],n,a),t[d][0]&&t[0].children.push(t[d][0])}else if('function'==typeof t[d])u=t[d];else{if('object'!=typeof t[d])throw new TypeError('"'+t[d]+'" is not allowed as a value.');for(c in t[d])t[d].hasOwnProperty(c)&&null!==t[d][c]&&t[d][c]!==!1&&('style'===c&&'object'==typeof t[d][c]?t[0].attr[c]=JSON.stringify(t[d][c],i).slice(2,-2).replace(/","/g,';').replace(/":"/g,':').replace(/\\"/g,'\''):t[0].attr[c]=t[d][c])}}if(t[0]!==!1){l='<'+t[0].tag;for(h in t[0].attr)t[0].attr.hasOwnProperty(h)&&(l+=' '+h+'="'+o(t[0].attr[h])+'"');l+='>',t[0].children.forEach(function(e){l+=e}),l+='</'+t[0].tag+'>',t[0]=l}return a[0]=t[0],u&&u(t[0]),a}},function(e,t){'use strict';function n(e){var t=''+e,n=s.exec(t);if(!n)return t;var r,i='',o=0,a=0;for(o=n.index;o<t.length;o++){switch(t.charCodeAt(o)){case 34:r='&quot;';break;case 38:r='&amp;';break;case 39:r='&#39;';break;case 60:r='&lt;';break;case 62:r='&gt;';break;default:continue;}a!==o&&(i+=t.substring(a,o)),a=o+1,i+=r}return a!==o?i+t.substring(a,o):i}var s=/["'&<>]/;e.exports=n},function(e,t,n){var r=n(9),m=n(7);e.exports=function(){var p=r.newEl('canvas'),g=null;return function(e){null==g&&(g=p.getContext('2d'));var t=m.canvasRatio(),n=e.root;p.width=t*n.properties.width,p.height=t*n.properties.height,g.textBaseline='middle';var r=n.children.holderBg,i=t*r.width,o=t*r.height,a=2,s=a/2;g.fillStyle=r.properties.fill,g.fillRect(0,0,i,o),r.properties.outline&&(g.strokeStyle=r.properties.outline.fill,g.lineWidth=r.properties.outline.width,g.moveTo(s,s),g.lineTo(i-s,s),g.lineTo(i-s,o-s),g.lineTo(s,o-s),g.lineTo(s,s),g.moveTo(0,s),g.lineTo(i,o-s),g.moveTo(0,o-s),g.lineTo(i,s),g.stroke());var l=n.children.holderTextGroup;g.font=l.properties.font.weight+' '+t*l.properties.font.size+l.properties.font.units+' '+l.properties.font.family+', monospace',g.fillStyle=l.properties.fill;for(var c in l.children){var u=l.children[c];for(var h in u.children){var d=u.children[h],f=t*(l.x+u.x+d.x),A=t*(l.y+u.y+d.y+l.properties.leading/2);g.fillText(d.properties.text,f,A)}}return p.toDataURL('image/png')}}()}])}),function(e,t){t&&(Holder=e.Holder)}(this,'undefined'!=typeof Meteor&&'undefined'!=typeof Package);//slick
//Slick version 1.8.1
/*
    _ _      _       _
___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                  |__/

Version: 1.8.0
 Author: Ken Wheeler
Website: http://kenwheeler.github.io
   Docs: http://kenwheeler.github.io/slick
   Repo: http://github.com/kenwheeler/slick
 Issues: http://github.com/kenwheeler/slick/issues

*//* global window, document, define, jQuery, setInterval, clearInterval */;(function(factory){'use strict';if(typeof define==='function'&&define.amd){define(['jquery'],factory)}else if(typeof exports!=='undefined'){module.exports=factory(require('jquery'))}else{factory(jQuery)}})(function($){'use strict';var Slick=window.Slick||{};Slick=function(){var instanceUid=0;function Slick(element,settings){var _=this,dataSettings;_.defaults={accessibility:true,adaptiveHeight:false,appendArrows:$(element),appendDots:$(element),arrows:true,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:false,autoplaySpeed:3000,centerMode:false,centerPadding:'50px',cssEase:'ease',customPaging:function(slider,i){return $('<button type="button" />').text(i+1)},dots:false,dotsClass:'slick-dots',draggable:true,easing:'linear',edgeFriction:0.35,fade:false,focusOnSelect:false,focusOnChange:false,infinite:true,initialSlide:0,lazyLoad:'ondemand',mobileFirst:false,pauseOnHover:true,pauseOnFocus:true,pauseOnDotsHover:false,respondTo:'window',responsive:null,rows:1,rtl:false,slide:'',slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:true,swipeToSlide:false,touchMove:true,touchThreshold:5,useCSS:true,useTransform:true,variableWidth:false,vertical:false,verticalSwiping:false,waitForAnimate:true,zIndex:1000};_.initials={animating:false,dragging:false,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:false,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:false,slideOffset:0,swipeLeft:null,swiping:false,$list:null,touchObject:{},transformsEnabled:false,unslicked:false};$.extend(_,_.initials);_.activeBreakpoint=null;_.animType=null;_.animProp=null;_.breakpoints=[];_.breakpointSettings=[];_.cssTransitions=false;_.focussed=false;_.interrupted=false;_.hidden='hidden';_.paused=true;_.positionProp=null;_.respondTo=null;_.rowCount=1;_.shouldClick=true;_.$slider=$(element);_.$slidesCache=null;_.transformType=null;_.transitionType=null;_.visibilityChange='visibilitychange';_.windowWidth=0;_.windowTimer=null;dataSettings=$(element).data('slick')||{};_.options=$.extend({},_.defaults,settings,dataSettings);_.currentSlide=_.options.initialSlide;_.originalSettings=_.options;if(typeof document.mozHidden!=='undefined'){_.hidden='mozHidden';_.visibilityChange='mozvisibilitychange'}else if(typeof document.webkitHidden!=='undefined'){_.hidden='webkitHidden';_.visibilityChange='webkitvisibilitychange'}_.autoPlay=$.proxy(_.autoPlay,_);_.autoPlayClear=$.proxy(_.autoPlayClear,_);_.autoPlayIterator=$.proxy(_.autoPlayIterator,_);_.changeSlide=$.proxy(_.changeSlide,_);_.clickHandler=$.proxy(_.clickHandler,_);_.selectHandler=$.proxy(_.selectHandler,_);_.setPosition=$.proxy(_.setPosition,_);_.swipeHandler=$.proxy(_.swipeHandler,_);_.dragHandler=$.proxy(_.dragHandler,_);_.keyHandler=$.proxy(_.keyHandler,_);_.instanceUid=instanceUid++;// A simple way to check for HTML strings
// Strict HTML recognition (must start with <)
// Extracted from jQuery v1.11 source
_.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/;_.registerBreakpoints();_.init(true)}return Slick}();Slick.prototype.activateADA=function(){var _=this;_.$slideTrack.find('.slick-active').attr({'aria-hidden':'false'}).find('a, input, button, select').attr({'tabindex':'0'})};Slick.prototype.addSlide=Slick.prototype.slickAdd=function(markup,index,addBefore){var _=this;if(typeof index==='boolean'){addBefore=index;index=null}else if(index<0||index>=_.slideCount){return false}_.unload();if(typeof index==='number'){if(index===0&&_.$slides.length===0){$(markup).appendTo(_.$slideTrack)}else if(addBefore){$(markup).insertBefore(_.$slides.eq(index))}else{$(markup).insertAfter(_.$slides.eq(index))}}else{if(addBefore===true){$(markup).prependTo(_.$slideTrack)}else{$(markup).appendTo(_.$slideTrack)}}_.$slides=_.$slideTrack.children(this.options.slide);_.$slideTrack.children(this.options.slide).detach();_.$slideTrack.append(_.$slides);_.$slides.each(function(index,element){$(element).attr('data-slick-index',index)});_.$slidesCache=_.$slides;_.reinit()};Slick.prototype.animateHeight=function(){var _=this;if(_.options.slidesToShow===1&&_.options.adaptiveHeight===true&&_.options.vertical===false){var targetHeight=_.$slides.eq(_.currentSlide).outerHeight(true);_.$list.animate({height:targetHeight},_.options.speed)}};Slick.prototype.animateSlide=function(targetLeft,callback){var animProps={},_=this;_.animateHeight();if(_.options.rtl===true&&_.options.vertical===false){targetLeft=-targetLeft}if(_.transformsEnabled===false){if(_.options.vertical===false){_.$slideTrack.animate({left:targetLeft},_.options.speed,_.options.easing,callback)}else{_.$slideTrack.animate({top:targetLeft},_.options.speed,_.options.easing,callback)}}else{if(_.cssTransitions===false){if(_.options.rtl===true){_.currentLeft=-_.currentLeft}$({animStart:_.currentLeft}).animate({animStart:targetLeft},{duration:_.options.speed,easing:_.options.easing,step:function(now){now=Math.ceil(now);if(_.options.vertical===false){animProps[_.animType]='translate('+now+'px, 0px)';_.$slideTrack.css(animProps)}else{animProps[_.animType]='translate(0px,'+now+'px)';_.$slideTrack.css(animProps)}},complete:function(){if(callback){callback.call()}}})}else{_.applyTransition();targetLeft=Math.ceil(targetLeft);if(_.options.vertical===false){animProps[_.animType]='translate3d('+targetLeft+'px, 0px, 0px)'}else{animProps[_.animType]='translate3d(0px,'+targetLeft+'px, 0px)'}_.$slideTrack.css(animProps);if(callback){setTimeout(function(){_.disableTransition();callback.call()},_.options.speed)}}}};Slick.prototype.getNavTarget=function(){var _=this,asNavFor=_.options.asNavFor;if(asNavFor&&asNavFor!==null){asNavFor=$(asNavFor).not(_.$slider)}return asNavFor};Slick.prototype.asNavFor=function(index){var _=this,asNavFor=_.getNavTarget();if(asNavFor!==null&&typeof asNavFor==='object'){asNavFor.each(function(){var target=$(this).slick('getSlick');if(!target.unslicked){target.slideHandler(index,true)}})}};Slick.prototype.applyTransition=function(slide){var _=this,transition={};if(_.options.fade===false){transition[_.transitionType]=_.transformType+' '+_.options.speed+'ms '+_.options.cssEase}else{transition[_.transitionType]='opacity '+_.options.speed+'ms '+_.options.cssEase}if(_.options.fade===false){_.$slideTrack.css(transition)}else{_.$slides.eq(slide).css(transition)}};Slick.prototype.autoPlay=function(){var _=this;_.autoPlayClear();if(_.slideCount>_.options.slidesToShow){_.autoPlayTimer=setInterval(_.autoPlayIterator,_.options.autoplaySpeed)}};Slick.prototype.autoPlayClear=function(){var _=this;if(_.autoPlayTimer){clearInterval(_.autoPlayTimer)}};Slick.prototype.autoPlayIterator=function(){var _=this,slideTo=_.currentSlide+_.options.slidesToScroll;if(!_.paused&&!_.interrupted&&!_.focussed){if(_.options.infinite===false){if(_.direction===1&&_.currentSlide+1===_.slideCount-1){_.direction=0}else if(_.direction===0){slideTo=_.currentSlide-_.options.slidesToScroll;if(_.currentSlide-1===0){_.direction=1}}}_.slideHandler(slideTo)}};Slick.prototype.buildArrows=function(){var _=this;if(_.options.arrows===true){_.$prevArrow=$(_.options.prevArrow).addClass('slick-arrow');_.$nextArrow=$(_.options.nextArrow).addClass('slick-arrow');if(_.slideCount>_.options.slidesToShow){_.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');_.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');if(_.htmlExpr.test(_.options.prevArrow)){_.$prevArrow.prependTo(_.options.appendArrows)}if(_.htmlExpr.test(_.options.nextArrow)){_.$nextArrow.appendTo(_.options.appendArrows)}if(_.options.infinite!==true){_.$prevArrow.addClass('slick-disabled').attr('aria-disabled','true')}}else{_.$prevArrow.add(_.$nextArrow).addClass('slick-hidden').attr({'aria-disabled':'true','tabindex':'-1'})}}};Slick.prototype.buildDots=function(){var _=this,i,dot;if(_.options.dots===true&&_.slideCount>_.options.slidesToShow){_.$slider.addClass('slick-dotted');dot=$('<ul />').addClass(_.options.dotsClass);for(i=0;i<=_.getDotCount();i+=1){dot.append($('<li />').append(_.options.customPaging.call(this,_,i)))}_.$dots=dot.appendTo(_.options.appendDots);_.$dots.find('li').first().addClass('slick-active')}};Slick.prototype.buildOut=function(){var _=this;_.$slides=_.$slider.children(_.options.slide+':not(.slick-cloned)').addClass('slick-slide');_.slideCount=_.$slides.length;_.$slides.each(function(index,element){$(element).attr('data-slick-index',index).data('originalStyling',$(element).attr('style')||'')});_.$slider.addClass('slick-slider');_.$slideTrack=_.slideCount===0?$('<div class="slick-track"/>').appendTo(_.$slider):_.$slides.wrapAll('<div class="slick-track"/>').parent();_.$list=_.$slideTrack.wrap('<div class="slick-list"/>').parent();_.$slideTrack.css('opacity',0);if(_.options.centerMode===true||_.options.swipeToSlide===true){_.options.slidesToScroll=1}$('img[data-lazy]',_.$slider).not('[src]').addClass('slick-loading');_.setupInfinite();_.buildArrows();_.buildDots();_.updateDots();_.setSlideClasses(typeof _.currentSlide==='number'?_.currentSlide:0);if(_.options.draggable===true){_.$list.addClass('draggable')}};Slick.prototype.buildRows=function(){var _=this,a,b,c,newSlides,numOfSlides,originalSlides,slidesPerSection;newSlides=document.createDocumentFragment();originalSlides=_.$slider.children();if(_.options.rows>0){slidesPerSection=_.options.slidesPerRow*_.options.rows;numOfSlides=Math.ceil(originalSlides.length/slidesPerSection);for(a=0;a<numOfSlides;a++){var slide=document.createElement('div');for(b=0;b<_.options.rows;b++){var row=document.createElement('div');for(c=0;c<_.options.slidesPerRow;c++){var target=a*slidesPerSection+(b*_.options.slidesPerRow+c);if(originalSlides.get(target)){row.appendChild(originalSlides.get(target))}}slide.appendChild(row)}newSlides.appendChild(slide)}_.$slider.empty().append(newSlides);_.$slider.children().children().children().css({'width':100/_.options.slidesPerRow+'%','display':'inline-block'})}};Slick.prototype.checkResponsive=function(initial,forceUpdate){var _=this,breakpoint,targetBreakpoint,respondToWidth,triggerBreakpoint=false;var sliderWidth=_.$slider.width();var windowWidth=window.innerWidth||$(window).width();if(_.respondTo==='window'){respondToWidth=windowWidth}else if(_.respondTo==='slider'){respondToWidth=sliderWidth}else if(_.respondTo==='min'){respondToWidth=Math.min(windowWidth,sliderWidth)}if(_.options.responsive&&_.options.responsive.length&&_.options.responsive!==null){targetBreakpoint=null;for(breakpoint in _.breakpoints){if(_.breakpoints.hasOwnProperty(breakpoint)){if(_.originalSettings.mobileFirst===false){if(respondToWidth<_.breakpoints[breakpoint]){targetBreakpoint=_.breakpoints[breakpoint]}}else{if(respondToWidth>_.breakpoints[breakpoint]){targetBreakpoint=_.breakpoints[breakpoint]}}}}if(targetBreakpoint!==null){if(_.activeBreakpoint!==null){if(targetBreakpoint!==_.activeBreakpoint||forceUpdate){_.activeBreakpoint=targetBreakpoint;if(_.breakpointSettings[targetBreakpoint]==='unslick'){_.unslick(targetBreakpoint)}else{_.options=$.extend({},_.originalSettings,_.breakpointSettings[targetBreakpoint]);if(initial===true){_.currentSlide=_.options.initialSlide}_.refresh(initial)}triggerBreakpoint=targetBreakpoint}}else{_.activeBreakpoint=targetBreakpoint;if(_.breakpointSettings[targetBreakpoint]==='unslick'){_.unslick(targetBreakpoint)}else{_.options=$.extend({},_.originalSettings,_.breakpointSettings[targetBreakpoint]);if(initial===true){_.currentSlide=_.options.initialSlide}_.refresh(initial)}triggerBreakpoint=targetBreakpoint}}else{if(_.activeBreakpoint!==null){_.activeBreakpoint=null;_.options=_.originalSettings;if(initial===true){_.currentSlide=_.options.initialSlide}_.refresh(initial);triggerBreakpoint=targetBreakpoint}}// only trigger breakpoints during an actual break. not on initialize.
if(!initial&&triggerBreakpoint!==false){_.$slider.trigger('breakpoint',[_,triggerBreakpoint])}}};Slick.prototype.changeSlide=function(event,dontAnimate){var _=this,$target=$(event.currentTarget),indexOffset,slideOffset,unevenOffset;// If target is a link, prevent default action.
if($target.is('a')){event.preventDefault()}// If target is not the <li> element (ie: a child), find the <li>.
if(!$target.is('li')){$target=$target.closest('li')}unevenOffset=_.slideCount%_.options.slidesToScroll!==0;indexOffset=unevenOffset?0:(_.slideCount-_.currentSlide)%_.options.slidesToScroll;switch(event.data.message){case'previous':slideOffset=indexOffset===0?_.options.slidesToScroll:_.options.slidesToShow-indexOffset;if(_.slideCount>_.options.slidesToShow){_.slideHandler(_.currentSlide-slideOffset,false,dontAnimate)}break;case'next':slideOffset=indexOffset===0?_.options.slidesToScroll:indexOffset;if(_.slideCount>_.options.slidesToShow){_.slideHandler(_.currentSlide+slideOffset,false,dontAnimate)}break;case'index':var index=event.data.index===0?0:event.data.index||$target.index()*_.options.slidesToScroll;_.slideHandler(_.checkNavigable(index),false,dontAnimate);$target.children().trigger('focus');break;default:return;}};Slick.prototype.checkNavigable=function(index){var _=this,navigables,prevNavigable;navigables=_.getNavigableIndexes();prevNavigable=0;if(index>navigables[navigables.length-1]){index=navigables[navigables.length-1]}else{for(var n in navigables){if(index<navigables[n]){index=prevNavigable;break}prevNavigable=navigables[n]}}return index};Slick.prototype.cleanUpEvents=function(){var _=this;if(_.options.dots&&_.$dots!==null){$('li',_.$dots).off('click.slick',_.changeSlide).off('mouseenter.slick',$.proxy(_.interrupt,_,true)).off('mouseleave.slick',$.proxy(_.interrupt,_,false));if(_.options.accessibility===true){_.$dots.off('keydown.slick',_.keyHandler)}}_.$slider.off('focus.slick blur.slick');if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow){_.$prevArrow&&_.$prevArrow.off('click.slick',_.changeSlide);_.$nextArrow&&_.$nextArrow.off('click.slick',_.changeSlide);if(_.options.accessibility===true){_.$prevArrow&&_.$prevArrow.off('keydown.slick',_.keyHandler);_.$nextArrow&&_.$nextArrow.off('keydown.slick',_.keyHandler)}}_.$list.off('touchstart.slick mousedown.slick',_.swipeHandler);_.$list.off('touchmove.slick mousemove.slick',_.swipeHandler);_.$list.off('touchend.slick mouseup.slick',_.swipeHandler);_.$list.off('touchcancel.slick mouseleave.slick',_.swipeHandler);_.$list.off('click.slick',_.clickHandler);$(document).off(_.visibilityChange,_.visibility);_.cleanUpSlideEvents();if(_.options.accessibility===true){_.$list.off('keydown.slick',_.keyHandler)}if(_.options.focusOnSelect===true){$(_.$slideTrack).children().off('click.slick',_.selectHandler)}$(window).off('orientationchange.slick.slick-'+_.instanceUid,_.orientationChange);$(window).off('resize.slick.slick-'+_.instanceUid,_.resize);$('[draggable!=true]',_.$slideTrack).off('dragstart',_.preventDefault);$(window).off('load.slick.slick-'+_.instanceUid,_.setPosition)};Slick.prototype.cleanUpSlideEvents=function(){var _=this;_.$list.off('mouseenter.slick',$.proxy(_.interrupt,_,true));_.$list.off('mouseleave.slick',$.proxy(_.interrupt,_,false))};Slick.prototype.cleanUpRows=function(){var _=this,originalSlides;if(_.options.rows>0){originalSlides=_.$slides.children().children();originalSlides.removeAttr('style');_.$slider.empty().append(originalSlides)}};Slick.prototype.clickHandler=function(event){var _=this;if(_.shouldClick===false){event.stopImmediatePropagation();event.stopPropagation();event.preventDefault()}};Slick.prototype.destroy=function(refresh){var _=this;_.autoPlayClear();_.touchObject={};_.cleanUpEvents();$('.slick-cloned',_.$slider).detach();if(_.$dots){_.$dots.remove()}if(_.$prevArrow&&_.$prevArrow.length){_.$prevArrow.removeClass('slick-disabled slick-arrow slick-hidden').removeAttr('aria-hidden aria-disabled tabindex').css('display','');if(_.htmlExpr.test(_.options.prevArrow)){_.$prevArrow.remove()}}if(_.$nextArrow&&_.$nextArrow.length){_.$nextArrow.removeClass('slick-disabled slick-arrow slick-hidden').removeAttr('aria-hidden aria-disabled tabindex').css('display','');if(_.htmlExpr.test(_.options.nextArrow)){_.$nextArrow.remove()}}if(_.$slides){_.$slides.removeClass('slick-slide slick-active slick-center slick-visible slick-current').removeAttr('aria-hidden').removeAttr('data-slick-index').each(function(){$(this).attr('style',$(this).data('originalStyling'))});_.$slideTrack.children(this.options.slide).detach();_.$slideTrack.detach();_.$list.detach();_.$slider.append(_.$slides)}_.cleanUpRows();_.$slider.removeClass('slick-slider');_.$slider.removeClass('slick-initialized');_.$slider.removeClass('slick-dotted');_.unslicked=true;if(!refresh){_.$slider.trigger('destroy',[_])}};Slick.prototype.disableTransition=function(slide){var _=this,transition={};transition[_.transitionType]='';if(_.options.fade===false){_.$slideTrack.css(transition)}else{_.$slides.eq(slide).css(transition)}};Slick.prototype.fadeSlide=function(slideIndex,callback){var _=this;if(_.cssTransitions===false){_.$slides.eq(slideIndex).css({zIndex:_.options.zIndex});_.$slides.eq(slideIndex).animate({opacity:1},_.options.speed,_.options.easing,callback)}else{_.applyTransition(slideIndex);_.$slides.eq(slideIndex).css({opacity:1,zIndex:_.options.zIndex});if(callback){setTimeout(function(){_.disableTransition(slideIndex);callback.call()},_.options.speed)}}};Slick.prototype.fadeSlideOut=function(slideIndex){var _=this;if(_.cssTransitions===false){_.$slides.eq(slideIndex).animate({opacity:0,zIndex:_.options.zIndex-2},_.options.speed,_.options.easing)}else{_.applyTransition(slideIndex);_.$slides.eq(slideIndex).css({opacity:0,zIndex:_.options.zIndex-2})}};Slick.prototype.filterSlides=Slick.prototype.slickFilter=function(filter){var _=this;if(filter!==null){_.$slidesCache=_.$slides;_.unload();_.$slideTrack.children(this.options.slide).detach();_.$slidesCache.filter(filter).appendTo(_.$slideTrack);_.reinit()}};Slick.prototype.focusHandler=function(){var _=this;_.$slider.off('focus.slick blur.slick').on('focus.slick blur.slick','*',function(event){event.stopImmediatePropagation();var $sf=$(this);setTimeout(function(){if(_.options.pauseOnFocus){_.focussed=$sf.is(':focus');_.autoPlay()}},0)})};Slick.prototype.getCurrent=Slick.prototype.slickCurrentSlide=function(){var _=this;return _.currentSlide};Slick.prototype.getDotCount=function(){var _=this;var breakPoint=0;var counter=0;var pagerQty=0;if(_.options.infinite===true){if(_.slideCount<=_.options.slidesToShow){++pagerQty}else{while(breakPoint<_.slideCount){++pagerQty;breakPoint=counter+_.options.slidesToScroll;counter+=_.options.slidesToScroll<=_.options.slidesToShow?_.options.slidesToScroll:_.options.slidesToShow}}}else if(_.options.centerMode===true){pagerQty=_.slideCount}else if(!_.options.asNavFor){pagerQty=1+Math.ceil((_.slideCount-_.options.slidesToShow)/_.options.slidesToScroll)}else{while(breakPoint<_.slideCount){++pagerQty;breakPoint=counter+_.options.slidesToScroll;counter+=_.options.slidesToScroll<=_.options.slidesToShow?_.options.slidesToScroll:_.options.slidesToShow}}return pagerQty-1};Slick.prototype.getLeft=function(slideIndex){var _=this,targetLeft,verticalHeight,verticalOffset=0,targetSlide,coef;_.slideOffset=0;verticalHeight=_.$slides.first().outerHeight(true);if(_.options.infinite===true){if(_.slideCount>_.options.slidesToShow){_.slideOffset=_.slideWidth*_.options.slidesToShow*-1;coef=-1;if(_.options.vertical===true&&_.options.centerMode===true){if(_.options.slidesToShow===2){coef=-1.5}else if(_.options.slidesToShow===1){coef=-2}}verticalOffset=verticalHeight*_.options.slidesToShow*coef}if(_.slideCount%_.options.slidesToScroll!==0){if(slideIndex+_.options.slidesToScroll>_.slideCount&&_.slideCount>_.options.slidesToShow){if(slideIndex>_.slideCount){_.slideOffset=(_.options.slidesToShow-(slideIndex-_.slideCount))*_.slideWidth*-1;verticalOffset=(_.options.slidesToShow-(slideIndex-_.slideCount))*verticalHeight*-1}else{_.slideOffset=_.slideCount%_.options.slidesToScroll*_.slideWidth*-1;verticalOffset=_.slideCount%_.options.slidesToScroll*verticalHeight*-1}}}}else{if(slideIndex+_.options.slidesToShow>_.slideCount){_.slideOffset=(slideIndex+_.options.slidesToShow-_.slideCount)*_.slideWidth;verticalOffset=(slideIndex+_.options.slidesToShow-_.slideCount)*verticalHeight}}if(_.slideCount<=_.options.slidesToShow){_.slideOffset=0;verticalOffset=0}if(_.options.centerMode===true&&_.slideCount<=_.options.slidesToShow){_.slideOffset=_.slideWidth*Math.floor(_.options.slidesToShow)/2-_.slideWidth*_.slideCount/2}else if(_.options.centerMode===true&&_.options.infinite===true){_.slideOffset+=_.slideWidth*Math.floor(_.options.slidesToShow/2)-_.slideWidth}else if(_.options.centerMode===true){_.slideOffset=0;_.slideOffset+=_.slideWidth*Math.floor(_.options.slidesToShow/2)}if(_.options.vertical===false){targetLeft=slideIndex*_.slideWidth*-1+_.slideOffset}else{targetLeft=slideIndex*verticalHeight*-1+verticalOffset}if(_.options.variableWidth===true){if(_.slideCount<=_.options.slidesToShow||_.options.infinite===false){targetSlide=_.$slideTrack.children('.slick-slide').eq(slideIndex)}else{targetSlide=_.$slideTrack.children('.slick-slide').eq(slideIndex+_.options.slidesToShow)}if(_.options.rtl===true){if(targetSlide[0]){targetLeft=(_.$slideTrack.width()-targetSlide[0].offsetLeft-targetSlide.width())*-1}else{targetLeft=0}}else{targetLeft=targetSlide[0]?targetSlide[0].offsetLeft*-1:0}if(_.options.centerMode===true){if(_.slideCount<=_.options.slidesToShow||_.options.infinite===false){targetSlide=_.$slideTrack.children('.slick-slide').eq(slideIndex)}else{targetSlide=_.$slideTrack.children('.slick-slide').eq(slideIndex+_.options.slidesToShow+1)}if(_.options.rtl===true){if(targetSlide[0]){targetLeft=(_.$slideTrack.width()-targetSlide[0].offsetLeft-targetSlide.width())*-1}else{targetLeft=0}}else{targetLeft=targetSlide[0]?targetSlide[0].offsetLeft*-1:0}targetLeft+=(_.$list.width()-targetSlide.outerWidth())/2}}return targetLeft};Slick.prototype.getOption=Slick.prototype.slickGetOption=function(option){var _=this;return _.options[option]};Slick.prototype.getNavigableIndexes=function(){var _=this,breakPoint=0,counter=0,indexes=[],max;if(_.options.infinite===false){max=_.slideCount}else{breakPoint=_.options.slidesToScroll*-1;counter=_.options.slidesToScroll*-1;max=_.slideCount*2}while(breakPoint<max){indexes.push(breakPoint);breakPoint=counter+_.options.slidesToScroll;counter+=_.options.slidesToScroll<=_.options.slidesToShow?_.options.slidesToScroll:_.options.slidesToShow}return indexes};Slick.prototype.getSlick=function(){return this};Slick.prototype.getSlideCount=function(){var _=this,slidesTraversed,swipedSlide,centerOffset;centerOffset=_.options.centerMode===true?_.slideWidth*Math.floor(_.options.slidesToShow/2):0;if(_.options.swipeToSlide===true){_.$slideTrack.find('.slick-slide').each(function(index,slide){if(slide.offsetLeft-centerOffset+$(slide).outerWidth()/2>_.swipeLeft*-1){swipedSlide=slide;return false}});slidesTraversed=Math.abs($(swipedSlide).attr('data-slick-index')-_.currentSlide)||1;return slidesTraversed}else{return _.options.slidesToScroll}};Slick.prototype.goTo=Slick.prototype.slickGoTo=function(slide,dontAnimate){var _=this;_.changeSlide({data:{message:'index',index:parseInt(slide)}},dontAnimate)};Slick.prototype.init=function(creation){var _=this;if(!$(_.$slider).hasClass('slick-initialized')){$(_.$slider).addClass('slick-initialized');_.buildRows();_.buildOut();_.setProps();_.startLoad();_.loadSlider();_.initializeEvents();_.updateArrows();_.updateDots();_.checkResponsive(true);_.focusHandler()}if(creation){_.$slider.trigger('init',[_])}if(_.options.accessibility===true){_.initADA()}if(_.options.autoplay){_.paused=false;_.autoPlay()}};Slick.prototype.initADA=function(){var _=this,numDotGroups=Math.ceil(_.slideCount/_.options.slidesToShow),tabControlIndexes=_.getNavigableIndexes().filter(function(val){return val>=0&&val<_.slideCount});_.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({'aria-hidden':'true','tabindex':'-1'}).find('a, input, button, select').attr({'tabindex':'-1'});if(_.$dots!==null){_.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function(i){var slideControlIndex=tabControlIndexes.indexOf(i);$(this).attr({'role':'tabpanel','id':'slick-slide'+_.instanceUid+i,'tabindex':-1});if(slideControlIndex!==-1){var ariaButtonControl='slick-slide-control'+_.instanceUid+slideControlIndex;if($('#'+ariaButtonControl).length){$(this).attr({'aria-describedby':ariaButtonControl})}}});_.$dots.attr('role','tablist').find('li').each(function(i){var mappedSlideIndex=tabControlIndexes[i];$(this).attr({'role':'presentation'});$(this).find('button').first().attr({'role':'tab','id':'slick-slide-control'+_.instanceUid+i,'aria-controls':'slick-slide'+_.instanceUid+mappedSlideIndex,'aria-label':i+1+' of '+numDotGroups,'aria-selected':null,'tabindex':'-1'})}).eq(_.currentSlide).find('button').attr({'aria-selected':'true','tabindex':'0'}).end()}for(var i=_.currentSlide,max=i+_.options.slidesToShow;i<max;i++){if(_.options.focusOnChange){_.$slides.eq(i).attr({'tabindex':'0'})}else{_.$slides.eq(i).removeAttr('tabindex')}}_.activateADA()};Slick.prototype.initArrowEvents=function(){var _=this;if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow){_.$prevArrow.off('click.slick').on('click.slick',{message:'previous'},_.changeSlide);_.$nextArrow.off('click.slick').on('click.slick',{message:'next'},_.changeSlide);if(_.options.accessibility===true){_.$prevArrow.on('keydown.slick',_.keyHandler);_.$nextArrow.on('keydown.slick',_.keyHandler)}}};Slick.prototype.initDotEvents=function(){var _=this;if(_.options.dots===true&&_.slideCount>_.options.slidesToShow){$('li',_.$dots).on('click.slick',{message:'index'},_.changeSlide);if(_.options.accessibility===true){_.$dots.on('keydown.slick',_.keyHandler)}}if(_.options.dots===true&&_.options.pauseOnDotsHover===true&&_.slideCount>_.options.slidesToShow){$('li',_.$dots).on('mouseenter.slick',$.proxy(_.interrupt,_,true)).on('mouseleave.slick',$.proxy(_.interrupt,_,false))}};Slick.prototype.initSlideEvents=function(){var _=this;if(_.options.pauseOnHover){_.$list.on('mouseenter.slick',$.proxy(_.interrupt,_,true));_.$list.on('mouseleave.slick',$.proxy(_.interrupt,_,false))}};Slick.prototype.initializeEvents=function(){var _=this;_.initArrowEvents();_.initDotEvents();_.initSlideEvents();_.$list.on('touchstart.slick mousedown.slick',{action:'start'},_.swipeHandler);_.$list.on('touchmove.slick mousemove.slick',{action:'move'},_.swipeHandler);_.$list.on('touchend.slick mouseup.slick',{action:'end'},_.swipeHandler);_.$list.on('touchcancel.slick mouseleave.slick',{action:'end'},_.swipeHandler);_.$list.on('click.slick',_.clickHandler);$(document).on(_.visibilityChange,$.proxy(_.visibility,_));if(_.options.accessibility===true){_.$list.on('keydown.slick',_.keyHandler)}if(_.options.focusOnSelect===true){$(_.$slideTrack).children().on('click.slick',_.selectHandler)}$(window).on('orientationchange.slick.slick-'+_.instanceUid,$.proxy(_.orientationChange,_));$(window).on('resize.slick.slick-'+_.instanceUid,$.proxy(_.resize,_));$('[draggable!=true]',_.$slideTrack).on('dragstart',_.preventDefault);$(window).on('load.slick.slick-'+_.instanceUid,_.setPosition);$(_.setPosition)};Slick.prototype.initUI=function(){var _=this;if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow){_.$prevArrow.show();_.$nextArrow.show()}if(_.options.dots===true&&_.slideCount>_.options.slidesToShow){_.$dots.show()}};Slick.prototype.keyHandler=function(event){var _=this;//Dont slide if the cursor is inside the form fields and arrow keys are pressed
if(!event.target.tagName.match('TEXTAREA|INPUT|SELECT')){if(event.keyCode===37&&_.options.accessibility===true){_.changeSlide({data:{message:_.options.rtl===true?'next':'previous'}})}else if(event.keyCode===39&&_.options.accessibility===true){_.changeSlide({data:{message:_.options.rtl===true?'previous':'next'}})}}};Slick.prototype.lazyLoad=function(){var _=this,loadRange,cloneRange,rangeStart,rangeEnd;function loadImages(imagesScope){$('img[data-lazy]',imagesScope).each(function(){var image=$(this),imageSource=$(this).attr('data-lazy'),imageSrcSet=$(this).attr('data-srcset'),imageSizes=$(this).attr('data-sizes')||_.$slider.attr('data-sizes'),imageToLoad=document.createElement('img');imageToLoad.onload=function(){image.animate({opacity:0},100,function(){if(imageSrcSet){image.attr('srcset',imageSrcSet);if(imageSizes){image.attr('sizes',imageSizes)}}image.attr('src',imageSource).animate({opacity:1},200,function(){image.removeAttr('data-lazy data-srcset data-sizes').removeClass('slick-loading')});_.$slider.trigger('lazyLoaded',[_,image,imageSource])})};imageToLoad.onerror=function(){image.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error');_.$slider.trigger('lazyLoadError',[_,image,imageSource])};imageToLoad.src=imageSource})}if(_.options.centerMode===true){if(_.options.infinite===true){rangeStart=_.currentSlide+(_.options.slidesToShow/2+1);rangeEnd=rangeStart+_.options.slidesToShow+2}else{rangeStart=Math.max(0,_.currentSlide-(_.options.slidesToShow/2+1));rangeEnd=2+(_.options.slidesToShow/2+1)+_.currentSlide}}else{rangeStart=_.options.infinite?_.options.slidesToShow+_.currentSlide:_.currentSlide;rangeEnd=Math.ceil(rangeStart+_.options.slidesToShow);if(_.options.fade===true){if(rangeStart>0)rangeStart--;if(rangeEnd<=_.slideCount)rangeEnd++}}loadRange=_.$slider.find('.slick-slide').slice(rangeStart,rangeEnd);if(_.options.lazyLoad==='anticipated'){var prevSlide=rangeStart-1,nextSlide=rangeEnd,$slides=_.$slider.find('.slick-slide');for(var i=0;i<_.options.slidesToScroll;i++){if(prevSlide<0)prevSlide=_.slideCount-1;loadRange=loadRange.add($slides.eq(prevSlide));loadRange=loadRange.add($slides.eq(nextSlide));prevSlide--;nextSlide++}}loadImages(loadRange);if(_.slideCount<=_.options.slidesToShow){cloneRange=_.$slider.find('.slick-slide');loadImages(cloneRange)}else if(_.currentSlide>=_.slideCount-_.options.slidesToShow){cloneRange=_.$slider.find('.slick-cloned').slice(0,_.options.slidesToShow);loadImages(cloneRange)}else if(_.currentSlide===0){cloneRange=_.$slider.find('.slick-cloned').slice(_.options.slidesToShow*-1);loadImages(cloneRange)}};Slick.prototype.loadSlider=function(){var _=this;_.setPosition();_.$slideTrack.css({opacity:1});_.$slider.removeClass('slick-loading');_.initUI();if(_.options.lazyLoad==='progressive'){_.progressiveLazyLoad()}};Slick.prototype.next=Slick.prototype.slickNext=function(){var _=this;_.changeSlide({data:{message:'next'}})};Slick.prototype.orientationChange=function(){var _=this;_.checkResponsive();_.setPosition()};Slick.prototype.pause=Slick.prototype.slickPause=function(){var _=this;_.autoPlayClear();_.paused=true};Slick.prototype.play=Slick.prototype.slickPlay=function(){var _=this;_.autoPlay();_.options.autoplay=true;_.paused=false;_.focussed=false;_.interrupted=false};Slick.prototype.postSlide=function(index){var _=this;if(!_.unslicked){_.$slider.trigger('afterChange',[_,index]);_.animating=false;if(_.slideCount>_.options.slidesToShow){_.setPosition()}_.swipeLeft=null;if(_.options.autoplay){_.autoPlay()}if(_.options.accessibility===true){_.initADA();if(_.options.focusOnChange){var $currentSlide=$(_.$slides.get(_.currentSlide));$currentSlide.attr('tabindex',0).focus()}}}};Slick.prototype.prev=Slick.prototype.slickPrev=function(){var _=this;_.changeSlide({data:{message:'previous'}})};Slick.prototype.preventDefault=function(event){event.preventDefault()};Slick.prototype.progressiveLazyLoad=function(tryCount){tryCount=tryCount||1;var _=this,$imgsToLoad=$('img[data-lazy]',_.$slider),image,imageSource,imageSrcSet,imageSizes,imageToLoad;if($imgsToLoad.length){image=$imgsToLoad.first();imageSource=image.attr('data-lazy');imageSrcSet=image.attr('data-srcset');imageSizes=image.attr('data-sizes')||_.$slider.attr('data-sizes');imageToLoad=document.createElement('img');imageToLoad.onload=function(){if(imageSrcSet){image.attr('srcset',imageSrcSet);if(imageSizes){image.attr('sizes',imageSizes)}}image.attr('src',imageSource).removeAttr('data-lazy data-srcset data-sizes').removeClass('slick-loading');if(_.options.adaptiveHeight===true){_.setPosition()}_.$slider.trigger('lazyLoaded',[_,image,imageSource]);_.progressiveLazyLoad()};imageToLoad.onerror=function(){if(tryCount<3){/**
                  * try to load the image 3 times,
                  * leave a slight delay so we don't get
                  * servers blocking the request.
                  */setTimeout(function(){_.progressiveLazyLoad(tryCount+1)},500)}else{image.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error');_.$slider.trigger('lazyLoadError',[_,image,imageSource]);_.progressiveLazyLoad()}};imageToLoad.src=imageSource}else{_.$slider.trigger('allImagesLoaded',[_])}};Slick.prototype.refresh=function(initializing){var _=this,currentSlide,lastVisibleIndex;lastVisibleIndex=_.slideCount-_.options.slidesToShow;// in non-infinite sliders, we don't want to go past the
// last visible index.
if(!_.options.infinite&&_.currentSlide>lastVisibleIndex){_.currentSlide=lastVisibleIndex}// if less slides than to show, go to start.
if(_.slideCount<=_.options.slidesToShow){_.currentSlide=0}currentSlide=_.currentSlide;_.destroy(true);$.extend(_,_.initials,{currentSlide:currentSlide});_.init();if(!initializing){_.changeSlide({data:{message:'index',index:currentSlide}},false)}};Slick.prototype.registerBreakpoints=function(){var _=this,breakpoint,currentBreakpoint,l,responsiveSettings=_.options.responsive||null;if($.type(responsiveSettings)==='array'&&responsiveSettings.length){_.respondTo=_.options.respondTo||'window';for(breakpoint in responsiveSettings){l=_.breakpoints.length-1;if(responsiveSettings.hasOwnProperty(breakpoint)){currentBreakpoint=responsiveSettings[breakpoint].breakpoint;// loop through the breakpoints and cut out any existing
// ones with the same breakpoint number, we don't want dupes.
while(l>=0){if(_.breakpoints[l]&&_.breakpoints[l]===currentBreakpoint){_.breakpoints.splice(l,1)}l--}_.breakpoints.push(currentBreakpoint);_.breakpointSettings[currentBreakpoint]=responsiveSettings[breakpoint].settings}}_.breakpoints.sort(function(a,b){return _.options.mobileFirst?a-b:b-a})}};Slick.prototype.reinit=function(){var _=this;_.$slides=_.$slideTrack.children(_.options.slide).addClass('slick-slide');_.slideCount=_.$slides.length;if(_.currentSlide>=_.slideCount&&_.currentSlide!==0){_.currentSlide=_.currentSlide-_.options.slidesToScroll}if(_.slideCount<=_.options.slidesToShow){_.currentSlide=0}_.registerBreakpoints();_.setProps();_.setupInfinite();_.buildArrows();_.updateArrows();_.initArrowEvents();_.buildDots();_.updateDots();_.initDotEvents();_.cleanUpSlideEvents();_.initSlideEvents();_.checkResponsive(false,true);if(_.options.focusOnSelect===true){$(_.$slideTrack).children().on('click.slick',_.selectHandler)}_.setSlideClasses(typeof _.currentSlide==='number'?_.currentSlide:0);_.setPosition();_.focusHandler();_.paused=!_.options.autoplay;_.autoPlay();_.$slider.trigger('reInit',[_])};Slick.prototype.resize=function(){var _=this;if($(window).width()!==_.windowWidth){clearTimeout(_.windowDelay);_.windowDelay=window.setTimeout(function(){_.windowWidth=$(window).width();_.checkResponsive();if(!_.unslicked){_.setPosition()}},50)}};Slick.prototype.removeSlide=Slick.prototype.slickRemove=function(index,removeBefore,removeAll){var _=this;if(typeof index==='boolean'){removeBefore=index;index=removeBefore===true?0:_.slideCount-1}else{index=removeBefore===true?--index:index}if(_.slideCount<1||index<0||index>_.slideCount-1){return false}_.unload();if(removeAll===true){_.$slideTrack.children().remove()}else{_.$slideTrack.children(this.options.slide).eq(index).remove()}_.$slides=_.$slideTrack.children(this.options.slide);_.$slideTrack.children(this.options.slide).detach();_.$slideTrack.append(_.$slides);_.$slidesCache=_.$slides;_.reinit()};Slick.prototype.setCSS=function(position){var _=this,positionProps={},x,y;if(_.options.rtl===true){position=-position}x=_.positionProp=='left'?Math.ceil(position)+'px':'0px';y=_.positionProp=='top'?Math.ceil(position)+'px':'0px';positionProps[_.positionProp]=position;if(_.transformsEnabled===false){_.$slideTrack.css(positionProps)}else{positionProps={};if(_.cssTransitions===false){positionProps[_.animType]='translate('+x+', '+y+')';_.$slideTrack.css(positionProps)}else{positionProps[_.animType]='translate3d('+x+', '+y+', 0px)';_.$slideTrack.css(positionProps)}}};Slick.prototype.setDimensions=function(){var _=this;if(_.options.vertical===false){if(_.options.centerMode===true){_.$list.css({padding:'0px '+_.options.centerPadding})}}else{_.$list.height(_.$slides.first().outerHeight(true)*_.options.slidesToShow);if(_.options.centerMode===true){_.$list.css({padding:_.options.centerPadding+' 0px'})}}_.listWidth=_.$list.width();_.listHeight=_.$list.height();if(_.options.vertical===false&&_.options.variableWidth===false){_.slideWidth=Math.ceil(_.listWidth/_.options.slidesToShow);_.$slideTrack.width(Math.ceil(_.slideWidth*_.$slideTrack.children('.slick-slide').length))}else if(_.options.variableWidth===true){_.$slideTrack.width(5000*_.slideCount)}else{_.slideWidth=Math.ceil(_.listWidth);_.$slideTrack.height(Math.ceil(_.$slides.first().outerHeight(true)*_.$slideTrack.children('.slick-slide').length))}var offset=_.$slides.first().outerWidth(true)-_.$slides.first().width();if(_.options.variableWidth===false)_.$slideTrack.children('.slick-slide').width(_.slideWidth-offset)};Slick.prototype.setFade=function(){var _=this,targetLeft;_.$slides.each(function(index,element){targetLeft=_.slideWidth*index*-1;if(_.options.rtl===true){$(element).css({position:'relative',right:targetLeft,top:0,zIndex:_.options.zIndex-2,opacity:0})}else{$(element).css({position:'relative',left:targetLeft,top:0,zIndex:_.options.zIndex-2,opacity:0})}});_.$slides.eq(_.currentSlide).css({zIndex:_.options.zIndex-1,opacity:1})};Slick.prototype.setHeight=function(){var _=this;if(_.options.slidesToShow===1&&_.options.adaptiveHeight===true&&_.options.vertical===false){var targetHeight=_.$slides.eq(_.currentSlide).outerHeight(true);_.$list.css('height',targetHeight)}};Slick.prototype.setOption=Slick.prototype.slickSetOption=function(){/**
      * accepts arguments in format of:
      *
      *  - for changing a single option's value:
      *     .slick("setOption", option, value, refresh )
      *
      *  - for changing a set of responsive options:
      *     .slick("setOption", 'responsive', [{}, ...], refresh )
      *
      *  - for updating multiple values at once (not responsive)
      *     .slick("setOption", { 'option': value, ... }, refresh )
      */var _=this,l,item,option,value,refresh=false,type;if($.type(arguments[0])==='object'){option=arguments[0];refresh=arguments[1];type='multiple'}else if($.type(arguments[0])==='string'){option=arguments[0];value=arguments[1];refresh=arguments[2];if(arguments[0]==='responsive'&&$.type(arguments[1])==='array'){type='responsive'}else if(typeof arguments[1]!=='undefined'){type='single'}}if(type==='single'){_.options[option]=value}else if(type==='multiple'){$.each(option,function(opt,val){_.options[opt]=val})}else if(type==='responsive'){for(item in value){if($.type(_.options.responsive)!=='array'){_.options.responsive=[value[item]]}else{l=_.options.responsive.length-1;// loop through the responsive object and splice out duplicates.
while(l>=0){if(_.options.responsive[l].breakpoint===value[item].breakpoint){_.options.responsive.splice(l,1)}l--}_.options.responsive.push(value[item])}}}if(refresh){_.unload();_.reinit()}};Slick.prototype.setPosition=function(){var _=this;_.setDimensions();_.setHeight();if(_.options.fade===false){_.setCSS(_.getLeft(_.currentSlide))}else{_.setFade()}_.$slider.trigger('setPosition',[_])};Slick.prototype.setProps=function(){var _=this,bodyStyle=document.body.style;_.positionProp=_.options.vertical===true?'top':'left';if(_.positionProp==='top'){_.$slider.addClass('slick-vertical')}else{_.$slider.removeClass('slick-vertical')}if(bodyStyle.WebkitTransition!==undefined||bodyStyle.MozTransition!==undefined||bodyStyle.msTransition!==undefined){if(_.options.useCSS===true){_.cssTransitions=true}}if(_.options.fade){if(typeof _.options.zIndex==='number'){if(_.options.zIndex<3){_.options.zIndex=3}}else{_.options.zIndex=_.defaults.zIndex}}if(bodyStyle.OTransform!==undefined){_.animType='OTransform';_.transformType='-o-transform';_.transitionType='OTransition';if(bodyStyle.perspectiveProperty===undefined&&bodyStyle.webkitPerspective===undefined)_.animType=false}if(bodyStyle.MozTransform!==undefined){_.animType='MozTransform';_.transformType='-moz-transform';_.transitionType='MozTransition';if(bodyStyle.perspectiveProperty===undefined&&bodyStyle.MozPerspective===undefined)_.animType=false}if(bodyStyle.webkitTransform!==undefined){_.animType='webkitTransform';_.transformType='-webkit-transform';_.transitionType='webkitTransition';if(bodyStyle.perspectiveProperty===undefined&&bodyStyle.webkitPerspective===undefined)_.animType=false}if(bodyStyle.msTransform!==undefined){_.animType='msTransform';_.transformType='-ms-transform';_.transitionType='msTransition';if(bodyStyle.msTransform===undefined)_.animType=false}if(bodyStyle.transform!==undefined&&_.animType!==false){_.animType='transform';_.transformType='transform';_.transitionType='transition'}_.transformsEnabled=_.options.useTransform&&_.animType!==null&&_.animType!==false};Slick.prototype.setSlideClasses=function(index){var _=this,centerOffset,allSlides,indexOffset,remainder;allSlides=_.$slider.find('.slick-slide').removeClass('slick-active slick-center slick-current').attr('aria-hidden','true');_.$slides.eq(index).addClass('slick-current');if(_.options.centerMode===true){var evenCoef=_.options.slidesToShow%2===0?1:0;centerOffset=Math.floor(_.options.slidesToShow/2);if(_.options.infinite===true){if(index>=centerOffset&&index<=_.slideCount-1-centerOffset){_.$slides.slice(index-centerOffset+evenCoef,index+centerOffset+1).addClass('slick-active').attr('aria-hidden','false')}else{indexOffset=_.options.slidesToShow+index;allSlides.slice(indexOffset-centerOffset+1+evenCoef,indexOffset+centerOffset+2).addClass('slick-active').attr('aria-hidden','false')}if(index===0){allSlides.eq(allSlides.length-1-_.options.slidesToShow).addClass('slick-center')}else if(index===_.slideCount-1){allSlides.eq(_.options.slidesToShow).addClass('slick-center')}}_.$slides.eq(index).addClass('slick-center')}else{if(index>=0&&index<=_.slideCount-_.options.slidesToShow){_.$slides.slice(index,index+_.options.slidesToShow).addClass('slick-active').attr('aria-hidden','false')}else if(allSlides.length<=_.options.slidesToShow){allSlides.addClass('slick-active').attr('aria-hidden','false')}else{remainder=_.slideCount%_.options.slidesToShow;indexOffset=_.options.infinite===true?_.options.slidesToShow+index:index;if(_.options.slidesToShow==_.options.slidesToScroll&&_.slideCount-index<_.options.slidesToShow){allSlides.slice(indexOffset-(_.options.slidesToShow-remainder),indexOffset+remainder).addClass('slick-active').attr('aria-hidden','false')}else{allSlides.slice(indexOffset,indexOffset+_.options.slidesToShow).addClass('slick-active').attr('aria-hidden','false')}}}if(_.options.lazyLoad==='ondemand'||_.options.lazyLoad==='anticipated'){_.lazyLoad()}};Slick.prototype.setupInfinite=function(){var _=this,i,slideIndex,infiniteCount;if(_.options.fade===true){_.options.centerMode=false}if(_.options.infinite===true&&_.options.fade===false){slideIndex=null;if(_.slideCount>_.options.slidesToShow){if(_.options.centerMode===true){infiniteCount=_.options.slidesToShow+1}else{infiniteCount=_.options.slidesToShow}for(i=_.slideCount;i>_.slideCount-infiniteCount;i-=1){slideIndex=i-1;$(_.$slides[slideIndex]).clone(true).attr('id','').attr('data-slick-index',slideIndex-_.slideCount).prependTo(_.$slideTrack).addClass('slick-cloned')}for(i=0;i<infiniteCount+_.slideCount;i+=1){slideIndex=i;$(_.$slides[slideIndex]).clone(true).attr('id','').attr('data-slick-index',slideIndex+_.slideCount).appendTo(_.$slideTrack).addClass('slick-cloned')}_.$slideTrack.find('.slick-cloned').find('[id]').each(function(){$(this).attr('id','')})}}};Slick.prototype.interrupt=function(toggle){var _=this;if(!toggle){_.autoPlay()}_.interrupted=toggle};Slick.prototype.selectHandler=function(event){var _=this;var targetElement=$(event.target).is('.slick-slide')?$(event.target):$(event.target).parents('.slick-slide');var index=parseInt(targetElement.attr('data-slick-index'));if(!index)index=0;if(_.slideCount<=_.options.slidesToShow){_.slideHandler(index,false,true);return}_.slideHandler(index)};Slick.prototype.slideHandler=function(index,sync,dontAnimate){var targetSlide,animSlide,oldSlide,slideLeft,targetLeft=null,_=this,navTarget;sync=sync||false;if(_.animating===true&&_.options.waitForAnimate===true){return}if(_.options.fade===true&&_.currentSlide===index){return}if(sync===false){_.asNavFor(index)}targetSlide=index;targetLeft=_.getLeft(targetSlide);slideLeft=_.getLeft(_.currentSlide);_.currentLeft=_.swipeLeft===null?slideLeft:_.swipeLeft;if(_.options.infinite===false&&_.options.centerMode===false&&(index<0||index>_.getDotCount()*_.options.slidesToScroll)){if(_.options.fade===false){targetSlide=_.currentSlide;if(dontAnimate!==true&&_.slideCount>_.options.slidesToShow){_.animateSlide(slideLeft,function(){_.postSlide(targetSlide)})}else{_.postSlide(targetSlide)}}return}else if(_.options.infinite===false&&_.options.centerMode===true&&(index<0||index>_.slideCount-_.options.slidesToScroll)){if(_.options.fade===false){targetSlide=_.currentSlide;if(dontAnimate!==true&&_.slideCount>_.options.slidesToShow){_.animateSlide(slideLeft,function(){_.postSlide(targetSlide)})}else{_.postSlide(targetSlide)}}return}if(_.options.autoplay){clearInterval(_.autoPlayTimer)}if(targetSlide<0){if(_.slideCount%_.options.slidesToScroll!==0){animSlide=_.slideCount-_.slideCount%_.options.slidesToScroll}else{animSlide=_.slideCount+targetSlide}}else if(targetSlide>=_.slideCount){if(_.slideCount%_.options.slidesToScroll!==0){animSlide=0}else{animSlide=targetSlide-_.slideCount}}else{animSlide=targetSlide}_.animating=true;_.$slider.trigger('beforeChange',[_,_.currentSlide,animSlide]);oldSlide=_.currentSlide;_.currentSlide=animSlide;_.setSlideClasses(_.currentSlide);if(_.options.asNavFor){navTarget=_.getNavTarget();navTarget=navTarget.slick('getSlick');if(navTarget.slideCount<=navTarget.options.slidesToShow){navTarget.setSlideClasses(_.currentSlide)}}_.updateDots();_.updateArrows();if(_.options.fade===true){if(dontAnimate!==true){_.fadeSlideOut(oldSlide);_.fadeSlide(animSlide,function(){_.postSlide(animSlide)})}else{_.postSlide(animSlide)}_.animateHeight();return}if(dontAnimate!==true&&_.slideCount>_.options.slidesToShow){_.animateSlide(targetLeft,function(){_.postSlide(animSlide)})}else{_.postSlide(animSlide)}};Slick.prototype.startLoad=function(){var _=this;if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow){_.$prevArrow.hide();_.$nextArrow.hide()}if(_.options.dots===true&&_.slideCount>_.options.slidesToShow){_.$dots.hide()}_.$slider.addClass('slick-loading')};Slick.prototype.swipeDirection=function(){var xDist,yDist,r,swipeAngle,_=this;xDist=_.touchObject.startX-_.touchObject.curX;yDist=_.touchObject.startY-_.touchObject.curY;r=Math.atan2(yDist,xDist);swipeAngle=Math.round(r*180/Math.PI);if(swipeAngle<0){swipeAngle=360-Math.abs(swipeAngle)}if(swipeAngle<=45&&swipeAngle>=0){return _.options.rtl===false?'left':'right'}if(swipeAngle<=360&&swipeAngle>=315){return _.options.rtl===false?'left':'right'}if(swipeAngle>=135&&swipeAngle<=225){return _.options.rtl===false?'right':'left'}if(_.options.verticalSwiping===true){if(swipeAngle>=35&&swipeAngle<=135){return'down'}else{return'up'}}return'vertical'};Slick.prototype.swipeEnd=function(event){var _=this,slideCount,direction;_.dragging=false;_.swiping=false;if(_.scrolling){_.scrolling=false;return false}_.interrupted=false;_.shouldClick=_.touchObject.swipeLength>10?false:true;if(_.touchObject.curX===undefined){return false}if(_.touchObject.edgeHit===true){_.$slider.trigger('edge',[_,_.swipeDirection()])}if(_.touchObject.swipeLength>=_.touchObject.minSwipe){direction=_.swipeDirection();switch(direction){case'left':case'down':slideCount=_.options.swipeToSlide?_.checkNavigable(_.currentSlide+_.getSlideCount()):_.currentSlide+_.getSlideCount();_.currentDirection=0;break;case'right':case'up':slideCount=_.options.swipeToSlide?_.checkNavigable(_.currentSlide-_.getSlideCount()):_.currentSlide-_.getSlideCount();_.currentDirection=1;break;default:}if(direction!='vertical'){_.slideHandler(slideCount);_.touchObject={};_.$slider.trigger('swipe',[_,direction])}}else{if(_.touchObject.startX!==_.touchObject.curX){_.slideHandler(_.currentSlide);_.touchObject={}}}};Slick.prototype.swipeHandler=function(event){var _=this;if(_.options.swipe===false||'ontouchend'in document&&_.options.swipe===false){return}else if(_.options.draggable===false&&event.type.indexOf('mouse')!==-1){return}_.touchObject.fingerCount=event.originalEvent&&event.originalEvent.touches!==undefined?event.originalEvent.touches.length:1;_.touchObject.minSwipe=_.listWidth/_.options.touchThreshold;if(_.options.verticalSwiping===true){_.touchObject.minSwipe=_.listHeight/_.options.touchThreshold}switch(event.data.action){case'start':_.swipeStart(event);break;case'move':_.swipeMove(event);break;case'end':_.swipeEnd(event);break;}};Slick.prototype.swipeMove=function(event){var _=this,edgeWasHit=false,curLeft,swipeDirection,swipeLength,positionOffset,touches,verticalSwipeLength;touches=event.originalEvent!==undefined?event.originalEvent.touches:null;if(!_.dragging||_.scrolling||touches&&touches.length!==1){return false}curLeft=_.getLeft(_.currentSlide);_.touchObject.curX=touches!==undefined?touches[0].pageX:event.clientX;_.touchObject.curY=touches!==undefined?touches[0].pageY:event.clientY;_.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(_.touchObject.curX-_.touchObject.startX,2)));verticalSwipeLength=Math.round(Math.sqrt(Math.pow(_.touchObject.curY-_.touchObject.startY,2)));if(!_.options.verticalSwiping&&!_.swiping&&verticalSwipeLength>4){_.scrolling=true;return false}if(_.options.verticalSwiping===true){_.touchObject.swipeLength=verticalSwipeLength}swipeDirection=_.swipeDirection();if(event.originalEvent!==undefined&&_.touchObject.swipeLength>4){_.swiping=true;event.preventDefault()}positionOffset=(_.options.rtl===false?1:-1)*(_.touchObject.curX>_.touchObject.startX?1:-1);if(_.options.verticalSwiping===true){positionOffset=_.touchObject.curY>_.touchObject.startY?1:-1}swipeLength=_.touchObject.swipeLength;_.touchObject.edgeHit=false;if(_.options.infinite===false){if(_.currentSlide===0&&swipeDirection==='right'||_.currentSlide>=_.getDotCount()&&swipeDirection==='left'){swipeLength=_.touchObject.swipeLength*_.options.edgeFriction;_.touchObject.edgeHit=true}}if(_.options.vertical===false){_.swipeLeft=curLeft+swipeLength*positionOffset}else{_.swipeLeft=curLeft+swipeLength*(_.$list.height()/_.listWidth)*positionOffset}if(_.options.verticalSwiping===true){_.swipeLeft=curLeft+swipeLength*positionOffset}if(_.options.fade===true||_.options.touchMove===false){return false}if(_.animating===true){_.swipeLeft=null;return false}_.setCSS(_.swipeLeft)};Slick.prototype.swipeStart=function(event){var _=this,touches;_.interrupted=true;if(_.touchObject.fingerCount!==1||_.slideCount<=_.options.slidesToShow){_.touchObject={};return false}if(event.originalEvent!==undefined&&event.originalEvent.touches!==undefined){touches=event.originalEvent.touches[0]}_.touchObject.startX=_.touchObject.curX=touches!==undefined?touches.pageX:event.clientX;_.touchObject.startY=_.touchObject.curY=touches!==undefined?touches.pageY:event.clientY;_.dragging=true};Slick.prototype.unfilterSlides=Slick.prototype.slickUnfilter=function(){var _=this;if(_.$slidesCache!==null){_.unload();_.$slideTrack.children(this.options.slide).detach();_.$slidesCache.appendTo(_.$slideTrack);_.reinit()}};Slick.prototype.unload=function(){var _=this;$('.slick-cloned',_.$slider).remove();if(_.$dots){_.$dots.remove()}if(_.$prevArrow&&_.htmlExpr.test(_.options.prevArrow)){_.$prevArrow.remove()}if(_.$nextArrow&&_.htmlExpr.test(_.options.nextArrow)){_.$nextArrow.remove()}_.$slides.removeClass('slick-slide slick-active slick-visible slick-current').attr('aria-hidden','true').css('width','')};Slick.prototype.unslick=function(fromBreakpoint){var _=this;_.$slider.trigger('unslick',[_,fromBreakpoint]);_.destroy()};Slick.prototype.updateArrows=function(){var _=this,centerOffset;centerOffset=Math.floor(_.options.slidesToShow/2);if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow&&!_.options.infinite){_.$prevArrow.removeClass('slick-disabled').attr('aria-disabled','false');_.$nextArrow.removeClass('slick-disabled').attr('aria-disabled','false');if(_.currentSlide===0){_.$prevArrow.addClass('slick-disabled').attr('aria-disabled','true');_.$nextArrow.removeClass('slick-disabled').attr('aria-disabled','false')}else if(_.currentSlide>=_.slideCount-_.options.slidesToShow&&_.options.centerMode===false){_.$nextArrow.addClass('slick-disabled').attr('aria-disabled','true');_.$prevArrow.removeClass('slick-disabled').attr('aria-disabled','false')}else if(_.currentSlide>=_.slideCount-1&&_.options.centerMode===true){_.$nextArrow.addClass('slick-disabled').attr('aria-disabled','true');_.$prevArrow.removeClass('slick-disabled').attr('aria-disabled','false')}}};Slick.prototype.updateDots=function(){var _=this;if(_.$dots!==null){_.$dots.find('li').removeClass('slick-active').end();_.$dots.find('li').eq(Math.floor(_.currentSlide/_.options.slidesToScroll)).addClass('slick-active')}};Slick.prototype.visibility=function(){var _=this;if(_.options.autoplay){if(document[_.hidden]){_.interrupted=true}else{_.interrupted=false}}};$.fn.slick=function(){var _=this,opt=arguments[0],args=Array.prototype.slice.call(arguments,1),l=_.length,i,ret;for(i=0;i<l;i++){if(typeof opt=='object'||typeof opt=='undefined')_[i].slick=new Slick(_[i],opt);else ret=_[i].slick[opt].apply(_[i].slick,args);if(typeof ret!='undefined')return ret}return _}});/*!
Waypoints - 4.0.0
Copyright Â© 2011-2015 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
*/!function(){'use strict';function t(o){if(!o)throw new Error('No options passed to Waypoint constructor');if(!o.element)throw new Error('No element option passed to Waypoint constructor');if(!o.handler)throw new Error('No handler option passed to Waypoint constructor');this.key='waypoint-'+e,this.options=t.Adapter.extend({},t.defaults,o),this.element=this.options.element,this.adapter=new t.Adapter(this.element),this.callback=o.handler,this.axis=this.options.horizontal?'horizontal':'vertical',this.enabled=this.options.enabled,this.triggerPoint=null,this.group=t.Group.findOrCreate({name:this.options.group,axis:this.axis}),this.context=t.Context.findOrCreateByElement(this.options.context),t.offsetAliases[this.options.offset]&&(this.options.offset=t.offsetAliases[this.options.offset]),this.group.add(this),this.context.add(this),i[this.key]=this,e+=1}var e=0,i={};t.prototype.queueTrigger=function(t){this.group.queueTrigger(this,t)},t.prototype.trigger=function(t){this.enabled&&this.callback&&this.callback.apply(this,t)},t.prototype.destroy=function(){this.context.remove(this),this.group.remove(this),delete i[this.key]},t.prototype.disable=function(){return this.enabled=!1,this},t.prototype.enable=function(){return this.context.refresh(),this.enabled=!0,this},t.prototype.next=function(){return this.group.next(this)},t.prototype.previous=function(){return this.group.previous(this)},t.invokeAll=function(t){var e=[];for(var o in i)e.push(i[o]);for(var n=0,r=e.length;r>n;n++)e[n][t]()},t.destroyAll=function(){t.invokeAll('destroy')},t.disableAll=function(){t.invokeAll('disable')},t.enableAll=function(){t.invokeAll('enable')},t.refreshAll=function(){t.Context.refreshAll()},t.viewportHeight=function(){return window.innerHeight||document.documentElement.clientHeight},t.viewportWidth=function(){return document.documentElement.clientWidth},t.adapters=[],t.defaults={context:window,continuous:!0,enabled:!0,group:'default',horizontal:!1,offset:0},t.offsetAliases={'bottom-in-view':function(){return this.context.innerHeight()-this.adapter.outerHeight()},'right-in-view':function(){return this.context.innerWidth()-this.adapter.outerWidth()}},window.Waypoint=t}(),function(){'use strict';function t(t){window.setTimeout(t,1e3/60)}function e(t){this.element=t,this.Adapter=n.Adapter,this.adapter=new this.Adapter(t),this.key='waypoint-context-'+i,this.didScroll=!1,this.didResize=!1,this.oldScroll={x:this.adapter.scrollLeft(),y:this.adapter.scrollTop()},this.waypoints={vertical:{},horizontal:{}},t.waypointContextKey=this.key,o[t.waypointContextKey]=this,i+=1,this.createThrottledScrollHandler(),this.createThrottledResizeHandler()}var i=0,o={},n=window.Waypoint,r=window.onload;e.prototype.add=function(t){var e=t.options.horizontal?'horizontal':'vertical';this.waypoints[e][t.key]=t,this.refresh()},e.prototype.checkEmpty=function(){var t=this.Adapter.isEmptyObject(this.waypoints.horizontal),e=this.Adapter.isEmptyObject(this.waypoints.vertical);t&&e&&(this.adapter.off('.waypoints'),delete o[this.key])},e.prototype.createThrottledResizeHandler=function(){function t(){e.handleResize(),e.didResize=!1}var e=this;this.adapter.on('resize.waypoints',function(){e.didResize||(e.didResize=!0,n.requestAnimationFrame(t))})},e.prototype.createThrottledScrollHandler=function(){function t(){e.handleScroll(),e.didScroll=!1}var e=this;this.adapter.on('scroll.waypoints',function(){(!e.didScroll||n.isTouch)&&(e.didScroll=!0,n.requestAnimationFrame(t))})},e.prototype.handleResize=function(){n.Context.refreshAll()},e.prototype.handleScroll=function(){var t={},e={horizontal:{newScroll:this.adapter.scrollLeft(),oldScroll:this.oldScroll.x,forward:'right',backward:'left'},vertical:{newScroll:this.adapter.scrollTop(),oldScroll:this.oldScroll.y,forward:'down',backward:'up'}};for(var i in e){var o=e[i],n=o.newScroll>o.oldScroll,r=n?o.forward:o.backward;for(var s in this.waypoints[i]){var a=this.waypoints[i][s],l=o.oldScroll<a.triggerPoint,h=o.newScroll>=a.triggerPoint,p=l&&h,u=!l&&!h;(p||u)&&(a.queueTrigger(r),t[a.group.id]=a.group)}}for(var c in t)t[c].flushTriggers();this.oldScroll={x:e.horizontal.newScroll,y:e.vertical.newScroll}},e.prototype.innerHeight=function(){return this.element==this.element.window?n.viewportHeight():this.adapter.innerHeight()},e.prototype.remove=function(t){delete this.waypoints[t.axis][t.key],this.checkEmpty()},e.prototype.innerWidth=function(){return this.element==this.element.window?n.viewportWidth():this.adapter.innerWidth()},e.prototype.destroy=function(){var t=[];for(var e in this.waypoints)for(var i in this.waypoints[e])t.push(this.waypoints[e][i]);for(var o=0,n=t.length;n>o;o++)t[o].destroy()},e.prototype.refresh=function(){var t,e=this.element==this.element.window,i=e?void 0:this.adapter.offset(),o={};this.handleScroll(),t={horizontal:{contextOffset:e?0:i.left,contextScroll:e?0:this.oldScroll.x,contextDimension:this.innerWidth(),oldScroll:this.oldScroll.x,forward:'right',backward:'left',offsetProp:'left'},vertical:{contextOffset:e?0:i.top,contextScroll:e?0:this.oldScroll.y,contextDimension:this.innerHeight(),oldScroll:this.oldScroll.y,forward:'down',backward:'up',offsetProp:'top'}};for(var r in t){var s=t[r];for(var a in this.waypoints[r]){var l,h,p,u,c,d=this.waypoints[r][a],f=d.options.offset,w=d.triggerPoint,y=0,g=null==w;d.element!==d.element.window&&(y=d.adapter.offset()[s.offsetProp]),'function'==typeof f?f=f.apply(d):'string'==typeof f&&(f=parseFloat(f),d.options.offset.indexOf('%')>-1&&(f=Math.ceil(s.contextDimension*f/100))),l=s.contextScroll-s.contextOffset,d.triggerPoint=y+l-f,h=w<s.oldScroll,p=d.triggerPoint>=s.oldScroll,u=h&&p,c=!h&&!p,!g&&u?(d.queueTrigger(s.backward),o[d.group.id]=d.group):!g&&c?(d.queueTrigger(s.forward),o[d.group.id]=d.group):g&&s.oldScroll>=d.triggerPoint&&(d.queueTrigger(s.forward),o[d.group.id]=d.group)}}return n.requestAnimationFrame(function(){for(var t in o)o[t].flushTriggers()}),this},e.findOrCreateByElement=function(t){return e.findByElement(t)||new e(t)},e.refreshAll=function(){for(var t in o)o[t].refresh()},e.findByElement=function(t){return o[t.waypointContextKey]},window.onload=function(){r&&r(),e.refreshAll()},n.requestAnimationFrame=function(e){var i=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||t;i.call(window,e)},n.Context=e}(),function(){'use strict';function t(t,e){return t.triggerPoint-e.triggerPoint}function e(t,e){return e.triggerPoint-t.triggerPoint}function i(t){this.name=t.name,this.axis=t.axis,this.id=this.name+'-'+this.axis,this.waypoints=[],this.clearTriggerQueues(),o[this.axis][this.name]=this}var o={vertical:{},horizontal:{}},n=window.Waypoint;i.prototype.add=function(t){this.waypoints.push(t)},i.prototype.clearTriggerQueues=function(){this.triggerQueues={up:[],down:[],left:[],right:[]}},i.prototype.flushTriggers=function(){for(var i in this.triggerQueues){var o=this.triggerQueues[i],n='up'===i||'left'===i;o.sort(n?e:t);for(var r=0,s=o.length;s>r;r+=1){var a=o[r];(a.options.continuous||r===o.length-1)&&a.trigger([i])}}this.clearTriggerQueues()},i.prototype.next=function(e){this.waypoints.sort(t);var i=n.Adapter.inArray(e,this.waypoints),o=i===this.waypoints.length-1;return o?null:this.waypoints[i+1]},i.prototype.previous=function(e){this.waypoints.sort(t);var i=n.Adapter.inArray(e,this.waypoints);return i?this.waypoints[i-1]:null},i.prototype.queueTrigger=function(t,e){this.triggerQueues[e].push(t)},i.prototype.remove=function(t){var e=n.Adapter.inArray(t,this.waypoints);e>-1&&this.waypoints.splice(e,1)},i.prototype.first=function(){return this.waypoints[0]},i.prototype.last=function(){return this.waypoints[this.waypoints.length-1]},i.findOrCreate=function(t){return o[t.axis][t.name]||new i(t)},n.Group=i}(),function(){'use strict';function t(t){this.$element=e(t)}var e=window.jQuery,i=window.Waypoint;e.each(['innerHeight','innerWidth','off','offset','on','outerHeight','outerWidth','scrollLeft','scrollTop'],function(e,i){t.prototype[i]=function(){var t=Array.prototype.slice.call(arguments);return this.$element[i].apply(this.$element,t)}}),e.each(['extend','inArray','isEmptyObject'],function(i,o){t[o]=e[o]}),i.adapters.push({name:'jquery',Adapter:t}),i.Adapter=t}(),function(){'use strict';function t(t){return function(){var i=[],o=arguments[0];return t.isFunction(arguments[0])&&(o=t.extend({},arguments[1]),o.handler=arguments[0]),this.each(function(){var n=t.extend({},o,{element:this});'string'==typeof n.context&&(n.context=t(this).closest(n.context)[0]),i.push(new e(n))}),i}}var e=window.Waypoint;window.jQuery&&(window.jQuery.fn.waypoint=t(window.jQuery)),window.Zepto&&(window.Zepto.fn.waypoint=t(window.Zepto))}();/*!
* Parallax: paroller.js
* Version : 1.4.3
* Author  : nK <https://nkdev.info>
* GitHub  : https://github.com/nk-o/jarallax
*/!function(r){'use strict';'object'==typeof module&&'object'==typeof module.exports?module.exports=r(require('jquery')):r(jQuery)}(function(r){'use strict';var t=!1,o=function(){t=!1},n={bgVertical:function(r,t){return r.css({'background-position':'center '+-t+'px'})},bgHorizontal:function(r,t){return r.css({'background-position':-t+'px center'})},vertical:function(r,t,o){return'none'!==o||(o=''),r.css({'-webkit-transform':'translateY('+t+'px)'+o,'-moz-transform':'translateY('+t+'px)'+o,transform:'translateY('+t+'px)'+o,transition:'transform linear','will-change':'transform'})},horizontal:function(r,t,o){return'none'!==o||(o=''),r.css({'-webkit-transform':'translateX('+t+'px)'+o,'-moz-transform':'translateX('+t+'px)'+o,transform:'translateX('+t+'px)'+o,transition:'transform linear','will-change':'transform'})}},a={factor:function(r,t,o){var n=r.data('paroller-factor'),a=n||o.factor;if(t<576){var e=r.data('paroller-factor-xs'),i=e||o.factorXs;return i||a}if(t<=768){var c=r.data('paroller-factor-sm'),f=c||o.factorSm;return f||a}if(t<=1024){var l=r.data('paroller-factor-md'),u=l||o.factorMd;return u||a}if(t<=1200){var s=r.data('paroller-factor-lg'),d=s||o.factorLg;return d||a}if(t<=1920){var g=r.data('paroller-factor-xl'),h=g||o.factorXl;return h||a}return a},bgOffset:function(r,t){return Math.round(r*t)},transform:function(r,t,o,n){return Math.round((r-o/2+n)*t)}},e={background:function(r){return r.css({'background-position':'unset'})},foreground:function(r){return r.css({transform:'unset',transition:'unset'})}};r.fn.paroller=function(i){var c=r(window).height(),f=r(document).height(),i=r.extend({factor:0,factorXs:0,factorSm:0,factorMd:0,factorLg:0,factorXl:0,type:'background',direction:'vertical'},i);return this.each(function(){var l=r(this),u=r(window).width(),s=l.offset().top,d=l.outerHeight(),g=l.data('paroller-type'),h=l.data('paroller-direction'),p=l.css('transform'),m=g||i.type,b=h||i.direction,v=a.factor(l,u,i),w=a.bgOffset(s,v),z=a.transform(s,v,c,d);'background'===m?'vertical'===b?n.bgVertical(l,w):'horizontal'===b&&n.bgHorizontal(l,w):'foreground'===m&&('vertical'===b?n.vertical(l,z,p):'horizontal'===b&&n.horizontal(l,z,p)),r(window).on('resize',function(){var g=r(this).scrollTop();u=r(window).width(),s=l.offset().top,d=l.outerHeight(),v=a.factor(l,u,i),w=Math.round(s*v),z=Math.round((s-c/2+d)*v),t||(window.requestAnimationFrame(o),t=!0),'background'===m?(e.background(l),'vertical'===b?n.bgVertical(l,w):'horizontal'===b&&n.bgHorizontal(l,w)):'foreground'===m&&g<=f&&(e.foreground(l),'vertical'===b?n.vertical(l,z):'horizontal'===b&&n.horizontal(l,z))}),r(window).on('scroll',function(){var a=r(this).scrollTop();f=r(document).height(),w=Math.round((s-a)*v),z=Math.round((s-c/2+d-a)*v),t||(window.requestAnimationFrame(o),t=!0),'background'===m?'vertical'===b?n.bgVertical(l,w):'horizontal'===b&&n.bgHorizontal(l,w):'foreground'===m&&a<=f&&('vertical'===b?n.vertical(l,z,p):'horizontal'===b&&n.horizontal(l,z,p))})})}});
/*!
DataTables 1.10.19
©2008-2018 SpryMedia Ltd - datatables.net/license
*/(function(h){'function'===typeof define&&define.amd?define(['jquery'],function(E){return h(E,window,document)}):'object'===typeof exports?module.exports=function(E,H){E||(E=window);H||(H='undefined'!==typeof window?require('jquery'):require('jquery')(E));return h(H,E,E.document)}:h(jQuery,window,document)})(function(h,E,H,k){function Z(a){var b,c,d={};h.each(a,function(e){if((b=e.match(/^([^A-Z]+?)([A-Z])/))&&-1!=='a aa ai ao as b fn i m o s '.indexOf(b[1]+' '))c=e.replace(b[0],b[2].toLowerCase()),d[c]=e,'o'===b[1]&&Z(a[e])});a._hungarianMap=d}function J(a,b,c){a._hungarianMap||Z(a);var d;h.each(b,function(e){d=a._hungarianMap[e];if(d!==k&&(c||b[d]===k))'o'===d.charAt(0)?(b[d]||(b[d]={}),h.extend(!0,b[d],b[e]),J(a[d],b[d],c)):b[d]=b[e]})}function Ca(a){var b=n.defaults.oLanguage,c=b.sDecimal;c&&Da(c);if(a){var d=a.sZeroRecords;!a.sEmptyTable&&d&&'No data available in table'===b.sEmptyTable&&F(a,a,'sZeroRecords','sEmptyTable');!a.sLoadingRecords&&d&&'Loading...'===b.sLoadingRecords&&F(a,a,'sZeroRecords','sLoadingRecords');a.sInfoThousands&&(a.sThousands=a.sInfoThousands);(a=a.sDecimal)&&c!==a&&Da(a)}}function fb(a){A(a,'ordering','bSort');A(a,'orderMulti','bSortMulti');A(a,'orderClasses','bSortClasses');A(a,'orderCellsTop','bSortCellsTop');A(a,'order','aaSorting');A(a,'orderFixed','aaSortingFixed');A(a,'paging','bPaginate');A(a,'pagingType','sPaginationType');A(a,'pageLength','iDisplayLength');A(a,'searching','bFilter');'boolean'===typeof a.sScrollX&&(a.sScrollX=a.sScrollX?'100%':'');'boolean'===typeof a.scrollX&&(a.scrollX=a.scrollX?'100%':'');if(a=a.aoSearchCols)for(var b=0,c=a.length;b<c;b++)a[b]&&J(n.models.oSearch,a[b])}function gb(a){A(a,'orderable','bSortable');A(a,'orderData','aDataSort');A(a,'orderSequence','asSorting');A(a,'orderDataType','sortDataType');var b=a.aDataSort;'number'===typeof b&&!h.isArray(b)&&(a.aDataSort=[b])}function hb(a){if(!n.__browser){var b={};n.__browser=b;var c=h('<div/>').css({position:'fixed',top:0,left:-1*h(E).scrollLeft(),height:1,width:1,overflow:'hidden'}).append(h('<div/>').css({position:'absolute',top:1,left:1,width:100,overflow:'scroll'}).append(h('<div/>').css({width:'100%',height:10}))).appendTo('body'),d=c.children(),e=d.children();b.barWidth=d[0].offsetWidth-d[0].clientWidth;b.bScrollOversize=100===e[0].offsetWidth&&100!==d[0].clientWidth;b.bScrollbarLeft=1!==Math.round(e.offset().left);b.bBounding=c[0].getBoundingClientRect().width?!0:!1;c.remove()}h.extend(a.oBrowser,n.__browser);a.oScroll.iBarWidth=n.__browser.barWidth}function ib(a,b,c,d,e,f){var g,j=!1;c!==k&&(g=c,j=!0);for(;d!==e;)a.hasOwnProperty(d)&&(g=j?b(g,a[d],d,a):a[d],j=!0,d+=f);return g}function Ea(a,b){var c=n.defaults.column,d=a.aoColumns.length,c=h.extend({},n.models.oColumn,c,{nTh:b?b:H.createElement('th'),sTitle:c.sTitle?c.sTitle:b?b.innerHTML:'',aDataSort:c.aDataSort?c.aDataSort:[d],mData:c.mData?c.mData:d,idx:d});a.aoColumns.push(c);c=a.aoPreSearchCols;c[d]=h.extend({},n.models.oSearch,c[d]);ka(a,d,h(b).data())}function ka(a,b,c){var b=a.aoColumns[b],d=a.oClasses,e=h(b.nTh);if(!b.sWidthOrig){b.sWidthOrig=e.attr('width')||null;var f=(e.attr('style')||'').match(/width:\s*(\d+[pxem%]+)/);f&&(b.sWidthOrig=f[1])}c!==k&&null!==c&&(gb(c),J(n.defaults.column,c),c.mDataProp!==k&&!c.mData&&(c.mData=c.mDataProp),c.sType&&(b._sManualType=c.sType),c.className&&!c.sClass&&(c.sClass=c.className),c.sClass&&e.addClass(c.sClass),h.extend(b,c),F(b,c,'sWidth','sWidthOrig'),c.iDataSort!==k&&(b.aDataSort=[c.iDataSort]),F(b,c,'aDataSort'));var g=b.mData,j=S(g),i=b.mRender?S(b.mRender):null,c=function(a){return'string'===typeof a&&-1!==a.indexOf('@')};b._bAttrSrc=h.isPlainObject(g)&&(c(g.sort)||c(g.type)||c(g.filter));b._setter=null;b.fnGetData=function(a,b,c){var d=j(a,b,k,c);return i&&b?i(d,b,a,c):d};b.fnSetData=function(a,b,c){return N(g)(a,b,c)};'number'!==typeof g&&(a._rowReadObject=!0);a.oFeatures.bSort||(b.bSortable=!1,e.addClass(d.sSortableNone));a=-1!==h.inArray('asc',b.asSorting);c=-1!==h.inArray('desc',b.asSorting);!b.bSortable||!a&&!c?(b.sSortingClass=d.sSortableNone,b.sSortingClassJUI=''):a&&!c?(b.sSortingClass=d.sSortableAsc,b.sSortingClassJUI=d.sSortJUIAscAllowed):!a&&c?(b.sSortingClass=d.sSortableDesc,b.sSortingClassJUI=d.sSortJUIDescAllowed):(b.sSortingClass=d.sSortable,b.sSortingClassJUI=d.sSortJUI)}function $(a){if(!1!==a.oFeatures.bAutoWidth){var b=a.aoColumns;Fa(a);for(var c=0,d=b.length;c<d;c++)b[c].nTh.style.width=b[c].sWidth}b=a.oScroll;(''!==b.sY||''!==b.sX)&&la(a);r(a,null,'column-sizing',[a])}function aa(a,b){var c=ma(a,'bVisible');return'number'===typeof c[b]?c[b]:null}function ba(a,b){var c=ma(a,'bVisible'),c=h.inArray(b,c);return-1!==c?c:null}function V(a){var b=0;h.each(a.aoColumns,function(a,d){d.bVisible&&'none'!==h(d.nTh).css('display')&&b++});return b}function ma(a,b){var c=[];h.map(a.aoColumns,function(a,e){a[b]&&c.push(e)});return c}function Ga(a){var b=a.aoColumns,c=a.aoData,d=n.ext.type.detect,e,f,g,j,i,h,l,q,t;e=0;for(f=b.length;e<f;e++)if(l=b[e],t=[],!l.sType&&l._sManualType)l.sType=l._sManualType;else if(!l.sType){g=0;for(j=d.length;g<j;g++){i=0;for(h=c.length;i<h;i++){t[i]===k&&(t[i]=B(a,i,e,'type'));q=d[g](t[i],a);if(!q&&g!==d.length-1)break;if('html'===q)break}if(q){l.sType=q;break}}l.sType||(l.sType='string')}}function jb(a,b,c,d){var e,f,g,j,i,m,l=a.aoColumns;if(b)for(e=b.length-1;0<=e;e--){m=b[e];var q=m.targets!==k?m.targets:m.aTargets;h.isArray(q)||(q=[q]);f=0;for(g=q.length;f<g;f++)if('number'===typeof q[f]&&0<=q[f]){for(;l.length<=q[f];)Ea(a);d(q[f],m)}else if('number'===typeof q[f]&&0>q[f])d(l.length+q[f],m);else if('string'===typeof q[f]){j=0;for(i=l.length;j<i;j++)('_all'==q[f]||h(l[j].nTh).hasClass(q[f]))&&d(j,m)}}if(c){e=0;for(a=c.length;e<a;e++)d(e,c[e])}}function O(a,b,c,d){var e=a.aoData.length,f=h.extend(!0,{},n.models.oRow,{src:c?'dom':'data',idx:e});f._aData=b;a.aoData.push(f);for(var g=a.aoColumns,j=0,i=g.length;j<i;j++)g[j].sType=null;a.aiDisplayMaster.push(e);b=a.rowIdFn(b);b!==k&&(a.aIds[b]=f);(c||!a.oFeatures.bDeferRender)&&Ha(a,e,c,d);return e}function na(a,b){var c;b instanceof h||(b=h(b));return b.map(function(b,e){c=Ia(a,e);return O(a,c.data,e,c.cells)})}function B(a,b,c,d){var e=a.iDraw,f=a.aoColumns[c],g=a.aoData[b]._aData,j=f.sDefaultContent,i=f.fnGetData(g,d,{settings:a,row:b,col:c});if(i===k)return a.iDrawError!=e&&null===j&&(K(a,0,'Requested unknown parameter '+('function'==typeof f.mData?'{function}':'\''+f.mData+'\'')+' for row '+b+', column '+c,4),a.iDrawError=e),j;if((i===g||null===i)&&null!==j&&d!==k)i=j;else if('function'===typeof i)return i.call(g);return null===i&&'display'==d?'':i}function kb(a,b,c,d){a.aoColumns[c].fnSetData(a.aoData[b]._aData,d,{settings:a,row:b,col:c})}function Ja(a){return h.map(a.match(/(\\.|[^\.])+/g)||[''],function(a){return a.replace(/\\\./g,'.')})}function S(a){if(h.isPlainObject(a)){var b={};h.each(a,function(a,c){c&&(b[a]=S(c))});return function(a,c,f,g){var j=b[c]||b._;return j!==k?j(a,c,f,g):a}}if(null===a)return function(a){return a};if('function'===typeof a)return function(b,c,f,g){return a(b,c,f,g)};if('string'===typeof a&&(-1!==a.indexOf('.')||-1!==a.indexOf('[')||-1!==a.indexOf('('))){var c=function(a,b,f){var g,j;if(''!==f){j=Ja(f);for(var i=0,m=j.length;i<m;i++){f=j[i].match(ca);g=j[i].match(W);if(f){j[i]=j[i].replace(ca,'');''!==j[i]&&(a=a[j[i]]);g=[];j.splice(0,i+1);j=j.join('.');if(h.isArray(a)){i=0;for(m=a.length;i<m;i++)g.push(c(a[i],b,j))}a=f[0].substring(1,f[0].length-1);a=''===a?g:g.join(a);break}else if(g){j[i]=j[i].replace(W,'');a=a[j[i]]();continue}if(null===a||a[j[i]]===k)return k;a=a[j[i]]}}return a};return function(b,e){return c(b,e,a)}}return function(b){return b[a]}}function N(a){if(h.isPlainObject(a))return N(a._);if(null===a)return function(){};if('function'===typeof a)return function(b,d,e){a(b,'set',d,e)};if('string'===typeof a&&(-1!==a.indexOf('.')||-1!==a.indexOf('[')||-1!==a.indexOf('('))){var b=function(a,d,e){var e=Ja(e),f;f=e[e.length-1];for(var g,j,i=0,m=e.length-1;i<m;i++){g=e[i].match(ca);j=e[i].match(W);if(g){e[i]=e[i].replace(ca,'');a[e[i]]=[];f=e.slice();f.splice(0,i+1);g=f.join('.');if(h.isArray(d)){j=0;for(m=d.length;j<m;j++)f={},b(f,d[j],g),a[e[i]].push(f)}else a[e[i]]=d;return}j&&(e[i]=e[i].replace(W,''),a=a[e[i]](d));if(null===a[e[i]]||a[e[i]]===k)a[e[i]]={};a=a[e[i]]}if(f.match(W))a[f.replace(W,'')](d);else a[f.replace(ca,'')]=d};return function(c,d){return b(c,d,a)}}return function(b,d){b[a]=d}}function Ka(a){return D(a.aoData,'_aData')}function oa(a){a.aoData.length=0;a.aiDisplayMaster.length=0;a.aiDisplay.length=0;a.aIds={}}function pa(a,b,c){for(var d=-1,e=0,f=a.length;e<f;e++)a[e]==b?d=e:a[e]>b&&a[e]--;-1!=d&&c===k&&a.splice(d,1)}function da(a,b,c,d){var e=a.aoData[b],f,g=function(c,d){for(;c.childNodes.length;)c.removeChild(c.firstChild);c.innerHTML=B(a,b,d,'display')};if('dom'===c||(!c||'auto'===c)&&'dom'===e.src)e._aData=Ia(a,e,d,d===k?k:e._aData).data;else{var j=e.anCells;if(j)if(d!==k)g(j[d],d);else{c=0;for(f=j.length;c<f;c++)g(j[c],c)}}e._aSortData=null;e._aFilterData=null;g=a.aoColumns;if(d!==k)g[d].sType=null;else{c=0;for(f=g.length;c<f;c++)g[c].sType=null;La(a,e)}}function Ia(a,b,c,d){var e=[],f=b.firstChild,g,j,i=0,m,l=a.aoColumns,q=a._rowReadObject,d=d!==k?d:q?{}:[],t=function(a,b){if('string'===typeof a){var c=a.indexOf('@');-1!==c&&(c=a.substring(c+1),N(a)(d,b.getAttribute(c)))}},G=function(a){if(c===k||c===i)j=l[i],m=h.trim(a.innerHTML),j&&j._bAttrSrc?(N(j.mData._)(d,m),t(j.mData.sort,a),t(j.mData.type,a),t(j.mData.filter,a)):q?(j._setter||(j._setter=N(j.mData)),j._setter(d,m)):d[i]=m;i++};if(f)for(;f;){g=f.nodeName.toUpperCase();if('TD'==g||'TH'==g)G(f),e.push(f);f=f.nextSibling}else{e=b.anCells;f=0;for(g=e.length;f<g;f++)G(e[f])}if(b=b.firstChild?b:b.nTr)(b=b.getAttribute('id'))&&N(a.rowId)(d,b);return{data:d,cells:e}}function Ha(a,b,c,d){var e=a.aoData[b],f=e._aData,g=[],j,i,m,l,q;if(null===e.nTr){j=c||H.createElement('tr');e.nTr=j;e.anCells=g;j._DT_RowIndex=b;La(a,e);l=0;for(q=a.aoColumns.length;l<q;l++){m=a.aoColumns[l];i=c?d[l]:H.createElement(m.sCellType);i._DT_CellIndex={row:b,column:l};g.push(i);if((!c||m.mRender||m.mData!==l)&&(!h.isPlainObject(m.mData)||m.mData._!==l+'.display'))i.innerHTML=B(a,b,l,'display');m.sClass&&(i.className+=' '+m.sClass);m.bVisible&&!c?j.appendChild(i):!m.bVisible&&c&&i.parentNode.removeChild(i);m.fnCreatedCell&&m.fnCreatedCell.call(a.oInstance,i,B(a,b,l),f,b,l)}r(a,'aoRowCreatedCallback',null,[j,f,b,g])}e.nTr.setAttribute('role','row')}function La(a,b){var c=b.nTr,d=b._aData;if(c){var e=a.rowIdFn(d);e&&(c.id=e);d.DT_RowClass&&(e=d.DT_RowClass.split(' '),b.__rowc=b.__rowc?qa(b.__rowc.concat(e)):e,h(c).removeClass(b.__rowc.join(' ')).addClass(d.DT_RowClass));d.DT_RowAttr&&h(c).attr(d.DT_RowAttr);d.DT_RowData&&h(c).data(d.DT_RowData)}}function lb(a){var b,c,d,e,f,g=a.nTHead,j=a.nTFoot,i=0===h('th, td',g).length,m=a.oClasses,l=a.aoColumns;i&&(e=h('<tr/>').appendTo(g));b=0;for(c=l.length;b<c;b++)f=l[b],d=h(f.nTh).addClass(f.sClass),i&&d.appendTo(e),a.oFeatures.bSort&&(d.addClass(f.sSortingClass),!1!==f.bSortable&&(d.attr('tabindex',a.iTabIndex).attr('aria-controls',a.sTableId),Ma(a,f.nTh,b))),f.sTitle!=d[0].innerHTML&&d.html(f.sTitle),Na(a,'header')(a,d,f,m);i&&ea(a.aoHeader,g);h(g).find('>tr').attr('role','row');h(g).find('>tr>th, >tr>td').addClass(m.sHeaderTH);h(j).find('>tr>th, >tr>td').addClass(m.sFooterTH);if(null!==j){a=a.aoFooter[0];b=0;for(c=a.length;b<c;b++)f=l[b],f.nTf=a[b].cell,f.sClass&&h(f.nTf).addClass(f.sClass)}}function fa(a,b,c){var d,e,f,g=[],j=[],i=a.aoColumns.length,m;if(b){c===k&&(c=!1);d=0;for(e=b.length;d<e;d++){g[d]=b[d].slice();g[d].nTr=b[d].nTr;for(f=i-1;0<=f;f--)!a.aoColumns[f].bVisible&&!c&&g[d].splice(f,1);j.push([])}d=0;for(e=g.length;d<e;d++){if(a=g[d].nTr)for(;f=a.firstChild;)a.removeChild(f);f=0;for(b=g[d].length;f<b;f++)if(m=i=1,j[d][f]===k){a.appendChild(g[d][f].cell);for(j[d][f]=1;g[d+i]!==k&&g[d][f].cell==g[d+i][f].cell;)j[d+i][f]=1,i++;for(;g[d][f+m]!==k&&g[d][f].cell==g[d][f+m].cell;){for(c=0;c<i;c++)j[d+c][f+m]=1;m++}h(g[d][f].cell).attr('rowspan',i).attr('colspan',m)}}}}function P(a){var b=r(a,'aoPreDrawCallback','preDraw',[a]);if(-1!==h.inArray(!1,b))C(a,!1);else{var b=[],c=0,d=a.asStripeClasses,e=d.length,f=a.oLanguage,g=a.iInitDisplayStart,j='ssp'==y(a),i=a.aiDisplay;a.bDrawing=!0;g!==k&&-1!==g&&(a._iDisplayStart=j?g:g>=a.fnRecordsDisplay()?0:g,a.iInitDisplayStart=-1);var g=a._iDisplayStart,m=a.fnDisplayEnd();if(a.bDeferLoading)a.bDeferLoading=!1,a.iDraw++,C(a,!1);else if(j){if(!a.bDestroying&&!mb(a))return}else a.iDraw++;if(0!==i.length){f=j?a.aoData.length:m;for(j=j?0:g;j<f;j++){var l=i[j],q=a.aoData[l];null===q.nTr&&Ha(a,l);var t=q.nTr;if(0!==e){var G=d[c%e];q._sRowStripe!=G&&(h(t).removeClass(q._sRowStripe).addClass(G),q._sRowStripe=G)}r(a,'aoRowCallback',null,[t,q._aData,c,j,l]);b.push(t);c++}}else c=f.sZeroRecords,1==a.iDraw&&'ajax'==y(a)?c=f.sLoadingRecords:f.sEmptyTable&&0===a.fnRecordsTotal()&&(c=f.sEmptyTable),b[0]=h('<tr/>',{'class':e?d[0]:''}).append(h('<td />',{valign:'top',colSpan:V(a),'class':a.oClasses.sRowEmpty}).html(c))[0];r(a,'aoHeaderCallback','header',[h(a.nTHead).children('tr')[0],Ka(a),g,m,i]);r(a,'aoFooterCallback','footer',[h(a.nTFoot).children('tr')[0],Ka(a),g,m,i]);d=h(a.nTBody);d.children().detach();d.append(h(b));r(a,'aoDrawCallback','draw',[a]);a.bSorted=!1;a.bFiltered=!1;a.bDrawing=!1}}function T(a,b){var c=a.oFeatures,d=c.bFilter;c.bSort&&nb(a);d?ga(a,a.oPreviousSearch):a.aiDisplay=a.aiDisplayMaster.slice();!0!==b&&(a._iDisplayStart=0);a._drawHold=b;P(a);a._drawHold=!1}function ob(a){var b=a.oClasses,c=h(a.nTable),c=h('<div/>').insertBefore(c),d=a.oFeatures,e=h('<div/>',{id:a.sTableId+'_wrapper','class':b.sWrapper+(a.nTFoot?'':' '+b.sNoFooter)});a.nHolding=c[0];a.nTableWrapper=e[0];a.nTableReinsertBefore=a.nTable.nextSibling;for(var f=a.sDom.split(''),g,j,i,m,l,q,k=0;k<f.length;k++){g=null;j=f[k];if('<'==j){i=h('<div/>')[0];m=f[k+1];if('\''==m||'"'==m){l='';for(q=2;f[k+q]!=m;)l+=f[k+q],q++;'H'==l?l=b.sJUIHeader:'F'==l&&(l=b.sJUIFooter);-1!=l.indexOf('.')?(m=l.split('.'),i.id=m[0].substr(1,m[0].length-1),i.className=m[1]):'#'==l.charAt(0)?i.id=l.substr(1,l.length-1):i.className=l;k+=q}e.append(i);e=h(i)}else if('>'==j)e=e.parent();else if('l'==j&&d.bPaginate&&d.bLengthChange)g=pb(a);else if('f'==j&&d.bFilter)g=qb(a);else if('r'==j&&d.bProcessing)g=rb(a);else if('t'==j)g=sb(a);else if('i'==j&&d.bInfo)g=tb(a);else if('p'==j&&d.bPaginate)g=ub(a);else if(0!==n.ext.feature.length){i=n.ext.feature;q=0;for(m=i.length;q<m;q++)if(j==i[q].cFeature){g=i[q].fnInit(a);break}}g&&(i=a.aanFeatures,i[j]||(i[j]=[]),i[j].push(g),e.append(g))}c.replaceWith(e);a.nHolding=null}function ea(a,b){var c=h(b).children('tr'),d,e,f,g,j,i,m,l,q,k;a.splice(0,a.length);f=0;for(i=c.length;f<i;f++)a.push([]);f=0;for(i=c.length;f<i;f++){d=c[f];for(e=d.firstChild;e;){if('TD'==e.nodeName.toUpperCase()||'TH'==e.nodeName.toUpperCase()){l=1*e.getAttribute('colspan');q=1*e.getAttribute('rowspan');l=!l||0===l||1===l?1:l;q=!q||0===q||1===q?1:q;g=0;for(j=a[f];j[g];)g++;m=g;k=1===l?!0:!1;for(j=0;j<l;j++)for(g=0;g<q;g++)a[f+g][m+j]={cell:e,unique:k},a[f+g].nTr=d}e=e.nextSibling}}}function ra(a,b,c){var d=[];c||(c=a.aoHeader,b&&(c=[],ea(c,b)));for(var b=0,e=c.length;b<e;b++)for(var f=0,g=c[b].length;f<g;f++)if(c[b][f].unique&&(!d[f]||!a.bSortCellsTop))d[f]=c[b][f].cell;return d}function sa(a,b,c){r(a,'aoServerParams','serverParams',[b]);if(b&&h.isArray(b)){var d={},e=/(.*?)\[\]$/;h.each(b,function(a,b){var c=b.name.match(e);c?(c=c[0],d[c]||(d[c]=[]),d[c].push(b.value)):d[b.name]=b.value});b=d}var f,g=a.ajax,j=a.oInstance,i=function(b){r(a,null,'xhr',[a,b,a.jqXHR]);c(b)};if(h.isPlainObject(g)&&g.data){f=g.data;var m='function'===typeof f?f(b,a):f,b='function'===typeof f&&m?m:h.extend(!0,b,m);delete g.data}m={data:b,success:function(b){var c=b.error||b.sError;c&&K(a,0,c);a.json=b;i(b)},dataType:'json',cache:!1,type:a.sServerMethod,error:function(b,c){var d=r(a,null,'xhr',[a,null,a.jqXHR]);-1===h.inArray(!0,d)&&('parsererror'==c?K(a,0,'Invalid JSON response',1):4===b.readyState&&K(a,0,'Ajax error',7));C(a,!1)}};a.oAjaxData=b;r(a,null,'preXhr',[a,b]);a.fnServerData?a.fnServerData.call(j,a.sAjaxSource,h.map(b,function(a,b){return{name:b,value:a}}),i,a):a.sAjaxSource||'string'===typeof g?a.jqXHR=h.ajax(h.extend(m,{url:g||a.sAjaxSource})):'function'===typeof g?a.jqXHR=g.call(j,b,i,a):(a.jqXHR=h.ajax(h.extend(m,g)),g.data=f)}function mb(a){return a.bAjaxDataGet?(a.iDraw++,C(a,!0),sa(a,vb(a),function(b){wb(a,b)}),!1):!0}function vb(a){var b=a.aoColumns,c=b.length,d=a.oFeatures,e=a.oPreviousSearch,f=a.aoPreSearchCols,g,j=[],i,m,l,k=X(a);g=a._iDisplayStart;i=!1!==d.bPaginate?a._iDisplayLength:-1;var t=function(a,b){j.push({name:a,value:b})};t('sEcho',a.iDraw);t('iColumns',c);t('sColumns',D(b,'sName').join(','));t('iDisplayStart',g);t('iDisplayLength',i);var G={draw:a.iDraw,columns:[],order:[],start:g,length:i,search:{value:e.sSearch,regex:e.bRegex}};for(g=0;g<c;g++)m=b[g],l=f[g],i='function'==typeof m.mData?'function':m.mData,G.columns.push({data:i,name:m.sName,searchable:m.bSearchable,orderable:m.bSortable,search:{value:l.sSearch,regex:l.bRegex}}),t('mDataProp_'+g,i),d.bFilter&&(t('sSearch_'+g,l.sSearch),t('bRegex_'+g,l.bRegex),t('bSearchable_'+g,m.bSearchable)),d.bSort&&t('bSortable_'+g,m.bSortable);d.bFilter&&(t('sSearch',e.sSearch),t('bRegex',e.bRegex));d.bSort&&(h.each(k,function(a,b){G.order.push({column:b.col,dir:b.dir});t('iSortCol_'+a,b.col);t('sSortDir_'+a,b.dir)}),t('iSortingCols',k.length));b=n.ext.legacy.ajax;return null===b?a.sAjaxSource?j:G:b?j:G}function wb(a,b){var c=ta(a,b),d=b.sEcho!==k?b.sEcho:b.draw,e=b.iTotalRecords!==k?b.iTotalRecords:b.recordsTotal,f=b.iTotalDisplayRecords!==k?b.iTotalDisplayRecords:b.recordsFiltered;if(d){if(1*d<a.iDraw)return;a.iDraw=1*d}oa(a);a._iRecordsTotal=parseInt(e,10);a._iRecordsDisplay=parseInt(f,10);d=0;for(e=c.length;d<e;d++)O(a,c[d]);a.aiDisplay=a.aiDisplayMaster.slice();a.bAjaxDataGet=!1;P(a);a._bInitComplete||ua(a,b);a.bAjaxDataGet=!0;C(a,!1)}function ta(a,b){var c=h.isPlainObject(a.ajax)&&a.ajax.dataSrc!==k?a.ajax.dataSrc:a.sAjaxDataProp;return'data'===c?b.aaData||b[c]:''!==c?S(c)(b):b}function qb(a){var b=a.oClasses,c=a.sTableId,d=a.oLanguage,e=a.oPreviousSearch,f=a.aanFeatures,g='<input type="search" class="'+b.sFilterInput+'"/>',j=d.sSearch,j=j.match(/_INPUT_/)?j.replace('_INPUT_',g):j+g,b=h('<div/>',{id:!f.f?c+'_filter':null,'class':b.sFilter}).append(h('<label/>').append(j)),f=function(){var b=!this.value?'':this.value;b!=e.sSearch&&(ga(a,{sSearch:b,bRegex:e.bRegex,bSmart:e.bSmart,bCaseInsensitive:e.bCaseInsensitive}),a._iDisplayStart=0,P(a))},g=null!==a.searchDelay?a.searchDelay:'ssp'===y(a)?400:0,i=h('input',b).val(e.sSearch).attr('placeholder',d.sSearchPlaceholder).on('keyup.DT search.DT input.DT paste.DT cut.DT',g?Oa(f,g):f).on('keypress.DT',function(a){if(13==a.keyCode)return!1}).attr('aria-controls',c);h(a.nTable).on('search.dt.DT',function(b,c){if(a===c)try{i[0]!==H.activeElement&&i.val(e.sSearch)}catch(d){}});return b[0]}function ga(a,b,c){var d=a.oPreviousSearch,e=a.aoPreSearchCols,f=function(a){d.sSearch=a.sSearch;d.bRegex=a.bRegex;d.bSmart=a.bSmart;d.bCaseInsensitive=a.bCaseInsensitive};Ga(a);if('ssp'!=y(a)){xb(a,b.sSearch,c,b.bEscapeRegex!==k?!b.bEscapeRegex:b.bRegex,b.bSmart,b.bCaseInsensitive);f(b);for(b=0;b<e.length;b++)yb(a,e[b].sSearch,b,e[b].bEscapeRegex!==k?!e[b].bEscapeRegex:e[b].bRegex,e[b].bSmart,e[b].bCaseInsensitive);zb(a)}else f(b);a.bFiltered=!0;r(a,null,'search',[a])}function zb(a){for(var b=n.ext.search,c=a.aiDisplay,d,e,f=0,g=b.length;f<g;f++){for(var j=[],i=0,m=c.length;i<m;i++)e=c[i],d=a.aoData[e],b[f](a,d._aFilterData,e,d._aData,i)&&j.push(e);c.length=0;h.merge(c,j)}}function yb(a,b,c,d,e,f){if(''!==b){for(var g=[],j=a.aiDisplay,d=Pa(b,d,e,f),e=0;e<j.length;e++)b=a.aoData[j[e]]._aFilterData[c],d.test(b)&&g.push(j[e]);a.aiDisplay=g}}function xb(a,b,c,d,e,f){var d=Pa(b,d,e,f),f=a.oPreviousSearch.sSearch,g=a.aiDisplayMaster,j,e=[];0!==n.ext.search.length&&(c=!0);j=Ab(a);if(0>=b.length)a.aiDisplay=g.slice();else{if(j||c||f.length>b.length||0!==b.indexOf(f)||a.bSorted)a.aiDisplay=g.slice();b=a.aiDisplay;for(c=0;c<b.length;c++)d.test(a.aoData[b[c]]._sFilterRow)&&e.push(b[c]);a.aiDisplay=e}}function Pa(a,b,c,d){a=b?a:Qa(a);c&&(a='^(?=.*?'+h.map(a.match(/"[^"]+"|[^ ]+/g)||[''],function(a){if('"'===a.charAt(0))var b=a.match(/^"(.*)"$/),a=b?b[1]:a;return a.replace('"','')}).join(')(?=.*?')+').*$');return RegExp(a,d?'i':'')}function Ab(a){var b=a.aoColumns,c,d,e,f,g,j,i,h,l=n.ext.type.search;c=!1;d=0;for(f=a.aoData.length;d<f;d++)if(h=a.aoData[d],!h._aFilterData){j=[];e=0;for(g=b.length;e<g;e++)c=b[e],c.bSearchable?(i=B(a,d,e,'filter'),l[c.sType]&&(i=l[c.sType](i)),null===i&&(i=''),'string'!==typeof i&&i.toString&&(i=i.toString())):i='',i.indexOf&&-1!==i.indexOf('&')&&(va.innerHTML=i,i=Wb?va.textContent:va.innerText),i.replace&&(i=i.replace(/[\r\n]/g,'')),j.push(i);h._aFilterData=j;h._sFilterRow=j.join('  ');c=!0}return c}function Bb(a){return{search:a.sSearch,smart:a.bSmart,regex:a.bRegex,caseInsensitive:a.bCaseInsensitive}}function Cb(a){return{sSearch:a.search,bSmart:a.smart,bRegex:a.regex,bCaseInsensitive:a.caseInsensitive}}function tb(a){var b=a.sTableId,c=a.aanFeatures.i,d=h('<div/>',{'class':a.oClasses.sInfo,id:!c?b+'_info':null});c||(a.aoDrawCallback.push({fn:Db,sName:'information'}),d.attr('role','status').attr('aria-live','polite'),h(a.nTable).attr('aria-describedby',b+'_info'));return d[0]}function Db(a){var b=a.aanFeatures.i;if(0!==b.length){var c=a.oLanguage,d=a._iDisplayStart+1,e=a.fnDisplayEnd(),f=a.fnRecordsTotal(),g=a.fnRecordsDisplay(),j=g?c.sInfo:c.sInfoEmpty;g!==f&&(j+=' '+c.sInfoFiltered);j+=c.sInfoPostFix;j=Eb(a,j);c=c.fnInfoCallback;null!==c&&(j=c.call(a.oInstance,a,d,e,f,g,j));h(b).html(j)}}function Eb(a,b){var c=a.fnFormatNumber,d=a._iDisplayStart+1,e=a._iDisplayLength,f=a.fnRecordsDisplay(),g=-1===e;return b.replace(/_START_/g,c.call(a,d)).replace(/_END_/g,c.call(a,a.fnDisplayEnd())).replace(/_MAX_/g,c.call(a,a.fnRecordsTotal())).replace(/_TOTAL_/g,c.call(a,f)).replace(/_PAGE_/g,c.call(a,g?1:Math.ceil(d/e))).replace(/_PAGES_/g,c.call(a,g?1:Math.ceil(f/e)))}function ha(a){var b,c,d=a.iInitDisplayStart,e=a.aoColumns,f;c=a.oFeatures;var g=a.bDeferLoading;if(a.bInitialised){ob(a);lb(a);fa(a,a.aoHeader);fa(a,a.aoFooter);C(a,!0);c.bAutoWidth&&Fa(a);b=0;for(c=e.length;b<c;b++)f=e[b],f.sWidth&&(f.nTh.style.width=v(f.sWidth));r(a,null,'preInit',[a]);T(a);e=y(a);if('ssp'!=e||g)'ajax'==e?sa(a,[],function(c){var f=ta(a,c);for(b=0;b<f.length;b++)O(a,f[b]);a.iInitDisplayStart=d;T(a);C(a,!1);ua(a,c)},a):(C(a,!1),ua(a))}else setTimeout(function(){ha(a)},200)}function ua(a,b){a._bInitComplete=!0;(b||a.oInit.aaData)&&$(a);r(a,null,'plugin-init',[a,b]);r(a,'aoInitComplete','init',[a,b])}function Ra(a,b){var c=parseInt(b,10);a._iDisplayLength=c;Sa(a);r(a,null,'length',[a,c])}function pb(a){for(var b=a.oClasses,c=a.sTableId,d=a.aLengthMenu,e=h.isArray(d[0]),f=e?d[0]:d,d=e?d[1]:d,e=h('<select/>',{name:c+'_length','aria-controls':c,'class':b.sLengthSelect}),g=0,j=f.length;g<j;g++)e[0][g]=new Option('number'===typeof d[g]?a.fnFormatNumber(d[g]):d[g],f[g]);var i=h('<div><label/></div>').addClass(b.sLength);a.aanFeatures.l||(i[0].id=c+'_length');i.children().append(a.oLanguage.sLengthMenu.replace('_MENU_',e[0].outerHTML));h('select',i).val(a._iDisplayLength).on('change.DT',function(){Ra(a,h(this).val());P(a)});h(a.nTable).on('length.dt.DT',function(b,c,d){a===c&&h('select',i).val(d)});return i[0]}function ub(a){var b=a.sPaginationType,c=n.ext.pager[b],d='function'===typeof c,e=function(a){P(a)},b=h('<div/>').addClass(a.oClasses.sPaging+b)[0],f=a.aanFeatures;d||c.fnInit(a,b,e);f.p||(b.id=a.sTableId+'_paginate',a.aoDrawCallback.push({fn:function(a){if(d){var b=a._iDisplayStart,i=a._iDisplayLength,h=a.fnRecordsDisplay(),l=-1===i,b=l?0:Math.ceil(b/i),i=l?1:Math.ceil(h/i),h=c(b,i),k,l=0;for(k=f.p.length;l<k;l++)Na(a,'pageButton')(a,f.p[l],l,h,b,i)}else c.fnUpdate(a,e)},sName:'pagination'}));return b}function Ta(a,b,c){var d=a._iDisplayStart,e=a._iDisplayLength,f=a.fnRecordsDisplay();0===f||-1===e?d=0:'number'===typeof b?(d=b*e,d>f&&(d=0)):'first'==b?d=0:'previous'==b?(d=0<=e?d-e:0,0>d&&(d=0)):'next'==b?d+e<f&&(d+=e):'last'==b?d=Math.floor((f-1)/e)*e:K(a,0,'Unknown paging action: '+b,5);b=a._iDisplayStart!==d;a._iDisplayStart=d;b&&(r(a,null,'page',[a]),c&&P(a));return b}function rb(a){return h('<div/>',{id:!a.aanFeatures.r?a.sTableId+'_processing':null,'class':a.oClasses.sProcessing}).html(a.oLanguage.sProcessing).insertBefore(a.nTable)[0]}function C(a,b){a.oFeatures.bProcessing&&h(a.aanFeatures.r).css('display',b?'block':'none');r(a,null,'processing',[a,b])}function sb(a){var b=h(a.nTable);b.attr('role','grid');var c=a.oScroll;if(''===c.sX&&''===c.sY)return a.nTable;var d=c.sX,e=c.sY,f=a.oClasses,g=b.children('caption'),j=g.length?g[0]._captionSide:null,i=h(b[0].cloneNode(!1)),m=h(b[0].cloneNode(!1)),l=b.children('tfoot');l.length||(l=null);i=h('<div/>',{'class':f.sScrollWrapper}).append(h('<div/>',{'class':f.sScrollHead}).css({overflow:'hidden',position:'relative',border:0,width:d?!d?null:v(d):'100%'}).append(h('<div/>',{'class':f.sScrollHeadInner}).css({'box-sizing':'content-box',width:c.sXInner||'100%'}).append(i.removeAttr('id').css('margin-left',0).append('top'===j?g:null).append(b.children('thead'))))).append(h('<div/>',{'class':f.sScrollBody}).css({position:'relative',overflow:'auto',width:!d?null:v(d)}).append(b));l&&i.append(h('<div/>',{'class':f.sScrollFoot}).css({overflow:'hidden',border:0,width:d?!d?null:v(d):'100%'}).append(h('<div/>',{'class':f.sScrollFootInner}).append(m.removeAttr('id').css('margin-left',0).append('bottom'===j?g:null).append(b.children('tfoot')))));var b=i.children(),k=b[0],f=b[1],t=l?b[2]:null;if(d)h(f).on('scroll.DT',function(){var a=this.scrollLeft;k.scrollLeft=a;l&&(t.scrollLeft=a)});h(f).css(e&&c.bCollapse?'max-height':'height',e);a.nScrollHead=k;a.nScrollBody=f;a.nScrollFoot=t;a.aoDrawCallback.push({fn:la,sName:'scrolling'});return i[0]}function la(a){var b=a.oScroll,c=b.sX,d=b.sXInner,e=b.sY,b=b.iBarWidth,f=h(a.nScrollHead),g=f[0].style,j=f.children('div'),i=j[0].style,m=j.children('table'),j=a.nScrollBody,l=h(j),q=j.style,t=h(a.nScrollFoot).children('div'),n=t.children('table'),o=h(a.nTHead),p=h(a.nTable),s=p[0],r=s.style,u=a.nTFoot?h(a.nTFoot):null,x=a.oBrowser,U=x.bScrollOversize,Xb=D(a.aoColumns,'nTh'),Q,L,R,w,Ua=[],y=[],z=[],A=[],B,C=function(a){a=a.style;a.paddingTop='0';a.paddingBottom='0';a.borderTopWidth='0';a.borderBottomWidth='0';a.height=0};L=j.scrollHeight>j.clientHeight;if(a.scrollBarVis!==L&&a.scrollBarVis!==k)a.scrollBarVis=L,$(a);else{a.scrollBarVis=L;p.children('thead, tfoot').remove();u&&(R=u.clone().prependTo(p),Q=u.find('tr'),R=R.find('tr'));w=o.clone().prependTo(p);o=o.find('tr');L=w.find('tr');w.find('th, td').removeAttr('tabindex');c||(q.width='100%',f[0].style.width='100%');h.each(ra(a,w),function(b,c){B=aa(a,b);c.style.width=a.aoColumns[B].sWidth});u&&I(function(a){a.style.width=''},R);f=p.outerWidth();if(''===c){r.width='100%';if(U&&(p.find('tbody').height()>j.offsetHeight||'scroll'==l.css('overflow-y')))r.width=v(p.outerWidth()-b);f=p.outerWidth()}else''!==d&&(r.width=v(d),f=p.outerWidth());I(C,L);I(function(a){z.push(a.innerHTML);Ua.push(v(h(a).css('width')))},L);I(function(a,b){if(h.inArray(a,Xb)!==-1)a.style.width=Ua[b]},o);h(L).height(0);u&&(I(C,R),I(function(a){A.push(a.innerHTML);y.push(v(h(a).css('width')))},R),I(function(a,b){a.style.width=y[b]},Q),h(R).height(0));I(function(a,b){a.innerHTML='<div class="dataTables_sizing">'+z[b]+'</div>';a.childNodes[0].style.height='0';a.childNodes[0].style.overflow='hidden';a.style.width=Ua[b]},L);u&&I(function(a,b){a.innerHTML='<div class="dataTables_sizing">'+A[b]+'</div>';a.childNodes[0].style.height='0';a.childNodes[0].style.overflow='hidden';a.style.width=y[b]},R);if(p.outerWidth()<f){Q=j.scrollHeight>j.offsetHeight||'scroll'==l.css('overflow-y')?f+b:f;if(U&&(j.scrollHeight>j.offsetHeight||'scroll'==l.css('overflow-y')))r.width=v(Q-b);(''===c||''!==d)&&K(a,1,'Possible column misalignment',6)}else Q='100%';q.width=v(Q);g.width=v(Q);u&&(a.nScrollFoot.style.width=v(Q));!e&&U&&(q.height=v(s.offsetHeight+b));c=p.outerWidth();m[0].style.width=v(c);i.width=v(c);d=p.height()>j.clientHeight||'scroll'==l.css('overflow-y');e='padding'+(x.bScrollbarLeft?'Left':'Right');i[e]=d?b+'px':'0px';u&&(n[0].style.width=v(c),t[0].style.width=v(c),t[0].style[e]=d?b+'px':'0px');p.children('colgroup').insertBefore(p.children('thead'));l.scroll();if((a.bSorted||a.bFiltered)&&!a._drawHold)j.scrollTop=0}}function I(a,b,c){for(var d=0,e=0,f=b.length,g,j;e<f;){g=b[e].firstChild;for(j=c?c[e].firstChild:null;g;)1===g.nodeType&&(c?a(g,j,d):a(g,d),d++),g=g.nextSibling,j=c?j.nextSibling:null;e++}}function Fa(a){var b=a.nTable,c=a.aoColumns,d=a.oScroll,e=d.sY,f=d.sX,g=d.sXInner,j=c.length,i=ma(a,'bVisible'),m=h('th',a.nTHead),l=b.getAttribute('width'),k=b.parentNode,t=!1,n,o,p=a.oBrowser,d=p.bScrollOversize;(n=b.style.width)&&-1!==n.indexOf('%')&&(l=n);for(n=0;n<i.length;n++)o=c[i[n]],null!==o.sWidth&&(o.sWidth=Fb(o.sWidthOrig,k),t=!0);if(d||!t&&!f&&!e&&j==V(a)&&j==m.length)for(n=0;n<j;n++)i=aa(a,n),null!==i&&(c[i].sWidth=v(m.eq(n).width()));else{j=h(b).clone().css('visibility','hidden').removeAttr('id');j.find('tbody tr').remove();var s=h('<tr/>').appendTo(j.find('tbody'));j.find('thead, tfoot').remove();j.append(h(a.nTHead).clone()).append(h(a.nTFoot).clone());j.find('tfoot th, tfoot td').css('width','');m=ra(a,j.find('thead')[0]);for(n=0;n<i.length;n++)o=c[i[n]],m[n].style.width=null!==o.sWidthOrig&&''!==o.sWidthOrig?v(o.sWidthOrig):'',o.sWidthOrig&&f&&h(m[n]).append(h('<div/>').css({width:o.sWidthOrig,margin:0,padding:0,border:0,height:1}));if(a.aoData.length)for(n=0;n<i.length;n++)t=i[n],o=c[t],h(Gb(a,t)).clone(!1).append(o.sContentPadding).appendTo(s);h('[name]',j).removeAttr('name');o=h('<div/>').css(f||e?{position:'absolute',top:0,left:0,height:1,right:0,overflow:'hidden'}:{}).append(j).appendTo(k);f&&g?j.width(g):f?(j.css('width','auto'),j.removeAttr('width'),j.width()<k.clientWidth&&l&&j.width(k.clientWidth)):e?j.width(k.clientWidth):l&&j.width(l);for(n=e=0;n<i.length;n++)k=h(m[n]),g=k.outerWidth()-k.width(),k=p.bBounding?Math.ceil(m[n].getBoundingClientRect().width):k.outerWidth(),e+=k,c[i[n]].sWidth=v(k-g);b.style.width=v(e);o.remove()}l&&(b.style.width=v(l));if((l||f)&&!a._reszEvt)b=function(){h(E).on('resize.DT-'+a.sInstance,Oa(function(){$(a)}))},d?setTimeout(b,1E3):b(),a._reszEvt=!0}function Fb(a,b){if(!a)return 0;var c=h('<div/>').css('width',v(a)).appendTo(b||H.body),d=c[0].offsetWidth;c.remove();return d}function Gb(a,b){var c=Hb(a,b);if(0>c)return null;var d=a.aoData[c];return!d.nTr?h('<td/>').html(B(a,c,b,'display'))[0]:d.anCells[b]}function Hb(a,b){for(var c,d=-1,e=-1,f=0,g=a.aoData.length;f<g;f++)c=B(a,f,b,'display')+'',c=c.replace(Yb,''),c=c.replace(/&nbsp;/g,' '),c.length>d&&(d=c.length,e=f);return e}function v(a){return null===a?'0px':'number'==typeof a?0>a?'0px':a+'px':a.match(/\d$/)?a+'px':a}function X(a){var b,c,d=[],e=a.aoColumns,f,g,j,i;b=a.aaSortingFixed;c=h.isPlainObject(b);var m=[];f=function(a){a.length&&!h.isArray(a[0])?m.push(a):h.merge(m,a)};h.isArray(b)&&f(b);c&&b.pre&&f(b.pre);f(a.aaSorting);c&&b.post&&f(b.post);for(a=0;a<m.length;a++){i=m[a][0];f=e[i].aDataSort;b=0;for(c=f.length;b<c;b++)g=f[b],j=e[g].sType||'string',m[a]._idx===k&&(m[a]._idx=h.inArray(m[a][1],e[g].asSorting)),d.push({src:i,col:g,dir:m[a][1],index:m[a]._idx,type:j,formatter:n.ext.type.order[j+'-pre']})}return d}function nb(a){var b,c,d=[],e=n.ext.type.order,f=a.aoData,g=0,j,i=a.aiDisplayMaster,h;Ga(a);h=X(a);b=0;for(c=h.length;b<c;b++)j=h[b],j.formatter&&g++,Ib(a,j.col);if('ssp'!=y(a)&&0!==h.length){b=0;for(c=i.length;b<c;b++)d[i[b]]=b;g===h.length?i.sort(function(a,b){var c,e,g,j,i=h.length,k=f[a]._aSortData,n=f[b]._aSortData;for(g=0;g<i;g++)if(j=h[g],c=k[j.col],e=n[j.col],c=c<e?-1:c>e?1:0,0!==c)return'asc'===j.dir?c:-c;c=d[a];e=d[b];return c<e?-1:c>e?1:0}):i.sort(function(a,b){var c,g,j,i,k=h.length,n=f[a]._aSortData,o=f[b]._aSortData;for(j=0;j<k;j++)if(i=h[j],c=n[i.col],g=o[i.col],i=e[i.type+'-'+i.dir]||e['string-'+i.dir],c=i(c,g),0!==c)return c;c=d[a];g=d[b];return c<g?-1:c>g?1:0})}a.bSorted=!0}function Jb(a){for(var b,c,d=a.aoColumns,e=X(a),a=a.oLanguage.oAria,f=0,g=d.length;f<g;f++){c=d[f];var j=c.asSorting;b=c.sTitle.replace(/<.*?>/g,'');var i=c.nTh;i.removeAttribute('aria-sort');c.bSortable&&(0<e.length&&e[0].col==f?(i.setAttribute('aria-sort','asc'==e[0].dir?'ascending':'descending'),c=j[e[0].index+1]||j[0]):c=j[0],b+='asc'===c?a.sSortAscending:a.sSortDescending);i.setAttribute('aria-label',b)}}function Va(a,b,c,d){var e=a.aaSorting,f=a.aoColumns[b].asSorting,g=function(a,b){var c=a._idx;c===k&&(c=h.inArray(a[1],f));return c+1<f.length?c+1:b?null:0};'number'===typeof e[0]&&(e=a.aaSorting=[e]);c&&a.oFeatures.bSortMulti?(c=h.inArray(b,D(e,'0')),-1!==c?(b=g(e[c],!0),null===b&&1===e.length&&(b=0),null===b?e.splice(c,1):(e[c][1]=f[b],e[c]._idx=b)):(e.push([b,f[0],0]),e[e.length-1]._idx=0)):e.length&&e[0][0]==b?(b=g(e[0]),e.length=1,e[0][1]=f[b],e[0]._idx=b):(e.length=0,e.push([b,f[0]]),e[0]._idx=0);T(a);'function'==typeof d&&d(a)}function Ma(a,b,c,d){var e=a.aoColumns[c];Wa(b,{},function(b){!1!==e.bSortable&&(a.oFeatures.bProcessing?(C(a,!0),setTimeout(function(){Va(a,c,b.shiftKey,d);'ssp'!==y(a)&&C(a,!1)},0)):Va(a,c,b.shiftKey,d))})}function wa(a){var b=a.aLastSort,c=a.oClasses.sSortColumn,d=X(a),e=a.oFeatures,f,g;if(e.bSort&&e.bSortClasses){e=0;for(f=b.length;e<f;e++)g=b[e].src,h(D(a.aoData,'anCells',g)).removeClass(c+(2>e?e+1:3));e=0;for(f=d.length;e<f;e++)g=d[e].src,h(D(a.aoData,'anCells',g)).addClass(c+(2>e?e+1:3))}a.aLastSort=d}function Ib(a,b){var c=a.aoColumns[b],d=n.ext.order[c.sSortDataType],e;d&&(e=d.call(a.oInstance,a,b,ba(a,b)));for(var f,g=n.ext.type.order[c.sType+'-pre'],j=0,i=a.aoData.length;j<i;j++)if(c=a.aoData[j],c._aSortData||(c._aSortData=[]),!c._aSortData[b]||d)f=d?e[j]:B(a,j,b,'sort'),c._aSortData[b]=g?g(f):f}function xa(a){if(a.oFeatures.bStateSave&&!a.bDestroying){var b={time:+new Date,start:a._iDisplayStart,length:a._iDisplayLength,order:h.extend(!0,[],a.aaSorting),search:Bb(a.oPreviousSearch),columns:h.map(a.aoColumns,function(b,d){return{visible:b.bVisible,search:Bb(a.aoPreSearchCols[d])}})};r(a,'aoStateSaveParams','stateSaveParams',[a,b]);a.oSavedState=b;a.fnStateSaveCallback.call(a.oInstance,a,b)}}function Kb(a,b,c){var d,e,f=a.aoColumns,b=function(b){if(b&&b.time){var g=r(a,'aoStateLoadParams','stateLoadParams',[a,b]);if(-1===h.inArray(!1,g)&&(g=a.iStateDuration,!(0<g&&b.time<+new Date-1E3*g)&&!(b.columns&&f.length!==b.columns.length))){a.oLoadedState=h.extend(!0,{},b);b.start!==k&&(a._iDisplayStart=b.start,a.iInitDisplayStart=b.start);b.length!==k&&(a._iDisplayLength=b.length);b.order!==k&&(a.aaSorting=[],h.each(b.order,function(b,c){a.aaSorting.push(c[0]>=f.length?[0,c[1]]:c)}));b.search!==k&&h.extend(a.oPreviousSearch,Cb(b.search));if(b.columns){d=0;for(e=b.columns.length;d<e;d++)g=b.columns[d],g.visible!==k&&(f[d].bVisible=g.visible),g.search!==k&&h.extend(a.aoPreSearchCols[d],Cb(g.search))}r(a,'aoStateLoaded','stateLoaded',[a,b])}}c()};if(a.oFeatures.bStateSave){var g=a.fnStateLoadCallback.call(a.oInstance,a,b);g!==k&&b(g)}else c()}function ya(a){var b=n.settings,a=h.inArray(a,D(b,'nTable'));return-1!==a?b[a]:null}function K(a,b,c,d){c='DataTables warning: '+(a?'table id='+a.sTableId+' - ':'')+c;d&&(c+='. For more information about this error, please see http://datatables.net/tn/'+d);if(b)E.console&&console.log&&console.log(c);else if(b=n.ext,b=b.sErrMode||b.errMode,a&&r(a,null,'error',[a,d,c]),'alert'==b)alert(c);else{if('throw'==b)throw Error(c);'function'==typeof b&&b(a,d,c)}}function F(a,b,c,d){h.isArray(c)?h.each(c,function(c,d){h.isArray(d)?F(a,b,d[0],d[1]):F(a,b,d)}):(d===k&&(d=c),b[c]!==k&&(a[d]=b[c]))}function Xa(a,b,c){var d,e;for(e in b)b.hasOwnProperty(e)&&(d=b[e],h.isPlainObject(d)?(h.isPlainObject(a[e])||(a[e]={}),h.extend(!0,a[e],d)):a[e]=c&&'data'!==e&&'aaData'!==e&&h.isArray(d)?d.slice():d);return a}function Wa(a,b,c){h(a).on('click.DT',b,function(b){h(a).blur();c(b)}).on('keypress.DT',b,function(a){13===a.which&&(a.preventDefault(),c(a))}).on('selectstart.DT',function(){return!1})}function z(a,b,c,d){c&&a[b].push({fn:c,sName:d})}function r(a,b,c,d){var e=[];b&&(e=h.map(a[b].slice().reverse(),function(b){return b.fn.apply(a.oInstance,d)}));null!==c&&(b=h.Event(c+'.dt'),h(a.nTable).trigger(b,d),e.push(b.result));return e}function Sa(a){var b=a._iDisplayStart,c=a.fnDisplayEnd(),d=a._iDisplayLength;b>=c&&(b=c-d);b-=b%d;if(-1===d||0>b)b=0;a._iDisplayStart=b}function Na(a,b){var c=a.renderer,d=n.ext.renderer[b];return h.isPlainObject(c)&&c[b]?d[c[b]]||d._:'string'===typeof c?d[c]||d._:d._}function y(a){return a.oFeatures.bServerSide?'ssp':a.ajax||a.sAjaxSource?'ajax':'dom'}function ia(a,b){var c=[],c=Lb.numbers_length,d=Math.floor(c/2);b<=c?c=Y(0,b):a<=d?(c=Y(0,c-2),c.push('ellipsis'),c.push(b-1)):(a>=b-1-d?c=Y(b-(c-2),b):(c=Y(a-d+2,a+d-1),c.push('ellipsis'),c.push(b-1)),c.splice(0,0,'ellipsis'),c.splice(0,0,0));c.DT_el='span';return c}function Da(a){h.each({num:function(b){return za(b,a)},'num-fmt':function(b){return za(b,a,Ya)},'html-num':function(b){return za(b,a,Aa)},'html-num-fmt':function(b){return za(b,a,Aa,Ya)}},function(b,c){x.type.order[b+a+'-pre']=c;b.match(/^html\-/)&&(x.type.search[b+a]=x.type.search.html)})}function Mb(a){return function(){var b=[ya(this[n.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments));return n.ext.internal[a].apply(this,b)}}var n=function(a){this.$=function(a,b){return this.api(!0).$(a,b)};this._=function(a,b){return this.api(!0).rows(a,b).data()};this.api=function(a){return a?new s(ya(this[x.iApiIndex])):new s(this)};this.fnAddData=function(a,b){var c=this.api(!0),d=h.isArray(a)&&(h.isArray(a[0])||h.isPlainObject(a[0]))?c.rows.add(a):c.row.add(a);(b===k||b)&&c.draw();return d.flatten().toArray()};this.fnAdjustColumnSizing=function(a){var b=this.api(!0).columns.adjust(),c=b.settings()[0],d=c.oScroll;a===k||a?b.draw(!1):(''!==d.sX||''!==d.sY)&&la(c)};this.fnClearTable=function(a){var b=this.api(!0).clear();(a===k||a)&&b.draw()};this.fnClose=function(a){this.api(!0).row(a).child.hide()};this.fnDeleteRow=function(a,b,c){var d=this.api(!0),a=d.rows(a),e=a.settings()[0],h=e.aoData[a[0][0]];a.remove();b&&b.call(this,e,h);(c===k||c)&&d.draw();return h};this.fnDestroy=function(a){this.api(!0).destroy(a)};this.fnDraw=function(a){this.api(!0).draw(a)};this.fnFilter=function(a,b,c,d,e,h){e=this.api(!0);null===b||b===k?e.search(a,c,d,h):e.column(b).search(a,c,d,h);e.draw()};this.fnGetData=function(a,b){var c=this.api(!0);if(a!==k){var d=a.nodeName?a.nodeName.toLowerCase():'';return b!==k||'td'==d||'th'==d?c.cell(a,b).data():c.row(a).data()||null}return c.data().toArray()};this.fnGetNodes=function(a){var b=this.api(!0);return a!==k?b.row(a).node():b.rows().nodes().flatten().toArray()};this.fnGetPosition=function(a){var b=this.api(!0),c=a.nodeName.toUpperCase();return'TR'==c?b.row(a).index():'TD'==c||'TH'==c?(a=b.cell(a).index(),[a.row,a.columnVisible,a.column]):null};this.fnIsOpen=function(a){return this.api(!0).row(a).child.isShown()};this.fnOpen=function(a,b,c){return this.api(!0).row(a).child(b,c).show().child()[0]};this.fnPageChange=function(a,b){var c=this.api(!0).page(a);(b===k||b)&&c.draw(!1)};this.fnSetColumnVis=function(a,b,c){a=this.api(!0).column(a).visible(b);(c===k||c)&&a.columns.adjust().draw()};this.fnSettings=function(){return ya(this[x.iApiIndex])};this.fnSort=function(a){this.api(!0).order(a).draw()};this.fnSortListener=function(a,b,c){this.api(!0).order.listener(a,b,c)};this.fnUpdate=function(a,b,c,d,e){var h=this.api(!0);c===k||null===c?h.row(b).data(a):h.cell(b,c).data(a);(e===k||e)&&h.columns.adjust();(d===k||d)&&h.draw();return 0};this.fnVersionCheck=x.fnVersionCheck;var b=this,c=a===k,d=this.length;c&&(a={});this.oApi=this.internal=x.internal;for(var e in n.ext.internal)e&&(this[e]=Mb(e));this.each(function(){var e={},g=1<d?Xa(e,a,!0):a,j=0,i,e=this.getAttribute('id'),m=!1,l=n.defaults,q=h(this);if('table'!=this.nodeName.toLowerCase())K(null,0,'Non-table node initialisation ('+this.nodeName+')',2);else{fb(l);gb(l.column);J(l,l,!0);J(l.column,l.column,!0);J(l,h.extend(g,q.data()));var t=n.settings,j=0;for(i=t.length;j<i;j++){var o=t[j];if(o.nTable==this||o.nTHead&&o.nTHead.parentNode==this||o.nTFoot&&o.nTFoot.parentNode==this){var s=g.bRetrieve!==k?g.bRetrieve:l.bRetrieve;if(c||s)return o.oInstance;if(g.bDestroy!==k?g.bDestroy:l.bDestroy){o.oInstance.fnDestroy();break}else{K(o,0,'Cannot reinitialise DataTable',3);return}}if(o.sTableId==this.id){t.splice(j,1);break}}if(null===e||''===e)this.id=e='DataTables_Table_'+n.ext._unique++;var p=h.extend(!0,{},n.models.oSettings,{sDestroyWidth:q[0].style.width,sInstance:e,sTableId:e});p.nTable=this;p.oApi=b.internal;p.oInit=g;t.push(p);p.oInstance=1===b.length?b:q.dataTable();fb(g);Ca(g.oLanguage);g.aLengthMenu&&!g.iDisplayLength&&(g.iDisplayLength=h.isArray(g.aLengthMenu[0])?g.aLengthMenu[0][0]:g.aLengthMenu[0]);g=Xa(h.extend(!0,{},l),g);F(p.oFeatures,g,'bPaginate bLengthChange bFilter bSort bSortMulti bInfo bProcessing bAutoWidth bSortClasses bServerSide bDeferRender'.split(' '));F(p,g,['asStripeClasses','ajax','fnServerData','fnFormatNumber','sServerMethod','aaSorting','aaSortingFixed','aLengthMenu','sPaginationType','sAjaxSource','sAjaxDataProp','iStateDuration','sDom','bSortCellsTop','iTabIndex','fnStateLoadCallback','fnStateSaveCallback','renderer','searchDelay','rowId',['iCookieDuration','iStateDuration'],['oSearch','oPreviousSearch'],['aoSearchCols','aoPreSearchCols'],['iDisplayLength','_iDisplayLength']]);F(p.oScroll,g,[['sScrollX','sX'],['sScrollXInner','sXInner'],['sScrollY','sY'],['bScrollCollapse','bCollapse']]);F(p.oLanguage,g,'fnInfoCallback');z(p,'aoDrawCallback',g.fnDrawCallback,'user');z(p,'aoServerParams',g.fnServerParams,'user');z(p,'aoStateSaveParams',g.fnStateSaveParams,'user');z(p,'aoStateLoadParams',g.fnStateLoadParams,'user');z(p,'aoStateLoaded',g.fnStateLoaded,'user');z(p,'aoRowCallback',g.fnRowCallback,'user');z(p,'aoRowCreatedCallback',g.fnCreatedRow,'user');z(p,'aoHeaderCallback',g.fnHeaderCallback,'user');z(p,'aoFooterCallback',g.fnFooterCallback,'user');z(p,'aoInitComplete',g.fnInitComplete,'user');z(p,'aoPreDrawCallback',g.fnPreDrawCallback,'user');p.rowIdFn=S(g.rowId);hb(p);var u=p.oClasses;h.extend(u,n.ext.classes,g.oClasses);q.addClass(u.sTable);p.iInitDisplayStart===k&&(p.iInitDisplayStart=g.iDisplayStart,p._iDisplayStart=g.iDisplayStart);null!==g.iDeferLoading&&(p.bDeferLoading=!0,e=h.isArray(g.iDeferLoading),p._iRecordsDisplay=e?g.iDeferLoading[0]:g.iDeferLoading,p._iRecordsTotal=e?g.iDeferLoading[1]:g.iDeferLoading);var v=p.oLanguage;h.extend(!0,v,g.oLanguage);v.sUrl&&(h.ajax({dataType:'json',url:v.sUrl,success:function(a){Ca(a);J(l.oLanguage,a);h.extend(true,v,a);ha(p)},error:function(){ha(p)}}),m=!0);null===g.asStripeClasses&&(p.asStripeClasses=[u.sStripeOdd,u.sStripeEven]);var e=p.asStripeClasses,x=q.children('tbody').find('tr').eq(0);-1!==h.inArray(!0,h.map(e,function(a){return x.hasClass(a)}))&&(h('tbody tr',this).removeClass(e.join(' ')),p.asDestroyStripes=e.slice());e=[];t=this.getElementsByTagName('thead');0!==t.length&&(ea(p.aoHeader,t[0]),e=ra(p));if(null===g.aoColumns){t=[];j=0;for(i=e.length;j<i;j++)t.push(null)}else t=g.aoColumns;j=0;for(i=t.length;j<i;j++)Ea(p,e?e[j]:null);jb(p,g.aoColumnDefs,t,function(a,b){ka(p,a,b)});if(x.length){var w=function(a,b){return a.getAttribute('data-'+b)!==null?b:null};h(x[0]).children('th, td').each(function(a,b){var c=p.aoColumns[a];if(c.mData===a){var d=w(b,'sort')||w(b,'order'),e=w(b,'filter')||w(b,'search');if(d!==null||e!==null){c.mData={_:a+'.display',sort:d!==null?a+'.@data-'+d:k,type:d!==null?a+'.@data-'+d:k,filter:e!==null?a+'.@data-'+e:k};ka(p,a)}}})}var U=p.oFeatures,e=function(){if(g.aaSorting===k){var a=p.aaSorting;j=0;for(i=a.length;j<i;j++)a[j][1]=p.aoColumns[j].asSorting[0]}wa(p);U.bSort&&z(p,'aoDrawCallback',function(){if(p.bSorted){var a=X(p),b={};h.each(a,function(a,c){b[c.src]=c.dir});r(p,null,'order',[p,a,b]);Jb(p)}});z(p,'aoDrawCallback',function(){(p.bSorted||y(p)==='ssp'||U.bDeferRender)&&wa(p)},'sc');var a=q.children('caption').each(function(){this._captionSide=h(this).css('caption-side')}),b=q.children('thead');b.length===0&&(b=h('<thead/>').appendTo(q));p.nTHead=b[0];b=q.children('tbody');b.length===0&&(b=h('<tbody/>').appendTo(q));p.nTBody=b[0];b=q.children('tfoot');if(b.length===0&&a.length>0&&(p.oScroll.sX!==''||p.oScroll.sY!==''))b=h('<tfoot/>').appendTo(q);if(b.length===0||b.children().length===0)q.addClass(u.sNoFooter);else if(b.length>0){p.nTFoot=b[0];ea(p.aoFooter,p.nTFoot)}if(g.aaData)for(j=0;j<g.aaData.length;j++)O(p,g.aaData[j]);else(p.bDeferLoading||y(p)=='dom')&&na(p,h(p.nTBody).children('tr'));p.aiDisplay=p.aiDisplayMaster.slice();p.bInitialised=true;m===false&&ha(p)};g.bStateSave?(U.bStateSave=!0,z(p,'aoDrawCallback',xa,'state_save'),Kb(p,g,e)):e()}});b=null;return this},x,s,o,u,Za={},Nb=/[\r\n]/g,Aa=/<.*?>/g,Zb=/^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/,$b=RegExp('(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\|\\$|\\^|\\-)','g'),Ya=/[',$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi,M=function(a){return!a||!0===a||'-'===a?!0:!1},Ob=function(a){var b=parseInt(a,10);return!isNaN(b)&&isFinite(a)?b:null},Pb=function(a,b){Za[b]||(Za[b]=RegExp(Qa(b),'g'));return'string'===typeof a&&'.'!==b?a.replace(/\./g,'').replace(Za[b],'.'):a},$a=function(a,b,c){var d='string'===typeof a;if(M(a))return!0;b&&d&&(a=Pb(a,b));c&&d&&(a=a.replace(Ya,''));return!isNaN(parseFloat(a))&&isFinite(a)},Qb=function(a,b,c){return M(a)?!0:!(M(a)||'string'===typeof a)?null:$a(a.replace(Aa,''),b,c)?!0:null},D=function(a,b,c){var d=[],e=0,f=a.length;if(c!==k)for(;e<f;e++)a[e]&&a[e][b]&&d.push(a[e][b][c]);else for(;e<f;e++)a[e]&&d.push(a[e][b]);return d},ja=function(a,b,c,d){var e=[],f=0,g=b.length;if(d!==k)for(;f<g;f++)a[b[f]][c]&&e.push(a[b[f]][c][d]);else for(;f<g;f++)e.push(a[b[f]][c]);return e},Y=function(a,b){var c=[],d;b===k?(b=0,d=a):(d=b,b=a);for(var e=b;e<d;e++)c.push(e);return c},Rb=function(a){for(var b=[],c=0,d=a.length;c<d;c++)a[c]&&b.push(a[c]);return b},qa=function(a){var b;a:{if(!(2>a.length)){b=a.slice().sort();for(var c=b[0],d=1,e=b.length;d<e;d++){if(b[d]===c){b=!1;break a}c=b[d]}}b=!0}if(b)return a.slice();b=[];var e=a.length,f,g=0,d=0;a:for(;d<e;d++){c=a[d];for(f=0;f<g;f++)if(b[f]===c)continue a;b.push(c);g++}return b};n.util={throttle:function(a,b){var c=b!==k?b:200,d,e;return function(){var b=this,g=+new Date,j=arguments;d&&g<d+c?(clearTimeout(e),e=setTimeout(function(){d=k;a.apply(b,j)},c)):(d=g,a.apply(b,j))}},escapeRegex:function(a){return a.replace($b,'\\$1')}};var A=function(a,b,c){a[b]!==k&&(a[c]=a[b])},ca=/\[.*?\]$/,W=/\(\)$/,Qa=n.util.escapeRegex,va=h('<div>')[0],Wb=va.textContent!==k,Yb=/<.*?>/g,Oa=n.util.throttle,Sb=[],w=Array.prototype,ac=function(a){var b,c,d=n.settings,e=h.map(d,function(a){return a.nTable});if(a){if(a.nTable&&a.oApi)return[a];if(a.nodeName&&'table'===a.nodeName.toLowerCase())return b=h.inArray(a,e),-1!==b?[d[b]]:null;if(a&&'function'===typeof a.settings)return a.settings().toArray();'string'===typeof a?c=h(a):a instanceof h&&(c=a)}else return[];if(c)return c.map(function(){b=h.inArray(this,e);return-1!==b?d[b]:null}).toArray()};s=function(a,b){if(!(this instanceof s))return new s(a,b);var c=[],d=function(a){(a=ac(a))&&(c=c.concat(a))};if(h.isArray(a))for(var e=0,f=a.length;e<f;e++)d(a[e]);else d(a);this.context=qa(c);b&&h.merge(this,b);this.selector={rows:null,cols:null,opts:null};s.extend(this,this,Sb)};n.Api=s;h.extend(s.prototype,{any:function(){return 0!==this.count()},concat:w.concat,context:[],count:function(){return this.flatten().length},each:function(a){for(var b=0,c=this.length;b<c;b++)a.call(this,this[b],b,this);return this},eq:function(a){var b=this.context;return b.length>a?new s(b[a],this[a]):null},filter:function(a){var b=[];if(w.filter)b=w.filter.call(this,a,this);else for(var c=0,d=this.length;c<d;c++)a.call(this,this[c],c,this)&&b.push(this[c]);return new s(this.context,b)},flatten:function(){var a=[];return new s(this.context,a.concat.apply(a,this.toArray()))},join:w.join,indexOf:w.indexOf||function(a,b){for(var c=b||0,d=this.length;c<d;c++)if(this[c]===a)return c;return-1},iterator:function(a,b,c,d){var e=[],f,g,j,h,m,l=this.context,n,o,u=this.selector;'string'===typeof a&&(d=c,c=b,b=a,a=!1);g=0;for(j=l.length;g<j;g++){var r=new s(l[g]);if('table'===b)f=c.call(r,l[g],g),f!==k&&e.push(f);else if('columns'===b||'rows'===b)f=c.call(r,l[g],this[g],g),f!==k&&e.push(f);else if('column'===b||'column-rows'===b||'row'===b||'cell'===b){o=this[g];'column-rows'===b&&(n=Ba(l[g],u.opts));h=0;for(m=o.length;h<m;h++)f=o[h],f='cell'===b?c.call(r,l[g],f.row,f.column,g,h):c.call(r,l[g],f,g,h,n),f!==k&&e.push(f)}}return e.length||d?(a=new s(l,a?e.concat.apply([],e):e),b=a.selector,b.rows=u.rows,b.cols=u.cols,b.opts=u.opts,a):this},lastIndexOf:w.lastIndexOf||function(a,b){return this.indexOf.apply(this.toArray.reverse(),arguments)},length:0,map:function(a){var b=[];if(w.map)b=w.map.call(this,a,this);else for(var c=0,d=this.length;c<d;c++)b.push(a.call(this,this[c],c));return new s(this.context,b)},pluck:function(a){return this.map(function(b){return b[a]})},pop:w.pop,push:w.push,reduce:w.reduce||function(a,b){return ib(this,a,b,0,this.length,1)},reduceRight:w.reduceRight||function(a,b){return ib(this,a,b,this.length-1,-1,-1)},reverse:w.reverse,selector:null,shift:w.shift,slice:function(){return new s(this.context,this)},sort:w.sort,splice:w.splice,toArray:function(){return w.slice.call(this)},to$:function(){return h(this)},toJQuery:function(){return h(this)},unique:function(){return new s(this.context,qa(this))},unshift:w.unshift});s.extend=function(a,b,c){if(c.length&&b&&(b instanceof s||b.__dt_wrapper)){var d,e,f,g=function(a,b,c){return function(){var d=b.apply(a,arguments);s.extend(d,d,c.methodExt);return d}};d=0;for(e=c.length;d<e;d++)f=c[d],b[f.name]='function'===typeof f.val?g(a,f.val,f):h.isPlainObject(f.val)?{}:f.val,b[f.name].__dt_wrapper=!0,s.extend(a,b[f.name],f.propExt)}};s.register=o=function(a,b){if(h.isArray(a))for(var c=0,d=a.length;c<d;c++)s.register(a[c],b);else for(var e=a.split('.'),f=Sb,g,j,c=0,d=e.length;c<d;c++){g=(j=-1!==e[c].indexOf('()'))?e[c].replace('()',''):e[c];var i;a:{i=0;for(var m=f.length;i<m;i++)if(f[i].name===g){i=f[i];break a}i=null}i||(i={name:g,val:{},methodExt:[],propExt:[]},f.push(i));c===d-1?i.val=b:f=j?i.methodExt:i.propExt}};s.registerPlural=u=function(a,b,c){s.register(a,c);s.register(b,function(){var a=c.apply(this,arguments);return a===this?this:a instanceof s?a.length?h.isArray(a[0])?new s(a.context,a[0]):a[0]:k:a})};o('tables()',function(a){var b;if(a){b=s;var c=this.context;if('number'===typeof a)a=[c[a]];else var d=h.map(c,function(a){return a.nTable}),a=h(d).filter(a).map(function(){var a=h.inArray(this,d);return c[a]}).toArray();b=new b(a)}else b=this;return b});o('table()',function(a){var a=this.tables(a),b=a.context;return b.length?new s(b[0]):a});u('tables().nodes()','table().node()',function(){return this.iterator('table',function(a){return a.nTable},1)});u('tables().body()','table().body()',function(){return this.iterator('table',function(a){return a.nTBody},1)});u('tables().header()','table().header()',function(){return this.iterator('table',function(a){return a.nTHead},1)});u('tables().footer()','table().footer()',function(){return this.iterator('table',function(a){return a.nTFoot},1)});u('tables().containers()','table().container()',function(){return this.iterator('table',function(a){return a.nTableWrapper},1)});o('draw()',function(a){return this.iterator('table',function(b){'page'===a?P(b):('string'===typeof a&&(a='full-hold'===a?!1:!0),T(b,!1===a))})});o('page()',function(a){return a===k?this.page.info().page:this.iterator('table',function(b){Ta(b,a)})});o('page.info()',function(){if(0===this.context.length)return k;var a=this.context[0],b=a._iDisplayStart,c=a.oFeatures.bPaginate?a._iDisplayLength:-1,d=a.fnRecordsDisplay(),e=-1===c;return{page:e?0:Math.floor(b/c),pages:e?1:Math.ceil(d/c),start:b,end:a.fnDisplayEnd(),length:c,recordsTotal:a.fnRecordsTotal(),recordsDisplay:d,serverSide:'ssp'===y(a)}});o('page.len()',function(a){return a===k?0!==this.context.length?this.context[0]._iDisplayLength:k:this.iterator('table',function(b){Ra(b,a)})});var Tb=function(a,b,c){if(c){var d=new s(a);d.one('draw',function(){c(d.ajax.json())})}if('ssp'==y(a))T(a,b);else{C(a,!0);var e=a.jqXHR;e&&4!==e.readyState&&e.abort();sa(a,[],function(c){oa(a);for(var c=ta(a,c),d=0,e=c.length;d<e;d++)O(a,c[d]);T(a,b);C(a,!1)})}};o('ajax.json()',function(){var a=this.context;if(0<a.length)return a[0].json});o('ajax.params()',function(){var a=this.context;if(0<a.length)return a[0].oAjaxData});o('ajax.reload()',function(a,b){return this.iterator('table',function(c){Tb(c,!1===b,a)})});o('ajax.url()',function(a){var b=this.context;if(a===k){if(0===b.length)return k;b=b[0];return b.ajax?h.isPlainObject(b.ajax)?b.ajax.url:b.ajax:b.sAjaxSource}return this.iterator('table',function(b){h.isPlainObject(b.ajax)?b.ajax.url=a:b.ajax=a})});o('ajax.url().load()',function(a,b){return this.iterator('table',function(c){Tb(c,!1===b,a)})});var ab=function(a,b,c,d,e){var f=[],g,j,i,m,l,n;i=typeof b;if(!b||'string'===i||'function'===i||b.length===k)b=[b];i=0;for(m=b.length;i<m;i++){j=b[i]&&b[i].split&&!b[i].match(/[\[\(:]/)?b[i].split(','):[b[i]];l=0;for(n=j.length;l<n;l++)(g=c('string'===typeof j[l]?h.trim(j[l]):j[l]))&&g.length&&(f=f.concat(g))}a=x.selector[a];if(a.length){i=0;for(m=a.length;i<m;i++)f=a[i](d,e,f)}return qa(f)},bb=function(a){a||(a={});a.filter&&a.search===k&&(a.search=a.filter);return h.extend({search:'none',order:'current',page:'all'},a)},cb=function(a){for(var b=0,c=a.length;b<c;b++)if(0<a[b].length)return a[0]=a[b],a[0].length=1,a.length=1,a.context=[a.context[b]],a;a.length=0;return a},Ba=function(a,b){var c,d,e,f=[],g=a.aiDisplay;e=a.aiDisplayMaster;var j=b.search;c=b.order;d=b.page;if('ssp'==y(a))return'removed'===j?[]:Y(0,e.length);if('current'==d){c=a._iDisplayStart;for(d=a.fnDisplayEnd();c<d;c++)f.push(g[c])}else if('current'==c||'applied'==c){if('none'==j)f=e.slice();else if('applied'==j)f=g.slice();else{if('removed'==j){var i={};c=0;for(d=g.length;c<d;c++)i[g[c]]=null;f=h.map(e,function(a){return!i.hasOwnProperty(a)?a:null})}}}else if('index'==c||'original'==c){c=0;for(d=a.aoData.length;c<d;c++)'none'==j?f.push(c):(e=h.inArray(c,g),(-1===e&&'removed'==j||0<=e&&'applied'==j)&&f.push(c))}return f};o('rows()',function(a,b){a===k?a='':h.isPlainObject(a)&&(b=a,a='');var b=bb(b),c=this.iterator('table',function(c){var e=b,f;return ab('row',a,function(a){var b=Ob(a),i=c.aoData;if(b!==null&&!e)return[b];f||(f=Ba(c,e));if(b!==null&&h.inArray(b,f)!==-1)return[b];if(a===null||a===k||a==='')return f;if(typeof a==='function')return h.map(f,function(b){var c=i[b];return a(b,c._aData,c.nTr)?b:null});if(a.nodeName){var b=a._DT_RowIndex,m=a._DT_CellIndex;if(b!==k)return i[b]&&i[b].nTr===a?[b]:[];if(m)return i[m.row]&&i[m.row].nTr===a?[m.row]:[];b=h(a).closest('*[data-dt-row]');return b.length?[b.data('dt-row')]:[]}if(typeof a==='string'&&a.charAt(0)==='#'){b=c.aIds[a.replace(/^#/,'')];if(b!==k)return[b.idx]}b=Rb(ja(c.aoData,f,'nTr'));return h(b).filter(a).map(function(){return this._DT_RowIndex}).toArray()},c,e)},1);c.selector.rows=a;c.selector.opts=b;return c});o('rows().nodes()',function(){return this.iterator('row',function(a,b){return a.aoData[b].nTr||k},1)});o('rows().data()',function(){return this.iterator(!0,'rows',function(a,b){return ja(a.aoData,b,'_aData')},1)});u('rows().cache()','row().cache()',function(a){return this.iterator('row',function(b,c){var d=b.aoData[c];return'search'===a?d._aFilterData:d._aSortData},1)});u('rows().invalidate()','row().invalidate()',function(a){return this.iterator('row',function(b,c){da(b,c,a)})});u('rows().indexes()','row().index()',function(){return this.iterator('row',function(a,b){return b},1)});u('rows().ids()','row().id()',function(a){for(var b=[],c=this.context,d=0,e=c.length;d<e;d++)for(var f=0,g=this[d].length;f<g;f++){var h=c[d].rowIdFn(c[d].aoData[this[d][f]]._aData);b.push((!0===a?'#':'')+h)}return new s(c,b)});u('rows().remove()','row().remove()',function(){var a=this;this.iterator('row',function(b,c,d){var e=b.aoData,f=e[c],g,h,i,m,l;e.splice(c,1);g=0;for(h=e.length;g<h;g++)if(i=e[g],l=i.anCells,null!==i.nTr&&(i.nTr._DT_RowIndex=g),null!==l){i=0;for(m=l.length;i<m;i++)l[i]._DT_CellIndex.row=g}pa(b.aiDisplayMaster,c);pa(b.aiDisplay,c);pa(a[d],c,!1);0<b._iRecordsDisplay&&b._iRecordsDisplay--;Sa(b);c=b.rowIdFn(f._aData);c!==k&&delete b.aIds[c]});this.iterator('table',function(a){for(var c=0,d=a.aoData.length;c<d;c++)a.aoData[c].idx=c});return this});o('rows.add()',function(a){var b=this.iterator('table',function(b){var c,f,g,h=[];f=0;for(g=a.length;f<g;f++)c=a[f],c.nodeName&&'TR'===c.nodeName.toUpperCase()?h.push(na(b,c)[0]):h.push(O(b,c));return h},1),c=this.rows(-1);c.pop();h.merge(c,b);return c});o('row()',function(a,b){return cb(this.rows(a,b))});o('row().data()',function(a){var b=this.context;if(a===k)return b.length&&this.length?b[0].aoData[this[0]]._aData:k;var c=b[0].aoData[this[0]];c._aData=a;h.isArray(a)&&c.nTr.id&&N(b[0].rowId)(a,c.nTr.id);da(b[0],this[0],'data');return this});o('row().node()',function(){var a=this.context;return a.length&&this.length?a[0].aoData[this[0]].nTr||null:null});o('row.add()',function(a){a instanceof h&&a.length&&(a=a[0]);var b=this.iterator('table',function(b){return a.nodeName&&'TR'===a.nodeName.toUpperCase()?na(b,a)[0]:O(b,a)});return this.row(b[0])});var db=function(a,b){var c=a.context;if(c.length&&(c=c[0].aoData[b!==k?b:a[0]])&&c._details)c._details.remove(),c._detailsShow=k,c._details=k},Ub=function(a,b){var c=a.context;if(c.length&&a.length){var d=c[0].aoData[a[0]];if(d._details){(d._detailsShow=b)?d._details.insertAfter(d.nTr):d._details.detach();var e=c[0],f=new s(e),g=e.aoData;f.off('draw.dt.DT_details column-visibility.dt.DT_details destroy.dt.DT_details');0<D(g,'_details').length&&(f.on('draw.dt.DT_details',function(a,b){e===b&&f.rows({page:'current'}).eq(0).each(function(a){a=g[a];a._detailsShow&&a._details.insertAfter(a.nTr)})}),f.on('column-visibility.dt.DT_details',function(a,b){if(e===b)for(var c,d=V(b),f=0,h=g.length;f<h;f++)c=g[f],c._details&&c._details.children('td[colspan]').attr('colspan',d)}),f.on('destroy.dt.DT_details',function(a,b){if(e===b)for(var c=0,d=g.length;c<d;c++)g[c]._details&&db(f,c)}))}}};o('row().child()',function(a,b){var c=this.context;if(a===k)return c.length&&this.length?c[0].aoData[this[0]]._details:k;if(!0===a)this.child.show();else if(!1===a)db(this);else if(c.length&&this.length){var d=c[0],c=c[0].aoData[this[0]],e=[],f=function(a,b){if(h.isArray(a)||a instanceof h)for(var c=0,k=a.length;c<k;c++)f(a[c],b);else a.nodeName&&'tr'===a.nodeName.toLowerCase()?e.push(a):(c=h('<tr><td/></tr>').addClass(b),h('td',c).addClass(b).html(a)[0].colSpan=V(d),e.push(c[0]))};f(a,b);c._details&&c._details.detach();c._details=h(e);c._detailsShow&&c._details.insertAfter(c.nTr)}return this});o(['row().child.show()','row().child().show()'],function(){Ub(this,!0);return this});o(['row().child.hide()','row().child().hide()'],function(){Ub(this,!1);return this});o(['row().child.remove()','row().child().remove()'],function(){db(this);return this});o('row().child.isShown()',function(){var a=this.context;return a.length&&this.length?a[0].aoData[this[0]]._detailsShow||!1:!1});var bc=/^([^:]+):(name|visIdx|visible)$/,Vb=function(a,b,c,d,e){for(var c=[],d=0,f=e.length;d<f;d++)c.push(B(a,e[d],b));return c};o('columns()',function(a,b){a===k?a='':h.isPlainObject(a)&&(b=a,a='');var b=bb(b),c=this.iterator('table',function(c){var e=a,f=b,g=c.aoColumns,j=D(g,'sName'),i=D(g,'nTh');return ab('column',e,function(a){var b=Ob(a);if(a==='')return Y(g.length);if(b!==null)return[b>=0?b:g.length+b];if(typeof a==='function'){var e=Ba(c,f);return h.map(g,function(b,f){return a(f,Vb(c,f,0,0,e),i[f])?f:null})}var k=typeof a==='string'?a.match(bc):'';if(k)switch(k[2]){case'visIdx':case'visible':b=parseInt(k[1],10);if(b<0){var n=h.map(g,function(a,b){return a.bVisible?b:null});return[n[n.length+b]]}return[aa(c,b)];case'name':return h.map(j,function(a,b){return a===k[1]?b:null});default:return[];}if(a.nodeName&&a._DT_CellIndex)return[a._DT_CellIndex.column];b=h(i).filter(a).map(function(){return h.inArray(this,i)}).toArray();if(b.length||!a.nodeName)return b;b=h(a).closest('*[data-dt-column]');return b.length?[b.data('dt-column')]:[]},c,f)},1);c.selector.cols=a;c.selector.opts=b;return c});u('columns().header()','column().header()',function(){return this.iterator('column',function(a,b){return a.aoColumns[b].nTh},1)});u('columns().footer()','column().footer()',function(){return this.iterator('column',function(a,b){return a.aoColumns[b].nTf},1)});u('columns().data()','column().data()',function(){return this.iterator('column-rows',Vb,1)});u('columns().dataSrc()','column().dataSrc()',function(){return this.iterator('column',function(a,b){return a.aoColumns[b].mData},1)});u('columns().cache()','column().cache()',function(a){return this.iterator('column-rows',function(b,c,d,e,f){return ja(b.aoData,f,'search'===a?'_aFilterData':'_aSortData',c)},1)});u('columns().nodes()','column().nodes()',function(){return this.iterator('column-rows',function(a,b,c,d,e){return ja(a.aoData,e,'anCells',b)},1)});u('columns().visible()','column().visible()',function(a,b){var c=this.iterator('column',function(b,c){if(a===k)return b.aoColumns[c].bVisible;var f=b.aoColumns,g=f[c],j=b.aoData,i,m,l;if(a!==k&&g.bVisible!==a){if(a){var n=h.inArray(!0,D(f,'bVisible'),c+1);i=0;for(m=j.length;i<m;i++)l=j[i].nTr,f=j[i].anCells,l&&l.insertBefore(f[c],f[n]||null)}else h(D(b.aoData,'anCells',c)).detach();g.bVisible=a;fa(b,b.aoHeader);fa(b,b.aoFooter);b.aiDisplay.length||h(b.nTBody).find('td[colspan]').attr('colspan',V(b));xa(b)}});a!==k&&(this.iterator('column',function(c,e){r(c,null,'column-visibility',[c,e,a,b])}),(b===k||b)&&this.columns.adjust());return c});u('columns().indexes()','column().index()',function(a){return this.iterator('column',function(b,c){return'visible'===a?ba(b,c):c},1)});o('columns.adjust()',function(){return this.iterator('table',function(a){$(a)},1)});o('column.index()',function(a,b){if(0!==this.context.length){var c=this.context[0];if('fromVisible'===a||'toData'===a)return aa(c,b);if('fromData'===a||'toVisible'===a)return ba(c,b)}});o('column()',function(a,b){return cb(this.columns(a,b))});o('cells()',function(a,b,c){h.isPlainObject(a)&&(a.row===k?(c=a,a=null):(c=b,b=null));h.isPlainObject(b)&&(c=b,b=null);if(null===b||b===k)return this.iterator('table',function(b){var d=a,e=bb(c),f=b.aoData,g=Ba(b,e),j=Rb(ja(f,g,'anCells')),i=h([].concat.apply([],j)),l,m=b.aoColumns.length,n,o,u,s,r,v;return ab('cell',d,function(a){var c=typeof a==='function';if(a===null||a===k||c){n=[];o=0;for(u=g.length;o<u;o++){l=g[o];for(s=0;s<m;s++){r={row:l,column:s};if(c){v=f[l];a(r,B(b,l,s),v.anCells?v.anCells[s]:null)&&n.push(r)}else n.push(r)}}return n}if(h.isPlainObject(a))return a.column!==k&&a.row!==k&&h.inArray(a.row,g)!==-1?[a]:[];c=i.filter(a).map(function(a,b){return{row:b._DT_CellIndex.row,column:b._DT_CellIndex.column}}).toArray();if(c.length||!a.nodeName)return c;v=h(a).closest('*[data-dt-row]');return v.length?[{row:v.data('dt-row'),column:v.data('dt-column')}]:[]},b,e)});var d=this.columns(b),e=this.rows(a),f,g,j,i,m;this.iterator('table',function(a,b){f=[];g=0;for(j=e[b].length;g<j;g++){i=0;for(m=d[b].length;i<m;i++)f.push({row:e[b][g],column:d[b][i]})}},1);var l=this.cells(f,c);h.extend(l.selector,{cols:b,rows:a,opts:c});return l});u('cells().nodes()','cell().node()',function(){return this.iterator('cell',function(a,b,c){return(a=a.aoData[b])&&a.anCells?a.anCells[c]:k},1)});o('cells().data()',function(){return this.iterator('cell',function(a,b,c){return B(a,b,c)},1)});u('cells().cache()','cell().cache()',function(a){a='search'===a?'_aFilterData':'_aSortData';return this.iterator('cell',function(b,c,d){return b.aoData[c][a][d]},1)});u('cells().render()','cell().render()',function(a){return this.iterator('cell',function(b,c,d){return B(b,c,d,a)},1)});u('cells().indexes()','cell().index()',function(){return this.iterator('cell',function(a,b,c){return{row:b,column:c,columnVisible:ba(a,c)}},1)});u('cells().invalidate()','cell().invalidate()',function(a){return this.iterator('cell',function(b,c,d){da(b,c,a,d)})});o('cell()',function(a,b,c){return cb(this.cells(a,b,c))});o('cell().data()',function(a){var b=this.context,c=this[0];if(a===k)return b.length&&c.length?B(b[0],c[0].row,c[0].column):k;kb(b[0],c[0].row,c[0].column,a);da(b[0],c[0].row,'data',c[0].column);return this});o('order()',function(a,b){var c=this.context;if(a===k)return 0!==c.length?c[0].aaSorting:k;'number'===typeof a?a=[[a,b]]:a.length&&!h.isArray(a[0])&&(a=Array.prototype.slice.call(arguments));return this.iterator('table',function(b){b.aaSorting=a.slice()})});o('order.listener()',function(a,b,c){return this.iterator('table',function(d){Ma(d,a,b,c)})});o('order.fixed()',function(a){if(!a){var b=this.context,b=b.length?b[0].aaSortingFixed:k;return h.isArray(b)?{pre:b}:b}return this.iterator('table',function(b){b.aaSortingFixed=h.extend(!0,{},a)})});o(['columns().order()','column().order()'],function(a){var b=this;return this.iterator('table',function(c,d){var e=[];h.each(b[d],function(b,c){e.push([c,a])});c.aaSorting=e})});o('search()',function(a,b,c,d){var e=this.context;return a===k?0!==e.length?e[0].oPreviousSearch.sSearch:k:this.iterator('table',function(e){e.oFeatures.bFilter&&ga(e,h.extend({},e.oPreviousSearch,{sSearch:a+'',bRegex:null===b?!1:b,bSmart:null===c?!0:c,bCaseInsensitive:null===d?!0:d}),1)})});u('columns().search()','column().search()',function(a,b,c,d){return this.iterator('column',function(e,f){var g=e.aoPreSearchCols;if(a===k)return g[f].sSearch;e.oFeatures.bFilter&&(h.extend(g[f],{sSearch:a+'',bRegex:null===b?!1:b,bSmart:null===c?!0:c,bCaseInsensitive:null===d?!0:d}),ga(e,e.oPreviousSearch,1))})});o('state()',function(){return this.context.length?this.context[0].oSavedState:null});o('state.clear()',function(){return this.iterator('table',function(a){a.fnStateSaveCallback.call(a.oInstance,a,{})})});o('state.loaded()',function(){return this.context.length?this.context[0].oLoadedState:null});o('state.save()',function(){return this.iterator('table',function(a){xa(a)})});n.versionCheck=n.fnVersionCheck=function(a){for(var b=n.version.split('.'),a=a.split('.'),c,d,e=0,f=a.length;e<f;e++)if(c=parseInt(b[e],10)||0,d=parseInt(a[e],10)||0,c!==d)return c>d;return!0};n.isDataTable=n.fnIsDataTable=function(a){var b=h(a).get(0),c=!1;if(a instanceof n.Api)return!0;h.each(n.settings,function(a,e){var f=e.nScrollHead?h('table',e.nScrollHead)[0]:null,g=e.nScrollFoot?h('table',e.nScrollFoot)[0]:null;if(e.nTable===b||f===b||g===b)c=!0});return c};n.tables=n.fnTables=function(a){var b=!1;h.isPlainObject(a)&&(b=a.api,a=a.visible);var c=h.map(n.settings,function(b){if(!a||a&&h(b.nTable).is(':visible'))return b.nTable});return b?new s(c):c};n.camelToHungarian=J;o('$()',function(a,b){var c=this.rows(b).nodes(),c=h(c);return h([].concat(c.filter(a).toArray(),c.find(a).toArray()))});h.each(['on','one','off'],function(a,b){o(b+'()',function(){var a=Array.prototype.slice.call(arguments);a[0]=h.map(a[0].split(/\s/),function(a){return!a.match(/\.dt\b/)?a+'.dt':a}).join(' ');var d=h(this.tables().nodes());d[b].apply(d,a);return this})});o('clear()',function(){return this.iterator('table',function(a){oa(a)})});o('settings()',function(){return new s(this.context,this.context)});o('init()',function(){var a=this.context;return a.length?a[0].oInit:null});o('data()',function(){return this.iterator('table',function(a){return D(a.aoData,'_aData')}).flatten()});o('destroy()',function(a){a=a||!1;return this.iterator('table',function(b){var c=b.nTableWrapper.parentNode,d=b.oClasses,e=b.nTable,f=b.nTBody,g=b.nTHead,j=b.nTFoot,i=h(e),f=h(f),k=h(b.nTableWrapper),l=h.map(b.aoData,function(a){return a.nTr}),o;b.bDestroying=!0;r(b,'aoDestroyCallback','destroy',[b]);a||new s(b).columns().visible(!0);k.off('.DT').find(':not(tbody *)').off('.DT');h(E).off('.DT-'+b.sInstance);e!=g.parentNode&&(i.children('thead').detach(),i.append(g));j&&e!=j.parentNode&&(i.children('tfoot').detach(),i.append(j));b.aaSorting=[];b.aaSortingFixed=[];wa(b);h(l).removeClass(b.asStripeClasses.join(' '));h('th, td',g).removeClass(d.sSortable+' '+d.sSortableAsc+' '+d.sSortableDesc+' '+d.sSortableNone);f.children().detach();f.append(l);g=a?'remove':'detach';i[g]();k[g]();!a&&c&&(c.insertBefore(e,b.nTableReinsertBefore),i.css('width',b.sDestroyWidth).removeClass(d.sTable),(o=b.asDestroyStripes.length)&&f.children().each(function(a){h(this).addClass(b.asDestroyStripes[a%o])}));c=h.inArray(b,n.settings);-1!==c&&n.settings.splice(c,1)})});h.each(['column','row','cell'],function(a,b){o(b+'s().every()',function(a){var d=this.selector.opts,e=this;return this.iterator(b,function(f,g,h,i,m){a.call(e[b](g,'cell'===b?h:d,'cell'===b?d:k),g,h,i,m)})})});o('i18n()',function(a,b,c){var d=this.context[0],a=S(a)(d.oLanguage);a===k&&(a=b);c!==k&&h.isPlainObject(a)&&(a=a[c]!==k?a[c]:a._);return a.replace('%d',c)});n.version='1.10.19';n.settings=[];n.models={};n.models.oSearch={bCaseInsensitive:!0,sSearch:'',bRegex:!1,bSmart:!0};n.models.oRow={nTr:null,anCells:null,_aData:[],_aSortData:null,_aFilterData:null,_sFilterRow:null,_sRowStripe:'',src:null,idx:-1};n.models.oColumn={idx:null,aDataSort:null,asSorting:null,bSearchable:null,bSortable:null,bVisible:null,_sManualType:null,_bAttrSrc:!1,fnCreatedCell:null,fnGetData:null,fnSetData:null,mData:null,mRender:null,nTh:null,nTf:null,sClass:null,sContentPadding:null,sDefaultContent:null,sName:null,sSortDataType:'std',sSortingClass:null,sSortingClassJUI:null,sTitle:null,sType:null,sWidth:null,sWidthOrig:null};n.defaults={aaData:null,aaSorting:[[0,'asc']],aaSortingFixed:[],ajax:null,aLengthMenu:[10,25,50,100],aoColumns:null,aoColumnDefs:null,aoSearchCols:[],asStripeClasses:null,bAutoWidth:!0,bDeferRender:!1,bDestroy:!1,bFilter:!0,bInfo:!0,bLengthChange:!0,bPaginate:!0,bProcessing:!1,bRetrieve:!1,bScrollCollapse:!1,bServerSide:!1,bSort:!0,bSortMulti:!0,bSortCellsTop:!1,bSortClasses:!0,bStateSave:!1,fnCreatedRow:null,fnDrawCallback:null,fnFooterCallback:null,fnFormatNumber:function(a){return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g,this.oLanguage.sThousands)},fnHeaderCallback:null,fnInfoCallback:null,fnInitComplete:null,fnPreDrawCallback:null,fnRowCallback:null,fnServerData:null,fnServerParams:null,fnStateLoadCallback:function(a){try{return JSON.parse((-1===a.iStateDuration?sessionStorage:localStorage).getItem('DataTables_'+a.sInstance+'_'+location.pathname))}catch(b){}},fnStateLoadParams:null,fnStateLoaded:null,fnStateSaveCallback:function(a,b){try{(-1===a.iStateDuration?sessionStorage:localStorage).setItem('DataTables_'+a.sInstance+'_'+location.pathname,JSON.stringify(b))}catch(c){}},fnStateSaveParams:null,iStateDuration:7200,iDeferLoading:null,iDisplayLength:10,iDisplayStart:0,iTabIndex:0,oClasses:{},oLanguage:{oAria:{sSortAscending:': activate to sort column ascending',sSortDescending:': activate to sort column descending'},oPaginate:{sFirst:'First',sLast:'Last',sNext:'Next',sPrevious:'Previous'},sEmptyTable:'No data available in table',sInfo:'Showing _START_ to _END_ of _TOTAL_ entries',sInfoEmpty:'Showing 0 to 0 of 0 entries',sInfoFiltered:'(filtered from _MAX_ total entries)',sInfoPostFix:'',sDecimal:'',sThousands:',',sLengthMenu:'Show _MENU_ entries',sLoadingRecords:'Loading...',sProcessing:'Processing...',sSearch:'Search:',sSearchPlaceholder:'',sUrl:'',sZeroRecords:'No matching records found'},oSearch:h.extend({},n.models.oSearch),sAjaxDataProp:'data',sAjaxSource:null,sDom:'lfrtip',searchDelay:null,sPaginationType:'simple_numbers',sScrollX:'',sScrollXInner:'',sScrollY:'',sServerMethod:'GET',renderer:null,rowId:'DT_RowId'};Z(n.defaults);n.defaults.column={aDataSort:null,iDataSort:-1,asSorting:['asc','desc'],bSearchable:!0,bSortable:!0,bVisible:!0,fnCreatedCell:null,mData:null,mRender:null,sCellType:'td',sClass:'',sContentPadding:'',sDefaultContent:null,sName:'',sSortDataType:'std',sTitle:null,sType:null,sWidth:null};Z(n.defaults.column);n.models.oSettings={oFeatures:{bAutoWidth:null,bDeferRender:null,bFilter:null,bInfo:null,bLengthChange:null,bPaginate:null,bProcessing:null,bServerSide:null,bSort:null,bSortMulti:null,bSortClasses:null,bStateSave:null},oScroll:{bCollapse:null,iBarWidth:0,sX:null,sXInner:null,sY:null},oLanguage:{fnInfoCallback:null},oBrowser:{bScrollOversize:!1,bScrollbarLeft:!1,bBounding:!1,barWidth:0},ajax:null,aanFeatures:[],aoData:[],aiDisplay:[],aiDisplayMaster:[],aIds:{},aoColumns:[],aoHeader:[],aoFooter:[],oPreviousSearch:{},aoPreSearchCols:[],aaSorting:null,aaSortingFixed:[],asStripeClasses:null,asDestroyStripes:[],sDestroyWidth:0,aoRowCallback:[],aoHeaderCallback:[],aoFooterCallback:[],aoDrawCallback:[],aoRowCreatedCallback:[],aoPreDrawCallback:[],aoInitComplete:[],aoStateSaveParams:[],aoStateLoadParams:[],aoStateLoaded:[],sTableId:'',nTable:null,nTHead:null,nTFoot:null,nTBody:null,nTableWrapper:null,bDeferLoading:!1,bInitialised:!1,aoOpenRows:[],sDom:null,searchDelay:null,sPaginationType:'two_button',iStateDuration:0,aoStateSave:[],aoStateLoad:[],oSavedState:null,oLoadedState:null,sAjaxSource:null,sAjaxDataProp:null,bAjaxDataGet:!0,jqXHR:null,json:k,oAjaxData:k,fnServerData:null,aoServerParams:[],sServerMethod:null,fnFormatNumber:null,aLengthMenu:null,iDraw:0,bDrawing:!1,iDrawError:-1,_iDisplayLength:10,_iDisplayStart:0,_iRecordsTotal:0,_iRecordsDisplay:0,oClasses:{},bFiltered:!1,bSorted:!1,bSortCellsTop:null,oInit:null,aoDestroyCallback:[],fnRecordsTotal:function(){return'ssp'==y(this)?1*this._iRecordsTotal:this.aiDisplayMaster.length},fnRecordsDisplay:function(){return'ssp'==y(this)?1*this._iRecordsDisplay:this.aiDisplay.length},fnDisplayEnd:function(){var a=this._iDisplayLength,b=this._iDisplayStart,c=b+a,d=this.aiDisplay.length,e=this.oFeatures,f=e.bPaginate;return e.bServerSide?!1===f||-1===a?b+d:Math.min(b+a,this._iRecordsDisplay):!f||c>d||-1===a?d:c},oInstance:null,sInstance:null,iTabIndex:0,nScrollHead:null,nScrollFoot:null,aLastSort:[],oPlugins:{},rowIdFn:null,rowId:null};n.ext=x={buttons:{},classes:{},builder:'-source-',errMode:'alert',feature:[],search:[],selector:{cell:[],column:[],row:[]},internal:{},legacy:{ajax:null},pager:{},renderer:{pageButton:{},header:{}},order:{},type:{detect:[],search:{},order:{}},_unique:0,fnVersionCheck:n.fnVersionCheck,iApiIndex:0,oJUIClasses:{},sVersion:n.version};h.extend(x,{afnFiltering:x.search,aTypes:x.type.detect,ofnSearch:x.type.search,oSort:x.type.order,afnSortData:x.order,aoFeatures:x.feature,oApi:x.internal,oStdClasses:x.classes,oPagination:x.pager});h.extend(n.ext.classes,{sTable:'dataTable',sNoFooter:'no-footer',sPageButton:'paginate_button',sPageButtonActive:'current',sPageButtonDisabled:'disabled',sStripeOdd:'odd',sStripeEven:'even',sRowEmpty:'dataTables_empty',sWrapper:'dataTables_wrapper',sFilter:'dataTables_filter',sInfo:'dataTables_info',sPaging:'dataTables_paginate paging_',sLength:'dataTables_length',sProcessing:'dataTables_processing',sSortAsc:'sorting_asc',sSortDesc:'sorting_desc',sSortable:'sorting',sSortableAsc:'sorting_asc_disabled',sSortableDesc:'sorting_desc_disabled',sSortableNone:'sorting_disabled',sSortColumn:'sorting_',sFilterInput:'',sLengthSelect:'',sScrollWrapper:'dataTables_scroll',sScrollHead:'dataTables_scrollHead',sScrollHeadInner:'dataTables_scrollHeadInner',sScrollBody:'dataTables_scrollBody',sScrollFoot:'dataTables_scrollFoot',sScrollFootInner:'dataTables_scrollFootInner',sHeaderTH:'',sFooterTH:'',sSortJUIAsc:'',sSortJUIDesc:'',sSortJUI:'',sSortJUIAscAllowed:'',sSortJUIDescAllowed:'',sSortJUIWrapper:'',sSortIcon:'',sJUIHeader:'',sJUIFooter:''});var Lb=n.ext.pager;h.extend(Lb,{simple:function(){return['previous','next']},full:function(){return['first','previous','next','last']},numbers:function(a,b){return[ia(a,b)]},simple_numbers:function(a,b){return['previous',ia(a,b),'next']},full_numbers:function(a,b){return['first','previous',ia(a,b),'next','last']},first_last_numbers:function(a,b){return['first',ia(a,b),'last']},_numbers:ia,numbers_length:7});h.extend(!0,n.ext.renderer,{pageButton:{_:function(a,b,c,d,e,f){var g=a.oClasses,j=a.oLanguage.oPaginate,i=a.oLanguage.oAria.paginate||{},m,l,n=0,o=function(b,d){var k,s,u,r,v=function(b){Ta(a,b.data.action,true)};k=0;for(s=d.length;k<s;k++){r=d[k];if(h.isArray(r)){u=h('<'+(r.DT_el||'div')+'/>').appendTo(b);o(u,r)}else{m=null;l='';switch(r){case'ellipsis':b.append('<span class="ellipsis">&#x2026;</span>');break;case'first':m=j.sFirst;l=r+(e>0?'':' '+g.sPageButtonDisabled);break;case'previous':m=j.sPrevious;l=r+(e>0?'':' '+g.sPageButtonDisabled);break;case'next':m=j.sNext;l=r+(e<f-1?'':' '+g.sPageButtonDisabled);break;case'last':m=j.sLast;l=r+(e<f-1?'':' '+g.sPageButtonDisabled);break;default:m=r+1;l=e===r?g.sPageButtonActive:'';}if(m!==null){u=h('<a>',{'class':g.sPageButton+' '+l,'aria-controls':a.sTableId,'aria-label':i[r],'data-dt-idx':n,tabindex:a.iTabIndex,id:c===0&&typeof r==='string'?a.sTableId+'_'+r:null}).html(m).appendTo(b);Wa(u,{action:r},v);n++}}}},s;try{s=h(b).find(H.activeElement).data('dt-idx')}catch(u){}o(h(b).empty(),d);s!==k&&h(b).find('[data-dt-idx='+s+']').focus()}}});h.extend(n.ext.type.detect,[function(a,b){var c=b.oLanguage.sDecimal;return $a(a,c)?'num'+c:null},function(a){if(a&&!(a instanceof Date)&&!Zb.test(a))return null;var b=Date.parse(a);return null!==b&&!isNaN(b)||M(a)?'date':null},function(a,b){var c=b.oLanguage.sDecimal;return $a(a,c,!0)?'num-fmt'+c:null},function(a,b){var c=b.oLanguage.sDecimal;return Qb(a,c)?'html-num'+c:null},function(a,b){var c=b.oLanguage.sDecimal;return Qb(a,c,!0)?'html-num-fmt'+c:null},function(a){return M(a)||'string'===typeof a&&-1!==a.indexOf('<')?'html':null}]);h.extend(n.ext.type.search,{html:function(a){return M(a)?a:'string'===typeof a?a.replace(Nb,' ').replace(Aa,''):''},string:function(a){return M(a)?a:'string'===typeof a?a.replace(Nb,' '):a}});var za=function(a,b,c,d){if(0!==a&&(!a||'-'===a))return-Infinity;b&&(a=Pb(a,b));a.replace&&(c&&(a=a.replace(c,'')),d&&(a=a.replace(d,'')));return 1*a};h.extend(x.type.order,{'date-pre':function(a){a=Date.parse(a);return isNaN(a)?-Infinity:a},'html-pre':function(a){return M(a)?'':a.replace?a.replace(/<.*?>/g,'').toLowerCase():a+''},'string-pre':function(a){return M(a)?'':'string'===typeof a?a.toLowerCase():!a.toString?'':a.toString()},'string-asc':function(a,b){return a<b?-1:a>b?1:0},'string-desc':function(a,b){return a<b?1:a>b?-1:0}});Da('');h.extend(!0,n.ext.renderer,{header:{_:function(a,b,c,d){h(a.nTable).on('order.dt.DT',function(e,f,g,h){if(a===f){e=c.idx;b.removeClass(c.sSortingClass+' '+d.sSortAsc+' '+d.sSortDesc).addClass(h[e]=='asc'?d.sSortAsc:h[e]=='desc'?d.sSortDesc:c.sSortingClass)}})},jqueryui:function(a,b,c,d){h('<div/>').addClass(d.sSortJUIWrapper).append(b.contents()).append(h('<span/>').addClass(d.sSortIcon+' '+c.sSortingClassJUI)).appendTo(b);h(a.nTable).on('order.dt.DT',function(e,f,g,h){if(a===f){e=c.idx;b.removeClass(d.sSortAsc+' '+d.sSortDesc).addClass(h[e]=='asc'?d.sSortAsc:h[e]=='desc'?d.sSortDesc:c.sSortingClass);b.find('span.'+d.sSortIcon).removeClass(d.sSortJUIAsc+' '+d.sSortJUIDesc+' '+d.sSortJUI+' '+d.sSortJUIAscAllowed+' '+d.sSortJUIDescAllowed).addClass(h[e]=='asc'?d.sSortJUIAsc:h[e]=='desc'?d.sSortJUIDesc:c.sSortingClassJUI)}})}}});var eb=function(a){return'string'===typeof a?a.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'):a};n.render={number:function(a,b,c,d,e){return{display:function(f){if('number'!==typeof f&&'string'!==typeof f)return f;var g=0>f?'-':'',h=parseFloat(f);if(isNaN(h))return eb(f);h=h.toFixed(c);f=Math.abs(h);h=parseInt(f,10);f=c?b+(f-h).toFixed(c).substring(2):'';return g+(d||'')+h.toString().replace(/\B(?=(\d{3})+(?!\d))/g,a)+f+(e||'')}}},text:function(){return{display:eb,filter:eb}}};h.extend(n.ext.internal,{_fnExternApiFunc:Mb,_fnBuildAjax:sa,_fnAjaxUpdate:mb,_fnAjaxParameters:vb,_fnAjaxUpdateDraw:wb,_fnAjaxDataSrc:ta,_fnAddColumn:Ea,_fnColumnOptions:ka,_fnAdjustColumnSizing:$,_fnVisibleToColumnIndex:aa,_fnColumnIndexToVisible:ba,_fnVisbleColumns:V,_fnGetColumns:ma,_fnColumnTypes:Ga,_fnApplyColumnDefs:jb,_fnHungarianMap:Z,_fnCamelToHungarian:J,_fnLanguageCompat:Ca,_fnBrowserDetect:hb,_fnAddData:O,_fnAddTr:na,_fnNodeToDataIndex:function(a,b){return b._DT_RowIndex!==k?b._DT_RowIndex:null},_fnNodeToColumnIndex:function(a,b,c){return h.inArray(c,a.aoData[b].anCells)},_fnGetCellData:B,_fnSetCellData:kb,_fnSplitObjNotation:Ja,_fnGetObjectDataFn:S,_fnSetObjectDataFn:N,_fnGetDataMaster:Ka,_fnClearTable:oa,_fnDeleteIndex:pa,_fnInvalidate:da,_fnGetRowElements:Ia,_fnCreateTr:Ha,_fnBuildHead:lb,_fnDrawHead:fa,_fnDraw:P,_fnReDraw:T,_fnAddOptionsHtml:ob,_fnDetectHeader:ea,_fnGetUniqueThs:ra,_fnFeatureHtmlFilter:qb,_fnFilterComplete:ga,_fnFilterCustom:zb,_fnFilterColumn:yb,_fnFilter:xb,_fnFilterCreateSearch:Pa,_fnEscapeRegex:Qa,_fnFilterData:Ab,_fnFeatureHtmlInfo:tb,_fnUpdateInfo:Db,_fnInfoMacros:Eb,_fnInitialise:ha,_fnInitComplete:ua,_fnLengthChange:Ra,_fnFeatureHtmlLength:pb,_fnFeatureHtmlPaginate:ub,_fnPageChange:Ta,_fnFeatureHtmlProcessing:rb,_fnProcessingDisplay:C,_fnFeatureHtmlTable:sb,_fnScrollDraw:la,_fnApplyToChildren:I,_fnCalculateColumnWidths:Fa,_fnThrottle:Oa,_fnConvertToWidth:Fb,_fnGetWidestNode:Gb,_fnGetMaxLenString:Hb,_fnStringToCss:v,_fnSortFlatten:X,_fnSort:nb,_fnSortAria:Jb,_fnSortListener:Va,_fnSortAttachListener:Ma,_fnSortingClasses:wa,_fnSortData:Ib,_fnSaveState:xa,_fnLoadState:Kb,_fnSettingsFromNode:ya,_fnLog:K,_fnMap:F,_fnBindAction:Wa,_fnCallbackReg:z,_fnCallbackFire:r,_fnLengthOverflow:Sa,_fnRenderer:Na,_fnDataSource:y,_fnRowAttributes:La,_fnExtend:Xa,_fnCalculateEnd:function(){}});h.fn.dataTable=n;n.$=h;h.fn.dataTableSettings=n.settings;h.fn.dataTableExt=n.ext;h.fn.DataTable=function(a){return h(this).dataTable(a).api()};h.each(n,function(a,b){h.fn.DataTable[a]=b});return h.fn.dataTable});


//bootrap select
/*!
 * Bootstrap-select v1.12.13 (https://github.com/heimrichhannot/bootstrap-select)
 *
 * Copyright 2013-2017 bootstrap-select
 * Licensed under MIT (https://github.com/heimrichhannot/bootstrap-select/LICENSE)
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module unless amdModuleId is set
        define(['jquery'], function(a0) {
            return (factory(a0));
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    } else {
        factory(root['jQuery']);
    }
}(this, function(jQuery) {

    (function($) {
        'use strict';

        //<editor-fold desc="Shims">
        if (!String.prototype.includes) {
            (function() {
                'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
                var toString = {}.toString;
                var defineProperty = (function() {
                    // IE 8 only supports `Object.defineProperty` on DOM elements
                    try {
                        var object = {};
                        var $defineProperty = Object.defineProperty;
                        var result = $defineProperty(object, object, object) && $defineProperty;
                    } catch (error) {
                    }
                    return result;
                }());
                var indexOf = ''.indexOf;
                var includes = function(search) {
                    if (this == null) {
                        throw new TypeError();
                    }
                    var string = String(this);
                    if (search && toString.call(search) == '[object RegExp]') {
                        throw new TypeError();
                    }
                    var stringLength = string.length;
                    var searchString = String(search);
                    var searchLength = searchString.length;
                    var position = arguments.length > 1 ? arguments[1] : undefined;
                    // `ToInteger`
                    var pos = position ? Number(position) : 0;
                    if (pos != pos) { // better `isNaN`
                        pos = 0;
                    }
                    var start = Math.min(Math.max(pos, 0), stringLength);
                    // Avoid the `indexOf` call if no match is possible
                    if (searchLength + start > stringLength) {
                        return false;
                    }
                    return indexOf.call(string, searchString, pos) != -1;
                };
                if (defineProperty) {
                    defineProperty(String.prototype, 'includes', {
                        'value': includes,
                        'configurable': true,
                        'writable': true,
                    });
                } else {
                    String.prototype.includes = includes;
                }
            }());
        }

        if (!String.prototype.startsWith) {
            (function() {
                'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
                var defineProperty = (function() {
                    // IE 8 only supports `Object.defineProperty` on DOM elements
                    try {
                        var object = {};
                        var $defineProperty = Object.defineProperty;
                        var result = $defineProperty(object, object, object) && $defineProperty;
                    } catch (error) {
                    }
                    return result;
                }());
                var toString = {}.toString;
                var startsWith = function(search) {
                    if (this == null) {
                        throw new TypeError();
                    }
                    var string = String(this);
                    if (search && toString.call(search) == '[object RegExp]') {
                        throw new TypeError();
                    }
                    var stringLength = string.length;
                    var searchString = String(search);
                    var searchLength = searchString.length;
                    var position = arguments.length > 1 ? arguments[1] : undefined;
                    // `ToInteger`
                    var pos = position ? Number(position) : 0;
                    if (pos != pos) { // better `isNaN`
                        pos = 0;
                    }
                    var start = Math.min(Math.max(pos, 0), stringLength);
                    // Avoid the `indexOf` call if no match is possible
                    if (searchLength + start > stringLength) {
                        return false;
                    }
                    var index = -1;
                    while (++index < searchLength) {
                        if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
                            return false;
                        }
                    }
                    return true;
                };
                if (defineProperty) {
                    defineProperty(String.prototype, 'startsWith', {
                        'value': startsWith,
                        'configurable': true,
                        'writable': true,
                    });
                } else {
                    String.prototype.startsWith = startsWith;
                }
            }());
        }

        if (!Object.keys) {
            Object.keys = function(
                o, // object
                k, // key
                r  // result array
            ) {
                // initialize object and result
                r = [];
                // iterate over object keys
                for (k in o)
                    // fill result array with non-prototypical keys
                    r.hasOwnProperty.call(o, k) && r.push(k);
                // return result
                return r;
            };
        }

        // set data-selected on select element if the value has been programmatically selected
        // prior to initialization of bootstrap-select
        // * consider removing or replacing an alternative method *
        var valHooks = {
            useDefault: false,
            _set: $.valHooks.select.set,
        };

        $.valHooks.select.set = function(elem, value) {
            if (value && !valHooks.useDefault) $(elem).data('selected', true);

            return valHooks._set.apply(this, arguments);
        };

        var changed_arguments = null;
        $.fn.triggerNative = function(eventName) {
            var el = this[0],
                event;

            if (el.dispatchEvent) { // for modern browsers & IE9+
                if (typeof Event === 'function') {
                    // For modern browsers
                    event = new Event(eventName, {
                        bubbles: true,
                    });
                } else {
                    // For IE since it doesn't support Event constructor
                    event = document.createEvent('Event');
                    event.initEvent(eventName, true, false);
                }

                el.dispatchEvent(event);
            } else if (el.fireEvent) { // for IE8
                event = document.createEventObject();
                event.eventType = eventName;
                el.fireEvent('on' + eventName, event);
            } else {
                // fall back to jQuery.trigger
                this.trigger(eventName);
            }
        };
        //</editor-fold>

        // Case insensitive contains search
        $.expr.pseudos.icontains = function(obj, index, meta) {
            var $obj = $(obj).find('span.dropdown-item-inner');
            var haystack = ($obj.data('tokens') || $obj.text()).toString().toUpperCase();
            return haystack.includes(meta[3].toUpperCase());
        };

        // Case insensitive begins search
        $.expr.pseudos.ibegins = function(obj, index, meta) {
            var $obj = $(obj).find('span.dropdown-item-inner');
            var haystack = ($obj.data('tokens') || $obj.text()).toString().toUpperCase();
            return haystack.startsWith(meta[3].toUpperCase());
        };

        // Case and accent insensitive contains search
        $.expr.pseudos.aicontains = function(obj, index, meta) {
            var $obj = $(obj).find('span.dropdown-item-inner');
            var haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toString().toUpperCase();
            return haystack.includes(meta[3].toUpperCase());
        };

        // Case and accent insensitive begins search
        $.expr.pseudos.aibegins = function(obj, index, meta) {
            var $obj = $(obj).find('span.dropdown-item-inner');
            var haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toString().toUpperCase();
            return haystack.startsWith(meta[3].toUpperCase());
        };

        /**
         * Remove all diatrics from the given text.
         * @access private
         * @param {String} text
         * @returns {String}
         */
        function normalizeToBase(text) {
            var rExps = [
                {re: /[\xC0-\xC6]/g, ch: 'A'},
                {re: /[\xE0-\xE6]/g, ch: 'a'},
                {re: /[\xC8-\xCB]/g, ch: 'E'},
                {re: /[\xE8-\xEB]/g, ch: 'e'},
                {re: /[\xCC-\xCF]/g, ch: 'I'},
                {re: /[\xEC-\xEF]/g, ch: 'i'},
                {re: /[\xD2-\xD6]/g, ch: 'O'},
                {re: /[\xF2-\xF6]/g, ch: 'o'},
                {re: /[\xD9-\xDC]/g, ch: 'U'},
                {re: /[\xF9-\xFC]/g, ch: 'u'},
                {re: /[\xC7-\xE7]/g, ch: 'c'},
                {re: /[\xD1]/g, ch: 'N'},
                {re: /[\xF1]/g, ch: 'n'},
            ];
            $.each(rExps, function() {
                text = text ? text.replace(this.re, this.ch) : '';
            });
            return text;
        }

        // List of HTML entities for escaping.
        var escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#x27;',
            '`': '&#x60;',
        };

        var unescapeMap = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#x27;': '\'',
            '&#x60;': '`',
        };

        // Functions for escaping and unescaping strings to/from HTML interpolation.
        var createEscaper = function(map) {
            var escaper = function(match) {
                return map[match];
            };
            // Regexes for identifying a key that needs to be escaped.
            var source = '(?:' + Object.keys(map).join('|') + ')';
            var testRegexp = RegExp(source);
            var replaceRegexp = RegExp(source, 'g');
            return function(string) {
                string = string == null ? '' : '' + string;
                return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
            };
        };

        var htmlEscape = createEscaper(escapeMap);
        var htmlUnescape = createEscaper(unescapeMap);

        var Selectpicker = function(element, options) {
            // bootstrap-select has been initialized - revert valHooks.select.set back to its original function
            if (!valHooks.useDefault) {
                $.valHooks.select.set = valHooks._set;
                valHooks.useDefault = true;
            }

            this.$element = $(element);
            this.$newElement = null;
            this.$button = null;
            this.$menu = null;
            this.$lis = null;
            this.options = options;

            // If we have no title yet, try to pull it from the html title attribute (jQuery doesnt' pick it up as it's not a
            // data-attribute)
            if (this.options.title === null) {
                this.options.title = this.$element.attr('title');
            }

            // Format window padding
            var winPad = this.options.windowPadding;
            if (typeof winPad === 'number') {
                this.options.windowPadding = [winPad, winPad, winPad, winPad];
            }

            //Expose public methods
            this.val = Selectpicker.prototype.val;
            this.render = Selectpicker.prototype.render;
            this.refresh = Selectpicker.prototype.refresh;
            this.setStyle = Selectpicker.prototype.setStyle;
            this.selectAll = Selectpicker.prototype.selectAll;
            this.deselectAll = Selectpicker.prototype.deselectAll;
            this.destroy = Selectpicker.prototype.destroy;
            this.remove = Selectpicker.prototype.remove;
            this.show = Selectpicker.prototype.show;
            this.hide = Selectpicker.prototype.hide;

            this.init();
        };

        Selectpicker.VERSION = '1.12.2';

        // part of this is duplicated in i18n/defaults-en_US.js. Make sure to update both.
        Selectpicker.DEFAULTS = {
            noneSelectedText: 'Nothing selected',
            noneResultsText: 'No results matched {0}',
            countSelectedText: function(numSelected, numTotal) {
                return (numSelected == 1) ? '{0} item selected' : '{0} items selected';
            },
            maxOptionsText: function(numAll, numGroup) {
                return [
                    (numAll == 1) ? 'Limit reached ({n} item max)' : 'Limit reached ({n} items max)',
                    (numGroup == 1) ? 'Group limit reached ({n} item max)' : 'Group limit reached ({n} items max)',
                ];
            },
            selectAllText: 'Select All',
            deselectAllText: 'Deselect All',
            doneButton: false,
            doneButtonText: 'Close',
            multipleSeparator: ', ',
            styleBase: 'btn',
            style: 'btn-default btn-light', // bootstrap4: btn-default replaced by btn-light
            size: 'auto',
            title: null,
            selectedTextFormat: 'values',
            width: false,
            container: false,
            hideDisabled: false,
            showSubtext: false,
            showIcon: true,
            showContent: true,
            dropupAuto: true,
            header: false,
            liveSearch: false,
            liveSearchPlaceholder: null,
            liveSearchNormalize: false,
            liveSearchStyle: 'contains',
            actionsBox: false,
            iconBase: 'fa',
            tickIcon: 'fa-check',
            showTick: false,
            template: {
                caret: '<span class="caret"></span>',
            },
            maxOptions: false,
            mobile: false,
            selectOnTab: false,
            dropdownAlignRight: false,
            windowPadding: 0,
        };

        Selectpicker.prototype = {

            constructor: Selectpicker,

            init: function() {
                var that = this,
                    id = this.$element.attr('id');

                this.$element.addClass('bs-select-hidden');

                // store originalIndex (key) and newIndex (value) in this.liObj for fast accessibility
                // allows us to do this.$lis.eq(that.liObj[index]) instead of this.$lis.filter('[data-original-index="' + index + '"]')
                this.liObj = {};
                this.multiple = this.$element.prop('multiple');
                this.autofocus = this.$element.prop('autofocus');
                this.$newElement = this.createView();
                this.$element.after(this.$newElement).appendTo(this.$newElement);
                this.$button = this.$newElement.children('button');
                this.$menu = this.$newElement.children('.dropdown-menu');
                this.$menuInner = this.$menu.children('.inner');
                this.$searchbox = this.$menu.find('input');

                this.$element.removeClass('bs-select-hidden');

                if (this.options.dropdownAlignRight === true) this.$menu.addClass('dropdown-menu-right');

                if (typeof id !== 'undefined') {
                    this.$button.attr('data-id', id);
                    $('label[for="' + id + '"]').click(function(e) {
                        e.preventDefault();
                        that.$button.focus();
                    });
                }

                this.checkDisabled();
                this.clickListener();
                if (this.options.liveSearch) this.liveSearchListener();
                this.render();
                this.setStyle();
                this.setWidth();
                if (this.options.container) this.selectPosition();
                this.$menu.data('this', this);
                this.$newElement.data('this', this);
                if (this.options.mobile) this.mobile();

                this.$newElement.on({
                    'hide.bs.dropdown': function(e) {
                        that.$menuInner.attr('aria-expanded', false);
                        that.$element.trigger('hide.bs.select', e);
                    },
                    'hidden.bs.dropdown': function(e) {
                        that.$element.trigger('hidden.bs.select', e);
                    },
                    'show.bs.dropdown': function(e) {
                        that.$menuInner.attr('aria-expanded', true);
                        that.$element.trigger('show.bs.select', e);
                    },
                    'shown.bs.dropdown': function(e) {
                        that.$element.trigger('shown.bs.select', e);
                    },
                });

                if (that.$element[0].hasAttribute('required')) {
                    this.$element.on('invalid', function() {
                        that.$button.addClass('bs-invalid').focus();

                        that.$element.on({
                            'focus.bs.select': function() {
                                that.$button.focus();
                                that.$element.off('focus.bs.select');
                            },
                            'shown.bs.select': function() {
                                that.$element.val(that.$element.val()) // set the value to hide the validation message in Chrome when menu is opened
                                    .off('shown.bs.select');
                            },
                            'rendered.bs.select': function() {
                                // if select is no longer invalid, remove the bs-invalid class
                                if (this.validity.valid) that.$button.removeClass('bs-invalid');
                                that.$element.off('rendered.bs.select');
                            },
                        });
                    });
                }

                setTimeout(function() {
                    that.$element.trigger('loaded.bs.select');
                });
            },

            createDropdown: function() {
                // Options
                // If we are multiple or showTick option is set, then add the show-tick class
                var showTick = (this.multiple || this.options.showTick) ? ' show-tick' : '',
                    inputGroup = this.$element.parent().hasClass('input-group') ? ' input-group-btn' : '',
                    autofocus = this.autofocus ? ' autofocus' : '';
                // Elements
                var header = this.options.header ? '<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>' + this.options.header + '</div>' : '';
                var searchbox = this.options.liveSearch ?
                    '<div class="bs-searchbox">' +
                    '<input type="text" class="form-control" autocomplete="off"' +
                    (null === this.options.liveSearchPlaceholder ? '' : ' placeholder="' + htmlEscape(this.options.liveSearchPlaceholder) + '"') + ' role="textbox" aria-label="Search">' +
                    '</div>'
                    : '';
                var actionsbox = this.multiple && this.options.actionsBox ?
                    '<div class="bs-actionsbox">' +
                    '<div class="btn-group btn-group-sm btn-block">' +
                    '<button type="button" class="actions-btn bs-select-all btn btn-default btn-light">' +
                    this.options.selectAllText +
                    '</button>' +
                    '<button type="button" class="actions-btn bs-deselect-all btn btn-default btn-light">' +
                    this.options.deselectAllText +
                    '</button>' +
                    '</div>' +
                    '</div>'
                    : '';
                var donebutton = this.multiple && this.options.doneButton ?
                    '<div class="bs-donebutton">' +
                    '<div class="btn-group btn-block">' +
                    '<button type="button" class="btn btn-sm btn-default btn-light">' +
                    this.options.doneButtonText +
                    '</button>' +
                    '</div>' +
                    '</div>'
                    : '';
                var drop =
                    '<div class="btn-group bootstrap-select' + showTick + inputGroup + '">' +
                    '<button type="button" class="' + this.options.styleBase + ' dropdown-toggle" data-toggle="dropdown"' + autofocus + ' role="button">' +
                    '<span class="filter-option pull-left"></span>&nbsp;' +
                    '<span class="bs-caret">' +
                    this.options.template.caret +
                    '</span>' +
                    '</button>' +
                    '<div class="dropdown-menu open" role="combobox">' +
                    header +
                    searchbox +
                    actionsbox +
                    '<div class="dropdown-menu inner" role="listbox" aria-expanded="false">' +
                    '</div>' +
                    donebutton +
                    '</div>' +
                    '</div>';

                return $(drop);
            },

            createView: function() {
                var $drop = this.createDropdown(),
                    li = this.createLi();

                $drop.find('div.inner')[0].innerHTML = li;
                return $drop;
            },

            reloadLi: function() {
                // rebuild
                var li = this.createLi();
                this.$menuInner[0].innerHTML = li;
            },

            createLi: function() {
                var that = this,
                    _li = [],
                    optID = 0,
                    titleOption = document.createElement('option'),
                    liIndex = -1; // increment liIndex whenever a new <li> element is created to ensure liObj is correct

                // Helper functions
                /**
                 * @param content
                 * @param [index]
                 * @param [classes]
                 * @param [optgroup]
                 * @returns {string}
                 */
                var generateA = function(content, index, classes, optgroup) {
                    classes = 'dropdown-item ' + (classes || '');
                    return '<a tabindex="0"' +
                        ((typeof classes !== 'undefined' && '' !== classes) ? ' class="' + classes + '"' : '') +
                        ((typeof index !== 'undefined' && null !== index) ? ' data-original-index="' + index + '"' : '') +
                        ((typeof optgroup !== 'undefined' && null !== optgroup) ? 'data-optgroup="' + optgroup + '"' : '') +
                        '>' + content + '</a>';
                };

                var generateDiv = function(content, classes, optgroup) {
                    return '<div' +
                        ((typeof classes !== 'undefined' && '' !== classes) ? ' class="' + classes + '"' : '') +
                        ((typeof optgroup !== 'undefined' && null !== optgroup) ? ' data-optgroup="' + optgroup + '"' : '') +
                        '>' + content + '</div>';
                };

                /**
                 * @param text
                 * @param [classes]
                 * @param [inline]
                 * @param [tokens]
                 * @returns {string}
                 */
                var generateSpan = function(text, classes, inline, tokens) {
                    // support bootstrap v4: http://v4-alpha.getbootstrap.com/components/dropdowns/#single-button-dropdowns
                    classes = 'dropdown-item-inner ' + (classes || '');
                    return '<span' +
                        (typeof classes !== 'undefined' ? ' class="' + classes + '"' : '') +
                        (inline ? ' style="' + inline + '"' : '') +
                        (that.options.liveSearchNormalize ? ' data-normalized-text="' + normalizeToBase(htmlEscape($(text).html())) + '"' : '') +
                        (typeof tokens !== 'undefined' || tokens !== null ? ' data-tokens="' + tokens + '"' : '') +
                        ' role="option">' + text +
                        '<span class="' + that.options.iconBase + ' ' + that.options.tickIcon + ' check-mark"></span>' +
                        '</span>';
                };

                if (this.options.title && !this.multiple) {
                    // this option doesn't create a new <li> element, but does add a new option, so liIndex is decreased
                    // since liObj is recalculated on every refresh, liIndex needs to be decreased even if the titleOption is already appended
                    liIndex--;

                    if (!this.$element.find('.bs-title-option').length) {
                        // Use native JS to prepend option (faster)
                        var element = this.$element[0];
                        titleOption.className = 'bs-title-option';
                        titleOption.innerHTML = this.options.title;
                        titleOption.value = '';
                        element.insertBefore(titleOption, element.firstChild);
                        // Check if selected or data-selected attribute is already set on an option. If not, select the titleOption option.
                        // the selected item may have been changed by user or programmatically before the bootstrap select plugin runs,
                        // if so, the select will have the data-selected attribute
                        var $opt = $(element.options[element.selectedIndex]);
                        if ($opt.attr('selected') === undefined && this.$element.data('selected') === undefined) {
                            titleOption.selected = true;
                        }
                    }
                }

                var $selectOptions = this.$element.find('option');

                $selectOptions.each(function(index) {
                    var $this = $(this);

                    liIndex++;

                    if ($this.hasClass('bs-title-option')) return;

                    // Get the class and text for the option
                    var optionClass = this.className || '',
                        inline = htmlEscape(this.style.cssText),
                        text = $this.data('content') ? $this.data('content') : $this.html(),
                        tokens = $this.data('tokens') ? $this.data('tokens') : null,
                        subtext = typeof $this.data('subtext') !== 'undefined' ? '<small class="text-muted">' + $this.data('subtext') + '</small>' : '',
                        icon = typeof $this.data('icon') !== 'undefined' ? '<span class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></span> ' : '',
                        $parent = $this.parent(),
                        isOptgroup = $parent[0].tagName === 'OPTGROUP',
                        isOptgroupDisabled = isOptgroup && $parent[0].disabled,
                        isDisabled = this.disabled || isOptgroupDisabled,
                        prevHiddenIndex;

                    if (icon !== '' && isDisabled) {
                        icon = '<span>' + icon + '</span>';
                    }

                    if (that.options.hideDisabled && (isDisabled && !isOptgroup || isOptgroupDisabled)) {
                        // set prevHiddenIndex - the index of the first hidden option in a group of hidden options
                        // used to determine whether or not a divider should be placed after an optgroup if there are
                        // hidden options between the optgroup and the first visible option
                        prevHiddenIndex = $this.data('prevHiddenIndex');
                        $this.next().data('prevHiddenIndex', (prevHiddenIndex !== undefined ? prevHiddenIndex : index));

                        liIndex--;
                        return;
                    }

                    if (!$this.data('content')) {
                        // Prepend any icon and append any subtext to the main text.
                        text = icon + '<span class="text">' + text + subtext + '</span>';
                    }

                    if (isOptgroup && $this.data('divider') !== true) {
                        if (that.options.hideDisabled && isDisabled) {
                            if ($parent.data('allOptionsDisabled') === undefined) {
                                var $options = $parent.children();
                                $parent.data('allOptionsDisabled', $options.filter(':disabled').length === $options.length);
                            }

                            if ($parent.data('allOptionsDisabled')) {
                                liIndex--;
                                return;
                            }
                        }

                        var optGroupClass = ' ' + $parent[0].className || '';

                        if ($this.index() === 0) { // Is it the first option of the optgroup?
                            optID += 1;

                            // Get the opt group label
                            var label = $parent[0].label,
                                labelSubtext = typeof $parent.data('subtext') !== 'undefined' ? '<small class="text-muted">' + $parent.data('subtext') + '</small>' : '',
                                labelIcon = $parent.data('icon') ? '<span class="' + that.options.iconBase + ' ' + $parent.data('icon') + '"></span> ' : '';

                            label = labelIcon + '<span class="text">' + htmlEscape(label) + labelSubtext + '</span>';

                            if (index !== 0 && _li.length > 0) { // Is it NOT the first option of the select && are there elements in the dropdown?
                                liIndex++;
                                _li.push(generateDiv('', 'dropdown-divider', optID + 'div'));
                            }
                            liIndex++;
                            _li.push(generateDiv(label, 'dropdown-header' + optGroupClass, optID));
                        }

                        if (that.options.hideDisabled && isDisabled) {
                            liIndex--;
                            return;
                        }

                        _li.push(generateA(generateSpan(text, 'opt ' + optionClass + optGroupClass, inline, tokens), index, '', optID));
                    } else if ($this.data('divider') === true) {
                        _li.push(generateDiv('', 'dropdown-divider', optID + 'div'));
                    } else if ($this.data('hidden') === true) {
                        // set prevHiddenIndex - the index of the first hidden option in a group of hidden options
                        // used to determine whether or not a divider should be placed after an optgroup if there are
                        // hidden options between the optgroup and the first visible option
                        prevHiddenIndex = $this.data('prevHiddenIndex');
                        $this.next().data('prevHiddenIndex', (prevHiddenIndex !== undefined ? prevHiddenIndex : index));

                        _li.push(generateA(generateSpan(text, optionClass, inline, tokens), index, 'hidden is-hidden'));
                    } else {
                        var showDivider = this.previousElementSibling && this.previousElementSibling.tagName === 'OPTGROUP';

                        // if previous element is not an optgroup and hideDisabled is true
                        if (!showDivider && that.options.hideDisabled) {
                            prevHiddenIndex = $this.data('prevHiddenIndex');

                            if (prevHiddenIndex !== undefined) {
                                // select the element **before** the first hidden element in the group
                                var prevHidden = $selectOptions.eq(prevHiddenIndex)[0].previousElementSibling;

                                if (prevHidden && prevHidden.tagName === 'OPTGROUP' && !prevHidden.disabled) {
                                    showDivider = true;
                                }
                            }
                        }

                        if (showDivider) {
                            liIndex++;
                            _li.push(generateDiv('', 'dropdown-divider', optID + 'div'));
                        }
                        _li.push(generateA(generateSpan(text, optionClass, inline, tokens), index));
                    }

                    that.liObj[index] = liIndex;
                });

                //If we are not multiple, we don't have a selected item, and we don't have a title, select the first element so something is set in the button
                if (!this.multiple && this.$element.find('option:selected').length === 0 && !this.options.title) {
                    this.$element.find('option').eq(0).prop('selected', true).attr('selected', 'selected');
                }

                return _li.join('');
            },

            findLis: function() {
                if (this.$lis == null) this.$lis = this.$menu.find('a, .dropdown-header, .dropdown-divider');
                return this.$lis;
            },

            /**
             * @param [updateLi] defaults to true
             */
            render: function(updateLi) {
                var that = this,
                    notDisabled,
                    $selectOptions = this.$element.find('option');

                //Update the LI to match the SELECT
                if (updateLi !== false) {
                    $selectOptions.each(function(index) {
                        var $lis = that.findLis().eq(that.liObj[index]);

                        that.setDisabled(index, this.disabled || this.parentNode.tagName === 'OPTGROUP' && this.parentNode.disabled, $lis);
                        that.setSelected(index, this.selected, $lis);
                    });
                }

                this.togglePlaceholder();

                this.tabIndex();

                var selectedItems = $selectOptions.map(function() {
                    if (this.selected) {
                        if (that.options.hideDisabled && (this.disabled || this.parentNode.tagName === 'OPTGROUP' && this.parentNode.disabled)) return;

                        var $this = $(this),
                            icon = $this.data('icon') && that.options.showIcon ? '<i class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></i> ' : '',
                            subtext;

                        if (that.options.showSubtext && $this.data('subtext') && !that.multiple) {
                            subtext = ' <small class="text-muted">' + $this.data('subtext') + '</small>';
                        } else {
                            subtext = '';
                        }
                        if (typeof $this.attr('title') !== 'undefined') {
                            return $this.attr('title');
                        } else if ($this.data('content') && that.options.showContent) {
                            return $this.data('content').toString();
                        } else {
                            return icon + $this.html() + subtext;
                        }
                    }
                }).toArray();

                //Fixes issue in IE10 occurring when no default option is selected and at least one option is disabled
                //Convert all the values into a comma delimited string
                var title = !this.multiple ? selectedItems[0] : selectedItems.join(this.options.multipleSeparator);

                //If this is multi select, and the selectText type is count, the show 1 of 2 selected etc..
                if (this.multiple && this.options.selectedTextFormat.indexOf('count') > -1) {
                    var max = this.options.selectedTextFormat.split('>');
                    if ((max.length > 1 && selectedItems.length > max[1]) || (max.length == 1 && selectedItems.length >= 2)) {
                        notDisabled = this.options.hideDisabled ? ', [disabled]' : '';
                        var totalCount = $selectOptions.not('[data-divider="true"], [data-hidden="true"]' + notDisabled).length,
                            tr8nText = (typeof this.options.countSelectedText === 'function') ? this.options.countSelectedText(selectedItems.length, totalCount) : this.options.countSelectedText;
                        title = tr8nText.replace('{0}', selectedItems.length.toString()).replace('{1}', totalCount.toString());
                    }
                }

                if (this.options.title == undefined) {
                    this.options.title = this.$element.attr('title');
                }

                if (this.options.selectedTextFormat == 'static') {
                    title = this.options.title;
                }

                //If we dont have a title, then use the default, or if nothing is set at all, use the not selected text
                if (!title) {
                    title = typeof this.options.title !== 'undefined' ? this.options.title : this.options.noneSelectedText;
                }

                //strip all HTML tags and trim the result, then unescape any escaped tags
                this.$button.attr('title', htmlUnescape($.trim(title.replace(/<[^>]*>?/g, ''))));
                this.$button.children('.filter-option').html(title);

                this.$element.trigger('rendered.bs.select');
            },

            /**
             * @param [style]
             * @param [status]
             */
            setStyle: function(style, status) {
                if (this.$element.attr('class')) {
                    this.$newElement.addClass(this.$element.attr('class').replace(/selectpicker|mobile-device|bs-select-hidden|validate\[.*\]/gi, ''));
                }

                var buttonClass = style ? style : this.options.style;

                if (status == 'add') {
                    this.$button.addClass(buttonClass);
                } else if (status == 'remove') {
                    this.$button.removeClass(buttonClass);
                } else {
                    this.$button.removeClass(this.options.style);
                    this.$button.addClass(buttonClass);
                }
            },
            updatePosition: function() {
                // this fixes https://github.com/heimrichhannot/bootstrap-select/issues/4
                var event = this.$menu.get(0).ownerDocument.createEvent('HTMLEvents');
                event.initEvent('resize', true, false);
                this.$menu.get(0).ownerDocument.dispatchEvent(event);
            },
            liHeight: function(refresh) {
                if (!refresh && (this.options.size === false || this.sizeInfo)) return;

                var newElement = document.createElement('div'),
                    menu = document.createElement('div'),
                    menuInner = document.createElement('ul'),
                    divider = document.createElement('a'),
                    li = document.createElement('a'),
                    a = document.createElement('span'),
                    text = document.createElement('span'),
                    header = this.options.header && this.$menu.find('.popover-title').length > 0 ? this.$menu.find('.popover-title')[0].cloneNode(true) : null,
                    search = this.options.liveSearch ? document.createElement('div') : null,
                    actions = this.options.actionsBox && this.multiple && this.$menu.find('.bs-actionsbox').length > 0 ? this.$menu.find('.bs-actionsbox')[0].cloneNode(true) : null,
                    doneButton = this.options.doneButton && this.multiple && this.$menu.find('.bs-donebutton').length > 0 ? this.$menu.find('.bs-donebutton')[0].cloneNode(true) : null;

                text.className = 'text';
                newElement.className = this.$menu[0].parentNode.className + ' show open'; // bootstrap 4 requires show instead of open
                menu.className = 'dropdown-menu open show';
                menuInner.className = 'dropdown-menu inner';
                divider.className = 'dropdown-divider';
                a.className = 'dropdown-item-inner';

                text.appendChild(document.createTextNode('Inner text'));

                a.appendChild(text);
                li.appendChild(a);
                menuInner.appendChild(li);
                menuInner.appendChild(divider);
                if (header) menu.appendChild(header);
                if (search) {
                    var input = document.createElement('input');
                    search.className = 'bs-searchbox';
                    input.className = 'form-control';
                    search.appendChild(input);
                    menu.appendChild(search);
                }
                if (actions) menu.appendChild(actions);
                menu.appendChild(menuInner);
                if (doneButton) menu.appendChild(doneButton);
                newElement.appendChild(menu);

                document.body.appendChild(newElement);

                var liHeight = a.offsetHeight,
                    headerHeight = header ? header.offsetHeight : 0,
                    searchHeight = search ? search.offsetHeight : 0,
                    actionsHeight = actions ? actions.offsetHeight : 0,
                    doneButtonHeight = doneButton ? doneButton.offsetHeight : 0,
                    dividerHeight = $(divider).outerHeight(true),
                    // fall back to jQuery if getComputedStyle is not supported
                    menuStyle = typeof getComputedStyle === 'function' ? getComputedStyle(menu) : false,
                    $menu = menuStyle ? null : $(menu),
                    menuPadding = {
                        vert: parseInt(menuStyle ? menuStyle.paddingTop : $menu.css('paddingTop')) +
                        parseInt(menuStyle ? menuStyle.paddingBottom : $menu.css('paddingBottom')) +
                        parseInt(menuStyle ? menuStyle.borderTopWidth : $menu.css('borderTopWidth')) +
                        parseInt(menuStyle ? menuStyle.borderBottomWidth : $menu.css('borderBottomWidth')),
                        horiz: parseInt(menuStyle ? menuStyle.paddingLeft : $menu.css('paddingLeft')) +
                        parseInt(menuStyle ? menuStyle.paddingRight : $menu.css('paddingRight')) +
                        parseInt(menuStyle ? menuStyle.borderLeftWidth : $menu.css('borderLeftWidth')) +
                        parseInt(menuStyle ? menuStyle.borderRightWidth : $menu.css('borderRightWidth')),
                    },
                    menuExtras = {
                        vert: menuPadding.vert +
                        parseInt(menuStyle ? menuStyle.marginTop : $menu.css('marginTop')) +
                        parseInt(menuStyle ? menuStyle.marginBottom : $menu.css('marginBottom')) + 2,
                        horiz: menuPadding.horiz +
                        parseInt(menuStyle ? menuStyle.marginLeft : $menu.css('marginLeft')) +
                        parseInt(menuStyle ? menuStyle.marginRight : $menu.css('marginRight')) + 2,
                    };

                document.body.removeChild(newElement);

                this.sizeInfo = {
                    liHeight: liHeight,
                    headerHeight: headerHeight,
                    searchHeight: searchHeight,
                    actionsHeight: actionsHeight,
                    doneButtonHeight: doneButtonHeight,
                    dividerHeight: dividerHeight,
                    menuPadding: menuPadding,
                    menuExtras: menuExtras,
                };
            },

            setSize: function() {
                this.findLis();
                this.liHeight();

                if (this.options.header) this.$menu.css('padding-top', 0);
                if (this.options.size === false) return;

                var that = this,
                    $menu = this.$menu,
                    $menuInner = this.$menuInner,
                    $window = $(window),
                    selectHeight = this.$newElement[0].offsetHeight,
                    selectWidth = this.$newElement[0].offsetWidth,
                    liHeight = this.sizeInfo['liHeight'],
                    headerHeight = this.sizeInfo['headerHeight'],
                    searchHeight = this.sizeInfo['searchHeight'],
                    actionsHeight = this.sizeInfo['actionsHeight'],
                    doneButtonHeight = this.sizeInfo['doneButtonHeight'],
                    divHeight = this.sizeInfo['dividerHeight'],
                    menuPadding = this.sizeInfo['menuPadding'],
                    menuExtras = this.sizeInfo['menuExtras'],
                    notDisabled = this.options.hideDisabled ? '.disabled' : '',
                    menuHeight,
                    menuWidth,
                    getHeight,
                    getWidth,
                    selectOffsetTop,
                    selectOffsetBot,
                    selectOffsetLeft,
                    selectOffsetRight,
                    getPos = function() {
                        var pos = that.$newElement.offset(),
                            $container = $(that.options.container),
                            containerPos;

                        if (that.options.container && !$container.is('body')) {
                            containerPos = $container.offset();
                            containerPos.top += parseInt($container.css('borderTopWidth'));
                            containerPos.left += parseInt($container.css('borderLeftWidth'));
                        } else {
                            containerPos = {top: 0, left: 0};
                        }

                        var winPad = that.options.windowPadding;
                        selectOffsetTop = pos.top - containerPos.top - $window.scrollTop();
                        selectOffsetBot = $window.height() - selectOffsetTop - selectHeight - containerPos.top - winPad[2];
                        selectOffsetLeft = pos.left - containerPos.left - $window.scrollLeft();
                        selectOffsetRight = $window.width() - selectOffsetLeft - selectWidth - containerPos.left - winPad[1];
                        selectOffsetTop -= winPad[0];
                        selectOffsetLeft -= winPad[3];
                    };

                getPos();

                if (this.options.size === 'auto') {
                    var getSize = function() {
                        var minHeight,
                            hasClass = function(className, include) {
                                return function(element) {
                                    if (include) {
                                        return (element.classList ? element.classList.contains(className) : $(element).hasClass(className));
                                    } else {
                                        return !(element.classList ? element.classList.contains(className) : $(element).hasClass(className));
                                    }
                                };
                            },
                            lis = that.$menuInner[0].getElementsByTagName('a'),
                            lisVisible = Array.prototype.filter ? Array.prototype.filter.call(lis, hasClass('d-none', false)) : that.$lis.not('.d-none'),
                            optGroup = Array.prototype.filter ? Array.prototype.filter.call(lisVisible, hasClass('dropdown-header', true)) : lisVisible.filter('.dropdown-header');

                        getPos();
                        menuHeight = selectOffsetBot - menuExtras.vert;
                        menuWidth = selectOffsetRight - menuExtras.horiz;

                        if (that.options.container) {
                            if (!$menu.data('height')) $menu.data('height', $menu.height());
                            getHeight = $menu.data('height');

                            if (!$menu.data('width')) $menu.data('width', $menu.width());
                            getWidth = $menu.data('width');
                        } else {
                            getHeight = $menu.height();
                            getWidth = $menu.width();
                        }

                        if (that.options.dropupAuto) {
                            that.$newElement.toggleClass('dropup', selectOffsetTop > selectOffsetBot && (menuHeight - menuExtras.vert) < getHeight);
                        }

                        if (that.$newElement.hasClass('dropup')) {
                            menuHeight = selectOffsetTop - menuExtras.vert;
                        }

                        if (that.options.dropdownAlignRight === 'auto') {
                            $menu.toggleClass('dropdown-menu-right', selectOffsetLeft > selectOffsetRight && (menuWidth - menuExtras.horiz) < (getWidth - selectWidth));
                        }

                        if ((lisVisible.length + optGroup.length) > 3) {
                            minHeight = liHeight * 3 + menuExtras.vert - 2;
                        } else {
                            minHeight = 0;
                        }

                        $menu.css({
                            'max-height': menuHeight + 'px',
                            'overflow': 'hidden',
                            'min-height': minHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight + 'px',
                        });
                        $menuInner.css({
                            'max-height': menuHeight - headerHeight - searchHeight - actionsHeight - doneButtonHeight - menuPadding.vert + 'px',
                            'overflow-y': 'auto',
                            'min-height': Math.max(minHeight - menuPadding.vert, 0) + 'px',
                        });
                    };
                    getSize();
                    this.$searchbox.off('input.getSize propertychange.getSize').on('input.getSize propertychange.getSize', getSize);
                    $window.off('resize.getSize scroll.getSize').on('resize.getSize scroll.getSize', getSize);
                } else if (this.options.size && this.options.size != 'auto' && this.$lis.not(notDisabled).length > this.options.size) {
                    var optIndex = this.$lis.not('.dropdown-divider').not(notDisabled).children().slice(0, this.options.size).last().parent().index(),
                        divLength = this.$lis.slice(0, optIndex + 1).filter('.dropdown-divider').length;
                    menuHeight = liHeight * this.options.size + divLength * divHeight + menuPadding.vert;

                    if (that.options.container) {
                        if (!$menu.data('height')) $menu.data('height', $menu.height());
                        getHeight = $menu.data('height');
                    } else {
                        getHeight = $menu.height();
                    }

                    if (that.options.dropupAuto) {
                        //noinspection JSUnusedAssignment
                        this.$newElement.toggleClass('dropup', selectOffsetTop > selectOffsetBot && (menuHeight - menuExtras.vert) < getHeight);
                    }
                    $menu.css({
                        'max-height': menuHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight + 'px',
                        'overflow': 'hidden',
                        'min-height': '',
                    });
                    $menuInner.css({
                        'max-height': menuHeight - menuPadding.vert + 'px',
                        'overflow-y': 'auto',
                        'min-height': '',
                    });
                }
            },

            setWidth: function() {
                if (this.options.width === 'auto') {
                    this.$menu.css('min-width', '0');

                    // Get correct width if element is hidden
                    var $selectClone = this.$menu.parent().clone().appendTo('body'),
                        $selectClone2 = this.options.container ? this.$newElement.clone().appendTo('body') : $selectClone,
                        ulWidth = $selectClone.children('.dropdown-menu').outerWidth(),
                        btnWidth = $selectClone2.css('width', 'auto').children('button').outerWidth();

                    $selectClone.remove();
                    $selectClone2.remove();

                    // Set width to whatever's larger, button title or longest option
                    this.$newElement.css('width', Math.max(ulWidth, btnWidth) + 'px');
                } else if (this.options.width === 'fit') {
                    // Remove inline min-width so width can be changed from 'auto'
                    this.$menu.css('min-width', '');
                    this.$newElement.css('width', '').addClass('fit-width');
                } else if (this.options.width) {
                    // Remove inline min-width so width can be changed from 'auto'
                    this.$menu.css('min-width', '');
                    this.$newElement.css('width', this.options.width);
                } else {
                    // Remove inline min-width/width so width can be changed
                    this.$menu.css('min-width', '');
                    this.$newElement.css('width', '');
                }
                // Remove fit-width class if width is changed programmatically
                if (this.$newElement.hasClass('fit-width') && this.options.width !== 'fit') {
                    this.$newElement.removeClass('fit-width');
                }
            },

            selectPosition: function() {
                this.$bsContainer = $('<div class="bs-container" />');

                var that = this,
                    $container = $(this.options.container),
                    pos,
                    containerPos,
                    actualHeight,
                    getPlacement = function($element) {
                        that.$bsContainer.addClass($element.attr('class').replace(/form-control|fit-width/gi, '')).toggleClass('dropup', $element.hasClass('dropup'));
                        pos = $element.offset();

                        if (!$container.is('body')) {
                            containerPos = $container.offset();
                            containerPos.top += parseInt($container.css('borderTopWidth')) - $container.scrollTop();
                            containerPos.left += parseInt($container.css('borderLeftWidth')) - $container.scrollLeft();
                        } else {
                            containerPos = {top: 0, left: 0};
                        }

                        actualHeight = $element.hasClass('dropup') ? 0 : $element[0].offsetHeight;

                        that.$bsContainer.css({
                            'top': pos.top - containerPos.top + actualHeight,
                            'left': pos.left - containerPos.left,
                            'width': $element[0].offsetWidth,
                        });
                    };

                this.$button.on('click', function() {
                    var $this = $(this);

                    if (that.isDisabled()) {
                        return;
                    }

                    getPlacement(that.$newElement);

                    that.$bsContainer.appendTo(that.options.container).toggleClass('open', !$this.hasClass('open')).append(that.$menu);
                });

                $(window).on('resize scroll', function() {
                    getPlacement(that.$newElement);
                });

                this.$element.on('hide.bs.select', function() {
                    that.$menu.data('height', that.$menu.height());
                    that.$bsContainer.detach();
                });
            },

            /**
             * @param {number} index - the index of the option that is being changed
             * @param {boolean} selected - true if the option is being selected, false if being deselected
             * @param {JQuery} $lis - the 'li' element that is being modified
             */
            setSelected: function(index, selected, $lis) {
                if (!$lis) {
                    this.togglePlaceholder(); // check if setSelected is being called by changing the value of the select
                    $lis = this.findLis().eq(this.liObj[index]);
                }

                $lis.toggleClass('selected', selected).find('span.dropdown-item-inner').attr('aria-selected', selected);
            },

            /**
             * @param {number} index - the index of the option that is being disabled
             * @param {boolean} disabled - true if the option is being disabled, false if being enabled
             * @param {JQuery} $lis - the 'li' element that is being modified
             */
            setDisabled: function(index, disabled, $lis) {
                if (!$lis) {
                    $lis = this.findLis().eq(this.liObj[index]);
                }

                if (disabled) {
                    $lis.addClass('disabled').children('span.dropdown-item-inner').attr('href', '#').attr('tabindex', -1).attr('aria-disabled', true);
                } else {
                    $lis.removeClass('disabled').children('span.dropdown-item-inner').removeAttr('href').attr('tabindex', 0).attr('aria-disabled', false);
                }
            },

            isDisabled: function() {
                return this.$element[0].disabled;
            },

            checkDisabled: function() {
                var that = this;

                if (this.isDisabled()) {
                    this.$newElement.addClass('disabled');
                    this.$button.addClass('disabled').attr('tabindex', -1).attr('aria-disabled', true);
                } else {
                    if (this.$button.hasClass('disabled')) {
                        this.$newElement.removeClass('disabled');
                        this.$button.removeClass('disabled').attr('aria-disabled', false);
                    }

                    if (this.$button.attr('tabindex') == -1 && !this.$element.data('tabindex')) {
                        this.$button.removeAttr('tabindex');
                    }
                }

                this.$button.click(function() {
                    return !that.isDisabled();
                });
            },

            togglePlaceholder: function() {
                var value = this.$element.val();
                this.$button.toggleClass('bs-placeholder', value === null || value === '' || (value.constructor === Array && value.length === 0));
            },

            tabIndex: function() {
                if (this.$element.data('tabindex') !== this.$element.attr('tabindex') &&
                    (this.$element.attr('tabindex') !== -98 && this.$element.attr('tabindex') !== '-98')) {
                    this.$element.data('tabindex', this.$element.attr('tabindex'));
                    this.$button.attr('tabindex', this.$element.data('tabindex'));
                }

                this.$element.attr('tabindex', -98);
            },

            clickListener: function() {
                var that = this,
                    $document = $(document);

                $document.data('spaceSelect', false);

                this.$button.on('keyup', function(e) {
                    if (/(32)/.test(e.keyCode.toString(10)) && $document.data('spaceSelect')) {
                        e.preventDefault();
                        $document.data('spaceSelect', false);
                    }
                });

                this.$button.on('click', function() {
                    that.setSize();
                });

                this.$element.on('shown.bs.select', function() {
                    if (!that.options.liveSearch && !that.multiple) {
                        that.$menuInner.find('a.selected').focus();
                    } else if (!that.multiple) {
                        var selectedIndex = that.liObj[that.$element[0].selectedIndex];

                        if (typeof selectedIndex !== 'number' || that.options.size === false) return;

                        // scroll to selected option
                        var offset = that.$lis.eq(selectedIndex)[0].offsetTop - that.$menuInner[0].offsetTop;
                        offset = offset - that.$menuInner[0].offsetHeight / 2 + that.sizeInfo.liHeight / 2;
                        that.$menuInner[0].scrollTop = offset;
                    }
                });

                this.$menuInner.on('click', 'a', function(e) {
                    var $this = $(this).find('span.dropdown-item-inner'),
                        clickedIndex = $this.parent().data('originalIndex'),
                        prevValue = that.$element.val(),
                        prevIndex = that.$element.prop('selectedIndex'),
                        triggerChange = true;

                    // Don't close on multi choice menu
                    if (that.multiple && that.options.maxOptions !== 1) {
                        e.stopPropagation();
                    }

                    e.preventDefault();

                    //Don't run if we have been disabled
                    if (!that.isDisabled() && !$this.parent().hasClass('disabled')) {
                        var $options = that.$element.find('option'),
                            $option = $options.eq(clickedIndex),
                            state = $option.prop('selected'),
                            $optgroup = $option.parent('optgroup'),
                            maxOptions = that.options.maxOptions,
                            maxOptionsGrp = $optgroup.data('maxOptions') || false;

                        if (!that.multiple) { // Deselect all others if not multi select box
                            $options.prop('selected', false);
                            $option.prop('selected', true);
                            that.$menuInner.find('.selected').removeClass('selected').find('span.dropdown-item-inner').attr('aria-selected', false);
                            that.setSelected(clickedIndex, true);
                        } else { // Toggle the one we have chosen if we are multi select.
                            $option.prop('selected', !state);
                            that.setSelected(clickedIndex, !state);
                            $this.blur();

                            if (maxOptions !== false || maxOptionsGrp !== false) {
                                var maxReached = maxOptions < $options.filter(':selected').length,
                                    maxReachedGrp = maxOptionsGrp < $optgroup.find('option:selected').length;

                                if ((maxOptions && maxReached) || (maxOptionsGrp && maxReachedGrp)) {
                                    if (maxOptions && maxOptions == 1) {
                                        $options.prop('selected', false);
                                        $option.prop('selected', true);
                                        that.$menuInner.find('.selected').removeClass('selected');
                                        that.setSelected(clickedIndex, true);
                                    } else if (maxOptionsGrp && maxOptionsGrp == 1) {
                                        $optgroup.find('option:selected').prop('selected', false);
                                        $option.prop('selected', true);
                                        var optgroupID = $this.parent().data('optgroup');
                                        that.$menuInner.find('[data-optgroup="' + optgroupID + '"]').removeClass('selected');
                                        that.setSelected(clickedIndex, true);
                                    } else {
                                        var maxOptionsText = typeof that.options.maxOptionsText === 'string' ? [that.options.maxOptionsText, that.options.maxOptionsText] : that.options.maxOptionsText,
                                            maxOptionsArr = typeof maxOptionsText === 'function' ? maxOptionsText(maxOptions, maxOptionsGrp) : maxOptionsText,
                                            maxTxt = maxOptionsArr[0].replace('{n}', maxOptions),
                                            maxTxtGrp = maxOptionsArr[1].replace('{n}', maxOptionsGrp),
                                            $notify = $('<div class="notify"></div>');
                                        // If {var} is set in array, replace it
                                        /** @deprecated */
                                        if (maxOptionsArr[2]) {
                                            maxTxt = maxTxt.replace('{var}', maxOptionsArr[2][maxOptions > 1 ? 0 : 1]);
                                            maxTxtGrp = maxTxtGrp.replace('{var}', maxOptionsArr[2][maxOptionsGrp > 1 ? 0 : 1]);
                                        }

                                        $option.prop('selected', false);

                                        that.$menu.append($notify);

                                        if (maxOptions && maxReached) {
                                            $notify.append($('<div>' + maxTxt + '</div>'));
                                            triggerChange = false;
                                            that.$element.trigger('maxReached.bs.select');
                                        }

                                        if (maxOptionsGrp && maxReachedGrp) {
                                            $notify.append($('<div>' + maxTxtGrp + '</div>'));
                                            triggerChange = false;
                                            that.$element.trigger('maxReachedGrp.bs.select');
                                        }

                                        setTimeout(function() {
                                            that.setSelected(clickedIndex, false);
                                        }, 10);

                                        $notify.delay(750).fadeOut(300, function() {
                                            $(this).remove();
                                        });
                                    }
                                }
                            }
                        }

                        if (!that.multiple || (that.multiple && that.options.maxOptions === 1)) {
                            that.$button.focus();
                        } else if (that.options.liveSearch) {
                            that.$searchbox.focus();
                        }

                        // Trigger select 'change'
                        if (triggerChange) {
                            if ((prevValue != that.$element.val() && that.multiple) || (prevIndex != that.$element.prop('selectedIndex') && !that.multiple)) {
                                // $option.prop('selected') is current option state (selected/unselected). state is previous option state.
                                changed_arguments = [clickedIndex, $option.prop('selected'), state];
                                that.$element.triggerNative('change');
                            }
                        }
                    }
                });

                this.$menu.on('click', 'a.disabled span.dropdown-item-inner , .popover-title, .popover-title :not(.close)', function(e) {
                    if (e.currentTarget == this) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (that.options.liveSearch && !$(e.target).hasClass('close')) {
                            that.$searchbox.focus();
                        } else {
                            that.$button.focus();
                        }
                    }
                });

                this.$menuInner.on('click', '.dropdown-divider, .dropdown-header', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (that.options.liveSearch) {
                        that.$searchbox.focus();
                    } else {
                        that.$button.focus();
                    }
                });

                this.$menu.on('click', '.popover-title .close', function() {
                    that.$button.click();
                });

                this.$searchbox.on('click', function(e) {
                    e.stopPropagation();
                });

                this.$menu.on('click', '.actions-btn', function(e) {
                    if (that.options.liveSearch) {
                        that.$searchbox.focus();
                    } else {
                        that.$button.focus();
                    }

                    e.preventDefault();
                    e.stopPropagation();

                    if ($(this).hasClass('bs-select-all')) {
                        that.selectAll();
                    } else {
                        that.deselectAll();
                    }
                });

                this.$element.change(function() {
                    that.render(false);
                    that.$element.trigger('changed.bs.select', changed_arguments);
                    changed_arguments = null;
                });
            },

            liveSearchListener: function() {
                var that = this,
                    $no_results = $('<li class="no-results"></li>');

                this.$button.on('click.dropdown.data-api', function() {
                    that.$menuInner.find('.active').removeClass('active');
                    if (!!that.$searchbox.val()) {
                        that.$searchbox.val('');
                        that.$lis.not('.is-hidden').removeClass('d-none');
                        if (!!$no_results.parent().length) $no_results.remove();
                    }
                    if (!that.multiple) that.$menuInner.find('.selected').addClass('active');
                    setTimeout(function() {
                        that.$searchbox.focus();
                    }, 10);
                });

                this.$searchbox.on('click.dropdown.data-api focus.dropdown.data-api touchend.dropdown.data-api', function(e) {
                    e.stopPropagation();
                });

                this.$searchbox.on('input propertychange', function() {
                    that.$lis.not('.is-hidden').removeClass('d-none');
                    that.$lis.filter('.active').removeClass('active');
                    $no_results.remove();

                    if (that.$searchbox.val()) {
                        var $searchBase = that.$lis.not('.is-hidden, .dropdown-divider, .dropdown-header'),
                            $hideItems;

                        if (that.options.liveSearchNormalize) {
                            $hideItems = $searchBase.not(':a' + that._searchStyle() + '("' + normalizeToBase(that.$searchbox.val()) + '")');
                        } else {
                            $hideItems = $searchBase.not(':' + that._searchStyle() + '("' + that.$searchbox.val() + '")');
                        }

                        if ($hideItems.length === $searchBase.length) {
                            $no_results.html(that.options.noneResultsText.replace('{0}', '"' + htmlEscape(that.$searchbox.val()) + '"'));
                            that.$menuInner.append($no_results);
                            that.$lis.addClass('d-none');
                        } else {
                            $hideItems.addClass('d-none');

                            var $lisVisible = that.$lis.not('.d-none'),
                                $foundDiv;

                            // hide divider if first or last visible, or if followed by another divider
                            $lisVisible.each(function(index) {
                                var $this = $(this);

                                if ($this.hasClass('dropdown-divider')) {
                                    if ($foundDiv === undefined) {
                                        $this.addClass('d-none');
                                    } else {
                                        if ($foundDiv) $foundDiv.addClass('d-none');
                                        $foundDiv = $this;
                                    }
                                } else if ($this.hasClass('dropdown-header') && $lisVisible.eq(index + 1).data('optgroup') !== $this.data('optgroup')) {
                                    $this.addClass('d-none');
                                } else {
                                    $foundDiv = null;
                                }
                            });
                            if ($foundDiv) $foundDiv.addClass('d-none');

                            $searchBase.not('.d-none').first().addClass('active');
                            that.$menuInner.scrollTop(0);
                        }

                        that.updatePosition();
                    }
                });
            },

            _searchStyle: function() {
                var styles = {
                    begins: 'ibegins',
                    startsWith: 'ibegins',
                };

                return styles[this.options.liveSearchStyle] || 'icontains';
            },

            val: function(value) {
                if (typeof value !== 'undefined') {
                    this.$element.val(value);
                    this.render();

                    return this.$element;
                } else {
                    return this.$element.val();
                }
            },

            changeAll: function(status) {
                if (!this.multiple) return;
                if (typeof status === 'undefined') status = true;

                this.findLis();

                var $options = this.$element.find('option'),
                    $lisVisible = this.$lis.not('.dropdown-divider, .dropdown-header, .disabled, .d-none'),
                    lisVisLen = $lisVisible.length,
                    selectedOptions = [];

                if (status) {
                    if ($lisVisible.filter('.selected').length === $lisVisible.length) return;
                } else {
                    if ($lisVisible.filter('.selected').length === 0) return;
                }

                $lisVisible.toggleClass('selected', status);

                for (var i = 0; i < lisVisLen; i++) {
                    var origIndex = $lisVisible[i].getAttribute('data-original-index');
                    selectedOptions[selectedOptions.length] = $options.eq(origIndex)[0];
                }

                $(selectedOptions).prop('selected', status);

                this.render(false);

                this.togglePlaceholder();

                this.$element.triggerNative('change');
            },

            selectAll: function() {
                return this.changeAll(true);
            },

            deselectAll: function() {
                return this.changeAll(false);
            },

            toggle: function(e) {
                e = e || window.event;

                if (e) e.stopPropagation();

                this.$button.trigger('click');
            },

            keydown: function(e) {
                var $this = $(this),
                    $parent = $this.is('input') ? $this.parent().parent() : $this.parent(),
                    $items,
                    that = $parent.data('this'),
                    index,
                    prevIndex,
                    isActive,
                    selector = ':not(.disabled, .d-none, .dropdown-header, .dropdown-divider)',
                    keyCodeMap = {
                        32: ' ',
                        48: '0',
                        49: '1',
                        50: '2',
                        51: '3',
                        52: '4',
                        53: '5',
                        54: '6',
                        55: '7',
                        56: '8',
                        57: '9',
                        59: ';',
                        65: 'a',
                        66: 'b',
                        67: 'c',
                        68: 'd',
                        69: 'e',
                        70: 'f',
                        71: 'g',
                        72: 'h',
                        73: 'i',
                        74: 'j',
                        75: 'k',
                        76: 'l',
                        77: 'm',
                        78: 'n',
                        79: 'o',
                        80: 'p',
                        81: 'q',
                        82: 'r',
                        83: 's',
                        84: 't',
                        85: 'u',
                        86: 'v',
                        87: 'w',
                        88: 'x',
                        89: 'y',
                        90: 'z',
                        96: '0',
                        97: '1',
                        98: '2',
                        99: '3',
                        100: '4',
                        101: '5',
                        102: '6',
                        103: '7',
                        104: '8',
                        105: '9',
                    };

                isActive = that.$newElement.hasClass('open') || that.$newElement.hasClass('show');

                if (!isActive && (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode >= 65 && e.keyCode <= 90)) {
                    if (!that.options.container) {
                        that.setSize();
                        that.$menu.parent().addClass('open show');
                        isActive = true;
                    } else {
                        that.$button.trigger('click');
                    }
                    that.$searchbox.focus();
                    return;
                }

                if (that.options.liveSearch) {
                    if (/(^9$|27)/.test(e.keyCode.toString(10)) && isActive) {
                        e.preventDefault();
                        e.stopPropagation();
                        that.$menuInner.click();
                        that.$button.focus();
                    }
                }

                if (/(38|40)/.test(e.keyCode.toString(10))) {
                    $items = that.$lis.filter(selector);
                    if (!$items.length) return;

                    if (!that.options.liveSearch) {
                        index = $items.index($items.filter(':focus'));
                    } else {
                        index = $items.index($items.filter('.active'));
                    }

                    prevIndex = that.$menuInner.data('prevIndex');

                    if (e.keyCode == 38) {
                        if ((that.options.liveSearch || index == prevIndex) && index != -1) index--;
                        if (index < 0) index += $items.length;
                    } else if (e.keyCode == 40) {
                        if (that.options.liveSearch || index == prevIndex) index++;
                        index = index % $items.length;
                    }

                    that.$menuInner.data('prevIndex', index);

                    if (!that.options.liveSearch) {
                        $items.eq(index).focus();
                    } else {
                        e.preventDefault();
                        if (!$this.hasClass('dropdown-toggle')) {
                            $items.removeClass('active').eq(index).addClass('active').children('span.dropdown-item-inner').focus();
                            $this.focus();
                        }
                    }

                } else if (!$this.is('input')) {
                    var keyIndex = [],
                        count,
                        prevKey;

                    $items = that.$lis.filter(selector);
                    $items.each(function(i) {
                        if ($.trim($(this).children('span.dropdown-item-inner').text().toLowerCase()).substring(0, 1) == keyCodeMap[e.keyCode]) {
                            keyIndex.push(i);
                        }
                    });

                    count = $(document).data('keycount');
                    count++;
                    $(document).data('keycount', count);

                    prevKey = $.trim($(':focus').text().toLowerCase()).substring(0, 1);

                    if (prevKey != keyCodeMap[e.keyCode]) {
                        count = 1;
                        $(document).data('keycount', count);
                    } else if (count >= keyIndex.length) {
                        $(document).data('keycount', 0);
                        if (count > keyIndex.length) count = 1;
                    }

                    $items.eq(keyIndex[count - 1]).children('span.dropdown-item-inner').focus();
                }

                // Select focused option if "Enter", "Spacebar" or "Tab" (when selectOnTab is true) are pressed inside the menu.
                if ((/(13|32)/.test(e.keyCode.toString(10)) || (/(^9$)/.test(e.keyCode.toString(10)) && that.options.selectOnTab)) && isActive) {
                    if (!/(32)/.test(e.keyCode.toString(10))) e.preventDefault();
                    if (!that.options.liveSearch) {
                        var elem = $(':focus');
                        elem.click();
                        // Bring back focus for multiselects
                        elem.focus();
                        // Prevent screen from scrolling if the user hit the spacebar
                        e.preventDefault();
                        // Fixes spacebar selection of dropdown items in FF & IE
                        $(document).data('spaceSelect', true);
                    } else if (!/(32)/.test(e.keyCode.toString(10))) {
                        that.$menuInner.find('a.active').click();
                        $this.focus();
                    }
                    $(document).data('keycount', 0);
                }

                if ((/(^9$|27)/.test(e.keyCode.toString(10)) && isActive && (that.multiple || that.options.liveSearch)) || (/(27)/.test(e.keyCode.toString(10)) && !isActive)) {
                    that.$menu.parent().removeClass('open');
                    if (that.options.container) that.$newElement.removeClass('open');
                    that.$button.focus();
                }
            },

            mobile: function() {
                this.$element.addClass('mobile-device');
            },

            refresh: function() {
                this.$lis = null;
                this.liObj = {};
                this.reloadLi();
                this.render();
                this.checkDisabled();
                this.liHeight(true);
                this.setStyle();
                this.setWidth();
                if (this.$lis) this.$searchbox.trigger('propertychange');

                this.$element.trigger('refreshed.bs.select');
            },

            hide: function() {
                this.$newElement.hide();
            },

            show: function() {
                this.$newElement.show();
            },

            remove: function() {
                this.$newElement.remove();
                this.$element.remove();
            },

            destroy: function() {
                this.$newElement.before(this.$element).remove();

                if (this.$bsContainer) {
                    this.$bsContainer.remove();
                } else {
                    this.$menu.remove();
                }

                this.$element.off('.bs.select').removeData('selectpicker').removeClass('bs-select-hidden selectpicker');
            },
        };

        // SELECTPICKER PLUGIN DEFINITION
        // ==============================
        function Plugin(option) {
            // get the args of the outer function..
            var args = arguments;
            // The arguments of the function are explicitly re-defined from the argument list, because the shift causes them
            // to get lost/corrupted in android 2.3 and IE9 #715 #775
            var _option = option;

            [].shift.apply(args);

            var value;
            var chain = this.each(function() {
                var $this = $(this);
                if ($this.is('select')) {
                    var data = $this.data('selectpicker'),
                        options = typeof _option == 'object' && _option;

                    if (!data) {
                        var config = $.extend({}, Selectpicker.DEFAULTS, $.fn.selectpicker.defaults || {}, $this.data(), options);
                        config.template = $.extend({}, Selectpicker.DEFAULTS.template, ($.fn.selectpicker.defaults ? $.fn.selectpicker.defaults.template : {}), $this.data().template, options.template);
                        $this.data('selectpicker', (data = new Selectpicker(this, config)));
                    } else if (options) {
                        for (var i in options) {
                            if (options.hasOwnProperty(i)) {
                                data.options[i] = options[i];
                            }
                        }
                    }

                    if (typeof _option == 'string') {
                        if (data[_option] instanceof Function) {
                            value = data[_option].apply(data, args);
                        } else {
                            value = data.options[_option];
                        }
                    }
                }
            });

            if (typeof value !== 'undefined') {
                //noinspection JSUnusedAssignment
                return value;
            } else {
                return chain;
            }
        }

        var old = $.fn.selectpicker;
        $.fn.selectpicker = Plugin;
        $.fn.selectpicker.Constructor = Selectpicker;

        // SELECTPICKER NO CONFLICT
        // ========================
        $.fn.selectpicker.noConflict = function() {
            $.fn.selectpicker = old;
            return this;
        };

        $(document).data('keycount', 0).on('keydown.bs.select', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="listbox"], .bs-searchbox input', Selectpicker.prototype.keydown).on('focusin.modal', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="listbox"], .bs-searchbox input', function(e) {
            e.stopPropagation();
        });

        // SELECTPICKER DATA-API
        // =====================
        $(window).on('load.bs.select.data-api', function() {
            $('.selectpicker').each(function() {
                var $selectpicker = $(this);
                Plugin.call($selectpicker, $selectpicker.data());
            });
        });
    })(jQuery);

}));

// ==================================================
// fancyBox v3.4.1
//
// Licensed GPLv3 for open source use
// or fancyBox Commercial License for commercial use
//
// http://fancyapps.com/fancybox/
// Copyright 2018 fancyApps
//
// ==================================================
!function(t,e,n,o){"use strict";function i(t,e){var o,i,a,s=[],r=0;t&&t.isDefaultPrevented()||(t.preventDefault(),e=e||{},t&&t.data&&(e=p(t.data.options,e)),o=e.$target||n(t.currentTarget).trigger("blur"),a=n.fancybox.getInstance(),a&&a.$trigger&&a.$trigger.is(o)||(e.selector?s=n(e.selector):(i=o.attr("data-fancybox")||"",i?(s=t.data?t.data.items:[],s=s.length?s.filter('[data-fancybox="'+i+'"]'):n('[data-fancybox="'+i+'"]')):s=[o]),r=n(s).index(o),r<0&&(r=0),a=n.fancybox.open(s,e,r),a.$trigger=o))}if(t.console=t.console||{info:function(t){}},n){if(n.fn.fancybox)return void console.info("fancyBox already initialized");var a={closeExisting:!1,loop:!1,gutter:50,keyboard:!0,arrows:!0,infobar:!0,smallBtn:"auto",toolbar:"auto",buttons:["zoom","thumbs","close"],idleTime:3,protect:!1,modal:!1,image:{preload:!1},ajax:{settings:{data:{fancybox:!0}}},iframe:{tpl:'<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen allowtransparency="true" src=""></iframe>',preload:!0,css:{},attr:{scrolling:"auto"}},video:{tpl:'<video class="fancybox-video" controls controlsList="nodownload"><source src="{{src}}" type="{{format}}" />Your browser doesn\'t support HTML5 video</video>',format:"",autoStart:!0},defaultType:"image",animationEffect:"zoom",animationDuration:366,zoomOpacity:"auto",transitionEffect:"fade",transitionDuration:366,slideClass:"",baseClass:"",baseTpl:'<div class="fancybox-container" role="dialog" tabindex="-1"><div class="fancybox-bg"></div><div class="fancybox-inner"><div class="fancybox-infobar"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div><div class="fancybox-toolbar">{{buttons}}</div><div class="fancybox-navigation">{{arrows}}</div><div class="fancybox-stage"></div><div class="fancybox-caption"></div></div></div>',spinnerTpl:'<div class="fancybox-loading"></div>',errorTpl:'<div class="fancybox-error"><p>{{ERROR}}</p></div>',btnTpl:{download:'<a download data-fancybox-download class="fancybox-button fancybox-button--download" title="{{DOWNLOAD}}" href="javascript:;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.62 17.09V19H5.38v-1.91zm-2.97-6.96L17 11.45l-5 4.87-5-4.87 1.36-1.32 2.68 2.64V5h1.92v7.77z"/></svg></a>',zoom:'<button data-fancybox-zoom class="fancybox-button fancybox-button--zoom" title="{{ZOOM}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.7 17.3l-3-3a5.9 5.9 0 0 0-.6-7.6 5.9 5.9 0 0 0-8.4 0 5.9 5.9 0 0 0 0 8.4 5.9 5.9 0 0 0 7.7.7l3 3a1 1 0 0 0 1.3 0c.4-.5.4-1 0-1.5zM8.1 13.8a4 4 0 0 1 0-5.7 4 4 0 0 1 5.7 0 4 4 0 0 1 0 5.7 4 4 0 0 1-5.7 0z"/></svg></button>',close:'<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"/></svg></button>',arrowLeft:'<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z"/></svg></div></button>',arrowRight:'<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z"/></svg></div></button>',smallBtn:'<button type="button" data-fancybox-close class="fancybox-button fancybox-close-small" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 24 24"><path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"/></svg></button>'},parentEl:"body",hideScrollbar:!0,autoFocus:!0,backFocus:!0,trapFocus:!0,fullScreen:{autoStart:!1},touch:{vertical:!0,momentum:!0},hash:null,media:{},slideShow:{autoStart:!1,speed:3e3},thumbs:{autoStart:!1,hideOnClose:!0,parentEl:".fancybox-container",axis:"y"},wheel:"auto",onInit:n.noop,beforeLoad:n.noop,afterLoad:n.noop,beforeShow:n.noop,afterShow:n.noop,beforeClose:n.noop,afterClose:n.noop,onActivate:n.noop,onDeactivate:n.noop,clickContent:function(t,e){return"image"===t.type&&"zoom"},clickSlide:"close",clickOutside:"close",dblclickContent:!1,dblclickSlide:!1,dblclickOutside:!1,mobile:{idleTime:!1,clickContent:function(t,e){return"image"===t.type&&"toggleControls"},clickSlide:function(t,e){return"image"===t.type?"toggleControls":"close"},dblclickContent:function(t,e){return"image"===t.type&&"zoom"},dblclickSlide:function(t,e){return"image"===t.type&&"zoom"}},lang:"en",i18n:{en:{CLOSE:"Close",NEXT:"Next",PREV:"Previous",ERROR:"The requested content cannot be loaded. <br/> Please try again later.",PLAY_START:"Start slideshow",PLAY_STOP:"Pause slideshow",FULL_SCREEN:"Full screen",THUMBS:"Thumbnails",DOWNLOAD:"Download",SHARE:"Share",ZOOM:"Zoom"},de:{CLOSE:"Schliessen",NEXT:"Weiter",PREV:"Zurück",ERROR:"Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es später nochmal.",PLAY_START:"Diaschau starten",PLAY_STOP:"Diaschau beenden",FULL_SCREEN:"Vollbild",THUMBS:"Vorschaubilder",DOWNLOAD:"Herunterladen",SHARE:"Teilen",ZOOM:"Maßstab"}}},s=n(t),r=n(e),c=0,l=function(t){return t&&t.hasOwnProperty&&t instanceof n},d=function(){return t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||function(e){return t.setTimeout(e,1e3/60)}}(),u=function(){var t,n=e.createElement("fakeelement"),i={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(t in i)if(n.style[t]!==o)return i[t];return"transitionend"}(),f=function(t){return t&&t.length&&t[0].offsetHeight},p=function(t,e){var o=n.extend(!0,{},t,e);return n.each(e,function(t,e){n.isArray(e)&&(o[t]=e)}),o},h=function(t,e,o){var i=this;i.opts=p({index:o},n.fancybox.defaults),n.isPlainObject(e)&&(i.opts=p(i.opts,e)),n.fancybox.isMobile&&(i.opts=p(i.opts,i.opts.mobile)),i.id=i.opts.id||++c,i.currIndex=parseInt(i.opts.index,10)||0,i.prevIndex=null,i.prevPos=null,i.currPos=0,i.firstRun=!0,i.group=[],i.slides={},i.addContent(t),i.group.length&&i.init()};n.extend(h.prototype,{init:function(){var i,a,s,r=this,c=r.group[r.currIndex],l=c.opts,d=n.fancybox.scrollbarWidth;l.closeExisting&&n.fancybox.close(!0),n("body").addClass("fancybox-active"),!n.fancybox.getInstance()&&l.hideScrollbar!==!1&&!n.fancybox.isMobile&&e.body.scrollHeight>t.innerHeight&&(d===o&&(i=n('<div style="width:100px;height:100px;overflow:scroll;" />').appendTo("body"),d=n.fancybox.scrollbarWidth=i[0].offsetWidth-i[0].clientWidth,i.remove()),n("head").append('<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar { margin-right: '+d+"px; }</style>"),n("body").addClass("compensate-for-scrollbar")),s="",n.each(l.buttons,function(t,e){s+=l.btnTpl[e]||""}),a=n(r.translate(r,l.baseTpl.replace("{{buttons}}",s).replace("{{arrows}}",l.btnTpl.arrowLeft+l.btnTpl.arrowRight))).attr("id","fancybox-container-"+r.id).addClass(l.baseClass).data("FancyBox",r).appendTo(l.parentEl),r.$refs={container:a},["bg","inner","infobar","toolbar","stage","caption","navigation"].forEach(function(t){r.$refs[t]=a.find(".fancybox-"+t)}),r.trigger("onInit"),r.activate(),r.jumpTo(r.currIndex)},translate:function(t,e){var n=t.opts.i18n[t.opts.lang];return e.replace(/\{\{(\w+)\}\}/g,function(t,e){var i=n[e];return i===o?t:i})},addContent:function(t){var e,i=this,a=n.makeArray(t);n.each(a,function(t,e){var a,s,r,c,l,d={},u={};n.isPlainObject(e)?(d=e,u=e.opts||e):"object"===n.type(e)&&n(e).length?(a=n(e),u=a.data()||{},u=n.extend(!0,{},u,u.options),u.$orig=a,d.src=i.opts.src||u.src||a.attr("href"),d.type||d.src||(d.type="inline",d.src=e)):d={type:"html",src:e+""},d.opts=n.extend(!0,{},i.opts,u),n.isArray(u.buttons)&&(d.opts.buttons=u.buttons),n.fancybox.isMobile&&d.opts.mobile&&(d.opts=p(d.opts,d.opts.mobile)),s=d.type||d.opts.type,c=d.src||"",!s&&c&&((r=c.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i))?(s="video",d.opts.video.format||(d.opts.video.format="video/"+("ogv"===r[1]?"ogg":r[1]))):c.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i)?s="image":c.match(/\.(pdf)((\?|#).*)?$/i)?s="iframe":"#"===c.charAt(0)&&(s="inline")),s?d.type=s:i.trigger("objectNeedsType",d),d.contentType||(d.contentType=n.inArray(d.type,["html","inline","ajax"])>-1?"html":d.type),d.index=i.group.length,"auto"==d.opts.smallBtn&&(d.opts.smallBtn=n.inArray(d.type,["html","inline","ajax"])>-1),"auto"===d.opts.toolbar&&(d.opts.toolbar=!d.opts.smallBtn),d.opts.$trigger&&d.index===i.opts.index&&(d.opts.$thumb=d.opts.$trigger.find("img:first"),d.opts.$thumb.length&&(d.opts.$orig=d.opts.$trigger)),d.opts.$thumb&&d.opts.$thumb.length||!d.opts.$orig||(d.opts.$thumb=d.opts.$orig.find("img:first")),"function"===n.type(d.opts.caption)&&(d.opts.caption=d.opts.caption.apply(e,[i,d])),"function"===n.type(i.opts.caption)&&(d.opts.caption=i.opts.caption.apply(e,[i,d])),d.opts.caption instanceof n||(d.opts.caption=d.opts.caption===o?"":d.opts.caption+""),"ajax"===d.type&&(l=c.split(/\s+/,2),l.length>1&&(d.src=l.shift(),d.opts.filter=l.shift())),d.opts.modal&&(d.opts=n.extend(!0,d.opts,{infobar:0,toolbar:0,smallBtn:0,keyboard:0,slideShow:0,fullScreen:0,thumbs:0,touch:0,clickContent:!1,clickSlide:!1,clickOutside:!1,dblclickContent:!1,dblclickSlide:!1,dblclickOutside:!1})),i.group.push(d)}),Object.keys(i.slides).length&&(i.updateControls(),e=i.Thumbs,e&&e.isActive&&(e.create(),e.focus()))},addEvents:function(){var e=this;e.removeEvents(),e.$refs.container.on("click.fb-close","[data-fancybox-close]",function(t){t.stopPropagation(),t.preventDefault(),e.close(t)}).on("touchstart.fb-prev click.fb-prev","[data-fancybox-prev]",function(t){t.stopPropagation(),t.preventDefault(),e.previous()}).on("touchstart.fb-next click.fb-next","[data-fancybox-next]",function(t){t.stopPropagation(),t.preventDefault(),e.next()}).on("click.fb","[data-fancybox-zoom]",function(t){e[e.isScaledDown()?"scaleToActual":"scaleToFit"]()}),s.on("orientationchange.fb resize.fb",function(t){t&&t.originalEvent&&"resize"===t.originalEvent.type?d(function(){e.update()}):(e.current&&"iframe"===e.current.type&&e.$refs.stage.hide(),setTimeout(function(){e.$refs.stage.show(),e.update()},n.fancybox.isMobile?600:250))}),r.on("keydown.fb",function(t){var o=n.fancybox?n.fancybox.getInstance():null,i=o.current,a=t.keyCode||t.which;if(9==a)return void(i.opts.trapFocus&&e.focus(t));if(!(!i.opts.keyboard||t.ctrlKey||t.altKey||t.shiftKey||n(t.target).is("input")||n(t.target).is("textarea")))return 8===a||27===a?(t.preventDefault(),void e.close(t)):37===a||38===a?(t.preventDefault(),void e.previous()):39===a||40===a?(t.preventDefault(),void e.next()):void e.trigger("afterKeydown",t,a)}),e.group[e.currIndex].opts.idleTime&&(e.idleSecondsCounter=0,r.on("mousemove.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle",function(t){e.idleSecondsCounter=0,e.isIdle&&e.showControls(),e.isIdle=!1}),e.idleInterval=t.setInterval(function(){e.idleSecondsCounter++,e.idleSecondsCounter>=e.group[e.currIndex].opts.idleTime&&!e.isDragging&&(e.isIdle=!0,e.idleSecondsCounter=0,e.hideControls())},1e3))},removeEvents:function(){var e=this;s.off("orientationchange.fb resize.fb"),r.off("keydown.fb .fb-idle"),this.$refs.container.off(".fb-close .fb-prev .fb-next"),e.idleInterval&&(t.clearInterval(e.idleInterval),e.idleInterval=null)},previous:function(t){return this.jumpTo(this.currPos-1,t)},next:function(t){return this.jumpTo(this.currPos+1,t)},jumpTo:function(t,e){var i,a,s,r,c,l,d,u=this,f=u.group.length;if(!(u.isDragging||u.isClosing||u.isAnimating&&u.firstRun)){if(t=parseInt(t,10),s=u.current?u.current.opts.loop:u.opts.loop,!s&&(t<0||t>=f))return!1;if(i=u.firstRun=!Object.keys(u.slides).length,!(f<2&&!i&&u.isDragging)){if(c=u.current,u.prevIndex=u.currIndex,u.prevPos=u.currPos,r=u.createSlide(t),f>1&&((s||r.index<f-1)&&u.createSlide(t+1),(s||r.index>0)&&u.createSlide(t-1)),u.current=r,u.currIndex=r.index,u.currPos=r.pos,u.trigger("beforeShow",i),u.updateControls(),a=u.isMoved(r),r.forcedDuration=o,n.isNumeric(e)?r.forcedDuration=e:e=r.opts[i?"animationDuration":"transitionDuration"],e=parseInt(e,10),i)return r.opts.animationEffect&&e&&u.$refs.container.css("transition-duration",e+"ms"),u.$refs.container.addClass("fancybox-is-open"),r.$slide.addClass("fancybox-slide--previous"),u.loadSlide(r),r.$slide.removeClass("fancybox-slide--previous").addClass("fancybox-slide--current"),u.preload("image"),void u.$refs.container.trigger("focus");n.each(u.slides,function(t,e){n.fancybox.stop(e.$slide,!0),e.$slide.removeClass("fancybox-animated").removeClass(function(t,e){return(e.match(/(^|\s)fancybox-fx-\S+/g)||[]).join(" ")})}),r.$slide.removeClass("fancybox-slide--next fancybox-slide--previous").addClass("fancybox-slide--current"),a?(l=Math.round(r.$slide.width()),n.each(u.slides,function(t,o){var i=o.pos-r.pos;n.fancybox.animate(o.$slide,{top:0,left:i*l+i*o.opts.gutter},e,function(){o.$slide.removeAttr("style").removeClass("fancybox-slide--next fancybox-slide--previous"),o.pos===u.currPos&&u.complete()})})):u.$refs.stage.children().removeAttr("style"),r.isLoaded?u.revealContent(r):u.loadSlide(r),u.preload("image"),c.pos!==r.pos&&(d="fancybox-slide--"+(c.pos>r.pos?"next":"previous"),c.$slide.removeClass("fancybox-slide--complete fancybox-slide--current fancybox-slide--next fancybox-slide--previous"),c.isComplete=!1,e&&(a||r.opts.transitionEffect)&&(a?c.$slide.addClass(d):(d="fancybox-animated "+d+" fancybox-fx-"+r.opts.transitionEffect,n.fancybox.animate(c.$slide,d,e,null,!1))))}}},createSlide:function(t){var e,o,i=this;return o=t%i.group.length,o=o<0?i.group.length+o:o,!i.slides[t]&&i.group[o]&&(e=n('<div class="fancybox-slide"></div>').appendTo(i.$refs.stage),i.slides[t]=n.extend(!0,{},i.group[o],{pos:t,$slide:e,isLoaded:!1}),i.updateSlide(i.slides[t])),i.slides[t]},scaleToActual:function(t,e,i){var a,s,r,c,l,d=this,u=d.current,f=u.$content,p=n.fancybox.getTranslate(u.$slide).width,h=n.fancybox.getTranslate(u.$slide).height,g=u.width,b=u.height;!d.isAnimating&&f&&"image"==u.type&&u.isLoaded&&!u.hasError&&(n.fancybox.stop(f),d.isAnimating=!0,t=t===o?.5*p:t,e=e===o?.5*h:e,a=n.fancybox.getTranslate(f),a.top-=n.fancybox.getTranslate(u.$slide).top,a.left-=n.fancybox.getTranslate(u.$slide).left,c=g/a.width,l=b/a.height,s=.5*p-.5*g,r=.5*h-.5*b,g>p&&(s=a.left*c-(t*c-t),s>0&&(s=0),s<p-g&&(s=p-g)),b>h&&(r=a.top*l-(e*l-e),r>0&&(r=0),r<h-b&&(r=h-b)),d.updateCursor(g,b),n.fancybox.animate(f,{top:r,left:s,scaleX:c,scaleY:l},i||330,function(){d.isAnimating=!1}),d.SlideShow&&d.SlideShow.isActive&&d.SlideShow.stop())},scaleToFit:function(t){var e,o=this,i=o.current,a=i.$content;!o.isAnimating&&a&&"image"==i.type&&i.isLoaded&&!i.hasError&&(n.fancybox.stop(a),o.isAnimating=!0,e=o.getFitPos(i),o.updateCursor(e.width,e.height),n.fancybox.animate(a,{top:e.top,left:e.left,scaleX:e.width/a.width(),scaleY:e.height/a.height()},t||330,function(){o.isAnimating=!1}))},getFitPos:function(t){var e,o,i,a,s=this,r=t.$content,c=t.$slide,l=t.width||t.opts.width,d=t.height||t.opts.height,u={};return!!(t.isLoaded&&r&&r.length)&&(e=n.fancybox.getTranslate(s.$refs.stage).width,o=n.fancybox.getTranslate(s.$refs.stage).height,e-=parseFloat(c.css("paddingLeft"))+parseFloat(c.css("paddingRight"))+parseFloat(r.css("marginLeft"))+parseFloat(r.css("marginRight")),o-=parseFloat(c.css("paddingTop"))+parseFloat(c.css("paddingBottom"))+parseFloat(r.css("marginTop"))+parseFloat(r.css("marginBottom")),l&&d||(l=e,d=o),i=Math.min(1,e/l,o/d),l=Math.floor(i*l),d=Math.floor(i*d),"image"===t.type?(u.top=Math.floor(.5*(o-d))+parseFloat(c.css("paddingTop")),u.left=Math.floor(.5*(e-l))+parseFloat(c.css("paddingLeft"))):"video"===t.contentType&&(a=t.opts.width&&t.opts.height?l/d:t.opts.ratio||16/9,d>l/a?d=l/a:l>d*a&&(l=d*a)),u.width=l,u.height=d,u)},update:function(){var t=this;n.each(t.slides,function(e,n){t.updateSlide(n)})},updateSlide:function(t){var e=this,o=t&&t.$content,i=t.width||t.opts.width,a=t.height||t.opts.height,s=t.$slide;o&&(i||a||"video"===t.contentType)&&!t.hasError&&(n.fancybox.stop(o),n.fancybox.setTranslate(o,e.getFitPos(t)),t.pos===e.currPos&&(e.isAnimating=!1,e.updateCursor())),s.length&&(s.trigger("refresh"),e.$refs.toolbar.toggleClass("compensate-for-scrollbar",s.get(0).scrollHeight>s.get(0).clientHeight)),e.trigger("onUpdate",t)},centerSlide:function(t,e){var i,a,s=this;s.current&&(i=Math.round(t.$slide.width()),a=t.pos-s.current.pos,n.fancybox.animate(t.$slide,{top:0,left:a*i+a*t.opts.gutter,opacity:1},e===o?0:e,null,!1))},isMoved:function(t){var e=t||this.current,o=n.fancybox.getTranslate(e.$slide);return(0!==o.left||0!==o.top)&&!e.$slide.hasClass("fancybox-animated")},updateCursor:function(t,e){var o,i=this,a=i.current,s=i.$refs.container.removeClass("fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-zoomOut fancybox-can-swipe fancybox-can-pan");a&&!i.isClosing&&(o=i.isZoomable(),s.toggleClass("fancybox-is-zoomable",o),n("[data-fancybox-zoom]").prop("disabled",!o),i.canPan(t,e)?s.addClass("fancybox-can-pan"):o&&("zoom"===a.opts.clickContent||n.isFunction(a.opts.clickContent)&&"zoom"==a.opts.clickContent(a))?s.addClass("fancybox-can-zoomIn"):a.opts.touch&&(a.opts.touch.vertical||i.group.length>1)&&"video"!==a.contentType&&s.addClass("fancybox-can-swipe"))},isZoomable:function(){var t,e=this,n=e.current;if(n&&!e.isClosing&&"image"===n.type&&!n.hasError){if(!n.isLoaded)return!0;if(t=e.getFitPos(n),n.width>t.width||n.height>t.height)return!0}return!1},isScaledDown:function(t,e){var i=this,a=!1,s=i.current,r=s.$content;return t!==o&&e!==o?a=t<s.width&&e<s.height:r&&(a=n.fancybox.getTranslate(r),a=a.width<s.width&&a.height<s.height),a},canPan:function(t,e){var i,a,s=this,r=!1,c=s.current;return"image"===c.type&&(i=c.$content)&&!c.hasError&&(r=s.getFitPos(c),a=t!==o&&e!==o?{width:t,height:e}:n.fancybox.getTranslate(i),r=Math.abs(a.width-r.width)>1.5||Math.abs(a.height-r.height)>1.5),r},loadSlide:function(t){var e,o,i,a=this;if(!t.isLoading&&!t.isLoaded){switch(t.isLoading=!0,a.trigger("beforeLoad",t),e=t.type,o=t.$slide,o.off("refresh").trigger("onReset").addClass(t.opts.slideClass),e){case"image":a.setImage(t);break;case"iframe":a.setIframe(t);break;case"html":a.setContent(t,t.src||t.content);break;case"video":a.setContent(t,t.opts.video.tpl.replace("{{src}}",t.src).replace("{{format}}",t.opts.videoFormat||t.opts.video.format));break;case"inline":n(t.src).length?a.setContent(t,n(t.src)):a.setError(t);break;case"ajax":a.showLoading(t),i=n.ajax(n.extend({},t.opts.ajax.settings,{url:t.src,success:function(e,n){"success"===n&&a.setContent(t,e)},error:function(e,n){e&&"abort"!==n&&a.setError(t)}})),o.one("onReset",function(){i.abort()});break;default:a.setError(t)}return!0}},setImage:function(e){var o,i,a,s,r,c=this,l=e.opts.srcset||e.opts.image.srcset;if(e.timouts=setTimeout(function(){var t=e.$image;!e.isLoading||t&&t.length&&t[0].complete||e.hasError||c.showLoading(e)},350),l){s=t.devicePixelRatio||1,r=t.innerWidth*s,a=l.split(",").map(function(t){var e={};return t.trim().split(/\s+/).forEach(function(t,n){var o=parseInt(t.substring(0,t.length-1),10);return 0===n?e.url=t:void(o&&(e.value=o,e.postfix=t[t.length-1]))}),e}),a.sort(function(t,e){return t.value-e.value});for(var d=0;d<a.length;d++){var u=a[d];if("w"===u.postfix&&u.value>=r||"x"===u.postfix&&u.value>=s){i=u;break}}!i&&a.length&&(i=a[a.length-1]),i&&(e.src=i.url,e.width&&e.height&&"w"==i.postfix&&(e.height=e.width/e.height*i.value,e.width=i.value),e.opts.srcset=l)}e.$content=n('<div class="fancybox-content"></div>').addClass("fancybox-is-hidden").appendTo(e.$slide.addClass("fancybox-slide--image")),o=e.opts.thumb||!(!e.opts.$thumb||!e.opts.$thumb.length)&&e.opts.$thumb.attr("src"),e.opts.preload!==!1&&e.opts.width&&e.opts.height&&o&&(e.width=e.opts.width,e.height=e.opts.height,e.$ghost=n("<img />").one("error",function(){n(this).remove(),e.$ghost=null}).one("load",function(){c.afterLoad(e)}).addClass("fancybox-image").appendTo(e.$content).attr("src",o)),c.setBigImage(e)},setBigImage:function(t){var e=this,o=n("<img />");t.$image=o.one("error",function(){e.setError(t)}).one("load",function(){var n;t.$ghost||(e.resolveImageSlideSize(t,this.naturalWidth,this.naturalHeight),e.afterLoad(t)),t.timouts&&(clearTimeout(t.timouts),t.timouts=null),e.isClosing||(t.opts.srcset&&(n=t.opts.sizes,n&&"auto"!==n||(n=(t.width/t.height>1&&s.width()/s.height()>1?"100":Math.round(t.width/t.height*100))+"vw"),o.attr("sizes",n).attr("srcset",t.opts.srcset)),t.$ghost&&setTimeout(function(){t.$ghost&&!e.isClosing&&t.$ghost.hide()},Math.min(300,Math.max(1e3,t.height/1600))),e.hideLoading(t))}).addClass("fancybox-image").attr("src",t.src).appendTo(t.$content),(o[0].complete||"complete"==o[0].readyState)&&o[0].naturalWidth&&o[0].naturalHeight?o.trigger("load"):o[0].error&&o.trigger("error")},resolveImageSlideSize:function(t,e,n){var o=parseInt(t.opts.width,10),i=parseInt(t.opts.height,10);t.width=e,t.height=n,o>0&&(t.width=o,t.height=Math.floor(o*n/e)),i>0&&(t.width=Math.floor(i*e/n),t.height=i)},setIframe:function(t){var e,i=this,a=t.opts.iframe,s=t.$slide;t.$content=n('<div class="fancybox-content'+(a.preload?" fancybox-is-hidden":"")+'"></div>').css(a.css).appendTo(s),s.addClass("fancybox-slide--"+t.contentType),t.$iframe=e=n(a.tpl.replace(/\{rnd\}/g,(new Date).getTime())).attr(a.attr).appendTo(t.$content),a.preload?(i.showLoading(t),e.on("load.fb error.fb",function(e){this.isReady=1,t.$slide.trigger("refresh"),i.afterLoad(t)}),s.on("refresh.fb",function(){var n,i,r=t.$content,c=a.css.width,l=a.css.height;if(1===e[0].isReady){try{n=e.contents(),i=n.find("body")}catch(t){}i&&i.length&&i.children().length&&(s.css("overflow","visible"),r.css({width:"100%",height:""}),c===o&&(c=Math.ceil(Math.max(i[0].clientWidth,i.outerWidth(!0)))),c&&r.width(c),l===o&&(l=Math.ceil(Math.max(i[0].clientHeight,i.outerHeight(!0)))),l&&r.height(l),s.css("overflow","auto")),r.removeClass("fancybox-is-hidden")}})):this.afterLoad(t),e.attr("src",t.src),s.one("onReset",function(){try{n(this).find("iframe").hide().unbind().attr("src","//about:blank")}catch(t){}n(this).off("refresh.fb").empty(),t.isLoaded=!1})},setContent:function(t,e){var o=this;o.isClosing||(o.hideLoading(t),t.$content&&n.fancybox.stop(t.$content),t.$slide.empty(),l(e)&&e.parent().length?(e.hasClass("fancybox-content")&&e.parent(".fancybox-slide--html").trigger("onReset"),t.$placeholder=n("<div>").hide().insertAfter(e),e.css("display","inline-block")):t.hasError||("string"===n.type(e)&&(e=n("<div>").append(n.trim(e)).contents()),t.opts.filter&&(e=n("<div>").html(e).find(t.opts.filter))),t.$slide.one("onReset",function(){n(this).find("video,audio").trigger("pause"),t.$placeholder&&(t.$placeholder.after(e.removeClass("fancybox-content").hide()).remove(),t.$placeholder=null),t.$smallBtn&&(t.$smallBtn.remove(),t.$smallBtn=null),t.hasError||(n(this).empty(),t.isLoaded=!1,t.isRevealed=!1)}),n(e).appendTo(t.$slide),n(e).is("video,audio")&&(n(e).addClass("fancybox-video"),n(e).wrap("<div></div>"),t.contentType="video",t.opts.width=t.opts.width||n(e).attr("width"),t.opts.height=t.opts.height||n(e).attr("height")),t.$content=t.$slide.children().filter("div,form,main,video,audio,article,.fancybox-content").first(),t.$content.siblings().hide(),t.$content.length||(t.$content=t.$slide.wrapInner("<div></div>").children().first()),t.$content.addClass("fancybox-content"),t.$slide.addClass("fancybox-slide--"+t.contentType),this.afterLoad(t))},setError:function(t){t.hasError=!0,t.$slide.trigger("onReset").removeClass("fancybox-slide--"+t.contentType).addClass("fancybox-slide--error"),t.contentType="html",this.setContent(t,this.translate(t,t.opts.errorTpl)),t.pos===this.currPos&&(this.isAnimating=!1)},showLoading:function(t){var e=this;t=t||e.current,t&&!t.$spinner&&(t.$spinner=n(e.translate(e,e.opts.spinnerTpl)).appendTo(t.$slide))},hideLoading:function(t){var e=this;t=t||e.current,t&&t.$spinner&&(t.$spinner.remove(),delete t.$spinner)},afterLoad:function(t){var e=this;e.isClosing||(t.isLoading=!1,t.isLoaded=!0,e.trigger("afterLoad",t),e.hideLoading(t),t.pos===e.currPos&&e.updateCursor(),!t.opts.smallBtn||t.$smallBtn&&t.$smallBtn.length||(t.$smallBtn=n(e.translate(t,t.opts.btnTpl.smallBtn)).appendTo(t.$content)),t.opts.protect&&t.$content&&!t.hasError&&(t.$content.on("contextmenu.fb",function(t){return 2==t.button&&t.preventDefault(),!0}),"image"===t.type&&n('<div class="fancybox-spaceball"></div>').appendTo(t.$content)),e.revealContent(t))},revealContent:function(t){var e,i,a,s,r=this,c=t.$slide,l=!1,d=!1,u=r.isMoved(t),p=t.isRevealed;if(!u||!p){if(t.isRevealed=!0,e=t.opts[r.firstRun?"animationEffect":"transitionEffect"],a=t.opts[r.firstRun?"animationDuration":"transitionDuration"],a=parseInt(t.forcedDuration===o?a:t.forcedDuration,10),t.pos===r.currPos&&(t.isComplete?e=!1:r.isAnimating=!0),!u&&t.pos===r.currPos&&a||(e=!1),"zoom"===e&&(t.pos===r.currPos&&a&&"image"===t.type&&!t.hasError&&(d=r.getThumbPos(t))?l=r.getFitPos(t):e="fade"),"zoom"===e)return l.scaleX=l.width/d.width,l.scaleY=l.height/d.height,s=t.opts.zoomOpacity,"auto"==s&&(s=Math.abs(t.width/t.height-d.width/d.height)>.1),s&&(d.opacity=.1,l.opacity=1),n.fancybox.setTranslate(t.$content.removeClass("fancybox-is-hidden"),d),f(t.$content),void n.fancybox.animate(t.$content,l,a,function(){r.isAnimating=!1,r.complete()});if(r.updateSlide(t),!e)return f(c),p||t.$content.removeClass("fancybox-is-hidden").hide().fadeIn("fast"),void(t.pos===r.currPos&&r.complete());n.fancybox.stop(c),i="fancybox-animated fancybox-slide--"+(t.pos>=r.prevPos?"next":"previous")+" fancybox-fx-"+e,c.removeAttr("style").removeClass("fancybox-slide--current fancybox-slide--next fancybox-slide--previous").addClass(i),t.$content.removeClass("fancybox-is-hidden"),f(c),n.fancybox.animate(c,"fancybox-slide--current",a,function(){c.removeClass(i).removeAttr("style"),t.pos===r.currPos&&r.complete()},!0)}},getThumbPos:function(o){var i,a=this,s=!1,r=o.opts.$thumb,c=r&&r.length&&r[0].ownerDocument===e?r.offset():0,l=function(e){for(var o,i=e[0],a=i.getBoundingClientRect(),s=[];null!==i.parentElement;)"hidden"!==n(i.parentElement).css("overflow")&&"auto"!==n(i.parentElement).css("overflow")||s.push(i.parentElement.getBoundingClientRect()),i=i.parentElement;return o=s.every(function(t){var e=Math.min(a.right,t.right)-Math.max(a.left,t.left),n=Math.min(a.bottom,t.bottom)-Math.max(a.top,t.top);return e>0&&n>0}),o&&a.bottom>0&&a.right>0&&a.left<n(t).width()&&a.top<n(t).height()};return c&&l(r)&&(i=a.$refs.stage.offset(),s={top:c.top-i.top+parseFloat(r.css("border-top-width")||0),left:c.left-i.left+parseFloat(r.css("border-left-width")||0),width:r.width(),height:r.height(),scaleX:1,scaleY:1}),s},complete:function(){var t,e=this,o=e.current,i={};!e.isMoved()&&o.isLoaded&&(o.isComplete||(o.isComplete=!0,o.$slide.siblings().trigger("onReset"),e.preload("inline"),f(o.$slide),o.$slide.addClass("fancybox-slide--complete"),n.each(e.slides,function(t,o){o.pos>=e.currPos-1&&o.pos<=e.currPos+1?i[o.pos]=o:o&&(n.fancybox.stop(o.$slide),o.$slide.off().remove())}),e.slides=i),e.isAnimating=!1,e.updateCursor(),e.trigger("afterShow"),o.opts.video.autoStart&&o.$slide.find("video,audio").filter(":visible:first").trigger("play"),o.opts.autoFocus&&"html"===o.contentType&&(t=o.$content.find("input[autofocus]:enabled:visible:first"),t.length?t.trigger("focus"):e.focus(null,!0)),o.$slide.scrollTop(0).scrollLeft(0))},preload:function(t){var e=this,n=e.slides[e.currPos+1],o=e.slides[e.currPos-1];o&&o.type===t&&e.loadSlide(o),n&&n.type===t&&e.loadSlide(n)},focus:function(t,o){var i,a,s=this,r=["a[href]","area[href]",'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',"select:not([disabled]):not([aria-hidden])","textarea:not([disabled]):not([aria-hidden])","button:not([disabled]):not([aria-hidden])","iframe","object","embed","[contenteditable]",'[tabindex]:not([tabindex^="-"])'].join(",");s.isClosing||(i=!t&&s.current&&s.current.isComplete?s.current.$slide.find("*:visible"+(o?":not(.fancybox-close-small)":"")):s.$refs.container.find("*:visible"),i=i.filter(r).filter(function(){return"hidden"!==n(this).css("visibility")&&!n(this).hasClass("disabled")}),i.length?(a=i.index(e.activeElement),t&&t.shiftKey?(a<0||0==a)&&(t.preventDefault(),i.eq(i.length-1).trigger("focus")):(a<0||a==i.length-1)&&(t&&t.preventDefault(),i.eq(0).trigger("focus"))):s.$refs.container.trigger("focus"))},activate:function(){var t=this;n(".fancybox-container").each(function(){var e=n(this).data("FancyBox");e&&e.id!==t.id&&!e.isClosing&&(e.trigger("onDeactivate"),e.removeEvents(),e.isVisible=!1)}),t.isVisible=!0,(t.current||t.isIdle)&&(t.update(),t.updateControls()),t.trigger("onActivate"),t.addEvents()},close:function(t,e){var o,i,a,s,r,c,l,p=this,h=p.current,g=function(){p.cleanUp(t)};return!p.isClosing&&(p.isClosing=!0,p.trigger("beforeClose",t)===!1?(p.isClosing=!1,d(function(){p.update()}),!1):(p.removeEvents(),h.timouts&&clearTimeout(h.timouts),a=h.$content,o=h.opts.animationEffect,i=n.isNumeric(e)?e:o?h.opts.animationDuration:0,h.$slide.off(u).removeClass("fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated"),h.$slide.siblings().trigger("onReset").remove(),i&&p.$refs.container.removeClass("fancybox-is-open").addClass("fancybox-is-closing"),p.hideLoading(h),p.hideControls(),p.updateCursor(),"zoom"!==o||t!==!0&&a&&i&&"image"===h.type&&!h.hasError&&(l=p.getThumbPos(h))||(o="fade"),"zoom"===o?(n.fancybox.stop(a),s=n.fancybox.getTranslate(a),c={top:s.top,left:s.left,scaleX:s.width/l.width,scaleY:s.height/l.height,width:l.width,height:l.height},r=h.opts.zoomOpacity,"auto"==r&&(r=Math.abs(h.width/h.height-l.width/l.height)>.1),r&&(l.opacity=0),n.fancybox.setTranslate(a,c),f(a),n.fancybox.animate(a,l,i,g),!0):(o&&i?t===!0?setTimeout(g,i):n.fancybox.animate(h.$slide.removeClass("fancybox-slide--current"),"fancybox-animated fancybox-slide--previous fancybox-fx-"+o,i,g):g(),!0)))},cleanUp:function(e){var o,i,a,s=this,r=s.current.opts.$orig;s.current.$slide.trigger("onReset"),s.$refs.container.empty().remove(),s.trigger("afterClose",e),s.current.opts.backFocus&&(r&&r.length&&r.is(":visible")||(r=s.$trigger),r&&r.length&&(i=t.scrollX,a=t.scrollY,r.trigger("focus"),n("html, body").scrollTop(a).scrollLeft(i))),s.current=null,o=n.fancybox.getInstance(),o?o.activate():(n("body").removeClass("fancybox-active compensate-for-scrollbar"),n("#fancybox-style-noscroll").remove())},trigger:function(t,e){var o,i=Array.prototype.slice.call(arguments,1),a=this,s=e&&e.opts?e:a.current;return s?i.unshift(s):s=a,i.unshift(a),n.isFunction(s.opts[t])&&(o=s.opts[t].apply(s,i)),o===!1?o:void("afterClose"!==t&&a.$refs?a.$refs.container.trigger(t+".fb",i):r.trigger(t+".fb",i))},updateControls:function(){var t=this,o=t.current,i=o.index,a=o.opts.caption,s=t.$refs.container,r=t.$refs.caption;o.$slide.trigger("refresh"),t.$caption=a&&a.length?r.html(a):null,t.isHiddenControls||t.isIdle||t.showControls(),s.find("[data-fancybox-count]").html(t.group.length),s.find("[data-fancybox-index]").html(i+1),s.find("[data-fancybox-prev]").prop("disabled",!o.opts.loop&&i<=0),s.find("[data-fancybox-next]").prop("disabled",!o.opts.loop&&i>=t.group.length-1),"image"===o.type?s.find("[data-fancybox-zoom]").show().end().find("[data-fancybox-download]").attr("href",o.opts.image.src||o.src).show():o.opts.toolbar&&s.find("[data-fancybox-download],[data-fancybox-zoom]").hide(),n(e.activeElement).is(":hidden,[disabled]")&&t.$refs.container.trigger("focus")},hideControls:function(){this.isHiddenControls=!0,this.$refs.container.removeClass("fancybox-show-infobar fancybox-show-toolbar fancybox-show-caption fancybox-show-nav")},showControls:function(){var t=this,e=t.current?t.current.opts:t.opts,n=t.$refs.container;t.isHiddenControls=!1,
t.idleSecondsCounter=0,n.toggleClass("fancybox-show-toolbar",!(!e.toolbar||!e.buttons)).toggleClass("fancybox-show-infobar",!!(e.infobar&&t.group.length>1)).toggleClass("fancybox-show-caption",!!t.$caption).toggleClass("fancybox-show-nav",!!(e.arrows&&t.group.length>1)).toggleClass("fancybox-is-modal",!!e.modal)},toggleControls:function(){this.isHiddenControls?this.showControls():this.hideControls()}}),n.fancybox={version:"3.4.1",defaults:a,getInstance:function(t){var e=n('.fancybox-container:not(".fancybox-is-closing"):last').data("FancyBox"),o=Array.prototype.slice.call(arguments,1);return e instanceof h&&("string"===n.type(t)?e[t].apply(e,o):"function"===n.type(t)&&t.apply(e,o),e)},open:function(t,e,n){return new h(t,e,n)},close:function(t){var e=this.getInstance();e&&(e.close(),t===!0&&this.close(t))},destroy:function(){this.close(!0),r.add("body").off("click.fb-start","**")},isMobile:/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),use3d:function(){var n=e.createElement("div");return t.getComputedStyle&&t.getComputedStyle(n)&&t.getComputedStyle(n).getPropertyValue("transform")&&!(e.documentMode&&e.documentMode<11)}(),getTranslate:function(t){var e;return!(!t||!t.length)&&(e=t[0].getBoundingClientRect(),{top:e.top||0,left:e.left||0,width:e.width,height:e.height,opacity:parseFloat(t.css("opacity"))})},setTranslate:function(t,e){var n="",i={};if(t&&e)return e.left===o&&e.top===o||(n=(e.left===o?t.position().left:e.left)+"px, "+(e.top===o?t.position().top:e.top)+"px",n=this.use3d?"translate3d("+n+", 0px)":"translate("+n+")"),e.scaleX!==o&&e.scaleY!==o&&(n=(n.length?n+" ":"")+"scale("+e.scaleX+", "+e.scaleY+")"),n.length&&(i.transform=n),e.opacity!==o&&(i.opacity=e.opacity),e.width!==o&&(i.width=e.width),e.height!==o&&(i.height=e.height),t.css(i)},animate:function(t,e,i,a,s){var r,c=!1;n.isFunction(i)&&(a=i,i=null),n.isPlainObject(e)||t.removeAttr("style"),n.fancybox.stop(t),t.on(u,function(o){(!o||!o.originalEvent||t.is(o.originalEvent.target)&&"z-index"!=o.originalEvent.propertyName)&&(n.fancybox.stop(t),c&&n.fancybox.setTranslate(t,c),n.isNumeric(i)&&t.css("transition-duration",""),n.isPlainObject(e)?s===!1&&t.removeAttr("style"):s!==!0&&t.removeClass(e),n.isFunction(a)&&a(o))}),n.isNumeric(i)&&t.css("transition-duration",i+"ms"),n.isPlainObject(e)?(e.scaleX!==o&&e.scaleY!==o&&(r=n.fancybox.getTranslate(t),c=n.extend({},e,{width:r.width*e.scaleX,height:r.height*e.scaleY,scaleX:1,scaleY:1}),delete e.width,delete e.height,t.parent().hasClass("fancybox-slide--image")&&t.parent().addClass("fancybox-is-scaling")),n.fancybox.setTranslate(t,e)):t.addClass(e),t.data("timer",setTimeout(function(){t.trigger("transitionend")},i+16))},stop:function(t,e){t&&t.length&&(clearTimeout(t.data("timer")),e&&t.trigger(u),t.off(u).css("transition-duration",""),t.parent().removeClass("fancybox-is-scaling"))}},n.fn.fancybox=function(t){var e;return t=t||{},e=t.selector||!1,e?n("body").off("click.fb-start",e).on("click.fb-start",e,{options:t},i):this.off("click.fb-start").on("click.fb-start",{items:this,options:t},i),this},r.on("click.fb-start","[data-fancybox]",i),r.on("click.fb-start","[data-fancybox-trigger]",function(t){n('[data-fancybox="'+n(this).attr("data-fancybox-trigger")+'"]').eq(n(this).attr("data-fancybox-index")||0).trigger("click.fb-start",{$trigger:n(this)})}),function(){var t=".fancybox-button",e="fancybox-focus",o=null;r.on("mousedown mouseup focus blur",t,function(i){switch(i.type){case"mousedown":o=n(this);break;case"mouseup":o=null;break;case"focusin":n(t).removeClass(e),n(this).is(o)||n(this).is("[disabled]")||n(this).addClass(e);break;case"focusout":n(t).removeClass(e)}})}()}}(window,document,jQuery),function(t){"use strict";var e=function(e,n,o){if(e)return o=o||"","object"===t.type(o)&&(o=t.param(o,!0)),t.each(n,function(t,n){e=e.replace("$"+t,n||"")}),o.length&&(e+=(e.indexOf("?")>0?"&":"?")+o),e},n={youtube:{matcher:/(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,params:{autoplay:1,autohide:1,fs:1,rel:0,hd:1,wmode:"transparent",enablejsapi:1,html5:1},paramPlace:8,type:"iframe",url:"//www.youtube-nocookie.com/embed/$4",thumb:"//img.youtube.com/vi/$4/hqdefault.jpg"},vimeo:{matcher:/^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,params:{autoplay:1,hd:1,show_title:1,show_byline:1,show_portrait:0,fullscreen:1,api:1},paramPlace:3,type:"iframe",url:"//player.vimeo.com/video/$2"},instagram:{matcher:/(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,type:"image",url:"//$1/p/$2/media/?size=l"},gmap_place:{matcher:/(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,type:"iframe",url:function(t){return"//maps.google."+t[2]+"/?ll="+(t[9]?t[9]+"&z="+Math.floor(t[10])+(t[12]?t[12].replace(/^\//,"&"):""):t[12]+"").replace(/\?/,"&")+"&output="+(t[12]&&t[12].indexOf("layer=c")>0?"svembed":"embed")}},gmap_search:{matcher:/(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)/i,type:"iframe",url:function(t){return"//maps.google."+t[2]+"/maps?q="+t[5].replace("query=","q=").replace("api=1","")+"&output=embed"}}};t(document).on("objectNeedsType.fb",function(o,i,a){var s,r,c,l,d,u,f,p=a.src||"",h=!1;s=t.extend(!0,{},n,a.opts.media),t.each(s,function(n,o){if(c=p.match(o.matcher)){if(h=o.type,f=n,u={},o.paramPlace&&c[o.paramPlace]){d=c[o.paramPlace],"?"==d[0]&&(d=d.substring(1)),d=d.split("&");for(var i=0;i<d.length;++i){var s=d[i].split("=",2);2==s.length&&(u[s[0]]=decodeURIComponent(s[1].replace(/\+/g," ")))}}return l=t.extend(!0,{},o.params,a.opts[n],u),p="function"===t.type(o.url)?o.url.call(this,c,l,a):e(o.url,c,l),r="function"===t.type(o.thumb)?o.thumb.call(this,c,l,a):e(o.thumb,c),"youtube"===n?p=p.replace(/&t=((\d+)m)?(\d+)s/,function(t,e,n,o){return"&start="+((n?60*parseInt(n,10):0)+parseInt(o,10))}):"vimeo"===n&&(p=p.replace("&%23","#")),!1}}),h?(a.opts.thumb||a.opts.$thumb&&a.opts.$thumb.length||(a.opts.thumb=r),"iframe"===h&&(a.opts=t.extend(!0,a.opts,{iframe:{preload:!1,attr:{scrolling:"no"}}})),t.extend(a,{type:h,src:p,origSrc:a.src,contentSource:f,contentType:"image"===h?"image":"gmap_place"==f||"gmap_search"==f?"map":"video"})):p&&(a.type=a.opts.defaultType)})}(jQuery),function(t,e,n){"use strict";var o=function(){return t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||function(e){return t.setTimeout(e,1e3/60)}}(),i=function(){return t.cancelAnimationFrame||t.webkitCancelAnimationFrame||t.mozCancelAnimationFrame||t.oCancelAnimationFrame||function(e){t.clearTimeout(e)}}(),a=function(e){var n=[];e=e.originalEvent||e||t.e,e=e.touches&&e.touches.length?e.touches:e.changedTouches&&e.changedTouches.length?e.changedTouches:[e];for(var o in e)e[o].pageX?n.push({x:e[o].pageX,y:e[o].pageY}):e[o].clientX&&n.push({x:e[o].clientX,y:e[o].clientY});return n},s=function(t,e,n){return e&&t?"x"===n?t.x-e.x:"y"===n?t.y-e.y:Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2)):0},r=function(t){if(t.is('a,area,button,[role="button"],input,label,select,summary,textarea,video,audio')||n.isFunction(t.get(0).onclick)||t.data("selectable"))return!0;for(var e=0,o=t[0].attributes,i=o.length;e<i;e++)if("data-fancybox-"===o[e].nodeName.substr(0,14))return!0;return!1},c=function(e){var n=t.getComputedStyle(e)["overflow-y"],o=t.getComputedStyle(e)["overflow-x"],i=("scroll"===n||"auto"===n)&&e.scrollHeight>e.clientHeight,a=("scroll"===o||"auto"===o)&&e.scrollWidth>e.clientWidth;return i||a},l=function(t){for(var e=!1;;){if(e=c(t.get(0)))break;if(t=t.parent(),!t.length||t.hasClass("fancybox-stage")||t.is("body"))break}return e},d=function(t){var e=this;e.instance=t,e.$bg=t.$refs.bg,e.$stage=t.$refs.stage,e.$container=t.$refs.container,e.destroy(),e.$container.on("touchstart.fb.touch mousedown.fb.touch",n.proxy(e,"ontouchstart"))};d.prototype.destroy=function(){this.$container.off(".fb.touch")},d.prototype.ontouchstart=function(o){var i=this,c=n(o.target),d=i.instance,u=d.current,f=u.$slide,p=u.$content,h="touchstart"==o.type;if(h&&i.$container.off("mousedown.fb.touch"),(!o.originalEvent||2!=o.originalEvent.button)&&f.length&&c.length&&!r(c)&&!r(c.parent())&&(c.is("img")||!(o.originalEvent.clientX>c[0].clientWidth+c.offset().left))){if(!u||d.isAnimating||d.isClosing)return o.stopPropagation(),void o.preventDefault();if(i.realPoints=i.startPoints=a(o),i.startPoints.length){if(u.touch&&o.stopPropagation(),i.startEvent=o,i.canTap=!0,i.$target=c,i.$content=p,i.opts=u.opts.touch,i.isPanning=!1,i.isSwiping=!1,i.isZooming=!1,i.isScrolling=!1,i.canPan=d.canPan(),i.startTime=(new Date).getTime(),i.distanceX=i.distanceY=i.distance=0,i.canvasWidth=Math.round(f[0].clientWidth),i.canvasHeight=Math.round(f[0].clientHeight),i.contentLastPos=null,i.contentStartPos=n.fancybox.getTranslate(i.$content)||{top:0,left:0},i.sliderStartPos=i.sliderLastPos||n.fancybox.getTranslate(f),i.stagePos=n.fancybox.getTranslate(d.$refs.stage),i.sliderStartPos.top-=i.stagePos.top,i.sliderStartPos.left-=i.stagePos.left,i.contentStartPos.top-=i.stagePos.top,i.contentStartPos.left-=i.stagePos.left,n(e).off(".fb.touch").on(h?"touchend.fb.touch touchcancel.fb.touch":"mouseup.fb.touch mouseleave.fb.touch",n.proxy(i,"ontouchend")).on(h?"touchmove.fb.touch":"mousemove.fb.touch",n.proxy(i,"ontouchmove")),n.fancybox.isMobile&&e.addEventListener("scroll",i.onscroll,!0),!i.opts&&!i.canPan||!c.is(i.$stage)&&!i.$stage.find(c).length)return void(c.is(".fancybox-image")&&o.preventDefault());i.isScrollable=l(c)||l(c.parent()),n.fancybox.isMobile&&i.isScrollable||o.preventDefault(),(1===i.startPoints.length||u.hasError)&&(i.canPan?(n.fancybox.stop(i.$content),i.$content.css("transition-duration",""),i.isPanning=!0):i.isSwiping=!0,i.$container.addClass("fancybox-is-grabbing")),2===i.startPoints.length&&"image"===u.type&&(u.isLoaded||u.$ghost)&&(i.canTap=!1,i.isSwiping=!1,i.isPanning=!1,i.isZooming=!0,n.fancybox.stop(i.$content),i.$content.css("transition-duration",""),i.centerPointStartX=.5*(i.startPoints[0].x+i.startPoints[1].x)-n(t).scrollLeft(),i.centerPointStartY=.5*(i.startPoints[0].y+i.startPoints[1].y)-n(t).scrollTop(),i.percentageOfImageAtPinchPointX=(i.centerPointStartX-i.contentStartPos.left)/i.contentStartPos.width,i.percentageOfImageAtPinchPointY=(i.centerPointStartY-i.contentStartPos.top)/i.contentStartPos.height,i.startDistanceBetweenFingers=s(i.startPoints[0],i.startPoints[1]))}}},d.prototype.onscroll=function(t){var n=this;n.isScrolling=!0,e.removeEventListener("scroll",n.onscroll,!0)},d.prototype.ontouchmove=function(t){var e=this;return void 0!==t.originalEvent.buttons&&0===t.originalEvent.buttons?void e.ontouchend(t):e.isScrolling?void(e.canTap=!1):(e.newPoints=a(t),void((e.opts||e.canPan)&&e.newPoints.length&&e.newPoints.length&&(e.isSwiping&&e.isSwiping===!0||t.preventDefault(),e.distanceX=s(e.newPoints[0],e.startPoints[0],"x"),e.distanceY=s(e.newPoints[0],e.startPoints[0],"y"),e.distance=s(e.newPoints[0],e.startPoints[0]),e.distance>0&&(e.isSwiping?e.onSwipe(t):e.isPanning?e.onPan():e.isZooming&&e.onZoom()))))},d.prototype.onSwipe=function(e){var a,s=this,r=s.isSwiping,c=s.sliderStartPos.left||0;if(r!==!0)"x"==r&&(s.distanceX>0&&(s.instance.group.length<2||0===s.instance.current.index&&!s.instance.current.opts.loop)?c+=Math.pow(s.distanceX,.8):s.distanceX<0&&(s.instance.group.length<2||s.instance.current.index===s.instance.group.length-1&&!s.instance.current.opts.loop)?c-=Math.pow(-s.distanceX,.8):c+=s.distanceX),s.sliderLastPos={top:"x"==r?0:s.sliderStartPos.top+s.distanceY,left:c},s.requestId&&(i(s.requestId),s.requestId=null),s.requestId=o(function(){s.sliderLastPos&&(n.each(s.instance.slides,function(t,e){var o=e.pos-s.instance.currPos;n.fancybox.setTranslate(e.$slide,{top:s.sliderLastPos.top,left:s.sliderLastPos.left+o*s.canvasWidth+o*e.opts.gutter})}),s.$container.addClass("fancybox-is-sliding"))});else if(Math.abs(s.distance)>10){if(s.canTap=!1,s.instance.group.length<2&&s.opts.vertical?s.isSwiping="y":s.instance.isDragging||s.opts.vertical===!1||"auto"===s.opts.vertical&&n(t).width()>800?s.isSwiping="x":(a=Math.abs(180*Math.atan2(s.distanceY,s.distanceX)/Math.PI),s.isSwiping=a>45&&a<135?"y":"x"),s.canTap=!1,"y"===s.isSwiping&&n.fancybox.isMobile&&s.isScrollable)return void(s.isScrolling=!0);s.instance.isDragging=s.isSwiping,s.startPoints=s.newPoints,n.each(s.instance.slides,function(t,e){n.fancybox.stop(e.$slide),e.$slide.css("transition-duration",""),e.inTransition=!1,e.pos===s.instance.current.pos&&(s.sliderStartPos.left=n.fancybox.getTranslate(e.$slide).left-n.fancybox.getTranslate(s.instance.$refs.stage).left)}),s.instance.SlideShow&&s.instance.SlideShow.isActive&&s.instance.SlideShow.stop()}},d.prototype.onPan=function(){var t=this;return s(t.newPoints[0],t.realPoints[0])<(n.fancybox.isMobile?10:5)?void(t.startPoints=t.newPoints):(t.canTap=!1,t.contentLastPos=t.limitMovement(),t.requestId&&(i(t.requestId),t.requestId=null),void(t.requestId=o(function(){n.fancybox.setTranslate(t.$content,t.contentLastPos)})))},d.prototype.limitMovement=function(){var t,e,n,o,i,a,s=this,r=s.canvasWidth,c=s.canvasHeight,l=s.distanceX,d=s.distanceY,u=s.contentStartPos,f=u.left,p=u.top,h=u.width,g=u.height;return i=h>r?f+l:f,a=p+d,t=Math.max(0,.5*r-.5*h),e=Math.max(0,.5*c-.5*g),n=Math.min(r-h,.5*r-.5*h),o=Math.min(c-g,.5*c-.5*g),l>0&&i>t&&(i=t-1+Math.pow(-t+f+l,.8)||0),l<0&&i<n&&(i=n+1-Math.pow(n-f-l,.8)||0),d>0&&a>e&&(a=e-1+Math.pow(-e+p+d,.8)||0),d<0&&a<o&&(a=o+1-Math.pow(o-p-d,.8)||0),{top:a,left:i}},d.prototype.limitPosition=function(t,e,n,o){var i=this,a=i.canvasWidth,s=i.canvasHeight;return n>a?(t=t>0?0:t,t=t<a-n?a-n:t):t=Math.max(0,a/2-n/2),o>s?(e=e>0?0:e,e=e<s-o?s-o:e):e=Math.max(0,s/2-o/2),{top:e,left:t}},d.prototype.onZoom=function(){var e=this,a=e.contentStartPos,r=a.width,c=a.height,l=a.left,d=a.top,u=s(e.newPoints[0],e.newPoints[1]),f=u/e.startDistanceBetweenFingers,p=Math.floor(r*f),h=Math.floor(c*f),g=(r-p)*e.percentageOfImageAtPinchPointX,b=(c-h)*e.percentageOfImageAtPinchPointY,m=(e.newPoints[0].x+e.newPoints[1].x)/2-n(t).scrollLeft(),v=(e.newPoints[0].y+e.newPoints[1].y)/2-n(t).scrollTop(),y=m-e.centerPointStartX,x=v-e.centerPointStartY,w=l+(g+y),$=d+(b+x),S={top:$,left:w,scaleX:f,scaleY:f};e.canTap=!1,e.newWidth=p,e.newHeight=h,e.contentLastPos=S,e.requestId&&(i(e.requestId),e.requestId=null),e.requestId=o(function(){n.fancybox.setTranslate(e.$content,e.contentLastPos)})},d.prototype.ontouchend=function(t){var o=this,s=Math.max((new Date).getTime()-o.startTime,1),r=o.isSwiping,c=o.isPanning,l=o.isZooming,d=o.isScrolling;return o.endPoints=a(t),o.$container.removeClass("fancybox-is-grabbing"),n(e).off(".fb.touch"),e.removeEventListener("scroll",o.onscroll,!0),o.requestId&&(i(o.requestId),o.requestId=null),o.isSwiping=!1,o.isPanning=!1,o.isZooming=!1,o.isScrolling=!1,o.instance.isDragging=!1,o.canTap?o.onTap(t):(o.speed=366,o.velocityX=o.distanceX/s*.5,o.velocityY=o.distanceY/s*.5,o.speedX=Math.max(.5*o.speed,Math.min(1.5*o.speed,1/Math.abs(o.velocityX)*o.speed)),void(c?o.endPanning():l?o.endZooming():o.endSwiping(r,d)))},d.prototype.endSwiping=function(t,e){var o=this,i=!1,a=o.instance.group.length;o.sliderLastPos=null,"y"==t&&!e&&Math.abs(o.distanceY)>50?(n.fancybox.animate(o.instance.current.$slide,{top:o.sliderStartPos.top+o.distanceY+150*o.velocityY,opacity:0},200),i=o.instance.close(!0,200)):"x"==t&&o.distanceX>50&&a>1?i=o.instance.previous(o.speedX):"x"==t&&o.distanceX<-50&&a>1&&(i=o.instance.next(o.speedX)),i!==!1||"x"!=t&&"y"!=t||(e||a<2?o.instance.centerSlide(o.instance.current,150):o.instance.jumpTo(o.instance.current.index)),o.$container.removeClass("fancybox-is-sliding")},d.prototype.endPanning=function(){var t,e,o,i=this;i.contentLastPos&&(i.opts.momentum===!1?(t=i.contentLastPos.left,e=i.contentLastPos.top):(t=i.contentLastPos.left+i.velocityX*i.speed,e=i.contentLastPos.top+i.velocityY*i.speed),o=i.limitPosition(t,e,i.contentStartPos.width,i.contentStartPos.height),o.width=i.contentStartPos.width,o.height=i.contentStartPos.height,n.fancybox.animate(i.$content,o,330))},d.prototype.endZooming=function(){var t,e,o,i,a=this,s=a.instance.current,r=a.newWidth,c=a.newHeight;a.contentLastPos&&(t=a.contentLastPos.left,e=a.contentLastPos.top,i={top:e,left:t,width:r,height:c,scaleX:1,scaleY:1},n.fancybox.setTranslate(a.$content,i),r<a.canvasWidth&&c<a.canvasHeight?a.instance.scaleToFit(150):r>s.width||c>s.height?a.instance.scaleToActual(a.centerPointStartX,a.centerPointStartY,150):(o=a.limitPosition(t,e,r,c),n.fancybox.setTranslate(a.$content,n.fancybox.getTranslate(a.$content)),n.fancybox.animate(a.$content,o,150)))},d.prototype.onTap=function(e){var o,i=this,s=n(e.target),r=i.instance,c=r.current,l=e&&a(e)||i.startPoints,d=l[0]?l[0].x-n(t).scrollLeft()-i.stagePos.left:0,u=l[0]?l[0].y-n(t).scrollTop()-i.stagePos.top:0,f=function(t){var o=c.opts[t];if(n.isFunction(o)&&(o=o.apply(r,[c,e])),o)switch(o){case"close":r.close(i.startEvent);break;case"toggleControls":r.toggleControls(!0);break;case"next":r.next();break;case"nextOrClose":r.group.length>1?r.next():r.close(i.startEvent);break;case"zoom":"image"==c.type&&(c.isLoaded||c.$ghost)&&(r.canPan()?r.scaleToFit():r.isScaledDown()?r.scaleToActual(d,u):r.group.length<2&&r.close(i.startEvent))}};if((!e.originalEvent||2!=e.originalEvent.button)&&(s.is("img")||!(d>s[0].clientWidth+s.offset().left))){if(s.is(".fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container"))o="Outside";else if(s.is(".fancybox-slide"))o="Slide";else{if(!r.current.$content||!r.current.$content.find(s).addBack().filter(s).length)return;o="Content"}if(i.tapped){if(clearTimeout(i.tapped),i.tapped=null,Math.abs(d-i.tapX)>50||Math.abs(u-i.tapY)>50)return this;f("dblclick"+o)}else i.tapX=d,i.tapY=u,c.opts["dblclick"+o]&&c.opts["dblclick"+o]!==c.opts["click"+o]?i.tapped=setTimeout(function(){i.tapped=null,f("click"+o)},500):f("click"+o);return this}},n(e).on("onActivate.fb",function(t,e){e&&!e.Guestures&&(e.Guestures=new d(e))})}(window,document,jQuery),function(t,e){"use strict";e.extend(!0,e.fancybox.defaults,{btnTpl:{slideShow:'<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.5 5.4v13.2l11-6.6z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.33 5.75h2.2v12.5h-2.2V5.75zm5.15 0h2.2v12.5h-2.2V5.75z"/></svg></button>'},slideShow:{autoStart:!1,speed:3e3}});var n=function(t){this.instance=t,this.init()};e.extend(n.prototype,{timer:null,isActive:!1,$button:null,init:function(){var t=this;t.$button=t.instance.$refs.toolbar.find("[data-fancybox-play]").on("click",function(){t.toggle()}),(t.instance.group.length<2||!t.instance.group[t.instance.currIndex].opts.slideShow)&&t.$button.hide()},set:function(t){var e=this,n=e.instance,o=n.current,i=function(){e.isActive&&n.jumpTo((n.currIndex+1)%n.group.length)};o&&(t===!0||o.opts.loop||n.currIndex<n.group.length-1)?e.timer=setTimeout(function(){var t;e.isActive&&(t=o.$slide.find("video,audio").filter(":visible:first"),t.length?t.one("ended",i):i())},o.opts.slideShow.speed):(e.stop(),n.idleSecondsCounter=0,n.showControls())},clear:function(){var t=this;clearTimeout(t.timer),t.timer=null},start:function(){var t=this,e=t.instance.current;e&&(t.$button.attr("title",e.opts.i18n[e.opts.lang].PLAY_STOP).removeClass("fancybox-button--play").addClass("fancybox-button--pause"),t.isActive=!0,e.isComplete&&t.set(!0),t.instance.trigger("onSlideShowChange",!0))},stop:function(){var t=this,e=t.instance.current;t.clear(),t.$button.attr("title",e.opts.i18n[e.opts.lang].PLAY_START).removeClass("fancybox-button--pause").addClass("fancybox-button--play"),t.isActive=!1,t.instance.trigger("onSlideShowChange",!1)},toggle:function(){var t=this;t.isActive?t.stop():t.start()}}),e(t).on({"onInit.fb":function(t,e){e&&!e.SlideShow&&(e.SlideShow=new n(e))},"beforeShow.fb":function(t,e,n,o){var i=e&&e.SlideShow;o?i&&n.opts.slideShow.autoStart&&i.start():i&&i.isActive&&i.clear()},"afterShow.fb":function(t,e,n){var o=e&&e.SlideShow;o&&o.isActive&&o.set()},"afterKeydown.fb":function(n,o,i,a,s){var r=o&&o.SlideShow;!r||!i.opts.slideShow||80!==s&&32!==s||e(t.activeElement).is("button,a,input")||(a.preventDefault(),r.toggle())},"beforeClose.fb onDeactivate.fb":function(t,e){var n=e&&e.SlideShow;n&&n.stop()}}),e(t).on("visibilitychange",function(){var n=e.fancybox.getInstance(),o=n&&n.SlideShow;o&&o.isActive&&(t.hidden?o.clear():o.set())})}(document,jQuery),function(t,e){"use strict";var n=function(){for(var e=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]],n={},o=0;o<e.length;o++){var i=e[o];if(i&&i[1]in t){for(var a=0;a<i.length;a++)n[e[0][a]]=i[a];return n}}return!1}();if(n){var o={request:function(e){e=e||t.documentElement,e[n.requestFullscreen](e.ALLOW_KEYBOARD_INPUT)},exit:function(){t[n.exitFullscreen]()},toggle:function(e){e=e||t.documentElement,this.isFullscreen()?this.exit():this.request(e)},isFullscreen:function(){return Boolean(t[n.fullscreenElement])},enabled:function(){return Boolean(t[n.fullscreenEnabled])}};e.extend(!0,e.fancybox.defaults,{btnTpl:{fullScreen:'<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fsenter" title="{{FULL_SCREEN}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z"/></svg></button>'},fullScreen:{autoStart:!1}}),e(t).on(n.fullscreenchange,function(){var t=o.isFullscreen(),n=e.fancybox.getInstance();n&&(n.current&&"image"===n.current.type&&n.isAnimating&&(n.current.$content.css("transition","none"),n.isAnimating=!1,n.update(!0,!0,0)),n.trigger("onFullscreenChange",t),n.$refs.container.toggleClass("fancybox-is-fullscreen",t),n.$refs.toolbar.find("[data-fancybox-fullscreen]").toggleClass("fancybox-button--fsenter",!t).toggleClass("fancybox-button--fsexit",t))})}e(t).on({"onInit.fb":function(t,e){var i;return n?void(e&&e.group[e.currIndex].opts.fullScreen?(i=e.$refs.container,i.on("click.fb-fullscreen","[data-fancybox-fullscreen]",function(t){t.stopPropagation(),t.preventDefault(),o.toggle()}),e.opts.fullScreen&&e.opts.fullScreen.autoStart===!0&&o.request(),e.FullScreen=o):e&&e.$refs.toolbar.find("[data-fancybox-fullscreen]").hide()):void e.$refs.toolbar.find("[data-fancybox-fullscreen]").remove()},"afterKeydown.fb":function(t,e,n,o,i){e&&e.FullScreen&&70===i&&(o.preventDefault(),e.FullScreen.toggle())},"beforeClose.fb":function(t,e){e&&e.FullScreen&&e.$refs.container.hasClass("fancybox-is-fullscreen")&&o.exit()}})}(document,jQuery),function(t,e){"use strict";var n="fancybox-thumbs",o=n+"-active";e.fancybox.defaults=e.extend(!0,{btnTpl:{thumbs:'<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.59 14.59h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76H5.65V5.65z"/></svg></button>'},thumbs:{autoStart:!1,hideOnClose:!0,parentEl:".fancybox-container",axis:"y"}},e.fancybox.defaults);var i=function(t){this.init(t)};e.extend(i.prototype,{$button:null,$grid:null,$list:null,isVisible:!1,isActive:!1,init:function(t){var e,n,o=this;o.instance=t,t.Thumbs=o,o.opts=t.group[t.currIndex].opts.thumbs,e=t.group[0],e=e.opts.thumb||!(!e.opts.$thumb||!e.opts.$thumb.length)&&e.opts.$thumb.attr("src"),t.group.length>1&&(n=t.group[1],n=n.opts.thumb||!(!n.opts.$thumb||!n.opts.$thumb.length)&&n.opts.$thumb.attr("src")),o.$button=t.$refs.toolbar.find("[data-fancybox-thumbs]"),o.opts&&e&&n?(o.$button.show().on("click",function(){o.toggle()}),o.isActive=!0):o.$button.hide()},create:function(){var t,o=this,i=o.instance,a=o.opts.parentEl,s=[];o.$grid||(o.$grid=e('<div class="'+n+" "+n+"-"+o.opts.axis+'"></div>').appendTo(i.$refs.container.find(a).addBack().filter(a)),o.$grid.on("click","a",function(){i.jumpTo(e(this).attr("data-index"))})),o.$list||(o.$list=e('<div class="'+n+'__list">').appendTo(o.$grid)),e.each(i.group,function(e,n){t=n.opts.thumb||(n.opts.$thumb?n.opts.$thumb.attr("src"):null),t||"image"!==n.type||(t=n.src),s.push('<a href="javascript:;" tabindex="0" data-index="'+e+'" '+(t&&t.length?' style="background-image:url('+t+')" />':"")+"></a>")}),o.$list[0].innerHTML=s.join(""),"x"===o.opts.axis&&o.$list.width(parseInt(o.$grid.css("padding-right"),10)+i.group.length*o.$list.children().eq(0).outerWidth(!0))},focus:function(t){var e,n,i=this,a=i.$list,s=i.$grid;i.instance.current&&(e=a.children().removeClass(o).filter('[data-index="'+i.instance.current.index+'"]').addClass(o),n=e.position(),"y"===i.opts.axis&&(n.top<0||n.top>a.height()-e.outerHeight())?a.stop().animate({scrollTop:a.scrollTop()+n.top},t):"x"===i.opts.axis&&(n.left<s.scrollLeft()||n.left>s.scrollLeft()+(s.width()-e.outerWidth()))&&a.parent().stop().animate({scrollLeft:n.left},t))},update:function(){var t=this;t.instance.$refs.container.toggleClass("fancybox-show-thumbs",this.isVisible),t.isVisible?(t.$grid||t.create(),t.instance.trigger("onThumbsShow"),t.focus(0)):t.$grid&&t.instance.trigger("onThumbsHide"),t.instance.update()},hide:function(){this.isVisible=!1,this.update()},show:function(){this.isVisible=!0,this.update()},toggle:function(){this.isVisible=!this.isVisible,this.update()}}),e(t).on({"onInit.fb":function(t,e){var n;e&&!e.Thumbs&&(n=new i(e),n.isActive&&n.opts.autoStart===!0&&n.show())},"beforeShow.fb":function(t,e,n,o){var i=e&&e.Thumbs;i&&i.isVisible&&i.focus(o?0:250)},"afterKeydown.fb":function(t,e,n,o,i){var a=e&&e.Thumbs;a&&a.isActive&&71===i&&(o.preventDefault(),a.toggle())},"beforeClose.fb":function(t,e){var n=e&&e.Thumbs;n&&n.isVisible&&n.opts.hideOnClose!==!1&&n.$grid.hide()}})}(document,jQuery),function(t,e){"use strict";function n(t){var e={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};return String(t).replace(/[&<>"'`=\/]/g,function(t){return e[t]})}e.extend(!0,e.fancybox.defaults,{btnTpl:{share:'<button data-fancybox-share class="fancybox-button fancybox-button--share" title="{{SHARE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.55 19c1.4-8.4 9.1-9.8 11.9-9.8V5l7 7-7 6.3v-3.5c-2.8 0-10.5 2.1-11.9 4.2z"/></svg></button>'},share:{url:function(t,e){return!t.currentHash&&"inline"!==e.type&&"html"!==e.type&&(e.origSrc||e.src)||window.location},tpl:'<div class="fancybox-share"><h1>{{SHARE}}</h1><p><a class="fancybox-share__button fancybox-share__button--fb" href="https://www.facebook.com/sharer/sharer.php?u={{url}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m287 456v-299c0-21 6-35 35-35h38v-63c-7-1-29-3-55-3-54 0-91 33-91 94v306m143-254h-205v72h196" /></svg><span>Facebook</span></a><a class="fancybox-share__button fancybox-share__button--tw" href="https://twitter.com/intent/tweet?url={{url}}&text={{descr}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m456 133c-14 7-31 11-47 13 17-10 30-27 37-46-15 10-34 16-52 20-61-62-157-7-141 75-68-3-129-35-169-85-22 37-11 86 26 109-13 0-26-4-37-9 0 39 28 72 65 80-12 3-25 4-37 2 10 33 41 57 77 57-42 30-77 38-122 34 170 111 378-32 359-208 16-11 30-25 41-42z" /></svg><span>Twitter</span></a><a class="fancybox-share__button fancybox-share__button--pt" href="https://www.pinterest.com/pin/create/button/?url={{url}}&description={{descr}}&media={{media}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m265 56c-109 0-164 78-164 144 0 39 15 74 47 87 5 2 10 0 12-5l4-19c2-6 1-8-3-13-9-11-15-25-15-45 0-58 43-110 113-110 62 0 96 38 96 88 0 67-30 122-73 122-24 0-42-19-36-44 6-29 20-60 20-81 0-19-10-35-31-35-25 0-44 26-44 60 0 21 7 36 7 36l-30 125c-8 37-1 83 0 87 0 3 4 4 5 2 2-3 32-39 42-75l16-64c8 16 31 29 56 29 74 0 124-67 124-157 0-69-58-132-146-132z" fill="#fff"/></svg><span>Pinterest</span></a></p><p><input class="fancybox-share__input" type="text" value="{{url_raw}}" onclick="select()" /></p></div>'}}),e(t).on("click","[data-fancybox-share]",function(){var t,o,i=e.fancybox.getInstance(),a=i.current||null;a&&("function"===e.type(a.opts.share.url)&&(t=a.opts.share.url.apply(a,[i,a])),o=a.opts.share.tpl.replace(/\{\{media\}\}/g,"image"===a.type?encodeURIComponent(a.src):"").replace(/\{\{url\}\}/g,encodeURIComponent(t)).replace(/\{\{url_raw\}\}/g,n(t)).replace(/\{\{descr\}\}/g,i.$caption?encodeURIComponent(i.$caption.text()):""),e.fancybox.open({src:i.translate(i,o),type:"html",opts:{touch:!1,animationEffect:!1,afterLoad:function(t,e){i.$refs.container.one("beforeClose.fb",function(){t.close(null,0)}),e.$content.find(".fancybox-share__button").click(function(){return window.open(this.href,"Share","width=550, height=450"),!1})},mobile:{autoFocus:!1}}}))})}(document,jQuery),function(t,e,n){"use strict";function o(){var e=t.location.hash.substr(1),n=e.split("-"),o=n.length>1&&/^\+?\d+$/.test(n[n.length-1])?parseInt(n.pop(-1),10)||1:1,i=n.join("-");return{hash:e,index:o<1?1:o,gallery:i}}function i(t){""!==t.gallery&&n("[data-fancybox='"+n.escapeSelector(t.gallery)+"']").eq(t.index-1).focus().trigger("click.fb-start")}function a(t){var e,n;return!!t&&(e=t.current?t.current.opts:t.opts,n=e.hash||(e.$orig?e.$orig.data("fancybox")||e.$orig.data("fancybox-trigger"):""),""!==n&&n)}n.escapeSelector||(n.escapeSelector=function(t){var e=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,n=function(t,e){return e?"\0"===t?"�":t.slice(0,-1)+"\\"+t.charCodeAt(t.length-1).toString(16)+" ":"\\"+t};return(t+"").replace(e,n)}),n(function(){n.fancybox.defaults.hash!==!1&&(n(e).on({"onInit.fb":function(t,e){var n,i;e.group[e.currIndex].opts.hash!==!1&&(n=o(),i=a(e),i&&n.gallery&&i==n.gallery&&(e.currIndex=n.index-1))},"beforeShow.fb":function(n,o,i,s){var r;i&&i.opts.hash!==!1&&(r=a(o),r&&(o.currentHash=r+(o.group.length>1?"-"+(i.index+1):""),t.location.hash!=="#"+o.currentHash&&(s&&!o.origHash&&(o.origHash=t.location.hash),o.hashTimer&&clearTimeout(o.hashTimer),o.hashTimer=setTimeout(function(){"replaceState"in t.history?(t.history[s?"pushState":"replaceState"]({},e.title,t.location.pathname+t.location.search+"#"+o.currentHash),s&&(o.hasCreatedHistory=!0)):t.location.hash=o.currentHash,o.hashTimer=null},300))))},"beforeClose.fb":function(n,o,i){i.opts.hash!==!1&&(clearTimeout(o.hashTimer),o.currentHash&&o.hasCreatedHistory?t.history.back():o.currentHash&&("replaceState"in t.history?t.history.replaceState({},e.title,t.location.pathname+t.location.search+(o.origHash||"")):t.location.hash=o.origHash),o.currentHash=null)}}),n(t).on("hashchange.fb",function(){var t=o(),e=null;n.each(n(".fancybox-container").get().reverse(),function(t,o){var i=n(o).data("FancyBox");if(i&&i.currentHash)return e=i,!1}),e?e.currentHash===t.gallery+"-"+t.index||1===t.index&&e.currentHash==t.gallery||(e.currentHash=null,e.close()):""!==t.gallery&&i(t)}),setTimeout(function(){n.fancybox.getInstance()||i(o())},50))})}(window,document,jQuery),function(t,e){"use strict";var n=(new Date).getTime();e(t).on({"onInit.fb":function(t,e,o){e.$refs.stage.on("mousewheel DOMMouseScroll wheel MozMousePixelScroll",function(t){var o=e.current,i=(new Date).getTime();e.group.length<2||o.opts.wheel===!1||"auto"===o.opts.wheel&&"image"!==o.type||(t.preventDefault(),t.stopPropagation(),o.$slide.hasClass("fancybox-animated")||(t=t.originalEvent||t,i-n<250||(n=i,e[(-t.deltaY||-t.deltaX||t.wheelDelta||-t.detail)<0?"next":"previous"]())))})}})}(document,jQuery);
