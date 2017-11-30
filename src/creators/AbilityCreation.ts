import {capitalizeFirstLetter, parsePT} from "../Utilities";
import {stringToColor, stringToLandType, stringToSubtype, stringToType} from "../structures/Typeline";
import {Ability} from "../structures/Ability";
import {Effect} from "../structures/Effect";
import {
    AddTypeModification,
    SetColorToModification,
    SetPowerToughnessModification,
    SwitchPTModification,
    LosePrimitiveModification,
    ControlChangeModification,
    ChangelingModification, AddAbilityModification, LoseColorsModification, AddColorModification, Controller,
    SetSubtypeModification, AddSubtypeModification, PowerToughnessModification, ChangeLandTypeModification
} from "../effects/Modifications";
import {AcquisitionCondition, ComplexAcquisition} from "../structures/Acquisition";

import {SingleAcquisition} from "../structures/Acquisition";
import {SilenceModification} from "../effects/Modifications";
import {NamedAbilities} from "./NamedAbilities";
import {primitiveAbilities} from "./PrimitiveAbilities";
import {LandType} from "../enumerations/LandType";


class AbilityCreator {
    ability : Ability = new Ability();
    effect: Effect = new Effect();
    parsingModifications: boolean = false;
    parseScript(script : string): void {
        let lines = script.split("\n");
        if (primitiveAbilities.includes(script.trim())) {
            this.ability.primitiveName = capitalizeFirstLetter(script.trim());
            return;
        }
        if (script.trim().endsWith("walk") && !script.includes("\n")) {
            this.ability.landwalk = stringToLandType(script.trim().substr(0, script.trim().indexOf("walk")));
        }
        if (!script.includes("\n") && script.toLowerCase().trim().startsWith("protection:")) {
            this.ability.protectionFrom = stringToColor(script.toLowerCase().trim().substr("protection:".length));
        }
        if (script.trim() == "changeling") {
            this.ability.effect.acquisition.addSubjectThis();
            this.ability.effect.modification.parts.push(new ChangelingModification());
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
        if (primitiveAbilities.includes(line)) {
            let a = new Ability();
            a.primitiveName = line;
            this.effect.modification.parts.push(new AddAbilityModification(a));
        }
        else if (["this", "cardname"].includes(line)) {
            this.effect.acquisition.addSubjectThis();
        }
        else if (["switch"].includes(line)) {
            this.effect.modification.parts.push(new SwitchPTModification());
        }
        else if (line.includes("/") && !isNaN(parsePT(line)[0]) && !isNaN(parsePT(line)[1])) {
            let [power, toughness] = parsePT(line);
            this.effect.modification.parts.push(new PowerToughnessModification(power, toughness));
        }
        else if (!this.parsingModifications && AbilityCreator.wordForWordParse(line) != null) {
            this.effect.acquisition.addComplexAcquisition(AbilityCreator.wordForWordParse(line));
        }
        else if (line.startsWith("setcolor:")) {
            this.effect.modification.parts.push(new SetColorToModification(stringToColor(line.substr("setcolor:".length))));
        }
        else if (line.startsWith("addcolor:")) {
            this.effect.modification.parts.push(new AddColorModification(stringToColor(line.substr("addcolor:".length))));
        }
        else if (line.startsWith("setpt:")) {
            let [power, toughness] = parsePT(line.substr("setpt:".length));
            this.effect.modification.parts.push(new SetPowerToughnessModification(power, toughness));
        }
        else if (line.startsWith("addtype:")) {
            this.effect.modification.parts.push(new AddTypeModification(stringToType(line.substr("addtype:".length))));
        }
        else if (line.startsWith("setsubtype:")) {
            this.effect.modification.parts.push(new SetSubtypeModification(stringToSubtype(line.substr("setsubtype:".length))));
        }
        else if (line.startsWith("addsubtype:")) {
            this.effect.modification.parts.push(new AddSubtypeModification(stringToSubtype(line.substr("addsubtype:".length))));
        }
        else if (line.startsWith("changetype:")) {
            const res = line.substr("changetype:".length);
            const split = res.split("=>");
            const from = stringToLandType(split[0]);
            const to = stringToLandType(split[1]);
            this.effect.modification.parts.push(new ChangeLandTypeModification(from, to));
        }
        else if (line.startsWith("loseprimitive:")) {
            this.effect.modification.parts.push(new LosePrimitiveModification(line.substr("loseprimitive:".length)));
        }
        else if (line.startsWith("gainscontrol:")) {
            let controller : Controller = Controller.Controller;
            let who = line.substr("gainscontrol:".length);
            switch (who){
                case "1": controller = Controller.PlayerOne; break;
                case "2": controller = Controller.PlayerTwo; break;
                case "you": controller = Controller.Controller; break;
                case "opponent": controller = Controller.Opponent; break;
            }
            this.effect.modification.parts.push(new ControlChangeModification(controller));
        }
        else if (line.startsWith("addability:")) {
            const innerAbility = line.substr("addability:".length).replace(";", "\n");
            this.effect.modification.parts.push(new AddAbilityModification(parseAsAbility(innerAbility)));
        }
        else if (line == "silence") {
            this.effect.modification.parts.push(new SilenceModification());
        }
        else if (line == "losecolors") {
            this.effect.modification.parts.push(new LoseColorsModification());
        }
        else if (line.startsWith("namedability:")) {
            this.effect.modification.parts.push(new AddAbilityModification(NamedAbilities.create(line.substr("namedability:".length))));
        }
        else if (line.startsWith("namedeffect:")) {
            this.effect.modification.parts.push(NamedAbilities.createSingleModification(line.substr("namedeffect:".length)));
        }
        else {
            this.ability.parseError = "unrecognized! " + line;
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
            else if (word == "other") ca.conditions.push(AcquisitionCondition.nonself());
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
