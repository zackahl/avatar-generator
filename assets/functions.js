// Particles ------------------------------------------------------------------------------

window.onload = function () {
	particlesJS("particles-js", {
		"particles": {
			"number": {
				"value": 40,
				"density": {
					"enable": true,
					"value_area": 800
				}
			},
			"color": {
				"value": "#5083b7"
			},
			"shape": {
				"type": "polygon",
				"stroke": {
					"width": 0,
					"color": "#000000"
				},
				"polygon": {
					"nb_sides": 4
				}
			},
			"opacity": {
				"value": 0.5,
				"random": false,
				"anim": {
					"enable": false,
					"speed": 1,
					"opacity_min": 0.1,
					"sync": false
				}
			},
			"size": {
				"value": 3,
				"random": true,
				"anim": {
					"enable": false,
					"speed": 40,
					"size_min": 0.1,
					"sync": false
				}
			},
			"line_linked": {
				"enable": false,
				"distance": 150,
				"color": "#ffffff",
				"opacity": 0.4,
				"width": 1
			},
			"move": {
				"enable": true,
				"speed": 6,
				"direction": "top",
				"random": true,
				"straight": true,
				"out_mode": "out",
				"bounce": false,
				"attract": {
					"enable": false,
					"rotateX": 600,
					"rotateY": 1200
				}
			}
		},
		"interactivity": {
			"detect_on": "canvas",
			"events": {
				"onhover": {
					"enable": false,
					"mode": "repulse"
				},
				"onclick": {
					"enable": false,
					"mode": "push"
				},
				"resize": true
			},
			"modes": {
				"grab": {
					"distance": 400,
					"line_linked": {
						"opacity": 1
					}
				},
				"bubble": {
					"distance": 400,
					"size": 40,
					"duration": 2,
					"opacity": 8,
					"speed": 3
				},
				"repulse": {
					"distance": 200,
					"duration": 0.4
				},
				"push": {
					"particles_nb": 4
				},
				"remove": {
					"particles_nb": 2
				}
			}
		},
		"retina_detect": true
	});
};

// -- Source code (https://github.com/download13/blockies) --------------------------------

(function () {
	var randseed = 0;

	function seedrand(s) {
		randseed = 0;
		for (var i = 0; i < s.length; i += 2) {
			var h = (s.charCodeAt(i) << 8) | s.charCodeAt(i + 1);
			randseed ^= h;
		}
		console.log(randseed);
	}

	function rand() {
		var n = (Math.sin(randseed++) + 1) / 2; // Move range from -1 - 1 to 0 - 1
		var r = n * 10000; // Remove first few digits since they tend to have low entropy
		n = r - Math.floor(r);
		return n;
	}

	function createColor() {
		var h = Math.floor(rand() * 360);
		var s = ((rand() * 50) + 50) + '%';
		var l = ((rand() * 60) + 20) + '%';

		var color = 'hsl(' + h + ',' + s + ',' + l + ')';
		return color;
	}

	function createImageData(size) {
		var width = size; // Only support square icons for now
		var height = size;

		var dataWidth = Math.ceil(width / 2);
		var mirrorWidth = width - dataWidth;

		var data = [];
		for (var y = 0; y < height; y++) {
			var row = [];
			for (var x = 0; x < dataWidth; x++) {
				row[x] = rand() >= 0.5;
			}
			var r = row.slice(0, mirrorWidth);
			r.reverse();
			row = row.concat(r);

			for (var i = 0; i < row.length; i++) {
				data.push(row[i]);
			}
		}
		return data;
	}

	function createCanvas(imageData, color, scale, bgcolor) {
		var c = document.createElement('canvas');
		var width = Math.sqrt(imageData.length);
		c.width = c.height = width * scale;

		var cc = c.getContext('2d');
		cc.fillStyle = bgcolor;
		cc.fillRect(0, 0, c.width, c.height);
		cc.fillStyle = color;

		for (var i = 0; i < imageData.length; i++) {
			var row = Math.floor(i / width);
			var col = i % width;

			if (imageData[i]) {
				cc.fillRect(col * scale, row * scale, scale, scale);
			}
		}
		return c;
	}

	function createIcon(opts) {
		opts = opts || {};
		var size = opts.size || 10;
		var scale = opts.scale || 5;
		var seed = opts.seed || Math.random().toString(36).substr(2);
		var bgcolor = opts.bgcolor || '#fff';

		seedrand(seed);

		var color = opts.color || createColor();
		var imageData = createImageData(size);
		var canvas = createCanvas(imageData, color, scale, bgcolor);

		return canvas;
	}

	window.blockies = {
		create: createIcon
	};
})();

// My Additions ---------------------------------------------------------------------------

// Get current year for copyright
$(document).ready(function () {
	var date = new Date();
	var year = date.getFullYear();
	document.getElementById("year").innerHTML = year;
})

// Generate avatar
var generate = function () {

	// Initialise variables
	var seed = $("#username").val(); // unique value
	var color = $("#color").val(); // avatar color
	var bgcolor = $("#bgcolor").find("input:checked").val(); // background color
	var size = $("#pixels").find("input:checked").val(); // number of pixels ^ 2
	var scale = $("#scale").find("input:checked").val(); // size of pixels

	// Clear avatar 
	$("#avatar").empty();

	// Set avatar options
	var icon = blockies.create({
		seed: seed,
		color: color,
		bgcolor: bgcolor,
		size: size,
		scale: scale
	});

	// Display generated avatar    
	$("#avatar").append(icon);

	// Display avatar dimensions
	var dimensions = size * scale + " × " + size * scale;
	$("#dimensions").html(dimensions);

	// Display download button    
	$("#avatar > canvas").attr("id", "mycanvas");
	if ($("#avatar:not(:empty)")) {
		var canvas = $("#mycanvas").get(0);
		var link = document.createElement('a');
		link.innerHTML = 'Download';
		link.addEventListener('click', function (ev) {
			link.href = canvas.toDataURL();
			link.download = "avatar.png";
		}, false);
		$("#download").empty().append(link);
		$("#download > a").addClass("btn btn-primary");
	}
};

// Generate avatar on page load
generate();

// Generate avatar on enter key press
$('#username').on('keyup', function (e) {
	if (e.keyCode == 13) {
		generate();
	}
});

// Generate avatar on click
$("#generate").on('click', function () {
	generate();
});

// Update avatar on input change
$("input").change(function () {
	generate();
});
