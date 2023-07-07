/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/AutoSaverWindrunner.ts":
/*!**********************************!*\
  !*** ./src/AutoSaverWindrunner.ts ***!
  \**********************************/
/***/ (() => {

	// Definición del objeto AutoSaverWindrunner
	const AutoSaverWindrunner = {};

	// Declaración de la variable localHero
	let localHero = null;
	let myPlayer = null;
	let comboTarget = null;
	let particle = null;
	let shackleshotCast = false;
	let enemyList = [];
	
	let TarjetFocusfire = null;
	let posFIN;
	let posFIN1;
	
	// Definición del array path_
	const path = ["Custom Scripts","Heroes","Universal"];
	const path_ = ["Custom Scripts","Heroes","Universal","Windranger"];
	const path_1 = ["Custom Scripts","Heroes","Universal","Windranger","Gale Force Helper"];
	const path_2 = ["Custom Scripts","Heroes","Universal","Windranger","Shackle Helper"];
	
	const item_Images = [
	'item_soul_ring', 'item_armlet', 'item_mjollnir', 'item_blink', 'item_abyssal_blade', 'item_fallen_sky',
	'item_glimmer_cape', 'item_manta', 'item_satanic', 'item_disperser', 'item_sheepstick', 'item_orchid',
	'item_bloodthorn', 'item_nullifier', 'item_rod_of_atos', 'item_gungir', 'item_diffusal_blade', 'item_bullwhip',
	'item_ethereal_blade', 'item_dagon_5', 'item_heavens_halberd', 'item_veil_of_discord', 'item_urn_of_shadows', 'item_spirit_vessel',
	'item_medallion_of_courage', 'item_solar_crest', 'item_pipe', 'item_hood_of_defiance', 'item_eternal_shroud', 'item_lotus_orb',
	'item_black_king_bar', 'item_harpoon', 'item_essence_ring', 'item_blade_mail', 'item_shivas_guard', 'item_crimson_guard',
	'item_ancient_janggo', 'item_hurricane_pike', 'item_revenants_brooch', 'item_bloodstone'
	];
	
    const linkBreakers = [
        'item_dagon_5', 'item_heavens_halberd', 'item_diffusal_blade', 'item_disperser', 'item_harpoon', 'item_force_staff',
		'item_cyclone', 'item_rod_of_atos', 'item_abyssal_blade', 'item_orchid', 'item_bloodthorn', 'item_sheepstick',
		'item_nullifier', 'item_ethereal_blade', 'item_force_boots', 'item_book_of_shadows'
    ];
	
	// Creación del toggle isUiEnabled
	let isUiEnabled = Menu.AddToggle(path_, 'Enable', false);
	let KeyBindOrderAgresive = Menu.AddKeyBind(path_, 'Key', Enum.ButtonCode.KEY_NONE);
	let menu_ItemsList = CreateMultiSelect(path_, 'Items', item_Images, true);
	
	let menu_AbilitiesList = Menu.AddMultiSelect(path_, 'Spells', ['panorama/images/spellicons/windrunner_shackleshot_png.vtex_c', 'panorama/images/spellicons/windrunner_powershot_png.vtex_c', 'panorama/images/spellicons/windrunner_windrun_png.vtex_c', 'panorama/images/spellicons/windrunner_gale_force_png.vtex_c', 'panorama/images/spellicons/windrunner_focusfire_arcana_png.vtex_c'], [true, true, true, true, true])
		.OnChange((state) => {menu_AbilitiesList = state.newValue;})
		.GetValue();
				
	let menu_LinkensItems = CreatePrioritySelect([...path_, 'Linkens Breaker Settings'], 'Linkens Breaker', linkBreakers, true);
	

	let isUiEnabledGale = Menu.AddToggle(path_, 'GaleForce Use in Ulti', true)
	
	let isUiEnabledDogde = Menu.AddToggle(path_1, 'Enable', false);
	
	let EnemyUI = Menu.AddSlider(path_1, 'Target enemies for Auto GaleForce ', 1, 5, 3)
		.OnChange(state => EnemyUI = state.newValue)
		.GetValue();
	
	let isUiEnabledShackle = Menu.AddToggle(path_2, 'Auto Best Shackle oportunity', false);
	let EnemyUIShackle = Menu.AddSlider(path_2, 'Work with minute... ', 1, 50, 15)
		.OnChange(state => EnemyUIShackle = state.newValue)
		.GetValue();	
	
	Menu.SetImage(['Custom Scripts', 'Heroes'], '~/menu/40x40/heroes.png');
    Menu.SetImage(path,'panorama/images/primary_attribute_icons/mini_primary_attribute_icon_all_psd.vtex_c');
    Menu.SetImage(path_, 'panorama/images/heroes/icons/npc_dota_hero_windrunner_alt1_png.vtex_c');
	Menu.GetFolder([...path_, 'Linkens Breaker Settings']).SetImage('panorama/images/hud/reborn/minimap_gemdrop_psd.vtex_c');
	Menu.SetImage(path_1, 'panorama/images/spellicons/windrunner_gale_force_png.vtex_c');
	Menu.SetImage(path_2, 'panorama/images/spellicons/windrunner_shackleshot_png.vtex_c');
	isUiEnabledGale.SetImage('panorama/images/spellicons/windrunner_gale_force_png.vtex_c');
	
	
	function GetImagesPath(name, full) {
		if (name.startsWith('item_')) {
			return `panorama/images/items/${name.slice(5)}_png.vtex_c`;
		}
		else if (name.startsWith('npc_dota_hero')) {
			if (full) {
				return `panorama/images/heroes/${name}_png.vtex_c`;
			}
			else {
				return `panorama/images/heroes/icons/${name}_png.vtex_c`;
			}
		}
		else if (name.startsWith('npc_dota_neutral')) {
			return `panorama/images/heroes/${name}_png.vtex_c`;
		}
		else {
			return `panorama/images/spellicons/${name}_png.vtex_c`;
		}
	}
	
	function CreateMultiSelect(path, name, iconsArray, default_value = true) {
		let icons = [];
		for (let q of iconsArray) {
			icons.push(GetImagesPath(q));
		}
		let a = Menu.AddMultiSelect(path, name, icons, default_value);

		return {
			GetOption: () => {
				return a;
			},
			IsEnabled: (name) => {
				let n = name;
				if (typeof name === 'object') {
					if (name.GetEntityName()) {
						n = name.GetEntityName();
					}
					if (name.GetName()) {
						n = name.GetName();
					}
				}
				return a.GetValue()[iconsArray.indexOf(n)];
			}
		};
	}
	
	function CreatePrioritySelect(path, name, iconsArray, default_value = true) {
		let icons = [];
		for (let q of iconsArray) {
			icons.push(GetImagesPath(q));
		}
		let a = Menu.AddPrioritySelect(path, name, icons, default_value);

		return {
			GetOption: () => {
				return a;
			},
			GetValue: () => {
				let t = [];
				for (let e of a.GetValue()) {
					t.push(iconsArray[e]);
				}
				return t;
			}
		};
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
	
	function GetBestPost(hero1, hero2) {
        return comboTarget.GetAbsOrigin().add(new Vector(Dist2D(hero1, hero2) / 2, 0, 0).Rotated(GetAngleToPos(hero1, hero2)));
    }
	
	function SendOrderMovePos(vector, myHero) {
        myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_MOVE_TO_POSITION, null, vector, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY, myHero, false, true);
    }
	
	function TargetInRadius(target, radius, sourceHero, team = Enum.TeamType.TEAM_ENEMY) {
        let er = sourceHero.GetHeroesInRadius(radius, team);
        if (er) {
            for (let enemy of er) {
                if (enemy == target)
                    return true;
            }
        }
        return false;
    }
	
	function CustomCanCast(item) {
        let owner = item.GetOwner(), hasModf = owner.HasState(Enum.ModifierState.MODIFIER_STATE_MUTED)
            || owner.HasState(Enum.ModifierState.MODIFIER_STATE_STUNNED)
            || owner.HasState(Enum.ModifierState.MODIFIER_STATE_HEXED)
            || owner.HasState(Enum.ModifierState.MODIFIER_STATE_INVULNERABLE)
            || owner.HasState(Enum.ModifierState.MODIFIER_STATE_FROZEN)
            || owner.HasState(Enum.ModifierState.MODIFIER_STATE_FEARED)
            || owner.HasState(Enum.ModifierState.MODIFIER_STATE_TAUNTED);
        return item && !hasModf && owner.GetMana() >= item.GetManaCost() && item.IsCastable(owner.GetMana());
    }
	
	let exOrders = [Enum.UnitOrder.DOTA_UNIT_ORDER_CAST_TARGET];
	
	AutoSaverWindrunner.OnPrepareUnitOrders = (event) => {
		if (localHero && isUiEnabled.GetValue()) {
			if (localHero.GetUnitName() !== "npc_dota_hero_windrunner") {
				return;
			}			
			
			if (menu_AbilitiesList[4] && isUiEnabledGale.GetValue()) {
				if (exOrders.includes(event.order)) {
					let EnemiHero = event.target;
					let EnemiAbil = event.ability;
					if (EnemiAbil.GetName() === "windrunner_focusfire") {
						if (EnemiHero && !EnemiHero.IsIllusion() && !EnemiHero.IsMeepoClone() && EnemiHero.IsHero() && EnemiHero.IsAlive() && !EnemiHero.IsDormant() && !EnemiHero.IsSameTeam(localHero)) {

							TarjetFocusfire = EnemiHero;
						}
					}
				}
			}
		}
	};
	
	
	AutoSaverWindrunner.OnDraw = () => {
        if (localHero && isUiEnabled.GetValue()) {
			if (localHero.GetUnitName() !== "npc_dota_hero_windrunner") {
				return;
			}
			
            if (comboTarget) {
                if (!particle) {
                     particle = Particle.Create('particles/ui_mouseactions/range_finder_tower_aoe.vpcf', Enum.ParticleAttachment.PATTACH_INVALID, comboTarget);
                    particle.SetControl(2, EntitySystem.GetLocalHero().GetAbsOrigin());
                    particle.SetControl(6, new Vector(1, 0, 0));
                    particle.SetControl(7, comboTarget.GetAbsOrigin());
					
                }
                else {
                    particle.SetControl(2, EntitySystem.GetLocalHero().GetAbsOrigin());
                    particle.SetControl(7, comboTarget.GetAbsOrigin());
                }
            }
            else {
                if (particle) {
                    particle.Destroy();
                    particle = null;
                }
            }
			
        }
    };

	// Definición de la función OnUpdate
	AutoSaverWindrunner.OnUpdate = () => {
			
        if (localHero && isUiEnabled.GetValue()) {			
			if (localHero.GetUnitName() !== "npc_dota_hero_windrunner") {
				return;
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
						
			let MyModSilverEdge = localHero.HasModifier("modifier_item_silver_edge_windwalk");
			let ModifierFocusfire = localHero.HasModifier("modifier_windrunner_focusfire"); //  Ultimate Focusfire
			
						
			let shackleshot = localHero.GetAbilityByIndex(0);
			let powershot = localHero.GetAbilityByIndex(1);
			let windrun = localHero.GetAbilityByIndex(2);
			let gale_force = localHero.GetAbilityByIndex(3);
			let focusfire = localHero.GetAbilityByIndex(5);			
			
			if (!ModifierFocusfire) {
				//TarjetFocusfire = null;
			}
			
			if (KeyBindOrderAgresive.IsKeyDown()) {
				
				if (comboTarget && !comboTarget.IsAlive()){
						comboTarget = null;
				}
				
				let SheepstickHexx = localHero.GetItem('item_sheepstick', true);
				
				let target = GetNearHeroInRadius(Input.GetWorldCursorPos());

				if (!comboTarget && target && target.IsExist())
					comboTarget = target;
				else if (!comboTarget) {
					comboTarget = null;
					if (Engine.OnceAt(0.2)){
						SendOrderMovePos(Input.GetWorldCursorPos(), localHero);
					}
				}
				
				if (Engine.OnceAt(0.2)) {
				
					let MyModBkb = localHero.HasModifier("modifier_black_king_bar_immune");
					
					if (comboTarget && comboTarget.HasModifier('modifier_item_blade_mail_reflect') && !MyModBkb && !MyModSilverEdge) {
						let bkbItemMy = localHero.GetItem('item_black_king_bar', true);
						if(menu_ItemsList.IsEnabled('item_black_king_bar') && bkbItemMy && CustomCanCast(bkbItemMy) && TargetInRadius(comboTarget, 1000, localHero)){
							bkbItemMy.CastNoTarget();
						} else{
							SendOrderMovePos(Input.GetWorldCursorPos(), localHero);
							return;
						}
                    }
					
					if (comboTarget && comboTarget.HasModifier("modifier_item_lotus_orb_active") && !MyModBkb && !MyModSilverEdge) {
						let bkbItemMy = localHero.GetItem('item_black_king_bar', true);
						if(menu_ItemsList.IsEnabled('item_black_king_bar') && bkbItemMy && CustomCanCast(bkbItemMy) && TargetInRadius(comboTarget, 1000, localHero)){
							bkbItemMy.CastNoTarget();
						} else{
							myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_TARGET, comboTarget, null, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY, localHero, false, true);	
							return;
						}
                    }

					if (comboTarget && comboTarget.IsExist()) {		
					
						const localHeroPosition = localHero.GetAbsOrigin();						
						const enemyHeroPosition = comboTarget.GetAbsOrigin();
						
						const dist = Math.floor(Dist2D(localHeroPosition, enemyHeroPosition)-40);
						const dist2 = enemyHeroPosition.sub(localHeroPosition).Length()
											
						let Stunned = comboTarget.HasState(Enum.ModifierState.MODIFIER_STATE_STUNNED);
						let InmuneMagic = comboTarget.HasModifier("modifier_black_king_bar_immune"); 
						let Hexxed = comboTarget.HasState(Enum.ModifierState.MODIFIER_STATE_HEXED);
						let Silenced = comboTarget.HasState(Enum.ModifierState.MODIFIER_STATE_SILENCED);
						let Ethereo = comboTarget.HasState(Enum.ModifierState.MODIFIER_STATE_ATTACK_IMMUNE);
	
						
						let LinkenActive = comboTarget.HasModifier("modifier_item_sphere_target");
						let ModifierShackleshot = comboTarget.HasModifier("modifier_windrunner_shackle_shot"); //  Ultimate Focusfire						

						let [linken, mirror] = [comboTarget.GetItem('item_sphere', true), comboTarget.GetItem('item_mirror_shield', false)];
                        if (linken && linken.CanCast() || mirror && mirror.CanCast() && !MyModSilverEdge) {
                            let linkenBrokItems = menu_LinkensItems.GetValue();
                            for (let brokObj of linkenBrokItems) {
                                let vi = localHero.GetItem(brokObj, false);
                                if (vi) {
                                    if (vi.IsExist() && CustomCanCast(vi)) {
                                        vi.CastTarget(comboTarget);
                                        break;
                                    }
                                }
                            }
                        }
						
						let blinkCast = false;
						if (menu_ItemsList.IsEnabled('item_blink') ) { 
							let itemblink = localHero.GetItem('item_blink', true) || localHero.GetItem('item_overwhelming_blink', true) || localHero.GetItem('item_arcane_blink', true) || localHero.GetItem('item_swift_blink', true);
							if (itemblink && CustomCanCast(itemblink) && !MyModSilverEdge) { 
								let  castRange = itemblink.GetLevelSpecialValueFor("abilitycastrange");
								let castRangeBonus = localHero.GetCastRangeBonus();
								let castRangeTotal =  castRange + castRangeBonus;
								
								if (TargetInRadius(comboTarget, castRangeTotal, localHero)) {
									if(shackleshot && shackleshot.IsExist() && shackleshot.CanCast()){
										const postBlink = BestPosBlink(comboTarget);
										blinkCast = true;
										itemblink.CastPosition(postBlink);
									} else{

										blinkCast = true;
										itemblink.CastPosition(comboTarget.GetAbsOrigin());
										
									}
								}
								
							} else{
								blinkCast = true;
							}
						} else{
							blinkCast = true;
						}
						
						
						if (menu_AbilitiesList[0]) {
                            
                            if (shackleshot && shackleshot.IsExist() && shackleshot.CanCast() && blinkCast && !InmuneMagic && !Stunned  && !Hexxed && !MyModSilverEdge) {
								let  castRange = shackleshot.GetCastRange();
								let castRangeBonus = localHero.GetCastRangeBonus();
								let castRangeTotal =  castRange + castRangeBonus;
                                if (comboTarget.IsPositionInRange(localHero.GetAbsOrigin(), castRangeTotal, 0)) {
									
									shackleshot.CastTarget(comboTarget);
                                }
							} 
						}
						
						if (menu_ItemsList.IsEnabled('item_rod_of_atos') ) { 
							let Atos = localHero.GetItem('item_rod_of_atos', true);
							if (Atos && CustomCanCast(Atos) && !InmuneMagic && !Stunned && !Hexxed && !ModifierShackleshot && !MyModSilverEdge) { 
								let  castRange = Atos.GetCastRange();
								let castRangeBonus = localHero.GetCastRangeBonus();
								let castRangeTotal =  castRange + castRangeBonus;
								
								if (TargetInRadius(comboTarget, castRangeTotal, localHero)) {

									Atos.CastTarget(comboTarget);

								}
							}
						}
						
						if (menu_ItemsList.IsEnabled('item_gungir') ) { 
							let gungir = localHero.GetItem('item_gungir', true);
							if (gungir && CustomCanCast(gungir) && !InmuneMagic && !Stunned && !ModifierShackleshot && !Hexxed && !MyModSilverEdge) { 
								let  castRange = gungir.GetCastRange();
								let castRangeBonus = localHero.GetCastRangeBonus();
								let castRangeTotal =  castRange + castRangeBonus;
								
								if (TargetInRadius(comboTarget, castRangeTotal, localHero)) {
									let enemyHeroes = comboTarget.GetHeroesInRadius(castRangeTotal, Enum.TeamType.TEAM_ENEMY);
									let posbesttt = BestPosition(enemyHeroes, 375);
									
									gungir.CastPosition(posbesttt);

								}
							}
						}
												

						if (menu_ItemsList.IsEnabled('item_hurricane_pike') ) { 
							let pike = localHero.GetItem('item_hurricane_pike', true);
							if (pike && CustomCanCast(pike)  && !Stunned && !Hexxed  && !Silenced && !LinkenActive && !MyModSilverEdge) { 
								if (TargetInRadius(comboTarget, 350, localHero)) {
									let MyheroHp = localHero.GetHealth();
									if(MyheroHp <= localHero.GetMaxHealth() * 0.15){
										pike.CastTarget(comboTarget);
									}
								}
							}
						}
						
						if (menu_ItemsList.IsEnabled('item_manta') ) { 
							let manta = localHero.GetItem('item_manta', true);

							if (manta && CustomCanCast(manta) && !MyModSilverEdge) { 
								if(MiscEnabled.GetValue()){
									const silences = localHero.HasModifier('modifier_orchid_malevolence_debuff')
										|| localHero.HasModifier('modifier_bloodthorn_debuff')
										|| localHero.HasModifier('modifier_skywrath_mage_ancient_seal')
										|| localHero.HasModifier('modifier_drowranger_wave_of_silence') 
										|| localHero.HasModifier('modifier_death_prophet_silence')
										|| localHero.HasModifier('modifier_night_stalker_crippling_fear')
										|| localHero.HasModifier('modifier_silencer_global_silence')
										|| localHero.HasModifier('modifier_grimstroke_spirit_walk_buff')
										|| localHero.HasModifier('modifier_silencer_last_word')
										|| localHero.HasModifier('modifier_riki_smoke_screen')
										|| localHero.HasModifier('modifier_disruptor_static_storm')
										|| localHero.HasModifier('modifier_techies_blast_off')
										|| localHero.HasModifier('modifier_enigma_malefice')
										|| localHero.HasModifier('modifier_bloodseeker_blood_bath')
										|| localHero.HasModifier('modifier_dark_willow_bramble_maze')
										|| localHero.HasModifier('modifier_dark_willow_cursed_crown')
										|| localHero.HasModifier('modifier_puck_silence')
										|| localHero.HasModifier('modifier_faceless_void_time_dilation_slow')
										|| localHero.HasModifier('modifier_invoker_cold_snap')
										|| localHero.HasModifier('modifier_templar_assassin_trap_meld')
										|| localHero.HasModifier('modifier_furion_sprout_entangle')
										|| localHero.HasModifier('modifier_crystal_maiden_frostbite')
										|| localHero.HasModifier('modifier_earth_spirit_geomagnetic_grip')
										|| localHero.HasModifier('modifier_rod_of_atos_debuff')
										|| localHero.HasModifier('modifier_gungnir_debuff')
										|| localHero.HasModifier('modifier_item_diffusal_blade_slow')
										|| localHero.HasModifier('modifier_rooted')
										|| localHero.HasModifier('modifier_item_ethereal_blade_ethereal')
										|| localHero.HasModifier('modifier_ogre_magi_ignite')
										|| localHero.HasModifier('modifier_pugna_decrepify')
										|| localHero.HasModifier('modifier_abaddon_frostmourne_debuff_bonus');
										
									if (silences){
										let enemiesMorRange = localHero.GetHeroesInRadius(700, Enum.TeamType.TEAM_ENEMY);
										if(enemiesMorRange.length > 0) {									
											myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_CAST_NO_TARGET,null,null,manta,Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY, localHero);
										}
									}
								}else{
									if (TargetInRadius(comboTarget, 350, localHero)) {
										myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_CAST_NO_TARGET,null,null,manta,Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY, localHero);
									}
								}
							}
						}
			

						if (menu_ItemsList.IsEnabled('item_satanic') ) { 
							let Satanic = localHero.GetItem('item_satanic', true);
							if (Satanic && CustomCanCast(Satanic) && !MyModSilverEdge) { 
								if (TargetInRadius(comboTarget, 350, localHero)) {
									let MyheroHp = localHero.GetHealth();
									if(MyheroHp <= localHero.GetMaxHealth() * 0.4){
										Satanic.CastNoTarget();
									}
								}
							}
						}

						
						if (menu_ItemsList.IsEnabled('item_orchid') ) { 
							let Orchid = localHero.GetItem('item_orchid', true);
							if (Orchid && CustomCanCast(Orchid)  && !Stunned && !InmuneMagic && !Hexxed && !ModifierShackleshot  && !Silenced && !MyModSilverEdge) { 
								if (TargetInRadius(comboTarget, 900, localHero)) {
									Orchid.CastTarget(comboTarget);
								}
							}
						}
						

						
						if (menu_ItemsList.IsEnabled('item_bloodthorn') ) { 
							let Bloodthorn = localHero.GetItem('item_bloodthorn', true);
							if (Bloodthorn && CustomCanCast(Bloodthorn) && !Stunned && !InmuneMagic && !Hexxed && !ModifierShackleshot && !Silenced && !MyModSilverEdge) { 
								if (TargetInRadius(comboTarget, 900, localHero)) {
									Bloodthorn.CastTarget(comboTarget);								
								}
							}
						}
						
						
						if (menu_ItemsList.IsEnabled('item_sheepstick') ) {
							let Sheepstick = localHero.GetItem('item_sheepstick', true);
							if (Sheepstick && CustomCanCast(Sheepstick) && !Stunned && !InmuneMagic && !Hexxed && !ModifierShackleshot && !MyModSilverEdge) {
								if (TargetInRadius(comboTarget, 600, localHero)) {
									Sheepstick.CastTarget(comboTarget);
									
								}
							} 
						} 
						
						
						if (menu_ItemsList.IsEnabled('item_nullifier') ) { 
							let Nullifier = localHero.GetItem('item_nullifier', true);
							let HeroItem = comboTarget.GetItem('item_glimmer_cape', true) 
								|| comboTarget.GetItem('item_cyclone', true) 
								|| comboTarget.GetItem('item_wind_waker', true) 
								|| comboTarget.GetItem('item_ghost', true) 
								|| comboTarget.GetItem('item_force_staff', true) 
								|| comboTarget.GetItem('item_aeon_disk', true)
								|| comboTarget.GetItem('item_hurricane_pike', true);
						
							let HeroMod = comboTarget.HasModifier('modifier_item_glimmer_cape_fade') 
								|| comboTarget.HasModifier('modifier_eul_cyclone') 
								|| comboTarget.HasModifier('modifier_wind_waker') 
								|| comboTarget.HasModifier('modifier_ghost_state')
								|| comboTarget.HasModifier('modifier_item_aeon_disk_buff')								
								|| comboTarget.HasModifier('modifier_windrunner_windrun')
								|| comboTarget.HasModifier('modifier_ember_spirit_flame_guard');						
							
							
							if (Nullifier && CustomCanCast(Nullifier) && (HeroItem || HeroMod || Ethereo) && !MyModSilverEdge) { 
								Nullifier.CastTarget(comboTarget);
							}
						}
					
							
						if (menu_ItemsList.IsEnabled('item_shivas_guard') ) { 
							let Shivas = localHero.GetItem('item_shivas_guard', true);
							if (Shivas && CustomCanCast(Shivas) && !InmuneMagic && !Hexxed && !MyModSilverEdge) { 
								if (TargetInRadius(comboTarget, 500, localHero)) {
									Shivas.CastNoTarget();
								}
							}
						}
						
						
						if (menu_ItemsList.IsEnabled('item_revenants_brooch') ) { 
							let Revenants = localHero.GetItem('item_revenants_brooch', true);
							let RevenantsMod = localHero.HasModifier("modifier_item_revenants_brooch_counter");
							if (Revenants && CustomCanCast(Revenants) && !InmuneMagic && !RevenantsMod && !MyModSilverEdge) { 
								if (TargetInRadius(comboTarget, 480, localHero)) {
									Revenants.CastNoTarget();
								}
							}
						}

						if (menu_ItemsList.IsEnabled('item_mjollnir') ) { 
							let Mjollnir = localHero.GetItem('item_mjollnir', true);
							if (Mjollnir && CustomCanCast(Mjollnir) && !InmuneMagic && !MyModSilverEdge) { 
								if (TargetInRadius(comboTarget, 500, localHero)) {
									Mjollnir.CastTarget(localHero);
								}
							}
						}						
						

						if (menu_ItemsList.IsEnabled('item_bullwhip') ) { 
							let Bullwhip = localHero.GetItem('item_bullwhip', false);
							if (Bullwhip && CustomCanCast(Bullwhip) && !InmuneMagic && comboTarget.IsRunning() && !Hexxed && !ModifierShackleshot && !MyModSilverEdge) { 
								if (TargetInRadius(comboTarget, 850, localHero)) {
									Bullwhip.CastTarget(comboTarget);
								}
							}
						}
						
						//'item_diffusal_blade', 'item_disperser'
						if (menu_ItemsList.IsEnabled('item_diffusal_blade') ) { 
							let Diffusal = localHero.GetItem('item_diffusal_blade', true);
							if (Diffusal && CustomCanCast(Diffusal) && !InmuneMagic && comboTarget.IsRunning() && !Hexxed && !ModifierShackleshot && !MyModSilverEdge) { 
								if (TargetInRadius(comboTarget, 600, localHero)) {
									Diffusal.CastTarget(comboTarget);
								}
							}
						}
						
						if (menu_ItemsList.IsEnabled('item_disperser') ) { 
							let Disperser = localHero.GetItem('item_disperser', true);
							if (Disperser && CustomCanCast(Disperser) && !InmuneMagic && comboTarget.IsRunning() && !Hexxed && !ModifierShackleshot && !MyModSilverEdge) { 
								if (TargetInRadius(comboTarget, 600, localHero)) {
									Disperser.CastTarget(comboTarget);
								}
							}
						}
						
							
						if (menu_ItemsList.IsEnabled('item_bloodstone') ) { 
							let Bloodstone = localHero.GetItem('item_bloodstone', true);
							if (Bloodstone && CustomCanCast(Bloodstone) && !InmuneMagic && !Hexxed && !MyModSilverEdge) { 
								if (TargetInRadius(comboTarget, 480, localHero)) {
									myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_CAST_NO_TARGET,null,null,Bloodstone,Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY, localHero);

								}
							}
						}	

						if (menu_AbilitiesList[1]) {
							if (powershot && powershot.IsExist() && powershot.CanCast() && ModifierShackleshot && !MyModSilverEdge) {   
								let castRange = powershot.GetCastRange();
								let castRangeBonus = localHero.GetCastRangeBonus();
								let castRangeTotal =  castRange + castRangeBonus;
								if (comboTarget.IsPositionInRange(localHero.GetAbsOrigin(), castRangeTotal, 0)) {
																		
									let speedUlti = powershot.GetLevelSpecialValueFor("speed");
									
									const travel_time = castRangeTotal / (speedUlti + 1);
									const castpointTimee = powershot.GetCastPoint();
									const delay = travel_time + castpointTimee;
									const BestPost = GetPredictedPosition(comboTarget, delay);

									myPlayer.PrepareUnitOrders( Enum.UnitOrder.DOTA_UNIT_ORDER_CAST_POSITION,null,BestPost,powershot, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY, localHero);

								}
							}
                        }
						
						if (menu_AbilitiesList[2]) {
                            

                        }
						
						if (menu_AbilitiesList[3]) {
                            

                        }

						if (menu_AbilitiesList[4]) {
							if(focusfire && focusfire.IsExist() && focusfire.CanCast() && !LinkenActive && !MyModSilverEdge){
								let  castRange = focusfire.GetCastRange();
								if (TargetInRadius(comboTarget, castRange, localHero)) {

									TarjetFocusfire = comboTarget;
									focusfire.CastTarget(comboTarget);
									
								}
							}                       
						}

						
						
											
						let [order, target, pos] = [Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_TARGET, comboTarget, comboTarget.GetAbsOrigin()];
						if (comboTarget.HasState(Enum.ModifierState.MODIFIER_STATE_ATTACK_IMMUNE) ||
							comboTarget.HasState(Enum.ModifierState.MODIFIER_STATE_INVULNERABLE) ||
							comboTarget.HasState(Enum.ModifierState.MODIFIER_STATE_MAGIC_IMMUNE) ||
							comboTarget.HasState(Enum.ModifierState.MODIFIER_STATE_UNTARGETABLE)) {
							order = Enum.UnitOrder.DOTA_UNIT_ORDER_MOVE_TO_POSITION;
							target = null;
							pos = Input.GetWorldCursorPos();
						}
						
						let EnemiP = comboTarget.GetAbsOrigin();
						let MiheroP = localHero.GetAbsOrigin();	
						let distHR = Math.floor(Dist2D(MiheroP, EnemiP)-40);
						
						let AttackRangeBasicHR = localHero.GetAttackRange();
						let AttackRangeBuffHR = localHero.GetAttackRangeBonus();
						let RangeAttackMaxHR = AttackRangeBasicHR + AttackRangeBuffHR;	
				
						if ( RangeAttackMaxHR > distHR ) {
							myPlayer.PrepareUnitOrders(order, target, null, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY, localHero, false, true);
						} else{	
							myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_MOVE_TO_POSITION, null, EnemiP, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY, localHero, false, true);
						}
					}
				}
				
				
			} else{
				comboTarget = null;
			}

			// ===== Funcion Opcion Panel =========
			if (isUiEnabledShackle.GetValue()) {
				if (GameRules.GetGameTime() / 60 >= EnemyUIShackle ) {
					if (menu_AbilitiesList[0] && shackleshot && shackleshot.IsExist() && shackleshot.CanCast() && !MyModSilverEdge) {
						let tarjetDetected = castShackleshot(localHero);
						if(tarjetDetected!= null && !tarjetDetected.HasModifier("modifier_black_king_bar_immune")  && !tarjetDetected.HasModifier("modifier_item_lotus_orb_active")  && !tarjetDetected.HasState(Enum.ModifierState.MODIFIER_STATE_STUNNED) && !tarjetDetected.HasState(Enum.ModifierState.MODIFIER_STATE_HEXED)){
							shackleshot.CastTarget(tarjetDetected);
						}
					}
				}
			}	
				
			
			// ===== Funcion Opcion Panel =========
			if (isUiEnabledDogde.GetValue()) {

				if (menu_AbilitiesList[3] && gale_force && gale_force.IsExist() && gale_force.CanCast() && !MyModSilverEdge) {
					let enemies = localHero.GetHeroesInRadius(500, Enum.TeamType.TEAM_ENEMY);
					let enemyPositions = {};
					if (enemies.length >= EnemyUI){
						
						for (let enemy of enemies) {
							
							let enemyId = enemy.GetPlayerID();
							let herolPosition = localHero.GetAbsOrigin();
							enemyPositions[enemyId] = enemy.GetAbsOrigin();
							let posINI = enemyPositions[enemyId];

							if (Engine.OnceAt(0.2)) {
							posFIN1 = enemy.GetAbsOrigin();	      
							}

							if (posINI.x === posFIN1.x && posINI.y === posFIN1.y) {
							continue;
							}

							const enemyDirection = (posFIN1.sub(posINI)).Normalized();

							enemyPositions[enemyId] = posFIN1;
								
							const enemyPosition = enemy.GetAbsOrigin();
							const oppositeDirection = enemyDirection.mul(new Vector(-1, -1, -1));
							let pushPosition = enemyPosition.add(oppositeDirection.mul(new Vector(100, 100, 0)));
							
							myPlayer.PrepareUnitOrders(30, null, enemyPosition, gale_force, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_HERO_ONLY, localHero);
							gale_force.CastPosition(pushPosition);
							setTimeout(function() {}, 300);
							
							// Nueva condición para activar windrun siempre
							if (menu_AbilitiesList[2] && windrun && windrun.IsExist() && windrun.CanCast()) {
								windrun.CastNoTarget();
							}
						}
					}
				}
				  
			}

			// ===== Funcion Opcion Panel =========
			if (isUiEnabledGale.GetValue()) {
				if (menu_AbilitiesList[4] && ModifierFocusfire) {

					// Nueva condición para activar BKB si el enemigo tiene activado Blade Mail
					let enemies = localHero.GetHeroesInRadius(1000, Enum.TeamType.TEAM_ENEMY);

					if (enemies.length >= 3) {
						if (menu_ItemsList.IsEnabled('item_black_king_bar') ) { 
							let bkb = localHero.GetItem('item_black_king_bar', true);
							if (bkb && bkb.CanCast()) {
								bkb.CastNoTarget();
							}
						}
					}

					if (TarjetFocusfire!= null && TarjetFocusfire.IsAlive()) {
						if (!TarjetFocusfire.IsDormant()) {	
							if (TarjetFocusfire.HasModifier("modifier_item_blade_mail_reflect")) {
								let bkb = localHero.GetItem('item_black_king_bar', true);
								if (bkb && bkb.CanCast()) {
									bkb.CastNoTarget();
								}
							}

							let enemyPositions = {};
							if (menu_AbilitiesList[3] && gale_force && gale_force.IsExist() && gale_force.CanCast()) {

								let enemyId = TarjetFocusfire.GetPlayerID();

								let vec1 = localHero.GetAbsOrigin();
								let vec2 = TarjetFocusfire.GetAbsOrigin();
								let distance = vec1.sub(vec2).Length2D();

								if (distance <= 1000) {
									// Actualizar la posición inicial del enemigo en cada iteración
									enemyPositions[enemyId] = TarjetFocusfire.GetAbsOrigin();

									// Calcular la dirección en la que el enemigo está viendo
									let posINI = enemyPositions[enemyId];
									//let posFIN = enemy.GetAbsOrigin();

									if (Engine.OnceAt(0.2)) {
										posFIN = TarjetFocusfire.GetAbsOrigin();	      
									}

									if (posINI.x === posFIN.x && posINI.y === posFIN.y) {
										//continue;
									}

									const enemyDirection = (posFIN.sub(posINI)).Normalized();

									enemyPositions[enemyId] = posFIN;

									// Calcular la dirección opuesta
									const enemyPosition = TarjetFocusfire.GetAbsOrigin();
									const oppositeDirection = enemyDirection.mul(new Vector(-1, -1, -1));

									// Lanzar Gale Force en la dirección opuesta desde la posición del héroe enemigo
									let pushPosition = enemyPosition.add(oppositeDirection.mul(new Vector(100, 100, 0)));
									myPlayer.PrepareUnitOrders(30, null, enemyPosition, gale_force, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_HERO_ONLY, localHero);
									// Agregar condición para evitar lanzar gale force si el enemigo tiene activado bkb
									if (TarjetFocusfire.HasModifier("modifier_black_king_bar_immune") === false) {
										gale_force.CastPosition(pushPosition);
										//setTimeout(function() {}, 300);
									}
									
									// Nueva condición para activar windrun siempre
									if (menu_AbilitiesList[2] && windrun && windrun.IsExist() && windrun.CanCast()) {
										windrun.CastNoTarget();
									}
								}
							}
						}
						
					} else{
						TarjetFocusfire = null;
					}	
				}

			}

			
			// ===== Particula Kill =========
				
        }
    };	


	//Funciones Para precedir pos
	function GetPredictedPosition(HeroEnemigo, delay) {
		const pos = HeroEnemigo.GetAbsOrigin();
		if (CantMove(HeroEnemigo)) {
			return pos;
		}
		if (!HeroEnemigo.IsRunning() || !delay) {
			return pos;
		}

		const dir = HeroEnemigo.GetRotation().GetForward().Normalized();
		const speed = FGetMoveSpeed(HeroEnemigo);

		return pos.add(dir.Scaled(speed * delay));
	}

	function CantMove(HeroEnemigo) {
		if (!HeroEnemigo){
			return false;
		}

		if ( HeroEnemigo.HasState(Enum.ModifierState.MODIFIER_STATE_ROOTED) || GetStunTimeLeft(HeroEnemigo) >= 1){
			return true;
		}
		if (HeroEnemigo.HasModifier("modifier_axe_berserkers_call")){
			return true;
		}
		if (HeroEnemigo.HasModifier("modifier_legion_commander_duel")){
			return true;
		}

		return false;
	}

	function GetStunTimeLeft(HeroEnemigo) {
		let mod = HeroEnemigo.GetModifier("modifier_stunned");
		if (!mod){
			return 0;
		}
		return Math.max(mod.GetDieTime() - GameRules.GetGameTime(), 0);
	}

	function FGetMoveSpeed(HeroEnemigo) {
		let base_speed = HeroEnemigo.GetBaseSpeed();
		let bonus_speed = HeroEnemigo.GetMoveSpeed() - HeroEnemigo.GetBaseSpeed();

		// when affected by ice wall, assume move speed as 100 for convenience
		if (HeroEnemigo.HasModifier("modifier_invoker_ice_wall_slow_debuff")){
			return 100;
		}

		if (HeroEnemigo.HasModifier("modifier_item_diffusal_blade_slow")){
			return 100;
		}

		// when get hexed, move speed = 140/100 + bonus_speed
		if (GetHexTimeLeft(HeroEnemigo) > 0){
			return 140 + bonus_speed;
		}

		return base_speed + bonus_speed;
	}

	function GetHexTimeLeft(HeroEnemigo) {
		let mod;
		let mod1 = HeroEnemigo.GetModifier("modifier_sheepstick_debuff");
		let mod2 = HeroEnemigo.GetModifier("modifier_lion_voodoo");
		let mod3 = HeroEnemigo.GetModifier("modifier_shadow_shaman_voodoo");

		if (mod1){
			mod = mod1;
		}
		if (mod2){
			mod = mod2;
		}
		if (mod3){
			mod = mod3;
		}

		if (!mod){
			return 0;
		}
		return Math.max(mod.GetDieTime() - GameRules.GetGameTime(), 0);
	}
	
	function BestPosBlink(EnemyHeroLocal) {
		let tableNearbyTrees = EnemyHeroLocal.GetTreesInRadius(575);	
		let enemyHeroesAll = EnemyHeroLocal.GetHeroesInRadius(575, Enum.TeamType.TEAM_ENEMY);
		let units = EnemyHeroLocal.GetUnitsInRadius(575,Enum.TeamType.TEAM_ENEMY);
		let bestPosition = null;
		let closestEnemy = null;
		let closestDistance = Infinity;
		
		if(enemyHeroesAll.length > 1){
			for (let enemy of enemyHeroesAll) {
				
				if(enemy.GetUnitName() !== EnemyHeroLocal.GetUnitName() ){
					
					let distance = EnemyHeroLocal.GetAbsOrigin().Distance(enemy.GetAbsOrigin());
					if (distance < closestDistance) {
						closestEnemy = enemy;
						closestDistance = distance;
					}
				}
			}
		}

		if(tableNearbyTrees.length > 0){
			if (closestEnemy == null) {
				let closestDistance = Infinity;
				for (let tree of tableNearbyTrees) {
					let distance = EnemyHeroLocal.GetAbsOrigin().Distance(tree.GetAbsOrigin());
					if (distance < closestDistance) {
						closestEnemy = tree;
						closestDistance = distance;
					}
				}
			}
		}
		
		if(units.length > 0){
			if (closestEnemy == null) {
				let closestDistance = Infinity;
				for (let unit of tableNearbyTrees) {
					if(unit.IsCreep() && (unit.IsLaneCreep() || unit.IsNeutral())){
						let distance = EnemyHeroLocal.GetAbsOrigin().Distance(unit.GetAbsOrigin());
						if (distance < closestDistance) {
							closestEnemy = unit;
							closestDistance = distance;
						}
					}
				}
			}
		}

		if (closestEnemy != null) {
			
			const enemyHero1Pos = EnemyHeroLocal.GetAbsOrigin();
			const enemyHero2Pos = closestEnemy.GetAbsOrigin();
			const dirEn1En2 = (enemyHero1Pos.sub(enemyHero2Pos)).Normalized();
			bestPosition = enemyHero1Pos.add(dirEn1En2.mul(new Vector(100, 100, 0)));
		} else{
			bestPosition = EnemyHeroLocal.GetAbsOrigin();
		}
		
		return bestPosition;
	}
	
	function castShackleshot(HeroLocal) {
		const searchRadius = 800;
		const searchRadius2 = 575 + 800;

		let enemyHeroesAll = HeroLocal.GetHeroesInRadius(searchRadius, Enum.TeamType.TEAM_ENEMY);
		let targetEnemy = null;
		let targetEnemy2 = null;
		let tarjetTrue = null;

		// Buscamos el enemigo más cercano
		for (let enemy of enemyHeroesAll) {
			if (enemy != HeroLocal) {
				if (targetEnemy == null || HeroLocal.GetAbsOrigin().Distance(enemy.GetAbsOrigin()) < HeroLocal.GetAbsOrigin().Distance(targetEnemy.GetAbsOrigin())) {
					targetEnemy = enemy;
				}
			}
		}

		// Si encontramos un enemigo, buscamos detrás suyo otro objetivo
		if (targetEnemy != null) {
			const enemyHero1Pos = targetEnemy.GetAbsOrigin();
			const enemyHero2Pos = HeroLocal.GetAbsOrigin();
			const dirEn1En2 = (enemyHero1Pos.sub(enemyHero2Pos)).Normalized();

			let units = HeroLocal.GetUnitsInRadius(searchRadius2, Enum.TeamType.TEAM_ENEMY);
			let trees = HeroLocal.GetTreesInRadius(searchRadius2);

			// Buscamos el objetivo detrás del enemigo
			for (let unit of units.concat(trees)) {
				if (unit != targetEnemy && unit.GetAbsOrigin().sub(enemyHero1Pos).Normalized().Dot(dirEn1En2) > 0.99) {
					targetEnemy2 = unit;
					break;
				}
			}

			// Si encontramos un objetivo detrás del enemigo, casteamos Shackleshot
			if (targetEnemy2 != null) {
				tarjetTrue = targetEnemy;
			}
		}
		return tarjetTrue;
	}

	
	// radius Rdio de Casteo
	function BestPosition(EnemiInRadius, radius) {
		if (!EnemiInRadius || EnemiInRadius.length <= 0) return null;
		let enemyNum = EnemiInRadius.length;

		if (enemyNum == 1) return EnemiInRadius[0].GetAbsOrigin();

		let maxNum = 1;
		let bestPos = EnemiInRadius[0].GetAbsOrigin();
		for (let i = 0; i < enemyNum - 1; i++) {
			for (let j = i + 1; j < enemyNum; j++) {
				let pos1 = EnemiInRadius[i].GetAbsOrigin();
				let pos2 = EnemiInRadius[j].GetAbsOrigin();
				let mid = pos1.add(pos2).Scaled(0.5);

				let heroesNum = 0;
				for (let k = 0; k < enemyNum; k++) {
					if (EnemiInRadius[k].IsPositionInRange( mid, radius, 0)) {
						heroesNum++;
					}
				}

				if (heroesNum > maxNum) {
					maxNum = heroesNum;
					bestPos = mid;
				}
			}
		}

		return bestPos;
	}	
	
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
	
	// Definición de la función OnScriptLoad
	AutoSaverWindrunner.OnScriptLoad = AutoSaverWindrunner.OnGameStart = () => {
		localHero = EntitySystem.GetLocalHero();
	    myPlayer = EntitySystem.GetLocalPlayer();
		enemyList = [];

	};

	// Definición de la función OnGameEnd
	AutoSaverWindrunner.OnGameEnd = () => {
		localHero = null;
	    myPlayer = null;
	};

	// Registro del script
	RegisterScript(AutoSaverWindrunner);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/AutoSaverWindrunner.ts"]();
/******/ 	
/******/ })()
;
