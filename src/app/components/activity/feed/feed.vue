<template>
	<!--
		We need to refresh the whole feed anytime it's cleared or massively changed.
		Basically anytime the feed state's items are replaced so that the references
		to them get picked up again.
	-->
	<div class="activity-feed" :key="feed.id">
		<template v-if="(newCount && newCount > 0) || feed.isLoadingNew">
			<app-expand v-if="!feed.isLoadingNew" when animate-initial>
				<app-activity-feed-new-button @click="loadNew()">
					<translate
						:translate-n="newCount"
						:translate-params="{ count: number(newCount) }"
						translate-plural="%{count} new items"
					>
						1 new item
					</translate>
				</app-activity-feed-new-button>
			</app-expand>
			<app-loading v-else class="loading-centered" />
		</template>

		<!-- Need the div so that we can target the last child in the container. -->
		<div>
			<div class="-item" v-for="(item, i) of feed.items" :key="item.id">
				<app-activity-feed-item :item="item" />

				<div
					class="-ad-container well fill-offset full-bleed-xs text-center"
					v-if="shouldShowAd(i)"
				>
					<app-ad-widget size="rectangle" static-size />
					<div class="-ad-label text-muted small">
						<translate>Advertisement</translate>
					</div>
				</div>
			</div>
		</div>

		<!--
			If they are viewing a slice of the state, then we don't want to allow loading more.
		-->
		<app-scroll-inview v-if="!feed.slice" :margin="loadMoreMargin" @inview="onScrollLoadMore">
			<div v-if="shouldShowLoadMore" class="page-cut">
				<app-button
					:to="GJ_IS_SSR ? { query: { feed_last_id: lastPostId } } : undefined"
					trans
					@click="loadMoreButton"
					v-app-track-event="`activity-feed:more`"
				>
					<translate>Load More</translate>
				</app-button>
			</div>

			<app-loading v-if="feed.isLoadingMore" class="-bottom-loading loading-centered" />

			<div class="alert full-bleed-xs" v-if="feed.reachedEnd">
				<translate>
					A wild Snorlax blocks your path. Looks like it's the end of this feed.
				</translate>
			</div>
		</app-scroll-inview>
	</div>
</template>

<style lang="stylus" scoped src="./feed.styl"></style>
<script lang="ts" src="./feed"></script>
