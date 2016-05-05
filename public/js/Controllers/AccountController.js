(function () {
    'use strict';

    angular
        .module('WeDo')
        .controller('AccountController', AccountController);

    AccountController.$inject = ['ProjectService', 'AccountService', 'UserService', '$window', '$mdDialog', '$mdToast', 'appConstants', 'Upload', '$timeout', '$rootScope'];

    /* @ngInject */
    function AccountController(ProjectService, AccountService, UserService, $window, $mdDialog, $mdToast, appConstants, Upload, $timeout, $rootScope) {
        var accountVM = this;
        accountVM.title = 'AccountController';

        accountVM.baseUrl = appConstants.baseUrl;
        accountVM.token = $window.sessionStorage.getItem('token');
        accountVM.project = JSON.parse($window.sessionStorage.getItem('project'));
        accountVM.user = JSON.parse($window.sessionStorage.getItem('user'));
        accountVM.passwordRegEx = new RegExp((/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/));

        accountVM.cancelSubscription = cancelSubscription;
        accountVM.showCancelModal = showCancelModal;
        accountVM.addUser = addUser;
        accountVM.removeUser = removeUser;
        accountVM.saveUser = saveUser;
        accountVM.changePassword = changePassword;
        accountVM.uploadPic = uploadPic;
        accountVM.editUser = editUser;
        accountVM.editBillingDetails = editBillingDetails;

        activate();

        ////////////////
        
        function activate() {
           //console.log(accountVM.project);
        }

        function getAccountData() {

        }
        
        function saveUser() {

          var userToSave = {
              'FirstName': accountVM.user.FirstName,
              'LastName': accountVM.user.LastName,
              'EmailAddress': accountVM.user.UserName
          };

            UserService.saveUser({userid: accountVM.user.Id}, userToSave).$promise.then(function(res){
                if(res.Success){
                    showErrorToast('Successfully updated User Information!');
                    //update session Storage
                    $window.sessionStorage.setItem('user', JSON.stringify(accountVM.user));
                    if(accountVM.project) {
                        //also need to change project users
                        accountVM.project.ProjectUsers.forEach(function (user, index) {
                            if (user.Id === accountVM.user.Id) {
                                user.FirstName = accountVM.user.FirstName;
                                user.LastName = accountVM.user.LastName;
                            }
                        });
                    }
                    $mdDialog.hide();
                    $rootScope.$emit('userUpdated');
                    //$timeout($window.location.reload(), 1000);

                } else {
                    showErrorToast('Unable to save user information.');
                }
            }).catch(function(err){
                console.log(err);
                showErrorToast('Save User Error');
            });
        }

        function changePassword() {
            var passwordToSave = {
                "OldPassword": accountVM.user.oldPassword,
                "NewPassword": accountVM.user.password,
                "ConfirmPassword": accountVM.user.password_confirm
            };
            
           AccountService.changePassword(passwordToSave).$promise.then(function(res){
                if(res.Success){
                    showErrorToast('Successfully updated Password!');
                } else {
                    showErrorToast('Unable to save new password.');
                }
           }).catch(function(err){
                console.log(err);
               showErrorToast('Change Password Error');
           });
        }
        
        function uploadPic(file) {
            if(file) {
                Upload.upload({
                    url: appConstants.baseUrl + '/users/image/',
                    headers: {
                        'Authorization': 'Bearer ' + $window.sessionStorage.getItem('token'),
                        'Content-Type': file.type
                    },
                    data: {file: file},
                    withCredentials: true
                }).then(function (res) {
                    console.log('Success ' + res.config.data.file.name + 'uploaded. Response: ' + res.data);
                    //need to reload page so the images refresh
                   //$window.location.reload();
                    $rootScope.$emit('userUpdated');
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                    showErrorToast(resp.data.Errors[0].Message);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                }).catch(function (err) {
                    console.log('the download failed');
                    showErrorToast(err);
                });
            }
        }

        function addUser() {
            AccountService.addUser({subscriptionid: accountVM.project.Subscription.SubscriptionId}, accountVM.project.Subscription.UserCount+1).$promise.then(function(res){
                accountVM.project.Subscription.UserCount++;
                $rootScope.$emit('projectUpdated');
            }).catch(function(err){
                console.log(err);
                showErrorToast('Add User Count Error: Unable to Save to Server');
            });
        }

        function removeUser() {
            AccountService.addUser({subscriptionid: accountVM.project.Subscription.SubscriptionId}, accountVM.project.Subscription.UserCount-1).$promise.then(function(res){
                accountVM.project.Subscription.UserCount--;
                $rootScope.$emit('projectUpdated');
            }).catch(function(err){
                console.log(err);
                showErrorToast('Add User Count Error: Unable to Save to Server');
            });
        }

        function showCancelModal(ev){
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Confirm Cancel Subscription')
                .textContent('Are you sure you want to cancel your subscription?')
                .ariaLabel('Cancel Subscription Confirmation')
                .targetEvent(ev)
                .ok('Yes, please cancel my subscription')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
               cancelSubscription();
            }, function() {
                //do anything afterwards if needed

            });
        }

        function editBillingDetails() {
            //show edit billing modal to choose template and name
            $mdDialog.show({
                    controller: EditBillingDialogController,
                    templateUrl: '../partials/BillingDetails.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    fullscreen: true
                })
                .then(function() {
                    //do something after hide
                }, function() {
                    //do something after cancel

                });
        }
        
        function EditBillingDialogController($scope, $mdDialog, $state, $mdToast) {
            $scope.cancelEdit = function() {
                $mdDialog.cancel();
            };
            $scope.confirmEdit = function(userData) {
                $scope.disable = true;
                $mdDialog.hide();
            };
        }
        

        function editUser() {
            //show edit user modal to choose template and name
            $mdDialog.show({
                    controller: EditUserDialogController,
                    templateUrl: '../partials/EditUser.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    fullscreen: true
                })
                .then(function(user) {

                }, function() {
                    //do something after cancel

                });
        }

        function EditUserDialogController($scope, $mdDialog, $state, $mdToast) {
            $scope.user = accountVM.user;
            $scope.baseUrl = accountVM.baseUrl;
            $scope.token = accountVM.token;
            $scope.passwordRegEx = accountVM.passwordRegEx;
            $scope.uploadPic = uploadPic;
            $scope.saveUser = saveUser;
            $scope.changePassword = changePassword;

            $scope.cancelEdit = function() {
                $mdDialog.cancel();
            };
            $scope.confirmEdit = function(userData) {
                $scope.disable = true;
                $mdDialog.hide();
            };
        }

        function cancelSubscription() {
            AccountService.cancelSubscription({subscriptionid: accountVM.project.Subscription.SubscriptionId}).$promise.then(function(res){
                if(res.Success){

                }
            }).catch(function(err){
                console.log(err);
            });
        }

        function showErrorToast(action) {
            $mdToast.show($mdToast.simple()
                .textContent(action)
                // .action(action)
                // .highlightAction(true)
                .position('bottom right')
            )
        }
    }

})();

