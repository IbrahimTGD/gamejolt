import { Mutation } from 'vuex-class';
import { Component } from 'vue-property-decorator';
import View from '!view!./join.html';

import { Connection } from '../../../../lib/gj-lib-client/components/connection/connection-service';
import { AppJolticon } from '../../../../lib/gj-lib-client/vue/components/jolticon/jolticon';
import { AppAuthJoin } from '../../../../lib/gj-lib-client/components/auth/join/join';
import { Store } from '../../../store/index';
import { loggedUserBlock } from '../auth';
import {
	BaseRouteComponent,
	RouteResolve,
} from '../../../../lib/gj-lib-client/components/route/route-component';
import { FormModel } from '../../../../lib/gj-lib-client/components/auth/join/join-form';

@View
@Component({
	name: 'RouteAuthJoin',
	components: {
		AppJolticon,
		AppAuthJoin,
	},
})
export default class RouteAuthJoin extends BaseRouteComponent {
	@Mutation setCredentials: Store['setCredentials'];

	readonly Connection = Connection;

	@RouteResolve()
	async routeResolve() {
		return loggedUserBlock();
	}

	get routeTitle() {
		return this.$gettext('auth.join.page_title');
	}

	async onJoining(formModel: FormModel) {
		// We store these so we can log them in automatically once their
		// verification happens.
		this.setCredentials({
			username: formModel.username,
			password: formModel.password,
		});

		this.$router.push({
			name: 'auth.join-almost',
			params: { token: formModel.token },
		});
	}
}
