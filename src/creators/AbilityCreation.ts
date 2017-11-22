import {parsePT} from "../Utilities";
import {stringToColor, stringToSubtype, stringToType} from "../structures/Typeline";
import {Ability} from "../structures/Ability";
import {Effect} from "../structures/Effect";
import {
    AddTypeModification,
    SetColorToModification,
    SetPowerToughnessModification,
    SwitchPTModification,
    LosePrimitiveModification,
    ControlChangeModification
} from "../structures/Modification";
import {AcquisitionCondition, ComplexAcquisition} from "../structures/Acquisition";

import {SingleAcquisition} from "../structures/Acquisition";
import {SilenceModification} from "../structures/Modification";


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
        if (script.trim() == "haste") {
            this.ability.primitiveName = "Haste";
            return;
        }
        if (script.trim() == "first strike") {
            this.ability.primitiveName = "First strike";
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
        if (["flying", "first strike", "haste"].includes(line)) {
            let a = new Ability();
            a.primitiveName = line;
            this.effect.modification.addGrantPrimitiveAbility(a);
        }
        else if (["this", "cardname"].includes(line)) {
            this.effect.acquisition.addSubjectThis();
        }
        else if (["switch"].includes(line)) {
            this.effect.modification.parts.push(new SwitchPTModification());
        }
        else if (line.includes("/") && !isNaN(parsePT(line)[0]) && !isNaN(parsePT(line)[1])) {
            let [power, toughness] = parsePT(line);
            this.effect.modification.addPTModification(power, toughness);
        }
        else if (!this.parsingModifications && AbilityCreator.wordForWordParse(line) != null) {
            this.effect.acquisition.addComplexAcquisition(AbilityCreator.wordForWordParse(line));
        }
        else if (line.startsWith("setcolor:")) {
            this.effect.modification.parts.push(new SetColorToModification(stringToColor(line.substr("setcolor:".length))));
        }
        else if (line.startsWith("setpt:")) {
            let [power, toughness] = parsePT(line.substr("setpt:".length));
            this.effect.modification.parts.push(new SetPowerToughnessModification(power, toughness));
        }
        else if (line.startsWith("addtype:")) {
            this.effect.modification.parts.push(new AddTypeModification(stringToType(line.substr("addtype:".length))));
        }
        else if (line.startsWith("loseprimitive:")) {
            this.effect.modification.parts.push(new LosePrimitiveModification(line.substr("loseprimitive:".length)));
        }
        else if (line.startsWith("gainscontrol:")) {
            this.effect.modification.parts.push(new ControlChangeModification(line.substr("gainscontrol:".length) == "1"));
        }
        else if (line == "silence") {
            this.effect.modification.parts.push(new SilenceModification());
        }
        else {
            this.ability.parseError = "unrecognized: " + line;
        }
    }

    private static wordForWordParse(line: string) : SingleAcquisition {
        let words = line.split(' ');
        let ca =new ComplexAcquisition();
        for (let word of words) {
            if (stringToColor(word) != null) ca.conditions.push(AcquisitionCondition.color(stringToColor(word)));
            else if (stringToType(word) != null) ca.conditions.push(AcquisitionCondition.type(stringToType(word)));
            else if (stringToSubtype(word) != null) ca.conditions.push(AcquisitionCondition.subtype(stringToSubtype(word)));
            else if (word == "youcontrol") ca.conditions.push(AcquisitionCondition.controller(true));
            else if (word == "nocontrol") ca.conditions.push(AcquisitionCondition.controller(false));
            else if (word.startsWith("non") && stringToType(word.substr(3)) != null) ca.conditions.push(AcquisitionCondition.type(stringToType(word.substr(3))).negate());
            else if (word.startsWith("non") && stringToColor(word.substr(3)) != null) ca.conditions.push(AcquisitionCondition.color(stringToColor(word.substr(3))).negate());
            else return null;
        }
        return ca;
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

export function parseAsAbility(script : string) : Ability {
    let abilityCreator = new AbilityCreator();
    abilityCreator.parseScript(script);
    return abilityCreator.ability;
}
