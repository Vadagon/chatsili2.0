console.log(12321)

var app = angular.module('myApp', ['ngMaterial', 'ngMessages']);
app.controller('myCtrl', function($scope) {
	$scope.data = {
		selectedTag: 0,
		user: {
			tags: [
			
		{
					color: 'green',
					name: 'Tag N1'
				}, {
					color: 'blue',
					name: 'Tag N2'
				}, {
					color: 'red',
					name: 'Tag N3'
				}
			]
		}
	}
	var colors = ['red', 'blue', 'green'];
	$scope.transformColorTag = function(chip) {
      return {
        name: chip,
        color: colors[randomIntFromInterval(0, colors.length-1)]
      };
    };
    $scope.tagSelected = function(a,s,f,g,h){
    	let i = angular.element(event.currentTarget).controller('mdChips').selectedChip
    	if(i>=0)
    		$scope.data.selectedTag = i
    }
	console.log($scope.data)
	// chrome.tabs.query({ active: true, currentWindow: true }, function(e){
	// 	if(!e.length) return;
		
	// 	chrome.runtime.sendMessage({getData:true, tabId: e[0].id}, function(e){
	// 		console.log(e)
	// 		$scope.data = e.tables;
	// 		$scope.$apply();
	// 	});
	// })
	var selectedAll = false;
	$scope.selectAllUsers = function(){
		selectedAll = !selectedAll
		$scope.people.forEach((e, n)=>{
			e.selected = selectedAll;
		})
	}
 $scope.people = [
    { name: 'Janet Perkins', img: 'img/100-0.jpeg', newMessage: true },
    { name: 'Mary Johnson', img: 'img/100-1.jpeg', newMessage: false },
    { name: 'Peter Carlsson', img: 'img/100-2.jpeg', newMessage: false }
  ];
  $scope.name = "John Doe";
  $scope.sendMessage = function(){
  	console.log(1232)
  }
  $scope.doSecondaryAction = function(event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Secondary Action')
        .textContent('Secondary actions can be used for one click actions')
        .ariaLabel('Secondary click demo')
        .ok('Neat!')
        .targetEvent(event)
    );
  };
})
.directive('customChip', function(){
          return {
            restrict: 'EA',
            link: function(scope, elem, attrs) {
                var chipTemplateClass = attrs.class;
                elem.removeClass(chipTemplateClass);
                var mdChip = elem.parent().parent();
                mdChip.addClass(chipTemplateClass);
            }
        }
})
.directive("contenteditable", function () {
        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, element, attrs, ngModel) {
              	// read is the main handler, invoked here by the blur event
                function read() {
                  	// Keep the newline value for substitutin
                  	// when cleaning the <br>
                    var newLine = String.fromCharCode(10);
                  	// Firefox adds a <br> for each new line, we replace it back
                  	// to a regular '\n'
                    var formattedValue = element.html().replace(/<br>/ig,newLine).replace(/\r/ig,'');
                  	// update the model
                    ngModel.$setViewValue(formattedValue);
                  	// Set the formated (cleaned) value back into
                  	// the element's html.
                    element.text(formattedValue);
                }

                ngModel.$render = function () {
                    element.html(ngModel.$viewValue || "");
                };

                element.bind("blur", function () {
                  	// update the model when
                  	// we loose focus
                    scope.$apply(read);
                });
                element.bind("paste", function(e){
                  	// This is a tricky one
                  	// when copying values while
                  	// editing, the value might be
                  	// copied with formatting, for example
                  	// <span style="line-height: 20px">copied text</span>
                  	// to overcome this, we replace
                  	// the default behavior and
                  	// insert only the plain text
                  	// that's in the clipboard
                    e.preventDefault();
                    document.execCommand('inserttext', false, e.clipboardData.getData('text/plain'));
                });
            }
        };
    })
.config( [
    '$compileProvider',
    function( $compileProvider ) {
        var currentImgSrcSanitizationWhitelist = $compileProvider.imgSrcSanitizationWhitelist();
        var newImgSrcSanitizationWhiteList = currentImgSrcSanitizationWhitelist.toString().slice(0,-1)
        + '|chrome-extension:'
        +currentImgSrcSanitizationWhitelist.toString().slice(-1);

        console.log("Changing imgSrcSanitizationWhiteList from "+currentImgSrcSanitizationWhitelist+" to "+newImgSrcSanitizationWhiteList);
        $compileProvider.imgSrcSanitizationWhitelist(newImgSrcSanitizationWhiteList);
    }
]);



function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}