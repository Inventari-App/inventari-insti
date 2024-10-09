import autocomplete, { AutocompleteItem } from "autocompleter";

interface AutocompleteI {
  autocompleteName: string;
  filter: string;
}

interface Suggestion extends AutocompleteItem {
  nom: string;
}

const addAutocompletes = (autocompletes: AutocompleteI[]) =>
  autocompletes.forEach(({ autocompleteName, filter }) => {
    const inputEl = document.querySelector(`#${autocompleteName}`);
    const optionsRoute = `/${autocompleteName}s/all`;

    autocomplete({
      input: inputEl! as HTMLInputElement,
      fetch: function (text: string, update) {
        window
          .fetch(optionsRoute)
          .then((res) => res.json())
          .then((data) => {
            text = text.toLowerCase();
            const suggestions = data.filter((data: Suggestion) =>
              data.nom.toLowerCase().includes(text),
            );
            update(
              filter
                ? suggestions.filter(
                    (suggestion: { [key: string]: string }) =>
                      suggestion[filter],
                  )
                : suggestions,
            );
          });
      },

      onSelect: function (item) {
        const suggestion = item as Suggestion;
        if (suggestion) {
          const { nom } = suggestion;
          this.input.value = nom;
        }
      },

      render: function (item) {
        const suggestion = item as Suggestion;
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
