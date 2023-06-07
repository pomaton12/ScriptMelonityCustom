/******/ (() => { // webpackBootstrap 
/******/ 	var __webpack_modules__ = ({

/***/ "./src/LegionAbuse.ts":
/*!**********************************!*\
  !*** ./src/LegionAbuse.ts ***!
  \**********************************/
/***/ (() => {


eval(`
	const LegionAbuse = {};
	let localHero;
	let myPlayer;
	const silences = [
		'modifier_legion_commander_duel'
	];

	// options
	const path_ = ['Heroes', 'Strength', 'Legion Commander'];

	let OverwhelmingToggle = Menu.AddToggle(path_, 'Spell in Ulti', true);
	OverwhelmingToggle.SetImage('panorama/images/spellicons/legion_commander/immortal/legion_commander_overwhelming_odds_png.vtex_c');
		
	let PressTheAttackToggle = Menu.AddToggle(path_, 'Spell Abuse', true);
	PressTheAttackToggle.SetImage('panorama/images/spellicons/legion_commander/legacy_of_the_fallen_legion/legion_commander_press_the_attack_png.vtex_c');
		

	//=============================================================
	// Funcion Principal para Iniciar el CODIGO
	//=============================================================
	LegionAbuse.OnUpdate = () => {
		
		if (localHero && OverwhelmingToggle.GetValue()) {
			if (localHero.GetUnitName() !== "npc_dota_hero_legion_commander") {
				return;
			}
			const OverwhelmingSpell = localHero.GetAbilityByIndex(0);
			const PressTheAttackSpell = localHero.GetAbilityByIndex(1);
			const modifiers = localHero.GetModifiers();
			const UltimateInCast = modifiers.some(modifier => modifier.GetName() === 'modifier_legion_commander_duel');
			//console.log("Modificador = ",UltimateInCast);


			if(UltimateInCast){
				
				if(OverwhelmingSpell && OverwhelmingSpell.GetCooldown() === 0){
					myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_CAST_NO_TARGET,null,null,OverwhelmingSpell,Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY, localHero);
				}

				if(PressTheAttackSpell && PressTheAttackSpell.CanCast()){
					myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_CAST_TARGET, localHero,null,PressTheAttackSpell,Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY, localHero);
				}				
			}			
		}	
		
		if (localHero && PressTheAttackToggle.GetValue()) {
			if (localHero.GetUnitName() !== "npc_dota_hero_legion_commander") {
				return;
			}

			const PressTheAttack = localHero.GetAbilityByIndex(1);		
			const healthPercentage = (localHero.GetHealth() / localHero.GetMaxHealth()) * 100;
			
			if (PressTheAttack && PressTheAttack.CanCast() && (healthPercentage <= 30)) {
                myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_CAST_TARGET, localHero, null, PressTheAttack, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY, localHero);
            }
			
		}		
		
	};


	LegionAbuse.OnScriptLoad = LegionAbuse.OnGameStart = () => {
		localHero = EntitySystem.GetLocalHero();
		myPlayer = EntitySystem.GetLocalPlayer();
		
	};

	LegionAbuse.OnGameEnd = () => {
		localHero = null;
		myPlayer = null;


	};


	RegisterScript(LegionAbuse);

`);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/LegionAbuse.ts"]();
/******/ 	
/******/ })()
;
