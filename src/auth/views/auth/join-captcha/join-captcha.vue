<template>
	<div class="anim-fade-in-up">
		<h2 class="section-header">
			<translate>Are you a robot?</translate>
			<br />
			(ノಠ益ಠ)ノ彡┻━┻
		</h2>

		<br />
		<app-grecaptcha-widget @response="onRecaptchaResponse" />
		<br />
		<div class="alert alert-notice" v-if="serverErrors">
			<translate v-if="serverErrors.token">
				Oh no, your sign-up session has expired!
			</translate>
			<translate v-else-if="serverErrors.captcha">
				Oh no, your captcha couldn't be validated. Please try again.
			</translate>
			<translate v-else-if="serverErrors.email || serverErrors.username">
				Oh no, someone already registered with your email or username! Gotta go fast.
			</translate>
			<translate v-else-if="serverErrors['rate-limit']">
				You must wait 15 minutes before creating another account.
			</translate>
			<translate v-else>
				Something weird happened!
			</translate>
			<br />
			<app-button primary @click="retryJoin" v-if="!serverErrors['rate-limit']">
				<translate>Retry</translate>
			</app-button>
		</div>
	</div>
</template>

<script lang="ts" src="./join-captcha"></script>
