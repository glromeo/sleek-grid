/*
MIT License

Copyright (c) 2018 Simon Y. Blackwell

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

"use strict";

var assign = Object.assign;
if (typeof (assign) !== "function") {
    assign = function () {
        var a = arguments,
            o = arguments[0];
        if (o === null || o === undefined) {
            throw new TypeError("Cannot convert undefined or null to object");
        }
        o = Object(o);
        for (var i = 1; i < a.length; i++) {
            if (a[i] && typeof (a[i]) === "object") {
                for (var k in a[i]) {
                    o[k] = a[i][k];
                }
            }
        }
        return o;
    };
}

function vrgs(f) {
    var s = f + "",
        i = s.indexOf("...");
    return i >= 0 && (i < s.indexOf(")") || s.indexOf("arguments") >= 0);
}

/**
 *
 * @param fn
 * @param o
 * @return {function}
 */
function nanomemoize(fn, o) {
    /*o = {
        serializer, // used to serialize arguments of single argument functions, multis are not serialized
        equals, // equality tester, will force use of slower multiarg approach even for single arg functions
        maxAge, // max cache age is ms, set > 0 && < Infinity if you want automatic clearing
        maxArgs, // max args to use for signature
        vargs = vrgs(fn) // set to true if function may have variable or beyond-signature arguments, default is best attempt at infering
      } = {}
    */
    o || (o = {});
    var vargs = o.vargs || vrgs(fn),
        s = Object.create(null), // single arg function key/value cache
        k = [], // multiple arg function arg key cache
        v = [], // multiple arg function result cache
        wm = new WeakMap(),
        d = function (key, c, k) {
            return setTimeout(function () {
                if (k) { // dealing with multi-arg function, c and k are Arrays
                    c.splice(key, 1);
                    k.splice(key, 1);
                    return;
                } // dealing with single arg function, c is a WekMap or Object
                c instanceof WeakMap ? c.delete(key) : delete c[key];
            }, o.maxAge);
        },
        c = o.maxAge > 0 && o.maxAge < Infinity ? d : 0, // cache change timeout,
        eq = o.equals ? o.equals : function (a, b) {
            return a === b;
        },
        maxargs = o.maxArgs,
        srlz = o.serializer,
        f, // memoized function to return
        u; // flag indicating a unary arg function is in use for clear operation
    if (fn.length === 1 && !o.equals && !vargs) {
        // for single argument functions, just use a JS object key look-up
        f = (function (a) {
            // strings must be serialized because cache[1] should not equal or overwrite cache["1"] for value = 1 and value = "1"
            var t = typeof a;
            // set chng timeout only when new value computed, hits will not push out the tte, but it is arguable they should not
            if (!srlz && ((t === "object" && a) || t === "function")) {
                var r;
                return wm.get(a) || ((!c || c(a, wm)), wm.set(a, r = fn.call(this, a)), r);
            }
            var key = t === "number" || t === "boolean" || a == null ? a : t === "string" ? JSON.stringify(a) : srlz(a);
            return s[key] || ((!c || c(key, s)), s[key] = fn.call(this, a));
        }).bind(this);
        u = 1;
    } else {
        // for multiple arg functions, loop through a cache of all the args
        // looking at each arg separately so a test can abort as soon as possible
        f = (function () {
            var l = maxargs || arguments.length,
                i;
            for (i = k.length - 1; i >= 0; i--) { // an array of arrays of args, each array represents a call signature
                if (!maxargs && k[i].length !== l) continue; // cache miss if called with a different number of args
                for (var j = l - 1; j >= 0 && eq(k[i][j], arguments[j]); j--) {	// compare each arg
                    if (j === 0) {
                        return v[i];
                    } // the args matched
                }
            }
            i = k.length - (i + 1);
            // set change timeout only when new value computed, hits will not push out the tte, but it is arguable they should not
            return (!c || c(i, v, k)), v[i] = fn.apply(this, k[i] = arguments);
        }).bind(this);
    }
    // reset all the caches
    f.clear = function () {
        wm = new WeakMap();
        s = Object.create(null);
        k = [];
        v = [];
    };
    f.keys = function () {
        return u ? null : k.slice();
    };
    f.values = function () {
        return u ? null : v.slice();
    };
    f.keyValues = function () {
        return u ? {primitives: assign({}, s), objects: wm} : null;
    };
    return f;
}

export const memoize = nanomemoize;
