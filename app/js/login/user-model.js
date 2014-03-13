"use strict";

angular.module('d3-uml-modeler.login')
  .factory('UserModel', ["Constants", "_",
    function(Constants, _)
    {
      return Class.extend({
        //A unique id combining the provider and id, intended as the unique key for user data (string).
        uid : "", 
        
        //The user's display name (string).
        displayName : "", 

        //The user's Twitter username (string).
        username : "", 
        
        //The user's Twitter id (string).
        id : "", 
        
        //The Twitter access token (string).
        accessToken : "", 
        
        //The Twitter access token secret (string).
        accessTokenSecret : "",

        //The Firebase authentication token for this session (string).
        firebaseAuthToken : "",
        
        //The authentication method used, in this case: 'twitter' (string).
        provider : "", 

        //User account data returned by Twitter (object).
        thirdPartyUserData : "",

        diagrams: {
          
        }

      });
    }]);
