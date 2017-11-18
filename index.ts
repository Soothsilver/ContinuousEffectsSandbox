import {IScope} from "./angular";

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
    drawBear : () => void;
    abilityCreatorCard : Card;
    abilityCreatorCardName : string;
    abilityCreatorScript : string;
    abilityCreatorToString :  () => string;
    abilityCreatorAdd :  () => void;
}

let mainscope : PrimaryScope;

function reevaluateValues() {
    for (let i = 0; i < mainscope.battlefield.length; i++) {
        let p = mainscope.battlefield[i];
        p.name = p.originalCard.name;
    }
}
angular.module('PrimaryApp', [])

.controller('PrimaryController', function ($scope : PrimaryScope) {
    console.log('he');
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
   $scope.abilityCreatorAdd = function () {
       console.log('add');
        let ab = parseAsAbility($scope.abilityCreatorScript);
        $scope.abilityCreatorCard.abilities.push(ab);
   };
   $scope.drawBear = function () {
        $scope.hand.push(Card.createBear());
        reevaluateValues();
   };
})
    .directive('displayPermanent', function () {
        return {
            //template: '<div>Hello, {{obj.name}}</div>',
            templateUrl: 'dperm.html',
            scope: {
                obj: '=',
            }
        };
    })
.directive('displayCard', function () {
    return {
        //template: '<div>Hello, {{obj.name}}</div>',
        templateUrl: 'dcard.html',
        scope: {
            obj: '=',
            hand: '=',
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
                mainscope.abilityCreatorScript = "This gets +1/+1.";
                $("#abilityCreator").modal();
            }
        }
    };
})
.directive('zone', function () {
   return {
       templateUrl: 'zone.html',
       scope: {
           caption: '@'
       },
       transclude: true
   };
});