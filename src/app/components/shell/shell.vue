<template>
	<div
		id="shell"
		:class="{
			'is-client-offline': Connection.isClientOffline,
			'left-pane-visible': isLeftPaneVisible,
			'right-pane-visible': isRightPaneVisible,
			'has-cbar': hasCbar,
			'has-banner': hasBanner && !isShellHidden,
		}"
	>
		<app-shell-banner v-if="!isShellHidden" />
		<app-shell-top-nav v-if="hasTopBar" />
		<app-shell-cbar v-if="hasCbar" />
		<app-shell-sidebar v-if="hasSidebar" />

		<template v-if="isShellHidden">
			<slot />
		</template>
		<app-shell-body v-else>
			<slot />
		</app-shell-body>

		<app-shell-chat v-if="chat" key="shell-chat" />

		<div v-if="GJ_IS_CLIENT" key="shell-client">
			<app-client-base />
			<app-shell-client />
		</div>

		<app-shell-hot-bottom>
			<app-minbar v-show="!isRightPaneVisible" />
			<app-client-status-bar v-if="GJ_IS_CLIENT" key="shell-client-status-bar" />
		</app-shell-hot-bottom>
	</div>
</template>

<script lang="ts" src="./shell"></script>
