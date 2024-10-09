interface AutocompleterProps {
  autocomplete: any;
  inputEl: any;
  optionsRoute: string;
  onSelect: () => void;
  render: () => void;
}

export default function Autocompleter({
  autocomplete,
  inputEl,
  optionsRoute,
  onSelect,
  render,
}: AutocompleterProps) {
  return autocomplete({
    input: inputEl,
    fetch: function (text: string, update: (suggestions: string[]) => void) {
      fetch(optionsRoute)
        .then((res) => res.json())
        .then((data) => {
          text = text.toLowerCase();
          // you can also use AJAX requests instead of preloaded data
          const suggestions = data.filter((data: { nom: string }) =>
            data.nom.toLowerCase().includes(text),
          );
          update(suggestions);
        });
    },
    onSelect,
    render,
  });
}
