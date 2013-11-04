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
            var timeinput = DOM.create("input[maxlength=5]." + COMPONENT_CLASS, {defaulValue: this.get()}),
                ampmspan = AMPM ? DOM.create("span." + COMPONENT_CLASS + "-meridian>(select>option>{AM}^option>{PM})+span") : DOM.mock();

            this.hide()
                .after(ampmspan, timeinput)
                .data(TIME_KEY, timeinput)
                .data(AMPM_KEY, ampmspan.child(0));

            timeinput
                .on("keydown", ["which", "shiftKey"], this, "handleTimeInputKeydown")
                .on("change", this, "handleTimeInputChange");

            ampmspan.child(0).on("change", this, "handleTimeMeridianChange");

            // TODO: handle required attribute somehow

            if (this.get()) {
                this.handleTimeInputChange(timeinput);

                timeinput.set("defaulValue", timeinput.get());
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
        handleTimeInputChange: function(target) {
            var ampmselect = this.data(AMPM_KEY),
                parts = timeparts(target.get()),
                hours = parts[0],
                minutes = parts[1];

            if (hours < (ampmselect.length ? 12 : 24) && minutes < 60) {
                this.set(zeropad(hours) + ":" + zeropad(minutes));
            } else {
                // restore previous valid
                parts = timeparts(this.get());
                hours = parts[0];
                minutes = parts[1];

                ampmselect.each(function(el) {
                    el.child((hours -= 12) > 0 ? 1 : Math.min(hours += 12, 0)).set("selected", true);
                });

                this.handleTimeMeridianChange(ampmselect);
            }

            target.set(hours + ":" + zeropad(minutes));
        },
        handleTimeMeridianChange: function(select) {
            select.next().set(select.get());
        }
    });
}(window.DOM));
