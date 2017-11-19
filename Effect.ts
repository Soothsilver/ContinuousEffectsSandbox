
abstract class SingleModification {
    abstract getLayer() : Layer;
    abstract toString(plural : boolean);
    abstract applyTo(target: Permanent, battlefield: Permanent[], source: Permanent, layer : Layer);
}

class Modification  {
    parts: SingleModification[] = [];

    toString(multipleTargets : boolean) : string {
        let strs : string[] = [];
        for (let i = 0; i < this.parts.length; i++) {
            strs.push(this.parts[i].toString(multipleTargets));
        }
        return joinList(strs);
    }

    addPTModification(power: number, toughness: number) {
        this.parts.push(new PowerToughnessModification(power, toughness));
    }

    addGrantPrimitiveAbility(ab: Ability) {
        this.parts.push(new AddAbilityModification(ab));
    }
}

class Effect implements ICopiable<Effect>{

    acquisition : Acquisition = new Acquisition();
    modification : Modification = new Modification();
    startedApplyingThisStateCheck: boolean;
    lastAppliedInLayer : Layer;
    source : Permanent;

    copy(): Effect {
        let ff = new Effect();
        ff.acquisition = this.acquisition;
        ff.modification = this.modification;
        ff.startedApplyingThisStateCheck = false;
        ff.lastAppliedInLayer = Layer.L0_NoLayer;
        return ff;
    }
    toString() : string {
        console.log(capitalizeFirstLetter(this.acquisition.toString()) + " " + this.modification.toString(this.acquisition.multipleTargets) + ".");
        return capitalizeFirstLetter(this.acquisition.toString()) + " " + this.modification.toString(this.acquisition.multipleTargets) + ".";
    }

    apply(battlefield: Permanent[], layer : Layer) {
        let affectedObjects : Permanent[] = this.acquisition.getAcquiredObjects(battlefield, this.source);
        for (let m  of this.modification.parts) {
            if (m.getLayer() == layer) {
                for (let o  of affectedObjects) {
                    m.applyTo(o, battlefield, this.source, layer);
                }
                this.startedApplyingThisStateCheck = true;
            }
        }
    }
}