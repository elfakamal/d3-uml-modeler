'use strict';

angular.module('d3-uml-modeler.login')
	.controller('LoginController', [
		"$scope", "_", "UserModel", "Constants", "UmlController", "$firebaseSimpleLogin", "$rootScope", "FirebaseSyncController", 
		function($scope, _, UserModel, Constants, UmlController, $firebaseSimpleLogin, $rootScope, FirebaseSyncController)
		{
			var LoginController = UmlController.extend(
			{

				auth: null,
				isPending: false,
				isModelSynced: false,

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
					this.isPending = !this.isPending;

					if(!this.isPending && !this.isModelSynced)
						this.initModelUser(user);
				},

				onLoginError: function(error)
				{
					// an error occurred while attempting login
					//debugger;
					this.auth.$logout();
					this.isPending = false;
					console.log(error);
				},

				onLogout: function()
				{
					//debugger;
					
					this.isPending = false;
					for(var key in this.$scope.model) this.$scope.model["uid"] = null;
					console.log("logged out");
				},

				socialLogin: function(provider)
				{
					if(provider === Constants.FIREBASE.LOGIN_PROVIDERS.TWITTER)
					{
						this.isPending = false;
						this.auth = new $firebaseSimpleLogin(new Firebase(Constants.FIREBASE.URL));
						this.auth.$login(Constants.FIREBASE.LOGIN_PROVIDERS.TWITTER);
					}
				},

				initModelUser: function(rawUser)
				{
					// debugger;
					// var user = FirebaseSyncController.getUser(rawUser.uid);
					// var diagrams = {};

					// if(_.has(user, "diagrams"))
					// 	diagrams = user.diagrams;

					// if(!_.has($rootScope, "modelUser"))
					// 	$rootScope.modelUser = this.$scope.model;
					
					// $rootScope.modelUser.diagrams = diagrams;

					this.isModelSynced = true;
					this.isPending = false;

					this.$scope.model.uid = rawUser.uid;
					
					// this.$scope.model.displayName = rawUser.displayName;
					// this.$scope.model.username = rawUser.username;
					// this.$scope.model.id = rawUser.id;
					// this.$scope.model.accessToken = rawUser.accessToken;
					// this.$scope.model.accessTokenSecret = rawUser.accessTokenSecret;
					// this.$scope.model.firebaseAuthToken = rawUser.firebaseAuthToken;
					// this.$scope.model.provider = rawUser.provider;
					// this.$scope.model.thirdPartyUserData = rawUser.thirdPartyUserData;

					// //this.$scope.model.diagrams = diagrams;

					// FirebaseSyncController.sync(this.$scope.model);
				}

			});

			return new LoginController($scope, UserModel, Constants);
		}]);