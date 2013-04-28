function getFlickrData(){
	var apikey = '[API_KEY]';

	var results = 500;

	var baseQuery = ("select * from flickr.photos.info where photo_id in (select id from flickr.photos.recent(" +
		results + ") where api_key='" + apikey +
		"' and extras='geo' and latitude!='0' and longitude!='0' and ispublic=1) and api_key='" + apikey + "'"
	);

	YUI().use('yql', 'node', 'transition', 'event', function (Y) {

		var filterText = Y.one('#filter-text');
		var filterForm = Y.one('.filter-form');
		var debugPause = Y.one('#pause');
		var counterText = Y.one('#counter');
		var debug = Y.one('#debug');
		var debugContainer = Y.one('#debug .message-container');
		var cursor = Y.one('#debug i');
		var debugLink = Y.one('#debug-link');
		var debugLinkArrow = Y.one('#debug-link-arrow');

		var newQuery = baseQuery;
		var intervalId;

		var refreshInterval = 15000;
		//var refreshInterval = 120000;

		var counter = refreshInterval;

		function refreshData() {
			resetCounter();
			Y.YQL(newQuery, processData);
		}

		function resetCounter() {
			clearInterval(counterId);
			counter = refreshInterval;
			startCounter();
		}

		var counterId;

		function startCounter() {
			return;
			counterId = setInterval(function(){
				counter-= 1000;
				counterText.set('innerHTML', 'Refreshing in ' + (counter / 1000) + ' seconds...');
			}, 1000);
		}

		function processData(data) {
			if (data && data.query && data.query.results && data.query.results.photo) {
				addPhotosOnMap(data.query.results.photo);
				loadDebug(data);
			}
		}

		var photosCount = 0;
		var debugIntervalId;
		var debugPaused = false;

		var cursorInterval = 400;
		var cursorId;
		function makeCursorBlinkLikeABoss() {
			//cursor
			if (cursor.getStyle('color') === 'black') {
				cursor.setStyle('color', '#090');
			} else {
				cursor.setStyle('color', 'black');
			}
		}

		function debugTiTleClick(e) {

			var YcurrentTarget = T.one(e.currentTarget);
			var id = YcurrentTarget.get('data-id');

			google.maps.event.trigger(markers[0], 'click');
		}

		function debugLinkClick(e) {
			e.preventDefault();
			debugPaused = !debugPaused;
			if (debugPaused) {
				clearInterval(cursorId);
				Y.one(e.currentTarget).setStyle('background-color', '#666');
			} else {
				cursorId = setInterval(makeCursorBlinkLikeABoss, cursorInterval);
				Y.one(e.currentTarget).setStyle('background-color', '#efefef');
			}
		}

		function loadDebug(data) {
			var created = data.query.created;
			var photos = data.query.results.photo;
			console.log(bigAssGlobalMarkerStoreForCausingMemoryLeaks);
			if (!debugPaused) {
				debugContainer.append('<p>' + created + '</p>');
			}
			photosCount = photos.length;
			for (var i = 0; i < photos.length; i++) {
				var photo = photos[i];
			}
			debugIntervalId = setInterval(function(){
				if (!debugPaused) {
					appendDebug(photos[photosCount--]);
				}
				if (photosCount === 0) { clearInterval(debugIntervalId); }
			}, refreshInterval/photosCount);
		}

		function appendDebug(photo) {
			if (photo) {
				debugContainer.append('<span><b><a href="http://www.flickr.com/photos/' + photo.owner.nsid + '">' + photo.owner.realname + '</a>:</b><a href="#" data-id="' + photo.id + '" class="open-popup"> ' + photo.title + '</a></span>' );
				debug.set('scrollTop', debug.get('scrollHeight'));
			}
		}

		function filterFormSubmit(e) {
			clearMap();
			var value = filterText.get('value');
			if (value.length > 0) {
				newQuery += (' and (title like "%' + value + '%" or tags.tag like "%' + value + '%")');
			} else {
				newQuery = baseQuery;
			}
			refreshData();
			startCounter();
			clearInterval(intervalId);
			intervalId = setInterval(refreshData, refreshInterval);
			e.preventDefault();
		}

		function toggleDebug(e) {

			e.preventDefault();

			//debug hide/show

			var height = 0;
			var newHeight = 0;
			var newOpacity = 0;
			console.log(debug.get('opacity'));
			var isOpen = (debug && debug.getStyle('opacity') !== '0');

			if (isOpen) {
				newHeight = '0px';
				newOpacity = '0';
				debugLinkArrow.addClass('arrow-up').removeClass('arrow-down');
			} else {
				newHeight = '400px';
				newOpacity = '1';
				debugLinkArrow.addClass('arrow-down').removeClass('arrow-up');
			}

			debug.transition({
				opacity: newOpacity,
				height: {
					duration: 0.75,
					easing: 'ease-out',
					value: newHeight
				}
			});
		}

		filterForm.on('submit', filterFormSubmit);
		debugPause.on('click', debugLinkClick);
		debugLink.on('click', toggleDebug);
		Y.delegate("click", debugTiTleClick, ".message-container", ".open-popup");
		refreshData();
		clearInterval(intervalId);
		intervalId = setInterval(refreshData, refreshInterval);
		cursorId = setInterval(makeCursorBlinkLikeABoss, cursorInterval);
	});
}
