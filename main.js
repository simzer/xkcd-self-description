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
	fontFamily: 'xkcd-script',
	plot: { 
		marker: { 
			colorPalette: '#000000 #ffffff',
			label: { fontWeight: 'normal' }
		},
		paddingBottom: '4em'
	},
	title: { 
		paddingTop: '1em',
		color: '#000000', 
		fontSize: '2em'
	},
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

function drawFrame(ctx, w, h, fill = true)
{
	if (fill) {
		ctx.beginPath();
		ctx.fillStyle = '#ffffff';
		ctx.rect(0, 0, w, h);
		ctx.fill();
	}

	ctx.beginPath();
	ctx.fillStyle = '#ffffff';
	ctx.strokeStyle = '#000000';
	let lw = 1.5*w/320;
	ctx.lineWidth = lw;
	ctx.rect(lw/2, lw/2, w-lw, h-lw);
	if (fill) ctx.fill();
	ctx.stroke();
	ctx.lineWidth = 0;
}

function drawCanvasFrame(canvas, fill = true)
{
	let w = canvas.width;
	let h = canvas.height;

	let ctx = canvas.getContext('2d');
	ctx.translate(0.5, 0.5);
	drawFrame(ctx, w-1, h-1, fill);
}

function draw3rdSlide()
{
	let canvas1 = document.getElementById('slide1');
	let w0 = canvas1.width;
	let h0 = canvas1.height;

	canvas = document.createElement('CANVAS');
	canvas.width = 1.2*3*1.075 * w0;
	canvas.height = 1.2*3*1.075 * h0;
	//let canvas = new OffscreenCanvas(1.2*3*1.075 * w0, 1.2*3*1.075 * h0);

	let ctx = canvas.getContext('2d');

	ctx.beginPath();
	ctx.fillStyle = '#ffffff';
	ctx.rect(0, 0, canvas.width, canvas.height);
	ctx.fill();

	ctx.filter = 'blur(1.5px)';

	ctx.drawImage(document.getElementById('slide1'), 0.35 * w0, 1.6*h0);
	ctx.drawImage(document.getElementById('slide2'), 1.43 * w0, 1.6*h0);
	ctx.drawImage(document.getElementById('slide3'), 2.51 * w0, 1.6*h0);

	let canvas3 = document.getElementById('slide3');

	canvas3.width = w0;
	canvas3.height = h0;

	let f = w0/320;

	let ctx3 = canvas3.getContext('2d');

	ctx3.beginPath();
	ctx3.fillStyle = '#ffffff';
	ctx3.rect(0, 0, w0, h0);
	ctx3.fill();

	ctx3.drawImage(canvas, 0, 0, w0, h0);
	ctx.imageSmoothing = true;
	ctx.imageSmoothingQuality = "high";
	ctx3.fillStyle = '#000000';
	ctx3.font = `${18*f}px xkcd-script`;
	ctx3.fillText('LOCATION OF BLACK INK IN THIS IMAGE:', 16 * f, 32 * f);

	ctx.strokeStyle = '#000000';
	let lw = 2 * f;
	ctx.lineWidth = lw;

	ctx3.beginPath();
	ctx3.moveTo(17.5 * f, 90 * f);
	ctx3.lineTo(20 * f, 80 * f);
	ctx3.lineTo(22.5 * f, 90 * f);
	ctx3.moveTo(20 * f, 80 * f);
	ctx3.lineTo(20 * f, 170 * f);
	ctx3.lineTo(310 * f, 170 * f);
	ctx3.moveTo(300 * f, 167.5 * f);
	ctx3.lineTo(310 * f, 170 * f);
	ctx3.lineTo(300 * f, 172.5 * f);
	ctx3.moveTo(30 * f, 166 * f);
	ctx3.lineTo(30 * f, 174 * f);
	ctx3.moveTo(16 * f, 160 * f);
	ctx3.lineTo(24 * f, 160 * f);
	ctx3.stroke();

	ctx3.font = `${10*f}px xkcd-script`;
	ctx3.fillText('0', 8 * f, 164*f);
	ctx3.fillText('0', 27 * f, 184*f);

	ctx.lineWidth = 0;

	drawCanvasFrame(canvas3, false);
}

anim1 = anim1.then(chart => 
{
	chart.on('background-draw', event => {
		let canvas = chart.render.offscreenCanvas;
		drawFrame(event.renderingContext, 
			(canvas.width-1)/window.devicePixelRatio, 
			(canvas.height-1)/window.devicePixelRatio);
		event.preventDefault();
	});

	chart.on('plot-marker-draw', event => {
		event.renderingContext.strokeStyle = '#000000';
		event.renderingContext.lineWidth = 2;
	});

	chart.on('update', () => {
		draw3rdSlide();
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
			rotate: '-210deg'
		},
		style: {
			plot: { 
				paddingRight: 0,
				paddingLeft: 0,
				paddingTop: '6%',
				paddingBottom: '7%',
				marker: { 
					borderWidth: 1,
					label: {
						filter: 'color(#000000)',
						position: 'top',
						fontSize: '170%' 
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
		drawFrame(event.renderingContext, 
			(canvas.width-1)/window.devicePixelRatio, 
			(canvas.height-1)/window.devicePixelRatio);
		event.preventDefault();
	});

	chart.on('plot-axis-draw', event => {
		event.renderingContext.lineWidth = 1.5;
	});

	return chart.animate(
	{
		data: { filter: record => record['COLOR'] == 'BLACK' },
		config: {
			channels: {
				y: { set: 'AMOUNT', title: ' ', range: { max: '100%' }},
				x: 'SLIDE',
			},
			title: 'AMOUNT OF BLACK INK BY PANEL'
		},
		style: {
			plot: {
				marker: {
					rectangleSpacing: 1.6
				},
				yAxis: {
					interlacing: {
						color: '#00000000'
					}
				},
				xAxis: { 
					color: '#000000',
					label: { 
						color: '#000000',
						fontSize: '180%',
						paddingTop: '1em'
					},
				}
			}
		}
	});
});


function getAmount(canvas)
{
    let context = canvas.getContext('2d');
    let data = context.getImageData(0, 0, canvas.width, canvas.height).data;
	let black = 0;
	let white = 0;
	for (let i = 0; i < data.length; i+=4)
	{

		let nonwhite = 
			(data[i + 0] + data[i + 1] + data[i + 2])/3 < 128;

		if (nonwhite) black++; else white++;
	}
	return { black, white };
}

let lastAmounts = [ 
	{ black: 0, white: width * height },
	{ black: 0, white: width * height },
	{ black: 0, white: width * height }
];

let step = () => 
{
	let amounts = [
		getAmount(document.getElementById('slide1')),
		getAmount(document.getElementById('slide2')),
		getAmount(document.getElementById('slide3'))
	];

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

	anim1 = anim1.then(chart => chart.animate({ data: { records } }, {
		duration: '150ms',
		easing: 'ease-in'
	}));
	anim2 = anim2.then(chart => chart.animate({ data: { records } }, {
		duration: '150ms',
		easing: 'ease-out'
	}));

	let diffSum = 0;
	for (let diff of diffs) diffSum += Math.abs(diff);

	if (diffSum > 0) Promise.all([ anim1, anim2 ]).then(step);
};

Promise.all([ anim1, anim2 ]).then(step);
