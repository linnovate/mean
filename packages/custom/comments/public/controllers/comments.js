'use strict';

/* jshint -W098 */
angular.module('mean.comments').controller('CommentsController', ['$scope', '$timeout', 'Global', 'Comments',
  function($scope, $timeout, Global, Comments) {
    /**
     * Bloat added by mean.io - i don't know why i'm not removing it
     */
    $scope.global = Global;
    $scope.package = {
      name: 'comments'
    };

    /**
     * Get the articleId from directive
     * @type {String}
     */
    var articleId = $scope.articleId;

    /**
     * Custom methods to be exposed as of current scope
     * @type {Object}
     */
    var scoped = {
      /**
       * Create a new comment
       * @param  {Boolean} isValid Will be true if form validation passes
       * @return {Void}
       */
    	create: function(isValid) {
    		if (isValid) {
    			var comment = new Comments.single({
    				email: this.email,
    				content: this.content,
    				article: articleId
    			});
    			this.email = this.content = '';
    			comment.$save(function(response) {
    				$scope.refreshComments();
    				$scope.success = true;
    				$timeout(function() {
    					$scope.success = false;
    				}, 5000);
    			});
    		}
    	},

      /**
       * Removes a particular comment
       * @param  {Object} comment The comment object
       * @return {Void}
       */
    	remove: function(comment) {
    		Comments.single.delete({commentId: comment._id}, function(response) {
    			$scope.refreshComments();
    		});
    	},
      
      /**
       * Changes published status to false
       * @param  {Object} comment The comment object
       * @return {Void}
       */
    	disapprove: function(comment) {
    		Comments.single.update({commentId: comment._id}, {published: false}, function(response) {
    			$scope.refreshComments();
    		});
    	},

      /**
       * Changes published status to true
       * @param  {Object} comment The comment object
       * @return {Void}
       */
    	approve: function(comment) {
    		Comments.single.update({commentId: comment._id}, {published: true}, function(response) {
    			$scope.refreshComments();
    		});
    	},

      /**
       * To check whether to show admin icons in the UI
       * @type {Boolean}
       */
    	canApprove: $scope.global.isAdmin,

      /**
       * Success message is different for admin and authenticated (yes, i know, should be in a translation file, but not for this test which is already quite scopish)
       * @type {String}
       */
    	successMsg: ($scope.global.isAdmin ? 'Your comment has been added.' : 'Your comment will appear on this article once it is reviewed.')
    };

    /**
     * Finally, attach methods to the $scope object
     */
    angular.extend($scope, scoped);

    /**
     * Get list of comments for the provided articleId (and run once)
     * @type {Array}
     */
    ($scope.refreshComments = function() {
    	$scope.commentItems = Comments.list.query({articleId: $scope.articleId});
    })();
  }
]);
