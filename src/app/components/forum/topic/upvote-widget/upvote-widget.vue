<template>
	<span class="topic-upvote-button" v-if="canUpvote" v-app-auth-required>
		<app-button
			primary
			circle
			icon="thumbs-up"
			:solid="isUpvoted"
			@click="onUpvoteClick"
			v-app-tooltip="upvoteTooltip"
			v-app-track-event="`topic-upvote-widget:click`"
		/>

		<span class="blip filled" v-if="upvoteCount > 0">
			<span class="blip-caret"></span>
			<span class="blip-count">{{ upvoteCount | number }}</span>
		</span>
		&nbsp;
	</span>
</template>

<script lang="ts" src="./upvote-widget"></script>
