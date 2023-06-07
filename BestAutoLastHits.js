/******/ (() => { // webpackBootstrap 
/******/ 	var __webpack_modules__ = ({

/***/ "./src/BestAutoLastHits.ts":
/*!**********************************!*\
  !*** ./src/BestAutoLastHits.ts ***!
  \**********************************/
/***/ (() => {

eval(`

	const BestAutoLastHits = {};

	let localHero;
	let myPlayer;
	let Particle_ID = null;
	let createDrawRadius = 0;

	const path_ = ['Creeps', 'Best AutoLastHit'];

	let enableToggle = Menu.AddToggle(path_, 'Enable', true);
	
	let KeyBindLastHit = Menu.AddKeyBind(path_, 'AutoLastHits', Enum.ButtonCode.KEY_NONE);
	
	let DisplayModeMove = Menu.AddComboBox(path_, 'Move', ['Holt key', 'One Key'],0)
		.OnChange(state =>{   	
		DisplayModeMove = state.newValue;
		})
		.GetValue();
	
	let DisplayModeHitCreep = Menu.AddComboBox(path_, 'Hit Creeps', ['Enemy creeps', 'Ally creeps', 'Both'],2)
		.OnChange(state =>{   	
		DisplayModeHitCreep = state.newValue;
		})
		.GetValue();
	
	let DisplayModeHitEnemy = Menu.AddComboBox(path_, 'Hit Enemies', ['No hit', 'without creep aggro', 'Aggression mode'],0)
		.OnChange(state =>{   	
		DisplayModeHitEnemy = state.newValue;
		})
		.GetValue();

	let enableToggleAutoAttack = Menu.AddToggle(path_, 'Auto Attack Animation', true);

	function getClosestEnemyHero(radius) {
	    const enemyHeroes = EntitySystem.GetHeroesList().filter(
		(hero) => !hero.IsIllusion() && !hero.IsMeepoClone() && !hero.IsSameTeam(localHero) && hero.IsAlive() && !hero.IsIllusion()
	    );
	    
	    if (!enemyHeroes || enemyHeroes.length <= 0) {
		return;
	    }

	    let closestHero = null;
	    let closestDistance = Number.MAX_VALUE;

	    for (const hero of enemyHeroes) {
		const distance = localHero.GetAbsOrigin().sub(hero.GetAbsOrigin()).Length2D();
		if (distance < radius && distance < closestDistance) {
		    closestHero = hero;
		    closestDistance = distance;
		}
	    }

	    return closestHero;
	}

	function SendOrderMovePos(vector) {
	    myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_MOVE_TO_POSITION, null, vector, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_CURRENT_UNIT_ONLY, localHero, false, true);
	}
		
	function getAdditionalDamage(localHero) {
		let additionalDamage = 0;
		
		let QuillingBlade = localHero.GetItem('item_quelling_blade', true);
		if (QuillingBlade) {
			if(localHero.IsRanged()){
				additionalDamage = 4;
			} else {
				additionalDamage = 8;
			}
		}

		return additionalDamage;
	}
	
	function getClosestLowHealthCreep(localHero) {
		
		const attackRange = localHero.GetAttackRange();
		let attackRadius;
		let laneCreeps;
		
		if (attackRange <= 500 ){
			attackRadius = 500;
		} else {
			attackRadius = 750;
		}
		
		if (DisplayModeHitCreep == 0) {
			laneCreeps = localHero.GetUnitsInRadius(attackRadius, Enum.TeamType.TEAM_ENEMY);
		} else if (DisplayModeHitCreep == 1) {
			laneCreeps = localHero.GetUnitsInRadius(attackRadius, Enum.TeamType.TEAM_FRIEND);
		} else if (DisplayModeHitCreep == 2) {
			laneCreeps = localHero.GetUnitsInRadius(attackRadius, Enum.TeamType.TEAM_BOTH);
		}
		
		let closestCreep = null;
		let closestCreepHealth = Number.MAX_VALUE;
		
		for (let i = 0; i < laneCreeps.length; i++) {
			// Creep HP Calc
			const creep = laneCreeps[i];
			let CreepArmor = creep.GetPhysicalArmorValue();
			
			//condition exisarmor
			if (CreepArmor >= 0){
				CreepArmor = 1+((0.06 * CreepArmor) / (1 + 0.06 * CreepArmor));
			} else{
				CreepArmor = 0.94;
			}
			
			const distance = localHero.GetAbsOrigin().sub(creep.GetAbsOrigin()).Length2D();

			// Calcular el tiempo de viaje en función de la velocidad de movimiento del héroe
			const travelTime = distance / localHero.GetMoveSpeed();

			// Obtener el tiempo de ataque del héroe
			const attackTime = localHero.GetAttackTime();

			// Estimar cuándo el objetivo estará en el rango de ataque del héroe
			let estimatedAttackTime = travelTime + attackTime;
						
			
			// My Damage
			let actualDamage = localHero.GetTrueDamage() + getAdditionalDamage(localHero);

			if (localHero.IsRanged()) {
				const projectileSpeed = localHero.GetProjectileSpeed();
				const projectileTravelTime = distance / projectileSpeed;
				actualDamage += Math.floor((localHero.GetTrueMaximumDamage() - localHero.GetTrueDamage()) / 2);
				estimatedAttackTime += projectileTravelTime;
			} else {
				actualDamage += Math.floor((localHero.GetTrueMaximumDamage() - localHero.GetTrueDamage()) / 2);
			}

			const HPcreepActual = Math.floor((creep.GetHealth() + creep.GetHealthRegen()*estimatedAttackTime)*CreepArmor);
			if (HPcreepActual <= actualDamage ) {
				closestCreep = creep;
			}
		}

		return closestCreep;
	}

	function DrawRadiusActionParticle(localHero) {
	const heroPosition = localHero.GetAbsOrigin();
	const offset = localHero.GetHealthBarOffset();

	// Agregar el desplazamiento de la barra de vida al vector de posición
	const pos = heroPosition.add(new Vector(0, 0, offset));
	const text = "[Auto LastHits]";
	const font = Renderer.LoadFont('Arial', 13, Enum.FontWeight.BOLD);

	// Convertir las coordenadas del mundo a coordenadas de pantalla
	let [x, y, visible] = Renderer.WorldToScreen(pos);

	// Dibujar el texto centrado en las coordenadas de pantalla calculadas
	Renderer.DrawTextCentered(font, x, y-40, text, 1);

		
		if(createDrawRadius == 0){
			if (!Particle_ID) {
				Particle_ID = Particle.Create("particles/ui_mouseactions/range_display.vpcf", Enum.ParticleAttachment.PATTACH_ABSORIGIN_FOLLOW, localHero);
				Particle_ID.SetControl(1, Vector(500,0,0));
				Particle_ID.SetControl(6, new Vector(1, 0, 0));
				createDrawRadius = createDrawRadius+1;
			}
		}
		
	}
	


	BestAutoLastHits.OnUpdate = () => {
		if (localHero && enableToggle.GetValue()) {

		
			if (Input.IsKeyDown(KeyBindLastHit.GetValue())) {
				const attackRadius = 500;
				
				
				DrawRadiusActionParticle(localHero);
				
				if (DisplayModeHitEnemy === 2) {
					const closestEnemyHero = getClosestEnemyHero(attackRadius);

					if (closestEnemyHero) {
						if (Engine.OnceAt(0.2)) {
							myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_TARGET, closestEnemyHero, null, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY, localHero, false, true);
						}
					}
				}


				const closestCreep = getClosestLowHealthCreep(localHero);
				
				if (closestCreep) {
					
					if (Engine.OnceAt(0.1)) {
						myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_TARGET, closestCreep, null, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY, localHero, false, true);
					}
				} else {
					let RangeNoMove = 150;
					let vect1Pos = localHero.GetAbsOrigin();
					let vect2Pos = Input.GetWorldCursorPos();
					let DistanciaOriWolrd = vect1Pos.Distance(vect2Pos);

					
					if(DistanciaOriWolrd <= RangeNoMove){
						//console.log("unit = ",nearest_enemi);
						let nearest_enemi = Input.GetNearestUnitToCursor(Enum.TeamType.TEAM_ENEMY);
						let PosEnemiNaerest = nearest_enemi.GetAbsOrigin();
						let vect1PosAct = localHero.GetAbsOrigin();
						let distanteAnimation = vect1PosAct.Distance(PosEnemiNaerest);
						let attackRangeHero = localHero.GetAttackRange();
						
						if (enableToggleAutoAttack.GetValue()) {
							
							if ( distanteAnimation <= attackRangeHero){
								if (Engine.OnceAt(0.2)) {
									myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_TARGET, nearest_enemi, PosEnemiNaerest, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY, localHero, false, true);						
									myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_STOP, nearest_enemi, PosEnemiNaerest, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY, localHero, false, true);
								}
							} else{
								if (Engine.OnceAt(0.1)) {
									myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_MOVE, null, PosEnemiNaerest, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY, localHero, false, true);						
								}
							}
						}
					} else {
						if (Engine.OnceAt(0.1)) {
							
							SendOrderMovePos(Input.GetWorldCursorPos());
						}
					}
				}

			} else {
				
				if (createDrawRadius > 0) {
					Particle_ID.Destroy();
					Particle_ID = null;
					createDrawRadius = 0;
				}
			}
		}
	};


	BestAutoLastHits.OnScriptLoad = BestAutoLastHits.OnGameStart = () => {
	    localHero = EntitySystem.GetLocalHero();
	    myPlayer = EntitySystem.GetLocalPlayer();
	};

	BestAutoLastHits.OnGameEnd = () => {
	    localHero = null;
	    myPlayer = null;
	};

	RegisterScript(BestAutoLastHits);



`);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/BestAutoLastHits.ts"]();
/******/ 	
/******/ })()
;
