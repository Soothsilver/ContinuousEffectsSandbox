import {CardRecipe, SampleLoader} from "./examples/SampleLoader";
import {IScope} from "./definition-files/angular";
import {Card, Counter} from "./structures/Card";
import {StateCheck} from "./StateCheck";
import {parseAsAbility} from "./creators/AbilityCreation";
import {CardCreator} from "./creators/CardCreator";
import {Examples} from "./examples/Examples";
import {Permanent} from "./structures/Permanent";
import {Scenario} from "./examples/Scenario";
import {ScenarioLoader} from "./examples/ScenarioLoader";

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
    createScenario: (scenario : Scenario) => void;
}

var mainscope : PrimaryScope;

function reevaluateValues() {
    const stateCheck = new StateCheck();
    stateCheck.perform(mainscope.battlefield);
}
angular.module('PrimaryApp', [])

.controller('PrimaryController', function ($scope : PrimaryScope) {
   $scope.greeting = "Hello";
   $scope.battlefield = [];
   $scope.hand  = [ Card.createBear() ];

   mainscope = $scope;
   $scope.abilityCreatorToString = function () {
       if (!$scope.abilityCreatorScript) {
           return;
       }
        return parseAsAbility($scope.abilityCreatorScript).toString();
   };
   $scope.createExample = (id) =>{
       Examples.createExample(id, $scope.battlefield, $scope.hand);
       reevaluateValues();
   };
   $scope.abilityCreatorAdd = function () {
        let ab = parseAsAbility($scope.abilityCreatorScript);
        $scope.abilityCreatorCard.abilities.push(ab);
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
        $scope.cardCreatorScript = "Elf\n1/1 green creature";
        recalculateCardCreatorTempCard();
        $("#cardCreator").modal();
   };

   $scope.cardCreatorToCard = function () : Card {
       return $scope.cardCreatorTempCard;
   };
   $scope.cardCreatorCreate = function () {
       $scope.hand.push( CardCreator.parse($scope.cardCreatorScript) );
   };
   $scope.drawArtifact = function () {
       $scope.hand.push(Card.createArtifact());
       reevaluateValues();
   };
   $scope.drawBear = function () {
        $scope.hand.push(Card.createBear());
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
                mainscope.abilityCreatorScript = "This\ngets\n+1/+1";
                $("#abilityCreator").modal();
            }
        }
    };
})
.directive('zone', function () {
   return {
       templateUrl: './templates/zone.html',
       scope: {
           caption: '@'
       },
       transclude: true,
   };
});