(function () {
    angular.module('WeDo').directive('ngEnter', ngEnter);

    ngEnter.$inject = ['$parse'];

    function ngEnter($parse) {
        return {
            restrict: 'A',
            compile: function($element, attr) {
                var fn = $parse(attr.ngEnter, null, true);
                return function(scope, element) {
                    element.on("keydown keypress", function(event) {
                        if (event.which === 13) {

                            // This will pass event where the expression used $event
                            fn(scope, { $event: event });
                            scope.$apply();
                            event.preventDefault();
                        }
                    });
                };
            }
        };
    }
})();