<template>
	<div v-if="isRouteBootstrapped">
		<app-invalid-key v-if="invalidKey" />
		<section class="container" v-else>
			<component
				v-if="payload"
				:is="component"
				:access-key="accessKey"
				:payload="payload"
				:login-url="loginUrl"
				@claim="claim"
			/>
		</section>
	</div>
</template>

<script lang="ts" src="./key"></script>
