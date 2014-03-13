'use strict';

angular.module('d3-uml-modeler.uml-workspace')
.controller('WorkspaceController', [
  "$scope", "_", "Notifications", "WorkspaceModelClass", "Constants", "UmlController", "UmlModelAbstractFactory", "$rootScope", "UserModel", "FirebaseSyncController", "Mocks",
  function($scope, _, Notifications, WorkspaceModelClass, Constants, UmlController, UmlModelAbstractFactory, $rootScope, UserModel, FirebaseSyncController, Mocks)
  {
    var WorkspaceController = UmlController.extend(
    {
      user: null,
      model: null,
      isSaving: false,
      isPending: false,
      isModelSynced: false,

      init: function($scope)
      {
        this.model = new WorkspaceModelClass();

        UmlController.prototype.init.call(this, $scope, Notifications);

        this.$scope.model = angular.bind(this, this.model);
        this.$scope.diagrams = angular.bind(this, this.model.children);
      },

      /**
       * initialize the scope data.
       */
      initScope : function()
      {
        this.$scope.diagrams = angular.bind(this, this.model.children);
        this.$scope.children = angular.bind(this, this.model.children); //for the tree
        this.$scope.sync = angular.bind(this, this.sync);
        this.$scope.username = "";
        this.$scope.userPicture = "";

        //temporary chunk of code that allow us to get directly to the workspace,
        //without twitter authorization
        // this.bootstrapWorkspaceModelTree(Mocks.RAW_USER.diagrams);
        // this.$scope.userPicture = Mocks.RAW_USER.thirdPartyUserData.profile_image_url;
        // this.$scope.username = "@" + Mocks.RAW_USER.username;
      },

      initListeners : function()
      {
        //temporarily commented binds, for development we don't have to get authorized.
        //it's a waste of time.

        $rootScope.$on("$firebaseSimpleLogin:login", angular.bind(this, this.onLoginSuccess));
        $rootScope.$on("$firebaseSimpleLogin:logout", angular.bind(this, this.onLogout));
        this.notifications.addEventListener(Constants.DIAGRAM.EVENTS.ADD, this.addDiagram, this);
      },

      initWorkspaceModel: function(rawUser)
      {
        if(typeof rawUser === "undefined" || rawUser === null)
          throw new Error("rawUser is undefined/null");

        this.user = FirebaseSyncController.getUser(rawUser.uid);
        var diagramsFB = FirebaseSyncController.getUserDiagrams(rawUser.uid);
        var self = this;

        $rootScope.modelUser = new UserModel();
        
        diagramsFB.on('value', function(snapshot)
        {
          if(self.isSaving === false)
          {
            var diagrams = snapshot.val();
            $rootScope.modelUser.diagrams = diagrams;
            self.bootstrapWorkspaceModelTree(diagrams);
          }
        });
      },

      /**
       *
       *
       */
      bootstrapWorkspaceModelTree: function(diagrams)
      {
        if(!_.isEmpty(diagrams))
        {
          var self = this;
          self.model.clearChildren();
          console.log("WorkspaceController::bootstrapWorkspaceModelTree constructing workspace model tree");

          _.each(diagrams, function(diagramJSON) {
            var modelDiagram = UmlModelAbstractFactory.createModelHierarchy(diagramJSON);
            self.model.addElement(modelDiagram);
          });
        }
      },

      onLoginSuccess: function(e, rawUser)
      {
        //I used this approch because the loginSuccess 
        //callback is invoked 2 times.
        //the first time is invoked because of the cache,
        //the second is the real response from the server.
        this.isPending = !this.isPending;

        // if(!this.isPending && !this.isModelSynced)
        if(!this.isModelSynced)
        {
          this.initWorkspaceModel(rawUser);

          this.isModelSynced = true;
          this.isPending = false;

          this.$scope.userPicture = rawUser.thirdPartyUserData.profile_image_url;
          this.$scope.username = "@" + rawUser.username;
        }
      },

      onLogout: function()
      {
        this.$scope.username = "";
        this.$scope.userPicture = "";
      },

      /**
       * This function is called during the creation of the controller
       * by the workspace controller in order to pass the recently created
       * model diagram in parameters, so the diagram controller can know
       * what model diagram he's dealing with.
       */
      addDiagram : function(elementType)
      {
        //an adapter method to addElement.
        this.model.addDiagram(elementType);
      },

      sync: function()
      {
        var workspaceJSON = this.model.toJSON();

        this.isSaving = true;
        console.log("synchronizing data ...");
        this.user.diagrams = workspaceJSON.children;
        this.user.$save("diagrams");
        console.log("Data synchronization done !");
        this.isSaving = false;
      }

    });

    return new WorkspaceController($scope, _, Notifications, WorkspaceModelClass, Constants);
  }]);


