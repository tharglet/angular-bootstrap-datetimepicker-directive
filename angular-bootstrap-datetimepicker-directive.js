'use strict';

angular
  .module('datetimepicker', [])

  .provider('datetimepicker', function () {
    var default_options = {};

    this.setOptions = function (options) {
      default_options = options;
    };

    this.$get = function () {
      return {
        getOptions: function () {
          return default_options;
        }
      };
    };
  })

  .directive('datetimepicker', [
    '$timeout',
    'datetimepicker',
    function ($timeout,
              datetimepicker) {

      var default_options = datetimepicker.getOptions();

      return {
        require : '?ngModel',
        restrict: 'AE',
        scope   : {
          datetimepickerOptions: '@'
        },
        link    : function ($scope, $element, $attrs, ngModelCtrl) {
          var passed_in_options = $scope.$eval($attrs.datetimepickerOptions);
          var options = jQuery.extend({}, default_options, passed_in_options);
          
          // Default input to element.
          var input = $element;

          $element
            .on('dp.change', function (e) {
              
              if (ngModelCtrl) {
                ngModelCtrl.$setViewValue(input.val());
                ngModelCtrl.$render();
              }
            })
            .datetimepicker(options);
          
          // We need to find the controller. The controller will not exist if the,
          // datepicker has been applied to a parent element of the input.
          if (!ngModelCtrl) {
            // Try and find the target.
            // Start with the datePicker input class in the config.
            var dpInputOption = $element.data('DateTimePicker').datepickerInput();
            
            // Use the supplied class.
            input = $element.find(dpInputOption);
            if (input.length === 0) {
              
              // Grab the nearest child input.
              input = $element.find('input');
            }
           
            // Try and grab the controller here.
            ngModelCtrl = input.controller('ngModel');
          }

          function setPickerValue() {
            var date = null;

            if (ngModelCtrl && ngModelCtrl.$viewValue) {
              date = ngModelCtrl.$viewValue;
            }

            $element
              .data('DateTimePicker')
              .date(date);
          }

          if (ngModelCtrl) {
            var oldRender = ngModelCtrl.$render;
            ngModelCtrl.$render = function () {
              setPickerValue();
              oldRender();
            };
          }

          setPickerValue();
        }
      };
    }
  ]);
