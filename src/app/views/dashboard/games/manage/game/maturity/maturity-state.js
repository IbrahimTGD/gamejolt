angular.module( 'App.Views' ).config( function( $stateProvider )
{
	$stateProvider.state( 'dash.games.manage.game.maturity', {
		url: '/maturity',
		controller: 'Dashboard.Developer.Games.Manage.Game.MaturityCtrl',
		controllerAs: 'maturityCtrl',
		templateUrl: require( './maturity.html' ),
		// resolve: {
		// 	payload: function( Api, $stateParams )
		// 	{
		// 		return Api.sendRequest( '/web/dash/developer/games/' + $stateParams.id );
		// 	}
		// }
	} );
} );