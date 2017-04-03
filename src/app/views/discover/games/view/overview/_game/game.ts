import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';
import * as View from '!view!./game.html?style=./game.styl';

import { Game } from '../../../../../../../lib/gj-lib-client/components/game/game.model';
import { AppMediaBar } from '../../../../../../../lib/gj-lib-client/components/media-bar/media-bar';
import { Screen } from '../../../../../../../lib/gj-lib-client/components/screen/screen-service';
import { makeObservableService } from '../../../../../../../lib/gj-lib-client/utils/vue';
import { AppGameThumbnail } from '../../../../../../components/game/thumbnail/thumbnail';
import { AppTrackEvent } from '../../../../../../../lib/gj-lib-client/components/analytics/track-event.directive.vue';
import { GameScreenshot } from '../../../../../../../lib/gj-lib-client/components/game/screenshot/screenshot.model';
import { GameVideo } from '../../../../../../../lib/gj-lib-client/components/game/video/video.model';
import { GameSketchfab } from '../../../../../../../lib/gj-lib-client/components/game/sketchfab/sketchfab.model';
import { AppState } from '../../../../../../../lib/gj-lib-client/vue/services/app/app-store';
import { GameRating } from '../../../../../../../lib/gj-lib-client/components/game/rating/rating.model';
import { AppRatingWidget } from '../../../../../../components/rating/widget/widget';
import { GameRelease } from '../../../../../../../lib/gj-lib-client/components/game/release/release.model';
import { GameSong } from '../../../../../../../lib/gj-lib-client/components/game/song/song.model';
import { GamePackage } from '../../../../../../../lib/gj-lib-client/components/game/package/package.model';
import { AppCard } from '../../../../../../../lib/gj-lib-client/components/card/card';
import { AppJolticon } from '../../../../../../../lib/gj-lib-client/vue/components/jolticon/jolticon';
import { AppFadeCollapse } from '../../../../../../../lib/gj-lib-client/components/fade-collapse/fade-collapse';
import { Environment } from '../../../../../../../lib/gj-lib-client/components/environment/environment.service';
import { User } from '../../../../../../../lib/gj-lib-client/components/user/user.model';
import { AppTooltip } from '../../../../../../../lib/gj-lib-client/components/tooltip/tooltip';
import { AppAd } from '../../../../../../../lib/gj-lib-client/components/ad/ad';
import { AppDiscoverGamesViewOverviewStats } from '../_stats/stats';
import { AppLazyPlaceholder } from '../../../../../../../lib/gj-lib-client/components/lazy/placeholder/placeholder';
import { AppGameOgrs } from '../../../../../../components/game/ogrs/ogrs';
import { AppCommentWidget } from '../../../../../../../lib/gj-lib-client/components/comment/widget/widget';
import { number } from '../../../../../../../lib/gj-lib-client/vue/filters/number';
import { AppGamePackageCard } from '../../../../../../../lib/gj-lib-client/components/game/package/card/card';
import { ActivityFeedContainer } from '../../../../../../components/activity/feed/feed-container-service';
import { AppActivityFeed } from '../../../../../../components/activity/feed/feed';
import { CommentVideo } from '../../../../../../../lib/gj-lib-client/components/comment/video/video-model';
import { Api } from '../../../../../../../lib/gj-lib-client/components/api/api.service';
import { AppCommentVideoThumbnail } from '../../../../../../../lib/gj-lib-client/components/comment/video/thumbnail/thumbnail';

@View
@Component({
	components: {
		AppDiscoverGamesViewOverviewStats,
		AppAd,
		AppMediaBar,
		AppGameThumbnail,
		AppRatingWidget,
		AppCard,
		AppJolticon,
		AppFadeCollapse,
		AppLazyPlaceholder,
		AppGameOgrs,
		AppCommentWidget,
		AppGamePackageCard,
		AppActivityFeed,
		AppCommentVideoThumbnail,
	},
	directives: {
		AppTrackEvent,
		AppTooltip,
	},
	filters: {
		number,
	},
})
export class AppDiscoverGamesViewOverviewGame extends Vue
{
	@Prop() isLoaded: boolean;
	@Prop() game: Game;
	@Prop() mediaItems: (GameScreenshot | GameVideo | GameSketchfab)[];
	@Prop() recommendedGames: Game[];
	@Prop() userRating: GameRating;
	@Prop() packages: GamePackage[];
	@Prop() releases: GameRelease[];
	@Prop() songs: GameSong[];
	@Prop() userPartnerKey: string;
	@Prop() partnerLink: string;
	@Prop() twitterShareMessage: string;
	@Prop() ratingBreakdown: number[];
	@Prop() posts: ActivityFeedContainer;

	@State app: AppState;

	profileCount = 0;
	downloadCount = 0;
	playCount = 0;
	developerGamesCount = 0;
	commentsCount = 0;
	supporters: User[] = [];

	showFullDescription = false;
	canToggleDescription = false;

	videoComments: CommentVideo[] = [];
	videoCommentsCount = 0;
	videoCommentsPage = 0;

	Screen = makeObservableService( Screen );
	Environment = Environment;

	routed()
	{
		this.profileCount = this.$payload.profileCount || 0;
		this.downloadCount = this.$payload.downloadCount || 0;
		this.playCount = this.$payload.playCount || 0;
		this.developerGamesCount = this.$payload.developerGamesCount || 0;

		this.supporters = User.populate( this.$payload.supporters );

		this.videoComments = CommentVideo.populate( this.$payload.videoComments );
		this.videoCommentsCount = this.$payload.videoCommentsCount || 0;

		// this.scoresPayload = _.pick( payload, [
		// 	'scoreTables',
		// 	'scoreTable',
		// 	'scores',
		// 	'scoresUserBestScore',
		// 	'scoresUserScorePlacement',
		// 	'scoresUserScoreExperience',
		// ] );

		// this.trophiesPayload = _.pick( payload, [
		// 	'trophies',
		// 	'trophiesAchieved',
		// 	'trophiesExperienceAchieved',
		// 	'trophiesShowInvisibleTrophyMessage',
		// ] );

		// // Partner referral system.
		// if ( payload.partnerReferredKey && payload.partnerReferredBy ) {
		// 	this.partnerReferredKey = payload.partnerReferredKey;
		// 	this.partnerReferredBy = new User( payload.partnerReferredBy );
		// 	this.partnerNoCut = payload.partnerNoCut || false;
		// }
	}

	get hasReleasesSection()
	{
		// The releases section exists if there are releases or songs.
		return this.releases.length || this.songs.length;
	}

	get hasPartnerControls()
	{
		return this.game.referrals_enabled && this.userPartnerKey && this.packages.length;
	}

	get showMultiplePackagesMessage()
	{
		return false;
	}

	updateCommentsCount( count: number )
	{
		this.commentsCount = count;
	}

	async loadVideoComments()
	{
		++this.videoCommentsPage;
		const response = await Api.sendRequest(
			'/web/discover/games/videos/'
			+ this.$route.params.id
			+ '?page=' + this.videoCommentsPage
		);
		this.videoComments = this.videoComments.concat( CommentVideo.populate( response.videos ) );
	}

	// copy partner link
}