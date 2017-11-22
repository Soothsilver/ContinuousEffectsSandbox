import {Permanent} from "./Card";
import {SingleModification} from "./Effect";
import {Layer} from "../StateCheck";
import {Color, Type} from "./Typeline";
import {Ability} from "./Ability";

export class PowerToughnessModification implements SingleModification {


    power : number;
    toughness : number;

    toString(plural: boolean) : string {
        return (plural ? "get" : "gets") + " " + (this.power >= 0 ? "+" : "") + this.power + "/" +
            (this.toughness >= 0 ? "+" : "") + this.toughness;
    }
    getLayer() : Layer {
        return Layer.L7c_PnTModifications;
    }
    applyTo(target: Permanent, battlefield: Permanent[], source: Permanent) {
        target.power += this.power;
        target.toughness += this.toughness;
        target.modificationLog.ptChanged = true;

    }
    constructor(power : number, toughness : number) {
        this.power = power;
        this.toughness = toughness;

    }
}
export class ControlChangeModification implements SingleModification {
    controlGoesToYou: boolean;

    private getPlayerName() : string {
        return (this.controlGoesToYou) ? "you" : "Player 2";
    }

    toString(plural: boolean) : string {
        return (plural ? "are controlled by " : "is controlled by ") + this.getPlayerName();
    }
    getLayer() : Layer {
        return Layer.L2_Control;
    }
    applyTo(target: Permanent, battlefield: Permanent[], source: Permanent) {
        target.controlledByOpponent = !this.controlGoesToYou;

    }
    constructor(controlGoesToYou : boolean) {
        this.controlGoesToYou = controlGoesToYou;

    }
}
export class SilenceModification implements SingleModification {
    toString(plural: boolean) {
        return (plural ? "lose all abilities" : "loses all abilities");
    }

    getLayer(): Layer {
        return Layer.L6_Abilities;
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Permanent) {
        target.abilities.length = 0;
    }
}
export class LosePrimitiveModification implements SingleModification {
    private abilityname: string;
    constructor(abilityname : string) {
        this.abilityname = abilityname;
    }

    getLayer(): Layer {
        return Layer.L6_Abilities;
    }

    toString(plural: boolean) {
        return (plural ? "lose" : "loses") + " " + this.abilityname.toLowerCase();
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Permanent) {
        target.abilities = target.abilities.filter(ability => ability.primitiveName.toLowerCase() != this.abilityname.toLowerCase());
    }

}
export class SetColorToModification implements SingleModification {
    private clr: Color;

    constructor(clr : Color) {
        this.clr = clr;
    }

    getLayer(): Layer {
        return Layer.L5_Color;
    }
    applyTo(target: Permanent, battlefield: Permanent[], source: Permanent) {
        target.color = [this.clr];
    }
    toString(plural: boolean) {
        return (plural ? "are" : "is") + " " + Color[this.clr].toLowerCase();
    }
}
export class SetPowerToughnessModification implements SingleModification {
    private power: number;
    private toughness: number;

    constructor(power : number, toughness: number) {
        this.power = power;
        this.toughness = toughness;
    }

    getLayer(): Layer {
        return Layer.L7b_PnTSetSpecificValue;
    }

    toString(plural: boolean) {
        return (plural ? "have base power and toughness" : "has base power and toughness") + " " + this.power + "/" + this.toughness;
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Permanent) {
        target.power = this.power;
        target.toughness = this.toughness;
        target.modificationLog.ptChanged = true;
    }
}
export class AddTypeModification implements  SingleModification {
    private type: Type;

    constructor(type : Type) {
        this.type = type;
    }

    getLayer(): Layer {
        return Layer.L4_Type;
    }

    toString(plural: boolean) {
        return (plural ? "are" : "is a") + " " + Type[this.type].toLowerCase() + (plural ? "s in addition to their other types" : " in addition to its other types.");
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Permanent) {
        target.typeline.types.push(this.type);
        target.modificationLog.addType(Type[this.type]);
    }
}
export class AddAbilityModification implements SingleModification {

    toString(plural: boolean) {
        return (plural ? "have" : "has") + " " + this.addWhat.toString();
    }

    addWhat: Ability;

    getLayer() : Layer {
        return Layer.L6_Abilities;
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Permanent)  {
        target.addAbility(this.addWhat.copyAndInitialize(target));
    }
    constructor(addWhat :Ability) {
        this.addWhat = addWhat;
    }

}
export class SwitchPTModification implements SingleModification {
    getLayer(): Layer {
        return Layer.L7e_PnTSwitch;
    }

    toString(plural: boolean) {
        return (plural ? "have their power and toughness switched" : "has its power and toughness switched");
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Permanent) {
        const swap = target.toughness;
        target.toughness = target.power;
        target.power = swap;
        target.modificationLog.ptChanged = true;
    }

}