'use strict';

//
// Model, data
//

var portfolioImagesData = [
    {name: 'Image #1', src: 'img/portfolio_image1.jpg', category: 'photography'},
    {name: 'Image #2', src: 'img/portfolio_image2.jpg', category: 'graphic design'},
    {name: 'Image #3', src: 'img/portfolio_image3.jpg', category: 'web'},
    {name: 'Image #4', src: 'img/portfolio_image4.jpg', category: 'graphic design'},
    {name: 'Image #5', src: 'img/portfolio_image5.jpg', category: 'web'},
    {name: 'Image #6', src: 'img/portfolio_image6.jpg', category: 'photography'}
];

var portfolioAchievementsData = [
    {text: 'Completed projects', iconSrc: 'img/portfolio_icon1.png', value: 3054},
    {text: 'Click pressed', iconSrc: 'img/portfolio_icon2.png', value: 7234873},
    {text: 'Mails sent & received', iconSrc: 'img/portfolio_icon3.png', value: 4670},
    {text: 'Jokes tolds', iconSrc: 'img/portfolio_icon4.png', value: 939}
];

var teamMembersData = [
    { name: 'John Doe #1', position: 'Graphic Designer', imageSrc: 'img/team_member1.jpg', description: 'Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Vivamus suscipit tortor eget felis porttitor volutpat.', socialLinks: {facebook: 'https://facebook.com', twitter: 'https://twitter.com', google: 'https://google.com', dribble: 'https://dribbble.com/'} },
    { name: 'John Doe #2', position: 'Graphic Designer', imageSrc: 'img/team_member1.jpg', description: 'Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Vivamus suscipit tortor eget felis porttitor volutpat.', socialLinks: {facebook: 'https://facebook.com', twitter: 'https://twitter.com', google: 'https://google.com', dribble: 'https://dribbble.com/'} },
    { name: 'John Doe #3', position: 'Graphic Designer', imageSrc: 'img/team_member1.jpg', description: 'Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Vivamus suscipit tortor eget felis porttitor volutpat.', socialLinks: {facebook: 'https://facebook.com', twitter: 'https://twitter.com', google: 'https://google.com', dribble: 'https://dribbble.com/'} },
    { name: 'John Doe #4', position: 'Graphic Designer', imageSrc: 'img/team_member1.jpg', description: 'Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Vivamus suscipit tortor eget felis porttitor volutpat.', socialLinks: {facebook: 'https://facebook.com', twitter: 'https://twitter.com', google: 'https://google.com', dribble: 'https://dribbble.com/'} },
];


//
// App, config, directives
//

var app = angular.module('landingApp', ['smoothScroll', 'ngCookies', 'ngRoute']);

app.config(function ($routeProvider) {

    $routeProvider
        .when('/', {
            reloadOnSearch: false,
            templateUrl: 'views/main.html',
            controller: 'mainCtrl',

        })
        .when('/:id', {
            reloadOnSearch: false,
            templateUrl: 'views/article.html',
            controller: 'newsSectionCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.config(function ($anchorScrollProvider) {
    $anchorScrollProvider.disableAutoScrolling();
});


app.directive('linkIdScroll', ['$location', 'smoothScroll', function ($location, smoothScroll) {

    var scrollOn = false;

    return {
        restrict: 'AE',
        scope: {},
        link: function (scope, element, attr) {

            element.on('click', function(e) {

                if ($location.path() !== '/') {
                    return;
                }

                e.preventDefault();

                // Prevent multiple link scrolling overlap
                if (scrollOn == true) {
                    console.error('Scroll terminated: previous scroll not finished yet');
                    return;
                }

                var target = attr.href;

                if (angular.isUndefined(target)) {
                    console.error('Scroll terminated: need "href" attribute with destination ID');
                    return;
                }

                // Expected normal "Hashbang" href link to ID (ex: '#/#home')
                var targetId = target.split('/#')[1];
                scope.targetId = targetId;
                var element = document.getElementById(targetId);

                if (element === null) {
                    console.error('Scroll terminated: no element with such ID');
                    return;
                }

                // Url hash changing made in "anchorSection" directive
                // scope.$apply($location.hash(targetId));

                var options = {
                    duration: 1500,
                    easing: 'easeInOutQuart',
                    offset: 100,
                    callbackBefore: function () {
                        scrollOn = true;
                    },
                    callbackAfter: function () {
                        scrollOn = false;
                    }
                };

                smoothScroll(element, options);

            });
        }
    }
}]);

// Change $location.hash to block's id when it appear at screen
app.directive('anchorSection', ['$location', '$document', function ($location, $document) {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, element, attr) {

            // need 1px more to fix bug in firefox
            var headerHeight = 101;

            $document.on('scroll', function() {

                if (attr.id === $location.hash()) {
                    return;
                }

                var sectionRect = element[0].getBoundingClientRect();
                if (sectionRect.top <= headerHeight && sectionRect.bottom > headerHeight) {
                    scope.$apply($location.hash(attr.id));
                }
            });
        }
    }
}]);


