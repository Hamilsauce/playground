o[ i[0] ] [ i[1] ] [ i[2] ]


var __ez = __ez || {};
__ez.stms = Date.now();
__ez.evt = {};
__ez.script = {};
__ez.ck = __ez.ck || {};
__ez.template = {};
__ez.template.isOrig = false;
__ez.queue = function() {
  var e = 0,
    i = 0,
    t = [],
    n = !1,
    o = [],
    s = [],
    r = !0,
    a = function(e, i, n, o, s, r, a) {
      var l = arguments.length > 7 && void 0 !== arguments[7] ?
        arguments[7] :
        window,
        c = this;
      this.name = e,
        this.funcName = i,
        this.parameters = null === n ? null : p(n) ? n : [n],
        this.isBlock = o,
        this.blockedBy = s,
        this.deleteWhenComplete = r,
        this.isError = !1,
        this.isComplete = !1,
        this.isInitialized = !1,
        this.proceedIfError = a,
        this.fWindow = l,
        this.isTimeDelay = !1,
        this.process = function() {
          f("... func = " + e), c.isInitialized = !0, c.isComplete = !0, f("... func.apply: " + e);
          var i = c.funcName.split("."),
            n = null,
            o = this.fWindow || window;
          i.length > 3 || (n = 3 === i.length ?
              o[i[0]][i[1]][i[2]] : 2 === i.length ?
              o[i[0]][i[1]] : o[c.funcName]),
            null != n && n.apply(null, this.parameters),
            !0 === c.deleteWhenComplete && delete t[e],
            !0 === c.isBlock && (f("----- F'D: " + c.name), u())
        }
    },
    l = function(e, i, t, n, o, s, r) {
      var a = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : window,
        l = this;
      this.name = e, this.path = i, this.async = o, this.defer = s, this.isBlock = t, this.blockedBy = n, this.isInitialized = !1, this.isError = !1, this.isComplete = !1, this.proceedIfError = r, this.fWindow = a, this.isTimeDelay = !1, this.isPath = function(e) { return "/" === e[0] && "/" !== e[1] }, this.getSrc = function(e) { return void 0 !== window.__ezScriptHost && this.isPath(e) ? window.__ezScriptHost + e : e }, this.process = function() {
        l.isInitialized = !0, f("... file = " + e);
        var i = this.fWindow ? this.fWindow.document : document,
          t = i.createElement("script");
        t.src = this.getSrc(this.path), !0 === o ? t.async = !0 : !0 === s && (t.defer = !0), t.onerror = function() { f("----- ERR'D: " + l.name), l.isError = !0, !0 === l.isBlock && u() }, t.onreadystatechange = t.onload = function() {
          var e = t.readyState;
          f("----- F'D: " + l.name), e && !/loaded|complete/.test(e) || (l.isComplete = !0, !0 === l.isBlock && u())
        }, i.getElementsByTagName("head")[0].appendChild(t)
      }
    },
    c = function(e, i) { this.name = e, this.path = "", this.async = !1, this.defer = !1, this.isBlock = !1, this.blockedBy = [], this.isInitialized = !0, this.isError = !1, this.isComplete = i, this.proceedIfError = !1, this.isTimeDelay = !1, this.process = function() {} };

  function d(e) {!0 !== h(e) && 0 != r && e.process() }

  function h(e) {
    if (!0 === e.isTimeDelay && !1 === n) return f(e.name + " blocked = TIME DELAY!"), !0;
    if (p(e.blockedBy))
      for (var i = 0; i < e.blockedBy.length; i++) { var o = e.blockedBy[i]; if (!1 === t.hasOwnProperty(o)) return f(e.name + " blocked = " + o), !0; if (!0 === e.proceedIfError && !0 === t[o].isError) return !1; if (!1 === t[o].isComplete) return f(e.name + " blocked = " + o), !0 }
    return !1
  }

  function f(e) {
    var i = window.location.href,
      t = new RegExp("[?&]ezq=([^&#]*)", "i").exec(i);
    "1" === (t ? t[1] : null) && console.debug(e)
  }

  function u() {++e > 200 || (f("let's go"), m(o), m(s)) }

  function m(e) {
    for (var i in e)
      if (!1 !== e.hasOwnProperty(i)) { var t = e[i];!0 === t.isComplete || h(t) || !0 === t.isInitialized || !0 === t.isError ? !0 === t.isError ? f(t.name + ": error") : !0 === t.isComplete ? f(t.name + ": complete already") : !0 === t.isInitialized && f(t.name + ": initialized already") : t.process() }
  }

  function p(e) { return "[object Array]" == Object.prototype.toString.call(e) }
  return window.addEventListener("load", (function() { setTimeout((function() { n = !0, f("TDELAY -----"), u() }), 5e3) }), !1), {
    addFile: function(e, i, n, r, a, c, h, f, u) { var m = new l(e, i, n, r, a, c, h, u);!0 === f ? o[e] = m : s[e] = m, t[e] = m, d(m) },
    addDelayFile: function(e, i) {
      var n = new l(e, i, !1, [], !1, !1, !0);
      n.isTimeDelay = !0, f(e + " ...  FILE! TDELAY"), s[e] = n, t[e] = n, d(n)
    },
    addFunc: function(e, n, r, l, c, h, f, u, m, p) {!0 === h && (e = e + "_" + i++); var y = new a(e, n, r, l, c, f, u, p);!0 === m ? o[e] = y : s[e] = y, t[e] = y, d(y) },
    addDelayFunc: function(e, i, n) {
      var o = new a(e, i, n, !1, [], !0, !0);
      o.isTimeDelay = !0, f(e + " ...  FUNCTION! TDELAY"), s[e] = o, t[e] = o, d(o)
    },
    items: t,
    processAll: u,
    setallowLoad: function(e) { r = e },
    markLoaded: function(e) {
      if (e && 0 !== e.length) {
        if (e in t) { var i = t[e];!0 === i.isComplete ? f(i.name + " " + e + ": error loaded duplicate") : (i.isComplete = !0, i.isInitialized = !0) } else t[e] = new c(e, !0);
        f("markLoaded dummyfile: " + t[e].name)
      }
    },
    logWhatsBlocked: function() { for (var e in t) !1 !== t.hasOwnProperty(e) && h(t[e]) }
  }
}();
__ez.evt.add = function(e, t, n) { e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent ? e.attachEvent("on" + t, n) : e["on" + t] = n() }, __ez.evt.remove = function(e, t, n) { e.removeEventListener ? e.removeEventListener(t, n, !1) : e.detachEvent ? e.detachEvent("on" + t, n) : delete e["on" + t] };
__ez.script.add = function(e) {
  var t = document.createElement("script");
  t.src = e, t.async = !0, t.type = "text/javascript", document.getElementsByTagName("head")[0].appendChild(t)
};
__ez.dot = {};