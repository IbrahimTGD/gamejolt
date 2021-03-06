import { Route } from 'vue-router';
import { namespace } from 'vuex-class';
import { NamespaceVuexStore, VuexModule, VuexMutation, VuexStore } from '../../../utils/vuex';
import { Ads, AdSettingsContainer } from '../../../_common/ad/ads.service';
import { Meta } from '../../../_common/meta/meta-service';
import { store } from '../../store';
import { SearchPayload } from '../../components/search/payload-service';
import { Search } from '../../components/search/search-service';

type RouteActions = {};

type RouteMutations = {
	initStore: Route;
	destroyStore: void;
	processPayload: { payload: SearchPayload; route: Route };
};

export const RouteStoreName = 'searchRoute';
export const RouteStoreModule = namespace(RouteStoreName);
export const routeStore = NamespaceVuexStore<RouteStore, RouteActions, RouteMutations>(
	store,
	RouteStoreName
);

@VuexModule()
export class RouteStore extends VuexStore<RouteStore, RouteActions, RouteMutations> {
	query = '';
	adSettings: AdSettingsContainer = null as any;
	searchPayload: SearchPayload = {} as any;

	get hasSearch() {
		return !!this.query;
	}

	@VuexMutation
	initStore(route: RouteMutations['initStore']) {
		// We store our own version of the search query and sync back to it on
		// form submission.
		this.query = route.query.q + '';

		this.adSettings = new AdSettingsContainer();
		// Always disable ads for now, until we get better controls of when
		// adult content is shown in search.
		this.adSettings.isPageDisabled = true;
		Ads.setPageSettings(this.adSettings);
	}

	@VuexMutation
	destroyStore() {
		Ads.releasePageSettings();
	}

	@VuexMutation
	processPayload({ payload, route }: RouteMutations['processPayload']) {
		// // Disable ads for adult searches.
		// if (payload.isAdultSearch) {
		// 	this.adSettings.isPageDisabled = true;
		// }

		this.query = '';

		if (!route.query.q) {
			this.searchPayload = new SearchPayload('all', {});
			return;
		}

		// Search results should always be deindexed.
		Meta.seo.deindex();

		this.query = route.query.q + '';
		this.searchPayload = payload;

		// We sync the query to the search service so that all places get
		// updated with the new query.
		Search.query = this.query;
	}
}
