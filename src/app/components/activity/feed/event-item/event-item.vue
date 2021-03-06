<template>
	<div class="-container">
		<div
			class="-item"
			:class="{
				'-new': isNew,
			}"
			@click.capture="onClickCapture"
			@click="onClick"
		>
			<div class="-header" v-if="user">
				<div class="-header-content">
					<app-user-card-hover :user="user" :disabled="!feed.shouldShowUserCards">
						<div class="-header-avatar">
							<div class="-header-avatar-inner">
								<app-user-avatar :user="user" />
							</div>
						</div>
					</app-user-card-hover>

					<div class="-header-byline">
						<div class="-header-byline-name">
							<strong>
								<router-link
									class="link-unstyled"
									:to="{
										name: 'profile.overview',
										params: { username: user.username },
									}"
								>
									{{ user.display_name }}
									<app-user-verified-tick :user="user" />
								</router-link>
							</strong>

							<small class="text-muted">
								<router-link
									class="link-unstyled"
									:to="{
										name: 'profile.overview',
										params: { username: user.username },
									}"
								>
									@{{ user.username }}
								</router-link>
							</small>
						</div>

						<div class="-header-byline-game" v-if="game && !feed.hideGameInfo">
							<strong class="text-muted">
								<router-link :to="gameUrl" class="link-unstyled">
									{{ game.title }}
								</router-link>
							</strong>
						</div>
					</div>
				</div>
				<div class="-header-meta small text-muted">
					<app-user-follow-widget
						v-if="shouldShowFollow"
						class="-header-meta-follow"
						:user="user"
						:sm="Screen.isXs"
						hide-count
						event-label="feed"
					/>

					<span>
						<span v-if="shouldShowIsPinned" class="tag">
							<app-jolticon icon="thumbtack" />
							<translate>Pinned</translate>
						</span>
						<app-activity-feed-event-item-time
							:event-item="eventItem"
							:post="post"
							:link="linkResolved"
						/>
					</span>
				</div>
			</div>

			<app-activity-feed-comment-video
				v-if="eventItem.type === EventItem.TYPE_COMMENT_VIDEO_ADD"
				:item="item"
				:video="video"
				@expanded="onExpand"
				@content-bootstrapped="onContentBootstrapped"
			/>
			<template v-if="post">
				<app-activity-feed-devlog-post-video
					v-if="post.hasVideo"
					:item="item"
					:post="post"
					@click.native.stop
					@expanded="onExpand"
					@content-bootstrapped="onContentBootstrapped"
				/>

				<app-activity-feed-devlog-post-sketchfab
					v-if="post.hasSketchfab"
					:item="item"
					:post="post"
					@click.native.stop
					@expanded="onExpand"
					@content-bootstrapped="onContentBootstrapped"
				/>

				<app-activity-feed-devlog-post-media
					v-if="post.hasMedia"
					:item="item"
					:post="post"
					@expanded="onExpand"
					@content-bootstrapped="onContentBootstrapped"
				/>

				<!--
					This shouldn't ever really show a collapser. It's for the jokers that think it would
					be fun to make a post with a bunch of new lines.
				-->
				<app-fade-collapse
					:collapse-height="600"
					:is-open="isLeadOpen"
					:animate="false"
					@require-change="canToggleLeadChanged"
				>
					<app-content-viewer class="fireside-post-lead" :source="post.lead_content" />
				</app-fade-collapse>

				<a class="hidden-text-expander" v-if="canToggleLead" @click="toggleLead()"></a>

				<app-activity-feed-devlog-post-text
					v-if="post.hasArticle"
					:item="item"
					:post="post"
					@expanded="onExpand"
					@content-bootstrapped="onContentBootstrapped"
				/>

				<div class="-poll" v-if="post.hasPoll" @click.stop>
					<app-poll-voting :poll="post.poll" :game="post.game" :user="post.user" />
				</div>

				<div class="-communities" v-if="shouldShowCommunities">
					<div class="-community-row" v-for="postCommunity of communities" :key="postCommunity.id">
						<app-community-pill
							v-if="!feed.hideCommunity"
							:community="postCommunity.community"
							:channel="feed.hideCommunityChannel ? undefined : postCommunity.channel"
						/>
						<app-pill v-else :to="getChannelRoute(postCommunity)">
							{{ getChannelTitle(postCommunity) }}
						</app-pill>
					</div>
				</div>
			</template>

			<app-event-item-controls
				class="-controls"
				:class="{
					'-controls-comment-video': eventItem.type === EventItem.TYPE_COMMENT_VIDEO_ADD,
				}"
				:post="post"
				:video="video"
				:show-user-follow="shouldShowFollow"
				@post-edit="onPostEdited(eventItem)"
				@post-publish="onPostPublished(eventItem)"
				@post-remove="onPostRemoved(eventItem)"
				@post-feature="onPostFeatured(eventItem, $event)"
				@post-unfeature="onPostUnfeatured(eventItem, $event)"
				@post-move-channel="onPostMovedChannel(eventItem, $event)"
				@post-reject="onPostRejected(eventItem, $event)"
				@post-pin="onPostPinned(eventItem)"
				@post-unpin="onPostUnpinned(eventItem)"
			/>
		</div>
	</div>
</template>

<style lang="stylus" src="./event-item.styl" scoped></style>

<script lang="ts" src="./event-item"></script>
