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

test('Guignol.expand: Unexpected values', function() {
  deepEqual(Guignol.expand('a'), 'a', 'Expanding irrelevant strings does not change them.');
  deepEqual(Guignol.expand(42), 42, 'Expanding irrelevant numbers does not change them.');
  deepEqual(Guignol.expand({}), {}, 'Expanding irrelevant objects does not change them.');
  deepEqual(Guignol.expand(null), null, 'Expanding null returns null.');
  deepEqual(Guignol.expand(undefined), undefined, 'Expanding undefined returns undefined.');
});

test('Guignol.expand: Single animations', function() {
  var anim = {
        v: {
          FROM: 0,
          TO: 100,
          START: 0,
          END: 100
        }
      };

  deepEqual(Guignol.expand(anim, -50), {
    v: 0
  }, 'Expanding objects works (earlier).');

  deepEqual(Guignol.expand(anim, 0), {
    v: 0
  }, 'Expanding objects works (start value).');

  deepEqual(Guignol.expand(anim, 50), {
    v: 50
  }, 'Expanding objects works (during animation).');

  deepEqual(Guignol.expand(anim, 100), {
    v: 100
  }, 'Expanding objects works (end value).');

  deepEqual(Guignol.expand(anim, 150), {
    v: 100
  }, 'Expanding objects works (later).');

  var time = function(t) {
    return t != null ? t+50 : t;
  };
  deepEqual(Guignol.expand(anim, 100, time), {
    v: 50
  }, 'Expanding objects with getTime() works.');
});

test('Guignol.expand: Multiple animations', function() {
  var anim = {
        v: [
          {
            FROM: 0,
            TO: 100,
            START: 0,
            END: 50
          },
          {
            FROM: 200,
            TO: 300,
            START: 100,
            END: 150
          }
        ]
      };

  deepEqual(Guignol.expand(anim, -50), {
    v: 0
  }, 'Expanding objects with multiple animations works (earlier).');

  deepEqual(Guignol.expand(anim, 0), {
    v: 0
  }, 'Expanding objects with multiple animations works (start value).');

  deepEqual(Guignol.expand(anim, 25), {
    v: 50
  }, 'Expanding objects with multiple animations works (during first animation).');

  deepEqual(Guignol.expand(anim, 50), {
    v: 100
  }, 'Expanding objects with multiple animations works (end of first animation).');

  deepEqual(Guignol.expand(anim, 75), {
    v: 100
  }, 'Expanding objects with multiple animations works (between animations).');

  deepEqual(Guignol.expand(anim, 100), {
    v: 200
  }, 'Expanding objects with multiple animations works (beginning of second animation).');

  deepEqual(Guignol.expand(anim, 125), {
    v: 250
  }, 'Expanding objects with multiple animations works (during second animation).');

  deepEqual(Guignol.expand(anim, 150), {
    v: 300
  }, 'Expanding objects with multiple animations works (end value).');

  deepEqual(Guignol.expand(anim, 200), {
    v: 300
  }, 'Expanding objects with multiple animations works (later).');
});

module('Guignol.js');
test('Use play and goTo', function() {
  var value,
      inst = new Guignol({
        start: 0,
        end: 100,
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

test('Use play and stop', function() {
  var value,
      inst = new Guignol({
        start: 0,
        end: 100,
        renderers: {
          r: function(o) {
            value = o.v;
          }
        },
        scenario: [
          {
            RENDERER: 'r',
            v: [
              {
                FROM: 0,
                TO: 50,
                START: 0,
                END: 30
              },
              {
                FROM: 50,
                TO: 50,
                START: 30,
                END: 70
              },
              {
                FROM: 50,
                TO: 100,
                START: 70,
                END: 100
              }
            ]
          }
        ]
      });

  // Test stop():
  stop();
  inst.play();
  window.setTimeout(function() {
    inst.stop();
    window.setTimeout(function() {
      start();
      deepEqual(value, 50, 'stop works.');
    }, 70);
  }, 50);
});
