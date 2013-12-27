describe("better-timeinput-polyfill", function() {
    "use strict";

    var el, timeinput, ampmselect;

    beforeEach(function() {
        el = DOM.mock("form>input[type=time]").find("input");
        timeinput = DOM.mock();
        ampmselect = DOM.mock();
    });

    it("should block input of all chars except numbers and controls", function() {
        function checkKey(key, shiftKey, expected) {
            expect(el.onKeydown(key, shiftKey)).toBe(expected);
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
        var spy = spyOn(timeinput, "set");

        spyOn(timeinput, "get").andReturn("12:12");

        el.set("10:10");
        el.onChange(timeinput, ampmselect);
        expect(spy).toHaveBeenCalledWith("10:10");

        el.set("55:55");
        el.onChange(timeinput, ampmselect);
        expect(spy).toHaveBeenCalledWith("12:12");
    });

    it("should reset controls on form reset", function() {
        var timeinputSpy = spyOn(timeinput, "set")/*,
            ampmselectSpy = spyOn(ampmselect, "set")*/;

        spyOn(timeinput, "data").andReturn("123");
        // spyOn(ampmselect, "data").andReturn("321");

        el.onFormReset(timeinput, ampmselect);

        expect(timeinputSpy).toHaveBeenCalledWith("123");
        // expect(ampmselectSpy).toHaveBeenCalledWith("321");
    });
});
