<template>
	<div>
		<div class="-metadata">
			<div class="-metadata-label">
				<translate>Development Stage</translate>
			</div>
			<app-lazy-placeholder tag="span" :when="game.development_status">
				<span class="lazy-placeholder" style="width: 80px"></span>

				<span class="-metadata-value">
					<translate v-if="game._is_devlog">
						Devlog
					</translate>

					<translate v-if="game._is_wip">
						Early Access
					</translate>

					<translate v-if="game._is_finished">
						Complete
					</translate>

					<translate class="tag tag-notice" v-if="game.canceled">
						Canceled
					</translate>
				</span>
			</app-lazy-placeholder>
		</div>

		<div class="-metadata">
			<div class="-metadata-label">
				<translate>Engine/Language</translate>
			</div>
			<app-lazy-placeholder tag="span" :when="creationTool">
				<span class="lazy-placeholder" style="width: 100px"></span>
				<span class="-metadata-value">
					{{ creationTool }}
				</span>
			</app-lazy-placeholder>
		</div>

		<div class="-metadata" v-if="game.published_on">
			<div class="-metadata-label">
				<translate>Published On</translate>
			</div>
			<app-lazy-placeholder tag="span" :when="game.published_on">
				<span class="lazy-placeholder" style="width: 120px"></span>
				<router-link
					class="-metadata-value"
					:to="{
						name: 'discover.games.list._fetch-date',
						params: {
							section: 'by-date',
							date: date(game.published_on, 'YYYY-MM-DD'),
						},
					}"
				>
					{{ game.published_on | date('longDate') }}
				</router-link>
			</app-lazy-placeholder>
		</div>

		<br />

		<ul class="list-unstyled" v-if="hasLinksSection">
			<li v-if="game.web_site">
				<app-jolticon icon="world" />
				<app-link-external :href="game.web_site">
					<translate>Game Website</translate>
				</app-link-external>
			</li>
			<li v-if="facebookAccount">
				<app-jolticon icon="facebook" />
				<app-link-external :href="facebookAccount.facebookPageUrl">
					{{ facebookAccount.facebookSelectedPage.name }}
				</app-link-external>
			</li>
			<li v-if="twitterAccount">
				<app-jolticon icon="twitter-bird" />
				<app-link-external :href="twitterAccount.platformLink">
					@{{ twitterAccount.name }}
				</app-link-external>
			</li>
			<li v-if="tumblrAccount">
				<app-jolticon icon="tumblr" />
				<app-link-external :href="tumblrAccount.tumblrSelectedBlog.url">
					{{ tumblrAccount.tumblrSelectedBlog.title }}
				</app-link-external>
			</li>
		</ul>
	</div>
</template>

<style lang="stylus" scoped>
@require '~styles/variables'
@require '~styles-lib/mixins'

.-metadata
	display: flex
	flex-direction: row
	align-items: flex-start

.-metadata-label
	flex: none
	width: 150px
	margin-right: 10px

.-metadata-value
	font-weight: bold
</style>

<script lang="ts" src="./details"></script>
