export module SampleLoader {
    /*
                        Cditor()">Custom...</a></li>*/
    export function addSampleCards() {
        addSampleCardToDOM('a', 'b');
    }

    export function addSampleCardToDOM(name : string, card : string) {
        let html = '<li class="dropdown-item"><a href="#" ng-click="drawCustomCard(\"'+
            card
            +'\")">'+name+'</a></li>';
        $("#sample-card-dropdown").append(html)
    }
}