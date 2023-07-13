/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/ItemsDogde.ts":
/*!**********************************!*\
  !*** ./src/ItemsDogde.ts ***!
  \**********************************/
/***/ (() => {

	// Definición del objeto ItemsDogde
	const ItemsDogde = {};

	// Declaración de la variable localHero
	let localHero = null;
	let myPlayer = null;

	const path = ["Custom Scripts","Utility","Use Item Estrategic"];

	let isUiEnabled = Menu.AddToggle(path, 'Enable', false);

	let menu_ItemList = Menu.AddMultiSelect(path, 'Items', ['panorama/images/items/manta_png.vtex_c', 'panorama/images/items/nullifier_png.vtex_c'], [true, true])
		.OnChange((state) => {menu_ItemList = state.newValue;})
		.GetValue();
		
	Menu.SetImage(path, 'panorama/images/control_icons/bp2020_gauntlet_icon_png.vtex_c');
		
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

	ItemsDogde.OnDraw = () => {
        if (localHero && isUiEnabled.GetValue()) {
			
			let MyModSilverEdge = localHero.HasModifier("modifier_item_silver_edge_windwalk");
			let MyModInvi = localHero.HasModifier("modifier_invisible");
			let MyModBkb = localHero.HasModifier("modifier_black_king_bar_immune");

			if (menu_ItemList[0]) { 
				let manta = localHero.GetItem('item_manta', true);			
				if (manta && CustomCanCast(manta) && !MyModSilverEdge && !MyModInvi && !MyModBkb ) { 
					
					let silences = localHero.HasModifier('modifier_orchid_malevolence_debuff')
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
						|| localHero.HasModifier('modifier_techies_reactive_tazer_disarmed')
						|| localHero.HasModifier('modifier_enigma_malefice')
						|| localHero.HasModifier('modifier_bloodseeker_blood_bath')
						|| localHero.HasModifier('modifier_dark_willow_bramble_maze')
						|| localHero.HasModifier('modifier_dark_willow_cursed_crown')
						|| localHero.HasModifier('modifier_faceless_void_time_dilation_slow')
						|| localHero.HasModifier('modifier_invoker_cold_snap')
						|| localHero.HasModifier('modifier_templar_assassin_trap_slow')
						|| localHero.HasModifier('modifier_silence')
						|| localHero.HasModifier('modifier_furion_sprout_entangle')
						|| localHero.HasModifier('modifier_crystal_maiden_frostbite')
						|| localHero.HasModifier('modifier_earth_spirit_geomagnetic_grip_debuff')
						|| localHero.HasModifier('modifier_rod_of_atos_debuff')
						|| localHero.HasModifier('modifier_gungnir_debuff')
						|| localHero.HasModifier('modifier_item_diffusal_blade_slow')
						|| localHero.HasModifier('modifier_rooted')
						|| localHero.HasModifier('modifier_item_ethereal_blade_ethereal')
						|| localHero.HasModifier('modifier_ogre_magi_ignite')
						|| localHero.HasModifier('modifier_pugna_decrepify')
						|| localHero.HasModifier('modifier_abaddon_frostmourne_debuff_bonus');
					
					if (silences){
						//console.log("Castea mrda	", silences);	
						let enemiesMorRange = localHero.GetHeroesInRadius(1000, Enum.TeamType.TEAM_ENEMY);
						if(enemiesMorRange.length > 0) {
							if (Engine.OnceAt(0.2)) {
								
								myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_CAST_NO_TARGET,null,null,manta,Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY, localHero);
							}
						}
					}
				}
			}
			
						
			if (menu_ItemList[1]) { 
				let Nullifier = localHero.GetItem('item_nullifier', true);
				
				if (Nullifier && Nullifier.IsExist() && Nullifier.CanCast() && !MyModSilverEdge && !MyModInvi) { 

					let castRange = Nullifier.GetCastRange();
					let castRangeBonus = localHero.GetCastRangeBonus();
					let castRangeTotal =  castRange + castRangeBonus;	
					
					let enemyInRadius = localHero.GetHeroesInRadius(castRangeTotal, Enum.TeamType.TEAM_ENEMY);
					
					if (enemyInRadius.length > 0) {
						let closestHero = null;
						let closestDistance = Number.MAX_VALUE;

						for (const hero of enemyInRadius) {
							let HeroItem = hero.GetItem('item_glimmer_cape', true) 
								|| hero.GetItem('item_force_staff', true) 
			
							let HeroMod = hero.HasModifier('modifier_item_glimmer_cape_fade') 
								|| hero.HasModifier('modifier_eul_cyclone') 
								|| hero.HasModifier('modifier_wind_waker') 
								|| hero.HasModifier('modifier_ghost_state')
								|| hero.HasModifier('modifier_item_aeon_disk_buff')								
								|| hero.HasModifier('modifier_windrunner_windrun')
								|| hero.HasModifier('modifier_attack_immune')
								|| hero.HasModifier('modifier_ember_spirit_flame_guard');						
							
							const distance = localHero.GetAbsOrigin().Distance(hero.GetAbsOrigin());
							if (distance < closestDistance && (HeroItem || HeroMod )) {
								closestHero = hero;
								closestDistance = distance;
							}
						}						
						
						
						if (closestHero != null && !closestHero.HasModifier("modifier_item_lotus_orb_active")) {
							if (Engine.OnceAt(0.2)) {
								Nullifier.CastTarget(closestHero);
							}
						}
					}
					
				}
			}			
			
		}
	};
	
	// Definición de la función OnScriptLoad
	ItemsDogde.OnScriptLoad = ItemsDogde.OnGameStart = () => {
		localHero = EntitySystem.GetLocalHero();
	    myPlayer = EntitySystem.GetLocalPlayer();

	};

	// Definición de la función OnGameEnd
	ItemsDogde.OnGameEnd = () => {
		localHero = null;
	    myPlayer = null;
	};

	// Registro del script
	RegisterScript(ItemsDogde);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/ItemsDogde.ts"]();
/******/ 	
/******/ })()
;
