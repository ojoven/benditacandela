/** EXTEND **/
$.fn.extend({

    _write: function (enter) {  // KeyUp Function
        return this.each(function () {
            $(this).keyup(function () {
                enter.apply($(this), []);
            });
        });
    },

    _click: function (enter) { //Simple Click Function
        return this.each(function () {
            $(this).click(function () {
                enter.apply($(this), []);
            });
        });
    },

    _hover: function (enter, leave) { //Hover Effect
        return this.each(function () {
            $(this).on('mouseenter', function () {
                enter.apply($(this), []);
            }).on('mouseleave', function () {
                leave.apply($(this), []);
            });
        });
    },

    _hoverF: function (enter, leave) { //Hover Effect + Focus

        return this.each(function () {
            $(this).on('mouseenter', function () {
                enter.apply($(this), []);
            }).on('mouseleave', function () {
                leave.apply($(this), []);
            });

            $(this).on('focusin', function () {
                enter.apply($(this), []);
            }).on('focusout', function () {
                leave.apply($(this), []);
            });
        });
    },

    _focus: function (enter, leave) { //Focus Effect
        return this.each(function () {
            $(this).on('focusin', function () {
                enter.apply($(this), []);
            }).on('focusout', function () {
                if (typeof leave != "undefined") leave.apply($(this), []);
            });
        });
    },

    _effect: function (element, duration, animation, effect, time) { // only if Greensock is Able
        return this.each(function () {
            TweenLite.to(element, duration, animation, effect);
        });
    },

    _enterKey: function (fnc) {
        return this.each(function () {
            $(this).keypress(function (ev) {
                var keycode = (ev.keyCode ? ev.keyCode : ev.which);
                if (keycode == '13') {
                    fnc.call(this, ev);
                }
            })
        })
    },

    _escKey: function (fnc) {
        return this.each(function () {
            $(this).keypress(function (ev) {
                var keycode = (ev.keyCode ? ev.keyCode : ev.which);
                if (keycode == '27') {
                    fnc.call(this, ev);
                }
            })
        })
    },

    _spaceKey: function (fnc) {
        return this.each(function () {
            $(this).keypress(function (ev) {
                var keycode = (ev.keyCode ? ev.keyCode : ev.which);
                if (keycode == '32') {
                    fnc.call(this, ev);
                }
            })
        })
    }

});