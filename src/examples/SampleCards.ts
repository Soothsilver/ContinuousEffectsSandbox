import {CardRecipe} from "./SampleLoader";

export const definitions : CardRecipe[] = [
  {
    "name": "Trained Armodon",
    "card": "3/3 green Elephant creature",
    "abilities" : []
  },
  {
    "name": "Blue Silencer",
    "card": "red 1/1 creature",
    "abilities": [
      ["First strike"],
      ["blue creatures", "blue artifacts", "gain", "silence"]
    ]
  },
  {
      "name": "Opalescence",
      "card": "white enchantment",
      "abilities": [
          ["other enchantment", "addtype:creature", "setpt:5/5"]
      ]
  }
];