/*************************
 * SETUP MAL TILE LAYERS *
 *************************/

//URL from map tile servers
osm_source = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
opentopo_source = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
satellit_source = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
opnv_source = 'http://tile.memomaps.de/tilegen/{z}/{x}/{y}.png';

//Attribution of map providers 
osm_attrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors CC-BY-SA';
opentopo_attrib = 'Kartendaten:' + osm_attrib + ' | Kartendarstellung: &copy;  <a href="https://opentopomap.org/about">OpenTopoMap</a> CC-BY-SA';
satellit_attrib = 'Map data &copy; Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
opnv_attrib = '<a href="https://memomaps.de/" > MeMoMaps</a> CC-BY-SA | ' + osm_attrib;

//Init map tile layers
var osm = L.tileLayer(osm_source, { maxZoom: 17, attribution: osm_attrib });
var opentopo = L.tileLayer(opentopo_source, { maxZoom: 17, attribution: opentopo_attrib });
var satellit = L.tileLayer(satellit_source, { maxZoom: 17, attribution: satellit_attrib });
var opnv = L.tileLayer(opnv_source, { maxZoom: 17, attribution: opnv_attrib });

//Combine map tile layer ins one dict
var baseLayers = {
	"OpenStreetMap": osm,
	"Open Topo": opentopo,
	"Satellit": satellit,
	"ÖPNV": opnv
};

/***************
 * SETUP ICONS *
 ***************/

//Create Template Icon Class
var tmpl_icon = L.Icon.extend({
	options: {
		iconUrl: "foo.png",
		iconSize: [33, 47],
		iconAnchor: [16, 47],
		popupAnchor: [0, -50],
		draggable: false,
		riseOnHover: true
	}
});

//Init three instances of class template icon 
var icon_campside = new tmpl_icon({ 'iconUrl': 'icons/tent_icon.png' });
var icon_house = new tmpl_icon({ 'iconUrl': 'icons/house_icon.png' });
var icon_mixed = new tmpl_icon({ 'iconUrl': 'icons/mixed_icon.png' });
var icon_jamboree = new tmpl_icon({ 'iconUrl': 'icons/jamboree_icon.png' });
var icon_jamborette = new tmpl_icon({ 'iconUrl': 'icons/jamborette_icon.png' });
var icon_poi = new tmpl_icon({ 'iconUrl': 'icons/poi_icon.png' });
var icon_circle = new tmpl_icon({ 'iconUrl': 'icons/circle_icon.png' });


//Init icon layer groups
var campside_house = new L.LayerGroup(),
	campside_yard = new L.LayerGroup(),
	campside_mixed = new L.LayerGroup(),
	campsite_jamboree = new L.LayerGroup(),
	campsite_jamborette = new L.LayerGroup(),
	marker_circles = new L.LayerGroup(),
	marker_poi = new L.LayerGroup();

/*****************
 * SETUP MARKERS *
 *****************/
var cathegory_types = ["tent", "house", "mixed", "jamboree", "jamborette"]
var layer_groups = [campside_yard, campside_house, campside_mixed, campsite_jamboree, campsite_jamborette];
var icon_list = [icon_campside, icon_house, icon_mixed, icon_jamboree, icon_jamborette];

var entry_id = 1;
for (elem in list_places) {
	var index = cathegory_types.indexOf(list_places[elem].cathegory);
	list_places[elem].id = entry_id;

	L.marker([list_places[elem].coords.lat, list_places[elem].coords.lng],
		{ icon: icon_list[index], alt: entry_id })
		.bindPopup(list_places[elem].name)
		.on('mouseover', function (e) { this.openPopup(); })
		.on('mouseout', function (e) { this.closePopup(); })
		.on('click', function (e) { updateSidebar(this._icon.alt, 1, 1); }) //this._popup._content//replace by this.sourcetarget.options.alt
		.addTo(layer_groups[index]);
	entry_id++;
}

//Create dicts for control box
var overlays = {
	"Lagerplatz mit Haus: ": campside_house,
	"Lagerplatz mit Zeltplatz": campside_yard,
	"Mixed": campside_mixed,
	"Jamborette" : campsite_jamborette,
	"Jamboree" : campsite_jamboree
};

