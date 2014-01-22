"use strict";

angular.module('d3-uml-modeler.login')
	.factory('UserModel', ["Constants", "_",
		function(Constants, _)
		{
			return Class.extend({
				uid : "", //A unique id combining the provider and id, intended as the unique key for user data (string).
				displayName : "", //The user's display name (string).

				username : "", //The user's Twitter username (string).
				id : "", //The user's Twitter id (string).
				accessToken : "", //The Twitter access token (string).
				accessTokenSecret : "", //The Twitter access token secret (string).

				firebaseAuthToken : "", //The Firebase authentication token for this session (string).
				provider : "", //The authentication method used, in this case: 'twitter' (string).

				thirdPartyUserData : "", //User account data returned by Twitter (object).


				save: function()
				{
					
				}

			});
		}]);
