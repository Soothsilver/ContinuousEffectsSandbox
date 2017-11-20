namespace CardCreator {
    export function parse(script : string) : Card {
        if (!script) {
            return new Card();
        }
        let lines = script.split('\n');
        let nameLine = lines.length == 2 ? lines[0].trim() : "Unnamed";
        let rulesLine = lines.length == 2 ? lines[1].trim() : lines[0].trim();
        let c = new Card();
        c.name = nameLine;
        c.color = [];
        c.typeline = new Typeline();
        c.power = 0;
        c.toughness = 0;
        for (let w of rulesLine.split(' ')) {
            if (stringToType(w) != null) {
                c.typeline.types.push(stringToType(w));
            }
            if (stringToColor(w) != null) {
                c.color.push(stringToColor(w));
            }
            if (stringToSubtype(w) != null) {
                c.typeline.creatureSubtypes.push(stringToSubtype(w));
            }
            if (!isNaN(parsePT(w)[0])) {
               [c.power, c.toughness] = parsePT(w);
            }
        }
        return c;
    }
}