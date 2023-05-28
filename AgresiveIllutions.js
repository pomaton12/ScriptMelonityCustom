/******/ (() => { // webpackBootstrap 
/******/ 	var __webpack_modules__ = ({

/***/ "./src/IllusionsAgresive.ts":
/*!**********************************!*\
  !*** ./src/IllusionsAgresive.ts ***!
  \**********************************/
/***/ (() => {

eval(`

	const IllusionsAgresive = {};

	let localHero;
	let myPlayer;
	let illusionList = [];

	const path_ = ['Player', 'Agresive Illusions'];

	let enableToggle = Menu.AddToggle(path_, 'Enable', true);
	let attackHeroToggle = Menu.AddToggle(path_, 'Attack Hero', true);
	let pushLineCreepsToggle = Menu.AddToggle(path_, 'Push Line Creeps', true);

function getIllusions() {
    if (illusionList.length < 5) {
        illusionList = [];
        let heroes = EntitySystem.GetHeroesList();
        if (heroes || heroes.length > 0) {
                 
			if (heroes) {
				for (let hero of heroes) {
					if (hero && hero.IsIllusion() && !hero.IsMeepoClone() && hero.IsAlive() &&
						!hero.IsDormant() && hero.IsSameTeam(localHero)) {
						illusionList.push(hero);
					}
				}
			}
		} else {
			return;  
		}
		
    } else {
        // Elimina las ilusiones no válidas de la lista
        illusionList = illusionList.filter(illusion => illusion && !illusion.IsDormant() && illusion.IsAlive());
    }
}


	function getClosestIllusion(vector, radius = 2000) {
		let closestIllusion = null;
		let closestDistance = Number.MAX_VALUE;

		if (illusionList || illusionList.length  > 0) {
			for (const illusion of illusionList) {
				// Verifica si la ilusión está viva y no está inactiva
				if (illusion && illusion.IsAlive() && !illusion.IsDormant()) {
					const distance = vector.Distance(illusion.GetAbsOrigin());
					if (distance <= radius && distance < closestDistance) {
						closestIllusion = illusion;
						closestDistance = distance;
					}
				}
			}
		}

		return closestIllusion;
	}



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

	IllusionsAgresive.OnUpdate = () => {
	    if (!localHero || !enableToggle.GetValue()) {
		return;
	    }

	    getIllusions();

	    const illusion = getClosestIllusion(Input.GetWorldCursorPos());

	    const attackRadius = 1500;

	    if (attackHeroToggle.GetValue()) {
		const closestEnemyHero = getClosestEnemyHero(attackRadius);

		if (closestEnemyHero) {
		    if (illusion) {
			if (Engine.OnceAt(0.2)) {
			    myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_TARGET, closestEnemyHero, null, null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY, illusion, false, true);
			}
		    }
		}
	    }

	    if (pushLineCreepsToggle.GetValue()) {
			const closestEnemyHero = getClosestEnemyHero(attackRadius);

			if (!closestEnemyHero) {
				if (illusion != null) {
					const laneCreeps = illusion.GetUnitsInRadius(2000, Enum.TeamType.TEAM_ENEMY);
				
					if (laneCreeps || laneCreeps.length  > 0) {

						const closestLaneCreep = getClosestCreep(laneCreeps, localHero.GetAbsOrigin());

						if (closestLaneCreep) {
							if (illusion) {
								if (Engine.OnceAt(0.2)) {
								myPlayer.PrepareUnitOrders(Enum.UnitOrder.DOTA_UNIT_ORDER_ATTACK_MOVE, null, closestLaneCreep.GetAbsOrigin(), null, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY, illusion, false, true);
								}
							}
						}
					} else {
						return;
					}
					
				} else {
					return;
				}												
			}
	    }
	};

	IllusionsAgresive.OnScriptLoad = IllusionsAgresive.OnGameStart = () => {
	    localHero = EntitySystem.GetLocalHero();
	    myPlayer = EntitySystem.GetLocalPlayer();
	};

	IllusionsAgresive.OnGameEnd = () => {
	    localHero = null;
	    myPlayer = null;
	};

	RegisterScript(IllusionsAgresive);



`);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/IllusionsAgresive.ts"]();
/******/ 	
/******/ })()
;
