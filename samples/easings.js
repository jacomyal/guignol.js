;(function(window, undefined) {
  window.easings = window.easings || {};
  var easings = window.easings;

  easings.linearNone = function(k) {
    return k;
  };
  easings.quadraticIn = function(k) {
    return k * k;
  };
  easings.quadraticOut = function(k) {
    return k * ( 2 - k );
  };
  easings.quadraticInOut = function(k) {
    if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
    return - 0.5 * ( --k * ( k - 2 ) - 1 );
  };
  easings.cubicIn = function(k) {
    return k * k * k;
  };
  easings.cubicOut = function(k) {
    return --k * k * k + 1;
  };
  easings.cubicInOut = function(k) {
    if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
    return 0.5 * ( ( k -= 2 ) * k * k + 2 );
  };
  easings.quarticIn = function(k) {
    return k * k * k * k;
  };
  easings.quarticOut = function(k) {
    return 1 - ( --k * k * k * k );
  };
  easings.quarticInOut = function(k) {
    if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
    return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );
  };
  easings.quinticIn = function(k) {
    return k * k * k * k * k;
  };
  easings.quinticOut = function(k) {
    return --k * k * k * k * k + 1;
  };
  easings.quinticInOut = function(k) {
    if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
    return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );
  };
  easings.sinusoidalIn = function(k) {
    return 1 - Math.cos( k * Math.PI / 2 );
  };
  easings.sinusoidalOut = function(k) {
    return Math.sin( k * Math.PI / 2 );
  };
  easings.sinusoidalInOut = function(k) {
    return 0.5 * ( 1 - Math.cos( Math.PI * k ) );
  };
  easings.exponentialIn = function(k) {
    return k === 0 ? 0 : Math.pow( 1024, k - 1 );
  };
  easings.exponentialOut = function(k) {
    return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );
  };
  easings.exponentialInOut = function(k) {
    if ( k === 0 ) return 0;
    if ( k === 1 ) return 1;
    if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
    return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );
  };
  easings.circularIn = function(k) {
    return 1 - Math.sqrt( 1 - k * k );
  };
  easings.circularOut = function(k) {
    return Math.sqrt( 1 - ( --k * k ) );
  };
  easings.circularInOut = function(k) {
    if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
    return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);
  };
  easings.elasticIn = function(k) {
    var s, a = 0.1, p = 0.4;
    if ( k === 0 ) return 0;
    if ( k === 1 ) return 1;
    if ( !a || a < 1 ) { a = 1; s = p / 4; }
    else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
    return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
  };
  easings.elasticOut = function(k) {
    var s, a = 0.1, p = 0.4;
    if ( k === 0 ) return 0;
    if ( k === 1 ) return 1;
    if ( !a || a < 1 ) { a = 1; s = p / 4; }
    else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
    return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );
  };
  easings.elasticInOut = function(k) {
    var s, a = 0.1, p = 0.4;
    if ( k === 0 ) return 0;
    if ( k === 1 ) return 1;
    if ( !a || a < 1 ) { a = 1; s = p / 4; }
    else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
    if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
    return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;
  };
  easings.backIn = function(k) {
    var s = 1.70158;
    return k * k * ( ( s + 1 ) * k - s );
  };
  easings.backOut = function(k) {
    var s = 1.70158;
    return --k * k * ( ( s + 1 ) * k + s ) + 1;
  };
  easings.backInOut = function(k) {
    var s = 1.70158 * 1.525;
    if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
    return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
  };
  easings.bounceIn = function(k) {
    return 1 - easings.bounceOut( 1 - k );
  };
  easings.bounceOut = function(k) {
    if ( k < ( 1 / 2.75 ) ) {
      return 7.5625 * k * k;
    } else if ( k < ( 2 / 2.75 ) ) {
      return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
    } else if ( k < ( 2.5 / 2.75 ) ) {
      return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
    } else {
      return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
    }
  };
  easings.bounceInOut = function(k) {
    if ( k < 0.5 ) return easings.bounceIn( k * 2 ) * 0.5;
    return easings.bounceOut( k * 2 - 1 ) * 0.5 + 0.5;
  };
})(window);
