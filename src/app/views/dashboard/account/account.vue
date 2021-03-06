<template>
	<div>
		<div v-if="Screen.isXs" class="well fill-darker sans-margin-bottom">
			<app-button block icon="chevron-left" :to="{ name: 'dash.account-mobile-nav' }">
				<translate>Back to Account</translate>
			</app-button>
		</div>

		<app-page-header>
			<h1>{{ heading }}</h1>

			<p>
				<small>@{{ app.user.username }}</small>
			</p>

			<app-editable-overlay
				v-if="!Screen.isXs"
				slot="spotlight"
				class="-fill"
				@click="showEditAvatar()"
				:disabled="$route.name !== 'dash.account.edit'"
			>
				<translate slot="overlay">Change</translate>
				<app-user-avatar :user="app.user" />
			</app-editable-overlay>
		</app-page-header>

		<app-expand :when="$route.name === 'dash.account.edit'">
			<app-editable-overlay @click="showEditHeader()">
				<translate slot="overlay">Change Profile Header</translate>

				<!--
				If no header yet, show their highlight color with a min-height.
			-->
				<div
					class="fill-highlight"
					:style="{
						'min-height': !app.user.header_media_item ? '200px' : '',
					}"
				>
					<app-media-item-cover
						v-if="app.user.header_media_item"
						:media-item="app.user.header_media_item"
						:max-height="400"
					/>
				</div>
			</app-editable-overlay>
		</app-expand>

		<!-- Don't show content before this route has loaded in the account data. -->
		<section class="section" v-if="isRouteBootstrapped">
			<div class="container">
				<div class="row">
					<div class="col-sm-3 col-md-2" v-if="!Screen.isXs">
						<nav class="platform-list">
							<ul>
								<li>
									<router-link :to="{ name: 'dash.account.edit' }" active-class="active">
										<translate>Profile</translate>
									</router-link>
								</li>
								<li>
									<router-link :to="{ name: 'dash.account.site' }" active-class="active">
										<translate>Portfolio Site</translate>
									</router-link>
								</li>
							</ul>
							<hr />
							<ul>
								<li>
									<router-link :to="{ name: 'dash.account.linked-accounts' }" active-class="active">
										<translate>Linked Accounts</translate>
									</router-link>
								</li>
								<li>
									<router-link
										:to="{ name: 'dash.account.email-preferences' }"
										active-class="active"
									>
										<translate>Email Preferences</translate>
									</router-link>
								</li>
								<li>
									<router-link :to="{ name: 'dash.account.change-password' }" active-class="active">
										<translate>Password</translate>
									</router-link>
								</li>
							</ul>
							<hr />
							<ul>
								<li>
									<router-link :to="{ name: 'dash.account.payment-methods' }" active-class="active">
										<translate>Payment Methods</translate>
									</router-link>
								</li>
								<li>
									<router-link :to="{ name: 'dash.account.addresses' }" active-class="active">
										<translate>Saved Addresses</translate>
									</router-link>
								</li>
								<li>
									<router-link :to="{ name: 'dash.account.purchases.list' }" active-class="active">
										<translate>Purchases</translate>
									</router-link>
								</li>
							</ul>
							<hr />
							<ul>
								<li>
									<router-link :to="{ name: 'dash.account.financials' }" active-class="active">
										<translate>Marketplace Account Setup</translate>
									</router-link>
								</li>
								<li>
									<router-link :to="{ name: 'dash.account.withdraw-funds' }" active-class="active">
										<translate>Revenue</translate>
									</router-link>
								</li>
							</ul>
						</nav>
					</div>
					<div class="col-xs-12 col-sm-9 col-md-10">
						<template v-if="Screen.isXs && $route.name === 'dash.account.edit'">
							<app-editable-overlay class="-avatar-xs" @click="showEditAvatar()">
								<translate slot="overlay">Change</translate>
								<app-user-avatar :user="app.user" />
							</app-editable-overlay>

							<hr />
						</template>

						<router-view />
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<style lang="stylus" scoped>
@require '~styles/variables'
@require '~styles-lib/mixins'

.-fill
	position: absolute
	top: 0
	right: 0
	bottom: 0
	left: 0

.-avatar-xs
	margin: 0 auto
	max-width: 200px
	border-radius: 50%
	overflow: hidden
</style>

<script lang="ts" src="./account"></script>
