import {Color, Typeline} from "./Typeline";
import {Ability} from "./Ability";
import {ModificationLog} from "./ModificationLog";
import {Card, Counter} from "./Card";
import {capitalizeFirstLetter, deepCopy, getCssColor, joinList, shallowCopy} from "../Utilities";

export class Permanent {
    originalCard: Card;
    name: string;
    power: number;
    color: Color[];
    toughness: number;
    typeline: Typeline;
    controlledByOpponent: boolean;
    abilities: Ability[] = [];
    phasedOut: boolean;
    counters: Counter[] = [];
    modificationLog: ModificationLog = new ModificationLog();

    cssColor(): string {
        return getCssColor(this.color);
    }

    static fromCard(card: Card): Permanent {
        let p = new Permanent();
        p.originalCard = card;
        return p;
    }

    addAbility(ability: Ability) {
        ability.nonprinted = true;
        this.abilities.push(ability);
    }

    beginStateCheck() {
        // Copy card
        this.name = this.originalCard.name;
        this.toughness = this.originalCard.toughness;
        this.power = this.originalCard.power;
        this.typeline = this.originalCard.typeline.copy();
        this.abilities = deepCopy(this.originalCard.abilities);
        this.color = shallowCopy(this.originalCard.color);
        // Blank status
        this.controlledByOpponent = false;
        this.modificationLog = new ModificationLog();
        for (let ab of this.abilities) {
            ab.effect.source = this;
            ab.effect.acquisitionResults = null;
        }
    }
    describeColors() : string {
        let scolors : string[] = [];
        for (let clr of this.color) {
            scolors.push(Color[clr].toLowerCase());
        }
        return capitalizeFirstLetter(joinList(scolors));
    }
}