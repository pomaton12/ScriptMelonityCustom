/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/AutoSaverWindrunner.ts":
/*!**********************************!*\
  !*** ./src/AutoSaverWindrunner.ts ***!
  \**********************************/
/***/ (() => {

eval(`
	// Definición del objeto AutoSaverWindrunner
	const AutoSaverWindrunner = {};

	// Declaración de la variable localHero
	let localHero;
	let myPlayer;
	let posFIN;
	let posFIN1;
	
	// Definición del array path_
	const path_ = ['Heroes', 'Intelligence', 'Windranger'];

	// Creación del toggle isUiEnabled
	let isUiEnabled = Menu.AddToggle(['Heroes', 'Intelligence', 'Windranger'], 'GaleForce Use in Ulti', true)
	    .SetTip('Enable or disable the use of Gale Force during Windranger ultimate ability');
	    isUiEnabled.SetImage('panorama/images/spellicons/windrunner_gale_force_png.vtex_c');

	// Creación del toggle isUiEnabledDogde
	let isUiEnabledDogde = Menu.AddToggle(path_, 'Use to Dogde', true);
	isUiEnabledDogde.SetImage('panorama/images/spellicons/windrunner_gale_force_png.vtex_c');

	// Definición de la función OnUpdate
	let previousEnemyPositions = {};
	let bkbEnemies = {};

	AutoSaverWindrunner.OnUpdate = () => {
      if (localHero && isUiEnabledDogde.GetValue()) {
	    if (localHero.GetUnitName() !== "npc_dota_hero_windrunner") {
	      return;
	    }
		let enemies = localHero.GetHeroesInRadius(400, Enum.TeamType.TEAM_ENEMY);
		let enemyPositions = {};
		let galeForce = localHero.GetAbilityByIndex(3);
		
		if (enemies){
		
			for (let enemy of enemies) {
				let enemyId = enemy.GetPlayerID();
				if (galeForce && galeForce.IsExist() && galeForce.CanCast()) {
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
					
					myPlayer.PrepareUnitOrders(30, null, enemyPosition, galeForce, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_HERO_ONLY, localHero);
					galeForce.CastPosition(pushPosition);
					setTimeout(function() {}, 300);
					
					// Nueva condición para activar windrun siempre
					let windrun = localHero.GetAbilityByIndex(2);
					if (windrun && windrun.IsExist() && windrun.CanCast()) {
					windrun.CastNoTarget();
					}

				}
			}
		}
	      
	  }
	
	
	  if (localHero && isUiEnabled.GetValue()) {
	    if (localHero.GetUnitName() !== "npc_dota_hero_windrunner") {
	      return;
	    }

	    const modifiers = localHero.GetModifiers();
	    for (let modifier of modifiers) {
	      if (modifier.GetName() === 'modifier_windrunner_focusfire') {
		const remainingTime = modifier.GetRemainingTime();
		if (remainingTime <= 20) {
		  // Nueva condición para activar windrun siempre
		  let windrun = localHero.GetAbilityByIndex(2);
		  if (windrun && windrun.IsExist() && windrun.CanCast()) {
		    windrun.CastNoTarget();
		  }
		  // Nueva condición para activar BKB si el enemigo tiene activado Blade Mail
		  let enemies = localHero.GetHeroesInRadius(1000, Enum.TeamType.TEAM_ENEMY);

		  if (enemies.length >= 3) {
		    let bkb = localHero.GetItem('item_black_king_bar', true);
		    if (bkb && bkb.CanCast()) {
		      bkb.CastNoTarget();
		    }
		  }

		  for (let enemy of enemies) {
		    if (enemy.HasModifier("modifier_item_blade_mail_reflect")) {
		      let bkb = localHero.GetItem('item_black_king_bar', true);
		      if (bkb && bkb.CanCast()) {
			bkb.CastNoTarget();
		      }
		    }
		  }

		  let gale_force = localHero.GetAbilityByIndex(3);
		  let enemyPositions = {};
		  if (gale_force && gale_force.IsExist() && gale_force.CanCast()) {
		    enemies = localHero.GetHeroesInRadius(1000, Enum.TeamType.TEAM_ENEMY);
		    for (let enemy of enemies) {
		      let enemyId = enemy.GetPlayerID();
		      
		      let vec1 = localHero.GetAbsOrigin();
		      let vec2 = enemy.GetAbsOrigin();
		      let distance = vec1.sub(vec2).Length2D();
		       
		      if (distance <= 1000) {
		      // Actualizar la posición inicial del enemigo en cada iteración
		      enemyPositions[enemyId] = enemy.GetAbsOrigin();

		      // Calcular la dirección en la que el enemigo está viendo
		      let posINI = enemyPositions[enemyId];
		      //let posFIN = enemy.GetAbsOrigin();

	          if (Engine.OnceAt(0.2)) {
				posFIN = enemy.GetAbsOrigin();	      
		      }
			
		      if (posINI.x === posFIN.x && posINI.y === posFIN.y) {
				continue;
		      }

		      const enemyDirection = (posFIN.sub(posINI)).Normalized();

			enemyPositions[enemyId] = posFIN;
						
		        // Calcular la dirección opuesta
		        const enemyPosition = enemy.GetAbsOrigin();
		        const oppositeDirection = enemyDirection.mul(new Vector(-1, -1, -1));

		        // Lanzar Gale Force en la dirección opuesta desde la posición del héroe enemigo
		        let pushPosition = enemyPosition.add(oppositeDirection.mul(new Vector(100, 100, 0)));
				myPlayer.PrepareUnitOrders(30, null, enemyPosition, gale_force, Enum.PlayerOrderIssuer.DOTA_ORDER_ISSUER_HERO_ONLY, localHero);
				// Agregar condición para evitar lanzar gale force si el enemigo tiene activado bkb
				if (enemy.HasModifier("modifier_black_king_bar_immune") === false) {
				  gale_force.CastPosition(pushPosition);
				  setTimeout(function() {}, 300);
				}
		      }
		    }
		  }

		  // Agregar un if statement para verificar si el modificador "modifier_windrunner_focusfire" ha terminado
		  if (!modifiers.some(modifier => modifier.GetName() === 'modifier_windrunner_focusfire')) {
		    break;
		  }
		}
	      }
	    }
	  }
	};

	// Definición de la función OnScriptLoad
	AutoSaverWindrunner.OnScriptLoad = AutoSaverWindrunner.OnGameStart = () => {
	  localHero = EntitySystem.GetLocalHero();
	  myPlayer = EntitySystem.GetLocalPlayer();
	};

	// Definición de la función OnGameEnd
	AutoSaverWindrunner.OnGameEnd = () => {
	  localHero = null;
	};

	// Registro del script
	RegisterScript(AutoSaverWindrunner);


`);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/AutoSaverWindrunner.ts"]();
/******/ 	
/******/ })()
;
