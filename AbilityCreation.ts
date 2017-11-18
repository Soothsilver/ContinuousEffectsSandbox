
class AbilityCreator {
    ability : Ability = new Ability();
    effect: Effect = new Effect();
    parsingModifications: boolean = false;
    parseScript(script : string): void {
        let lines = script.split("\n");
        if (script.trim() == "flying") {
            this.ability.primitiveName = "Flying";
            return;
        }
        for (let i = 0; i < lines.length; i++) {
            this.parseLine(lines[i].trim().toLowerCase());
        }
        this.ability.effect = this.effect;
    }

    private parseLine(line : string) {
        if (line == "") return;
        if (line.substr(0,2) == "//") return;
        if (this.checkForMiddleLine(line)) return;
        if (["flying"].includes(line)) {
            this.effect.modification.addGrantPrimitiveAbility(Ability.flying());
        }
        else if (["this", "cardname"].includes(line)) {
            this.effect.acquisition.addSubjectThis();
        }
        else if (["switch"].includes(line)) {
            this.effect.modification.parts.push(new SwitchPTModification());
        }
        else if (line.includes("/") && !isNaN(this.parsePT(line)[0]) && !isNaN(this.parsePT(line)[1])) {
            let [power, toughness] = this.parsePT(line);
            this.effect.modification.addPTModification(power, toughness);
        }
        else {
            this.ability.parseError = "unrecognized: " + line;
        }
    }

    private parsePT(line: string) : [number, number] {
        let split = line.split("/");
        let power = split[0].trim();
        if (power[0] == '+') {
            power = power.substr(1);
        }
        let toughenss = split[1].trim();
        if (toughenss[0] == '+') {
            toughenss = toughenss.substr(1);
        }
        return [Number.parseInt(power), Number.parseInt(toughenss)];
    }

    private checkForMiddleLine(line: string) :boolean {
        let gwords: string[] = ["get", "gets", "has", "have", "gain", "gains"];
        if (gwords.includes(line)) {
            this.parsingModifications = true;
            return true;
        }
        return false;
    }
}

function parseAsAbility(script : string) : Ability {
    console.log('p');
    let abilityCreator = new AbilityCreator();
    abilityCreator.parseScript(script);
    return abilityCreator.ability;
}
