import {assert, expect} from "chai";
import {ScenarioLoader} from "../src/examples/ScenarioLoader";


describe('Scenario', ()=>{
    let scenarios = ScenarioLoader.loadAllScenarios();
    for (let scenario of scenarios) {
        describe(scenario.name, () => {
           scenario.test();
        });
    }
});