(function(DOM, undefined) {
    "use strict";

    if ("orientation" in window) return; // skip mobile and tablet browsers

    function createSelect(input, defaultValue, template) {
        var el = DOM.create(template).set(defaultValue),
            selected = el.children().filter(function(el) { return el.get() === defaultValue })[0];

        if (selected) selected.legacy(function(node) { node.setAttribute("selected", "selected") });

        return el
            .on("change", input, "handleSelectChange")
            .on("focus", input, "handleSelectFocus")
            .on("blur", input, "handleSelectBlur");
    }

    DOM.extend("input[type=time]", {
        constructor: function() {
            var value = this.get().split(":"),
                hoursSelect = createSelect(this, value[0], "select.better-timeinput-select>(option[value=$$@6]>{$$@6})*18+(option[value=$$@0]>{$$@0})*3"),
                minutesSelect = createSelect(this, value[1], "select.better-timeinput-select>(option[value=$$@0]>{$$@0})*60");

            // remove legacy dateinput
            // set tabindex=-1 because there are selects instead
            this
                .set({type: "text", autocomplete: "off", readonly: true, tabindex: "-1"})
                .data({"hours-select": hoursSelect, "minutes-select": minutesSelect})
                .addClass("better-timeinput")
                .before(hoursSelect, minutesSelect);
        },
        handleSelectChange: function(target) {
            this
                .set(this.data("hours-select").get() + ":" + this.data("minutes-select").get())
                .handleSelectFocus(target);
        },
        handleSelectFocus: function(target) {
            var start = target === this.data("hours-select") ? 0 : 3,
                end = target === this.data("hours-select") ? 2 : 5;

            this
                .addClass("better-timeinput-focus")
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
            this.removeClass("better-timeinput-focus");
        }
    });

}(window.DOM));
