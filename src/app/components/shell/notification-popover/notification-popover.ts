import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { Action, Mutation, State } from 'vuex-class';
import { Api } from '../../../../_common/api/api.service';
import { Connection } from '../../../../_common/connection/connection-service';
import AppLoading from '../../../../_common/loading/loading.vue';
import { Notification } from '../../../../_common/notification/notification-model';
import AppPopper from '../../../../_common/popper/popper.vue';
import { Screen } from '../../../../_common/screen/screen-service';
import { AppTooltip } from '../../../../_common/tooltip/tooltip';
import { Store } from '../../../store';
import AppActivityFeed from '../../activity/feed/feed.vue';
import { ActivityFeedView } from '../../activity/feed/view';

@Component({
	components: {
		AppPopper,
		AppLoading,
		AppActivityFeed,
	},
	directives: {
		AppTooltip,
	},
})
export default class AppShellNotificationPopover extends Vue {
	@State
	notificationState!: Store['notificationState'];

	@State
	unreadNotificationsCount!: Store['unreadNotificationsCount'];

	@Mutation
	setNotificationCount!: Store['setNotificationCount'];

	@Action
	markNotificationsAsRead!: Store['markNotificationsAsRead'];

	isShowing = false;
	isLoading = true;
	feed: ActivityFeedView | null = null;

	readonly Connection = Connection;

	get count() {
		return this.unreadNotificationsCount;
	}

	/**
	 * For mobile, the navbar item should be active when they are on
	 * notifications page, since there is no popover on mobile.
	 */
	get isNavbarItemActive() {
		return (Screen.isXs && this.$route.name === 'notifications') || this.isShowing;
	}

	/**
	 * This loads in lazily, so we want to capture it once it bootstraps into
	 * the store and wrap it with a view.
	 */
	@Watch('notificationState', { immediate: true })
	onNotificationStateChange(state: Store['notificationState']) {
		if (state) {
			this.feed = new ActivityFeedView(state, {
				slice: 15,
				shouldScroll: false,
				shouldShowUserCards: false,
			});
		} else {
			this.feed = null;
		}
	}

	/**
	 * When they click the item in the navbar, we don't want to open the popover
	 * on mobile. Let's just go to the notifications page.
	 */
	onNavbarItemClick(e: Event) {
		if (Screen.isXs) {
			e.stopPropagation();
			this.$router.push({ name: 'notifications' });
		}
	}

	async onShow() {
		this.isShowing = true;

		if (this.feed) {
			// If the feed isn't bootstrapped with data, then we have to do the
			// first bootstrapping call to get data into it.
			if (!this.feed.isBootstrapped) {
				const $payload = await Api.sendRequest('/web/dash/activity/notifications');

				const items = Notification.populate($payload.items);
				this.feed.append(items);
				this.setNotificationCount({ type: 'notifications', count: 0 });
			}
			// If it is already bootstrapped, we just want to load new items if
			// there is any.
			else {
				await this.feed.loadNew(this.unreadNotificationsCount);
				this.setNotificationCount({ type: 'notifications', count: 0 });
			}
		}

		this.isLoading = false;
	}

	onHide() {
		this.isShowing = false;
	}
}
