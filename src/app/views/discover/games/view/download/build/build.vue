<template>
	<div>
		<iframe id="download-frame" class="hidden" nwdisable nwfaketop v-if="src" :src="src"></iframe>

		<div id="page-ad-scroll">
			<section class="section">
				<div :class="{ container: Screen.isDesktop }">
					<div :class="{ row: Screen.isDesktop }">
						<div :class="{ container: !Screen.isDesktop }">
							<div :class="{ row: !Screen.isDesktop }">
								<div class="col-sm-9 col-md-8" :class="{ 'pull-left': Screen.isDesktop }">
									<h2 class="section-header">
										<translate :translate-params="{ game: game.title }">
											Downloading %{ game }...
										</translate>
									</h2>

									<p class="small text-muted">
										<translate>game.download.game.downloading_wait_message</translate>
									</p>

									<!--
										Set visibility so that the page height doesn't
										change when we hide. We don't want to change if
										they're trying to click something.
									-->
									<app-loading
										:style="{ visibility: src ? 'hidden' : undefined }"
										:hide-label="true"
									/>

									<div class="row">
										<div class="col-sm-6">
											<!--
												Rating widget
											-->
											<template v-if="app.user && game.ratings_enabled">
												<h4 class="sans-margin-top">
													<translate>What did you think?</translate>
												</h4>

												<p class="small">
													<translate>
														Rating the games you play helps us show you better stuff.
													</translate>
												</p>

												<app-rating-widget
													:game="game"
													:user-rating="userRating"
													event-label="download-build"
												/>
											</template>
										</div>

										<div class="col-sm-6">
											<!--
												Social sharing
											-->
											<template v-if="!GJ_IS_CLIENT">
												<h4 class="sans-margin-top">
													<translate>game.download.game.share_heading</translate>
												</h4>
												<div class="social-widgets">
													<app-social-twitter-share
														:url="Environment.baseUrl + game.getUrl()"
														:content="twitterShareMessage"
													/>

													<span class="dot-separator hidden-xs"></span>

													<app-social-facebook-like :url="Environment.baseUrl + game.getUrl()" />
												</div>
											</template>
										</div>
									</div>

									<br />
									<app-ad-playwire-video />

									<!--
										Developer's games
									-->
									<template v-if="developerGames.length">
										<h2>
											<router-link
												class="link-unstyled"
												:to="{
													name: 'library.collection.developer',
													params: { id: game.developer.username },
												}"
											>
												<translate>game.download.game.developer_games_heading</translate>
											</router-link>
											<small>
												<translate>game.download.game.developer_games_heading_small</translate>
											</small>
										</h2>

										<div class="scrollable-grid-xs game-thumbnail-grid">
											<div class="row">
												<div
													class="scrollable-grid-item col-xs-10 col-sm-6"
													v-for="game of developerGames.slice(0, 2)"
													:key="game.id"
												>
													<app-game-thumbnail
														:game="game"
														v-app-track-event="'developer-games:click:download-build'"
													/>
												</div>
											</div>
										</div>
									</template>

									<br class="visible-xs visible-sm" />
								</div>
							</div>
						</div>

						<div class="col-md-4 pull-right" v-if="Screen.isDesktop">
							<div style="width: 300px">
								<app-ad-widget size="rectangle" />
							</div>

							<hr />
							<app-game-ogrs :game="game" />

							<app-discover-games-view-overview-details />
							<hr />

							<div style="width: 300px">
								<app-ad-widget size="rectangle" />
							</div>
						</div>

						<div :class="{ container: !Screen.isDesktop }">
							<div :class="{ row: !Screen.isDesktop }">
								<div class="col-sm-9 col-md-8" :class="{ 'pull-left': Screen.isDesktop }">
									<!--
										Recommended games
									-->
									<h2>
										<translate>game.download.game.recommended_heading</translate>
									</h2>

									<div class="scrollable-grid-xs">
										<div class="row">
											<div
												class="scrollable-grid-item col-xs-10 col-sm-6"
												v-for="game in recommendedGames.slice(0, 6)"
												:key="game.id"
											>
												<app-game-thumbnail
													:game="game"
													v-app-track-event="'recommended-games:click:download-build'"
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>

<script lang="ts" src="./build"></script>
