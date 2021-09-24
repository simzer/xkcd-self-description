import Vizzu from 'https://cdn.jsdelivr.net/npm/vizzu@0.3.1/dist/vizzu.min.js';

let canvas = document.getElementById('slide3');
let width = canvas.width;
let height = canvas.height;

let data = {
	dimensions: [
		{ name: 'COLOR', values: ['BLACK', 'WHITE' ] },
		{ name: 'SLIDE', values: ['1','2','3'] }
	],
	measures: [
		{ name: 'AMOUNT', values: [ 
			[ 0, width * height ], 
			[ 0, width * height ], 
			[ 0, width * height ] ] }
	]
};

let style = {
	plot: { marker: { 
		colorPalette: '#000000 #ffffff',
		label: { fontWeight: 'normal' }
	}},
	title: { color: '#000000', fontSize: '2em'},
	logo: { filter: 'opacity(0)'}
};

let chart1 = new Vizzu('slide1', { 
	data: Object.assign({}, data),
	style
});
let chart2 = new Vizzu('slide2', { 
	data: Object.assign({}, data),
	style 
});

let anim1 = chart1.initializing;
let anim2 = chart2.initializing;

function drawFrame(ctx, w, h)
{
	ctx.beginPath();
	ctx.fillStyle = '#ffffff';
	ctx.strokeStyle = '#000000';
	ctx.lineWidth = w/320;
	ctx.rect(0, 0, w, h);
	ctx.fill();
	ctx.stroke();
	ctx.lineWidth = 0;
}

function drawCanvasFrame(canvas)
{
	let w = canvas.width;
	let h = canvas.height;

	let ctx = canvas.getContext('2d');
	drawFrame(ctx, w, h);
}

function draw3rdSlide()
{
	let w0 = document.getElementById('slide1').width;
	let h0 = document.getElementById('slide1').height;

	let canvas = new OffscreenCanvas(3*1.2 * w0, 3*1.2 * h0);
	drawCanvasFrame(canvas);

	let ctx = canvas.getContext('2d');
	ctx.filter = 'blur(1.5px)';

	ctx.drawImage(document.getElementById('slide1'), 0.1 * w0, 1.3*h0);
	ctx.drawImage(document.getElementById('slide2'), 1.3 * w0, 1.3*h0);
	ctx.drawImage(document.getElementById('slide3'), 2.5 * w0, 1.3*h0);

	let canvas3 = document.getElementById('slide3');
	canvas3.width = w0;
	canvas3.height = h0;

	let ctx3 = canvas3.getContext('2d');

	ctx3.drawImage(canvas, 0, 0, w0, h0);
	ctx.imageSmoothing = true;
	ctx.imageSmoothingQuality = "high";
	ctx3.fillStyle = '#000000';
	ctx3.font = '17px Roboto, Sans-serif';
	ctx3.fillText('LOCATION OF BLACK IN THIS IMAGE', 20, 25);
}

function getAmount(canvas)
{
    let context = canvas.getContext('2d');
    let data = context.getImageData(0, 0, canvas.width, canvas.height).data;
	let black = 0;
	let white = 0;
	for (let i = 0; i < data.length; i+=4)
	{
		let nonwhite = 
			data[i + 0] < 255 || data[i + 1] < 255 || data[i + 2] < 255;

		if (nonwhite) black++; else white++;
	}
	return { black, white };
}

anim1 = anim1.then(chart => 
{
	chart.on('background-draw', event => {
		let canvas = document.getElementById('slide1');
		drawFrame(event.renderingContext, canvas.width-1, canvas.height-1);
		event.preventDefault();
	});

	chart.on('plot-marker-draw', event => {
		event.renderingContext.strokeStyle = '#000000';
	});

	return chart.animate(
	{
		config: {
			channels: {
				x: [ 'COLOR', 'AMOUNT'],
				color: 'COLOR',
				label: 'COLOR'
			},
			title: 'FRACTION OF THIS IMAGE WHICH IS',
			coordSystem: 'polar',
			rotate: '-220deg'
		},
		style: {
			plot: { 
				marker: { 
					borderWidth: 1,
					label: {
						filter: 'color(#000000)',
						position: 'top',
						fontSize: '150%' 
					}
				},
				xAxis: { 
					label: { color: '#00000000' },
					title: { color: '#00000000' }
				}
			}
		}
	});
});

anim2 = anim2.then(chart => 
{
	chart.on('background-draw', event => {
		let canvas = document.getElementById('slide1');
		drawFrame(event.renderingContext, canvas.width-1, canvas.height-1);
		event.preventDefault();
	});

	return chart.animate(
	{
		data: { filter: record => record['COLOR'] == 'BLACK' },
		config: {
			channels: {
				y: { set: 'AMOUNT', title: ' '},
				x: 'SLIDE',
			},
			title: 'AMOUNT OF BLACK INK BY PANEL'
		},
		style: {
			plot: {
				yAxis: {
					interlacing: {
						color: '#00000000'
					}
				},
				xAxis: { 
					color: '#000000',
					label: { 
						color: '#000000',
						fontSize: '150%'
					},
				}
			}
		}
	});
});

let lastAmounts = [ 
	{ black: 0, white: width * height },
	{ black: 0, white: width * height },
	{ black: 0, white: width * height }
];

let step = () => 
{
	draw3rdSlide();

	let amounts = [
		getAmount(document.getElementById('slide1')),
		getAmount(document.getElementById('slide2')),
		getAmount(document.getElementById('slide3'))
	]

	let diffs = [
		amounts[0].white - lastAmounts[0].white,
		amounts[0].black - lastAmounts[0].black,
		amounts[1].white - lastAmounts[1].white,
		amounts[1].black - lastAmounts[1].black,
		amounts[2].white - lastAmounts[2].white,
		amounts[2].black - lastAmounts[2].black
	]

	let records = [
		[ 'WHITE', '1', diffs[0] ],
		[ 'BLACK', '1', diffs[1] ],
		[ 'WHITE', '2', diffs[2] ],
		[ 'BLACK', '2', diffs[3] ],
		[ 'WHITE', '3', diffs[4] ],
		[ 'BLACK', '3', diffs[5] ]
	];

	lastAmounts = amounts;

	anim1 = anim1.then(chart => chart.animate({ data: { records } }, '300ms'));
	anim2 = anim2.then(chart => chart.animate({ data: { records } }, '300ms'));

	Promise.all([ anim1, anim2 ]).then(step);
};

Promise.all([ anim1, anim2 ]).then(step);
