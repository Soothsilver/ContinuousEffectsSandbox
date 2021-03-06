import {CardRecipe, SampleLoader} from "./examples/SampleLoader";
import {IScope} from "./definition-files/angular";
import {Card, Counter} from "./structures/Card";
import {StateCheck} from "./StateCheck";
import {parseAsAbility} from "./creators/AbilityCreation";
import {CardCreator} from "./creators/CardCreator";
import {Permanent} from "./structures/Permanent";
import {Scenario} from "./examples/Scenario";
import {ScenarioLoader} from "./examples/ScenarioLoader";
import {Recipes} from "./examples/Recipes";
import {HashSerialization} from "./utils/HashSerialization";

function removeFromArray<T> (pole : T[], prvek : T) : boolean {
    const index = pole.indexOf(prvek);
    if (index == -1) {
        return false;
    } else {
        pole.splice(index, 1);
        return true;
    }
}


interface PrimaryScope extends IScope {
    greeting : string;
    hand : Card[];
    battlefield: Permanent[];
    phasedOut: Permanent[];
    drawBear : () => void;
    drawHumility : () => void;
    drawArtifact : () => void;
    drawExampleCard : (card: CardRecipe ) =>void;
    exampleCards: CardRecipe [];
    abilityCreatorCard : Card;
    abilityCreatorCardName : string;
    abilityCreatorScript : string;
    abilityCreatorToString :  () => string;
    abilityCreatorAdd :  () => void;
    cardCreatorScript: string;
    cardCreatorToCard: () => Card;
    cardCreatorTempCard: Card;
    cardCreatorCreate : () => void;
    detailsViewerCard : Card;
    openCustomCardEditor : ()=>void;
    createExample: (identifier : string) => void;
    allScenarios : Scenario[];
    whyButtonClick : ()=> void;
    createScenario: (scenario : Scenario) => void;
}

let mainscope : PrimaryScope;

function reevaluateValues() {
    const stateCheck = new StateCheck();
    stateCheck.perform(mainscope.battlefield);
    $("#collapsibleLog").html(stateCheck.getHtmlReport());
    window.location.hash = HashSerialization.serialize(mainscope.battlefield, mainscope.hand);
}
angular.module('PrimaryApp', [])

.controller('PrimaryController', function ($scope : PrimaryScope) {
   $scope.greeting = "Hello";
   $scope.battlefield = [];
   $scope.hand  = [ SampleLoader.createCard(Recipes.RuneclawBear) ];
   if (window.location.hash) {
       [$scope.battlefield, $scope.hand] = HashSerialization.deserialize(window.location.hash);
   }

   mainscope = $scope;
   $scope.abilityCreatorToString = function () {
       if (!$scope.abilityCreatorScript) {
           return "";
       }
       return parseAsAbility($scope.abilityCreatorScript).toString();
   };
   $scope.abilityCreatorAdd = function () {
        let split = $scope.abilityCreatorScript.split("\n");
        let ab = parseAsAbility($scope.abilityCreatorScript);
        $scope.abilityCreatorCard.abilities.push(ab);
        $scope.abilityCreatorCard.recipe.abilities.push(split);
        reevaluateValues();
   };

    function recalculateCardCreatorTempCard() {
        $scope.cardCreatorTempCard = CardCreator.parse($scope.cardCreatorScript);
    }
    $scope.drawExampleCard = function (script : CardRecipe) {
        $scope.hand.push(SampleLoader.createCard(script));
    };
    $scope.$watch('cardCreatorScript', function () {
       recalculateCardCreatorTempCard();
    });
    $scope.openCustomCardEditor = function () {
        $scope.cardCreatorTempCard = null;
        $scope.cardCreatorScript = "";
        recalculateCardCreatorTempCard();
        $("#cardCreator").modal();
   };

   $scope.cardCreatorToCard = function () : Card {
       return $scope.cardCreatorTempCard;
   };
   $scope.cardCreatorCreate = function () {
       let lines = $scope.cardCreatorScript.split("\n");
       let card = lines[0];
       let name = "Unnamed";
       if (lines.length == 2) {
           name = lines[0];
           card = lines[1];
       }
       let recipe : CardRecipe = new CardRecipe(name, card, []);
       $scope.hand.push( SampleLoader.createCard(recipe) );
   };
   $scope.drawArtifact = function () {
       $scope.hand.push(SampleLoader.createCard(Recipes.Thing));
       reevaluateValues();
   };
   $scope.drawBear = function () {
        $scope.hand.push(SampleLoader.createCard(Recipes.RuneclawBear));
        reevaluateValues();
   };
    $scope.drawHumility = function () {
        let c = CardCreator.parse("Humility\nwhite enchantment");
        c.abilities.push(parseAsAbility("creature\nget\nsetpt:1/1\nsilence"));
        $scope.hand.push(c);
        reevaluateValues();
    };

    $scope.exampleCards = SampleLoader.getCardRecipes();
    $scope.allScenarios = ScenarioLoader.loadAllScenarios();
    $scope.createScenario = function (scenario : Scenario) {
        $scope.hand = [];
        scenario.execute();
        $scope.battlefield = scenario.createdBattlefield;
        reevaluateValues();
    };
    $scope.whyButtonClick = function () {
        $('#logModal').modal();
        $('#stateCheckLog').html('<b>A</b>C');
    };

    reevaluateValues();
})
    .directive('displayPermanent', function () {
        return {
            templateUrl: './templates/dperm.html',
            scope: {
                obj: '=',
            },
            link: function (scope : any, element, attrs) {
                scope.sacrifice = function () {
                    removeFromArray(mainscope.battlefield, scope.obj);
                    reevaluateValues();
                };
                scope.phasing = function () {
                    let crd : Permanent = scope.obj;
                    crd.phasedOut = !(scope.obj).phasedOut;
                    reevaluateValues();
                };
                scope.flicker = function () {
                    let crd : Permanent = scope.obj;
                    removeFromArray(mainscope.battlefield, crd);
                    mainscope.battlefield.push(crd.originalCard.asPermanent());
                    reevaluateValues();
                };
                scope.viewAsPrinted = function () {
                   mainscope.detailsViewerCard = scope.obj.originalCard;
                   $("#detailsViewer").modal();
                };
            }
        };
    })
.directive('displayCard', function () {
    return {
        //template: '<div>Hello, {{obj.name}}</div>',
        templateUrl: './templates/dcard.html',
        scope: {
            obj: '=',
            hand: '=',
            editable: '@',
            battlefield: '='
        },
        link: function (scope : any, element, attrs) {
            scope.discardSelf = function () {
                removeFromArray(scope.hand, scope.obj);
                reevaluateValues();
            };
            scope.castSelf = function () {
                removeFromArray(scope.hand, scope.obj);
                scope.battlefield.push(Permanent.fromCard(scope.obj));
                reevaluateValues();
            };
            scope.openAbilityCreator = function () {
                mainscope.abilityCreatorCard = scope.obj;
                mainscope.abilityCreatorCardName = scope.obj.name;
                mainscope.abilityCreatorScript = "";
                $("#abilityCreator").modal();
            }
        }
    };
})
.directive('zone', function () {
   return {
       templateUrl: './templates/zone.html',
       scope: {
           caption: '@',
           showLogButton: '@',
           whyButton: '&'
       },
       transclude: true,
   };
});