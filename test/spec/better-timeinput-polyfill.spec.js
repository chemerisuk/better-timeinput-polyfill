describe("better-timeinput-polyfill", function() {
    "use strict";

    var el;

    beforeEach(function() {
        el = DOM.mock("form>input[type=time]").find("input");
    });

    // it("should create two selects in constructor", function() {
    //     expect(el.data("hours-select").matches("select")).toBe(true);
    //     expect(el.data("minutes-select").matches("select")).toBe(true);
    // });

    // it("should cancel native behavior, focus and autocomplete", function() {
    //     expect(el.get("type")).toBe("text");
    //     expect(el.get("autocomplete")).toBe("off");
    //     expect(el.get("tabindex")).toBe("-1");
    // });

    // it("should append custom class", function() {
    //     expect(el.hasClass("better-timeinput")).toBe(true);
    // });

    // it("should sync input value on each select change", function() {
    //     var hoursGetSpy = spyOn(el.data("hours-select"), "get").andReturn("10"),
    //         minutesGetSpy = spyOn(el.data("minutes-select"), "get").andReturn("15");

    //     el.handleSelectChange(el.data("hours-select"));
    //     expect(hoursGetSpy).toHaveBeenCalled();
    //     expect(minutesGetSpy).toHaveBeenCalled();
    //     expect(el.get()).toBe("10:15");
    // });

    // it("should sync selection on each select focus", function() {
    //     el.legacy(function(node) {
    //         var selectionRangeSpy = spyOn(node, "setSelectionRange");

    //         el.handleSelectFocus(el.data("hours-select"));
    //         expect(selectionRangeSpy).toHaveBeenCalledWith(0, 2);

    //         el.handleSelectFocus(el.data("minutes-select"));
    //         expect(selectionRangeSpy).toHaveBeenCalledWith(3, 5);
    //     });
    // });
});
