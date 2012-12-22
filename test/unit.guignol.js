module('Main engine functions');
test('Guignol.interpolate', function() {
  deepEqual(Guignol.interpolate(0, 1, 0.5), 0.5, 'Interpolation works.');
  deepEqual(Guignol.interpolate({
    a: 0,
    b: 0
  }, {
    a: 1,
    b: 1
  }, 0.5), {
    a: 0.5,
    b: 0.5
  }, 'Deep interpolation works.');
});

test('Guignol.expand', function() {
  deepEqual(Guignol.expand('a'), 'a', 'Expanding unrelevant strings does not change them.');
  deepEqual(Guignol.expand(42), 42, 'Expanding unrelevant numbers does not change them.');
  deepEqual(Guignol.expand({}), {}, 'Expanding unrelevant objects does not change them.');
  deepEqual(Guignol.expand(null), null, 'Expanding null returns null.');
  deepEqual(Guignol.expand(undefined), undefined, 'Expanding undefined returns undefined.');
  deepEqual(Guignol.expand(undefined), undefined, 'Expanding undefined returns undefined.');

  var anim = {
    RENDERER: 'r',
    v: {
      FROM: 0,
      TO: 100,
      START: 0,
      END: 100
    }
  };

  deepEqual(Guignol.expand(anim, -50), {
    RENDERER: 'r',
    v: 0
  }, 'Expanding objects works (earlier).');

  deepEqual(Guignol.expand(anim, 0), {
    RENDERER: 'r',
    v: 0
  }, 'Expanding objects works (start value).');

  deepEqual(Guignol.expand(anim, 50), {
    RENDERER: 'r',
    v: 50
  }, 'Expanding objects works (inbetween value).');

  deepEqual(Guignol.expand(anim, 100), {
    RENDERER: 'r',
    v: 100
  }, 'Expanding objects works (end value).');

  deepEqual(Guignol.expand(anim, 200), {
    RENDERER: 'r',
    v: 100
  }, 'Expanding objects works (later).');

  var time = function(t) {
    return t != null ? t+50 : t;
  };
  deepEqual(Guignol.expand(anim, 100, time), {
    RENDERER: 'r',
    v: 50
  }, 'Expanding objects with getTime() works.');
});

module('Guignol.js');
test('Basic usage', function() {
  var value,
      inst = new Guignol({
        start: 0,
        end: 100,
        renderers: {
          r: function(o) {
            console.log('ahah lol', o.v, o);
            value = o.v;
          }
        },
        scenario: [
          {
            RENDERER: 'r',
            v: {
              FROM: 0,
              TO: 100,
              START: 0,
              END: 100
            }
          }
        ]
      });

  // Test goTo():
  inst.goTo(50);
  deepEqual(value, 50, 'goTo works.');

  // Test start():
  stop();
  inst.play();
  window.setTimeout(function() {
    start();
    deepEqual(value, 100, 'play works.');
  }, 120);
});