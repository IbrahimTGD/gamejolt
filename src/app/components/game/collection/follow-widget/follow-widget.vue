<template>
	<app-button
		class="game-collection-follow-widget"
		primary
		:icon="icon"
		:circle="circle"
		:overlay="overlay"
		:block="block"
		:solid="isFollowing"
		:badge="badge"
		v-app-auth-required
		v-app-tooltip.bottom="tooltip"
		v-app-track-event="`game-collection-follow:${!isFollowing ? 'follow' : 'unfollow'}`"
		@click="onClick"
	>
		<template v-if="!circle">
			<template v-if="!isFollowing">
				<translate v-if="collection.type === 'developer'">Follow Developer</translate>
				<translate v-else-if="collection.type === 'jam'">Follow Jam</translate>
				<translate v-else>Follow Playlist</translate>
			</template>
			<template v-else>
				<translate>Following</translate>
			</template>
		</template>
	</app-button>
</template>

<script lang="ts" src="./follow-widget"></script>
