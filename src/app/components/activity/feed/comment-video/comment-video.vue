<template>
	<div>
		<app-activity-feed-video
			:video-id="video.video_id"
			:thumbnail="video.img_thumbnail"
			:is-hydrated="isHydrated"
			@bootstrap="$emit('content-bootstrapped')"
			@play="$emit('expanded')"
		/>

		<br />

		<app-fade-collapse
			:collapse-height="200"
			:is-open="isOpen"
			@require-change="canToggleChanged"
			@expand="toggleFull"
		>
			<app-content-viewer :source="video.comment.comment_content" />
		</app-fade-collapse>
	</div>
</template>

<script lang="ts" src="./comment-video"></script>
