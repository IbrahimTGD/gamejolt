<template>
	<div v-if="parent.requiresField(namePrefix + '.line1') || forceRequired">
		<div v-if="!parent.getStripeField(namePrefix + '.line1')">
			<app-form-group
				v-if="parent.requiresField(namePrefix + '.line1') || forceRequired"
				:name="`${namePrefix}.line1`"
				:label="$gettext('Address')"
			>
				<app-form-control />
				<app-form-control-errors />
			</app-form-group>

			<app-form-group
				v-if="parent.requiresField(namePrefix + '.line1') || forceRequired"
				:name="`${namePrefix}.line2`"
				:label="$gettext('Apartment/Suite/Unit')"
				:optional="true"
			>
				<app-form-control />
				<app-form-control-errors />
			</app-form-group>

			<!--
			We only ask for their country if this is an additional owner.
			Additional owners can live in any country.
		-->
			<app-form-group
				v-if="forceRequired"
				:name="`${namePrefix}.country`"
				:label="$gettext('Country')"
			>
				<app-form-control-select>
					<option
						v-for="country of countries"
						:key="country.code"
						:value="country.code.toUpperCase()"
					>
						{{ country.name }}
					</option>
				</app-form-control-select>
				<app-form-control-errors />
			</app-form-group>

			<div class="row" v-if="parent.requiresField(namePrefix + '.city') || forceRequired">
				<div class="col-sm-4">
					<app-form-group :name="`${namePrefix}.city`" :label="$gettext('City')">
						<app-form-control />
						<app-form-control-errors />
					</app-form-group>
				</div>
				<div class="col-sm-4" v-if="parent.requiresField(namePrefix + '.state') || forceRequired">
					<app-form-group :name="`${namePrefix}.state`" :label="$gettext('State/Province/County')">
						<app-form-control />
						<app-form-control-errors />
					</app-form-group>
				</div>
				<div
					class="col-sm-4"
					v-if="parent.requiresField(namePrefix + '.postal_code') || forceRequired"
				>
					<app-form-group :name="`${namePrefix}.postal_code`" :label="$gettext('Zip/Postal Code')">
						<app-form-control />
						<app-form-control-errors />
					</app-form-group>
				</div>
			</div>
		</div>

		<div class="form-horizontal" v-if="parent.getStripeField(namePrefix + '.line1')">
			<div class="form-group">
				<label class="control-label col-sm-4">
					<translate>Address</translate>
				</label>
				<div class="form-static col-sm-8">
					<div>{{ parent.getStripeField(namePrefix + '.line1') }}</div>
					<div v-if="parent.getStripeField(namePrefix + '.line2')">
						{{ parent.getStripeField(namePrefix + '.line2') }}
					</div>
					<div>{{ parent.getStripeField(namePrefix + '.city') }}</div>
					<div v-if="parent.getStripeField(namePrefix + '.state')">
						{{ parent.getStripeField(namePrefix + '.state') }}
					</div>

					<div v-if="parent.getStripeField(namePrefix + '.country')">
						{{ Geo.getCountryName(parent.getStripeField(namePrefix + '.country')) }}
					</div>
					<div v-if="!parent.getStripeField(namePrefix + '.country')">
						{{ Geo.getCountryName(account.country_code) }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" src="./address"></script>
