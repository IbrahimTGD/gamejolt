<template>
	<section class="section" v-if="post">
		<div v-app-scroll-when="true"></div>

		<div class="container">
			<div v-if="post.hasVideo" class="full-bleed-xs">
				<app-video-embed
					video-provider="youtube"
					:video-id="post.videos[0].video_id"
					:autoplay="true"
				/>

				<br />
			</div>

			<div class="row">
				<div class="col-sm-10 col-md-8 col-lg-7" :class="{ 'col-centered': Screen.isMobile }">
					<div class="post-view">
						<div v-if="post.hasMedia" class="full-bleed-xs">
							<div v-for="item of post.media" :key="item.id">
								<app-responsive-dimensions
									class="-media-item"
									:ratio="item.width / item.height"
									:max-width="item.width"
								>
									<app-event-item-media-tags :gif="item.is_animated" />

									<app-img-responsive
										class="-img"
										v-if="!item.is_animated"
										:src="item.mediaserver_url"
										alt=""
									/>

									<app-video
										v-else
										class="-video"
										:poster="item.mediaserver_url"
										:webm="item.mediaserver_url_webm"
										:mp4="item.mediaserver_url_mp4"
										show-loading
									/>
								</app-responsive-dimensions>

								<br />
							</div>
						</div>

						<div v-if="post.hasSketchfab" class="full-bleed-xs">
							<app-sketchfab-embed :sketchfab-id="post.sketchfabs[0].sketchfab_id" autoplay />
						</div>

						<div class="tiny text-muted">
							<app-time-ago v-if="post.isActive" :date="post.published_on" strict />
							<template v-else-if="post.isScheduled">
								<span class="tag" style="vertical-align: middle">
									<app-jolticon icon="calendar-grid" />
									<translate>Scheduled</translate>
								</span>
								<app-time-ago :date="post.scheduled_for" strict without-suffix />
							</template>
							<span v-else-if="post.isDraft" class="tag" style="vertical-align: middle">
								<translate>Draft</translate>
							</span>
						</div>

						<app-content-viewer :source="post.lead_content" />

						<div v-if="post.hasArticle">
							<div class="page-cut" />

							<app-content-viewer :source="post.article_content" />
						</div>
					</div>

					<template v-if="post.hasPoll">
						<app-poll-voting :poll="post.poll" :game="post.game" :user="post.user" />

						<br />
					</template>

					<template v-if="communities.length">
						<div
							class="-community-row"
							v-for="postCommunity of communities"
							:key="postCommunity.id"
						>
							<app-community-pill
								:community="postCommunity.community"
								:channel="postCommunity.channel"
							/>
						</div>

						<br />
					</template>

					<app-event-item-controls
						show-comments
						:post="post"
						@post-remove="onPostRemoved"
						@post-publish="onPostPublished"
					/>
				</div>
				<div class="col-md-4 col-lg-5" v-if="shouldShowAds && Screen.isDesktop">
					<app-ad-widget class="pull-right" />
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="stylus" scoped>
@require '~styles/variables'
@require '~styles-lib/mixins'

.-media-item
	change-bg('bg-offset')
	position: relative
	margin-left: auto
	margin-right: auto

.-img, .-video
	width: 100%
	height: 100%

@media $media-sm-up
	.post-view >>>
		.-media-item, img, video, iframe
			rounded-corners-lg()

>>> .mention-avatar-img
	border-radius: 50% !important

.-community-row
	display: flex
	align-items: center

</style>

<script lang="ts" src="./view"></script>
