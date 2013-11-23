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
            var timeinput = DOM.create("input[type=hidden]", { name: this.get("name") }),
                ampmspan = AMPM ? DOM.create("span.${c}-meridian>(select>option>{AM}^option>{PM})+span>{AM}", {c: COMPONENT_CLASS}) : DOM.mock(),
                ampmselect = ampmspan.child(0);

            this
                // drop native implementation and clear name attribute
                .set({type: "text", maxlength: 5, name: null})
                .addClass(COMPONENT_CLASS)
                .after(ampmspan, timeinput)
                .data(TIME_KEY, timeinput)
                .data(AMPM_KEY, ampmselect)
                .on("keydown", this.handleTimeInputKeydown, ["which", "shiftKey"])
                .on("change", this.handleTimeInputChange);

            ampmselect.on("change", this, "handleTimeMeridianChange");
            // update value correctly on form reset
            this.parent("form").on("reset", this, "handleFormReset");
            // dunno why defaultValue syncs with value for input[type=hidden]
            timeinput.set(this.get()).data("defaultValue", this.get());

            if (this.get()) {
                this.handleTimeInputChange();
                // update defaultValue with formatted time
                this.set("defaultValue", this.get());
                ampmselect.set("defaultValue", ampmselect.get());
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

            this.set(function() {
                if (hours < (ampmselect.length ? 13 : 24) && minutes < 60) {
                    return hours + ":" + zeropad(minutes);
                }

                return "";
            });
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
        },
        handleFormReset: function() {
            this.data(TIME_KEY).set(function(value, index, el) { return el.data("defaultValue") });
            this.data(AMPM_KEY).each(function(el) { el.next().set(el.get("defaultValue")) });
        }
    });
}(window.DOM));
