import autocomplete from "autocompleter";
const addAutocompletes = (autocompletes) => autocompletes.forEach(({ autocompleteName, filter }) => {
    const inputEl = document.querySelector(`#${autocompleteName}`);
    const optionsRoute = `/${autocompleteName}s/all`;
    autocomplete({
        input: inputEl,
        fetch: function (text, update) {
            window
                .fetch(optionsRoute)
                .then((res) => res.json())
                .then((data) => {
                text = text.toLowerCase();
                const suggestions = data.filter((data) => data.nom.toLowerCase().includes(text));
                update(filter
                    ? suggestions.filter((suggestion) => suggestion[filter])
                    : suggestions);
            });
        },
        onSelect: function (item) {
            const suggestion = item;
            if (suggestion) {
                const { nom } = suggestion;
                this.input.value = nom;
            }
        },
        render: function (item) {
            const suggestion = item;
            if (suggestion) {
                const nom = suggestion.nom;
                const div = document.createElement("div");
                div.setAttribute("id", `autocomplete-${autocompleteName}`);
                div.textContent = nom;
                div.classList.add("autocomplete-suggestions");
                return div;
            }
        },
    });
});
export default window.addAutocompletes = addAutocompletes;
