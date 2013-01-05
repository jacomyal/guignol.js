;(function(window, undefined) {
  'use strict';

  /**
   * Naming policy:
   * **************
   *  - UPPERCASE: Parameters recognized by Guignol
   *  - camlCase: var in local scope or parameter
   *  - _camlCaseUnderscore: Related to the instance
   *  - __camlCaseUnderscores: Related to every instances
   */
  var __easings = {},
      __renderers = {},
      __identity = function(v) { return v; },
      __properties = 'START END FROM TO EASING ANIMATION'.split(' ');

  /**
   * Recognized parameters:
   * **********************
   *  - scenario: (?object)
   *  - times: (?object)
   *  - renderers: (?object)
   *  - animations: (?object)
   *  - start: (number)
   *  - end: (number)
   *  - options: (?object)
   *  - enterFrame: (?function)
   *    Recognized options:
   *     - cycle (?boolean): Makes the animation plays again from the beginning
   *                         when it ends.
   *     - rewind (?boolean): Makes the animation plays again backward when it
   *                          ends forward.
   *     If both "cycle" and "rewind" are "true", then the animation will be
   *     played forward, backward, forward, etc...
   */
  window.Guignol = function(options) {
    var _self = this,
        _o = options || {},
        _times = _o.times || _o.t || {},
        _renderers = _o.renderers || _o.r || {},
        _animations = _o.animations || _o.a || {},
        _enterFrame = _o.enterFrame || _o.e || __identity,
        _scenario = _o.scenario || _o.s || {},
        _options = _o.options || _o.o || {},
        _start = _getTime(_o.start),
        _end = _getTime(_o.end),
        _originTime,
        _time,
        _isPlaying,
        _isRewinding;

    function _getTime(t) {
      return typeof t === 'string' ?
        _times[t] || null :
        t;
    }

    function _getAnim(o) {
      var res = {};

      if (typeof o === 'string')
        return _animations[o] || o;
      else if (typeof o === 'object') {
        if (o.ANIMATION && _animations[o.ANIMATION]) {
          var k,
              res = {},
              a = _animations[o.ANIMATION];
          for (k in o)
            res[k] = o[k];
          for (k in a)
            res[k] = a[k];

          delete res.ANIMATION;
          return res;
        }
      }

      return o;
    }

    function _render(t) {
      var i, s, r; // index, shape, renderer

      _enterFrame(t);

      for (i in _scenario) {
        s = _scenario[i];

        // Check local, then global:
        r = _renderers[s.RENDERER] || __renderers[s.RENDERER];

        if (
          r && (s.END === undefined || _getTime(s.END) > t) &&
          (s.START === undefined || _getTime(s.START) < t)
        ) {
          r(__expand(s, t, _getTime, _getAnim));
        }
      }

      var isEnded = _isRewinding ? (t < _start) : (t > _end);
      if (_isPlaying && !isEnded)
        __requestAnimFrame(_convertAndRender);
      else if (_isPlaying && isEnded) {
        _isPlaying = false;
        if (!_isRewinding && _options.rewind) {
          _isRewinding = true;
          _self.play();
        } else if (_options.cycle) {
          _isRewinding = false;
          _self.play();
        }
      }
    }

    function _convertAndRender(t) {
      if (_isRewinding)
        _time = _end - (t - (_originTime || 0) + (_start || 0));
      else
        _time = t - (_originTime || 0) + (_start || 0);
      _render(_time);
    }

    this.goTo = function(t) {
      _time = t;
      _render(t);
      return this;
    };
    this.play = function(t) {
      _originTime = new Date();

      if (typeof t === 'number')
        _originTime -= t;

      _isPlaying = true;
      _convertAndRender(_originTime);
      return this;
    };
    this.stop = function() {
      _isPlaying = false;
      _isRewinding = false;
      return this;
    };
    this.time = function() {
      return _time;
    };
  };
  var G = window.Guignol;

  /**
   * Find window.requestAnimationFrame fallback:
   */
  var __requestAnimFrame = (function() {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

  function __interpolate(from, to, progress) {
    if (typeof from === 'object') {
      var res = {};
      for (var k in from)
        res[k] = __interpolate(from[k], to[k], progress);
      return res;
    } else if (typeof from === 'number')
      return from + (to - from) * progress;
    else
      return from;
  }

  /**
   * Recognized parameters:
   * **********************
   *  - START: The start time of the animation (number|string)
   *  - END: The end time of the animation (number|string)
   *  - FROM: The initial value of the animation (number)
   *  - TO: The final value of the animation (number)
   *  - EASING: The easing of the animation (?function|string)
   *  - ANIMATION: The parent animation (?string)
   */
  function __expand(v, t, getTime, getAnim) {
    getTime = getTime || __identity;
    getAnim = getAnim || __identity;

    // If null or undefined, return the same value:
    if (v == null)
      return v;

    // If an array, find the good timeStep:
    else if (Object.prototype.toString.call(v) === '[object Array]') {
      var i, oMin, oMax, s, e,
          min, max;
      for (i in v) {
        var o = getAnim(v[i]),
            s = getTime(o.START),
            e = getTime(o.END);

        // If a timestep matches, just interpolate
        if (s <= t && e >= t) {
          var progress = (t - s) / (e - s);
          progress = Math.min(1, Math.max(0, progress));

          if (o.EASING) {
            if (__easings[o.EASING])
              progress = __easings[o.EASING](progress);
            else if (typeof o.EASING === 'function')
              progress = o.EASING(progress);
          }

          return __interpolate(o.FROM, o.TO, progress);
        }

        // If not, find the good persistent timestep
        else {
          if (s > t && (min === undefined || s < min)) {
            min = s;
            oMin = o;
          } else if (e < t && (max === undefined || e > max)) {
            max = e;
            oMax = o;
          }
        }
      }

      if (oMax)
        return oMax.TO;
      else if (oMin)
        return oMin.FROM;

    // If an object, try to interpolate:
    } else if (typeof v === 'object' || typeof v === 'string') {
      var o = getAnim(v);

      // If it is still a string, then there is nothing to expand:
      if (typeof o === 'string')
        return v;

      var s = getTime(o.START),
          e = getTime(o.END);

      // Let's first check if the object is a valid animation:
      if (s !== undefined && e !== undefined) {
        var progress = (t - s) / (e - s);
        progress = Math.min(1, Math.max(0, progress));

        if (o.EASING) {
          if (__easings[o.EASING])
            progress = __easings[o.EASING](progress);
          else if (typeof o.EASING === 'function')
            progress = o.EASING(progress);
        }

        return __interpolate(o.FROM, o.TO, progress);

      // If not, let's expand sub-objects:
      } else {
        var res = {};

        for (var k in o) {
          if (typeof o[k] === 'object')
            res[k] = __expand(o[k], t, getTime, getAnim);
          else if (typeof o[k] === 'string') {
            var o2 = getAnim(o[k]);
            if (typeof o2 === 'object')
              res[k] = __expand(o[k], t, getTime, getAnim);
            else
              res[k] = o[k];
          } else
            res[k] = o[k];
        }

        return res;
      }

    // It not an object or an array, nothing to expand:
    } else
      return v;
  }

  G.expand = __expand;
  G.interpolate = __interpolate;

  G.requestAnimationFrame = __requestAnimFrame;
  G.easings = function(a1, a2) {
    if (arguments.length === 1) {
      if (typeof a1 === 'object') {
        for (var k in a1)
          G.easings(k, a1[k]);
      } else
        return __easings[a1];
    } else if (arguments.length === 2) {
      if (typeof a2 !== 'function')
        throw '[guignol] Easings must be functions.';
      __easings[a1] = a2;
    }
    return this;
  }
  G.renderers = function(a1, a2) {
    if (arguments.length === 1) {
      if (typeof a1 === 'object') {
        for (var k in a1)
          G.renderers(k, a1[k]);
      } else
        return __renderers[a1];
    } else if (arguments.length === 2) {
      if (typeof a2 !== 'function')
        throw '[guignol] Renderers must be functions.';
      __renderers[a1] = a2;
    }
    return this;
  }
})(window);
