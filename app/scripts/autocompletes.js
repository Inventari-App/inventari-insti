const autocomplete = require("autocompleter");

const addAutocompletes = autocompletes => autocompletes.forEach((autocompleteName) => {
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
          var suggestions = data.filter((data) =>
            data.nom.toLowerCase().includes(text),
          );
          update(suggestions);
        });
    },

    onSelect: function (suggestion) {
      const { nom } = suggestion;
      this.input.value = nom;
    },

    render: function (suggestion) {
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

export default window.addAutocompletes = addAutocompletes
