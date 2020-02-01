
var app = angular.module('myApp', ['ngMaterial', 'ngMessages']);
app.controller('myCtrl', function($scope) {
  $scope.failed = 'wait';
      chrome.extension.sendMessage({type: 'init'}, function(response) {
        console.log(response)
          if(!response || response.failed < 0 || response.failed === true){
            $scope.failed = true;
            return;
          }
          $scope.failed = false;
          $scope.data.user = response;
          console.log($scope.data)
          for(var tag in $scope.data.user.tags){
            $scope.tags.push({
              ...$scope.data.user.tags[tag],
              id: tag
            })
          }

          setInterval(()=>{
            console.log($scope.data.user)
          }, 2000)

          $scope.$watch('tags', function (newVal, oldVal) {
              $scope.data.user.tags = {}
              $scope.tags.forEach((e)=>{
                $scope.data.user.tags[e.id] = e;
              })
              $scope.update()
          }, true);
          $scope.$watch('data.user', function (newVal, oldVal) {
            console.log('122123123131222')
            $scope.update()
          }, true);

      })
	$scope.data = {
		selectedTag: 0,
		user: {
		}
	}
		// 	tags: [
			
		// {
		// 			color: 'green',
		// 			name: 'Tag N1'
		// 		}, {
		// 			color: 'blue',
		// 			name: 'Tag N2'
		// 		}, {
		// 			color: 'red',
		// 			name: 'Tag N3'
		// 		}
		// 	]

    $scope.tags = []
	var colors = $scope.colors = ['red', 'blue', 'green', 'orange', 'violet', 'yellow'];
  $scope.openColorPicker = false;
	$scope.transformColorTag = function(chip) {
      return {
        name: chip,
        color: colors[randomIntFromInterval(0, colors.length-1)],
        id: '_' + Math.random().toString(36).substr(2, 9),
        messages: []
      };
    };
    $scope.tagSelected = function(a,s,f,g,h){
    	let i = angular.element(event.currentTarget).controller('mdChips').selectedChip
    	if(i>=0)
    		$scope.data.selectedTag = i

      console.log(i)
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
    for(var user in $scope.data.user.data.users){
      $scope.data.user.data.users[user].selected = selectedAll
    }
	}
  $scope.sendMessage = function(e){
    var sendObj = {users: [], message: e}
  	for(var user in $scope.data.user.data.users){
      if($scope.data.user.data.users[user].selected && $scope.data.user.users[user] == $scope.tags[$scope.data.selectedTag].id)
        sendObj.users.push(user);
    }
    chrome.extension.sendMessage({type: 'sendMessage', data: sendObj})
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
  $scope.update = function(){
    chrome.extension.sendMessage({type: 'update', user: angular.copy($scope.data.user)})
  }
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
.config([
    '$compileProvider',
    function( $compileProvider ) {
      var imgSrcSanitizationWhitelist = /^\s*(https?|ftp|file):|data:image\//;
      $compileProvider.imgSrcSanitizationWhitelist(imgSrcSanitizationWhitelist);
    }
])


setInterval(function(){
  $('md-chip md-chip-template').each(function(e){
    $(this).parent().parent().attr('class', $(this).attr('class'))
  })
}, 200)

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}