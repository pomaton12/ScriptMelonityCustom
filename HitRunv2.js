/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({
 
/***/ "./src/HitRunHeros.ts":
/*!**********************************!*\
  !*** ./src/HitRunHeros.ts ***!
  \**********************************/
/***/ (() => {

	const HitRunHeros = {};

	let localHero;
	let myPlayer;
	let attackTarget;
	let EnemyHerotest;
	let pos1;
	let timepusepos;
	let createHUD = 0;	
	let SafeDistanceUI = null;
	let SafeDistanceUIval = 0;
	let comboTarget = null;
	let enemyList = [];
	
	
	const path_ = ['Heroes', 'Orbwalking'];

	let isUiEnabled1 = Menu.AddToggle(path_, 'Orbwalking Enable', true);

	let KeyBindOrbwalk = Menu.AddKeyBind(path_, 'Key OrbWalk (Key use same in combo)', Enum.ButtonCode.KEY_NONE);

	let isUiEnabled2 = Menu.AddToggle(path_, 'Kill Safe Pos (No recomend)', false);
	
	let isUiEnabled3 = Menu.AddToggle(path_, 'Auto Orbwalk on right click hero enemy', false);
	
	let DisplayMode = Menu.AddComboBox(path_, 'Display', ['To Enemy', 'Mouse position'],0)
	.OnChange(state =>{	DisplayMode = state.newValue;})
	.GetValue();
	
	
	
	let menu_AbilitiesList = Menu.AddMultiSelect(path_, 'Spells use in hit', ['panorama/images/spellicons/obsidian_destroyer_arcane_orb_png.vtex_c',
	'panorama/images/spellicons/drow_ranger_frost_arrows_png.vtex_c',
	'panorama/images/spellicons/silencer_glaives_of_wisdom_png.vtex_c',
	'panorama/images/spellicons/viper_poison_attack_png.vtex_c',
	'panorama/images/spellicons/huskar_burning_spear_png.vtex_c'], [true, true, true, true, true])
		.OnChange((state) => {menu_AbilitiesList = state.newValue;})
		.GetValue();
		
	let isUiEnabled4 = Menu.AddToggle(path_, 'Use Diffusal or Disperser', true);
	isUiEnabled4.SetImage('panorama/images/items/diffusal_blade_png.vtex_c');
  
	Menu.GetFolder(['Heroes', 'Orbwalking']).SetImage('panorama/images/hud/reborn/icon_damage_psd.vtex_c');

	//=========================================
	//       Evaluar Funciones
	//=========================================

	// 2 .- ====   Funcion para calcular distancia2D
	function Dist2D(vec1, vec2) {
		if (vec1 && vec2) {
			let pos1 = (vec1.x ? (vec1) : (vec1.GetAbsOrigin ? (vec1.GetAbsOrigin()) : (0)));
			let pos2 = (vec2.x ? (vec2) : (vec2.GetAbsOrigin ? (vec2.GetAbsOrigin()) : (0)));
			return pos1 && pos2 && pos1.sub(pos2).Length2D();
		}
		return -1;
	}

	// 3 .- ====   Funcion POSICION DEL ANGULO
	function IsntUndefined(value, withfalse) {
		return withfalse ? (value !== false) : value !== undefined && value !== null;
	}
	
	function GetAngleToPos(_e1, _e2, prefer = _e2, inrad) {
		let [a, b] = [IsntUndefined(_e1.x) ? _e1 : _e1.GetAbsOrigin(), IsntUndefined(_e2.x) ? _e2 : _e2.GetAbsOrigin()];
		if (prefer == _e1) {
			[a, b] = [b, a];
		}
		let atan2 = Math.atan2(b.y - a.y, b.x - a.x);
		return inrad ? atan2 : (atan2 * (180 / Math.PI));
	}
	
	function GetNearHeroInRadius(vector, radius = 1000) {
        let en = enemyList;
        if (en.length == 0)
            return undefined;
        let accessHero = Array(enemyList.length);
        en.forEach((object) => {
            if (object.GetAbsOrigin().Distance(vector) <= radius) {
                accessHero.push([object, object.GetAbsOrigin().Distance(vector)]);
            }
        });
        accessHero.sort((a, b) => {
            return (a[1] - b[1]);
        });
        return accessHero[0] ? accessHero[0][0] : undefined;
    }
	
	let exOrders = [Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_TARGET, Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_MOVE];
	
	// Definición de la función startMouseBoost
	HitRunHeros.OnPrepareUnitOrders = (event) => {
		if (localHero && isUiEnabled1.GetValue()) {
			if (isUiEnabled3.GetValue()) {
				if (exOrders.includes(event.order)) {
					let EnemiHero = event.target;
					if (EnemiHero && !EnemiHero.IsIllusion() && !EnemiHero.IsMeepoClone() && EnemiHero.IsHero() && EnemiHero.IsAlive() && !EnemiHero.IsDormant() && !EnemiHero.IsSameTeam(localHero)) {
						// Reemplaza "nombre_de_la_habilidad" con el nombre de la habilidad que quieres lanzar
						//HitRunOrbFunction(EnemiHero);
					}
				}
			}
		}
	};

	//=====================
	HitRunHeros.OnUpdate = () => {
		if (localHero && isUiEnabled1.GetValue()) {
			if (DisplayMode === 0) {	
				if (createHUD == 0) {
					SafeDistanceUI = Menu.AddSlider(path_, 'Safe Distance (% Attack Range)', 1, 100, 100);
					createHUD = createHUD+1;
				}else {
					SafeDistanceUIval = SafeDistanceUI.GetValue();
					
				}
			} else {
				if (DisplayMode === 1 && SafeDistanceUI != null && createHUD > 0) {
					Menu.RemoveOption(SafeDistanceUI);
					SafeDistanceUI = null;
					createHUD = 0;
				}
			}
			
			if (enemyList.length < 5) {
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
			
			
			if (KeyBindOrbwalk.IsKeyDown()) {
				
				if (comboTarget && !comboTarget.IsAlive()){
						comboTarget = null;
				}
							
				let enemiHero = GetNearHeroInRadius(Input.GetWorldCursorPos());

				if (!comboTarget && enemiHero && enemiHero.IsExist())
					comboTarget = enemiHero;
				else if (!comboTarget) {
					comboTarget = null;
					if (Engine.OnceAt(0.2)){
						//SendOrderMovePos(Input.GetWorldCursorPos(), localHero);
					}
				}

				HitRunOrbFunction(comboTarget);
				
			} else{
				comboTarget = null;
			}
		}
	};
	
	//IsChannellingAbility
	function HitRunOrbFunction(target){
		if (Engine.OnceAt(0.2)) {
			if (target && target.IsExist() && !localHero.IsChannellingAbility()) {
				const localHeroPosition = localHero.GetAbsOrigin();
				const EnemyHero = target;
				const RangeBasic = localHero.GetAttackRange();
				const RangeBuff = localHero.GetAttackRangeBonus();
				const attackRange = RangeBasic + RangeBuff;
				const enemyHeroPosition = EnemyHero.GetAbsOrigin();
				const dist = localHeroPosition.Distance(enemyHeroPosition) - 50;
				const attackSpeed = localHero.GetAttacksPerSecond();
				const attackTime = 1 / attackSpeed;
				let Abilite = null;
				
				if (menu_AbilitiesList[0]) {
					if (localHero.GetUnitName() == "npc_dota_hero_obsidian_destroyer") {
						let abilExist = localHero.GetAbilityByIndex(0);
						if (abilExist && abilExist.IsExist() && abilExist.CanCast()) {
							
							Abilite = abilExist;

						} else{
							Abilite = null;
						}
					}
				}

				if (menu_AbilitiesList[1]) {
						
					if (localHero.GetUnitName() == "npc_dota_hero_drow_ranger") {
						
						let abilExist = localHero.GetAbilityByIndex(0);
						if (abilExist && abilExist.IsExist() && abilExist.CanCast()) {
							
							Abilite = abilExist;

						} else{
							Abilite = null;
						}
					}
				}
				
				if (menu_AbilitiesList[2]) {
					if (localHero.GetUnitName() == "npc_dota_hero_silencer") {
						let abilExist = localHero.GetAbilityByIndex(1);
						if (abilExist && abilExist.IsExist() && abilExist.CanCast()) {
							
							Abilite = abilExist;

						} else{
							Abilite = null;
						}
					}
				}
				
				if (menu_AbilitiesList[3]) {
					if (localHero.GetUnitName() == "npc_dota_hero_viper") {
						let abilExist = localHero.GetAbilityByIndex(0);
						if (abilExist && abilExist.IsExist() && abilExist.CanCast()) {
							
							Abilite = abilExist;

						} else{
							Abilite = null;
						}
					}
				}		

				if (menu_AbilitiesList[4]) {
					if (localHero.GetUnitName() == "npc_dota_hero_huskar") {
						let abilExist = localHero.GetAbilityByIndex(1);
						if (abilExist && abilExist.IsExist() && abilExist.CanCast()) {
							
							Abilite = abilExist;

						} else{
							Abilite = null;
						}
					}
				}

				//'item_diffusal_blade', 'item_disperser'
				if (isUiEnabled4.GetValue()) { 
					let Diffusal = localHero.GetItem('item_diffusal_blade', true) || localHero.GetItem('item_disperser', true);
					if (Diffusal && Diffusal.IsExist() && Diffusal.CanCast()) { 
						if(attackRange >= dist){
							Diffusal.CastTarget(EnemyHero);
						}
						
					}
				}
				
				
				if (DisplayMode === 0 ) {							
					let newRange = attackRange * (SafeDistanceUIval / 100);
					if (5 >= newRange) {
						newRange = 5;
					}
	
					if (dist >= newRange) {
						if (!isUiEnabled2.GetValue()) {
							if (newRange) {
								if(localHero.IsRanged()){
									pos1 = localHeroPosition.add(new Vector(dist - newRange).Rotated(GetAngleToPos(localHeroPosition, enemyHeroPosition)));
								} else{
									if (dist >= attackRange) {
										pos1 = localHeroPosition.add(new Vector(dist - newRange).Rotated(GetAngleToPos(localHeroPosition, enemyHeroPosition)));
									} else{
										pos1 = localHeroPosition.add(new Vector(15).Rotated(GetAngleToPos(localHeroPosition, enemyHeroPosition)));
										
									}
								}
								
								if(Abilite != null) {
									Abilite.CastTarget(EnemyHero);
								}else{
									myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_TARGET, EnemyHero, enemyHeroPosition, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY, localHero, false, true);
								}
								
								if (Engine.OnceAt(attackTime)) {
									
									myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_MOVE_TO_POSITION, null, pos1, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY, localHero, false, true);
								}
								
							}
						}
					} else {
						if (isUiEnabled2.GetValue()) {
							pos1 = localHeroPosition.add(new Vector(dist - newRange - 100).Rotated(GetAngleToPos(localHeroPosition, enemyHeroPosition)));
							if (Engine.OnceAt(attackTime)) {
								myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_MOVE_TO_POSITION, null, pos1, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY, localHero, false, true);
							}
						} else{
							if(Abilite != null) {
								Abilite.CastTarget(EnemyHero);
							}else{
								myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_TARGET, EnemyHero, enemyHeroPosition, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY, localHero, false, true);
							}
						}
					}
				} else if (DisplayMode === 1) {
					if (attackTime > 0.6) {
						timepusepos = attackTime;
					} else {
						timepusepos = 0.6;
					}
					const mouse = Input.GetWorldCursorPos();
					if (Engine.OnceAt(timepusepos)) {
						localHero.MoveTo(mousePos);
					}
				}
			}
		}
	}

	HitRunHeros.OnScriptLoad = HitRunHeros.OnGameStart = () => {
	  localHero = EntitySystem.GetLocalHero();
	  myPlayer = EntitySystem.GetLocalPlayer();
	  enemyList = [];
	};

	HitRunHeros.OnGameEnd = () => {
	  localHero = null;
	  myPlayer = null;
	};

	RegisterScript(HitRunHeros);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/HitRunHeros.ts"]();
/******/ 	
/******/ })()
;
