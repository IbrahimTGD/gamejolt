<template>
	<app-common-shell :class="{ 'is-client-offline': Connection.isClientOffline }">
		<app-cookie-banner />

		<div id="content">
			<app-error-page>
				<router-view />
			</app-error-page>
		</div>

		<app-client-base v-if="GJ_IS_CLIENT" />
	</app-common-shell>
</template>

<script lang="ts" src="./app"></script>
