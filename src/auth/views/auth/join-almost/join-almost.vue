<template>
	<div class="anim-fade-in-up">
		<h2 class="section-header">
			<!-- signups with gamejolt required a captcha to be solved. lets congratulate them \o/ -->
			<template v-if="isGamejoltSignup">
				<translate>Almost there, human!</translate>
				<br />
				(ヽ° - °)ヽ┳━┳
			</template>
			<template v-else>
				<translate>Almost there!</translate>
			</template>
		</h2>

		<p>
			<translate>
				Before you can log in to Game Jolt, you need to verify the email address on your account.
			</translate>
		</p>
		<p>
			<translate>
				We've sent you an email with instructions on how to authorize your account.
			</translate>
		</p>
		<p class="small text-muted">
			<translate>auth.join.almost.spam</translate>
		</p>
		<p class="small text-muted">
			<translate>auth.join.almost.urgency</translate>
		</p>

		<!--
		We poll to see if their account gets authorized or not.
		When it does, we can log them in.
	-->
		<app-progress-poller
			v-if="isGamejoltSignup"
			:url="`/web/auth/poll-authorized/${username}`"
			@complete="onAuthorized"
		/>
	</div>
</template>

<script lang="ts" src="./join-almost"></script>
