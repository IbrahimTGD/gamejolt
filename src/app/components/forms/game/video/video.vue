<template>
	<app-form name="mediaForm">
		<app-form-group name="_url" :label="$gettext(`dash.games.media.video.form.url_label`)">
			<app-form-control type="text" :rules="{ pattern: GameVideo.REGEX.VIDEO }" />

			<app-form-control-errors :label="$gettext(`dash.games.media.video.form.url_error_label`)" />

			<p class="help-block" v-translate>
				We currently only support videos from Vimeo or YouTube.
				<br />
				The URL should look something like:
				<br />
				<strong>YouTube:</strong>
				http://www.youtube.com/watch?v=oHg5SJYRHA0
				<br />
				<strong>Vimeo:</strong>
				http://www.vimeo.com/2619976
			</p>
		</app-form-group>

		<app-form-group name="title" :label="$gettext(`dash.games.media.video.form.title_label`)">
			<app-form-control type="text" :rules="{ max: 150 }" />
			<app-form-control-errors />
		</app-form-group>

		<app-form-group
			name="description"
			:label="$gettext(`dash.games.media.video.form.description_label`)"
			:optional="true"
		>
			<app-form-control-textarea rows="5" :rules="{ max: 2500 }" />
			<app-form-control-errors />
		</app-form-group>

		<app-form-button show-when-valid>
			<translate v-if="method === 'add'">Add</translate>
			<translate v-else-if="method === 'edit'">Save</translate>
		</app-form-button>
	</app-form>
</template>

<script lang="ts" src="./video"></script>
