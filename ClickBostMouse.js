/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/MouseBoostAbuse.ts":
/*!**********************************!*\
  !*** ./src/MouseBoostAbuse.ts ***!
  \**********************************/
/***/ (() => {

	// Definición del objeto MouseBoostAbuse
	const MouseBoostAbuse = {};

	// Declaración de la variable localHero
	let myHero = null;
    let myPlayer = null;

    let root = Panorama.GetDotaHudRoot();
    let panorama = {
        items: null,
        neutrals: null
    };

	// Definición del array path_
	const path_ = ["Custom Scripts","Utility","Mouse Boost Repeat"];

	// Creación del toggle isUiEnabled
	let isUiEnabled = Menu.AddToggle(path_, 'Enable', true);
	
	Menu.SetImage(path_, 'panorama/images/mouse_illustrations_png.vtex_c');	

	// Declaración de la variable mouseBoostInterval
	let mouseBoostInterval = null;
	let exOrders = [Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_TARGET, Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_MOVE];
    let accessOrders = [Enum.UnitOrder.DOTA_UNIT_ORDER_MOVE_TO_POSITION, Enum.UnitOrder.DOTA_UNIT_ORDER_MOVE_TO_DIRECTION, Enum.UnitOrder.DOTA_UNIT_ORDER_PICKUP_ITEM, Enum.UnitOrder.DOTA_UNIT_ORDER_PICKUP_RUNE];
	
	let lastOrder;
	// Definición de la función startMouseBoost
	MouseBoostAbuse.OnPrepareUnitOrders = (event) => {
		if (myHero && isUiEnabled.GetValue()) {

            if (exOrders.includes(event.order)) {
                if (mouseBoostInterval) {
                    clearInterval(mouseBoostInterval);
                    mouseBoostInterval = null;
                    lastOrder = null;
                }
            }
            else {
                let index = accessOrders.indexOf(event.order);
                if (index >= 0) {
                    if (event.order != lastOrder) {
                        lastOrder = event.order;
                        if (mouseBoostInterval) {
                            clearInterval(mouseBoostInterval);
                            mouseBoostInterval = null;
                        }
                        if (!mouseBoostInterval) {
                            mouseBoostInterval = setInterval(() => {
                                if (!Input.IsKeyDown(Enum.ButtonCode.MOUSE_RIGHT)) {
                                    clearInterval(mouseBoostInterval);
                                    mouseBoostInterval = null;
                                    lastOrder = null;
                                    return;
                                }
                                if (!CheckOnPanorama(panorama.items) && !CheckOnPanorama(panorama.neutrals) && !Engine.IsShopOpen() &&
                                    !Engine.IsMenuOpen() && !Input.IsCursorOnMinimap() && (index > 1 ? event.target && event.target.IsExist() : true)) {
                                    myPlayer.PrepareUnitOrdersStructed({
                                        orderIssuer: event.orderIssuer,
                                        orderType: event.order,
                                        target: index != 0 ? event.target : undefined,
                                        position: index == 0 ? Input.GetWorldCursorPos() : undefined,
                                        entity: myHero
                                    });
                                }
                            }, 50);
                        }
                    }
                    return;
                }
            }
		}
	}

	function CheckOnPanorama(panoramaPanel) {
        if (!panoramaPanel) {
            return;
        }
        let [x, y] = panoramaPanel.GetPosition();
        let [width, height] = panoramaPanel.GetSize();
        return Input.IsCursorInRect(x, y, width, height);
    }

	// Definición de la función OnUpdate
	MouseBoostAbuse.OnUpdate = () => {
		if (myHero && isUiEnabled.GetValue()) {
            if (Engine.OnceAtByKey(1, 'MouseBoostAbuse')) {
                panorama = {
                    items: root.FindChildFromPath(['Hud', 'HUDElements', 'lower_hud', 'center_with_stats', 'center_block',
                        'inventory', 'inventory_items', 'inventoryContainer', 'inventory_list_container']),
                    neutrals: root.FindChildFromPath(['Hud', 'HUDElements', 'lower_hud',
                        'center_with_stats', 'center_block',
                        'inventory_composition_layer_container'])
                };
            }
		}
	};

	// Definición de la función OnScriptLoad
	MouseBoostAbuse.OnScriptLoad = MouseBoostAbuse.OnGameStart = () => {
	  myHero = EntitySystem.GetLocalHero();
	  myPlayer = EntitySystem.GetLocalPlayer();
	};

	// Definición de la función OnGameEnd
	MouseBoostAbuse.OnGameEnd = () => {
	  	myHero = null;
		myPlayer = null;
		lastOrder = null;
		panorama = {
			items: null,
			neutrals: null
		};
	};

	// Registro del script
	RegisterScript(MouseBoostAbuse);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/MouseBoostAbuse.ts"]();
/******/ 	
/******/ })()
;
