// Get the root element
var root = document.querySelector(':root');

var colorWheel = iro.ColorPicker("#colorWheelDemo", {
  width: 200, //colorWheelWid
  color: '#fff',
  padding: 10,
  handleRadius: 8,
  handleOrigin: {
    x: 0,
    y: 0
  },
  wheelLightness: true,
  wheelAngle: 0, // starting angle
  wheelDirection: 'anticlockwise', // clockwise/anticlockwise
  sliderHeight: undefined,
  sliderMargin: 12,
  display: 'block', // CSS display value
});

colorWheel.on('input:change', function(color, changes){
  var newColor = color.hexString;
  root.style.setProperty('--color_main', newColor);
  document.cookie = "color=" + newColor;
  //TODO Shift Accent color properly 
});

function resetColor(color) {
  root.style.setProperty('--color_main', "#13803e");
  root.style.setProperty('--color_accent', "#0a4521");
  document.cookie = "color=#13803e";
}

