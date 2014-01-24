"use strict";


angular.module("d3-uml-modeler.base")
	.factory("FirebaseSync", ["_", "Constants", "$firebase",
		function(_, Constants, $firebase)
		{

			return Class.extend({
				
				firebaseUsers: null,

				init: function()
				{
					this.getUsers();
				},

				/**
				 * retrieves a user from Firebase.
				 */
				getUser: function(userUID)
				{
					return $firebase(new Firebase(Constants.FIREBASE.URL + "users/" + userUID + "/"));
				},

				/**
				 * retrieves a user's diagram list from Firebase.
				 */
				getUserDiagrams: function(userUID)
				{
					return new Firebase(Constants.FIREBASE.URL + "users/" + userUID + "/diagrams/");
				},

				getUsers: function()
				{
					this.firebaseUsers = $firebase(new Firebase(Constants.FIREBASE.URL + "users"));
				},

				sync: function(user)
				{
					this.firebaseUsers[user.uid] = user;
					this.firebaseUsers.$save(user.uid);
				}

			});
		}]
	);

angular.module('d3-uml-modeler.base')
	.provider('FirebaseSyncController', Class.extend({

		$get: ["FirebaseSync", function (FirebaseSync) {
				var instance = new FirebaseSync();
				return instance;
		}]
	})
);

