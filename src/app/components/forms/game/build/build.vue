<template>
	<app-card-list-item class="game-build-form" :force-active="true">
		<a class="card-remove" @click="remove()">
			<app-jolticon icon="remove" />
		</a>

		<div class="card-stats">
			<div class="stat-big stat-big-smaller">
				<div class="stat-big-label">
					<translate>dash.games.releases.builds.downloads_label</translate>
				</div>
				<div class="stat-big-digit" :title="number(buildDownloadCounts[model.id] || 0)">
					{{ (buildDownloadCounts[model.id] || 0) | fuzzynumber }}
				</div>
			</div>
		</div>

		<div class="card-title">
			<h5>
				{{ model.primary_file.filename }}
				<small class="text-muted">({{ model.primary_file.filesize | filesize }})</small>
			</h5>
		</div>

		<div class="card-meta">
			<span class="tag" v-if="model.type === GameBuild.TYPE_DOWNLOADABLE">
				<app-jolticon icon="download" />
				<translate>Downloadable</translate>
			</span>
			<span class="tag" v-else-if="model.type === GameBuild.TYPE_HTML">
				<app-jolticon icon="html5" />
				<translate>games.browser_html</translate>
			</span>
			<span class="tag" v-else-if="model.type === GameBuild.TYPE_FLASH">
				<app-jolticon icon="flash" />
				<translate>games.browser_flash</translate>
			</span>
			<span class="tag" v-else-if="model.type === GameBuild.TYPE_UNITY">
				<app-jolticon icon="unity" />
				<translate>games.browser_unity</translate>
			</span>
			<span class="tag" v-else-if="model.type === GameBuild.TYPE_SILVERLIGHT">
				<app-jolticon icon="silverlight" />
				<translate>games.browser_silverlight</translate>
			</span>
			<span class="tag" v-else-if="model.type === GameBuild.TYPE_APPLET">
				<app-jolticon icon="java" />
				<translate>games.browser_applet</translate>
			</span>
			<span class="tag" v-else-if="model.type === GameBuild.TYPE_ROM">
				<app-jolticon icon="rom" />
				<translate>ROM</translate>
			</span>

			<!--
				Missing fields.
			-->
			<span class="tag tag-notice" v-if="model.hasError(GameBuild.ERROR_MISSING_FIELDS)">
				<app-jolticon icon="notice" />
				<translate>Incomplete</translate>
			</span>

			<span v-else>
				<span class="tag" v-if="model.status === GameBuild.STATUS_ADDING">
					<translate>Processing</translate>
				</span>
				<span class="tag tag-highlight" v-else-if="model.status === GameBuild.STATUS_ACTIVE">
					<app-jolticon icon="check" />
					<translate>Active</translate>
				</span>
			</span>
		</div>

		<!--
			Processing the build.
		-->
		<template v-if="shouldPollProgress">
			<app-progress-poller
				:url="pollUrl"
				@progress="processPollerResponse"
				@complete="processPollerResponse"
			/>

			<app-expand :when="!model.errors">
				<br />
				<app-progress-bar thin indeterminate active :percent="100" />

				<div class="text-center small" v-translate>
					<strong>Processing build.</strong>
					It will become available in this release as soon as we're done.
				</div>
			</app-expand>
		</template>

		<template slot="body">
			<app-form name="buildForm" ref="form">
				<div v-if="model.type === GameBuild.TYPE_APPLET" class="alert alert-notice sans-margin">
					<app-jolticon icon="notice" />
					<strong><translate>Java Applets have been deprecated.</translate></strong>
					<translate>
						You can no longer edit your Java Applet builds, although gamers will still be able to
						play them if their browsers support them. You can add .jar files as downloadables and
						the Game Jolt Client will correctly launch them for users instead.
					</translate>
				</div>
				<div
					v-else-if="model.type === GameBuild.TYPE_SILVERLIGHT"
					class="alert alert-notice sans-margin"
				>
					<app-jolticon icon="notice" />
					<strong><translate>Silverlight builds have been deprecated.</translate></strong>
					<translate>
						You can no longer edit your Silverlight builds, although gamers will still be able to
						play them if their browsers support them.
					</translate>
				</div>

				<!--
					Don't attach to the ng-form above or the scope will be messed up and not able to submit the form.
				-->
				<div v-if="!isDeprecated">
					<template v-if="archiveError">
						<app-expand class="-archive-error" :when="true">
							<div class="alert alert-notice sans-margin-bottom">
								<p>{{ archiveError }}</p>
								<p><translate>Please re-upload with a valid archive.</translate></p>
							</div>
						</app-expand>
					</template>

					<div v-else-if="model.primary_file.is_archive && !model.primary_file.is_archive_ready">
						<app-loading
							class="-rummaging"
							:label="$gettext(`Give us a second, we're rummaging through the archive...`)"
						/>
					</div>

					<template v-else>
						<div class="game-build-form-spinner no-animate-leave" v-if="isSettingPlatform">
							<app-loading :hide-label="true"></app-loading>
						</div>

						<!--
							Platform Selector
						-->
						<div
							class="downloadable-platforms"
							v-if="model.type === GameBuild.TYPE_DOWNLOADABLE && !forceOther"
						>
							<!--
								When this build is not able to launch on certain platforms.
							-->
							<p v-if="restrictedPlatforms.length">
								<app-jolticon icon="info-circle" />
								<translate>
									This build is not launchable on certain platforms. They've been disabled below.
								</translate>
							</p>

							<p
								:class="{
									'help-block': true,
									'sans-margin-top': !restrictedPlatforms.length,
								}"
							>
								<translate>
									Select "Other" if this build is for a platform that's not shown, or if it's a
									non-executable file such as a PDF.
								</translate>
							</p>

							<div class="clearfix">
								<div v-for="platform of platformOptions" :key="platform.key">
									<app-form-group :name="`os_${platform.key}`" :optional="true" :hide-label="true">
										<div class="checkbox" :class="{ disabled: isPlatformDisabled(platform.key) }">
											<label>
												<app-form-control-checkbox
													:disabled="isPlatformDisabled(platform.key)"
													@changed="platformChanged(platform.key)"
												/>
												{{ platform.label }}
											</label>
										</div>
									</app-form-group>
								</div>
							</div>

							<app-expand :when="hasPlatformsError">
								<div class="alert alert-notice sans-margin-bottom">
									<translate>
										You have to select at least one platform on which your build runs (or "Other").
									</translate>
								</div>
							</app-expand>
						</div>

						<!--
							This happens when it's not a launchable file type.
							In that case, it is forced as "other".
						-->
						<p class="sans-margin" v-if="forceOther">
							<app-jolticon icon="info-circle" />
							<translate>
								This build doesn't seem to be a Windows, Mac, or Linux build, so we've marked it as
								'Other' for you.
							</translate>
						</p>

						<!--
							Launch Options
						-->
						<fieldset
							v-if="
								!hasPlatformsError && model.type === GameBuild.TYPE_DOWNLOADABLE && !model.os_other
							"
							class="form-horizontal"
						>
							<legend><translate>Launch Options</translate></legend>

							<div v-if="model.primary_file.is_archive">
								<app-form-group
									v-for="platform of availablePlatformOptions"
									:key="platform.key"
									:name="`launch_${platform.key}`"
									:label="platform.label"
									label-class="col-sm-3"
								>
									<div class="col-sm-9">
										<div class="input-group input-group-sm">
											<app-form-control
												maxlength="500"
												:rules="{
													max: 500,
												}"
												@changed="onBuildFieldChanged"
											/>
											<!--  TODO: this doesn't register when the file is selected to clear the error -->

											<span class="input-group-addon">
												<a
													class="link-unstyled"
													v-app-tooltip="
														$gettext(
															`dash.games.releases.builds.launch_options.form.file_selector_tooltip`
														)
													"
													@click="openFileSelector(platform.key)"
												>
													<app-jolticon icon="ellipsis-h" />
												</a>
											</span>
										</div>

										<app-form-control-errors
											:ignore-dirty="true"
											:label="
												$gettext(`dash.games.releases.builds.launch_options.form.file_error_label`)
											"
										/>
									</div>
								</app-form-group>
							</div>

							<app-expand :when="serverErrors.launchOptions">
								<div class="alert alert-notice">
									<strong>
										<translate>The launch options you entered are invalid.</translate>
									</strong>
									<translate>
										Make sure each selected file is in your build and that it works on the
										appropriate operating system.
									</translate>
								</div>
							</app-expand>

							<app-expand :when="!model.primary_file.is_archive">
								<div>
									<p>
										<strong>
											<translate>
												We've detected that this build is a standalone executable file.
											</translate>
										</strong>
									</p>
									<p><translate>It can be launched automatically.</translate></p>
								</div>
							</app-expand>
						</fieldset>

						<!--
							Browser Embed Dimensions
						-->
						<div v-if="isBrowserBased">
							<app-form-group name="embed_fit_to_screen" :label="$gettext(`Fit to screen?`)">
								<app-form-control-toggle class="pull-right" @changed="onBuildFieldChanged" />

								<p class="help-block">
									<translate>
										If your game can stretch to fit the browser viewport, you can turn this option
										on to take up the whole available space.
									</translate>
								</p>
							</app-form-group>

							<template v-if="!isFitToScreen">
								<hr />

								<p class="help-block">
									<translate>
										These are the dimensions at which your browser build will be displayed.
									</translate>
								</p>

								<div class="row">
									<div class="col-sm-6">
										<app-form-group
											name="embed_width"
											:label="$gettext(`dash.games.builds.form.width_label`)"
										>
											<app-form-control
												class="input-sm"
												type="number"
												@changed="onBuildFieldChanged"
											/>
											<app-form-control-errors :ignore-dirty="true" />
										</app-form-group>
									</div>
									<div class="col-sm-6">
										<app-form-group
											name="embed_height"
											:label="$gettext(`dash.games.builds.form.height_label`)"
										>
											<app-form-control
												class="input-sm"
												type="number"
												@changed="onBuildFieldChanged"
											/>
											<app-form-control-errors :ignore-dirty="true" />
										</app-form-group>
									</div>
								</div>
							</template>

							<app-form-group name="https_enabled" :label="$gettext(`HTTPS support?`)">
								<app-form-control-toggle class="pull-right" @changed="onBuildFieldChanged" />

								<p class="help-block">
									<translate>
										If your game doesn't work on HTTPS you can disable this and we'll serve it over
										HTTP instead.
									</translate>
								</p>

								<div class="alert alert-notice" v-if="!formModel.https_enabled">
									<app-jolticon icon="notice" />
									<strong>
										<translate>
											It's highly recommended to get your game working on HTTPS!
										</translate>
									</strong>
									<translate>
										In order for your game to continue working on Game Jolt we need to pop it out
										into a new browser window when the user clicks to play it. This results in a
										worse user experience, but ensures that your game will still continue to be
										available on the site.
									</translate>
								</div>
							</app-form-group>
						</div>

						<!--
							Unity Right Click Menu
						-->
						<app-form-group
							v-if="formModel.type === GameBuild.TYPE_UNITY"
							name="browser_disable_right_click"
							:label="$gettext(`dash.games.builds.form.disable_right_click_label`)"
						>
							<p class="help-block">
								<translate>dash.games.builds.form.disable_right_click_help</translate>
							</p>
							<app-form-control-toggle @changed="onBuildFieldChanged" />
						</app-form-group>

						<div class="alert alert-notice" v-if="model.type === GameBuild.TYPE_UNITY">
							<app-jolticon icon="notice" />
							<strong>
								<translate>Most browsers have stopped supporting the Unity Web Player.</translate>
							</strong>
							<translate>Please consider exporting to WebGL instead.</translate>
						</div>

						<p v-if="isBrowserBased">
							<app-jolticon icon="notice" />
							<strong>
								<translate>
									Be sure to remove or block ads from showing in your browser games.
								</translate>
							</strong>
							<translate>
								We serve our own ads and share the revenue with developers. Domain names to block:
								gamejolt.com, *.gamejolt.com, gamejolt.net, *.gamejolt.net
							</translate>
						</p>

						<p class="sans-margin" v-if="model.type === GameBuild.TYPE_ROM">
							<app-jolticon icon="info-circle" />
							<translate
								:translate-params="{
									platform: emulatorsInfo[model.emulator_type],
								}"
								translate-comment="%{ platform } will be the platform this ROM works on, such as Game Boy, NES, etc."
							>
								We've detected this build is actually a ROM for the %{ platform }. We will
								automatically emulate it in browser for you!
							</translate>
						</p>

						<app-expand :when="hasBrowserError">
							<div class="alert alert-notice sans-margin-bottom">
								<translate>
									This build has more info to fill in before it will be available in this release.
								</translate>
							</div>
						</app-expand>
					</template>

					<app-form-button class="game-build-form-submit-button" v-if="valid && wasChanged">
						<translate>Save Build</translate>
					</app-form-button>
				</div>
			</app-form>
		</template>
	</app-card-list-item>
</template>

<style lang="stylus" src="./build.styl" scoped></style>

<script lang="ts" src="./build"></script>
