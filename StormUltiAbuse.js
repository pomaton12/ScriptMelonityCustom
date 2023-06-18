/******/ (() => { // webpackBootstrap 
/******/ 	var __webpack_modules__ = ({

/***/ "./src/StornSpiritAbuse.ts":
/*!**********************************!*\
  !*** ./src/StornSpiritAbuse.ts ***!
  \**********************************/
/***/ (() => {

eval(`
	const StornSpiritAbuse = {};

	let localHero;
	let myPlayer;


	const path_ = ["Heroes", "Intelligence", "Storm Spirit","Agresive Best Ulti"];
	let isUiEnabled = Menu.AddToggle(path_, 'Enable', true);
	let KeyBindOrderAgresive = Menu.AddKeyBind(path_, 'Agresive Best Ulti', Enum.ButtonCode.KEY_NONE);
	let SafeManaUI = Menu.AddSlider(path_, 'Save Mana', 1, 500, 300)
        .OnChange(state => SafeManaUI = state.newValue)
        .GetValue();
		
	let DistanceCastUI = Menu.AddSlider(path_, 'Save Range in combo', 1, 350, 300)
		.OnChange(state => DistanceCastUI = state.newValue)
		.GetValue();


	Menu.GetFolder(path_).SetImage('panorama/images/spellicons/storm_spirit_ball_lightning_orchid_png.vtex_c');
	
	StornSpiritAbuse.OnUpdate = () => {
		
		if (localHero && isUiEnabled.GetValue()) {
			if (localHero.GetUnitName() !== "npc_dota_hero_storm_spirit") {
				return;
			}				
					
			if (KeyBindOrderAgresive.IsKeyDown()) {
		
				let safePosition = localHero.GetAbsOrigin();
				
				// Obtén las otras habilidades y el modificador
				let Ability1 = localHero.GetAbilityByIndex(0);
				let Ability2 = localHero.GetAbilityByIndex(1);
				let Ability3 = localHero.GetAbilityByIndex(2);
				let Ultimate = localHero.GetAbilityByIndex(5);
				


				if (Engine.OnceAt(0.2)) {
					const mousePos = Input.GetWorldCursorPos();
					const enemies = localHero.GetHeroesInRadius(1200, Enum.TeamType.TEAM_ENEMY);
					enemies.sort((a, b) => {
						const distA = a.GetAbsOrigin().Distance(localHero.GetAbsOrigin());
						const distB = b.GetAbsOrigin().Distance(localHero.GetAbsOrigin());
						return distA - distB;
					});
					let target = null;
					for (const enemy of enemies) {
						const dist = enemy.GetAbsOrigin().Distance(mousePos);
						if (dist <= 150 || target == null) {
							target = enemy;
						}
					}

					if (target != null) {
						const localHeroPosition = localHero.GetAbsOrigin();
						const EnemyHero = target;
						const attackRange = localHero.GetAttackRange();
						const enemyHeroPosition = EnemyHero.GetAbsOrigin();
						const dist = localHeroPosition.Distance(enemyHeroPosition);
						const attackSpeed = localHero.GetAttacksPerSecond();
						const attackTime = 1 / attackSpeed;
						const Idealdirection = (enemyHeroPosition.sub(localHeroPosition)).Normalized();
						//console.log("Prueba error",Idealdirection);
						let Modifier1 = localHero.HasModifier("modifier_storm_spirit_overload");
						let Modifier2 = localHero.HasModifier("modifier_storm_spirit_electric_rave");

						// Comprueba si las otras habilidades están en cooldown o si el modificador está activo
						if (localHero.GetMana() > SafeManaUI && Ultimate && Ultimate.IsExist() && Ultimate.CanCast()) {
							if (dist > attackRange) {
								if (Engine.OnceAt(attackTime)) {
									myPlayer.PrepareUnitOrders( Enum.UnitOrder.DOTA_UNIT_ORDER_CAST_POSITION,null,enemyHeroPosition,Ultimate, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY, localHero);
								}
							} else{
								if (!Ability1.IsInAbilityPhase() && !Ability2.IsInAbilityPhase() && !Modifier1 && !Modifier2) {
									if (EnemyHero.IsAttacking()) {
										if (Engine.OnceAt(attackTime)) {
											// Calcula una nueva posición detrás del enemigo
											let IdealPosition = localHeroPosition.add(Idealdirection.mul(new Vector(DistanceCastUI, DistanceCastUI, 0)));
											myPlayer.PrepareUnitOrders( Enum.UnitOrder.DOTA_UNIT_ORDER_CAST_POSITION,null,IdealPosition,Ultimate, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY, localHero);
										}
									}
								}
							}
						}
					}
				}
			}
			
		}
	};

	StornSpiritAbuse.OnScriptLoad = StornSpiritAbuse.OnGameStart = () => {
	    localHero = EntitySystem.GetLocalHero();
	    myPlayer = EntitySystem.GetLocalPlayer();
	};

	StornSpiritAbuse.OnGameEnd = () => {
	    localHero = null;
	    myPlayer = null;
	};

	RegisterScript(StornSpiritAbuse);




`);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/StornSpiritAbuse.ts"]();
/******/ 	
/******/ })()
;
