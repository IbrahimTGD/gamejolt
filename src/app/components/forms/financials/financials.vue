<template>
	<app-form name="financialsForm" class="form-dashboard-financials" ref="form">
		<template v-if="!isVerified">
			<div class="alert">
				<translate>
					Before you can use the Marketplace, we'll need to gather some details from you. This will
					ensure that your account is completely set up and ready to run smoothly on the Game Jolt
					Marketplace.
				</translate>
			</div>

			<!--
				If they haven't accepted any terms yet.
			-->
			<fieldset v-if="!hasSignedAgreement && partner">
				<legend>
					<translate>To start, which type of account would you like to set up?</translate>
				</legend>

				<div class="row">
					<div class="col-xs-6">
						<app-button
							block
							:solid="whichAgreement === 'developer'"
							@click="whichAgreement = 'developer'"
						>
							<translate>I'm a game developer</translate>
						</app-button>
					</div>
					<div class="col-xs-6">
						<app-button
							block
							:solid="whichAgreement === 'partner'"
							@click="whichAgreement = 'partner'"
						>
							<translate>I'm a partner</translate>
						</app-button>
					</div>
				</div>
			</fieldset>
		</template>

		<div class="alert" v-if="isVerified">
			<app-jolticon icon="check" />
			<translate>
				Your account is ready for the Game Jolt Marketplace! You can set additional options below.
			</translate>
		</div>
		<br />

		<!--
			First step is to sign an agreement.
		-->
		<app-expand :when="!!whichAgreement || hasSignedAgreement">
			<app-developer-terms
				v-if="whichAgreement === 'developer' || hasSignedAgreement"
				:account="account"
				@accepted="acceptTerms('developer')"
			/>

			<app-partner-terms
				v-if="partner && (whichAgreement === 'partner' || hasSignedAgreement)"
				:account="account"
				@accepted="acceptTerms('partner')"
			/>
		</app-expand>

		<!--
		PayPal is required.
	-->
		<fieldset v-if="account">
			<legend>
				<span
					v-if="user.paypal_id"
					class="pull-right done-icon"
					v-app-tooltip="$gettext(`You have completed this section.`)"
				>
					<app-jolticon icon="check" big />
				</span>
				<translate>PayPal Account</translate>
			</legend>

			<div class="form-group">
				<p class="small">
					<translate>
						We currently use PayPal for automatic monthly deposits. You will also be able to
						withdraw your revenue at any time through this linked account.
					</translate>
				</p>

				<div v-if="user.paypal_id">
					<label class="control-label"><translate>Current PayPal Account</translate></label>
					<div class="form-static">{{ user.paypal_email_address }}</div>
					<br />
				</div>

				<app-button @click="linkPayPal()">
					<template v-if="!user.paypal_id">
						<translate>Link PayPal Account</translate>
					</template>
					<template v-else>
						<translate>Change PayPal Account</translate>
					</template>
				</app-button>
			</div>
		</fieldset>

		<!--
		They need to have PayPal linked before they can do this.
	-->
		<fieldset v-if="account && user.paypal_id">
			<legend>
				<span
					v-if="isVerified"
					class="pull-right done-icon"
					v-app-tooltip="$gettext(`You have completed this section.`)"
				>
					<app-jolticon icon="check" big />
				</span>
				<translate>Marketplace Account</translate>
			</legend>

			<form-financials-managed-account v-if="!account.skip_stripe" />

			<div class="alert" v-if="account.skip_stripe">
				<p>
					<translate>You've been manually approved for the Marketplace.</translate>
				</p>
			</div>
		</fieldset>

		<!--
		Only allow them to change percentage split if they are signed up as a dev.
	-->
		<fieldset v-if="isVerified && account.tos_signed_developer">
			<legend><translate>Percentage Split</translate></legend>

			<p class="small" v-translate>
				You decide what percentage of your sale revenue to give to Game Jolt.
				<b>We won't let you give us more than 10%</b>
				because we'd rather have you support other indie developers by buying their games.
			</p>

			<app-form-group name="percentage_split" :hide-label="true">
				<app-form-control
					type="number"
					step="1"
					max="10"
					min="0"
					:rules="{
						pattern: /^\d+$/,
						max_value: 10,
						min_value: 0,
					}"
				/>
				<app-form-control-errors
					label="percentage"
					when="pattern"
					:message="$gettext('Please enter a value between 0 and 10.')"
				/>
			</app-form-group>
		</fieldset>

		<fieldset v-if="isVerified">
			<legend><translate>Wallet</translate></legend>

			<p class="small">
				<translate>
					Your Wallet is where your earnings will be stored for you to buy games on Game Jolt or
					withdraw into your PayPal account.
				</translate>
			</p>

			<p class="small">
				<translate>
					We never take a cut of games you buy when you pay with your Wallet, and there are no
					payment processing fees. The money goes directly to the developer.
				</translate>
			</p>

			<app-form-group
				name="wallet_maximum"
				:label="$gettext(`Set an amount you would like to keep in your wallet`)"
			>
				<p class="help-block">
					<translate>
						We'll keep this amount in your Wallet when doing automatic pay outs. This way you always
						have some money to buy other games on the site through your Wallet.
					</translate>
					<br />
					<translate>
						To send all your money when doing automatic pay outs set this to $0.
					</translate>
				</p>

				<div class="input-group">
					<span class="input-group-addon">$</span>
					<app-form-control
						type="currency"
						step="1"
						:rules="{
							min_value: 0,
							max_value: maxWallet / 100,
						}"
					/>
				</div>
				<app-form-control-errors :label="$gettext('sum to keep in your wallet')" />
			</app-form-group>
		</fieldset>

		<fieldset v-if="isVerified">
			<legend><translate>Minimum Payout</translate></legend>

			<p class="small">
				<translate>
					If you'd like, you can set an amount below, and we will not make monthly deposits into
					your PayPal account until your revenue reaches this amount. This can help to maintain
					cleaner accounting on your end.
				</translate>
			</p>

			<app-form-group name="payout_minimum" :label="$gettext('Min. Payout Amount')">
				<p class="help-block">
					<translate
						:translate-params="{
							max: currency(maxPayout),
						}"
					>
						The max you can set this to is %{ max } USD.
					</translate>
					<br />
					<translate>For no minimum, set this to $0.</translate>
				</p>

				<div class="input-group">
					<span class="input-group-addon">$</span>
					<app-form-control
						type="currency"
						:rules="{
							min_value: 0,
							max_value: maxPayout / 100,
						}"
					/>
				</div>
				<app-form-control-errors :label="$gettext('minimum payout')" />
			</app-form-group>
		</fieldset>

		<app-form-button v-if="isVerified">
			<translate>Save</translate>
		</app-form-button>
	</app-form>
</template>

<style lang="stylus" scoped>
@require '~styles/variables'
@require '~styles-lib/mixins'

.form-dashboard-financials
	>>> .done-icon
		theme-prop('color', 'link')

	>>> .tos-scroller
		scrollable()
		theme-prop('border-color', 'bg-offset')
		padding: 10px
		max-height: 500px
		font-size: $font-size-small
		border-width: $border-width-base
		border-style: solid

		h1, h2, h3, h4, h5, h6, p
			&:first-child
				margin-top: 0
</style>

<script lang="ts" src="./financials"></script>
