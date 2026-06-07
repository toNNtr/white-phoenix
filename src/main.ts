import type * as common from "@/types/common";
import type * as utility from "@/types/utility";

import * as helpers from "@/api/helpers";
import * as popup from "@/api/popup";

import * as button from "@/ui/button";
import * as buttonGroup from "@/ui/button-group";
import * as card from "@/ui/card";
import * as dropdown from "@/ui/dropdown";
import * as icon from "@/ui/icon";
import * as layout from "@/ui/layout";
import * as modal from "@/ui/modal";
import * as catalog from "@/ui/catalog";

export type { common, utility };
export const api = { helpers, popup };
export const ui = { button, buttonGroup, card, dropdown, icon, layout, modal, catalog };
