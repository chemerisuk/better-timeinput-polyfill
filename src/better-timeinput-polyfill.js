(function(DOM, undefined) {
    "use strict";

    if ("orientation" in window) return; // skip mobile and tablet browsers

    DOM.extend("input[type=time]", {
        constructor: function() {
            var hoursSelect = DOM.create("select.better-timeinput-select>(option[value=$$@6]>{$$@6})*18+(option[value=$$@0]>{$$@0})*3"),
                minutesSelect = DOM.create("select.better-timeinput-select>(option[value=$$@0]>{$$@0})*60");

            // remove legacy dateinput if it exists
            // also set tabindex=-1 because there are selects instead
            this
                .set({type: "text", autocomplete: "off", readonly: true, tabindex: "-1"})
                .data({"hours-select": hoursSelect, "minutes-select": minutesSelect})
                .on("focus", function() { hoursSelect.fire("focus") })
                .addClass("better-timeinput");

            hoursSelect
                .on("change", this, "handleSelectChange")
                .on("focus", this, "handleSelectFocus")
                .on("blur", this, "handleSelectBlur");

            minutesSelect
                .on("change", this, "handleSelectChange")
                .on("focus", this, "handleSelectFocus")
                .on("blur", this, "handleSelectBlur");

            this.before(hoursSelect, minutesSelect);
        },
        handleSelectChange: function(target) {
            this
                .set(this.data("hours-select").get() + ":" + this.data("minutes-select").get())
                .handleSelectFocus(target);
        },
        handleSelectFocus: function(target) {
            var start = target === this.data("hours-select") ? 0 : 3,
                end = target === this.data("hours-select") ? 2 : 5;

            this.legacy(function(node) {
                if (node.setSelectionRange) {
                    node.setSelectionRange(start, end);
                } else if (node.selectionStart !== undefined) {
                    node.selectionStart = start;
                    node.selectionEnd = end;
                }
            });

            this.addClass("better-timeinput-focus");
        },
        handleSelectBlur: function() {
            this.removeClass("better-timeinput-focus");
        }
    });

}(window.DOM));
