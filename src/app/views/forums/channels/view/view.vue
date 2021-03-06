<template>
	<div v-if="channel">
		<app-page-header>
			<h1>#{{ channel.name }}</h1>

			<!-- Don't let it get too long! -->
			<div class="row">
				<div class="col-sm-10 col-md-8 col-lg-7">
					<p>{{ channel.description }}</p>
				</div>
			</div>

			<div class="clearfix">
				<div :class="{ 'pull-right': !Screen.isXs }">
					<div>
						<app-button
							primary
							:block="Screen.isXs"
							:to="{
								name: 'forums.topics.add',
								params: { channel: channel.name },
							}"
						>
							<translate>Add Topic</translate>
						</app-button>
					</div>
				</div>

				<br class="hidden-sm-up" />

				<ul class="stat-list" :class="Screen.isXs ? 'text-center' : 'pull-left'">
					<li class="stat-big stat-big-smaller">
						<div class="stat-big-label">
							Topics
						</div>
						<div class="stat-big-digit">
							{{ channel.topics_count || 0 | number }}
						</div>
					</li>
					<li class="stat-big stat-big-smaller">
						<div class="stat-big-label">
							Replies
						</div>
						<div class="stat-big-digit">
							{{ channel.replies_count || 0 | number }}
						</div>
					</li>
				</ul>
			</div>

			<template slot="nav">
				<app-forum-breadcrumbs :channel="channel" :sort="sort" />
			</template>
		</app-page-header>

		<div class="section">
			<div class="container" id="forum-topics-list">
				<template v-if="stickyTopics.length">
					<app-forum-topic-list :topics="stickyTopics" :post-count-per-page="postCountPerPage" />

					<br />
				</template>

				<app-nav-tab-list>
					<ul>
						<li>
							<router-link
								:to="{
									name: 'forums.channels.view',
									params: { name: channel.name, sort: 'active' },
									query: { page: 1 },
								}"
								:class="{ active: sort === 'active' }"
							>
								<translate>Active</translate>
							</router-link>
						</li>
						<li>
							<router-link
								:to="{
									name: 'forums.channels.view',
									params: { name: channel.name, sort: 'new' },
									query: { page: 1 },
								}"
								:class="{ active: sort === 'new' }"
							>
								<translate>New</translate>
							</router-link>
						</li>
						<li>
							<router-link
								:to="{
									name: 'forums.channels.view',
									params: { name: channel.name, sort: 'top' },
									query: { page: 1 },
								}"
								:class="{ active: sort === 'top' }"
							>
								<translate>Top</translate>
							</router-link>
						</li>
						<li>
							<router-link
								:to="{
									name: 'forums.channels.view',
									params: { name: channel.name, sort: 'archived' },
									query: { page: 1 },
								}"
								:class="{ active: sort === 'archived' }"
							>
								<translate>Archived</translate>
							</router-link>
						</li>
					</ul>

					<template slot="meta" v-if="topics.length">
						<span class="text-muted small">
							<translate
								:translate-params="{
									currentPage: number(currentPage),
									count: number(listableTopicsCount),
								}"
								:translate-n="listableTopicsCount"
								translate-plural="Page %{ currentPage } of %{ count } topics."
							>
								%{ count } topic.
							</translate>
						</span>
					</template>
				</app-nav-tab-list>

				<br />

				<template v-if="topics.length">
					<app-forum-topic-list
						:topics="topics"
						:sort="sort"
						:use-upvotes="channel.type === 'voting'"
						:post-count-per-page="postCountPerPage"
					/>

					<app-pagination
						:pager="true"
						:items-per-page="perPage"
						:total-items="listableTopicsCount"
						:current-page="currentPage"
						@pagechange="Scroll.to('forum-topics-list', { animate: false })"
					/>
				</template>
				<div v-else class="text-center">
					<p class="lead">
						<translate>There aren't any topics here yet!</translate>
					</p>
					<p>
						<app-button
							primary
							:to="{
								name: 'forums.topics.add',
								params: { channel: channel.name },
							}"
						>
							<translate>Add Topic</translate>
						</app-button>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" src="./view"></script>
