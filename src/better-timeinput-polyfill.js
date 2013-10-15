(function(DOM, undefined) {
    "use strict";

    if ("orientation" in window) return; // skip mobile and tablet browsers

    var HOURS_KEY = "hours-select",
        HOURS_TEMPLATE = DOM.template("select.better-timeinput-select>(option>{$$@6})*18+(option>{$$@0})*3"),
        MINUTES_KEY = "minutes-select",
        MINUTES_TEMPLATE = DOM.template("select.better-timeinput-select>option>{00}^option>{05}^(option>{$0}^option>{$5})*5"),
        FOCUS_CLASS = "better-timeinput-focus";

    function createSelect(input, key, template, defaultValue) {
        var el = DOM.create(template, {defaultValue: defaultValue});

        input.data(key, el).before(el);

        return el
            .on("change", input, "handleSelectChange")
            .on("focus", input, "handleSelectFocus")
            .on("blur", input, "handleSelectBlur");
    }

    DOM.extend("input[type=time]", {
        constructor: function() {
            var value = this.get().split(":");

            createSelect(this, HOURS_KEY, HOURS_TEMPLATE, value[0]);
            createSelect(this, MINUTES_KEY, MINUTES_TEMPLATE, value[1]);

            // remove legacy dateinput
            // set tabindex=-1 because there are selects instead
            this
                .set({type: "text", autocomplete: "off", readonly: true, tabindex: "-1"})
                .addClass("better-timeinput");

            if (this.matches(":focus")) this.data(HOURS_KEY).fire("focus");
        },
        handleSelectChange: function(target) {
            this
                .set(this.data(HOURS_KEY).get() + ":" + this.data(MINUTES_KEY).get())
                .handleSelectFocus(target);
        },
        handleSelectFocus: function(target) {
            var start = target === this.data(HOURS_KEY) ? 0 : 3,
                end = target === this.data(HOURS_KEY) ? 2 : 5;

            this
                .addClass(FOCUS_CLASS)
                .legacy(function(node) {
                    if (node.setSelectionRange) {
                        node.setSelectionRange(start, end);
                    } else if (node.selectionStart !== undefined) {
                        node.selectionStart = start;
                        node.selectionEnd = end;
                    }
                });
        },
        handleSelectBlur: function() {
            this.removeClass(FOCUS_CLASS);
        }
    });
}(window.DOM));
