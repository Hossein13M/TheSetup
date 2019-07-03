import $ from "jquery"; // eslint-disable-line import/no-extraneous-dependencies

import {
    JQueryComponent,
    defineJQueryComponent,
    Set,
} from "hy-component/src/define-jquery-component";

import { drawerMixin, MIXIN_FEATURE_TESTS } from "../mixin";

export const JQUERY_FEATURE_TESTS = new Set([...MIXIN_FEATURE_TESTS]);
JQUERY_FEATURE_TESTS.delete("customevent");

export { Set };

defineJQueryComponent(
    "hy.drawer",
    class extends drawerMixin(JQueryComponent) {
        setupShadowDOM($el) {
            const children = $el.children().detach();

            $el
                .append($('<div class="hy-drawer-scrim" />'))
                .append($('<div class="hy-drawer-content" />').append(children));

            return $el;
        }
    }
);