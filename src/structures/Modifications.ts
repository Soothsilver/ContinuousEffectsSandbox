import {Permanent} from "./Permanent";
import {Effect} from "./Effect";
import {Layer} from "../enumerations/Layer";
import {Color, Type} from "./Typeline";
import {Ability} from "./Ability";
import {EnumEx} from "../utils/EnumEx";
import {CreatureSubtype} from "./CreatureSubtype";
import {SingleModificationBase} from "./SingleModificationBase";

export class PowerToughnessModification extends SingleModificationBase{


    power : number;
    toughness : number;

    asString(plural: boolean) {
        return (plural ? "get" : "gets") + " " + (this.power >= 0 ? "+" : "") + this.power + "/" +
            (this.toughness >= 0 ? "+" : "") + this.toughness;
    }
    getLayer() : Layer {
        return Layer.L7c_PnTModifications;
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect) {
        target.power += this.power;
        target.toughness += this.toughness;
        target.modificationLog.ptChanged = true;

    }
    constructor(power : number, toughness : number) {
        super();
        this.power = power;
        this.toughness = toughness;

    }
}
export enum Controller {
    PlayerOne,
    PlayerTwo,
    Controller,
    Opponent
}
export class ControlChangeModification extends SingleModificationBase {
    controlGoesTo: Controller;

    private getPlayerName() : string {
        switch (this.controlGoesTo){
            case Controller.PlayerOne:
                return "Player 1";
            case Controller.PlayerTwo:
                return "Player 2";
            case Controller.Controller:
                return "this permanent's controller";
            case Controller.Opponent:
                return "this permanent's controller's opponent";
        }
    }

    asString(plural: boolean) {
        return (plural ? "are controlled by " : "is controlled by ") + this.getPlayerName();
    }
    getLayer() : Layer {
        return Layer.L2_Control;
    }


    private giveControlToOpponent(self : Permanent) {
        switch (this.controlGoesTo){
            case Controller.Opponent:
                return  !self.controlledByOpponent;
            case Controller.Controller:
                return self.controlledByOpponent;
            case Controller.PlayerOne:
                return false;
            case Controller.PlayerTwo:
                return true;
        }
        throw new Error("Bad value");
    }

    whatItDoes(target: Permanent, battlefield: Permanent[], source: Effect): string {
        return this.giveControlToOpponent(source.source) ? "GIVE_CONTROL_TO_PLAYER_TWO" : "GIVE_CONTROL_TO_PLAYER_ONE";
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect) {
        target.controlledByOpponent = this.giveControlToOpponent(source.source);
    }
    constructor(controlGoesTo : Controller) {
        super();
        this.controlGoesTo = controlGoesTo;
    }
}
export class SilenceModification extends SingleModificationBase{
    asString(plural: boolean) {
        return (plural ? "lose all abilities" : "loses all abilities");
    }

    getLayer(): Layer {
        return Layer.L6_Abilities;
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect) {
        for (let ab of target.abilities) {
            target.modificationLog.addStrickenAbility(ab);
        }
        target.abilities.length = 0;
    }
}
export class LosePrimitiveModification  extends SingleModificationBase {
    private abilityname: string;
    constructor(abilityname : string) {
        super();
        this.abilityname = abilityname;
    }

    getLayer(): Layer {
        return Layer.L6_Abilities;
    }

    asString(plural: boolean) {
        return (plural ? "lose" : "loses") + " " + this.abilityname.toLowerCase();
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect) {
        let remainingAbilities = target.abilities.filter(ability => ability.primitiveName.toLowerCase() != this.abilityname.toLowerCase());
        let removedAbilities = target.abilities.filter(ability => ability.primitiveName.toLowerCase() == this.abilityname.toLowerCase());
        target.abilities = remainingAbilities;
        for (let ab of removedAbilities) {
            target.modificationLog.addStrickenAbility(ab);
        }
    }

}
export class AddColorModification  extends SingleModificationBase {
    private clr: Color;

    constructor(clr : Color) {
        super();
        this.clr = clr;
    }

    getLayer(): Layer {
        return Layer.L5_Color;
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect) {
        if (target.color.includes(this.clr)) return;
        target.color.push(this.clr);
    }

    asString(plural: boolean) {
        return (plural ? "are" : "is") + " " + Color[this.clr].toLowerCase() + " in addition to " + (plural ? "their" : "its") + " other colors";
    }
}
export class SetColorToModification extends SingleModificationBase {
    private clr: Color;

    constructor(clr : Color) {
        super();
        this.clr = clr;
    }

    getLayer(): Layer {
        return Layer.L5_Color;
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect) {
        target.color = [this.clr];
    }

    asString(plural: boolean) {
        return (plural ? "are" : "is") + " " + Color[this.clr].toLowerCase();
    }
}
export class SetPowerToughnessModification  extends SingleModificationBase {
    private power: number;
    private toughness: number;

    constructor(power : number, toughness: number) {
        super();
        this.power = power;
        this.toughness = toughness;
    }

    getLayer(): Layer {
        return Layer.L7b_PnTSetSpecificValue;
    }

    asString(plural: boolean) {
        return (plural ? "have base power and toughness" : "has base power and toughness") + " " + this.power + "/" + this.toughness;
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect) {
        target.power = this.power;
        target.toughness = this.toughness;
        target.modificationLog.ptChanged = true;
    }
}
export class ChangelingModification  extends SingleModificationBase {
    getLayer(): Layer {
        return Layer.L4_Type;
    }

    asString(plural: boolean) {
        return (plural ?"are" :"is") +" every creature type";
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect) {
        target.typeline.creatureSubtypes.length = 0;
        for (let subtype of EnumEx.getValues(CreatureSubtype)) {
            target.typeline.creatureSubtypes.push(subtype);
            target.modificationLog.addType(CreatureSubtype[subtype]);
        }
    }
}
export class AddTypeModification  extends SingleModificationBase {
    private type: Type;

    constructor(type : Type) {
        super();
        this.type = type;
    }

    getLayer(): Layer {
        return Layer.L4_Type;
    }

    asString(plural: boolean) {
        return (plural ? "are" : "is a") + " " + Type[this.type].toLowerCase() + (plural ? "s in addition to their other types" : " in addition to its other types");
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect) {
        if (target.typeline.types.includes(this.type)) return;
        target.typeline.types.push(this.type);
        target.modificationLog.addType(Type[this.type]);
    }
}
export class LoseColorsModification  extends SingleModificationBase {
    getLayer(): Layer {
        return Layer.L5_Color;
    }

    asString(plural: boolean) {
        return (plural ? "lose all colors" : "loses all colors");
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect) {
        target.color = [];
    }

}
export class AddAbilityModification  extends SingleModificationBase {

    asString(plural: boolean) {
        let abilityDescription = this.addWhat.toString();
        return (plural ? "have" : "has") + " " + (this.addWhat.primitiveName != null ? abilityDescription.toLowerCase() : ("\"" + abilityDescription + "\""));
    }

    addWhat: Ability;

    getLayer() : Layer {
        return Layer.L6_Abilities;
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect)  {
        target.addAbility(this.addWhat.copyAndInitialize(target), source);
    }
    constructor(addWhat :Ability) {
        super();
        this.addWhat = addWhat;
    }

}
export class SwitchPTModification  extends SingleModificationBase {
    getLayer(): Layer {
        return Layer.L7e_PnTSwitch;
    }

    asString(plural: boolean) {
        return (plural ? "have their power and toughness switched" : "has its power and toughness switched");
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect) {
        const swap = target.toughness;
        target.toughness = target.power;
        target.power = swap;
        target.modificationLog.ptChanged = true;
    }

}