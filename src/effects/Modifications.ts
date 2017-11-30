import {Permanent} from "../structures/Permanent";
import {Effect} from "../structures/Effect";
import {Layer} from "../enumerations/Layer";
import {Color, Type} from "../structures/Typeline";
import {Ability} from "../structures/Ability";
import {EnumEx} from "../utils/EnumEx";
import {CreatureSubtype} from "../structures/CreatureSubtype";
import {SingleModificationBase} from "../structures/SingleModificationBase";
import {LandType} from "../enumerations/LandType";
import {SingleModification} from "../structures/SingleModification";
import {NamedAbilities} from "../creators/NamedAbilities";

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
export class LoseTypeModification  extends SingleModificationBase {
    private type: Type;

    constructor(type : Type) {
        super();
        this.type = type;
    }

    getLayer(): Layer {
        return Layer.L4_Type;
    }

    asString(plural: boolean) {
        return (plural ? "aren't" : "isn't a") + " " + Type[this.type].toLowerCase() + (plural ? "s" : "");
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect) {
        if (target.typeline.types.includes(this.type)) {
            let index = target.typeline.types.indexOf(this.type);
            target.typeline.types.splice(index, 1);
        }
    }
}
export class AddSubtypeModification  extends SingleModificationBase {
    private type: CreatureSubtype;

    constructor(type : CreatureSubtype) {
        super();
        this.type = type;
    }

    getLayer(): Layer {
        return Layer.L4_Type;
    }

    asString(plural: boolean) {
        return (plural ? "are" : "is a") + " " + CreatureSubtype[this.type] + (plural ? "s in addition to their other types" : " in addition to its other types");
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect) {
        if (target.typeline.creatureSubtypes.includes(this.type)) return;
        target.typeline.creatureSubtypes.push(this.type);
        target.modificationLog.addType(CreatureSubtype[this.type]);
    }
}
export class AddLandTypeModification  extends SingleModificationBase {
    private type: LandType;

    constructor(type : LandType) {
        super();
        this.type = type;
    }

    getLayer(): Layer {
        return Layer.L4_Type;
    }

    asString(plural: boolean) {
        return (plural ? "are" : "is a") + " " + LandType[this.type] + (plural ? "s in addition to their other types" : " in addition to its other types");
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect) {
        if (target.typeline.landTypes.includes(this.type)) return;
        target.typeline.landTypes.push(this.type);
        target.addAbility(NamedAbilities.createInherentLandAbility(this.type), source);
        target.modificationLog.addType(LandType[this.type]);
    }
}
export class SetLandTypeModification  extends SingleModificationBase {
    private type: LandType;

    constructor(type : LandType) {
        super();
        this.type = type;
    }

    getLayer(): Layer {
        return Layer.L4_Type;
    }

    asString(plural: boolean) {
        return (plural ? "are" : "is a") + " " + LandType[this.type] + (plural ? "s" : "");
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect) {
        target.typeline.landTypes.length = 0;
        target.typeline.landTypes.push(this.type);
        for (let i = target.abilities.length - 1; i >= 0; i--) {
            let ab = target.abilities[i];
            if ((ab.primitiveName != null && ab.primitiveName.startsWith("({T}: Add")) || !ab.nonprinted) {
                target.abilities.splice(i, 1);
                target.modificationLog.addStrickenAbility(ab);
            }
        }
        target.addAbility(NamedAbilities.createInherentLandAbility(this.type), source);
        target.modificationLog.addType(LandType[this.type]);
    }
}
export class SetSubtypeModification  extends SingleModificationBase {
    private type: CreatureSubtype;

    constructor(type : CreatureSubtype) {
        super();
        this.type = type;
    }

    getLayer(): Layer {
        return Layer.L4_Type;
    }

    asString(plural: boolean) {
        return (plural ? "are" : "is a") + " " + CreatureSubtype[this.type] + (plural ? "s" : "");
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect) {
        target.typeline.creatureSubtypes.length = 0;
        target.typeline.creatureSubtypes.push(this.type);
        target.modificationLog.addType(CreatureSubtype[this.type]);
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


    copy(): SingleModification {
        return new AddAbilityModification(this.addWhat.copy());
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
export class ChangeLandTypeModification extends SingleModificationBase {
    private from: LandType;
    private to: LandType;

    constructor(from : LandType, to: LandType) {
        super();
        this.from = from;
        this.to = to;
    }

    getLayer(): Layer {
        return Layer.L3_Text;
    }

    asString(plural: boolean): string {
        return (plural ? "have" : "has") + " all instances of the word '" + LandType[this.from] + "' replaced by '" + LandType[this.to] + "'";
    }

    applyTo(target: Permanent, battlefield: Permanent[], source: Effect): void {
        if (target.typeline.landTypes.includes(this.from)) {
            target.typeline.landTypes.splice(target.typeline.landTypes.indexOf(this.from), 1);
            target.typeline.landTypes.push(this.to);
            target.modificationLog.addType(LandType[this.to]);
            for (let i = target.abilities.length - 1; i >= 0; i--) {
                let ab = target.abilities[i];
                if ((ab.primitiveName != null && ab.primitiveName.startsWith("({T}: Add")
                    && ab.primitiveName.includes(NamedAbilities.getManaSymbolFromLandType(this.from)))) {
                    target.abilities.splice(i, 1);
                    target.modificationLog.addStrickenAbility(ab);
                }
            }
            target.addAbility(NamedAbilities.createInherentLandAbility(this.to), source);
        }
        for (let ab of target.abilities) {
            this.recursivelyUpdateText(target, ab, this.from, this.to);
        }
    }

    /**
     * Copying types into parameters is necessary in case this effect modifies itself.
     */
    private recursivelyUpdateText(target : Permanent, ab: Ability, from: LandType, to: LandType) {
        if (ab.landwalk == from) {
            ab.landwalk = to;
            ab.modified = true;
        }
        for (let modif of ab.effect.modification.parts) {
            if (modif instanceof AddAbilityModification) {
                let aam : AddAbilityModification = modif;
                this.recursivelyUpdateText(target, aam.addWhat, from, to);
            }
            if (modif instanceof ChangeLandTypeModification) {
                let cltm : ChangeLandTypeModification = modif;
                if (cltm.from == from) cltm.from = to;
                if (cltm.to == from) cltm.to = to;
                ab.modified = true;
            }
        }
    }


    copy(): SingleModification {
        return new ChangeLandTypeModification(this.from, this.to);
    }
}