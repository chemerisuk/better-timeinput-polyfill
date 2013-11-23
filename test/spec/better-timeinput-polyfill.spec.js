describe("better-timeinput-polyfill", function() {
    "use strict";

    var el;

    beforeEach(function() {
        el = DOM.mock("form>input[type=time]").find("input");
    });

    it("should block input of all chars except numbers and controls", function() {
        function checkKey(key, shiftKey, expected) {
            expect(el.handleTimeInputKeydown(key, shiftKey)).toBe(expected);
        }

        checkKey(9,  false, true);    // tab
        checkKey(37, false, true);    // left
        checkKey(38, false, true);    // up
        checkKey(39, false, true);    // right
        checkKey(40, false, true);    // down
        checkKey(186, true, true);    // ':'
        checkKey(186, false, false);  // ';'

        checkKey(65, false, false);   // 'a'
        checkKey(90, false, false);   // 'z'
        checkKey(65, true, false);    // 'A'
        checkKey(90, true, false);    // 'Z'
    });

    it("should revert previous valid value if current is not ok", function() {
        el.handleTimeInputChange();
        expect(el.get()).toBe("");

        el.set("55:55");
        el.handleTimeInputChange();
        expect(el.get()).toBe("");

        el.set("12:12");
        el.handleTimeInputChange();
        expect(el.get()).toBe("12:12");

        el.set("55:55");
        el.handleTimeInputChange();
        expect(el.get()).toBe("12:12");
    });

    it("should reset controls on form reset", function() {
        var timeinput = el.data("time-input"),
            timemedian = el.data("time-median");

        timeinput.data("defaultValue", "111").set("123");
        timemedian.set("defaultValue", "222").next().set("321");

        el.handleFormReset();

        expect(timeinput.get()).toBe("111");
        expect(timemedian.next().get()).toBe("222");
    });
});
