/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/SpinnerMove.ts":
/*!**********************************!*\
  !*** ./src/SpinnerMove.ts ***!
  \**********************************/
/***/ (() => {

	// Definición del objeto SpinnerMove
	const SpinnerMove = {};

	// Declaración de la variable localHero
	let localHero = null;
	let myPlayer = null;
	
	let tick = 0;
	let trigerfor3 = 0;
	const pat = ["Custom Scripts","Utility"];

	const path = ["Custom Scripts","Utility","Spinner"];

	let isUiEnabled = Menu.AddToggle(path, 'Enable', false);
	
	let KeyBindSpinner = Menu.AddKeyBind(path, 'Key', Enum.ButtonCode.KEY_NONE);
	
	let SpinnerType = Menu.AddComboBox(path, 'Movement Type', ["One place","Сircle","Triger"], 1)
        .OnChange((state) => {SpinnerType = state.newValue;})
        .GetValue();
	
	
	Menu.SetImage(pat, 'panorama/images/rank_tier_icons/handicap/softsupporticon_psd.vtex_c');
	Menu.SetImage(path, 'panorama/images/control_icons/refresh_psd.vtex_c');

	SpinnerMove.OnDraw = () => {
        if (localHero && isUiEnabled.GetValue()) {
			
			if (KeyBindSpinner.IsKeyDown()) {
				if (SpinnerType === 0) {
					if (Engine.OnceAt(0.1)) {
						localHero.MoveTo(PositionAngle(localHero, 160, 3), false, false);
					}
				}
				if (SpinnerType === 1) {
					if (Engine.OnceAt(0.05)) {
						localHero.MoveTo(PositionAngle(localHero, 100, 100), false, false);
					}
				}
				if (SpinnerType === 2) {
					const minitable = [75, -120];
					if (Engine.OnceAt(0.1)) {
						localHero.MoveTo(PositionAngle(localHero, minitable[trigerfor3], 10), false, false);
						trigerfor3 = trigerfor3 + 1;
						if (trigerfor3 > 1) trigerfor3 = 0;
					}
				}
			}

		}
	};
	
	function PositionAngle(nps, rotation, range) {
		const angle = nps.GetRotation();
		const angleOffset = new Angle(0, 45 + rotation, 0);
		angle.yaw = angle.yaw + angleOffset.yaw;
		const [x, y, z] = getVectorsFromAngle(angle);
		const direction = x.add(y).add(z);
		direction.z = 0;
		direction.Normalized();
		direction.Scale(range);
		const origin = nps.GetAbsOrigin();
		const needPos = origin.add(direction);
		return needPos;
	}
	
	function getVectorsFromAngle(ang) {
		let rad = ang.yaw * Math.PI / 180;
		let forward = new Vector(Math.cos(rad), Math.sin(rad), 0);
		forward.Normalized();

		let right = forward.Cross(new Vector(0, 0, 1));
		right.Normalized();

		let up = right.Cross(forward);
		up.Normalized();

		return [forward, right, up];
	}
	
	// Definición de la función OnScriptLoad
	SpinnerMove.OnScriptLoad = SpinnerMove.OnGameStart = () => {
		localHero = EntitySystem.GetLocalHero();
	    myPlayer = EntitySystem.GetLocalPlayer();

	};

	// Definición de la función OnGameEnd
	SpinnerMove.OnGameEnd = () => {
		localHero = null;
	    myPlayer = null;
	};

	// Registro del script
	RegisterScript(SpinnerMove);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/SpinnerMove.ts"]();
/******/ 	
/******/ })()
;
