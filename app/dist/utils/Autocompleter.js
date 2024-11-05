"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Autocompleter;
function Autocompleter({ autocomplete, inputEl, optionsRoute, onSelect, render, }) {
    return autocomplete({
        input: inputEl,
        fetch: function (text, update) {
            fetch(optionsRoute)
                .then((res) => res.json())
                .then((data) => {
                text = text.toLowerCase();
                // you can also use AJAX requests instead of preloaded data
                const suggestions = data.filter((data) => data.nom.toLowerCase().includes(text));
                update(suggestions);
            });
        },
        onSelect,
        render,
    });
}
//# sourceMappingURL=Autocompleter.js.map