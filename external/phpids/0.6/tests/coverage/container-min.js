/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.5.2
*/
(function () {
  YAHOO.util.Config = function (D) {
    if (D) {
      this.init(D)
    }
  }
  const B = YAHOO.lang
  const C = YAHOO.util.CustomEvent
  const A = YAHOO.util.Config
  A.CONFIG_CHANGED_EVENT = 'configChanged'
  A.BOOLEAN_TYPE = 'boolean'
  A.prototype = {
    owner: null,
    queueInProgress: false,
    config: null,
    initialConfig: null,
    eventQueue: null,
    configChangedEvent: null,
    init: function (D) {
      this.owner = D
      this.configChangedEvent = this.createEvent(A.CONFIG_CHANGED_EVENT)
      this.configChangedEvent.signature = C.LIST
      this.queueInProgress = false
      this.config = {}
      this.initialConfig = {}
      this.eventQueue = []
    },
    checkBoolean: function (D) {
      return typeof D === A.BOOLEAN_TYPE
    },
    checkNumber: function (D) {
      return !isNaN(D)
    },
    fireEvent: function (D, F) {
      const E = this.config[D]
      if (E && E.event) {
        E.event.fire(F)
      }
    },
    addProperty: function (E, D) {
      E = E.toLowerCase()
      this.config[E] = D
      D.event = this.createEvent(E, { scope: this.owner })
      D.event.signature = C.LIST
      D.key = E
      if (D.handler) {
        D.event.subscribe(D.handler, this.owner)
      }
      this.setProperty(E, D.value, true)
      if (!D.suppressEvent) {
        this.queueProperty(E, D.value)
      }
    },
    getConfig: function () {
      const D = {}
      let F
      let E
      for (F in this.config) {
        E = this.config[F]
        if (E && E.event) {
          D[F] = E.value
        }
      }
      return D
    },
    getProperty: function (D) {
      const E = this.config[D.toLowerCase()]
      if (E && E.event) {
        return E.value
      } else {
        return undefined
      }
    },
    resetProperty: function (D) {
      D = D.toLowerCase()
      const E = this.config[D]
      if (E && E.event) {
        if (this.initialConfig[D] && !B.isUndefined(this.initialConfig[D])) {
          this.setProperty(D, this.initialConfig[D])
          return true
        }
      } else {
        return false
      }
    },
    setProperty: function (E, G, D) {
      let F
      E = E.toLowerCase()
      if (this.queueInProgress && !D) {
        this.queueProperty(E, G)
        return true
      } else {
        F = this.config[E]
        if (F && F.event) {
          if (F.validator && !F.validator(G)) {
            return false
          } else {
            F.value = G
            if (!D) {
              this.fireEvent(E, G)
              this.configChangedEvent.fire([E, G])
            }
            return true
          }
        } else {
          return false
        }
      }
    },
    queueProperty: function (S, P) {
      S = S.toLowerCase()
      const R = this.config[S]
      let K = false
      let J
      let G
      let H
      let I
      let O
      let Q
      let F
      let M
      let N
      let D
      let L
      let T
      let E
      if (R && R.event) {
        if (!B.isUndefined(P) && R.validator && !R.validator(P)) {
          return false
        } else {
          if (!B.isUndefined(P)) {
            R.value = P
          } else {
            P = R.value
          }
          K = false
          J = this.eventQueue.length
          for (L = 0; L < J; L++) {
            G = this.eventQueue[L]
            if (G) {
              H = G[0]
              I = G[1]
              if (H == S) {
                this.eventQueue[L] = null
                this.eventQueue.push([S, !B.isUndefined(P) ? P : I])
                K = true
                break
              }
            }
          }
          if (!K && !B.isUndefined(P)) {
            this.eventQueue.push([S, P])
          }
        }
        if (R.supercedes) {
          O = R.supercedes.length
          for (T = 0; T < O; T++) {
            Q = R.supercedes[T]
            F = this.eventQueue.length
            for (E = 0; E < F; E++) {
              M = this.eventQueue[E]
              if (M) {
                N = M[0]
                D = M[1]
                if (N == Q.toLowerCase()) {
                  this.eventQueue.push([N, D])
                  this.eventQueue[E] = null
                  break
                }
              }
            }
          }
        }
        return true
      } else {
        return false
      }
    },
    refireEvent: function (D) {
      D = D.toLowerCase()
      const E = this.config[D]
      if (E && E.event && !B.isUndefined(E.value)) {
        if (this.queueInProgress) {
          this.queueProperty(D)
        } else {
          this.fireEvent(D, E.value)
        }
      }
    },
    applyConfig: function (D, G) {
      let F, E
      if (G) {
        E = {}
        for (F in D) {
          if (B.hasOwnProperty(D, F)) {
            E[F.toLowerCase()] = D[F]
          }
        }
        this.initialConfig = E
      }
      for (F in D) {
        if (B.hasOwnProperty(D, F)) {
          this.queueProperty(F, D[F])
        }
      }
    },
    refresh: function () {
      let D
      for (D in this.config) {
        this.refireEvent(D)
      }
    },
    fireQueue: function () {
      let E, H, D, G, F
      this.queueInProgress = true
      for (E = 0; E < this.eventQueue.length; E++) {
        H = this.eventQueue[E]
        if (H) {
          D = H[0]
          G = H[1]
          F = this.config[D]
          F.value = G
          this.fireEvent(D, G)
        }
      }
      this.queueInProgress = false
      this.eventQueue = []
    },
    subscribeToConfigEvent: function (E, F, H, D) {
      const G = this.config[E.toLowerCase()]
      if (G && G.event) {
        if (!A.alreadySubscribed(G.event, F, H)) {
          G.event.subscribe(F, H, D)
        }
        return true
      } else {
        return false
      }
    },
    unsubscribeFromConfigEvent: function (D, E, G) {
      const F = this.config[D.toLowerCase()]
      if (F && F.event) {
        return F.event.unsubscribe(E, G)
      } else {
        return false
      }
    },
    toString: function () {
      let D = 'Config'
      if (this.owner) {
        D += ' [' + this.owner.toString() + ']'
      }
      return D
    },
    outputEventQueue: function () {
      let D = ''
      let G
      let E
      const F = this.eventQueue.length
      for (E = 0; E < F; E++) {
        G = this.eventQueue[E]
        if (G) {
          D += G[0] + '=' + G[1] + ', '
        }
      }
      return D
    },
    destroy: function () {
      const E = this.config
      let D
      let F
      for (D in E) {
        if (B.hasOwnProperty(E, D)) {
          F = E[D]
          F.event.unsubscribeAll()
          F.event = null
        }
      }
      this.configChangedEvent.unsubscribeAll()
      this.configChangedEvent = null
      this.owner = null
      this.config = null
      this.initialConfig = null
      this.eventQueue = null
    }
  }
  A.alreadySubscribed = function (E, H, I) {
    const F = E.subscribers.length
    let D
    let G
    if (F > 0) {
      G = F - 1
      do {
        D = E.subscribers[G]
        if (D && D.obj == I && D.fn == H) {
          return true
        }
      } while (G--)
    }
    return false
  }
  YAHOO.lang.augmentProto(A, YAHOO.util.EventProvider)
})();
(function () {
  YAHOO.widget.Module = function (Q, P) {
    if (Q) {
      this.init(Q, P)
    } else {
    }
  }
  const F = YAHOO.util.Dom
  const D = YAHOO.util.Config
  const M = YAHOO.util.Event
  const L = YAHOO.util.CustomEvent
  const G = YAHOO.widget.Module
  let H
  let O
  let N
  let E
  const A = {
    BEFORE_INIT: 'beforeInit',
    INIT: 'init',
    APPEND: 'append',
    BEFORE_RENDER: 'beforeRender',
    RENDER: 'render',
    CHANGE_HEADER: 'changeHeader',
    CHANGE_BODY: 'changeBody',
    CHANGE_FOOTER: 'changeFooter',
    CHANGE_CONTENT: 'changeContent',
    DESTORY: 'destroy',
    BEFORE_SHOW: 'beforeShow',
    SHOW: 'show',
    BEFORE_HIDE: 'beforeHide',
    HIDE: 'hide'
  }
  const I = {
    VISIBLE: { key: 'visible', value: true, validator: YAHOO.lang.isBoolean },
    EFFECT: { key: 'effect', suppressEvent: true, supercedes: ['visible'] },
    MONITOR_RESIZE: { key: 'monitorresize', value: true },
    APPEND_TO_DOCUMENT_BODY: { key: 'appendtodocumentbody', value: false }
  }
  G.IMG_ROOT = null
  G.IMG_ROOT_SSL = null
  G.CSS_MODULE = 'yui-module'
  G.CSS_HEADER = 'hd'
  G.CSS_BODY = 'bd'
  G.CSS_FOOTER = 'ft'
  G.RESIZE_MONITOR_SECURE_URL = 'javascript:false;'
  G.textResizeEvent = new L('textResize')
  function K () {
    if (!H) {
      H = document.createElement('div')
      H.innerHTML =
        '<div class="' +
        G.CSS_HEADER +
        '"></div>' +
        '<div class="' +
        G.CSS_BODY +
        '"></div><div class="' +
        G.CSS_FOOTER +
        '"></div>'
      O = H.firstChild
      N = O.nextSibling
      E = N.nextSibling
    }
    return H
  }
  function J () {
    if (!O) {
      K()
    }
    return O.cloneNode(false)
  }
  function B () {
    if (!N) {
      K()
    }
    return N.cloneNode(false)
  }
  function C () {
    if (!E) {
      K()
    }
    return E.cloneNode(false)
  }
  G.prototype = {
    constructor: G,
    element: null,
    header: null,
    body: null,
    footer: null,
    id: null,
    imageRoot: G.IMG_ROOT,
    initEvents: function () {
      const P = L.LIST
      this.beforeInitEvent = this.createEvent(A.BEFORE_INIT)
      this.beforeInitEvent.signature = P
      this.initEvent = this.createEvent(A.INIT)
      this.initEvent.signature = P
      this.appendEvent = this.createEvent(A.APPEND)
      this.appendEvent.signature = P
      this.beforeRenderEvent = this.createEvent(A.BEFORE_RENDER)
      this.beforeRenderEvent.signature = P
      this.renderEvent = this.createEvent(A.RENDER)
      this.renderEvent.signature = P
      this.changeHeaderEvent = this.createEvent(A.CHANGE_HEADER)
      this.changeHeaderEvent.signature = P
      this.changeBodyEvent = this.createEvent(A.CHANGE_BODY)
      this.changeBodyEvent.signature = P
      this.changeFooterEvent = this.createEvent(A.CHANGE_FOOTER)
      this.changeFooterEvent.signature = P
      this.changeContentEvent = this.createEvent(A.CHANGE_CONTENT)
      this.changeContentEvent.signature = P
      this.destroyEvent = this.createEvent(A.DESTORY)
      this.destroyEvent.signature = P
      this.beforeShowEvent = this.createEvent(A.BEFORE_SHOW)
      this.beforeShowEvent.signature = P
      this.showEvent = this.createEvent(A.SHOW)
      this.showEvent.signature = P
      this.beforeHideEvent = this.createEvent(A.BEFORE_HIDE)
      this.beforeHideEvent.signature = P
      this.hideEvent = this.createEvent(A.HIDE)
      this.hideEvent.signature = P
    },
    platform: (function () {
      const P = navigator.userAgent.toLowerCase()
      if (P.indexOf('windows') != -1 || P.indexOf('win32') != -1) {
        return 'windows'
      } else {
        if (P.indexOf('macintosh') != -1) {
          return 'mac'
        } else {
          return false
        }
      }
    })(),
    browser: (function () {
      const P = navigator.userAgent.toLowerCase()
      if (P.indexOf('opera') != -1) {
        return 'opera'
      } else {
        if (P.indexOf('msie 7') != -1) {
          return 'ie7'
        } else {
          if (P.indexOf('msie') != -1) {
            return 'ie'
          } else {
            if (P.indexOf('safari') != -1) {
              return 'safari'
            } else {
              if (P.indexOf('gecko') != -1) {
                return 'gecko'
              } else {
                return false
              }
            }
          }
        }
      }
    })(),
    isSecure: (function () {
      if (window.location.href.toLowerCase().indexOf('https') === 0) {
        return true
      } else {
        return false
      }
    })(),
    initDefaultConfig: function () {
      this.cfg.addProperty(I.VISIBLE.key, {
        handler: this.configVisible,
        value: I.VISIBLE.value,
        validator: I.VISIBLE.validator
      })
      this.cfg.addProperty(I.EFFECT.key, {
        suppressEvent: I.EFFECT.suppressEvent,
        supercedes: I.EFFECT.supercedes
      })
      this.cfg.addProperty(I.MONITOR_RESIZE.key, {
        handler: this.configMonitorResize,
        value: I.MONITOR_RESIZE.value
      })
      this.cfg.addProperty(I.APPEND_TO_DOCUMENT_BODY.key, {
        value: I.APPEND_TO_DOCUMENT_BODY.value
      })
    },
    init: function (U, T) {
      let R, V
      this.initEvents()
      this.beforeInitEvent.fire(G)
      this.cfg = new D(this)
      if (this.isSecure) {
        this.imageRoot = G.IMG_ROOT_SSL
      }
      if (typeof U === 'string') {
        R = U
        U = document.getElementById(U)
        if (!U) {
          U = K().cloneNode(false)
          U.id = R
        }
      }
      this.element = U
      if (U.id) {
        this.id = U.id
      }
      V = this.element.firstChild
      if (V) {
        let Q = false
        let P = false
        let S = false
        do {
          if (V.nodeType == 1) {
            if (!Q && F.hasClass(V, G.CSS_HEADER)) {
              this.header = V
              Q = true
            } else {
              if (!P && F.hasClass(V, G.CSS_BODY)) {
                this.body = V
                P = true
              } else {
                if (!S && F.hasClass(V, G.CSS_FOOTER)) {
                  this.footer = V
                  S = true
                }
              }
            }
          }
        } while ((V = V.nextSibling))
      }
      this.initDefaultConfig()
      F.addClass(this.element, G.CSS_MODULE)
      if (T) {
        this.cfg.applyConfig(T, true)
      }
      if (
        !D.alreadySubscribed(this.renderEvent, this.cfg.fireQueue, this.cfg)
      ) {
        this.renderEvent.subscribe(this.cfg.fireQueue, this.cfg, true)
      }
      this.initEvent.fire(G)
    },
    initResizeMonitor: function () {
      const Q = YAHOO.env.ua.gecko && this.platform == 'windows'
      if (Q) {
        const P = this
        setTimeout(function () {
          P._initResizeMonitor()
        }, 0)
      } else {
        this._initResizeMonitor()
      }
    },
    _initResizeMonitor: function () {
      let P, R, T
      function V () {
        G.textResizeEvent.fire()
      }
      if (!YAHOO.env.ua.opera) {
        R = F.get('_yuiResizeMonitor')
        const U = this._supportsCWResize()
        if (!R) {
          R = document.createElement('iframe')
          if (this.isSecure && G.RESIZE_MONITOR_SECURE_URL && YAHOO.env.ua.ie) {
            R.src = G.RESIZE_MONITOR_SECURE_URL
          }
          if (!U) {
            T = [
              '<html><head><script ',
              'type="text/javascript">',
              'window.onresize=function(){window.parent.',
              'YAHOO.widget.Module.textResizeEvent.',
              'fire();};<',
              '/script></head>',
              '<body></body></html>'
            ].join('')
            R.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(T)
          }
          R.id = '_yuiResizeMonitor'
          R.style.position = 'absolute'
          R.style.visibility = 'hidden'
          const Q = document.body
          const S = Q.firstChild
          if (S) {
            Q.insertBefore(R, S)
          } else {
            Q.appendChild(R)
          }
          R.style.width = '10em'
          R.style.height = '10em'
          R.style.top = -1 * R.offsetHeight + 'px'
          R.style.left = -1 * R.offsetWidth + 'px'
          R.style.borderWidth = '0'
          R.style.visibility = 'visible'
          if (YAHOO.env.ua.webkit) {
            P = R.contentWindow.document
            P.open()
            P.close()
          }
        }
        if (R && R.contentWindow) {
          G.textResizeEvent.subscribe(this.onDomResize, this, true)
          if (!G.textResizeInitialized) {
            if (U) {
              if (!M.on(R.contentWindow, 'resize', V)) {
                M.on(R, 'resize', V)
              }
            }
            G.textResizeInitialized = true
          }
          this.resizeMonitor = R
        }
      }
    },
    _supportsCWResize: function () {
      let P = true
      if (YAHOO.env.ua.gecko && YAHOO.env.ua.gecko <= 1.8) {
        P = false
      }
      return P
    },
    onDomResize: function (S, R) {
      const Q = -1 * this.resizeMonitor.offsetWidth
      const P = -1 * this.resizeMonitor.offsetHeight
      this.resizeMonitor.style.top = P + 'px'
      this.resizeMonitor.style.left = Q + 'px'
    },
    setHeader: function (Q) {
      const P = this.header || (this.header = J())
      if (Q.nodeName) {
        P.innerHTML = ''
        P.appendChild(Q)
      } else {
        P.innerHTML = Q
      }
      this.changeHeaderEvent.fire(Q)
      this.changeContentEvent.fire()
    },
    appendToHeader: function (Q) {
      const P = this.header || (this.header = J())
      P.appendChild(Q)
      this.changeHeaderEvent.fire(Q)
      this.changeContentEvent.fire()
    },
    setBody: function (Q) {
      const P = this.body || (this.body = B())
      if (Q.nodeName) {
        P.innerHTML = ''
        P.appendChild(Q)
      } else {
        P.innerHTML = Q
      }
      this.changeBodyEvent.fire(Q)
      this.changeContentEvent.fire()
    },
    appendToBody: function (Q) {
      const P = this.body || (this.body = B())
      P.appendChild(Q)
      this.changeBodyEvent.fire(Q)
      this.changeContentEvent.fire()
    },
    setFooter: function (Q) {
      const P = this.footer || (this.footer = C())
      if (Q.nodeName) {
        P.innerHTML = ''
        P.appendChild(Q)
      } else {
        P.innerHTML = Q
      }
      this.changeFooterEvent.fire(Q)
      this.changeContentEvent.fire()
    },
    appendToFooter: function (Q) {
      const P = this.footer || (this.footer = C())
      P.appendChild(Q)
      this.changeFooterEvent.fire(Q)
      this.changeContentEvent.fire()
    },
    render: function (R, P) {
      const S = this
      let T
      function Q (U) {
        if (typeof U === 'string') {
          U = document.getElementById(U)
        }
        if (U) {
          S._addToParent(U, S.element)
          S.appendEvent.fire()
        }
      }
      this.beforeRenderEvent.fire()
      if (!P) {
        P = this.element
      }
      if (R) {
        Q(R)
      } else {
        if (!F.inDocument(this.element)) {
          return false
        }
      }
      if (this.header && !F.inDocument(this.header)) {
        T = P.firstChild
        if (T) {
          P.insertBefore(this.header, T)
        } else {
          P.appendChild(this.header)
        }
      }
      if (this.body && !F.inDocument(this.body)) {
        if (this.footer && F.isAncestor(this.moduleElement, this.footer)) {
          P.insertBefore(this.body, this.footer)
        } else {
          P.appendChild(this.body)
        }
      }
      if (this.footer && !F.inDocument(this.footer)) {
        P.appendChild(this.footer)
      }
      this.renderEvent.fire()
      return true
    },
    destroy: function () {
      let P, Q
      if (this.element) {
        M.purgeElement(this.element, true)
        P = this.element.parentNode
      }
      if (P) {
        P.removeChild(this.element)
      }
      this.element = null
      this.header = null
      this.body = null
      this.footer = null
      G.textResizeEvent.unsubscribe(this.onDomResize, this)
      this.cfg.destroy()
      this.cfg = null
      this.destroyEvent.fire()
      for (Q in this) {
        if (Q instanceof L) {
          Q.unsubscribeAll()
        }
      }
    },
    show: function () {
      this.cfg.setProperty('visible', true)
    },
    hide: function () {
      this.cfg.setProperty('visible', false)
    },
    configVisible: function (Q, P, R) {
      const S = P[0]
      if (S) {
        this.beforeShowEvent.fire()
        F.setStyle(this.element, 'display', 'block')
        this.showEvent.fire()
      } else {
        this.beforeHideEvent.fire()
        F.setStyle(this.element, 'display', 'none')
        this.hideEvent.fire()
      }
    },
    configMonitorResize: function (R, Q, S) {
      const P = Q[0]
      if (P) {
        this.initResizeMonitor()
      } else {
        G.textResizeEvent.unsubscribe(this.onDomResize, this, true)
        this.resizeMonitor = null
      }
    },
    _addToParent: function (P, Q) {
      if (
        !this.cfg.getProperty('appendtodocumentbody') &&
        P === document.body &&
        P.firstChild
      ) {
        P.insertBefore(Q, P.firstChild)
      } else {
        P.appendChild(Q)
      }
    },
    toString: function () {
      return 'Module ' + this.id
    }
  }
  YAHOO.lang.augmentProto(G, YAHOO.util.EventProvider)
})();
(function () {
  YAHOO.widget.Overlay = function (L, K) {
    YAHOO.widget.Overlay.superclass.constructor.call(this, L, K)
  }
  const F = YAHOO.lang
  const I = YAHOO.util.CustomEvent
  const E = YAHOO.widget.Module
  const J = YAHOO.util.Event
  const D = YAHOO.util.Dom
  const C = YAHOO.util.Config
  const B = YAHOO.widget.Overlay
  let G
  const A = { BEFORE_MOVE: 'beforeMove', MOVE: 'move' }
  const H = {
    X: {
      key: 'x',
      validator: F.isNumber,
      suppressEvent: true,
      supercedes: ['iframe']
    },
    Y: {
      key: 'y',
      validator: F.isNumber,
      suppressEvent: true,
      supercedes: ['iframe']
    },
    XY: { key: 'xy', suppressEvent: true, supercedes: ['iframe'] },
    CONTEXT: { key: 'context', suppressEvent: true, supercedes: ['iframe'] },
    FIXED_CENTER: {
      key: 'fixedcenter',
      value: false,
      validator: F.isBoolean,
      supercedes: ['iframe', 'visible']
    },
    WIDTH: {
      key: 'width',
      suppressEvent: true,
      supercedes: ['context', 'fixedcenter', 'iframe']
    },
    HEIGHT: {
      key: 'height',
      suppressEvent: true,
      supercedes: ['context', 'fixedcenter', 'iframe']
    },
    ZINDEX: { key: 'zindex', value: null },
    CONSTRAIN_TO_VIEWPORT: {
      key: 'constraintoviewport',
      value: false,
      validator: F.isBoolean,
      supercedes: ['iframe', 'x', 'y', 'xy']
    },
    IFRAME: {
      key: 'iframe',
      value: YAHOO.env.ua.ie == 6,
      validator: F.isBoolean,
      supercedes: ['zindex']
    }
  }
  B.IFRAME_SRC = 'javascript:false;'
  B.IFRAME_OFFSET = 3
  B.VIEWPORT_OFFSET = 10
  B.TOP_LEFT = 'tl'
  B.TOP_RIGHT = 'tr'
  B.BOTTOM_LEFT = 'bl'
  B.BOTTOM_RIGHT = 'br'
  B.CSS_OVERLAY = 'yui-overlay'
  B.windowScrollEvent = new I('windowScroll')
  B.windowResizeEvent = new I('windowResize')
  B.windowScrollHandler = function (K) {
    if (YAHOO.env.ua.ie) {
      if (!window.scrollEnd) {
        window.scrollEnd = -1
      }
      clearTimeout(window.scrollEnd)
      window.scrollEnd = setTimeout(function () {
        B.windowScrollEvent.fire()
      }, 1)
    } else {
      B.windowScrollEvent.fire()
    }
  }
  B.windowResizeHandler = function (K) {
    if (YAHOO.env.ua.ie) {
      if (!window.resizeEnd) {
        window.resizeEnd = -1
      }
      clearTimeout(window.resizeEnd)
      window.resizeEnd = setTimeout(function () {
        B.windowResizeEvent.fire()
      }, 100)
    } else {
      B.windowResizeEvent.fire()
    }
  }
  B._initialized = null
  if (B._initialized === null) {
    J.on(window, 'scroll', B.windowScrollHandler)
    J.on(window, 'resize', B.windowResizeHandler)
    B._initialized = true
  }
  YAHOO.extend(B, E, {
    init: function (L, K) {
      B.superclass.init.call(this, L)
      this.beforeInitEvent.fire(B)
      D.addClass(this.element, B.CSS_OVERLAY)
      if (K) {
        this.cfg.applyConfig(K, true)
      }
      if (this.platform == 'mac' && YAHOO.env.ua.gecko) {
        if (
          !C.alreadySubscribed(
            this.showEvent,
            this.showMacGeckoScrollbars,
            this
          )
        ) {
          this.showEvent.subscribe(this.showMacGeckoScrollbars, this, true)
        }
        if (
          !C.alreadySubscribed(
            this.hideEvent,
            this.hideMacGeckoScrollbars,
            this
          )
        ) {
          this.hideEvent.subscribe(this.hideMacGeckoScrollbars, this, true)
        }
      }
      this.initEvent.fire(B)
    },
    initEvents: function () {
      B.superclass.initEvents.call(this)
      const K = I.LIST
      this.beforeMoveEvent = this.createEvent(A.BEFORE_MOVE)
      this.beforeMoveEvent.signature = K
      this.moveEvent = this.createEvent(A.MOVE)
      this.moveEvent.signature = K
    },
    initDefaultConfig: function () {
      B.superclass.initDefaultConfig.call(this)
      this.cfg.addProperty(H.X.key, {
        handler: this.configX,
        validator: H.X.validator,
        suppressEvent: H.X.suppressEvent,
        supercedes: H.X.supercedes
      })
      this.cfg.addProperty(H.Y.key, {
        handler: this.configY,
        validator: H.Y.validator,
        suppressEvent: H.Y.suppressEvent,
        supercedes: H.Y.supercedes
      })
      this.cfg.addProperty(H.XY.key, {
        handler: this.configXY,
        suppressEvent: H.XY.suppressEvent,
        supercedes: H.XY.supercedes
      })
      this.cfg.addProperty(H.CONTEXT.key, {
        handler: this.configContext,
        suppressEvent: H.CONTEXT.suppressEvent,
        supercedes: H.CONTEXT.supercedes
      })
      this.cfg.addProperty(H.FIXED_CENTER.key, {
        handler: this.configFixedCenter,
        value: H.FIXED_CENTER.value,
        validator: H.FIXED_CENTER.validator,
        supercedes: H.FIXED_CENTER.supercedes
      })
      this.cfg.addProperty(H.WIDTH.key, {
        handler: this.configWidth,
        suppressEvent: H.WIDTH.suppressEvent,
        supercedes: H.WIDTH.supercedes
      })
      this.cfg.addProperty(H.HEIGHT.key, {
        handler: this.configHeight,
        suppressEvent: H.HEIGHT.suppressEvent,
        supercedes: H.HEIGHT.supercedes
      })
      this.cfg.addProperty(H.ZINDEX.key, {
        handler: this.configzIndex,
        value: H.ZINDEX.value
      })
      this.cfg.addProperty(H.CONSTRAIN_TO_VIEWPORT.key, {
        handler: this.configConstrainToViewport,
        value: H.CONSTRAIN_TO_VIEWPORT.value,
        validator: H.CONSTRAIN_TO_VIEWPORT.validator,
        supercedes: H.CONSTRAIN_TO_VIEWPORT.supercedes
      })
      this.cfg.addProperty(H.IFRAME.key, {
        handler: this.configIframe,
        value: H.IFRAME.value,
        validator: H.IFRAME.validator,
        supercedes: H.IFRAME.supercedes
      })
    },
    moveTo: function (K, L) {
      this.cfg.setProperty('xy', [K, L])
    },
    hideMacGeckoScrollbars: function () {
      D.removeClass(this.element, 'show-scrollbars')
      D.addClass(this.element, 'hide-scrollbars')
    },
    showMacGeckoScrollbars: function () {
      D.removeClass(this.element, 'hide-scrollbars')
      D.addClass(this.element, 'show-scrollbars')
    },
    configVisible: function (N, K, T) {
      const M = K[0]
      let O = D.getStyle(this.element, 'visibility')
      const U = this.cfg.getProperty('effect')
      const R = []
      const Q = this.platform == 'mac' && YAHOO.env.ua.gecko
      const b = C.alreadySubscribed
      let S
      let L
      let a
      let Y
      let X
      let W
      let Z
      let V
      let P
      if (O == 'inherit') {
        a = this.element.parentNode
        while (a.nodeType != 9 && a.nodeType != 11) {
          O = D.getStyle(a, 'visibility')
          if (O != 'inherit') {
            break
          }
          a = a.parentNode
        }
        if (O == 'inherit') {
          O = 'visible'
        }
      }
      if (U) {
        if (U instanceof Array) {
          V = U.length
          for (Y = 0; Y < V; Y++) {
            S = U[Y]
            R[R.length] = S.effect(this, S.duration)
          }
        } else {
          R[R.length] = U.effect(this, U.duration)
        }
      }
      if (M) {
        if (Q) {
          this.showMacGeckoScrollbars()
        }
        if (U) {
          if (M) {
            if (O != 'visible' || O === '') {
              this.beforeShowEvent.fire()
              P = R.length
              for (X = 0; X < P; X++) {
                L = R[X]
                if (
                  X === 0 &&
                  !b(
                    L.animateInCompleteEvent,
                    this.showEvent.fire,
                    this.showEvent
                  )
                ) {
                  L.animateInCompleteEvent.subscribe(
                    this.showEvent.fire,
                    this.showEvent,
                    true
                  )
                }
                L.animateIn()
              }
            }
          }
        } else {
          if (O != 'visible' || O === '') {
            this.beforeShowEvent.fire()
            D.setStyle(this.element, 'visibility', 'visible')
            this.cfg.refireEvent('iframe')
            this.showEvent.fire()
          }
        }
      } else {
        if (Q) {
          this.hideMacGeckoScrollbars()
        }
        if (U) {
          if (O == 'visible') {
            this.beforeHideEvent.fire()
            P = R.length
            for (W = 0; W < P; W++) {
              Z = R[W]
              if (
                W === 0 &&
                !b(
                  Z.animateOutCompleteEvent,
                  this.hideEvent.fire,
                  this.hideEvent
                )
              ) {
                Z.animateOutCompleteEvent.subscribe(
                  this.hideEvent.fire,
                  this.hideEvent,
                  true
                )
              }
              Z.animateOut()
            }
          } else {
            if (O === '') {
              D.setStyle(this.element, 'visibility', 'hidden')
            }
          }
        } else {
          if (O == 'visible' || O === '') {
            this.beforeHideEvent.fire()
            D.setStyle(this.element, 'visibility', 'hidden')
            this.hideEvent.fire()
          }
        }
      }
    },
    doCenterOnDOMEvent: function () {
      if (this.cfg.getProperty('visible')) {
        this.center()
      }
    },
    configFixedCenter: function (O, M, P) {
      const Q = M[0]
      const L = C.alreadySubscribed
      const N = B.windowResizeEvent
      const K = B.windowScrollEvent
      if (Q) {
        this.center()
        if (!L(this.beforeShowEvent, this.center, this)) {
          this.beforeShowEvent.subscribe(this.center)
        }
        if (!L(N, this.doCenterOnDOMEvent, this)) {
          N.subscribe(this.doCenterOnDOMEvent, this, true)
        }
        if (!L(K, this.doCenterOnDOMEvent, this)) {
          K.subscribe(this.doCenterOnDOMEvent, this, true)
        }
      } else {
        this.beforeShowEvent.unsubscribe(this.center)
        N.unsubscribe(this.doCenterOnDOMEvent, this)
        K.unsubscribe(this.doCenterOnDOMEvent, this)
      }
    },
    configHeight: function (N, L, O) {
      const K = L[0]
      const M = this.element
      D.setStyle(M, 'height', K)
      this.cfg.refireEvent('iframe')
    },
    configWidth: function (N, K, O) {
      const M = K[0]
      const L = this.element
      D.setStyle(L, 'width', M)
      this.cfg.refireEvent('iframe')
    },
    configzIndex: function (M, K, N) {
      let O = K[0]
      const L = this.element
      if (!O) {
        O = D.getStyle(L, 'zIndex')
        if (!O || isNaN(O)) {
          O = 0
        }
      }
      if (this.iframe || this.cfg.getProperty('iframe') === true) {
        if (O <= 0) {
          O = 1
        }
      }
      D.setStyle(L, 'zIndex', O)
      this.cfg.setProperty('zIndex', O, true)
      if (this.iframe) {
        this.stackIframe()
      }
    },
    configXY: function (M, L, N) {
      const P = L[0]
      let K = P[0]
      let O = P[1]
      this.cfg.setProperty('x', K)
      this.cfg.setProperty('y', O)
      this.beforeMoveEvent.fire([K, O])
      K = this.cfg.getProperty('x')
      O = this.cfg.getProperty('y')
      this.cfg.refireEvent('iframe')
      this.moveEvent.fire([K, O])
    },
    configX: function (M, L, N) {
      let K = L[0]
      let O = this.cfg.getProperty('y')
      this.cfg.setProperty('x', K, true)
      this.cfg.setProperty('y', O, true)
      this.beforeMoveEvent.fire([K, O])
      K = this.cfg.getProperty('x')
      O = this.cfg.getProperty('y')
      D.setX(this.element, K, true)
      this.cfg.setProperty('xy', [K, O], true)
      this.cfg.refireEvent('iframe')
      this.moveEvent.fire([K, O])
    },
    configY: function (M, L, N) {
      let K = this.cfg.getProperty('x')
      let O = L[0]
      this.cfg.setProperty('x', K, true)
      this.cfg.setProperty('y', O, true)
      this.beforeMoveEvent.fire([K, O])
      K = this.cfg.getProperty('x')
      O = this.cfg.getProperty('y')
      D.setY(this.element, O, true)
      this.cfg.setProperty('xy', [K, O], true)
      this.cfg.refireEvent('iframe')
      this.moveEvent.fire([K, O])
    },
    showIframe: function () {
      const L = this.iframe
      let K
      if (L) {
        K = this.element.parentNode
        if (K != L.parentNode) {
          this._addToParent(K, L)
        }
        L.style.display = 'block'
      }
    },
    hideIframe: function () {
      if (this.iframe) {
        this.iframe.style.display = 'none'
      }
    },
    syncIframe: function () {
      const K = this.iframe
      const M = this.element
      const O = B.IFRAME_OFFSET
      const L = O * 2
      let N
      if (K) {
        K.style.width = M.offsetWidth + L + 'px'
        K.style.height = M.offsetHeight + L + 'px'
        N = this.cfg.getProperty('xy')
        if (!F.isArray(N) || isNaN(N[0]) || isNaN(N[1])) {
          this.syncPosition()
          N = this.cfg.getProperty('xy')
        }
        D.setXY(K, [N[0] - O, N[1] - O])
      }
    },
    stackIframe: function () {
      if (this.iframe) {
        const K = D.getStyle(this.element, 'zIndex')
        if (!YAHOO.lang.isUndefined(K) && !isNaN(K)) {
          D.setStyle(this.iframe, 'zIndex', K - 1)
        }
      }
    },
    configIframe: function (N, M, O) {
      const K = M[0]
      function P () {
        let R = this.iframe
        const S = this.element
        let T
        if (!R) {
          if (!G) {
            G = document.createElement('iframe')
            if (this.isSecure) {
              G.src = B.IFRAME_SRC
            }
            if (YAHOO.env.ua.ie) {
              G.style.filter = 'alpha(opacity=0)'
              G.frameBorder = 0
            } else {
              G.style.opacity = '0'
            }
            G.style.position = 'absolute'
            G.style.border = 'none'
            G.style.margin = '0'
            G.style.padding = '0'
            G.style.display = 'none'
          }
          R = G.cloneNode(false)
          T = S.parentNode
          const Q = T || document.body
          this._addToParent(Q, R)
          this.iframe = R
        }
        this.showIframe()
        this.syncIframe()
        this.stackIframe()
        if (!this._hasIframeEventListeners) {
          this.showEvent.subscribe(this.showIframe)
          this.hideEvent.subscribe(this.hideIframe)
          this.changeContentEvent.subscribe(this.syncIframe)
          this._hasIframeEventListeners = true
        }
      }
      function L () {
        P.call(this)
        this.beforeShowEvent.unsubscribe(L)
        this._iframeDeferred = false
      }
      if (K) {
        if (this.cfg.getProperty('visible')) {
          P.call(this)
        } else {
          if (!this._iframeDeferred) {
            this.beforeShowEvent.subscribe(L)
            this._iframeDeferred = true
          }
        }
      } else {
        this.hideIframe()
        if (this._hasIframeEventListeners) {
          this.showEvent.unsubscribe(this.showIframe)
          this.hideEvent.unsubscribe(this.hideIframe)
          this.changeContentEvent.unsubscribe(this.syncIframe)
          this._hasIframeEventListeners = false
        }
      }
    },
    _primeXYFromDOM: function () {
      if (YAHOO.lang.isUndefined(this.cfg.getProperty('xy'))) {
        this.syncPosition()
        this.cfg.refireEvent('xy')
        this.beforeShowEvent.unsubscribe(this._primeXYFromDOM)
      }
    },
    configConstrainToViewport: function (L, K, M) {
      const N = K[0]
      if (N) {
        if (
          !C.alreadySubscribed(
            this.beforeMoveEvent,
            this.enforceConstraints,
            this
          )
        ) {
          this.beforeMoveEvent.subscribe(this.enforceConstraints, this, true)
        }
        if (!C.alreadySubscribed(this.beforeShowEvent, this._primeXYFromDOM)) {
          this.beforeShowEvent.subscribe(this._primeXYFromDOM)
        }
      } else {
        this.beforeShowEvent.unsubscribe(this._primeXYFromDOM)
        this.beforeMoveEvent.unsubscribe(this.enforceConstraints, this)
      }
    },
    configContext: function (M, L, O) {
      const Q = L[0]
      let N
      let P
      let K
      if (Q) {
        N = Q[0]
        P = Q[1]
        K = Q[2]
        if (N) {
          if (typeof N === 'string') {
            this.cfg.setProperty(
              'context',
              [document.getElementById(N), P, K],
              true
            )
          }
          if (P && K) {
            this.align(P, K)
          }
        }
      }
    },
    align: function (L, K) {
      const Q = this.cfg.getProperty('context')
      let P = this
      let O
      let N
      let R
      function M (S, T) {
        switch (L) {
          case B.TOP_LEFT:
            P.moveTo(T, S)
            break
          case B.TOP_RIGHT:
            P.moveTo(T - N.offsetWidth, S)
            break
          case B.BOTTOM_LEFT:
            P.moveTo(T, S - N.offsetHeight)
            break
          case B.BOTTOM_RIGHT:
            P.moveTo(T - N.offsetWidth, S - N.offsetHeight)
            break
        }
      }
      if (Q) {
        O = Q[0]
        N = this.element
        P = this
        if (!L) {
          L = Q[1]
        }
        if (!K) {
          K = Q[2]
        }
        if (N && O) {
          R = D.getRegion(O)
          switch (K) {
            case B.TOP_LEFT:
              M(R.top, R.left)
              break
            case B.TOP_RIGHT:
              M(R.top, R.right)
              break
            case B.BOTTOM_LEFT:
              M(R.bottom, R.left)
              break
            case B.BOTTOM_RIGHT:
              M(R.bottom, R.right)
              break
          }
        }
      }
    },
    enforceConstraints: function (L, K, M) {
      const O = K[0]
      const N = this.getConstrainedXY(O[0], O[1])
      this.cfg.setProperty('x', N[0], true)
      this.cfg.setProperty('y', N[1], true)
      this.cfg.setProperty('xy', N, true)
    },
    getConstrainedXY: function (V, T) {
      const N = B.VIEWPORT_OFFSET
      const U = D.getViewportWidth()
      const Q = D.getViewportHeight()
      const M = this.element.offsetHeight
      const S = this.element.offsetWidth
      const Y = D.getDocumentScrollLeft()
      const W = D.getDocumentScrollTop()
      let P = V
      let L = T
      if (S + N < U) {
        const R = Y + N
        const X = Y + U - S - N
        if (V < R) {
          P = R
        } else {
          if (V > X) {
            P = X
          }
        }
      } else {
        P = N + Y
      }
      if (M + N < Q) {
        const O = W + N
        const K = W + Q - M - N
        if (T < O) {
          L = O
        } else {
          if (T > K) {
            L = K
          }
        }
      } else {
        L = N + W
      }
      return [P, L]
    },
    center: function () {
      const N = B.VIEWPORT_OFFSET
      const O = this.element.offsetWidth
      const M = this.element.offsetHeight
      const L = D.getViewportWidth()
      const P = D.getViewportHeight()
      let K
      let Q
      if (O < L) {
        K = L / 2 - O / 2 + D.getDocumentScrollLeft()
      } else {
        K = N + D.getDocumentScrollLeft()
      }
      if (M < P) {
        Q = P / 2 - M / 2 + D.getDocumentScrollTop()
      } else {
        Q = N + D.getDocumentScrollTop()
      }
      this.cfg.setProperty('xy', [parseInt(K, 10), parseInt(Q, 10)])
      this.cfg.refireEvent('iframe')
    },
    syncPosition: function () {
      const K = D.getXY(this.element)
      this.cfg.setProperty('x', K[0], true)
      this.cfg.setProperty('y', K[1], true)
      this.cfg.setProperty('xy', K, true)
    },
    onDomResize: function (M, L) {
      const K = this
      B.superclass.onDomResize.call(this, M, L)
      setTimeout(function () {
        K.syncPosition()
        K.cfg.refireEvent('iframe')
        K.cfg.refireEvent('context')
      }, 0)
    },
    bringToTop: function () {
      const O = []
      const N = this.element
      function R (V, U) {
        const X = D.getStyle(V, 'zIndex')
        const W = D.getStyle(U, 'zIndex')
        const T = !X || isNaN(X) ? 0 : parseInt(X, 10)
        const S = !W || isNaN(W) ? 0 : parseInt(W, 10)
        if (T > S) {
          return -1
        } else {
          if (T < S) {
            return 1
          } else {
            return 0
          }
        }
      }
      function M (U) {
        const S = D.hasClass(U, B.CSS_OVERLAY)
        const T = YAHOO.widget.Panel
        if (S && !D.isAncestor(N, S)) {
          if (T && D.hasClass(U, T.CSS_PANEL)) {
            O[O.length] = U.parentNode
          } else {
            O[O.length] = U
          }
        }
      }
      D.getElementsBy(M, 'DIV', document.body)
      O.sort(R)
      const K = O[0]
      let Q
      if (K) {
        Q = D.getStyle(K, 'zIndex')
        if (!isNaN(Q)) {
          let P = false
          if (K != N) {
            P = true
          } else {
            if (O.length > 1) {
              const L = D.getStyle(O[1], 'zIndex')
              if (!isNaN(L) && Q == L) {
                P = true
              }
            }
          }
          if (P) {
            this.cfg.setProperty('zindex', parseInt(Q, 10) + 2)
          }
        }
      }
    },
    destroy: function () {
      if (this.iframe) {
        this.iframe.parentNode.removeChild(this.iframe)
      }
      this.iframe = null
      B.windowResizeEvent.unsubscribe(this.doCenterOnDOMEvent, this)
      B.windowScrollEvent.unsubscribe(this.doCenterOnDOMEvent, this)
      B.superclass.destroy.call(this)
    },
    toString: function () {
      return 'Overlay ' + this.id
    }
  })
})();
(function () {
  YAHOO.widget.OverlayManager = function (G) {
    this.init(G)
  }
  const D = YAHOO.widget.Overlay
  const C = YAHOO.util.Event
  const E = YAHOO.util.Dom
  const B = YAHOO.util.Config
  const F = YAHOO.util.CustomEvent
  const A = YAHOO.widget.OverlayManager
  A.CSS_FOCUSED = 'focused'
  A.prototype = {
    constructor: A,
    overlays: null,
    initDefaultConfig: function () {
      this.cfg.addProperty('overlays', { suppressEvent: true })
      this.cfg.addProperty('focusevent', { value: 'mousedown' })
    },
    init: function (I) {
      this.cfg = new B(this)
      this.initDefaultConfig()
      if (I) {
        this.cfg.applyConfig(I, true)
      }
      this.cfg.fireQueue()
      let H = null
      this.getActive = function () {
        return H
      }
      this.focus = function (J) {
        const K = this.find(J)
        if (K) {
          if (H != K) {
            if (H) {
              H.blur()
            }
            this.bringToTop(K)
            H = K
            E.addClass(H.element, A.CSS_FOCUSED)
            K.focusEvent.fire()
          }
        }
      }
      this.remove = function (K) {
        const M = this.find(K)
        let J
        if (M) {
          if (H == M) {
            H = null
          }
          const L = !!(M.element === null && M.cfg === null)
          if (!L) {
            J = E.getStyle(M.element, 'zIndex')
            M.cfg.setProperty('zIndex', -1000, true)
          }
          this.overlays.sort(this.compareZIndexDesc)
          this.overlays = this.overlays.slice(0, this.overlays.length - 1)
          M.hideEvent.unsubscribe(M.blur)
          M.destroyEvent.unsubscribe(this._onOverlayDestroy, M)
          if (!L) {
            C.removeListener(
              M.element,
              this.cfg.getProperty('focusevent'),
              this._onOverlayElementFocus
            )
            M.cfg.setProperty('zIndex', J, true)
            M.cfg.setProperty('manager', null)
          }
          M.focusEvent.unsubscribeAll()
          M.blurEvent.unsubscribeAll()
          M.focusEvent = null
          M.blurEvent = null
          M.focus = null
          M.blur = null
        }
      }
      this.blurAll = function () {
        const K = this.overlays.length
        let J
        if (K > 0) {
          J = K - 1
          do {
            this.overlays[J].blur()
          } while (J--)
        }
      }
      this._onOverlayBlur = function (K, J) {
        H = null
      }
      const G = this.cfg.getProperty('overlays')
      if (!this.overlays) {
        this.overlays = []
      }
      if (G) {
        this.register(G)
        this.overlays.sort(this.compareZIndexDesc)
      }
    },
    _onOverlayElementFocus: function (I) {
      const G = C.getTarget(I)
      const H = this.close
      if (H && (G == H || E.isAncestor(H, G))) {
        this.blur()
      } else {
        this.focus()
      }
    },
    _onOverlayDestroy: function (H, G, I) {
      this.remove(I)
    },
    register: function (G) {
      const K = this
      let L
      let I
      let H
      let J
      if (G instanceof D) {
        G.cfg.addProperty('manager', { value: this })
        G.focusEvent = G.createEvent('focus')
        G.focusEvent.signature = F.LIST
        G.blurEvent = G.createEvent('blur')
        G.blurEvent.signature = F.LIST
        G.focus = function () {
          K.focus(this)
        }
        G.blur = function () {
          if (K.getActive() == this) {
            E.removeClass(this.element, A.CSS_FOCUSED)
            this.blurEvent.fire()
          }
        }
        G.blurEvent.subscribe(K._onOverlayBlur)
        G.hideEvent.subscribe(G.blur)
        G.destroyEvent.subscribe(this._onOverlayDestroy, G, this)
        C.on(
          G.element,
          this.cfg.getProperty('focusevent'),
          this._onOverlayElementFocus,
          null,
          G
        )
        L = E.getStyle(G.element, 'zIndex')
        if (!isNaN(L)) {
          G.cfg.setProperty('zIndex', parseInt(L, 10))
        } else {
          G.cfg.setProperty('zIndex', 0)
        }
        this.overlays.push(G)
        this.bringToTop(G)
        return true
      } else {
        if (G instanceof Array) {
          I = 0
          J = G.length
          for (H = 0; H < J; H++) {
            if (this.register(G[H])) {
              I++
            }
          }
          if (I > 0) {
            return true
          }
        } else {
          return false
        }
      }
    },
    bringToTop: function (M) {
      const I = this.find(M)
      let L
      let G
      let J
      if (I) {
        J = this.overlays
        J.sort(this.compareZIndexDesc)
        G = J[0]
        if (G) {
          L = E.getStyle(G.element, 'zIndex')
          if (!isNaN(L)) {
            let K = false
            if (G !== I) {
              K = true
            } else {
              if (J.length > 1) {
                const H = E.getStyle(J[1].element, 'zIndex')
                if (!isNaN(H) && L == H) {
                  K = true
                }
              }
            }
            if (K) {
              I.cfg.setProperty('zindex', parseInt(L, 10) + 2)
            }
          }
          J.sort(this.compareZIndexDesc)
        }
      }
    },
    find: function (G) {
      const I = this.overlays
      const J = I.length
      let H
      if (J > 0) {
        H = J - 1
        if (G instanceof D) {
          do {
            if (I[H] == G) {
              return I[H]
            }
          } while (H--)
        } else {
          if (typeof G === 'string') {
            do {
              if (I[H].id == G) {
                return I[H]
              }
            } while (H--)
          }
        }
        return null
      }
    },
    compareZIndexDesc: function (J, I) {
      const H = J.cfg ? J.cfg.getProperty('zIndex') : null
      const G = I.cfg ? I.cfg.getProperty('zIndex') : null
      if (H === null && G === null) {
        return 0
      } else {
        if (H === null) {
          return 1
        } else {
          if (G === null) {
            return -1
          } else {
            if (H > G) {
              return -1
            } else {
              if (H < G) {
                return 1
              } else {
                return 0
              }
            }
          }
        }
      }
    },
    showAll: function () {
      const H = this.overlays
      const I = H.length
      let G
      if (I > 0) {
        G = I - 1
        do {
          H[G].show()
        } while (G--)
      }
    },
    hideAll: function () {
      const H = this.overlays
      const I = H.length
      let G
      if (I > 0) {
        G = I - 1
        do {
          H[G].hide()
        } while (G--)
      }
    },
    toString: function () {
      return 'OverlayManager'
    }
  }
})();
(function () {
  YAHOO.widget.Tooltip = function (N, M) {
    YAHOO.widget.Tooltip.superclass.constructor.call(this, N, M)
  }
  const E = YAHOO.lang
  const L = YAHOO.util.Event
  const K = YAHOO.util.CustomEvent
  const C = YAHOO.util.Dom
  const G = YAHOO.widget.Tooltip
  let F
  const H = {
    PREVENT_OVERLAP: {
      key: 'preventoverlap',
      value: true,
      validator: E.isBoolean,
      supercedes: ['x', 'y', 'xy']
    },
    SHOW_DELAY: { key: 'showdelay', value: 200, validator: E.isNumber },
    AUTO_DISMISS_DELAY: {
      key: 'autodismissdelay',
      value: 5000,
      validator: E.isNumber
    },
    HIDE_DELAY: { key: 'hidedelay', value: 250, validator: E.isNumber },
    TEXT: { key: 'text', suppressEvent: true },
    CONTAINER: { key: 'container' },
    DISABLED: { key: 'disabled', value: false, suppressEvent: true }
  }
  const A = {
    CONTEXT_MOUSE_OVER: 'contextMouseOver',
    CONTEXT_MOUSE_OUT: 'contextMouseOut',
    CONTEXT_TRIGGER: 'contextTrigger'
  }
  G.CSS_TOOLTIP = 'yui-tt'
  function I (N, M, O) {
    const R = O[0]
    const P = O[1]
    const Q = this.cfg
    const S = Q.getProperty('width')
    if (S == P) {
      Q.setProperty('width', R)
    }
    this.unsubscribe('hide', this._onHide, O)
  }
  function D (N, M) {
    const O = document.body
    const S = this.cfg
    const R = S.getProperty('width')
    let P
    let Q
    if (
      (!R || R == 'auto') &&
      (S.getProperty('container') != O ||
        S.getProperty('x') >= C.getViewportWidth() ||
        S.getProperty('y') >= C.getViewportHeight())
    ) {
      Q = this.element.cloneNode(true)
      Q.style.visibility = 'hidden'
      Q.style.top = '0px'
      Q.style.left = '0px'
      O.appendChild(Q)
      P = Q.offsetWidth + 'px'
      O.removeChild(Q)
      Q = null
      S.setProperty('width', P)
      S.refireEvent('xy')
      this.subscribe('hide', I, [R || '', P])
    }
  }
  function B (N, M, O) {
    this.render(O)
  }
  function J () {
    L.onDOMReady(B, this.cfg.getProperty('container'), this)
  }
  YAHOO.extend(G, YAHOO.widget.Overlay, {
    init: function (N, M) {
      G.superclass.init.call(this, N)
      this.beforeInitEvent.fire(G)
      C.addClass(this.element, G.CSS_TOOLTIP)
      if (M) {
        this.cfg.applyConfig(M, true)
      }
      this.cfg.queueProperty('visible', false)
      this.cfg.queueProperty('constraintoviewport', true)
      this.setBody('')
      this.subscribe('beforeShow', D)
      this.subscribe('init', J)
      this.subscribe('render', this.onRender)
      this.initEvent.fire(G)
    },
    initEvents: function () {
      G.superclass.initEvents.call(this)
      const M = K.LIST
      this.contextMouseOverEvent = this.createEvent(A.CONTEXT_MOUSE_OVER)
      this.contextMouseOverEvent.signature = M
      this.contextMouseOutEvent = this.createEvent(A.CONTEXT_MOUSE_OUT)
      this.contextMouseOutEvent.signature = M
      this.contextTriggerEvent = this.createEvent(A.CONTEXT_TRIGGER)
      this.contextTriggerEvent.signature = M
    },
    initDefaultConfig: function () {
      G.superclass.initDefaultConfig.call(this)
      this.cfg.addProperty(H.PREVENT_OVERLAP.key, {
        value: H.PREVENT_OVERLAP.value,
        validator: H.PREVENT_OVERLAP.validator,
        supercedes: H.PREVENT_OVERLAP.supercedes
      })
      this.cfg.addProperty(H.SHOW_DELAY.key, {
        handler: this.configShowDelay,
        value: 200,
        validator: H.SHOW_DELAY.validator
      })
      this.cfg.addProperty(H.AUTO_DISMISS_DELAY.key, {
        handler: this.configAutoDismissDelay,
        value: H.AUTO_DISMISS_DELAY.value,
        validator: H.AUTO_DISMISS_DELAY.validator
      })
      this.cfg.addProperty(H.HIDE_DELAY.key, {
        handler: this.configHideDelay,
        value: H.HIDE_DELAY.value,
        validator: H.HIDE_DELAY.validator
      })
      this.cfg.addProperty(H.TEXT.key, {
        handler: this.configText,
        suppressEvent: H.TEXT.suppressEvent
      })
      this.cfg.addProperty(H.CONTAINER.key, {
        handler: this.configContainer,
        value: document.body
      })
      this.cfg.addProperty(H.DISABLED.key, {
        handler: this.configContainer,
        value: H.DISABLED.value,
        supressEvent: H.DISABLED.suppressEvent
      })
    },
    configText: function (N, M, O) {
      const P = M[0]
      if (P) {
        this.setBody(P)
      }
    },
    configContainer: function (O, N, P) {
      const M = N[0]
      if (typeof M === 'string') {
        this.cfg.setProperty('container', document.getElementById(M), true)
      }
    },
    _removeEventListeners: function () {
      const P = this._context
      let M
      let O
      let N
      if (P) {
        M = P.length
        if (M > 0) {
          N = M - 1
          do {
            O = P[N]
            L.removeListener(O, 'mouseover', this.onContextMouseOver)
            L.removeListener(O, 'mousemove', this.onContextMouseMove)
            L.removeListener(O, 'mouseout', this.onContextMouseOut)
          } while (N--)
        }
      }
    },
    configContext: function (R, N, S) {
      let Q = N[0]
      let T
      let M
      let P
      let O
      if (Q) {
        if (!(Q instanceof Array)) {
          if (typeof Q === 'string') {
            this.cfg.setProperty('context', [document.getElementById(Q)], true)
          } else {
            this.cfg.setProperty('context', [Q], true)
          }
          Q = this.cfg.getProperty('context')
        }
        this._removeEventListeners()
        this._context = Q
        T = this._context
        if (T) {
          M = T.length
          if (M > 0) {
            O = M - 1
            do {
              P = T[O]
              L.on(P, 'mouseover', this.onContextMouseOver, this)
              L.on(P, 'mousemove', this.onContextMouseMove, this)
              L.on(P, 'mouseout', this.onContextMouseOut, this)
            } while (O--)
          }
        }
      }
    },
    onContextMouseMove: function (N, M) {
      M.pageX = L.getPageX(N)
      M.pageY = L.getPageY(N)
    },
    onContextMouseOver: function (O, N) {
      const M = this
      if (M.title) {
        N._tempTitle = M.title
        M.title = ''
      }
      if (
        N.fireEvent('contextMouseOver', M, O) !== false &&
        !N.cfg.getProperty('disabled')
      ) {
        if (N.hideProcId) {
          clearTimeout(N.hideProcId)
          N.hideProcId = null
        }
        L.on(M, 'mousemove', N.onContextMouseMove, N)
        N.showProcId = N.doShow(O, M)
      }
    },
    onContextMouseOut: function (O, N) {
      const M = this
      if (N._tempTitle) {
        M.title = N._tempTitle
        N._tempTitle = null
      }
      if (N.showProcId) {
        clearTimeout(N.showProcId)
        N.showProcId = null
      }
      if (N.hideProcId) {
        clearTimeout(N.hideProcId)
        N.hideProcId = null
      }
      N.fireEvent('contextMouseOut', M, O)
      N.hideProcId = setTimeout(function () {
        N.hide()
      }, N.cfg.getProperty('hidedelay'))
    },
    doShow: function (O, M) {
      let P = 25
      const N = this
      if (YAHOO.env.ua.opera && M.tagName && M.tagName.toUpperCase() == 'A') {
        P += 12
      }
      return setTimeout(function () {
        const Q = N.cfg.getProperty('text')
        if (
          N._tempTitle &&
          (Q === '' || YAHOO.lang.isUndefined(Q) || YAHOO.lang.isNull(Q))
        ) {
          N.setBody(N._tempTitle)
        } else {
          N.cfg.refireEvent('text')
        }
        N.moveTo(N.pageX, N.pageY + P)
        if (N.cfg.getProperty('preventoverlap')) {
          N.preventOverlap(N.pageX, N.pageY)
        }
        L.removeListener(M, 'mousemove', N.onContextMouseMove)
        N.contextTriggerEvent.fire(M)
        N.show()
        N.hideProcId = N.doHide()
      }, this.cfg.getProperty('showdelay'))
    },
    doHide: function () {
      const M = this
      return setTimeout(function () {
        M.hide()
      }, this.cfg.getProperty('autodismissdelay'))
    },
    preventOverlap: function (Q, P) {
      const M = this.element.offsetHeight
      const O = new YAHOO.util.Point(Q, P)
      const N = C.getRegion(this.element)
      N.top -= 5
      N.left -= 5
      N.right += 5
      N.bottom += 5
      if (N.contains(O)) {
        this.cfg.setProperty('y', P - M - 5)
      }
    },
    onRender: function (Q, P) {
      function R () {
        const U = this.element
        const T = this._shadow
        if (T) {
          T.style.width = U.offsetWidth + 6 + 'px'
          T.style.height = U.offsetHeight + 1 + 'px'
        }
      }
      function N () {
        C.addClass(this._shadow, 'yui-tt-shadow-visible')
      }
      function M () {
        C.removeClass(this._shadow, 'yui-tt-shadow-visible')
      }
      function S () {
        let V = this._shadow
        let U
        let T
        let X
        let W
        if (!V) {
          U = this.element
          T = YAHOO.widget.Module
          X = YAHOO.env.ua.ie
          W = this
          if (!F) {
            F = document.createElement('div')
            F.className = 'yui-tt-shadow'
          }
          V = F.cloneNode(false)
          U.appendChild(V)
          this._shadow = V
          N.call(this)
          this.subscribe('beforeShow', N)
          this.subscribe('beforeHide', M)
          if (X == 6 || (X == 7 && document.compatMode == 'BackCompat')) {
            window.setTimeout(function () {
              R.call(W)
            }, 0)
            this.cfg.subscribeToConfigEvent('width', R)
            this.cfg.subscribeToConfigEvent('height', R)
            this.subscribe('changeContent', R)
            T.textResizeEvent.subscribe(R, this, true)
            this.subscribe('destroy', function () {
              T.textResizeEvent.unsubscribe(R, this)
            })
          }
        }
      }
      function O () {
        S.call(this)
        this.unsubscribe('beforeShow', O)
      }
      if (this.cfg.getProperty('visible')) {
        S.call(this)
      } else {
        this.subscribe('beforeShow', O)
      }
    },
    destroy: function () {
      this._removeEventListeners()
      G.superclass.destroy.call(this)
    },
    toString: function () {
      return 'Tooltip ' + this.id
    }
  })
})();
(function () {
  YAHOO.widget.Panel = function (R, Q) {
    YAHOO.widget.Panel.superclass.constructor.call(this, R, Q)
  }
  const I = YAHOO.lang
  const E = YAHOO.util.DD
  const F = YAHOO.util.Dom
  const P = YAHOO.util.Event
  const B = YAHOO.widget.Overlay
  const O = YAHOO.util.CustomEvent
  const C = YAHOO.util.Config
  const N = YAHOO.widget.Panel
  let H
  let L
  let D
  const A = { SHOW_MASK: 'showMask', HIDE_MASK: 'hideMask', DRAG: 'drag' }
  const J = {
    CLOSE: {
      key: 'close',
      value: true,
      validator: I.isBoolean,
      supercedes: ['visible']
    },
    DRAGGABLE: {
      key: 'draggable',
      value: !!E,
      validator: I.isBoolean,
      supercedes: ['visible']
    },
    DRAG_ONLY: {
      key: 'dragonly',
      value: false,
      validator: I.isBoolean,
      supercedes: ['draggable']
    },
    UNDERLAY: { key: 'underlay', value: 'shadow', supercedes: ['visible'] },
    MODAL: {
      key: 'modal',
      value: false,
      validator: I.isBoolean,
      supercedes: ['visible', 'zindex']
    },
    KEY_LISTENERS: {
      key: 'keylisteners',
      suppressEvent: true,
      supercedes: ['visible']
    }
  }
  N.CSS_PANEL = 'yui-panel'
  N.CSS_PANEL_CONTAINER = 'yui-panel-container'
  N.FOCUSABLE = ['a', 'button', 'select', 'textarea', 'input']
  function M (R, Q) {
    if (!this.header && this.cfg.getProperty('draggable')) {
      this.setHeader('&#160;')
    }
  }
  function K (R, Q, S) {
    const V = S[0]
    const T = S[1]
    const U = this.cfg
    const W = U.getProperty('width')
    if (W == T) {
      U.setProperty('width', V)
    }
    this.unsubscribe('hide', K, S)
  }
  function G (R, Q) {
    const V = YAHOO.env.ua.ie
    let U
    let T
    let S
    if (V == 6 || (V == 7 && document.compatMode == 'BackCompat')) {
      U = this.cfg
      T = U.getProperty('width')
      if (!T || T == 'auto') {
        S = this.element.offsetWidth + 'px'
        U.setProperty('width', S)
        this.subscribe('hide', K, [T || '', S])
      }
    }
  }
  YAHOO.extend(N, B, {
    init: function (R, Q) {
      N.superclass.init.call(this, R)
      this.beforeInitEvent.fire(N)
      F.addClass(this.element, N.CSS_PANEL)
      this.buildWrapper()
      if (Q) {
        this.cfg.applyConfig(Q, true)
      }
      this.subscribe('showMask', this._addFocusHandlers)
      this.subscribe('hideMask', this._removeFocusHandlers)
      this.subscribe('beforeRender', M)
      this.initEvent.fire(N)
    },
    _onElementFocus: function (Q) {
      this.blur()
    },
    _addFocusHandlers: function (Y, S) {
      const V = this
      const Z = 'focus'
      const U = 'hidden'
      function X (a) {
        if (a.type !== U && !F.isAncestor(V.element, a)) {
          P.on(a, Z, V._onElementFocus)
          return true
        }
        return false
      }
      const W = N.FOCUSABLE
      const Q = W.length
      let T = []
      for (let R = 0; R < Q; R++) {
        T = T.concat(F.getElementsBy(X, W[R]))
      }
      this.focusableElements = T
    },
    _removeFocusHandlers: function (T, S) {
      const V = this.focusableElements
      const Q = V.length
      const R = 'focus'
      if (V) {
        for (let U = 0; U < Q; U++) {
          P.removeListener(V[U], R, this._onElementFocus)
        }
      }
    },
    initEvents: function () {
      N.superclass.initEvents.call(this)
      const Q = O.LIST
      this.showMaskEvent = this.createEvent(A.SHOW_MASK)
      this.showMaskEvent.signature = Q
      this.hideMaskEvent = this.createEvent(A.HIDE_MASK)
      this.hideMaskEvent.signature = Q
      this.dragEvent = this.createEvent(A.DRAG)
      this.dragEvent.signature = Q
    },
    initDefaultConfig: function () {
      N.superclass.initDefaultConfig.call(this)
      this.cfg.addProperty(J.CLOSE.key, {
        handler: this.configClose,
        value: J.CLOSE.value,
        validator: J.CLOSE.validator,
        supercedes: J.CLOSE.supercedes
      })
      this.cfg.addProperty(J.DRAGGABLE.key, {
        handler: this.configDraggable,
        value: J.DRAGGABLE.value,
        validator: J.DRAGGABLE.validator,
        supercedes: J.DRAGGABLE.supercedes
      })
      this.cfg.addProperty(J.DRAG_ONLY.key, {
        value: J.DRAG_ONLY.value,
        validator: J.DRAG_ONLY.validator,
        supercedes: J.DRAG_ONLY.supercedes
      })
      this.cfg.addProperty(J.UNDERLAY.key, {
        handler: this.configUnderlay,
        value: J.UNDERLAY.value,
        supercedes: J.UNDERLAY.supercedes
      })
      this.cfg.addProperty(J.MODAL.key, {
        handler: this.configModal,
        value: J.MODAL.value,
        validator: J.MODAL.validator,
        supercedes: J.MODAL.supercedes
      })
      this.cfg.addProperty(J.KEY_LISTENERS.key, {
        handler: this.configKeyListeners,
        suppressEvent: J.KEY_LISTENERS.suppressEvent,
        supercedes: J.KEY_LISTENERS.supercedes
      })
    },
    configClose: function (S, Q, U) {
      const V = Q[0]
      let R = this.close
      function T (X, W) {
        W.hide()
      }
      if (V) {
        if (!R) {
          if (!D) {
            D = document.createElement('span')
            D.innerHTML = '&#160;'
            D.className = 'container-close'
          }
          R = D.cloneNode(true)
          this.innerElement.appendChild(R)
          P.on(R, 'click', T, this)
          this.close = R
        } else {
          R.style.display = 'block'
        }
      } else {
        if (R) {
          R.style.display = 'none'
        }
      }
    },
    configDraggable: function (R, Q, S) {
      const T = Q[0]
      if (T) {
        if (!E) {
          this.cfg.setProperty('draggable', false)
          return
        }
        if (this.header) {
          F.setStyle(this.header, 'cursor', 'move')
          this.registerDragDrop()
        }
        this.subscribe('beforeShow', G)
      } else {
        if (this.dd) {
          this.dd.unreg()
        }
        if (this.header) {
          F.setStyle(this.header, 'cursor', 'auto')
        }
        this.unsubscribe('beforeShow', G)
      }
    },
    configUnderlay: function (b, a, V) {
      const Z = YAHOO.env.ua
      const X = this.platform == 'mac' && Z.gecko
      const Y = Z.ie == 6 || (Z.ie == 7 && document.compatMode == 'BackCompat')
      const c = a[0].toLowerCase()
      let R = this.underlay
      const S = this.element
      function d () {
        const e = this.underlay
        F.addClass(e, 'yui-force-redraw')
        window.setTimeout(function () {
          F.removeClass(e, 'yui-force-redraw')
        }, 0)
      }
      function T () {
        let e = false
        if (!R) {
          if (!L) {
            L = document.createElement('div')
            L.className = 'underlay'
          }
          R = L.cloneNode(false)
          this.element.appendChild(R)
          this.underlay = R
          if (Y) {
            this.sizeUnderlay()
            this.cfg.subscribeToConfigEvent('width', this.sizeUnderlay)
            this.cfg.subscribeToConfigEvent('height', this.sizeUnderlay)
            this.changeContentEvent.subscribe(this.sizeUnderlay)
            YAHOO.widget.Module.textResizeEvent.subscribe(
              this.sizeUnderlay,
              this,
              true
            )
          }
          if (Z.webkit && Z.webkit < 420) {
            this.changeContentEvent.subscribe(d)
          }
          e = true
        }
      }
      function W () {
        const e = T.call(this)
        if (!e && Y) {
          this.sizeUnderlay()
        }
        this._underlayDeferred = false
        this.beforeShowEvent.unsubscribe(W)
      }
      function U () {
        if (this._underlayDeferred) {
          this.beforeShowEvent.unsubscribe(W)
          this._underlayDeferred = false
        }
        if (R) {
          this.cfg.unsubscribeFromConfigEvent('width', this.sizeUnderlay)
          this.cfg.unsubscribeFromConfigEvent('height', this.sizeUnderlay)
          this.changeContentEvent.unsubscribe(this.sizeUnderlay)
          this.changeContentEvent.unsubscribe(d)
          YAHOO.widget.Module.textResizeEvent.unsubscribe(
            this.sizeUnderlay,
            this,
            true
          )
          this.element.removeChild(R)
          this.underlay = null
        }
      }
      switch (c) {
        case 'shadow':
          F.removeClass(S, 'matte')
          F.addClass(S, 'shadow')
          break
        case 'matte':
          if (!X) {
            U.call(this)
          }
          F.removeClass(S, 'shadow')
          F.addClass(S, 'matte')
          break
        default:
          if (!X) {
            U.call(this)
          }
          F.removeClass(S, 'shadow')
          F.removeClass(S, 'matte')
          break
      }
      if (c == 'shadow' || (X && !R)) {
        if (this.cfg.getProperty('visible')) {
          const Q = T.call(this)
          if (!Q && Y) {
            this.sizeUnderlay()
          }
        } else {
          if (!this._underlayDeferred) {
            this.beforeShowEvent.subscribe(W)
            this._underlayDeferred = true
          }
        }
      }
    },
    configModal: function (R, Q, T) {
      const S = Q[0]
      if (S) {
        if (!this._hasModalityEventListeners) {
          this.subscribe('beforeShow', this.buildMask)
          this.subscribe('beforeShow', this.bringToTop)
          this.subscribe('beforeShow', this.showMask)
          this.subscribe('hide', this.hideMask)
          B.windowResizeEvent.subscribe(this.sizeMask, this, true)
          this._hasModalityEventListeners = true
        }
      } else {
        if (this._hasModalityEventListeners) {
          if (this.cfg.getProperty('visible')) {
            this.hideMask()
            this.removeMask()
          }
          this.unsubscribe('beforeShow', this.buildMask)
          this.unsubscribe('beforeShow', this.bringToTop)
          this.unsubscribe('beforeShow', this.showMask)
          this.unsubscribe('hide', this.hideMask)
          B.windowResizeEvent.unsubscribe(this.sizeMask, this)
          this._hasModalityEventListeners = false
        }
      }
    },
    removeMask: function () {
      const R = this.mask
      let Q
      if (R) {
        this.hideMask()
        Q = R.parentNode
        if (Q) {
          Q.removeChild(R)
        }
        this.mask = null
      }
    },
    configKeyListeners: function (T, Q, W) {
      const S = Q[0]
      let V
      let U
      let R
      if (S) {
        if (S instanceof Array) {
          U = S.length
          for (R = 0; R < U; R++) {
            V = S[R]
            if (!C.alreadySubscribed(this.showEvent, V.enable, V)) {
              this.showEvent.subscribe(V.enable, V, true)
            }
            if (!C.alreadySubscribed(this.hideEvent, V.disable, V)) {
              this.hideEvent.subscribe(V.disable, V, true)
              this.destroyEvent.subscribe(V.disable, V, true)
            }
          }
        } else {
          if (!C.alreadySubscribed(this.showEvent, S.enable, S)) {
            this.showEvent.subscribe(S.enable, S, true)
          }
          if (!C.alreadySubscribed(this.hideEvent, S.disable, S)) {
            this.hideEvent.subscribe(S.disable, S, true)
            this.destroyEvent.subscribe(S.disable, S, true)
          }
        }
      }
    },
    configHeight: function (T, R, U) {
      const Q = R[0]
      const S = this.innerElement
      F.setStyle(S, 'height', Q)
      this.cfg.refireEvent('iframe')
    },
    configWidth: function (T, Q, U) {
      const S = Q[0]
      const R = this.innerElement
      F.setStyle(R, 'width', S)
      this.cfg.refireEvent('iframe')
    },
    configzIndex: function (R, Q, T) {
      N.superclass.configzIndex.call(this, R, Q, T)
      if (this.mask || this.cfg.getProperty('modal') === true) {
        let S = F.getStyle(this.element, 'zIndex')
        if (!S || isNaN(S)) {
          S = 0
        }
        if (S === 0) {
          this.cfg.setProperty('zIndex', 1)
        } else {
          this.stackMask()
        }
      }
    },
    buildWrapper: function () {
      const S = this.element.parentNode
      const Q = this.element
      const R = document.createElement('div')
      R.className = N.CSS_PANEL_CONTAINER
      R.id = Q.id + '_c'
      if (S) {
        S.insertBefore(R, Q)
      }
      R.appendChild(Q)
      this.element = R
      this.innerElement = Q
      F.setStyle(this.innerElement, 'visibility', 'inherit')
    },
    sizeUnderlay: function () {
      const R = this.underlay
      let Q
      if (R) {
        Q = this.element
        R.style.width = Q.offsetWidth + 'px'
        R.style.height = Q.offsetHeight + 'px'
      }
    },
    registerDragDrop: function () {
      const R = this
      if (this.header) {
        if (!E) {
          return
        }
        const Q = this.cfg.getProperty('dragonly') === true
        this.dd = new E(this.element.id, this.id, { dragOnly: Q })
        if (!this.header.id) {
          this.header.id = this.id + '_h'
        }
        this.dd.startDrag = function () {
          let T, V, S, Y, X, W
          if (YAHOO.env.ua.ie == 6) {
            F.addClass(R.element, 'drag')
          }
          if (R.cfg.getProperty('constraintoviewport')) {
            const U = B.VIEWPORT_OFFSET
            T = R.element.offsetHeight
            V = R.element.offsetWidth
            S = F.getViewportWidth()
            Y = F.getViewportHeight()
            X = F.getDocumentScrollLeft()
            W = F.getDocumentScrollTop()
            if (T + U < Y) {
              this.minY = W + U
              this.maxY = W + Y - T - U
            } else {
              this.minY = W + U
              this.maxY = W + U
            }
            if (V + U < S) {
              this.minX = X + U
              this.maxX = X + S - V - U
            } else {
              this.minX = X + U
              this.maxX = X + U
            }
            this.constrainX = true
            this.constrainY = true
          } else {
            this.constrainX = false
            this.constrainY = false
          }
          R.dragEvent.fire('startDrag', arguments)
        }
        this.dd.onDrag = function () {
          R.syncPosition()
          R.cfg.refireEvent('iframe')
          if (this.platform == 'mac' && YAHOO.env.ua.gecko) {
            this.showMacGeckoScrollbars()
          }
          R.dragEvent.fire('onDrag', arguments)
        }
        this.dd.endDrag = function () {
          if (YAHOO.env.ua.ie == 6) {
            F.removeClass(R.element, 'drag')
          }
          R.dragEvent.fire('endDrag', arguments)
          R.moveEvent.fire(R.cfg.getProperty('xy'))
        }
        this.dd.setHandleElId(this.header.id)
        this.dd.addInvalidHandleType('INPUT')
        this.dd.addInvalidHandleType('SELECT')
        this.dd.addInvalidHandleType('TEXTAREA')
      }
    },
    buildMask: function () {
      let Q = this.mask
      if (!Q) {
        if (!H) {
          H = document.createElement('div')
          H.className = 'mask'
          H.innerHTML = '&#160;'
        }
        Q = H.cloneNode(true)
        Q.id = this.id + '_mask'
        document.body.insertBefore(Q, document.body.firstChild)
        this.mask = Q
        if (YAHOO.env.ua.gecko && this.platform == 'mac') {
          F.addClass(this.mask, 'block-scrollbars')
        }
        this.stackMask()
      }
    },
    hideMask: function () {
      if (this.cfg.getProperty('modal') && this.mask) {
        this.mask.style.display = 'none'
        this.hideMaskEvent.fire()
        F.removeClass(document.body, 'masked')
      }
    },
    showMask: function () {
      if (this.cfg.getProperty('modal') && this.mask) {
        F.addClass(document.body, 'masked')
        this.sizeMask()
        this.mask.style.display = 'block'
        this.showMaskEvent.fire()
      }
    },
    sizeMask: function () {
      if (this.mask) {
        this.mask.style.height = F.getDocumentHeight() + 'px'
        this.mask.style.width = F.getDocumentWidth() + 'px'
      }
    },
    stackMask: function () {
      if (this.mask) {
        const Q = F.getStyle(this.element, 'zIndex')
        if (!YAHOO.lang.isUndefined(Q) && !isNaN(Q)) {
          F.setStyle(this.mask, 'zIndex', Q - 1)
        }
      }
    },
    render: function (Q) {
      return N.superclass.render.call(this, Q, this.innerElement)
    },
    destroy: function () {
      B.windowResizeEvent.unsubscribe(this.sizeMask, this)
      this.removeMask()
      if (this.close) {
        P.purgeElement(this.close)
      }
      N.superclass.destroy.call(this)
    },
    toString: function () {
      return 'Panel ' + this.id
    }
  })
})();
(function () {
  YAHOO.widget.Dialog = function (L, K) {
    YAHOO.widget.Dialog.superclass.constructor.call(this, L, K)
  }
  const J = YAHOO.util.Event
  const I = YAHOO.util.CustomEvent
  const D = YAHOO.util.Dom
  const B = YAHOO.util.KeyListener
  const H = YAHOO.util.Connect
  const F = YAHOO.widget.Dialog
  const E = YAHOO.lang
  const A = {
    BEFORE_SUBMIT: 'beforeSubmit',
    SUBMIT: 'submit',
    MANUAL_SUBMIT: 'manualSubmit',
    ASYNC_SUBMIT: 'asyncSubmit',
    FORM_SUBMIT: 'formSubmit',
    CANCEL: 'cancel'
  }
  const G = {
    POST_METHOD: { key: 'postmethod', value: 'async' },
    BUTTONS: { key: 'buttons', value: 'none' },
    HIDEAFTERSUBMIT: { key: 'hideaftersubmit', value: true }
  }
  F.CSS_DIALOG = 'yui-dialog'
  function C () {
    const N = this._aButtons
    let L
    let M
    let K
    if (E.isArray(N)) {
      L = N.length
      if (L > 0) {
        K = L - 1
        do {
          M = N[K]
          if (YAHOO.widget.Button && M instanceof YAHOO.widget.Button) {
            M.destroy()
          } else {
            if (M.tagName.toUpperCase() == 'BUTTON') {
              J.purgeElement(M)
              J.purgeElement(M, false)
            }
          }
        } while (K--)
      }
    }
  }
  YAHOO.extend(F, YAHOO.widget.Panel, {
    form: null,
    initDefaultConfig: function () {
      F.superclass.initDefaultConfig.call(this)
      this.callback = { success: null, failure: null, argument: null }
      this.cfg.addProperty(G.POST_METHOD.key, {
        handler: this.configPostMethod,
        value: G.POST_METHOD.value,
        validator: function (K) {
          if (K != 'form' && K != 'async' && K != 'none' && K != 'manual') {
            return false
          } else {
            return true
          }
        }
      })
      this.cfg.addProperty(G.HIDEAFTERSUBMIT.key, {
        value: G.HIDEAFTERSUBMIT.value
      })
      this.cfg.addProperty(G.BUTTONS.key, {
        handler: this.configButtons,
        value: G.BUTTONS.value
      })
    },
    initEvents: function () {
      F.superclass.initEvents.call(this)
      const K = I.LIST
      this.beforeSubmitEvent = this.createEvent(A.BEFORE_SUBMIT)
      this.beforeSubmitEvent.signature = K
      this.submitEvent = this.createEvent(A.SUBMIT)
      this.submitEvent.signature = K
      this.manualSubmitEvent = this.createEvent(A.MANUAL_SUBMIT)
      this.manualSubmitEvent.signature = K
      this.asyncSubmitEvent = this.createEvent(A.ASYNC_SUBMIT)
      this.asyncSubmitEvent.signature = K
      this.formSubmitEvent = this.createEvent(A.FORM_SUBMIT)
      this.formSubmitEvent.signature = K
      this.cancelEvent = this.createEvent(A.CANCEL)
      this.cancelEvent.signature = K
    },
    init: function (L, K) {
      F.superclass.init.call(this, L)
      this.beforeInitEvent.fire(F)
      D.addClass(this.element, F.CSS_DIALOG)
      this.cfg.setProperty('visible', false)
      if (K) {
        this.cfg.applyConfig(K, true)
      }
      this.showEvent.subscribe(this.focusFirst, this, true)
      this.beforeHideEvent.subscribe(this.blurButtons, this, true)
      this.subscribe('changeBody', this.registerForm)
      this.initEvent.fire(F)
    },
    doSubmit: function () {
      const Q = this.form
      let O = false
      let N = false
      let P
      let K
      let M
      let L
      switch (this.cfg.getProperty('postmethod')) {
        case 'async':
          P = Q.elements
          K = P.length
          if (K > 0) {
            M = K - 1
            do {
              if (P[M].type == 'file') {
                O = true
                break
              }
            } while (M--)
          }
          if (O && YAHOO.env.ua.ie && this.isSecure) {
            N = true
          }
          L = (Q.getAttribute('method') || 'POST').toUpperCase()
          H.setForm(Q, O, N)
          H.asyncRequest(L, Q.getAttribute('action'), this.callback)
          this.asyncSubmitEvent.fire()
          break
        case 'form':
          Q.submit()
          this.formSubmitEvent.fire()
          break
        case 'none':
        case 'manual':
          this.manualSubmitEvent.fire()
          break
      }
    },
    registerForm: function () {
      let M = this.element.getElementsByTagName('form')[0]
      const L = this
      let K
      let N
      if (this.form) {
        if (this.form == M && D.isAncestor(this.element, this.form)) {
          return
        } else {
          J.purgeElement(this.form)
          this.form = null
        }
      }
      if (!M) {
        M = document.createElement('form')
        M.name = 'frm_' + this.id
        this.body.appendChild(M)
      }
      if (M) {
        this.form = M
        J.on(
          M,
          'submit',
          function (O) {
            J.stopEvent(O)
            this.submit()
            this.form.blur()
          },
          this,
          true
        )
        this.firstFormElement = (function () {
          let Q
          let P
          const O = M.elements.length
          for (Q = 0; Q < O; Q++) {
            P = M.elements[Q]
            if (P.focus && !P.disabled && P.type != 'hidden') {
              return P
            }
          }
          return null
        })()
        this.lastFormElement = (function () {
          let Q
          let P
          const O = M.elements.length
          for (Q = O - 1; Q >= 0; Q--) {
            P = M.elements[Q]
            if (P.focus && !P.disabled && P.type != 'hidden') {
              return P
            }
          }
          return null
        })()
        if (this.cfg.getProperty('modal')) {
          K = this.firstFormElement || this.firstButton
          if (K) {
            this.preventBackTab = new B(
              K,
              { shift: true, keys: 9 },
              { fn: L.focusLast, scope: L, correctScope: true }
            )
            this.showEvent.subscribe(
              this.preventBackTab.enable,
              this.preventBackTab,
              true
            )
            this.hideEvent.subscribe(
              this.preventBackTab.disable,
              this.preventBackTab,
              true
            )
          }
          N = this.lastButton || this.lastFormElement
          if (N) {
            this.preventTabOut = new B(
              N,
              { shift: false, keys: 9 },
              { fn: L.focusFirst, scope: L, correctScope: true }
            )
            this.showEvent.subscribe(
              this.preventTabOut.enable,
              this.preventTabOut,
              true
            )
            this.hideEvent.subscribe(
              this.preventTabOut.disable,
              this.preventTabOut,
              true
            )
          }
        }
      }
    },
    configClose: function (M, K, N) {
      const O = K[0]
      function L (Q, P) {
        P.cancel()
      }
      if (O) {
        if (!this.close) {
          this.close = document.createElement('div')
          D.addClass(this.close, 'container-close')
          this.close.innerHTML = '&#160;'
          this.innerElement.appendChild(this.close)
          J.on(this.close, 'click', L, this)
        } else {
          this.close.style.display = 'block'
        }
      } else {
        if (this.close) {
          this.close.style.display = 'none'
        }
      }
    },
    configButtons: function (U, T, O) {
      const P = YAHOO.widget.Button
      const W = T[0]
      const M = this.innerElement
      let V
      let R
      let L
      let S
      let Q
      let K
      let N
      C.call(this)
      this._aButtons = null
      if (E.isArray(W)) {
        Q = document.createElement('span')
        Q.className = 'button-group'
        S = W.length
        this._aButtons = []
        for (N = 0; N < S; N++) {
          V = W[N]
          if (P) {
            L = new P({ label: V.text, container: Q })
            R = L.get('element')
            if (V.isDefault) {
              L.addClass('default')
              this.defaultHtmlButton = R
            }
            if (E.isFunction(V.handler)) {
              L.set('onclick', { fn: V.handler, obj: this, scope: this })
            } else {
              if (E.isObject(V.handler) && E.isFunction(V.handler.fn)) {
                L.set('onclick', {
                  fn: V.handler.fn,
                  obj: !E.isUndefined(V.handler.obj) ? V.handler.obj : this,
                  scope: V.handler.scope || this
                })
              }
            }
            this._aButtons[this._aButtons.length] = L
          } else {
            R = document.createElement('button')
            R.setAttribute('type', 'button')
            if (V.isDefault) {
              R.className = 'default'
              this.defaultHtmlButton = R
            }
            R.innerHTML = V.text
            if (E.isFunction(V.handler)) {
              J.on(R, 'click', V.handler, this, true)
            } else {
              if (E.isObject(V.handler) && E.isFunction(V.handler.fn)) {
                J.on(
                  R,
                  'click',
                  V.handler.fn,
                  !E.isUndefined(V.handler.obj) ? V.handler.obj : this,
                  V.handler.scope || this
                )
              }
            }
            Q.appendChild(R)
            this._aButtons[this._aButtons.length] = R
          }
          V.htmlButton = R
          if (N === 0) {
            this.firstButton = R
          }
          if (N == S - 1) {
            this.lastButton = R
          }
        }
        this.setFooter(Q)
        K = this.footer
        if (D.inDocument(this.element) && !D.isAncestor(M, K)) {
          M.appendChild(K)
        }
        this.buttonSpan = Q
      } else {
        Q = this.buttonSpan
        K = this.footer
        if (Q && K) {
          K.removeChild(Q)
          this.buttonSpan = null
          this.firstButton = null
          this.lastButton = null
          this.defaultHtmlButton = null
        }
      }
      this.cfg.refireEvent('iframe')
      this.cfg.refireEvent('underlay')
    },
    getButtons: function () {
      const K = this._aButtons
      if (K) {
        return K
      }
    },
    focusFirst: function (N, L, P) {
      const M = this.firstFormElement
      let K
      if (L) {
        K = L[1]
        if (K) {
          J.stopEvent(K)
        }
      }
      if (M) {
        try {
          M.focus()
        } catch (O) {}
      } else {
        this.focusDefaultButton()
      }
    },
    focusLast: function (N, L, P) {
      const Q = this.cfg.getProperty('buttons')
      const M = this.lastFormElement
      let K
      if (L) {
        K = L[1]
        if (K) {
          J.stopEvent(K)
        }
      }
      if (Q && E.isArray(Q)) {
        this.focusLastButton()
      } else {
        if (M) {
          try {
            M.focus()
          } catch (O) {}
        }
      }
    },
    focusDefaultButton: function () {
      const K = this.defaultHtmlButton
      if (K) {
        try {
          K.focus()
        } catch (L) {}
      }
    },
    blurButtons: function () {
      const P = this.cfg.getProperty('buttons')
      let M
      let O
      let L
      let K
      if (P && E.isArray(P)) {
        M = P.length
        if (M > 0) {
          K = M - 1
          do {
            O = P[K]
            if (O) {
              L = O.htmlButton
              if (L) {
                try {
                  L.blur()
                } catch (N) {}
              }
            }
          } while (K--)
        }
      }
    },
    focusFirstButton: function () {
      const N = this.cfg.getProperty('buttons')
      let M
      let K
      if (N && E.isArray(N)) {
        M = N[0]
        if (M) {
          K = M.htmlButton
          if (K) {
            try {
              K.focus()
            } catch (L) {}
          }
        }
      }
    },
    focusLastButton: function () {
      const O = this.cfg.getProperty('buttons')
      let L
      let N
      let K
      if (O && E.isArray(O)) {
        L = O.length
        if (L > 0) {
          N = O[L - 1]
          if (N) {
            K = N.htmlButton
            if (K) {
              try {
                K.focus()
              } catch (M) {}
            }
          }
        }
      }
    },
    configPostMethod: function (L, K, M) {
      this.registerForm()
    },
    validate: function () {
      return true
    },
    submit: function () {
      if (this.validate()) {
        this.beforeSubmitEvent.fire()
        this.doSubmit()
        this.submitEvent.fire()
        if (this.cfg.getProperty('hideaftersubmit')) {
          this.hide()
        }
        return true
      } else {
        return false
      }
    },
    cancel: function () {
      this.cancelEvent.fire()
      this.hide()
    },
    getData: function () {
      const a = this.form
      let M
      let T
      let W
      let O
      let U
      let R
      let Q
      let L
      let X
      let N
      let Y
      let b
      let K
      let P
      let c
      let Z
      let V
      function S (e) {
        const d = e.tagName.toUpperCase()
        return (
          (d == 'INPUT' || d == 'TEXTAREA' || d == 'SELECT') && e.name == O
        )
      }
      if (a) {
        M = a.elements
        T = M.length
        W = {}
        for (Z = 0; Z < T; Z++) {
          O = M[Z].name
          U = D.getElementsBy(S, '*', a)
          R = U.length
          if (R > 0) {
            if (R == 1) {
              U = U[0]
              Q = U.type
              L = U.tagName.toUpperCase()
              switch (L) {
                case 'INPUT':
                  if (Q == 'checkbox') {
                    W[O] = U.checked
                  } else {
                    if (Q != 'radio') {
                      W[O] = U.value
                    }
                  }
                  break
                case 'TEXTAREA':
                  W[O] = U.value
                  break
                case 'SELECT':
                  X = U.options
                  N = X.length
                  Y = []
                  for (V = 0; V < N; V++) {
                    b = X[V]
                    if (b.selected) {
                      K = b.value
                      if (!K || K === '') {
                        K = b.text
                      }
                      Y[Y.length] = K
                    }
                  }
                  W[O] = Y
                  break
              }
            } else {
              Q = U[0].type
              switch (Q) {
                case 'radio':
                  for (V = 0; V < R; V++) {
                    P = U[V]
                    if (P.checked) {
                      W[O] = P.value
                      break
                    }
                  }
                  break
                case 'checkbox':
                  Y = []
                  for (V = 0; V < R; V++) {
                    c = U[V]
                    if (c.checked) {
                      Y[Y.length] = c.value
                    }
                  }
                  W[O] = Y
                  break
              }
            }
          }
        }
      }
      return W
    },
    destroy: function () {
      C.call(this)
      this._aButtons = null
      const K = this.element.getElementsByTagName('form')
      let L
      if (K.length > 0) {
        L = K[0]
        if (L) {
          J.purgeElement(L)
          if (L.parentNode) {
            L.parentNode.removeChild(L)
          }
          this.form = null
        }
      }
      F.superclass.destroy.call(this)
    },
    toString: function () {
      return 'Dialog ' + this.id
    }
  })
})();
(function () {
  YAHOO.widget.SimpleDialog = function (E, D) {
    YAHOO.widget.SimpleDialog.superclass.constructor.call(this, E, D)
  }
  const C = YAHOO.util.Dom
  const B = YAHOO.widget.SimpleDialog
  const A = {
    ICON: { key: 'icon', value: 'none', suppressEvent: true },
    TEXT: {
      key: 'text',
      value: '',
      suppressEvent: true,
      supercedes: ['icon']
    }
  }
  B.ICON_BLOCK = 'blckicon'
  B.ICON_ALARM = 'alrticon'
  B.ICON_HELP = 'hlpicon'
  B.ICON_INFO = 'infoicon'
  B.ICON_WARN = 'warnicon'
  B.ICON_TIP = 'tipicon'
  B.ICON_CSS_CLASSNAME = 'yui-icon'
  B.CSS_SIMPLEDIALOG = 'yui-simple-dialog'
  YAHOO.extend(B, YAHOO.widget.Dialog, {
    initDefaultConfig: function () {
      B.superclass.initDefaultConfig.call(this)
      this.cfg.addProperty(A.ICON.key, {
        handler: this.configIcon,
        value: A.ICON.value,
        suppressEvent: A.ICON.suppressEvent
      })
      this.cfg.addProperty(A.TEXT.key, {
        handler: this.configText,
        value: A.TEXT.value,
        suppressEvent: A.TEXT.suppressEvent,
        supercedes: A.TEXT.supercedes
      })
    },
    init: function (E, D) {
      B.superclass.init.call(this, E)
      this.beforeInitEvent.fire(B)
      C.addClass(this.element, B.CSS_SIMPLEDIALOG)
      this.cfg.queueProperty('postmethod', 'manual')
      if (D) {
        this.cfg.applyConfig(D, true)
      }
      this.beforeRenderEvent.subscribe(
        function () {
          if (!this.body) {
            this.setBody('')
          }
        },
        this,
        true
      )
      this.initEvent.fire(B)
    },
    registerForm: function () {
      B.superclass.registerForm.call(this)
      this.form.innerHTML +=
        '<input type="hidden" name="' + this.id + '" value=""/>'
    },
    configIcon: function (F, E, J) {
      const K = E[0]
      const D = this.body
      const I = B.ICON_CSS_CLASSNAME
      let H
      let G
      if (K && K != 'none') {
        H = C.getElementsByClassName(I, '*', D)
        if (H) {
          G = H.parentNode
          if (G) {
            G.removeChild(H)
            H = null
          }
        }
        if (K.indexOf('.') == -1) {
          H = document.createElement('span')
          H.className = I + ' ' + K
          H.innerHTML = '&#160;'
        } else {
          H = document.createElement('img')
          H.src = this.imageRoot + K
          H.className = I
        }
        if (H) {
          D.insertBefore(H, D.firstChild)
        }
      }
    },
    configText: function (E, D, F) {
      const G = D[0]
      if (G) {
        this.setBody(G)
        this.cfg.refireEvent('icon')
      }
    },
    toString: function () {
      return 'SimpleDialog ' + this.id
    }
  })
})();
(function () {
  YAHOO.widget.ContainerEffect = function (F, I, H, E, G) {
    if (!G) {
      G = YAHOO.util.Anim
    }
    this.overlay = F
    this.attrIn = I
    this.attrOut = H
    this.targetElement = E || F.element
    this.animClass = G
  }
  const B = YAHOO.util.Dom
  const D = YAHOO.util.CustomEvent
  const C = YAHOO.util.Easing
  const A = YAHOO.widget.ContainerEffect
  A.FADE = function (E, G) {
    const I = {
      attributes: { opacity: { from: 0, to: 1 } },
      duration: G,
      method: C.easeIn
    }
    const F = {
      attributes: { opacity: { to: 0 } },
      duration: G,
      method: C.easeOut
    }
    const H = new A(E, I, F, E.element)
    H.handleUnderlayStart = function () {
      const K = this.overlay.underlay
      if (K && YAHOO.env.ua.ie) {
        const J = K.filters && K.filters.length > 0
        if (J) {
          B.addClass(E.element, 'yui-effect-fade')
        }
      }
    }
    H.handleUnderlayComplete = function () {
      const J = this.overlay.underlay
      if (J && YAHOO.env.ua.ie) {
        B.removeClass(E.element, 'yui-effect-fade')
      }
    }
    H.handleStartAnimateIn = function (K, J, L) {
      B.addClass(L.overlay.element, 'hide-select')
      if (!L.overlay.underlay) {
        L.overlay.cfg.refireEvent('underlay')
      }
      L.handleUnderlayStart()
      B.setStyle(L.overlay.element, 'visibility', 'visible')
      B.setStyle(L.overlay.element, 'opacity', 0)
    }
    H.handleCompleteAnimateIn = function (K, J, L) {
      B.removeClass(L.overlay.element, 'hide-select')
      if (L.overlay.element.style.filter) {
        L.overlay.element.style.filter = null
      }
      L.handleUnderlayComplete()
      L.overlay.cfg.refireEvent('iframe')
      L.animateInCompleteEvent.fire()
    }
    H.handleStartAnimateOut = function (K, J, L) {
      B.addClass(L.overlay.element, 'hide-select')
      L.handleUnderlayStart()
    }
    H.handleCompleteAnimateOut = function (K, J, L) {
      B.removeClass(L.overlay.element, 'hide-select')
      if (L.overlay.element.style.filter) {
        L.overlay.element.style.filter = null
      }
      B.setStyle(L.overlay.element, 'visibility', 'hidden')
      B.setStyle(L.overlay.element, 'opacity', 1)
      L.handleUnderlayComplete()
      L.overlay.cfg.refireEvent('iframe')
      L.animateOutCompleteEvent.fire()
    }
    H.init()
    return H
  }
  A.SLIDE = function (G, I) {
    const F = G.cfg.getProperty('x') || B.getX(G.element)
    const K = G.cfg.getProperty('y') || B.getY(G.element)
    const J = B.getClientWidth()
    const H = G.element.offsetWidth
    const E = new A(
      G,
      {
        attributes: { points: { to: [F, K] } },
        duration: I,
        method: C.easeIn
      },
      {
        attributes: { points: { to: [J + 25, K] } },
        duration: I,
        method: C.easeOut
      },
      G.element,
      YAHOO.util.Motion
    )
    E.handleStartAnimateIn = function (M, L, N) {
      N.overlay.element.style.left = -25 - H + 'px'
      N.overlay.element.style.top = K + 'px'
    }
    E.handleTweenAnimateIn = function (O, N, P) {
      const Q = B.getXY(P.overlay.element)
      const M = Q[0]
      const L = Q[1]
      if (B.getStyle(P.overlay.element, 'visibility') == 'hidden' && M < F) {
        B.setStyle(P.overlay.element, 'visibility', 'visible')
      }
      P.overlay.cfg.setProperty('xy', [M, L], true)
      P.overlay.cfg.refireEvent('iframe')
    }
    E.handleCompleteAnimateIn = function (M, L, N) {
      N.overlay.cfg.setProperty('xy', [F, K], true)
      N.startX = F
      N.startY = K
      N.overlay.cfg.refireEvent('iframe')
      N.animateInCompleteEvent.fire()
    }
    E.handleStartAnimateOut = function (M, L, P) {
      const N = B.getViewportWidth()
      const Q = B.getXY(P.overlay.element)
      const O = Q[1]
      P.animOut.attributes.points.to = [N + 25, O]
    }
    E.handleTweenAnimateOut = function (N, M, O) {
      const Q = B.getXY(O.overlay.element)
      const L = Q[0]
      const P = Q[1]
      O.overlay.cfg.setProperty('xy', [L, P], true)
      O.overlay.cfg.refireEvent('iframe')
    }
    E.handleCompleteAnimateOut = function (M, L, N) {
      B.setStyle(N.overlay.element, 'visibility', 'hidden')
      N.overlay.cfg.setProperty('xy', [F, K])
      N.animateOutCompleteEvent.fire()
    }
    E.init()
    return E
  }
  A.prototype = {
    init: function () {
      this.beforeAnimateInEvent = this.createEvent('beforeAnimateIn')
      this.beforeAnimateInEvent.signature = D.LIST
      this.beforeAnimateOutEvent = this.createEvent('beforeAnimateOut')
      this.beforeAnimateOutEvent.signature = D.LIST
      this.animateInCompleteEvent = this.createEvent('animateInComplete')
      this.animateInCompleteEvent.signature = D.LIST
      this.animateOutCompleteEvent = this.createEvent('animateOutComplete')
      this.animateOutCompleteEvent.signature = D.LIST
      this.animIn = new this.animClass(
        this.targetElement,
        this.attrIn.attributes,
        this.attrIn.duration,
        this.attrIn.method
      )
      this.animIn.onStart.subscribe(this.handleStartAnimateIn, this)
      this.animIn.onTween.subscribe(this.handleTweenAnimateIn, this)
      this.animIn.onComplete.subscribe(this.handleCompleteAnimateIn, this)
      this.animOut = new this.animClass(
        this.targetElement,
        this.attrOut.attributes,
        this.attrOut.duration,
        this.attrOut.method
      )
      this.animOut.onStart.subscribe(this.handleStartAnimateOut, this)
      this.animOut.onTween.subscribe(this.handleTweenAnimateOut, this)
      this.animOut.onComplete.subscribe(this.handleCompleteAnimateOut, this)
    },
    animateIn: function () {
      this.beforeAnimateInEvent.fire()
      this.animIn.animate()
    },
    animateOut: function () {
      this.beforeAnimateOutEvent.fire()
      this.animOut.animate()
    },
    handleStartAnimateIn: function (F, E, G) {},
    handleTweenAnimateIn: function (F, E, G) {},
    handleCompleteAnimateIn: function (F, E, G) {},
    handleStartAnimateOut: function (F, E, G) {},
    handleTweenAnimateOut: function (F, E, G) {},
    handleCompleteAnimateOut: function (F, E, G) {},
    toString: function () {
      let E = 'ContainerEffect'
      if (this.overlay) {
        E += ' [' + this.overlay.toString() + ']'
      }
      return E
    }
  }
  YAHOO.lang.augmentProto(A, YAHOO.util.EventProvider)
})()
YAHOO.register('container', YAHOO.widget.Module, {
  version: '2.5.2',
  build: '1076'
})
