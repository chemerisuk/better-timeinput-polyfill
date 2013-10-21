(function(DOM, undefined) {
    "use strict";

    var HOURS_KEY = "hours-select",
        HOURS_TEMPLATE = DOM.template("select.better-timeinput-select>(option>{$$@6})*18+(option>{$$@0})*3"),
        MINUTES_KEY = "minutes-select",
        MINUTES_TEMPLATE = DOM.template("select.better-timeinput-select>option>{00}^option>{05}^(option>{$0}^option>{$5})*5"),
        COMPONENT_CLASS = "better-timeinput";

    function createSelect(input, key, template, defaultValue) {
        var el = DOM.create(template, {defaultValue: defaultValue});

        input.data(key, el).before(el);

        return el
            .on("change", input, "handleSelectChange")
            .on("focus", input, "handleSelectFocus");
    }

    DOM.extend("input[type=time]", "orientation" in window ? function() { this.addClass(COMPONENT_CLASS) } : {
        // polyfill for desktop browsers
        constructor: function() {
            var value = this.get().split(":");

            createSelect(this, HOURS_KEY, HOURS_TEMPLATE, value[0]);
            createSelect(this, MINUTES_KEY, MINUTES_TEMPLATE, value[1]);

            // 1. remove legacy dateinput
            // 2. set tabindex=-1 because there are hidden selects instead
            this
                .set({type: "text", autocomplete: "off", readonly: true, tabindex: -1})
                .addClass(COMPONENT_CLASS);

            if (this.matches(":focus")) this.data(HOURS_KEY).fire("focus");
        },
        handleSelectChange: function(target) {
            this
                .set(this.data(HOURS_KEY).get() + ":" + this.data(MINUTES_KEY).get())
                .handleSelectFocus(target);
        },
        handleSelectFocus: function(target) {
            var isHoursFocused = target === this.data(HOURS_KEY),
                start = isHoursFocused ? 0 : 3,
                end = isHoursFocused ? 2 : 5;

            this.legacy(function(node) {
                if (node.setSelectionRange) {
                    node.setSelectionRange(start, end);
                } else if (node.selectionStart !== undefined) {
                    node.selectionStart = start;
                    node.selectionEnd = end;
                }
            });
        }
    });
}(window.DOM));
