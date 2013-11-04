(function(DOM, undefined) {
    "use strict";

    var AMPM = DOM.find("html").get("lang") === "en-US",
        TIME_KEY = "time-input",
        AMPM_KEY = "ampm-select",
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
            var timeinput = DOM.create("input[maxlength=5]", {"class": COMPONENT_CLASS}),
                ampmselect = AMPM ? DOM.create("select>option>{AM}^option>{PM}", {"class": COMPONENT_CLASS + "-select"}) : DOM.mock();

            this.hide()
                .after(ampmselect, timeinput)
                .data(TIME_KEY, timeinput)
                .data(AMPM_KEY, ampmselect);

            timeinput
                .on("keydown", ["which"], this, "handleTimeinputKeydown")
                .on("change", this, "handleTimeinputChange");

            // TODO: handle required attribute somehow

            if (this.get()) this.handleTimeinputChange(timeinput);
            if (this.matches(":focus")) timeinput.fire("focus");
        },
        handleTimeinputKeydown: function(which) {
            return which === 186 || which < 58;
        },
        handleTimeinputChange: function(target) {
            var ampmselect = this.data(AMPM_KEY),
                parts = timeparts(target.get()),
                hours = parts[0],
                minutes = parts[1];

            if (typeof hours === "number" && ampmselect.get() === "PM") {
                hours += 12;
            }

            if (hours < 24 && minutes < 60) {
                this.set(zeropad(hours) + ":" + zeropad(minutes));
            } else {
                parts = timeparts(this.get());
                hours = parts[0];
                minutes = parts[1];

                ampmselect.each(function(el) {
                    el.child((hours -= 12) > 0 ? 1 : (hours += 12) || 0).set("selected", true);
                });

                target.set(hours + ":" + minutes);
            }
        }
    });
}(window.DOM));
