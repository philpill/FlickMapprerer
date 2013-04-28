var bigAssGlobalMarkerStoreForCausingMemoryLeaks = [];

(function(window, google) {
	'use strict';
	var map, infoWindow,
		markers = [],
		markersInfo = {};

	window.addPhotosOnMap = function(photosDetails) {
		var marker, i, len, photoDetails,
			displayInfo = function() {
				var html, list, t, tLen, tag,
					marker = this,
					markerInfo = markersInfo[marker.title];
				if (infoWindow) {
					infoWindow.close();
				}
				html = '<figure>';
				html += ('<img width="150px" height="150px" src="' + markerInfo.imageUrl + '" alt="' + markerInfo.heading + '" />');
				html += ('<figcaption><a href="' + markerInfo.url + '" title="' + markerInfo.heading + '">' + markerInfo.heading + '</a></figcaption>');
				html += '</figure>';
				html += '<div class="metadata">';
				html += ('<div>Uploaded by: <div class="owner">' +
					'<a href="http://www.flickr.com/photos/' + markerInfo.owner.nsid + '/">' +
					(markerInfo.owner.realname ? markerInfo.owner.realname : markerInfo.owner.username) +
					'</a></div></div>');
				if (markerInfo.tags) {
					list = '';
					for(t = 0, tLen = markerInfo.tags.length; t < tLen; t++) {
						tag = markerInfo.tags[t];
						if (tag.machine_tag !== '1') {
							list += ('<li><a href="http://www.flickr.com/photos/tags/' + tag.content + '">' +
								tag.raw + '</a></li>');
						}
					}
					if (list) {
						html += ('Tags: <ul class="tags">' + list + '</ul>');
					}
				}
				html += '</div>';

				infoWindow = new window.InfoBox({
					boxClass: 'infobox',
					content: html,
					disableAutoPan: false,
					maxWidth: 0,
					pixelOffset: new google.maps.Size(-200, 12),
					zIndex: null,
					closeBoxURL: 'http://www.google.com/intl/en_us/mapfiles/close.gif',
					infoBoxClearance: new google.maps.Size(1, 1),
					isHidden: false,
					pane: 'floatPane'
				});
				infoWindow.open(map, marker);
			};
		for(i = 0, len = photosDetails.length; i < len; i++) {
			photoDetails = photosDetails[i];
			if (!markersInfo[photoDetails.id]) {
				marker = new google.maps.Marker({
					animation: google.maps.Animation.DROP,
					position: new google.maps.LatLng(photoDetails.location.latitude, photoDetails.location.longitude),
					map: map,
					optimized: false,
					title: photoDetails.id
				});
				markersInfo[photoDetails.id] = {
					heading: (photoDetails.title ? photoDetails.title : '(Untitled)'),
					url: photoDetails.urls.url.content,
					imageUrl: 'http://farm' + photoDetails.farm + '.staticflickr.com/' +
						photoDetails.server + '/' + photoDetails.id + '_' + photoDetails.secret + '_q.jpg',
					owner: photoDetails.owner,
					tags: (photoDetails.tags ? photoDetails.tags.tag : null)
				};
				markers.push(marker);
				bigAssGlobalMarkerStoreForCausingMemoryLeaks.push({ marker: marker, id: photoDetails.id});
				google.maps.event.addListener(marker, 'click', displayInfo);
			}
		}
	};

	window.clearMap = function() {
		var i, len;
		for(i = 0, len = markers.length; i < len; i++) {
			markers[i].setMap(null);
		}
		markers = [];
		markersInfo = {};
		if (infoWindow) {
			infoWindow.close();
		}
		bigAssGlobalMarkerStoreForCausingMemoryLeaks = [];
	};

	function initialize() {
		var mapOptions = {
			center: new google.maps.LatLng(51.50, -0.12),
			mapTypeControl: false,
			mapTypeId: google.maps.MapTypeId.TERRAIN,
			maxZoom: 10,
			minZoom: 2,
			scrollwheel: false,
			streetViewControl: false,
			tilt: 45,
			zoom: 2
		};
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		google.maps.event.addListenerOnce(map, 'idle', window.getFlickrData);
	}
	google.maps.event.addDomListener(window, 'load', initialize);

}(window, window.google));