/**************************************
 * SETUP MAP AND MAP CONTROL ELEMENTS *
 **************************************/
//Home point of view

var home = {
	lat: 47.5,
	lng: 14,
	zoom: 8
};


//Init map
var campsides_map = L.map('map', {
	center: [home.lat, home.lng],
	zoom: home.zoom,
	minZoom: 6,
	attributionControl: true,
	zoomControl: false,
	measureControl: false,
	dragging: true,
	layers: [osm, campside_house, campside_yard, campside_mixed, campsite_jamboree, campsite_jamborette]
});

//Add layers to map 
L.control.layers(baseLayers, overlays, {
	collapsed: true,
	position: 'topright'
}).addTo(campsides_map);

//Add special marker layers to map
campsides_map.addLayer(marker_circles);
campsides_map.addLayer(marker_poi);
geoJSONLayer = L.geoJSON().addTo(campsides_map);


//Create and add zoom controls 
L.control.zoom({
	position: 'topright'
}).addTo(campsides_map);

//Create and add scale controls
L.control.scale({
	metric: true,
	imperial: false,
}).addTo(campsides_map);

//Create and add measure controls
L.control.measure({
	position: 'topright',
	activeColor: '#fc5e03',
	completedColor: '#fc0303',
	primaryLengthUnit: 'meters',
	secondaryLengthUnit: 'kilometers',
	primaryAreaUnit: 'sqmeters',
	secondaryAreaUnit: undefined
}).addTo(campsides_map);

//Add home button
L.easyButton('fas fa-home', function(btn, map){
	map.setView(new L.LatLng(home.lat, home.lng), home.zoom, );
	}, {
	position: 'topright'
}).addTo( campsides_map );

//Create and add left sidebar
var lft_sidebar = L.control.sidebar('sidebar', {
	position: 'left'
});
lft_sidebar.addTo(campsides_map);

/***********************
 * SETUP FUSEJS SEARCH *
 ***********************/

//Define options for fuse search
var options = {
	isCaseSensitive: false,
	includeScore: true,
	shouldSort: true,
	findAllMatches: true,
	minMatchCharLength: 3,
	threshold: 0.5,
	keys: ["name", "tag", "postal code", "state", "country"]
};

//Init fuse search
var fuse = new Fuse(list_places, options);

/*****************************
 * LEAFLETJS RELVATED EVENTS *
 *****************************/

//Add pan effect to map in case left sidebar is opened
lft_sidebar.on('opening', function () {
	campsides_map.panBy([-200, 0], { duration: 0.5 });
});
//Add pan effect to map in case left sidebar is closed
lft_sidebar.on('closing', function () {
	campsides_map.panBy([200, 0], { duration: 0.5 });
});

/********************
 * CUSTOM FUNCTIONS *
 ********************/

var cur_camp_url = "";
//@function updateSidebar (String cs_name, Int prev_state{0,1}, Int opensidebar{0,1})
//Update Sidebar after marker onclick-event 
function updateSidebar(index, prev_state, opensidebar) {
	var cur_entry = list_places[--index];
	if (opensidebar == 1){
		if (prev_state == 0)
			campsides_map.flyTo([cur_entry.coords.lat, cur_entry.coords.lng], 12, { duration: 2 });
		lft_sidebar.open('home');
	}
	document.getElementById("campside_name").innerHTML = cur_entry.name;
	document.getElementById("campside_desc").innerHTML = cur_entry.desc;
	cur_camp_url = cur_entry.website;
	document.getElementById("campside_addr").innerHTML = "<i class=\"fas fa-home\"></i> " +cur_entry.addr;
	document.getElementById("campside_addr2").innerHTML = "&nbsp; &nbsp; &nbsp;" +cur_entry.postalcode;
	document.getElementById("campside_addr3").innerHTML = "&nbsp; &nbsp; &nbsp;"+ cur_entry.state + " - " + cur_entry.country;
	document.getElementById("campside_koords").innerHTML = "<i class=\"fas fa-map-marker-alt\"></i> " + cur_entry.coords.lat + " " + cur_entry.coords.lng;
	document.getElementById("campside_img").src = "./img-entries/" + cur_entry.imgsrc;
	var tag_array = cur_entry.tag.trim().split(",");
	var tag_str = "<i class=\"fas fa-hashtag\"></i> ";
	for (tag in tag_array){
		tag_str += "<span class=\"tag_link\" onclick=\"openTagInSearch(this.innerHTML)\" >" + tag_array[tag] + "</span>, ";
	}
	document.getElementById("campside_tags").innerHTML = tag_str.substring(0, tag_str.length-2);

}

