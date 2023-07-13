/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ManaBarsNew.ts":
/*!**********************************!*\
  !*** ./src/ManaBarsNew.ts ***!
  \**********************************/
/***/ (() => {

	// Definición del objeto ManaBarsNew
	const ManaBarsNew = {};

	// Declaración de la variable localHero
	let localHero = null;
    let myPlayer = null;
	let enemyList = [];
	

	// Definición del array path_
	const path = ["Custom Scripts","Utility","Mana Bars"];

	// Creación del toggle isUiEnabled
	let isUiEnabled = Menu.AddToggle(path, 'Enable', false);
	let UiEnabledAllied = Menu.AddToggle(path, 'Aply to allies', false);
	let UiEnabledMP = Menu.AddToggle(path, 'Display MP Value', false);
	let UiEnabledHP = Menu.AddToggle(path, 'Display HP Value', false);

	Menu.SetImage(path, 'panorama/images/status_icons/quickcast_keyup_psd.vtex_c');
	Menu.SetImage(["Player"], 'panorama/images/plus/achievements/hero_levels_icon_png.vtex_c');
	Menu.SetImage(["Map"], 'panorama/images/plus/achievements/equip_seasonal_terrain_icon_png.vtex_c');
	Menu.SetImage(["ESP"], 'panorama/images/plus/achievements/spectator_win_probability_icon_png.vtex_c');
	Menu.SetImage(["Safeguard"], 'panorama/images/compendium/international2020/gold_shield_icon_psd.vtex_c');
	Menu.SetImage(["Information"], 'panorama/images/cavern/icon_winged_boots_png.vtex_c');
	Menu.SetImage(["Creeps"], 'panorama/images/cavern/icon_rosh_png.vtex_c');
	Menu.SetImage(["Griefing"], 'panorama/images/cavern/icon_talisman_png.vtex_c');
	Menu.SetImage(["General"], 'panorama/images/cavern/icon_style_png.vtex_c');
	Menu.SetImage(["Abuse"], 'panorama/images/cavern/icon_talisman_png.vtex_c');
	Menu.SetImage(["Heroes"], 'panorama/images/plus/achievements/hero_challenges_icon_png.vtex_c');
	Menu.SetImage(["Settings"], 'panorama/images/cavern/icon_shovel_png.vtex_c');
	Menu.SetImage(["DevTools"], 'panorama/images/plus/achievements/follow_lane_suggestor_icon_png.vtex_c');
	Menu.SetImage(["Custom Scripts"], 'panorama/images/cavern/icon_cullingblade_png.vtex_c');
	
	//UiEnabledAllied.SetImage('panorama/images/status_icons/quickcast_keyup_psd.vtex_c');
	UiEnabledMP.SetImage('panorama/images/econ/diretide/hex_icon_rarity_shadow_tier_3_large_selected_psd.vtex_c');
	UiEnabledHP.SetImage('panorama/images/econ/diretide/hex_icon_rarity_shadow_tier_2_large_selected_psd.vtex_c');

	// Definición de la función OnUpdate
	ManaBarsNew.OnDraw = () => {
		if (localHero && isUiEnabled.GetValue()) {
			
			//if (Engine.OnceAt(5.5)) {
			for (let hero of enemyList) {

				if (hero && hero !== localHero) {
		
					let font = Renderer.LoadFont("Tahoma", 10, Enum.FontWeight.EXTRABOLD);
					let heroNAME = hero.GetUnitName();
					let IdHERO = hero.GetPlayerID();
					let manaActual = hero.GetMana();
					let manaMax = hero.GetMaxMana();
					
					let hpActual = hero.GetHealth();
					let hpMax = hero.GetMaxHealth();
					
					let abs = hero.GetAbsOrigin();
					let MaxPixX = hero.GetHealthBarOffset();
					let zizeBar = 74;

					abs.z += MaxPixX;

					let[x, y, onscreen] = Renderer.WorldToScreen(abs);
					if (!onscreen){
						continue
					};
					
					if ( UiEnabledHP.GetValue() ){
						let text = "" + Math.floor(hpActual);
						let textWidth = Renderer.GetTextSize(font, text)[0];
						let textHeight = Renderer.GetTextSize(font, text)[1];
						let textX = Math.ceil(x) - Math.ceil(textWidth / 2);
						let textY = Math.ceil(y) + Math.ceil(8 / 2) - Math.ceil(textHeight / 2) -21;
						Renderer.SetDrawColor(0, 0, 0, 255);
						Renderer.DrawText(font, textX-1, textY-1, text);
						Renderer.DrawText(font, textX+1, textY+1, text);
						Renderer.DrawText(font, textX-1, textY, text);
						Renderer.DrawText(font, textX+1, textY, text);
						Renderer.SetDrawColor(255, 255, 255, 255);
						Renderer.DrawText(font, textX, textY, text);
					
					}
					
					//console.log(hero.GetHealthBarOffset());
					let currentWidthBar = Math.floor((manaActual * (zizeBar-1)) / manaMax);
					let currentWidthManaBar = currentWidthBar-2;					
					
					if ( UiEnabledMP.GetValue() ){
						Renderer.SetDrawColor(0, 0 ,0 ,255);
						Renderer.DrawFilledRect(x-(zizeBar/2), y-14, zizeBar, 10,3);
									
						if (currentWidthBar > 3){
							Renderer.SetDrawColor(79, 120 ,250 ,255);
							Renderer.DrawFilledRect(x+1-(zizeBar/2), y-13, currentWidthManaBar, 8,2);
						}
						
						
						let text = "" + Math.floor(manaActual);
						let textWidth = Renderer.GetTextSize(font, text)[0];
						let textHeight = Renderer.GetTextSize(font, text)[1];
						let textX = Math.ceil(x) - Math.ceil(textWidth / 2);
						let textY = Math.ceil(y) + Math.ceil(8 / 2) - Math.ceil(textHeight / 2) -13;
						Renderer.SetDrawColor(0, 0, 0, 255);
						Renderer.DrawText(font, textX-1, textY-1, text);
						Renderer.DrawText(font, textX+1, textY+1, text);
						Renderer.DrawText(font, textX-1, textY, text);
						Renderer.DrawText(font, textX+1, textY, text);
						Renderer.SetDrawColor(255, 255, 255, 255);
						Renderer.DrawText(font, textX, textY, text);
						
						

					} else{
						Renderer.SetDrawColor(0, 0 ,0 ,255);
						Renderer.DrawFilledRect(x-(zizeBar/2), y-14, zizeBar, 6,4);

						if (currentWidthBar > 3){
							Renderer.SetDrawColor(79, 120 ,250 ,255);
							Renderer.DrawFilledRect(x+1-(zizeBar/2), y-13, currentWidthManaBar, 4,3);
						}
						
					}
					
				}
			}

		}
	};



	// Definición de la función OnUpdate
	ManaBarsNew.OnUpdate = () => {
		if (localHero && isUiEnabled.GetValue()) {
			
			if ( UiEnabledAllied.GetValue() ){
				if (enemyList.length < 10) {
					enemyList = [];
					let heroes = EntitySystem.GetHeroesList();
					if (heroes) {
						for (let hero of heroes) {
							
							if (hero && !hero.IsIllusion() && !hero.IsMeepoClone() && hero.IsHero() && hero.IsAlive() &&
								!hero.IsDormant()) {
								enemyList.push(hero);
							}

						}
					}
				}
			} else{
				if (enemyList.length < 5 || 5 < enemyList.length ) {
					enemyList = [];
					let heroes = EntitySystem.GetHeroesList();
					if (heroes) {
						for (let hero of heroes) {
							
							if (hero && !hero.IsIllusion() && !hero.IsMeepoClone() && hero.IsHero() && hero.IsAlive() &&
								!hero.IsDormant() && !hero.IsSameTeam(localHero)) {
								enemyList.push(hero);
							}
							
						}
					}
				}	
			}

		}
	};
	

	// Definición de la función OnScriptLoad
	ManaBarsNew.OnScriptLoad = ManaBarsNew.OnGameStart = () => {
	  localHero = EntitySystem.GetLocalHero();
	  myPlayer = EntitySystem.GetLocalPlayer();
	  enemyList = [];
	};

	// Definición de la función OnGameEnd
	ManaBarsNew.OnGameEnd = () => {
	  	localHero = null;
		myPlayer = null;

	};

	// Registro del script
	RegisterScript(ManaBarsNew);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/ManaBarsNew.ts"]();
/******/ 	
/******/ })()
;