app.directive('onScreenCounter', ['$interval', '$document', function ($interval, $document) {
    return {
        restrict: 'A',
        scope: {
            value: "@",
            time: "@",
            interval: "@"
        },
        link: function (scope, element, attr) {

            $document.on('scroll', isElementOnScreen);

            var headerHeight = 100;

            function isElementOnScreen() {
                var sectionRect = element[0].getBoundingClientRect();
                if (sectionRect.top <= $document[0].documentElement.clientHeight && sectionRect.bottom > headerHeight) {
                    $document.off('scroll', isElementOnScreen);

                    startCounter();
                }
            }

            function startCounter() {

                var stepValue = Math.floor(scope.value / (scope.time / scope.interval));
                var counter = 0;

                var intervalId = $interval(function () {
                    if((counter + stepValue) >= scope.value) {
                        element.html(scope.value);
                        $interval.cancel(intervalId);
                        return;
                    }

                    counter += stepValue;
                    element.html(counter);

                }, scope.interval);

            }

        }
    }
}]);

app.directive('teamMember', function () {
    return {
        restrict: 'AE',
        scope: {
            personData: '='
        },
        templateUrl: 'templates/teamMember.html',
        link: function (scope, element, attr) {

            var socialLinks = angular.element(element[0].querySelectorAll('li.team-member-social-icon'));

            socialLinks.on('mouseover', function() {
                socialLinks.addClass('active');
            });

            socialLinks.on('mouseout', function() {
                socialLinks.removeClass('active');
            });
        }
    }
});


//
// Controllers
//

app.controller('mainCtrl', ['$scope', '$location', 'smoothScroll', function($scope, $location, smoothScroll) {

    if (angular.isDefined($location.hash())) {

        var element = document.getElementById($location.hash());

        if (element === null) {
            console.error('Scroll terminated: no element with such ID');
            return;
        }

        var options = {
            duration: 800,
            offset: 100
        };

        smoothScroll(element, options);
    }

}]);

app.controller('navMainCtrl', ['$scope', '$location', function($scope, $location) {

    // Hash may be string or array of strings
    $scope.isActiveLink = function(hash) {

        // If not at main page (main.html view)
        if ($location.path() !== '/') {
            return false;
        }

        if (Array.isArray(hash)) {

            var status = false;
            hash.forEach(function(elem) {
                if (elem === $location.hash())
                    status = true;
            });

            return status;
        }
        else {
            return (hash === $location.hash());
        }
    }
}]);

app.controller('servicesSwitchCtrl', ['$scope', function($scope) {
    $scope.serviceCurr = 0;

    $scope.serviceSelect = function (num) {
        $scope.serviceCurr = num;
    };

    $scope.isActiveService = function (num) {
        return (num === $scope.serviceCurr);
    }
}]);


app.controller('portfolioCtrl', ['$scope', function($scope) {

    $scope.achievementsData = portfolioAchievementsData;

    $scope.imagesData = portfolioImagesData;
    $scope.categoryCurr = 'all';

    $scope.test = ['all', 'web', 'photography', 'graphic design'];

    $scope.galleryCategorySelect = function (category) {
        $scope.categoryCurr = category;
    };

    $scope.isActiveCategory = function (category) {
        return (category === $scope.categoryCurr);
    };

    $scope.filterByCategory = function (item) {
        if (item.category === $scope.categoryCurr || $scope.categoryCurr === 'all') {
            return item;
        }
    }

}]);

app.controller('aboutTeamCtrl', ['$scope', function($scope) {

    $scope.teamMembersData = teamMembersData;

}]);

app.controller('newsSectionCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    
    $http.get('data/data.json')
        .success(function (response) {
            $scope.newsData = response;
        })
        .error(function (response) {
            console.error(response.status);
            console.error(response.statusText);
        });

    $scope.getArticleDate = function (dateStr) {
        var articleDate = new Date(dateStr);

        return articleDate.getDate();
    };

    $scope.getArticleMonthStr = function (dateStr) {
        var articleDate = new Date(dateStr);
        var monthStr = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        return monthStr[articleDate.getMonth()];
    };

    $scope.articleId = $routeParams.id;

}]);

app.controller('contactFormCtrl', ['$scope', '$cookies', function($scope, $cookies) {

    // english letters and spaces (additionally added)
    $scope.nameRegex = /^[a-zA-Z\s]*$/;
    // english letters, digits, symbols '@', '_' and '.' (additionally added)
    $scope.mailRegex = /^[a-zA-Z0-9@_\.]*$/;
    // at least 20 symbols
    $scope.textRegex = /^.{20,}$/;

    $scope.showError = function (error, field) {

        if (angular.isDefined(error)) {
            if (error.required) {
                return 'No text entered!'
            }
            else if (error.pattern) {
                switch (field) {
                    case 'name':
                        return 'Invalid characters at name field';
                        break;
                    case 'mail':
                        return 'Invalid characters at mail field';
                        break;
                    case 'text':
                        return 'Too short message (at least 20 characters)';
                        break;
                }
            }
        }
    };

    $scope.submitHandler = function () {

        // Cookies expires date set to next month
        var now = new Date(),
            exp = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

        $cookies.put('contactMessageName', $scope.messageName, { expires: exp });
        $cookies.put('contactMessageMail', $scope.messageMail, { expires: exp });

        alert("Success, sending data!\nData saved to cookies, reload page and check form!")

        // Remove entered message text after submit and make form pristine
        $scope.messageText = '';
        $scope.contactForm.$setPristine();
    };

    $scope.getMessageFromCookies = function () {
        $scope.messageName = $cookies.get('contactMessageName') || '';
        $scope.messageMail = $cookies.get('contactMessageMail') || '';
    }

}]);





