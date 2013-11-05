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
        // polyfill for desktop browsers
        constructor: function() {
            var timeinput = DOM.create("input[type=hidden]", {name: this.get("name"), value: this.get() }),
                ampmspan = AMPM ? DOM.create("span." + COMPONENT_CLASS + "-meridian>(select>option>{AM}^option>{PM})+span") : DOM.mock();

            this
                .set({type: "text", maxlength: 5, name: null})
                .addClass(COMPONENT_CLASS)
                .after(ampmspan, timeinput)
                .data(TIME_KEY, timeinput)
                .data(AMPM_KEY, ampmspan.child(0))
                .on("keydown", ["which", "shiftKey"], this.handleTimeInputKeydown)
                .on("change", this.handleTimeInputChange);

            ampmspan.child(0).on("change", this, "handleTimeMeridianChange");

            if (this.get()) {
                this.handleTimeInputChange();
                // defaultValue fix: dunno why it doesn't work
                this.parent("form").on("reset", function() {
                    setTimeout(function() {
                        timeinput.set(timeinput.get("defaulValue"));
                    }, 50);
                });
            }

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

            if (parts.length === 0) return timeinput.set("");

            if (hours < (ampmselect.length ? 13 : 24) && minutes < 60) {
                timeinput.set(zeropad(ampmselect.get() === "PM" ? hours + 12 : hours) + ":" + zeropad(minutes));
            } else {
                // restore previous valid
                parts = timeparts(timeinput.get());
                hours = parts[0];
                minutes = parts[1];

                ampmselect.child((hours -= 12) > 0 ? 1 : Math.min(hours += 12, 0)).set("selected", true);
                ampmselect.next().set(ampmselect.get());
            }

            this.set(hours + ":" + zeropad(minutes));
        },
        handleTimeMeridianChange: function(ampmselect) {
            ampmselect.next().set(ampmselect.get());

            this.data(TIME_KEY).set(function(value) {
                var parts = timeparts(value),
                    hours = parts[0],
                    minutes = parts[1];

                hours += ampmselect.get() === "PM" ? 12 : -12;

                return zeropad(hours) + ":" + zeropad(minutes);
            });
        }
    });
}(window.DOM));
