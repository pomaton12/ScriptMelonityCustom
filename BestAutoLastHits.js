
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

	let enableToggle = Menu.AddToggle(path_, 'Enable', true)
	    .OnChange(state => {
        enableToggle = state.newValue;
    })
	
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

	function getClosestCreep(creeps, target) {
	    let closestCreep = null;
	    for (const creep of creeps) {
		if (creep.IsCreep() && !creep.IsDormant() && creep.IsAlive()) {
		    closestCreep = creep;
		}
	    }
	    return closestCreep;
	}
	
	function calculateAttackTravelTime(localHero, target) {
		const heroPosition = localHero.GetAbsOrigin();
		const targetPosition = target.GetAbsOrigin();
		const distance = heroPosition.sub(targetPosition).Length2D();
		const attackSpeed = 1/localHero.GetAttacksPerSecond();
		const attackAnimationPoint = localHero.GetAttackAnimationPoint();
		const attackTime = attackAnimationPoint / attackSpeed;

		let projectileSpeed = localHero.GetProjectileSpeed();
		if (projectileSpeed === 0) { // Héroe cuerpo a cuerpo
			projectileSpeed = Number.MAX_VALUE;
		}

		const projectileTravelTime = distance / projectileSpeed;
		return attackTime + projectileTravelTime;
	}

	
	function moveToTarget(localHero, target) {
		const heroPosition = localHero.GetAbsOrigin();
		const targetPosition = target.GetAbsOrigin();
		const direction = targetPosition.sub(heroPosition).Normalized();
		const moveDistance = localHero.GetMoveSpeed();
		const newPosition = heroPosition.add(direction.mul(new Vector(moveDistance, moveDistance, 0)));

		SendOrderMovePos(newPosition);
	}


	
	function getClosestLowHealthCreep(localHero) {
		
		const attackRange = localHero.GetAttackRange();
		let attackRadius;
		let laneCreeps;
		
		if (attackRange <= 500 ){
			attackRadius = 500;
		} else {
			attackRadius = attackRange;
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
			const creep = laneCreeps[i];
			const HPcreepActual = Math.floor(creep.GetHealth() + creep.GetHealthRegen());
			const attackTravelTime = calculateAttackTravelTime(localHero, creep);
			const actualDamage = localHero.GetTrueDamage() + Math.floor((localHero.GetTrueMaximumDamage() - localHero.GetTrueDamage()) / 2); // SUMAR HABILIDADES
			const HeroDamage = Math.floor(localHero.GetDamageMultiplierVersus(creep) * actualDamage * localHero.GetArmorDamageMultiplier(creep));
			const HeroDamagefINAL = HeroDamage+attackTravelTime*actualDamage;
			const futureCreepHealth = HPcreepActual;
			
			if(HPcreepActual < 2*actualDamage){
				//localHero.MoveTo(creep.GetAbsOrigin());
			}
			
			console.log("AR = ", actualDamage," AU = ",HeroDamagefINAL," HP = ",HPcreepActual);
			if (futureCreepHealth <= HeroDamagefINAL && futureCreepHealth < closestCreepHealth) {
				closestCreep = creep;
				closestCreepHealth = futureCreepHealth;
			}
		}

		return closestCreep;
	}

	function DrawRadiusActionParticle(localHero) {
		const heroPosition = localHero.GetAbsOrigin();
		const textOffset = new Vector(0, 0, 370);
		const textPos = heroPosition.add(textOffset);
		const text = "[Auto LastHit]";
		const font = Renderer.LoadFont('Arial', 12, Enum.FontWeight.BOLD);
		//const healthBarPosition = localHero.GetHealthBarPosition();
		
		let [x, y, onScreen] = Renderer.WorldToScreen(heroPosition);

		if (onScreen) {
			// Dibuja algo en la posición del héroe en la pantalla
			Renderer.SetDrawColor(255, 255, 255, 255);
			Renderer.DrawWorldText(font, textPos.sub(new Vector(Renderer.GetTextSize(font, text)[0] / 2, 0, 0)), text, 0, 0);
			//Renderer.DrawText(font, x, y-10, text)
		}
		
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
		if (!localHero || !enableToggle.GetValue()) {
			return;
		}
		
		if (Input.IsKeyDown(KeyBindLastHit.GetValue())) {
			const attackRadius = 500;
			
			
			DrawRadiusActionParticle(localHero);
			
			if (DisplayModeHitEnemy === 0) {
				const closestEnemyHero = getClosestEnemyHero(attackRadius);

				if (closestEnemyHero) {
					if (Engine.OnceAt(0.2)) {
						myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_TARGET, closestEnemyHero, null, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY, localHero, false, true);
					}
				}
			}


			const closestCreep = getClosestLowHealthCreep(localHero);
			
			if (closestCreep) {
				
				if (Engine.OnceAt(0.2)) {
					myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_TARGET, closestCreep, null, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY, localHero, false, true);
				}
			} else {
				if (Engine.OnceAt(0.2)) {
					SendOrderMovePos(Input.GetWorldCursorPos());
				}						
			}

		} else {
			
			if (createDrawRadius > 0) {
				Particle_ID.Destroy();
				Particle_ID = null;
				createDrawRadius = 0;
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
