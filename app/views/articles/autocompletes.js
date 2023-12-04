const unitatsInputEl = document.querySelector("#unitat");
const proveidorsInputEl = document.querySelector("#proveidor");
const autocomplete = require("autocompleter");
import Autocompleter from "../../utils/Autocompleter.js";

Autocompleter({
  autocomplete: autocomplete,
  inputEl: unitatsInputEl,
  optionsRoute: "/unitats/all",
  onSelect: function (suggestion) {
    const { nom } = suggestion;
    this.input.value = nom;
  },
  render: function (suggestion) {
    if (suggestion) {
      const nom = suggestion.nom;
      const div = document.createElement("div");
      div.setAttribute("id", "autocomplete-unitat");
      div.textContent = nom;
      return div;
    }
  },
});

Autocompleter({
  autocomplete: autocomplete,
  inputEl: proveidorsInputEl,
  optionsRoute: "/proveidors/all",
  onSelect: function (suggestion) {
    const { nom } = suggestion;
    this.input.value = nom;
  },
  render: function (suggestion) {
    if (suggestion) {
      const nom = suggestion.nom;
      const div = document.createElement("div");
      div.setAttribute("id", "autocomplete-proveidor");
      div.textContent = nom;
      return div;
    }
  },
});
