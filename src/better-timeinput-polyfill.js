(function(DOM, undefined) {
    "use strict";

    var AMPM = DOM.find("html").get("lang") === "en-US",
        TIME_KEY = "time-input",
        AMPM_KEY = "time-median",
        COMPONENT_CLASS = "better-timeinput",
        timeparts = function(str) {
            str = str.split(":");

            if (str.length === 2) {
                str[0] = parseFloat(str[0]);
                str[1] = parseFloat(str[1]);
            } else {
                str = [];
            }

            return str;
        },
        zeropad = function(value) { return ("00" + value).slice(-2) };

    DOM.extend("input[type=time]", "orientation" in window ? function() { this.addClass(COMPONENT_CLASS) } : {
        // polyfill timeinput for desktop browsers
        constructor: function() {
            var timeinput = DOM.create("input[type=hidden]", {name: this.get("name"), value: this.get() }),
                ampmspan = AMPM ? DOM.create("span." + COMPONENT_CLASS + "-meridian>(select>option>{AM}^option>{PM})+span>{AM}") : DOM.mock(),
                ampmselect = ampmspan.child(0);

            this
                // drop native implementation and clear name attribute
                .set({type: "text", maxlength: 5, name: null})
                .addClass(COMPONENT_CLASS)
                .after(ampmspan, timeinput)
                .data(TIME_KEY, timeinput)
                .data(AMPM_KEY, ampmselect)
                .on("keydown", ["which", "shiftKey"], this.handleTimeInputKeydown)
                .on("change", this.handleTimeInputChange)
                .handleTimeInputChange();

            ampmselect.on("change", this, "handleTimeMeridianChange");
            // update value correctly on form reset
            this.parent("form").on("reset", this, function() {
                setTimeout((function(el) {
                    return function() {
                        timeinput.set(el.get());
                        el.handleTimeInputChange();
                    };
                }(this)), 0);
            });

            if (this.matches(":focus")) timeinput.fire("focus");
        },
        handleTimeInputKeydown: function(which, shiftKey) {
            return which === 186 && shiftKey || which < 58;
        },
        handleTimeInputChange: function() {
            var ampmselect = this.data(AMPM_KEY),
                timeinput = this.data(TIME_KEY),
                parts = timeparts(this.get()),
                hours = parts[0],
                minutes = parts[1];

            if (!parts.length) return timeinput.set("");

            if (hours < (ampmselect.length ? 13 : 24) && minutes < 60) {
                timeinput.set(zeropad(ampmselect.get() === "PM" ? hours + 12 : hours) + ":" + zeropad(minutes));
            } else {
                // restore previous valid
                parts = timeparts(timeinput.get());
                hours = parts[0];
                minutes = parts[1];
                // select appropriate AM/PM
                ampmselect.child((hours -= 12) > 0 ? 1 : Math.min(hours += 12, 0)).set("selected", true);
                // update displayed AM/PM
                ampmselect.next().set(ampmselect.get());
            }

            this.set(hours + ":" + zeropad(minutes));
        },
        handleTimeMeridianChange: function(ampmselect) {
            // update displayed AM/PM
            ampmselect.next().set(ampmselect.get());
            // adjust time in hidden input
            this.data(TIME_KEY).set(function(value) {
                var parts = timeparts(value),
                    hours = parts[0],
                    minutes = parts[1];

                return zeropad(ampmselect.get() === "PM" ? hours + 12 : hours - 12) + ":" + zeropad(minutes);
            });
        }
    });
}(window.DOM));
