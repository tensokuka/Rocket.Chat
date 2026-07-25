import './meteor/overrides';
import './meteor/startup';
import './lib/sdk/ddpSdk';
import './serviceWorker';

// Mobile iOS fixes: disable pinch zoom and prevent input auto-zoom
if (typeof window !== 'undefined') {
	// Prevent pinch-to-zoom on iOS
	document.addEventListener('touchmove', (event) => {
		if ((event as TouchEvent).touches.length > 1) {
			event.preventDefault();
		}
	}, { passive: false });

	// Prevent double-tap zoom
	let lastTouchEnd = 0;
	document.addEventListener('touchend', (event) => {
		const now = Date.now();
		if (now - lastTouchEnd <= 300) {
			event.preventDefault();
		}
		lastTouchEnd = now;
	}, { passive: false });

	// Lock the viewport scale on iOS to prevent accidental zoom
	const viewport = document.querySelector('meta[name="viewport"]');
	if (viewport && viewport.hasAttribute('content')) {
		const currentContent = viewport.getAttribute('content') || '';
		if (!currentContent.includes('user-scalable=no')) {
			viewport.setAttribute('content', currentContent + ', user-scalable=no');
		}
	}
}

import('./meteor/login')
	.then(() => import('./importPackages'))
	.then(() => import('./startup'))
	.then(() =>
		Promise.all([import('./views/omnichannel'), import('./views/admin'), import('./views/marketplace'), import('./views/account')]),
	);