function openTagInSearch(tag) {
	console.log(tag);
	lft_sidebar.open('search');
	document.getElementById("globalsarch").value = tag;
	updateSearch(tag);

}

//@function openInMaps
//Open a new tab with Google Maps pointing towards the coords of the current location 
function openInMaps() {
	var coords_cur = document.getElementById("campside_koords").innerHTML;

	coords_cur = coords_cur.split(" ");
	window.open("https://www.google.com/maps/place/" + coords_cur[0] + "\°N" + coords_cur[1] + "\°E", '_blank');
}

function openWebsite(){
	console.log(cur_camp_url);
	window.open(cur_camp_url, '_blank');
}

//@function updateSearch (String term)
//Updates the search results after every new input char
function updateSearch(term) {
	var answer = "";
	var results = fuse.search(term)

	for (i in results) {
		answer = answer + "<p id=\" " + results[i].item.id + " \" class=\"searchResult\" onclick=\"updateSidebar(this.id,0, 1)\" >" + results[i].item.name + "</p> ";
	}
	document.getElementById("search_results").innerHTML = answer;
}

//@function searchRadius()
//Creates/removes draggable search radius and marker on map
function searchRadius() {
	var radius_des = document.getElementById("search-radius").value * 1000;

	if (marker_circles.getLayers() == 0) {

		var circle = L.circle(campsides_map.getCenter(), {
			color: 'gray',
			draggable: true,
			autoPan: true,
			fillOpacity: 0.5,
			radius: radius_des
		}).addTo(marker_circles);

		var circle_center = L.marker(campsides_map.getCenter(), {
			draggable: true,
			icon: icon_circle
		}).on('move', function (e) { circle.setLatLng(e.latlng); })
			.addTo(marker_circles);
		document.getElementById("search-status").value = "Ursprung entfernen";
	}
	else {
		document.getElementById("search-status").value = "Ursprung setzen";
		marker_circles.clearLayers();
	}
}

//function setSearchRadius(number radius)
function setSearchRadius(radius) {
	marker_circles.getLayers()[0].setRadius(radius * 1000);
}

var poiCounter = 1;
function setPoi() {

	var labelTxt = document.getElementById("label_new_poi").value;
	if (labelTxt == "")
		labelTxt = "POI " + poiCounter;
	var poi = L.marker(campsides_map.getCenter(), {
		draggable: true,
		autoPan: true,
		icon: icon_poi
	}).bindPopup(labelTxt)
	.on('mouseover', function (e) { this.openPopup(); })
	.on('mouseout', function (e) { this.closePopup(); })
	.on('dblclick', function (e) { this.remove(); })
	.addTo(marker_poi);
	poiCounter++;
}

function deleteAllPoi() {
	marker_poi.clearLayers();
	poiCounter = 1;

}

function updateStateHighlight(state) {
	geoJSONLayer.clearLayers();
	var states_codes = [ "vab", "trl", "vie", "ooe", "noe", "stm", "sbg", "ktn", "bgl"];
	if (state != "all"){
		var index = states_codes.indexOf(state);
		geoJSONLayer.addData(state_geojson.features[index]);
	}
	
}


function submitFeedback(){
	var feedback = document.getElementById("feedback_text").value;
	var contact = document.getElementById("feedback_contact").value;
	var url = "https://api.thingspeak.com/update";
	var apikey = "ICV74V58AY76KFGF";
	var data = "apikey=" + apikey + "&field1=" + feedback + "&field2=" + contact;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.send(data);

	lft_sidebar.close();
	document.getElementById("feedback_text").value = "";
	document.getElementById("feedback_contact").value = "";

	alert("Abgesendet!");

}

function exportDesiredDatapoints() {
	var pdf = new jsPDF('p', 'pt', 'letter');
	
	pdf.save('test.pdf');
}