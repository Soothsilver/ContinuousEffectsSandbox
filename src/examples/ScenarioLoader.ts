import {Scenario} from "./Scenario";
import {Scenarios} from "./Scenarios";

export class ScenarioLoader {

    static loadAllScenarios() : Scenario[] {
        return Scenarios;
    }
}