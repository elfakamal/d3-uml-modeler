'use strict';

angular.module('d3-uml-modeler.login')
	.controller('LoginController', [
		"$scope", "_", "Notifications", "UserModel", "Constants", "UmlController", "$firebaseSimpleLogin", "$rootScope",
		function($scope, _, Notifications, UserModel, Constants, UmlController, $firebaseSimpleLogin, $rootScope)
		{
			var LoginController = UmlController.extend(
			{

				/**
				 * initialize the scope data.
				 */
				initScope : function()
				{
					this.$scope.model = new UserModel();
					this.$scope.socialLogin = angular.bind(this, this.socialLogin);
				},

				initListeners: function()
				{
					$rootScope.$on("$firebaseSimpleLogin:login", angular.bind(this, this.onLoginSuccess));
					$rootScope.$on("$firebaseSimpleLogin:logout", angular.bind(this, this.onLogout));
					$rootScope.$on("$firebaseSimpleLogin:error", angular.bind(this, this.onLoginError));
				},

				onLoginSuccess: function(e, user)
				{
					// debugger;
					this.initModelUser(user);
				},

				onLoginError: function(e, user)
				{
					// an error occurred while attempting login
					// debugger;
					console.log(error);
				},

				onLogout: function()
				{
					// debugger;
					console.log("logged out");
				},

				socialLogin: function(provider)
				{
					if(provider === Constants.FIREBASE.LOGIN_PROVIDERS.TWITTER)
					{
						var auth = new $firebaseSimpleLogin(new Firebase(Constants.FIREBASE.URL));
						auth.$login(Constants.FIREBASE.LOGIN_PROVIDERS.TWITTER);
					}
				},

				initModelUser: function(rawUser)
				{
					this.$scope.model.uid = rawUser.uid;
					this.$scope.model.displayName = rawUser.displayName;

					this.$scope.model.username = rawUser.username;
					this.$scope.model.id = rawUser.id;
					this.$scope.model.accessToken = rawUser.accessToken;
					this.$scope.model.accessTokenSecret = rawUser.accessTokenSecret;

					this.$scope.model.firebaseAuthToken = rawUser.firebaseAuthToken;
					this.$scope.model.provider = rawUser.provider;

					this.$scope.model.thirdPartyUserData = rawUser.thirdPartyUserData;
				}

			});

			return new LoginController($scope, _, Notifications, UserModel, Constants);
		}]);


