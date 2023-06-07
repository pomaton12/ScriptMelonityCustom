/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/AutoStealKunkka.ts":
/*!******************************!*\
  !*** ./src/AutoStealKunkka.ts ***!
  \******************************/
/***/ (() => {

eval(`
	const AutoStealKunkka = {};
	let local;
	let localPlayer;
	let TorrentStorm;
	let TidalWave;
	let enemyHeroes;
	let torrentStormTimer = null;
	let lastUltimateCastTime = 0;
	let tidalWaveCastAfterUltimate = false;

	const path_ = ['Heroes', 'Strength', 'Kunkka'];
	let isUiEnabled1 = Menu.AddToggle(path_, 'Torrent Storm Use', true);
	isUiEnabled1.SetImage('panorama/images/spellicons/kunkka_torrent_storm_png.vtex_c');

	let isUiEnabled2 = Menu.AddToggle(path_, 'Tidal Wave Use', true);
	isUiEnabled2.SetImage('panorama/images/spellicons/kunkka_tidal_wave_png.vtex_c');

	AutoStealKunkka.OnUpdate = () => {
		if (localHero && isUiEnabled1.GetValue()) {
			// Verifica si el héroe local es Kunkka
			if (localHero.GetUnitName() !== "npc_dota_hero_kunkka")
				return;

			// Si no se ha inicializado TorrentStorm, obtén la habilidad Torrent Storm de Kunkka
			if (!TorrentStorm) {
				TorrentStorm = localHero.GetAbilityByIndex(3);
			}

			// Obtén la habilidad ultimate de Kunkka (Ghostship)
			const Ghostship = localHero.GetAbilityByIndex(5);

			// Verifica si el ultimate de Kunkka está en cooldown y si no hay un temporizador activo
			if (Ghostship && Ghostship.GetCooldown() > 0 && !torrentStormTimer) {
				// Genera un tiempo aleatorio entre 0 y 3000 milisegundos (3 segundos)
				const randomDelay = Math.floor(Math.random() * 3000);

				// Establece un temporizador para activar Torrent Storm dentro de los 3 segundos después
				torrentStormTimer = setTimeout(() => {
					// Si Torrent Storm se puede lanzar, actívalo
					if (TorrentStorm.CanCast()) {
						TorrentStorm.CastPosition(localHero.GetAbsOrigin());
					}
					// Limpia el temporizador
					clearTimeout(torrentStormTimer);
					torrentStormTimer = null;
				}, randomDelay);
			}
		}
		
		if (localHero && isUiEnabled2.GetValue()) {
			if (localHero.GetUnitName() !== "npc_dota_hero_kunkka")
				return;

			let TidalWave = localHero.GetAbilityByIndex(4);
			if (!TidalWave || localHero.HasModifier("modifier_item_invisibility_edge_windwalk") || localHero.HasModifier("modifier_item_silver_edge_windwalk")) {
				return;
			}

			const localHeroHealthPercentage = (localHero.GetHealth() / localHero.GetMaxHealth()) * 100;
			const localHeroPosition = localHero.GetAbsOrigin();
			const enemyHeroes = EntitySystem.GetHeroesList().filter(hero => hero.GetTeamNum() !== localHero.GetTeamNum() && hero.IsAlive() && !hero.HasModifier("modifier_black_king_bar_immune") && localHeroPosition.Distance(hero.GetAbsOrigin()) <= 749);
			const closestEnemyHero = enemyHeroes.reduce((closest, hero) => closest ? (localHeroPosition.Distance(hero.GetAbsOrigin()) < localHeroPosition.Distance(closest.GetAbsOrigin()) ? hero : closest) : hero, null);

			if (closestEnemyHero && TidalWave.CanCast() && !tidalWaveCastAfterUltimate) {
				const enemyHeroPosition = closestEnemyHero.GetAbsOrigin();
				const Idealdirection = (enemyHeroPosition.sub(localHeroPosition)).Normalized();

				console.log("enemi = ",Idealdirection);
				
				if (localHeroHealthPercentage < 30) {
					let IdealPosition = localHeroPosition.add(Idealdirection.mul(new Vector(300, 300, 0)));
					TidalWave.CastPosition(IdealPosition);
				} else {
					let IdealPosition = localHeroPosition.add(Idealdirection.mul(new Vector(-300, -300, 0)));
					TidalWave.CastPosition(IdealPosition);
				}
				tidalWaveCastAfterUltimate = true;
			}

			const ultimateAbility = localHero.GetAbilityByIndex(5);
			if (ultimateAbility && ultimateAbility.IsActivated() && TidalWave.CanCast()) {
				const currentTime = GameRules.GetGameTime();
				if (currentTime - lastUltimateCastTime > 3.1) {
					tidalWaveCastAfterUltimate = false;
					lastUltimateCastTime = currentTime;
				}
			}
		}

	};

	AutoStealKunkka.OnScriptLoad = AutoStealKunkka.OnGameStart = () => {
		localPlayer = EntitySystem.GetLocalPlayer();
		localHero = EntitySystem.GetLocalHero();
	};

	AutoStealKunkka.OnGameEnd = () => {
		localPlayer = null;
		localHero = null;
		TorrentStorm = null;
		TidalWave = null;

	};

	RegisterScript(AutoStealKunkka);
`);
/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/AutoStealKunkka.ts"]();
/******/ 	
/******/ })()
;
