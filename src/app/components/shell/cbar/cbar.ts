import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { State } from 'vuex-class';
import AppScrollScroller from '../../../../_common/scroll/scroller/scroller.vue';
import { AppState, AppStore } from '../../../../_common/store/app-store';
import { AppTooltip } from '../../../../_common/tooltip/tooltip';
import { Store } from '../../../store';
import AppShellCbarAddItem from './add-item/add-item.vue';
import AppShellCbarItem from './item/item.vue';

@Component({
	components: {
		AppShellCbarItem,
		AppShellCbarAddItem,
		AppScrollScroller,
	},
	directives: {
		AppTooltip,
	},
})
export default class AppShellCbar extends Vue {
	@AppState
	user!: AppStore['user'];

	@State
	communities!: Store['communities'];

	get shouldShow() {
		return !!this.user;
	}
}
