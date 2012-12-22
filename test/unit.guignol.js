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
      TO: 1000,
      START: 0,
      END: 1000
    }
  };

  deepEqual(Guignol.expand(anim, -500), {
    RENDERER: 'r',
    v: 0
  }, 'Expanding objects works (earlier).');

  deepEqual(Guignol.expand(anim, 0), {
    RENDERER: 'r',
    v: 0
  }, 'Expanding objects works (start value).');

  deepEqual(Guignol.expand(anim, 500), {
    RENDERER: 'r',
    v: 500
  }, 'Expanding objects works (inbetween value).');

  deepEqual(Guignol.expand(anim, 1000), {
    RENDERER: 'r',
    v: 1000
  }, 'Expanding objects works (end value).');

  deepEqual(Guignol.expand(anim, 2000), {
    RENDERER: 'r',
    v: 1000
  }, 'Expanding objects works (later).');

  var time = function(t) {
    return t != null ? t+500 : t;
  };
  deepEqual(Guignol.expand(anim, 1000, time), {
    RENDERER: 'r',
    v: 500
  }, 'Expanding objects with getTime() works.');
});

module('Guignol.js');
test('Basic usage', function() {
  var value,
      inst = new Guignol({
        renderers: {
          r: function(o) {
            value = o.v;
          }
        },
        scenario: [
          {
            RENDERER: 'r',
            v: {
              FROM: 0,
              TO: 1000,
              START: 0,
              END: 1000
            }
          }
        ]
      });

  inst.goTo(500);
  deepEqual(value, 500, 'Basic initialization works.');
});