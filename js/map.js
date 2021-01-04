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
opnv_attrib = '<a href="https://memomaps.de/" > MeMoMaps</a> CC-BY-SA | '+ osm_attrib;

//Init map tile layers
var osm = L.tileLayer(osm_source, { maxZoom: 17, attribution:  osm_attrib}); 
var opentopo = L.tileLayer(opentopo_source, { maxZoom: 17, attribution:  opentopo_attrib}); 
var satellit = L.tileLayer(satellit_source, { maxZoom: 17, attribution:  satellit_attrib});
var opnv = L.tileLayer(opnv_source, { maxZoom: 17, attribution:  opnv_attrib});

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
		iconUrl:"foo.png",
	    iconSize: [33, 47],
	    iconAnchor: [16, 47],
	    popupAnchor:  [0, -50],
	    draggable: false,
	    riseOnHover: true
    }
});

//Init three instances of class template icon 
var icon_campside = new tmpl_icon({'iconUrl':'icons/house_icon.png'});
var icon_house = new tmpl_icon({'iconUrl':'icons/tent_icon.png'});
var icon_mixed = new tmpl_icon({'iconUrl':'icons/mixed_icon.png'});

//Init icon layer groups
var campside_house = new L.LayerGroup(),
    campside_yard = new L.LayerGroup();

/*****************
 * SETUP MARKERS *
 *****************/

//Add markers to layers
for (i in list_tent){
	L.marker([list_tent[i].coords.lat,list_tent[i].coords.lng], {icon : icon_campside})
	.bindPopup(list_tent[i].name)
	.on('mouseover', function (e) {this.openPopup(); })
	.on('mouseout', function (e) {this.closePopup(); })
	.on('click',   function(e) { updateSidebar(this._popup._content,1);}) //replace by this.sourcetarget.options.alt
	.addTo(campside_house);
}

for (j in list_house){
	L.marker([list_house[j].coords.lat,list_house[j].coords.lng], {icon : icon_house})
	.bindPopup(list_house[j].name)
	.on('mouseover', function (e) {this.openPopup(); })
	.on('mouseout', function (e) {this.closePopup(); })
	.on('click',   function(e) { updateSidebar(this._popup._content,1);}) //replace by this.sourcetarget.options.alt
	.addTo(campside_house);
}
for (k in list_mixed){
	L.marker([list_mixed[k].coords.lat,list_mixed[k].coords.lng], {icon : icon_mixed})
	.bindPopup(list_mixed[k].name)
	.on('mouseover', function (e) {this.openPopup(); })
	.on('mouseout', function (e) {this.closePopup(); })
	.on('click',   function(e) { updateSidebar(this._popup._content,1);}) //replace by this.sourcetarget.options.alt
	.addTo(campside_house);
}

 var list = Object.assign({}, list_mixed, list_house, list_tent);


//Create dicts for control box
var overlays = {
	"Lagerplatz mit Haus: " : campside_house,
	"Lagerplatz mit Wiese" : campside_yard
};

/**************************************
 * SETUP MAP AND MAP CONTROL ELEMENTS *
 **************************************/

//Init map
var campsides_map = L.map('map', {
	center: [48.1, 16.2],
	zoom: 13,
	minZoom: 6,
	attributionControl: true,
	zoomControl: false,
	measureControl: false,
	layers: [osm, campside_house,campside_yard]
});

//Add layers to map 
L.control.layers(baseLayers,overlays, {
	collapsed: true,
	position:'topright'
}).addTo(campsides_map);


//Create and add zoom controls 
L.control.zoom({
     position:'topright'
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

//Create and add left sidebar
var lft_sidebar = L.control.sidebar('sidebar' , {
	position: 'left'});
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
  	keys: ["name"]
};

//Init fuse search
var fuse = new Fuse(list_house, options);

/*****************************
 * LEAFLETJS RELVATED EVENTS *
 *****************************/

//Add pan effect to map in case left sidebar is opened
lft_sidebar.on('opening', function () {
	campsides_map.panBy([-200,0],{duration: 0.5});
});
//Add pan effect to map in case left sidebar is closed
lft_sidebar.on('closing', function () {
	campsides_map.panBy([200,0],{duration: 0.5});
});

/********************
 * CUSTOM FUNCTIONS *
 ********************/

//@function updateSidebar (String cs_name, Int prev_state{0,1})
//Update Sidebar after marker onclick-event 
function updateSidebar (cs_name,prev_state) {
	var index = list_table[cs_name];

	if (prev_state==0)
		campsides_map.flyTo([list[index].coords.lat,list[index].coords.lng],campsides_map.getZoom(),{duration: 2});

	lft_sidebar.open('home');

	document.getElementById("campside_name").innerHTML = list[index].name;
	document.getElementById("campside_desc").innerHTML = list[index].desc;
	document.getElementById("campside_website").href = list[index].website;
	document.getElementById("campside_addr").innerHTML = list[index].addr;
	document.getElementById("campside_koords").innerHTML = list[index].coords.lat + " " + list[index].coords.lng;
	document.getElementById("campside_tags").innerHTML = list[index].tag;
}

//@function openInMaps
//Open a new tab with Google Maps pointing towards the coords of the current location 
function openInMaps() {
	var name_cur = document.getElementById("campside_name").innerHTML;
	var index = list_table[name_cur];

	window.open("https://www.google.com/maps/place/" + list[index].coords.lat + "\°N" + list[index].coords.lng + "\°E", '_blank');
}

//@function updateSearch (String term)
//Updates the search results after every new input char
function updateSearch(term) {
	var answer = "";
	var results = fuse.search(term)
	
	for (i in results) {
		answer = answer +  "<p class=\"searchResult\" onclick=\"updateSidebar(this.innerHTML,0)\" >" + results[i].item.name+ "</p> ";
	}
	document.getElementById("search_results").innerHTML = answer;
}

