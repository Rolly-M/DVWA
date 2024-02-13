/*
Copyright (c) 2008, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.5.2
*/
if (typeof YAHOO === 'undefined' || !YAHOO) {
  var YAHOO = {}
}
YAHOO.namespace = function () {
  const A = arguments
  let E = null
  let C
  let B
  let D
  for (C = 0; C < A.length; C = C + 1) {
    D = A[C].split('.')
    E = YAHOO
    for (B = D[0] == 'YAHOO' ? 1 : 0; B < D.length; B = B + 1) {
      E[D[B]] = E[D[B]] || {}
      E = E[D[B]]
    }
  }
  return E
}
YAHOO.log = function (D, A, C) {
  const B = YAHOO.widget.Logger
  if (B && B.log) {
    return B.log(D, A, C)
  } else {
    return false
  }
}
YAHOO.register = function (A, E, D) {
  const I = YAHOO.env.modules
  if (!I[A]) {
    I[A] = { versions: [], builds: [] }
  }
  const B = I[A]
  const H = D.version
  const G = D.build
  const F = YAHOO.env.listeners
  B.name = A
  B.version = H
  B.build = G
  B.versions.push(H)
  B.builds.push(G)
  B.mainClass = E
  for (let C = 0; C < F.length; C = C + 1) {
    F[C](B)
  }
  if (E) {
    E.VERSION = H
    E.BUILD = G
  } else {
    YAHOO.log('mainClass is undefined for module ' + A, 'warn')
  }
}
YAHOO.env = YAHOO.env || { modules: [], listeners: [] }
YAHOO.env.getVersion = function (A) {
  return YAHOO.env.modules[A] || null
}
YAHOO.env.ua = (function () {
  const C = { ie: 0, opera: 0, gecko: 0, webkit: 0, mobile: null, air: 0 }
  const B = navigator.userAgent
  let A
  if (/KHTML/.test(B)) {
    C.webkit = 1
  }
  A = B.match(/AppleWebKit\/([^\s]*)/)
  if (A && A[1]) {
    C.webkit = parseFloat(A[1])
    if (/ Mobile\//.test(B)) {
      C.mobile = 'Apple'
    } else {
      A = B.match(/NokiaN[^\/]*/)
      if (A) {
        C.mobile = A[0]
      }
    }
    A = B.match(/AdobeAIR\/([^\s]*)/)
    if (A) {
      C.air = A[0]
    }
  }
  if (!C.webkit) {
    A = B.match(/Opera[\s\/]([^\s]*)/)
    if (A && A[1]) {
      C.opera = parseFloat(A[1])
      A = B.match(/Opera Mini[^;]*/)
      if (A) {
        C.mobile = A[0]
      }
    } else {
      A = B.match(/MSIE\s([^;]*)/)
      if (A && A[1]) {
        C.ie = parseFloat(A[1])
      } else {
        A = B.match(/Gecko\/([^\s]*)/)
        if (A) {
          C.gecko = 1
          A = B.match(/rv:([^\s\)]*)/)
          if (A && A[1]) {
            C.gecko = parseFloat(A[1])
          }
        }
      }
    }
  }
  return C
})();
(function () {
  YAHOO.namespace('util', 'widget', 'example')
  if (typeof YAHOO_config !== 'undefined') {
    const B = YAHOO_config.listener
    const A = YAHOO.env.listeners
    let D = true
    let C
    if (B) {
      for (C = 0; C < A.length; C = C + 1) {
        if (A[C] == B) {
          D = false
          break
        }
      }
      if (D) {
        A.push(B)
      }
    }
  }
})()
YAHOO.lang = YAHOO.lang || {};
(function () {
  const A = YAHOO.lang
  const C = ['toString', 'valueOf']
  const B = {
    isArray: function (D) {
      if (D) {
        return A.isNumber(D.length) && A.isFunction(D.splice)
      }
      return false
    },
    isBoolean: function (D) {
      return typeof D === 'boolean'
    },
    isFunction: function (D) {
      return typeof D === 'function'
    },
    isNull: function (D) {
      return D === null
    },
    isNumber: function (D) {
      return typeof D === 'number' && isFinite(D)
    },
    isObject: function (D) {
      return (D && (typeof D === 'object' || A.isFunction(D))) || false
    },
    isString: function (D) {
      return typeof D === 'string'
    },
    isUndefined: function (D) {
      return typeof D === 'undefined'
    },
    _IEEnumFix: YAHOO.env.ua.ie
      ? function (F, E) {
        for (let D = 0; D < C.length; D = D + 1) {
          const H = C[D]
          const G = E[H]
          if (A.isFunction(G) && G != Object.prototype[H]) {
            F[H] = G
          }
        }
      }
      : function () {},
    extend: function (H, I, G) {
      if (!I || !H) {
        throw new Error(
          'extend failed, please check that ' +
            'all dependencies are included.'
        )
      }
      const E = function () {}
      E.prototype = I.prototype
      H.prototype = new E()
      H.prototype.constructor = H
      H.superclass = I.prototype
      if (I.prototype.constructor == Object.prototype.constructor) {
        I.prototype.constructor = I
      }
      if (G) {
        for (const D in G) {
          if (A.hasOwnProperty(G, D)) {
            H.prototype[D] = G[D]
          }
        }
        A._IEEnumFix(H.prototype, G)
      }
    },
    augmentObject: function (H, G) {
      if (!G || !H) {
        throw new Error('Absorb failed, verify dependencies.')
      }
      const D = arguments
      let F
      let I
      const E = D[2]
      if (E && E !== true) {
        for (F = 2; F < D.length; F = F + 1) {
          H[D[F]] = G[D[F]]
        }
      } else {
        for (I in G) {
          if (E || !(I in H)) {
            H[I] = G[I]
          }
        }
        A._IEEnumFix(H, G)
      }
    },
    augmentProto: function (G, F) {
      if (!F || !G) {
        throw new Error('Augment failed, verify dependencies.')
      }
      const D = [G.prototype, F.prototype]
      for (let E = 2; E < arguments.length; E = E + 1) {
        D.push(arguments[E])
      }
      A.augmentObject.apply(this, D)
    },
    dump: function (D, I) {
      let F
      let H
      const K = []
      const L = '{...}'
      const E = 'f(){...}'
      const J = ', '
      const G = ' => '
      if (!A.isObject(D)) {
        return D + ''
      } else {
        if (D instanceof Date || ('nodeType' in D && 'tagName' in D)) {
          return D
        } else {
          if (A.isFunction(D)) {
            return E
          }
        }
      }
      I = A.isNumber(I) ? I : 3
      if (A.isArray(D)) {
        K.push('[')
        for (F = 0, H = D.length; F < H; F = F + 1) {
          if (A.isObject(D[F])) {
            K.push(I > 0 ? A.dump(D[F], I - 1) : L)
          } else {
            K.push(D[F])
          }
          K.push(J)
        }
        if (K.length > 1) {
          K.pop()
        }
        K.push(']')
      } else {
        K.push('{')
        for (F in D) {
          if (A.hasOwnProperty(D, F)) {
            K.push(F + G)
            if (A.isObject(D[F])) {
              K.push(I > 0 ? A.dump(D[F], I - 1) : L)
            } else {
              K.push(D[F])
            }
            K.push(J)
          }
        }
        if (K.length > 1) {
          K.pop()
        }
        K.push('}')
      }
      return K.join('')
    },
    substitute: function (S, E, L) {
      let I
      let H
      let G
      let O
      let P
      let R
      const N = []
      let F
      const J = 'dump'
      const M = ' '
      const D = '{'
      const Q = '}'
      for (;;) {
        I = S.lastIndexOf(D)
        if (I < 0) {
          break
        }
        H = S.indexOf(Q, I)
        if (I + 1 >= H) {
          break
        }
        F = S.substring(I + 1, H)
        O = F
        R = null
        G = O.indexOf(M)
        if (G > -1) {
          R = O.substring(G + 1)
          O = O.substring(0, G)
        }
        P = E[O]
        if (L) {
          P = L(O, P, R)
        }
        if (A.isObject(P)) {
          if (A.isArray(P)) {
            P = A.dump(P, parseInt(R, 10))
          } else {
            R = R || ''
            const K = R.indexOf(J)
            if (K > -1) {
              R = R.substring(4)
            }
            if (P.toString === Object.prototype.toString || K > -1) {
              P = A.dump(P, parseInt(R, 10))
            } else {
              P = P.toString()
            }
          }
        } else {
          if (!A.isString(P) && !A.isNumber(P)) {
            P = '~-' + N.length + '-~'
            N[N.length] = F
          }
        }
        S = S.substring(0, I) + P + S.substring(H + 1)
      }
      for (I = N.length - 1; I >= 0; I = I - 1) {
        S = S.replace(new RegExp('~-' + I + '-~'), '{' + N[I] + '}', 'g')
      }
      return S
    },
    trim: function (D) {
      try {
        return D.replace(/^\s+|\s+$/g, '')
      } catch (E) {
        return D
      }
    },
    merge: function () {
      const G = {}
      const E = arguments
      for (let F = 0, D = E.length; F < D; F = F + 1) {
        A.augmentObject(G, E[F], true)
      }
      return G
    },
    later: function (K, E, L, G, H) {
      K = K || 0
      E = E || {}
      let F = L
      let J = G
      let I
      let D
      if (A.isString(L)) {
        F = E[L]
      }
      if (!F) {
        throw new TypeError('method undefined')
      }
      if (!A.isArray(J)) {
        J = [G]
      }
      I = function () {
        F.apply(E, J)
      }
      D = H ? setInterval(I, K) : setTimeout(I, K)
      return {
        interval: H,
        cancel: function () {
          if (this.interval) {
            clearInterval(D)
          } else {
            clearTimeout(D)
          }
        }
      }
    },
    isValue: function (D) {
      return A.isObject(D) || A.isString(D) || A.isNumber(D) || A.isBoolean(D)
    }
  }
  A.hasOwnProperty = Object.prototype.hasOwnProperty
    ? function (D, E) {
      return D && D.hasOwnProperty(E)
    }
    : function (D, E) {
      return !A.isUndefined(D[E]) && D.constructor.prototype[E] !== D[E]
    }
  B.augmentObject(A, B, true)
  YAHOO.util.Lang = A
  A.augment = A.augmentProto
  YAHOO.augment = A.augmentProto
  YAHOO.extend = A.extend
})()
YAHOO.register('yahoo', YAHOO, { version: '2.5.2', build: '1076' });
(function () {
  const B = YAHOO.util
  let K
  let I
  const J = {}
  const F = {}
  const M = window.document
  YAHOO.env._id_counter = YAHOO.env._id_counter || 0
  const C = YAHOO.env.ua.opera
  const L = YAHOO.env.ua.webkit
  const A = YAHOO.env.ua.gecko
  const G = YAHOO.env.ua.ie
  const E = {
    HYPHEN: /(-[a-z])/i,
    ROOT_TAG: /^body|html$/i,
    OP_SCROLL: /^(?:inline|table-row)$/i
  }
  const N = function (P) {
    if (!E.HYPHEN.test(P)) {
      return P
    }
    if (J[P]) {
      return J[P]
    }
    let Q = P
    while (E.HYPHEN.exec(Q)) {
      Q = Q.replace(RegExp.$1, RegExp.$1.substr(1).toUpperCase())
    }
    J[P] = Q
    return Q
  }
  const O = function (Q) {
    let P = F[Q]
    if (!P) {
      P = new RegExp('(?:^|\\s+)' + Q + '(?:\\s+|$)')
      F[Q] = P
    }
    return P
  }
  if (M.defaultView && M.defaultView.getComputedStyle) {
    K = function (P, S) {
      let R = null
      if (S == 'float') {
        S = 'cssFloat'
      }
      const Q = P.ownerDocument.defaultView.getComputedStyle(P, '')
      if (Q) {
        R = Q[N(S)]
      }
      return P.style[S] || R
    }
  } else {
    if (M.documentElement.currentStyle && G) {
      K = function (P, R) {
        switch (N(R)) {
          case 'opacity':
            var T = 100
            try {
              T = P.filters['DXImageTransform.Microsoft.Alpha'].opacity
            } catch (S) {
              try {
                T = P.filters('alpha').opacity
              } catch (S) {}
            }
            return T / 100
          case 'float':
            R = 'styleFloat'
          default:
            var Q = P.currentStyle ? P.currentStyle[R] : null
            return P.style[R] || Q
        }
      }
    } else {
      K = function (P, Q) {
        return P.style[Q]
      }
    }
  }
  if (G) {
    I = function (P, Q, R) {
      switch (Q) {
        case 'opacity':
          if (YAHOO.lang.isString(P.style.filter)) {
            P.style.filter = 'alpha(opacity=' + R * 100 + ')'
            if (!P.currentStyle || !P.currentStyle.hasLayout) {
              P.style.zoom = 1
            }
          }
          break
        case 'float':
          Q = 'styleFloat'
        default:
          P.style[Q] = R
      }
    }
  } else {
    I = function (P, Q, R) {
      if (Q == 'float') {
        Q = 'cssFloat'
      }
      P.style[Q] = R
    }
  }
  const D = function (P, Q) {
    return P && P.nodeType == 1 && (!Q || Q(P))
  }
  YAHOO.util.Dom = {
    get: function (R) {
      if (R && (R.nodeType || R.item)) {
        return R
      }
      if (YAHOO.lang.isString(R) || !R) {
        return M.getElementById(R)
      }
      if (R.length !== undefined) {
        const S = []
        for (let Q = 0, P = R.length; Q < P; ++Q) {
          S[S.length] = B.Dom.get(R[Q])
        }
        return S
      }
      return R
    },
    getStyle: function (P, R) {
      R = N(R)
      const Q = function (S) {
        return K(S, R)
      }
      return B.Dom.batch(P, Q, B.Dom, true)
    },
    setStyle: function (P, R, S) {
      R = N(R)
      const Q = function (T) {
        I(T, R, S)
      }
      B.Dom.batch(P, Q, B.Dom, true)
    },
    getXY: function (P) {
      const Q = function (R) {
        if (
          (R.parentNode === null ||
            R.offsetParent === null ||
            this.getStyle(R, 'display') == 'none') &&
          R != R.ownerDocument.body
        ) {
          return false
        }
        return H(R)
      }
      return B.Dom.batch(P, Q, B.Dom, true)
    },
    getX: function (P) {
      const Q = function (R) {
        return B.Dom.getXY(R)[0]
      }
      return B.Dom.batch(P, Q, B.Dom, true)
    },
    getY: function (P) {
      const Q = function (R) {
        return B.Dom.getXY(R)[1]
      }
      return B.Dom.batch(P, Q, B.Dom, true)
    },
    setXY: function (P, S, R) {
      const Q = function (V) {
        let U = this.getStyle(V, 'position')
        if (U == 'static') {
          this.setStyle(V, 'position', 'relative')
          U = 'relative'
        }
        const X = this.getXY(V)
        if (X === false) {
          return false
        }
        const W = [
          parseInt(this.getStyle(V, 'left'), 10),
          parseInt(this.getStyle(V, 'top'), 10)
        ]
        if (isNaN(W[0])) {
          W[0] = U == 'relative' ? 0 : V.offsetLeft
        }
        if (isNaN(W[1])) {
          W[1] = U == 'relative' ? 0 : V.offsetTop
        }
        if (S[0] !== null) {
          V.style.left = S[0] - X[0] + W[0] + 'px'
        }
        if (S[1] !== null) {
          V.style.top = S[1] - X[1] + W[1] + 'px'
        }
        if (!R) {
          const T = this.getXY(V)
          if (
            (S[0] !== null && T[0] != S[0]) ||
            (S[1] !== null && T[1] != S[1])
          ) {
            this.setXY(V, S, true)
          }
        }
      }
      B.Dom.batch(P, Q, B.Dom, true)
    },
    setX: function (Q, P) {
      B.Dom.setXY(Q, [P, null])
    },
    setY: function (P, Q) {
      B.Dom.setXY(P, [null, Q])
    },
    getRegion: function (P) {
      const Q = function (R) {
        if (
          (R.parentNode === null ||
            R.offsetParent === null ||
            this.getStyle(R, 'display') == 'none') &&
          R != R.ownerDocument.body
        ) {
          return false
        }
        const S = B.Region.getRegion(R)
        return S
      }
      return B.Dom.batch(P, Q, B.Dom, true)
    },
    getClientWidth: function () {
      return B.Dom.getViewportWidth()
    },
    getClientHeight: function () {
      return B.Dom.getViewportHeight()
    },
    getElementsByClassName: function (T, X, U, V) {
      X = X || '*'
      U = U ? B.Dom.get(U) : null || M
      if (!U) {
        return []
      }
      const Q = []
      const P = U.getElementsByTagName(X)
      const W = O(T)
      for (let R = 0, S = P.length; R < S; ++R) {
        if (W.test(P[R].className)) {
          Q[Q.length] = P[R]
          if (V) {
            V.call(P[R], P[R])
          }
        }
      }
      return Q
    },
    hasClass: function (R, Q) {
      const P = O(Q)
      const S = function (T) {
        return P.test(T.className)
      }
      return B.Dom.batch(R, S, B.Dom, true)
    },
    addClass: function (Q, P) {
      const R = function (S) {
        if (this.hasClass(S, P)) {
          return false
        }
        S.className = YAHOO.lang.trim([S.className, P].join(' '))
        return true
      }
      return B.Dom.batch(Q, R, B.Dom, true)
    },
    removeClass: function (R, Q) {
      const P = O(Q)
      const S = function (T) {
        if (!Q || !this.hasClass(T, Q)) {
          return false
        }
        const U = T.className
        T.className = U.replace(P, ' ')
        if (this.hasClass(T, Q)) {
          this.removeClass(T, Q)
        }
        T.className = YAHOO.lang.trim(T.className)
        return true
      }
      return B.Dom.batch(R, S, B.Dom, true)
    },
    replaceClass: function (S, Q, P) {
      if (!P || Q === P) {
        return false
      }
      const R = O(Q)
      const T = function (U) {
        if (!this.hasClass(U, Q)) {
          this.addClass(U, P)
          return true
        }
        U.className = U.className.replace(R, ' ' + P + ' ')
        if (this.hasClass(U, Q)) {
          this.replaceClass(U, Q, P)
        }
        U.className = YAHOO.lang.trim(U.className)
        return true
      }
      return B.Dom.batch(S, T, B.Dom, true)
    },
    generateId: function (P, R) {
      R = R || 'yui-gen'
      const Q = function (S) {
        if (S && S.id) {
          return S.id
        }
        const T = R + YAHOO.env._id_counter++
        if (S) {
          S.id = T
        }
        return T
      }
      return B.Dom.batch(P, Q, B.Dom, true) || Q.apply(B.Dom, arguments)
    },
    isAncestor: function (P, Q) {
      P = B.Dom.get(P)
      Q = B.Dom.get(Q)
      if (!P || !Q) {
        return false
      }
      if (P.contains && Q.nodeType && !L) {
        return P.contains(Q)
      } else {
        if (P.compareDocumentPosition && Q.nodeType) {
          return !!(P.compareDocumentPosition(Q) & 16)
        } else {
          if (Q.nodeType) {
            return !!this.getAncestorBy(Q, function (R) {
              return R == P
            })
          }
        }
      }
      return false
    },
    inDocument: function (P) {
      return this.isAncestor(M.documentElement, P)
    },
    getElementsBy: function (W, Q, R, T) {
      Q = Q || '*'
      R = R ? B.Dom.get(R) : null || M
      if (!R) {
        return []
      }
      const S = []
      const V = R.getElementsByTagName(Q)
      for (let U = 0, P = V.length; U < P; ++U) {
        if (W(V[U])) {
          S[S.length] = V[U]
          if (T) {
            T(V[U])
          }
        }
      }
      return S
    },
    batch: function (T, W, V, R) {
      T = T && (T.tagName || T.item) ? T : B.Dom.get(T)
      if (!T || !W) {
        return false
      }
      const S = R ? V : window
      if (T.tagName || T.length === undefined) {
        return W.call(S, T, V)
      }
      const U = []
      for (let Q = 0, P = T.length; Q < P; ++Q) {
        U[U.length] = W.call(S, T[Q], V)
      }
      return U
    },
    getDocumentHeight: function () {
      const Q =
        M.compatMode != 'CSS1Compat'
          ? M.body.scrollHeight
          : M.documentElement.scrollHeight
      const P = Math.max(Q, B.Dom.getViewportHeight())
      return P
    },
    getDocumentWidth: function () {
      const Q =
        M.compatMode != 'CSS1Compat'
          ? M.body.scrollWidth
          : M.documentElement.scrollWidth
      const P = Math.max(Q, B.Dom.getViewportWidth())
      return P
    },
    getViewportHeight: function () {
      let P = self.innerHeight
      const Q = M.compatMode
      if ((Q || G) && !C) {
        P =
          Q == 'CSS1Compat'
            ? M.documentElement.clientHeight
            : M.body.clientHeight
      }
      return P
    },
    getViewportWidth: function () {
      let P = self.innerWidth
      const Q = M.compatMode
      if (Q || G) {
        P =
          Q == 'CSS1Compat'
            ? M.documentElement.clientWidth
            : M.body.clientWidth
      }
      return P
    },
    getAncestorBy: function (P, Q) {
      while ((P = P.parentNode)) {
        if (D(P, Q)) {
          return P
        }
      }
      return null
    },
    getAncestorByClassName: function (Q, P) {
      Q = B.Dom.get(Q)
      if (!Q) {
        return null
      }
      const R = function (S) {
        return B.Dom.hasClass(S, P)
      }
      return B.Dom.getAncestorBy(Q, R)
    },
    getAncestorByTagName: function (Q, P) {
      Q = B.Dom.get(Q)
      if (!Q) {
        return null
      }
      const R = function (S) {
        return S.tagName && S.tagName.toUpperCase() == P.toUpperCase()
      }
      return B.Dom.getAncestorBy(Q, R)
    },
    getPreviousSiblingBy: function (P, Q) {
      while (P) {
        P = P.previousSibling
        if (D(P, Q)) {
          return P
        }
      }
      return null
    },
    getPreviousSibling: function (P) {
      P = B.Dom.get(P)
      if (!P) {
        return null
      }
      return B.Dom.getPreviousSiblingBy(P)
    },
    getNextSiblingBy: function (P, Q) {
      while (P) {
        P = P.nextSibling
        if (D(P, Q)) {
          return P
        }
      }
      return null
    },
    getNextSibling: function (P) {
      P = B.Dom.get(P)
      if (!P) {
        return null
      }
      return B.Dom.getNextSiblingBy(P)
    },
    getFirstChildBy: function (P, R) {
      const Q = D(P.firstChild, R) ? P.firstChild : null
      return Q || B.Dom.getNextSiblingBy(P.firstChild, R)
    },
    getFirstChild: function (P, Q) {
      P = B.Dom.get(P)
      if (!P) {
        return null
      }
      return B.Dom.getFirstChildBy(P)
    },
    getLastChildBy: function (P, R) {
      if (!P) {
        return null
      }
      const Q = D(P.lastChild, R) ? P.lastChild : null
      return Q || B.Dom.getPreviousSiblingBy(P.lastChild, R)
    },
    getLastChild: function (P) {
      P = B.Dom.get(P)
      return B.Dom.getLastChildBy(P)
    },
    getChildrenBy: function (Q, S) {
      const R = B.Dom.getFirstChildBy(Q, S)
      const P = R ? [R] : []
      B.Dom.getNextSiblingBy(R, function (T) {
        if (!S || S(T)) {
          P[P.length] = T
        }
        return false
      })
      return P
    },
    getChildren: function (P) {
      P = B.Dom.get(P)
      if (!P) {
      }
      return B.Dom.getChildrenBy(P)
    },
    getDocumentScrollLeft: function (P) {
      P = P || M
      return Math.max(P.documentElement.scrollLeft, P.body.scrollLeft)
    },
    getDocumentScrollTop: function (P) {
      P = P || M
      return Math.max(P.documentElement.scrollTop, P.body.scrollTop)
    },
    insertBefore: function (Q, P) {
      Q = B.Dom.get(Q)
      P = B.Dom.get(P)
      if (!Q || !P || !P.parentNode) {
        return null
      }
      return P.parentNode.insertBefore(Q, P)
    },
    insertAfter: function (Q, P) {
      Q = B.Dom.get(Q)
      P = B.Dom.get(P)
      if (!Q || !P || !P.parentNode) {
        return null
      }
      if (P.nextSibling) {
        return P.parentNode.insertBefore(Q, P.nextSibling)
      } else {
        return P.parentNode.appendChild(Q)
      }
    },
    getClientRegion: function () {
      const R = B.Dom.getDocumentScrollTop()
      const Q = B.Dom.getDocumentScrollLeft()
      const S = B.Dom.getViewportWidth() + Q
      const P = B.Dom.getViewportHeight() + R
      return new B.Region(R, S, P, Q)
    }
  }
  var H = (function () {
    if (M.documentElement.getBoundingClientRect) {
      return function (Q) {
        const R = Q.getBoundingClientRect()
        const P = Q.ownerDocument
        return [
          R.left + B.Dom.getDocumentScrollLeft(P),
          R.top + B.Dom.getDocumentScrollTop(P)
        ]
      }
    } else {
      return function (R) {
        const S = [R.offsetLeft, R.offsetTop]
        let Q = R.offsetParent
        let P =
          L &&
          B.Dom.getStyle(R, 'position') == 'absolute' &&
          R.offsetParent == R.ownerDocument.body
        if (Q != R) {
          while (Q) {
            S[0] += Q.offsetLeft
            S[1] += Q.offsetTop
            if (!P && L && B.Dom.getStyle(Q, 'position') == 'absolute') {
              P = true
            }
            Q = Q.offsetParent
          }
        }
        if (P) {
          S[0] -= R.ownerDocument.body.offsetLeft
          S[1] -= R.ownerDocument.body.offsetTop
        }
        Q = R.parentNode
        while (Q.tagName && !E.ROOT_TAG.test(Q.tagName)) {
          if (Q.scrollTop || Q.scrollLeft) {
            if (!E.OP_SCROLL.test(B.Dom.getStyle(Q, 'display'))) {
              if (!C || B.Dom.getStyle(Q, 'overflow') !== 'visible') {
                S[0] -= Q.scrollLeft
                S[1] -= Q.scrollTop
              }
            }
          }
          Q = Q.parentNode
        }
        return S
      }
    }
  })()
})()
YAHOO.util.Region = function (C, D, A, B) {
  this.top = C
  this[1] = C
  this.right = D
  this.bottom = A
  this.left = B
  this[0] = B
}
YAHOO.util.Region.prototype.contains = function (A) {
  return (
    A.left >= this.left &&
    A.right <= this.right &&
    A.top >= this.top &&
    A.bottom <= this.bottom
  )
}
YAHOO.util.Region.prototype.getArea = function () {
  return (this.bottom - this.top) * (this.right - this.left)
}
YAHOO.util.Region.prototype.intersect = function (E) {
  const C = Math.max(this.top, E.top)
  const D = Math.min(this.right, E.right)
  const A = Math.min(this.bottom, E.bottom)
  const B = Math.max(this.left, E.left)
  if (A >= C && D >= B) {
    return new YAHOO.util.Region(C, D, A, B)
  } else {
    return null
  }
}
YAHOO.util.Region.prototype.union = function (E) {
  const C = Math.min(this.top, E.top)
  const D = Math.max(this.right, E.right)
  const A = Math.max(this.bottom, E.bottom)
  const B = Math.min(this.left, E.left)
  return new YAHOO.util.Region(C, D, A, B)
}
YAHOO.util.Region.prototype.toString = function () {
  return (
    'Region {' +
    'top: ' +
    this.top +
    ', right: ' +
    this.right +
    ', bottom: ' +
    this.bottom +
    ', left: ' +
    this.left +
    '}'
  )
}
YAHOO.util.Region.getRegion = function (D) {
  const F = YAHOO.util.Dom.getXY(D)
  const C = F[1]
  const E = F[0] + D.offsetWidth
  const A = F[1] + D.offsetHeight
  const B = F[0]
  return new YAHOO.util.Region(C, E, A, B)
}
YAHOO.util.Point = function (A, B) {
  if (YAHOO.lang.isArray(A)) {
    B = A[1]
    A = A[0]
  }
  this.x = this.right = this.left = this[0] = A
  this.y = this.top = this.bottom = this[1] = B
}
YAHOO.util.Point.prototype = new YAHOO.util.Region()
YAHOO.register('dom', YAHOO.util.Dom, { version: '2.5.2', build: '1076' })
YAHOO.util.CustomEvent = function (D, B, C, A) {
  this.type = D
  this.scope = B || window
  this.silent = C
  this.signature = A || YAHOO.util.CustomEvent.LIST
  this.subscribers = []
  if (!this.silent) {
  }
  const E = '_YUICEOnSubscribe'
  if (D !== E) {
    this.subscribeEvent = new YAHOO.util.CustomEvent(E, this, true)
  }
  this.lastError = null
}
YAHOO.util.CustomEvent.LIST = 0
YAHOO.util.CustomEvent.FLAT = 1
YAHOO.util.CustomEvent.prototype = {
  subscribe: function (B, C, A) {
    if (!B) {
      throw new Error("Invalid callback for subscriber to '" + this.type + "'")
    }
    if (this.subscribeEvent) {
      this.subscribeEvent.fire(B, C, A)
    }
    this.subscribers.push(new YAHOO.util.Subscriber(B, C, A))
  },
  unsubscribe: function (D, F) {
    if (!D) {
      return this.unsubscribeAll()
    }
    let E = false
    for (let B = 0, A = this.subscribers.length; B < A; ++B) {
      const C = this.subscribers[B]
      if (C && C.contains(D, F)) {
        this._delete(B)
        E = true
      }
    }
    return E
  },
  fire: function () {
    this.lastError = null
    const K = []
    const E = this.subscribers.length
    if (!E && this.silent) {
      return true
    }
    const I = [].slice.call(arguments, 0)
    let G = true
    let D
    let J = false
    if (!this.silent) {
    }
    const C = this.subscribers.slice()
    const A = YAHOO.util.Event.throwErrors
    for (D = 0; D < E; ++D) {
      const M = C[D]
      if (!M) {
        J = true
      } else {
        if (!this.silent) {
        }
        const L = M.getScope(this.scope)
        if (this.signature == YAHOO.util.CustomEvent.FLAT) {
          let B = null
          if (I.length > 0) {
            B = I[0]
          }
          try {
            G = M.fn.call(L, B, M.obj)
          } catch (F) {
            this.lastError = F
            if (A) {
              throw F
            }
          }
        } else {
          try {
            G = M.fn.call(L, this.type, I, M.obj)
          } catch (H) {
            this.lastError = H
            if (A) {
              throw H
            }
          }
        }
        if (G === false) {
          if (!this.silent) {
          }
          break
        }
      }
    }
    return G !== false
  },
  unsubscribeAll: function () {
    for (var A = this.subscribers.length - 1; A > -1; A--) {
      this._delete(A)
    }
    this.subscribers = []
    return A
  },
  _delete: function (A) {
    const B = this.subscribers[A]
    if (B) {
      delete B.fn
      delete B.obj
    }
    this.subscribers.splice(A, 1)
  },
  toString: function () {
    return 'CustomEvent: ' + "'" + this.type + "', " + 'scope: ' + this.scope
  }
}
YAHOO.util.Subscriber = function (B, C, A) {
  this.fn = B
  this.obj = YAHOO.lang.isUndefined(C) ? null : C
  this.override = A
}
YAHOO.util.Subscriber.prototype.getScope = function (A) {
  if (this.override) {
    if (this.override === true) {
      return this.obj
    } else {
      return this.override
    }
  }
  return A
}
YAHOO.util.Subscriber.prototype.contains = function (A, B) {
  if (B) {
    return this.fn == A && this.obj == B
  } else {
    return this.fn == A
  }
}
YAHOO.util.Subscriber.prototype.toString = function () {
  return (
    'Subscriber { obj: ' +
    this.obj +
    ', override: ' +
    (this.override || 'no') +
    ' }'
  )
}
if (!YAHOO.util.Event) {
  YAHOO.util.Event = (function () {
    let H = false
    const I = []
    let J = []
    let G = []
    const E = []
    let C = 0
    const F = []
    const B = []
    let A = 0
    const D = {
      63232: 38,
      63233: 40,
      63234: 37,
      63235: 39,
      63276: 33,
      63277: 34,
      25: 9
    }
    return {
      POLL_RETRYS: 2000,
      POLL_INTERVAL: 20,
      EL: 0,
      TYPE: 1,
      FN: 2,
      WFN: 3,
      UNLOAD_OBJ: 3,
      ADJ_SCOPE: 4,
      OBJ: 5,
      OVERRIDE: 6,
      lastError: null,
      isSafari: YAHOO.env.ua.webkit,
      webkit: YAHOO.env.ua.webkit,
      isIE: YAHOO.env.ua.ie,
      _interval: null,
      _dri: null,
      DOMReady: false,
      throwErrors: false,
      startInterval: function () {
        if (!this._interval) {
          const K = this
          const L = function () {
            K._tryPreloadAttach()
          }
          this._interval = setInterval(L, this.POLL_INTERVAL)
        }
      },
      onAvailable: function (P, M, Q, O, N) {
        const K = YAHOO.lang.isString(P) ? [P] : P
        for (let L = 0; L < K.length; L = L + 1) {
          F.push({ id: K[L], fn: M, obj: Q, override: O, checkReady: N })
        }
        C = this.POLL_RETRYS
        this.startInterval()
      },
      onContentReady: function (M, K, N, L) {
        this.onAvailable(M, K, N, L, true)
      },
      onDOMReady: function (K, M, L) {
        if (this.DOMReady) {
          setTimeout(function () {
            let N = window
            if (L) {
              if (L === true) {
                N = M
              } else {
                N = L
              }
            }
            K.call(N, 'DOMReady', [], M)
          }, 0)
        } else {
          this.DOMReadyEvent.subscribe(K, M, L)
        }
      },
      addListener: function (M, K, V, Q, L) {
        if (!V || !V.call) {
          return false
        }
        if (this._isValidCollection(M)) {
          let W = true
          for (let R = 0, T = M.length; R < T; ++R) {
            W = this.on(M[R], K, V, Q, L) && W
          }
          return W
        } else {
          if (YAHOO.lang.isString(M)) {
            const P = this.getEl(M)
            if (P) {
              M = P
            } else {
              this.onAvailable(M, function () {
                YAHOO.util.Event.on(M, K, V, Q, L)
              })
              return true
            }
          }
        }
        if (!M) {
          return false
        }
        if (K == 'unload' && Q !== this) {
          J[J.length] = [M, K, V, Q, L]
          return true
        }
        let Y = M
        if (L) {
          if (L === true) {
            Y = Q
          } else {
            Y = L
          }
        }
        const N = function (Z) {
          return V.call(Y, YAHOO.util.Event.getEvent(Z, M), Q)
        }
        const X = [M, K, V, N, Y, Q, L]
        const S = I.length
        I[S] = X
        if (this.useLegacyEvent(M, K)) {
          let O = this.getLegacyIndex(M, K)
          if (O == -1 || M != G[O][0]) {
            O = G.length
            B[M.id + K] = O
            G[O] = [M, K, M['on' + K]]
            E[O] = []
            M['on' + K] = function (Z) {
              YAHOO.util.Event.fireLegacyEvent(YAHOO.util.Event.getEvent(Z), O)
            }
          }
          E[O].push(X)
        } else {
          try {
            this._simpleAdd(M, K, N, false)
          } catch (U) {
            this.lastError = U
            this.removeListener(M, K, V)
            return false
          }
        }
        return true
      },
      fireLegacyEvent: function (O, M) {
        let Q = true
        let K
        let S
        let R
        let T
        let P
        S = E[M].slice()
        for (let L = 0, N = S.length; L < N; ++L) {
          R = S[L]
          if (R && R[this.WFN]) {
            T = R[this.ADJ_SCOPE]
            P = R[this.WFN].call(T, O)
            Q = Q && P
          }
        }
        K = G[M]
        if (K && K[2]) {
          K[2](O)
        }
        return Q
      },
      getLegacyIndex: function (L, M) {
        const K = this.generateId(L) + M
        if (typeof B[K] === 'undefined') {
          return -1
        } else {
          return B[K]
        }
      },
      useLegacyEvent: function (L, M) {
        if (this.webkit && (M == 'click' || M == 'dblclick')) {
          const K = parseInt(this.webkit, 10)
          if (!isNaN(K) && K < 418) {
            return true
          }
        }
        return false
      },
      removeListener: function (L, K, T) {
        let O, R, V
        if (typeof L === 'string') {
          L = this.getEl(L)
        } else {
          if (this._isValidCollection(L)) {
            let U = true
            for (O = L.length - 1; O > -1; O--) {
              U = this.removeListener(L[O], K, T) && U
            }
            return U
          }
        }
        if (!T || !T.call) {
          return this.purgeElement(L, false, K)
        }
        if (K == 'unload') {
          for (O = J.length - 1; O > -1; O--) {
            V = J[O]
            if (V && V[0] == L && V[1] == K && V[2] == T) {
              J.splice(O, 1)
              return true
            }
          }
          return false
        }
        let P = null
        let Q = arguments[3]
        if (typeof Q === 'undefined') {
          Q = this._getCacheIndex(L, K, T)
        }
        if (Q >= 0) {
          P = I[Q]
        }
        if (!L || !P) {
          return false
        }
        if (this.useLegacyEvent(L, K)) {
          const N = this.getLegacyIndex(L, K)
          const M = E[N]
          if (M) {
            for (O = 0, R = M.length; O < R; ++O) {
              V = M[O]
              if (
                V &&
                V[this.EL] == L &&
                V[this.TYPE] == K &&
                V[this.FN] == T
              ) {
                M.splice(O, 1)
                break
              }
            }
          }
        } else {
          try {
            this._simpleRemove(L, K, P[this.WFN], false)
          } catch (S) {
            this.lastError = S
            return false
          }
        }
        delete I[Q][this.WFN]
        delete I[Q][this.FN]
        I.splice(Q, 1)
        return true
      },
      getTarget: function (M, L) {
        const K = M.target || M.srcElement
        return this.resolveTextNode(K)
      },
      resolveTextNode: function (L) {
        try {
          if (L && L.nodeType == 3) {
            return L.parentNode
          }
        } catch (K) {}
        return L
      },
      getPageX: function (L) {
        let K = L.pageX
        if (!K && K !== 0) {
          K = L.clientX || 0
          if (this.isIE) {
            K += this._getScrollLeft()
          }
        }
        return K
      },
      getPageY: function (K) {
        let L = K.pageY
        if (!L && L !== 0) {
          L = K.clientY || 0
          if (this.isIE) {
            L += this._getScrollTop()
          }
        }
        return L
      },
      getXY: function (K) {
        return [this.getPageX(K), this.getPageY(K)]
      },
      getRelatedTarget: function (L) {
        let K = L.relatedTarget
        if (!K) {
          if (L.type == 'mouseout') {
            K = L.toElement
          } else {
            if (L.type == 'mouseover') {
              K = L.fromElement
            }
          }
        }
        return this.resolveTextNode(K)
      },
      getTime: function (M) {
        if (!M.time) {
          const L = new Date().getTime()
          try {
            M.time = L
          } catch (K) {
            this.lastError = K
            return L
          }
        }
        return M.time
      },
      stopEvent: function (K) {
        this.stopPropagation(K)
        this.preventDefault(K)
      },
      stopPropagation: function (K) {
        if (K.stopPropagation) {
          K.stopPropagation()
        } else {
          K.cancelBubble = true
        }
      },
      preventDefault: function (K) {
        if (K.preventDefault) {
          K.preventDefault()
        } else {
          K.returnValue = false
        }
      },
      getEvent: function (M, K) {
        let L = M || window.event
        if (!L) {
          let N = this.getEvent.caller
          while (N) {
            L = N.arguments[0]
            if (L && Event == L.constructor) {
              break
            }
            N = N.caller
          }
        }
        return L
      },
      getCharCode: function (L) {
        let K = L.keyCode || L.charCode || 0
        if (YAHOO.env.ua.webkit && K in D) {
          K = D[K]
        }
        return K
      },
      _getCacheIndex: function (O, P, N) {
        for (let M = 0, L = I.length; M < L; M = M + 1) {
          const K = I[M]
          if (K && K[this.FN] == N && K[this.EL] == O && K[this.TYPE] == P) {
            return M
          }
        }
        return -1
      },
      generateId: function (K) {
        let L = K.id
        if (!L) {
          L = 'yuievtautoid-' + A
          ++A
          K.id = L
        }
        return L
      },
      _isValidCollection: function (L) {
        try {
          return (
            L &&
            typeof L !== 'string' &&
            L.length &&
            !L.tagName &&
            !L.alert &&
            typeof L[0] !== 'undefined'
          )
        } catch (K) {
          return false
        }
      },
      elCache: {},
      getEl: function (K) {
        return typeof K === 'string' ? document.getElementById(K) : K
      },
      clearCache: function () {},
      DOMReadyEvent: new YAHOO.util.CustomEvent('DOMReady', this),
      _load: function (L) {
        if (!H) {
          H = true
          const K = YAHOO.util.Event
          K._ready()
          K._tryPreloadAttach()
        }
      },
      _ready: function (L) {
        const K = YAHOO.util.Event
        if (!K.DOMReady) {
          K.DOMReady = true
          K.DOMReadyEvent.fire()
          K._simpleRemove(document, 'DOMContentLoaded', K._ready)
        }
      },
      _tryPreloadAttach: function () {
        if (F.length === 0) {
          C = 0
          clearInterval(this._interval)
          this._interval = null
          return
        }
        if (this.locked) {
          return
        }
        if (this.isIE) {
          if (!this.DOMReady) {
            this.startInterval()
            return
          }
        }
        this.locked = true
        let Q = !H
        if (!Q) {
          Q = C > 0 && F.length > 0
        }
        const P = []
        const R = function (T, U) {
          let S = T
          if (U.override) {
            if (U.override === true) {
              S = U.obj
            } else {
              S = U.override
            }
          }
          U.fn.call(S, U.obj)
        }
        let L
        let K
        let O
        let N
        const M = []
        for (L = 0, K = F.length; L < K; L = L + 1) {
          O = F[L]
          if (O) {
            N = this.getEl(O.id)
            if (N) {
              if (O.checkReady) {
                if (H || N.nextSibling || !Q) {
                  M.push(O)
                  F[L] = null
                }
              } else {
                R(N, O)
                F[L] = null
              }
            } else {
              P.push(O)
            }
          }
        }
        for (L = 0, K = M.length; L < K; L = L + 1) {
          O = M[L]
          R(this.getEl(O.id), O)
        }
        C--
        if (Q) {
          for (L = F.length - 1; L > -1; L--) {
            O = F[L]
            if (!O || !O.id) {
              F.splice(L, 1)
            }
          }
          this.startInterval()
        } else {
          clearInterval(this._interval)
          this._interval = null
        }
        this.locked = false
      },
      purgeElement: function (O, P, R) {
        const M = YAHOO.lang.isString(O) ? this.getEl(O) : O
        const Q = this.getListeners(M, R)
        let N
        let K
        if (Q) {
          for (N = Q.length - 1; N > -1; N--) {
            const L = Q[N]
            this.removeListener(M, L.type, L.fn)
          }
        }
        if (P && M && M.childNodes) {
          for (N = 0, K = M.childNodes.length; N < K; ++N) {
            this.purgeElement(M.childNodes[N], P, R)
          }
        }
      },
      getListeners: function (M, K) {
        const P = []
        let L
        if (!K) {
          L = [I, J]
        } else {
          if (K === 'unload') {
            L = [J]
          } else {
            L = [I]
          }
        }
        const R = YAHOO.lang.isString(M) ? this.getEl(M) : M
        for (let O = 0; O < L.length; O = O + 1) {
          const T = L[O]
          if (T) {
            for (let Q = 0, S = T.length; Q < S; ++Q) {
              const N = T[Q]
              if (N && N[this.EL] === R && (!K || K === N[this.TYPE])) {
                P.push({
                  type: N[this.TYPE],
                  fn: N[this.FN],
                  obj: N[this.OBJ],
                  adjust: N[this.OVERRIDE],
                  scope: N[this.ADJ_SCOPE],
                  index: Q
                })
              }
            }
          }
        }
        return P.length ? P : null
      },
      _unload: function (Q) {
        const K = YAHOO.util.Event
        let N
        let M
        let L
        let P
        let O
        const R = J.slice()
        for (N = 0, P = J.length; N < P; ++N) {
          L = R[N]
          if (L) {
            let S = window
            if (L[K.ADJ_SCOPE]) {
              if (L[K.ADJ_SCOPE] === true) {
                S = L[K.UNLOAD_OBJ]
              } else {
                S = L[K.ADJ_SCOPE]
              }
            }
            L[K.FN].call(S, K.getEvent(Q, L[K.EL]), L[K.UNLOAD_OBJ])
            R[N] = null
            L = null
            S = null
          }
        }
        J = null
        if (I) {
          for (M = I.length - 1; M > -1; M--) {
            L = I[M]
            if (L) {
              K.removeListener(L[K.EL], L[K.TYPE], L[K.FN], M)
            }
          }
          L = null
        }
        G = null
        K._simpleRemove(window, 'unload', K._unload)
      },
      _getScrollLeft: function () {
        return this._getScroll()[1]
      },
      _getScrollTop: function () {
        return this._getScroll()[0]
      },
      _getScroll: function () {
        const K = document.documentElement
        const L = document.body
        if (K && (K.scrollTop || K.scrollLeft)) {
          return [K.scrollTop, K.scrollLeft]
        } else {
          if (L) {
            return [L.scrollTop, L.scrollLeft]
          } else {
            return [0, 0]
          }
        }
      },
      regCE: function () {},
      _simpleAdd: (function () {
        if (window.addEventListener) {
          return function (M, N, L, K) {
            M.addEventListener(N, L, K)
          }
        } else {
          if (window.attachEvent) {
            return function (M, N, L, K) {
              M.attachEvent('on' + N, L)
            }
          } else {
            return function () {}
          }
        }
      })(),
      _simpleRemove: (function () {
        if (window.removeEventListener) {
          return function (M, N, L, K) {
            M.removeEventListener(N, L, K)
          }
        } else {
          if (window.detachEvent) {
            return function (L, M, K) {
              L.detachEvent('on' + M, K)
            }
          } else {
            return function () {}
          }
        }
      })()
    }
  })();
  (function () {
    const EU = YAHOO.util.Event
    EU.on = EU.addListener
    /* DOMReady: based on work by: Dean Edwards/John Resig/Matthias Miller */
    if (EU.isIE) {
      YAHOO.util.Event.onDOMReady(
        YAHOO.util.Event._tryPreloadAttach,
        YAHOO.util.Event,
        true
      )
      let n = document.createElement('p')
      EU._dri = setInterval(function () {
        try {
          n.doScroll('left')
          clearInterval(EU._dri)
          EU._dri = null
          EU._ready()
          n = null
        } catch (ex) {}
      }, EU.POLL_INTERVAL)
    } else {
      if (EU.webkit && EU.webkit < 525) {
        EU._dri = setInterval(function () {
          const rs = document.readyState
          if (rs == 'loaded' || rs == 'complete') {
            clearInterval(EU._dri)
            EU._dri = null
            EU._ready()
          }
        }, EU.POLL_INTERVAL)
      } else {
        EU._simpleAdd(document, 'DOMContentLoaded', EU._ready)
      }
    }
    EU._simpleAdd(window, 'load', EU._load)
    EU._simpleAdd(window, 'unload', EU._unload)
    EU._tryPreloadAttach()
  })()
}
YAHOO.util.EventProvider = function () {}
YAHOO.util.EventProvider.prototype = {
  __yui_events: null,
  __yui_subscribers: null,
  subscribe: function (A, C, F, E) {
    this.__yui_events = this.__yui_events || {}
    const D = this.__yui_events[A]
    if (D) {
      D.subscribe(C, F, E)
    } else {
      this.__yui_subscribers = this.__yui_subscribers || {}
      const B = this.__yui_subscribers
      if (!B[A]) {
        B[A] = []
      }
      B[A].push({ fn: C, obj: F, override: E })
    }
  },
  unsubscribe: function (C, E, G) {
    this.__yui_events = this.__yui_events || {}
    const A = this.__yui_events
    if (C) {
      const F = A[C]
      if (F) {
        return F.unsubscribe(E, G)
      }
    } else {
      let B = true
      for (const D in A) {
        if (YAHOO.lang.hasOwnProperty(A, D)) {
          B = B && A[D].unsubscribe(E, G)
        }
      }
      return B
    }
    return false
  },
  unsubscribeAll: function (A) {
    return this.unsubscribe(A)
  },
  createEvent: function (G, D) {
    this.__yui_events = this.__yui_events || {}
    const A = D || {}
    const I = this.__yui_events
    if (I[G]) {
    } else {
      const H = A.scope || this
      const E = A.silent
      const B = new YAHOO.util.CustomEvent(
        G,
        H,
        E,
        YAHOO.util.CustomEvent.FLAT
      )
      I[G] = B
      if (A.onSubscribeCallback) {
        B.subscribeEvent.subscribe(A.onSubscribeCallback)
      }
      this.__yui_subscribers = this.__yui_subscribers || {}
      const F = this.__yui_subscribers[G]
      if (F) {
        for (let C = 0; C < F.length; ++C) {
          B.subscribe(F[C].fn, F[C].obj, F[C].override)
        }
      }
    }
    return I[G]
  },
  fireEvent: function (E, D, A, C) {
    this.__yui_events = this.__yui_events || {}
    const G = this.__yui_events[E]
    if (!G) {
      return null
    }
    const B = []
    for (let F = 1; F < arguments.length; ++F) {
      B.push(arguments[F])
    }
    return G.fire.apply(G, B)
  },
  hasEvent: function (A) {
    if (this.__yui_events) {
      if (this.__yui_events[A]) {
        return true
      }
    }
    return false
  }
}
YAHOO.util.KeyListener = function (A, F, B, C) {
  if (!A) {
  } else {
    if (!F) {
    } else {
      if (!B) {
      }
    }
  }
  if (!C) {
    C = YAHOO.util.KeyListener.KEYDOWN
  }
  const D = new YAHOO.util.CustomEvent('keyPressed')
  this.enabledEvent = new YAHOO.util.CustomEvent('enabled')
  this.disabledEvent = new YAHOO.util.CustomEvent('disabled')
  if (typeof A === 'string') {
    A = document.getElementById(A)
  }
  if (typeof B === 'function') {
    D.subscribe(B)
  } else {
    D.subscribe(B.fn, B.scope, B.correctScope)
  }
  function E (J, I) {
    if (!F.shift) {
      F.shift = false
    }
    if (!F.alt) {
      F.alt = false
    }
    if (!F.ctrl) {
      F.ctrl = false
    }
    if (J.shiftKey == F.shift && J.altKey == F.alt && J.ctrlKey == F.ctrl) {
      let G
      if (F.keys instanceof Array) {
        for (let H = 0; H < F.keys.length; H++) {
          G = F.keys[H]
          if (G == J.charCode) {
            D.fire(J.charCode, J)
            break
          } else {
            if (G == J.keyCode) {
              D.fire(J.keyCode, J)
              break
            }
          }
        }
      } else {
        G = F.keys
        if (G == J.charCode) {
          D.fire(J.charCode, J)
        } else {
          if (G == J.keyCode) {
            D.fire(J.keyCode, J)
          }
        }
      }
    }
  }
  this.enable = function () {
    if (!this.enabled) {
      YAHOO.util.Event.addListener(A, C, E)
      this.enabledEvent.fire(F)
    }
    this.enabled = true
  }
  this.disable = function () {
    if (this.enabled) {
      YAHOO.util.Event.removeListener(A, C, E)
      this.disabledEvent.fire(F)
    }
    this.enabled = false
  }
  this.toString = function () {
    return (
      'KeyListener [' +
      F.keys +
      '] ' +
      A.tagName +
      (A.id ? '[' + A.id + ']' : '')
    )
  }
}
YAHOO.util.KeyListener.KEYDOWN = 'keydown'
YAHOO.util.KeyListener.KEYUP = 'keyup'
YAHOO.util.KeyListener.KEY = {
  ALT: 18,
  BACK_SPACE: 8,
  CAPS_LOCK: 20,
  CONTROL: 17,
  DELETE: 46,
  DOWN: 40,
  END: 35,
  ENTER: 13,
  ESCAPE: 27,
  HOME: 36,
  LEFT: 37,
  META: 224,
  NUM_LOCK: 144,
  PAGE_DOWN: 34,
  PAGE_UP: 33,
  PAUSE: 19,
  PRINTSCREEN: 44,
  RIGHT: 39,
  SCROLL_LOCK: 145,
  SHIFT: 16,
  SPACE: 32,
  TAB: 9,
  UP: 38
}
YAHOO.register('event', YAHOO.util.Event, { version: '2.5.2', build: '1076' })
YAHOO.register('yahoo-dom-event', YAHOO, { version: '2.5.2', build: '1076' })
