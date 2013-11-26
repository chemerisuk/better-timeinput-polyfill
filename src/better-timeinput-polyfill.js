(function(DOM, TIMEINPUT_KEY, MERIDIAN_KEY, COMPONENT_CLASS) {
    "use strict";

    if ("orientation" in window) return; // skip mobile/tablet browsers

    // polyfill timeinput for desktop browsers
    var htmlEl = DOM.find("html"),
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
        zeropad = function(value) { return ("00" + value).slice(-2) },
        ampm = function(pos, neg) { return htmlEl.get("lang") === "en-US" ? pos : neg },
        defaultValue = function(el) { return el.data("defaultValue") };

    DOM.extend("input[type=time]", {
        constructor: function() {
            var timeinput = DOM.create("input[type=hidden name=${n}]", {n: this.get("name")}),
                ampmspan = DOM.create("span.${c}-meridian>(select>option>{AM}^option>{PM})+span>{AM}", {c: COMPONENT_CLASS}),
                ampmselect = ampmspan.child(0);

            this
                // drop native implementation and clear name attribute
                .set({type: "text", maxlength: 5, name: null})
                .addClass(COMPONENT_CLASS)
                .after(ampmspan, timeinput)
                .data(TIMEINPUT_KEY, timeinput)
                .data(MERIDIAN_KEY, ampmselect)
                .on("change", this.onChange)
                .on("keydown", this.onKeydown, ["which", "shiftKey"]);

            ampmselect.on("change", this, this.onMeridianChange);
            // update value correctly on form reset
            this.parent("form").on("reset", this, this.onFormReset);
            // patch set method to update visible input as well
            timeinput.set = (function(el, setter) {
                return function() {
                    setter.apply(timeinput, arguments);

                    if (arguments.length === 1) {
                        var parts = timeparts(timeinput.get()),
                            hours = parts[0],
                            minutes = parts[1];
                        // select appropriate AM/PM
                        ampmselect.child((hours -= 12) > 0 ? 1 : Math.min(hours += 12, 0)).set("selected", true);
                        // update displayed AM/PM
                        ampmselect.next().set(ampmselect.get());
                        // update visible input value
                        el.set(hours < ampm(13, 24) && minutes < 60 ? hours + ":" + zeropad(minutes) : "");
                    }

                    return this;
                };
            }(this, timeinput.set));

            // update hidden input value and refresh all visible controls
            timeinput.set(this.get()).data("defaultValue", timeinput.get());
            // update default values to be formatted
            this.set("defaultValue", this.get());
            ampmselect.next().data("defaultValue", ampmselect.get());

            if (this.matches(":focus")) timeinput.fire("focus");
        },
        onKeydown: function(which, shiftKey) {
            return which === 186 && shiftKey || which < 58;
        },
        onChange: function() {
            var ampmselect = this.data(MERIDIAN_KEY),
                timeinput = this.data(TIMEINPUT_KEY),
                parts = timeparts(this.get()),
                hours = parts[0],
                minutes = parts[1],
                value = "";

            if (hours < ampm(13, 24) && minutes < 60) {
                // refresh hidden input with new value
                value = zeropad(ampmselect.get() === "PM" ? hours + 12 : hours) + ":" + zeropad(minutes);
            } else if (parts.length === 2) {
                // restore previous valid value
                value = timeinput.get();
            }

            timeinput.set(value);
        },
        onMeridianChange: function(ampmselect) {
            // update displayed AM/PM
            ampmselect.next().set(ampmselect.get());
            // adjust time in hidden input
            this.data(TIMEINPUT_KEY).set(function(el) {
                var parts = timeparts(el.get()),
                    hours = parts[0],
                    minutes = parts[1];

                return zeropad(ampmselect.get() === "PM" ? hours + 12 : hours - 12) + ":" + zeropad(minutes);
            });
        },
        onFormReset: function() {
            this.data(TIMEINPUT_KEY).set(defaultValue);
            this.data(MERIDIAN_KEY).next().set(defaultValue);
        }
    });
}(window.DOM, "time-input", "time-median", "better-timeinput"));
