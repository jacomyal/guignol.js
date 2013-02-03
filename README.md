# guignol.js
### a lightweight animation library in JavaScript

-----

**guignol.js** is a small javascript library, used for animation.
Here is an example:

````javascript
var inst = new Guignol({
  start: 0,
  end: 100,
  renderers: {
    // We declare here a render "r" that will receive an object, and log
    // the "v" attribute of it.
    r: function(o) {
      console.log(o.v);
    }
  },
  scenario: [{
    // This animation uses the renderer called "r".
    RENDERER: 'r',
    v: [{
      // FROM and TO are the extreme values of this animation.
      FROM: 0,
      TO: 1000,

      // START and END are the times where this animation starts and ends.
      START: 0,
      END: 100
    }]
  }]
});

// The following line will log "500":
inst.goTo(50);

// The following line will play the animation from the beginning:
// During 100 ms, it will at each frame expand our animation with the current
// time, and log the related value.
inst.play(0);
````

In practice, renderers can be wrappers to CANVAS methods (for instance a `.drawArc()` wrapper) or anything you want to animate (DOM, SVG, CANVAS, attributes...). It is also possible to cycle animations, to use easings functions...

Check the [examples file](https://raw.github.com/jacomyal/guignol.js/master/samples/examples.html) for more information about how to use it.
[Sources](https://raw.github.com/jacomyal/guignol.js/master/guignol.js) are documented, and [unit tests](https://raw.github.com/jacomyal/guignol.js/master/test/unit.html) are also provided.

-----

Released under the [MIT License](https://raw.github.com/jacomyal/guignol.js/master/LICENSE.txt).