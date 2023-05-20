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

	// Definición del array path_
	const path_ = ['Heroes', 'Intelligence', 'Windranger'];

	// Creación del toggle isUiEnabled
	let isUiEnabled = Menu.AddToggle(path_, 'Gale Force Use', true);
	isUiEnabled.SetImage('panorama/images/spellicons/windrunner_gale_force_png.vtex_c');

	// Definición de la función OnUpdate
	let previousEnemyPositions = {};
	let bkbEnemies = {};
	//===============================
	AutoSaverWindrunner.OnUpdate = () => {
	  if (localHero && isUiEnabled) {
	    if (localHero.GetUnitName() !== "npc_dota_hero_windrunner")
	      return;
	    const modifiers = localHero.GetModifiers();
	    for (let modifier of modifiers) {
	      if (modifier.GetName() === 'modifier_windrunner_focusfire') {
		const remainingTime = modifier.GetRemainingTime();
		if (remainingTime <= 20) {
		  // Nueva condición para activar winrun siempre
		  let windrun = localHero.GetAbilityByIndex(2);
		  if (windrun && windrun.IsExist() && windrun.CanCast()) {
		    windrun.CastNoTarget();
		  }
		  // Nueva condición para activar BKB si el enemigo tiene activado Blade Mail
		  let enemies = localHero.GetHeroesInRadius(1000, Enum.TeamType.TEAM_ENEMY);
		  for (let enemy of enemies) {
		    if (enemy.HasModifier("modifier_item_blade_mail_reflect")) {
		      let bkb = localHero.GetItem('item_black_king_bar', true);
		      if (bkb && bkb.CanCast()) {
			bkb.CastNoTarget();
		      }
		    }
		  }

		  let gale_force = localHero.GetAbilityByIndex(3);
		  if (gale_force && gale_force.IsExist() && gale_force.CanCast()) {
		    enemies = localHero.GetHeroesInRadius(1000, Enum.TeamType.TEAM_ENEMY);
		    for (let enemy of enemies) {
		      let enemyId = enemy.GetPlayerID();
		      let isAttacking = enemy.IsAttacking() && enemy.GetAttackTarget() === localHero;
		      let currentPosition = enemy.GetAbsOrigin();
		      let isEscaping = false;

		      if (previousEnemyPositions[enemyId]) {
			let previousPosition = previousEnemyPositions[enemyId];
			let distanceMoved = currentPosition.sub(previousPosition).Length2D();
			isEscaping = distanceMoved > 0 && !isAttacking;
		      }

		      previousEnemyPositions[enemyId] = currentPosition;

		      let vec1 = localHero.GetAbsOrigin();
		      let vec2 = enemy.GetAbsOrigin();
		      let distance = vec1.sub(vec2).Length2D();

		      if (distance <= 1000) {
			let pushDirection;
			if (isAttacking) {
			  pushDirection = vec2.sub(vec1).Normalized();
			} else if (isEscaping) {
			  pushDirection = vec1.sub(vec2).Normalized();
			} else {
			  continue;
			}

			// Agregar condición para evitar lanzar gale force si el enemigo tiene activado bkb
			if (enemy.HasModifier("modifier_black_king_bar_immune") === false) {
			  gale_force.CastPosition(vec1.add(pushDirection));
			} else {
			  // Guardar información del enemigo con BKB activado
			  bkbEnemies[enemyId] = {
			    enemy: enemy,
			    endTime: GameRules.GetGameTime() + enemy.FindModifierByName("modifier_black_king_bar_immune").GetRemainingTime()
			  };
			}
		      }
		    }
		  }
		}
	      }
	    }

	    // Verificar si los enemigos con BKB activado han terminado el modificador
	    for (let enemyId in bkbEnemies) {
	      let enemyInfo = bkbEnemies[enemyId];
	      let enemy = enemyInfo.enemy;
	      let endTime = enemyInfo.endTime;
	      if (GameRules.GetGameTime() >= endTime) {
		let gale_force = localHero.GetAbilityByIndex(3);
		if (gale_force && gale_force.IsExist() && gale_force.CanCast()) {
		  let vec1 = localHero.GetAbsOrigin();
		  let vec2 = enemy.GetAbsOrigin();
		  let pushDirection = vec2.sub(vec1).Normalized();
		  gale_force.CastPosition(vec1.add(pushDirection));
		}
		delete bkbEnemies[enemyId];
	      }
	    }
	  }
	};
	// Definición de la función OnScriptLoad
	AutoSaverWindrunner.OnScriptLoad = AutoSaverWindrunner.OnGameStart = () => {
	  localHero = EntitySystem.GetLocalHero();
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
