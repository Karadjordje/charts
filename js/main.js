$(document).ready(function() {

	const data = [
		{
			mac: '58-90-77-22-75-5C',
			contract: 54867972,
		},
		{
			mac: '5A-3D-30-13-8F-15',
			contract: 31495080,
		},
		{
			mac: '5A-3D-30-13-6C-15',
			contract: 31495080,
		},
		{
			mac: 'A3-43-AE-41-2E-D7',
			contract: 31452503,
		},
		{
			mac: 'B6-06-F6-C7-D5-04',
			contract: 79238775,
		},
		{
			mac: '9D-01-4A-A4-CB-91',
			contract: 39531833,
		},
		{
			mac: 'D7-C4-71-4A-47-35',
			contract: 33992438,
		},
		{
			mac: '0D-D3-6B-05-86-59',
			contract: 93603004,
		},
		{
			mac: '1U-L2-9F-09-23-68',
			contract: '',
		},
		{
			mac: '',
			contract: 12345678,
		},
	];


	$('.search').on('keyup', function() {
	  	let val = $(this).val().toLowerCase();
	  	let searchKey = $(this).data('search');
	  	let searchElement = $(this).next();

	  	searchElement.html('').show();

	  	if (!val || val === "") { // Don't show results is input is empty
	  		searchElement.hide();
	    	return;
	  	}

	  	let found = [];
	  	data.find((item, i) => {
	  		if (found.length > 4) {
	      		return true;
	    	}
	    	var match = item[searchKey].toString().toLowerCase().indexOf(val) === 0;
	    	if (match) {
	      		found.push({data: item[searchKey], index: i});
	    	}
	    	return false;
	  	})

	  	if (!found.length) {
	  		searchElement.hide();
	  	}

	  	found.forEach((item) => {
	     	searchElement.append('<li class="inputData" data-index="' + item.index + '">' + item.data + '</li>');
	  	})
	})

	$('.results').on('click', '.inputData', function() {
		let itemValue = $(this).text();
		$(this).parent().hide().prev().val(itemValue);

		let itemIndex = $(this).data('index')
		if ($(this).parent().prev().data('search') === 'mac') {
			$('#contract').val(data[itemIndex].contract);
		} else {
			$('#mac').val(data[itemIndex].mac);
		}
	});

	$('#clearInputs').on('click', function() {
		$('.search').val('');
	});

	$('#applyFilters').on('click', function() {
		if ($('#mac').val() == '' && $('#contract').val() == '') {
			alert('Please type mac address or contract ID')
		} else {
			let macAddress = $('#mac').val();
			let contractId = $('#contract').val();
			macAddress = (macAddress == '') ? 'No value' : macAddress;
			contractId = (contractId == '') ? 'No value' : contractId;

			$('#graphs').css({
				'border-bottom': '1px solid #f5f5f5',
				'background': '#f5f5f5',
				'background-image': 'linear-gradient(to bottom, #8ef8ff , #bdf2f6)',
				'background-repeat': 'no-repeat',
	    		'background-position': '100% -32px',
			});
			$('.graphs_container').css('display', 'flex').siblings('.tables_container').hide();
			$('.data_parent').css('display', 'flex');
			$('.search_parent').hide();
			$('.tablesGraphs').css('pointer-events', 'auto');
			$('.info_container').css('display', 'flex');
			$('.macAddress').text(macAddress);
			$('.contractId').text(contractId);
		}

		createCharts(1, null, null);
	});

	$('.tablesGraphs').on('click', function() {
		$(this).css({
			'border-bottom': '1px solid #f5f5f5',
			'background': '#f5f5f5',
			'background-image': 'linear-gradient(to bottom, #8ef8ff , #bdf2f6)',
			'background-repeat': 'no-repeat',
    		'background-position': '100% -32px',
		});

		$(this).siblings('').css('border-bottom', '1px solid #999999');


		let currentTab = $(this).data('tab');
		$('.' + currentTab).css('display', 'flex').siblings().hide();
		$('.info_container').css('display', 'flex');
	});

	$('.day_buttons button').on('click', function() {
		$(this).addClass('active').siblings().removeClass('active');

		let days = Number($(this).val());
		createCharts(days, null, null);
	});

	$('#reset').on('click', function() {
		$('.search_parent').css('display', 'flex');
		$('.data_parent').hide();
		$('.search').val('');
		$('.tabs_container > div').hide();
		$('.tablesGraphs').css('border-bottom', '1px solid #999999');
		$('.tablesGraphs').css('pointer-events', 'none');
		$('.hgw_info').hide();
		$('#hgw_info').removeClass('btnActive');
		$('#hgwInfo i').addClass('fa-angle-down').removeClass('fa-angle-up');
		$('input[name="daterange"]').daterangepicker({ startDate: yesterday, endDate: today });
	});

	$('#hgwInfo').on('click', function() {
		$(this).toggleClass('btnActive');
		$('.hgw_info').toggle();
		$('#hgwInfo i').toggleClass('fa-angle-down fa-angle-up');
	});

	// We will generate random arrays so we can simulate data change and randomise it
	function generateArray(length, min, max) {
		return Array(length).fill().map(() => Math.floor(Math.random() * (max - min)) + min);
	}

	const today = new Date();
	const yesterday = new Date(Date.now() - (1000 * 60 * 60 * 24))
	$('input[name="daterange"]').daterangepicker({
		startDate: yesterday,
		opens: 'center',
		maxDate: today,
		locale: {
	      format: 'DD.MM.YYYY'
	    }
	}, function(start, end, label) {
		let startDate = start._d.getTime();
		let endDate = end._d.getTime();

		let millisecondsBetween = endDate - startDate;

		let daysBetween = Math.floor(millisecondsBetween / (60*60*24*1000));

		createCharts(null, startDate, daysBetween);
	});

	function createCharts(daysNumber, startDate, daysBetween) {

		let pointInterval = 3600 * 1000 * 24 // One day
		let pointStart;
		let arrayLength;

		if (daysNumber === 1) {
			pointStart = Date.now() - (1000 * 60 * 60 * 24 * daysNumber); // Get days in past
			arrayLength = 7;
		} else if (daysNumber === 7) {
			pointStart = Date.now() - (1000 * 60 * 60 * 24 * daysNumber);
			arrayLength = 7;
		} else {
			pointStart = startDate;
			arrayLength = daysBetween;
		}


		Highcharts.setOptions({
	        chart: {
	            backgroundColor: 'rgba(255,255,255)',
	            shadow: true,
	            borderRadius: '10px',
	        },

	        title: {
	    		align: 'left',
	    		color: '#4a4a4a',
	    		font: 'Open Sans, sans-serif',
	    		margin: 40,
	    		x: 25,
	    		y: 30,
	        },

	        plotOptions: {
		        series: {
		            pointStart: pointStart,
		            pointInterval: pointInterval
		        },
		        spline: {
		            marker: {
		                enabled: false
		            },
		            pointStart: pointStart,
		            pointInterval: pointInterval
		        },
		        area: {
		        	stacking: 'normal',
		            marker: {
		                enabled: false
		            },
		            pointStart: pointStart,
		            pointInterval: pointInterval
		        },
		        areaspline: {
		        	stacking: 'normal',
		            marker: {
		                enabled: false
		            },
		            pointStart: pointStart,
		            pointInterval: pointInterval
		        },
		        line: {
		            pointStart: pointStart,
		            pointInterval: pointInterval
		        },
		    },

	        exporting: {
	        	chartOptions: {
				    chart: {
				      	backgroundColor: '#fff',
				    },
				},
		        buttons: {
		            customButton: {
		            	width: 20,
		            	height: 20,
		            	x: -10,
		            	y: 9,
		                symbol: 'url(img/expand.jpg)',
	        			className: 'customBtn',
		            },

		            contextButton: {
			          	text: 'Export',
			          	x: -50,
			          	symbol: null,
			      	},
		        }
		    },

	    });

	    var chart1 = new Highcharts.Chart({
	        chart: {
	            renderTo: 'container1',
	            type: 'areaspline',
	        },

	        title: {
	        	text: 'HGw status',
	        },

	        xAxis: {
	            type: 'datetime',
	        },

	        yAxis: {
	        	title: {
	        		text: 'GB'
	        	},
	        },

	        series: [{
	        	type: 'spline',
	        	name: 'Total No. of Unify clients',
	        	color: '#0f6589',
	            data: generateArray(arrayLength, 80, 100),
		        zIndex: 1,
		        marker: {
		            enabled: false
		        },
	        }, {
	        	name: 'Data transfered',
	        	data: generateArray(arrayLength, 120, 160),
		        marker: {
		            enabled: false
		        },
	        }]
	    });

	    var chart2 = new Highcharts.Chart({
	        chart: {
	            renderTo: 'container2',
	            type: 'areaspline',
	        },

	        title: {
	        	text: 'HGw status',
	        },

	        xAxis: {
	            type: 'datetime'
	        },

	        yAxis: {
	        	title: {
	        		text: 'GB'
	        	},
	        },

	        series: [{
	        	color: '#20fc8f',
	        	name: 'Good',
	            data: generateArray(arrayLength, 50, 70),
	        }, {
	        	color: '#ffa100',
	        	name: 'Medium',
	        	data: generateArray(arrayLength, 80, 90),
	        }, {
	        	color: '#ff5b58',
	        	name: 'Bad',
	        	data: generateArray(arrayLength, 100, 160),
	        }]
	    });

	    var chart3 = new Highcharts.Chart({
	        chart: {
	            renderTo: 'container3',
	            type: 'column'
	        },

	        title: {
	        	text: 'HGW Interterence',
	        },

	        xAxis: {
	        	title: {
	        		text: 'Teritorial Directions'
	        	},
	        },

	        yAxis: {
	        	title: {
	        		text: 'No. of clients'
	        	},
	        },

	        plotOptions: {
		        series: {
		            pointStart: 0,
		            pointInterval: 1,
		        },
		    },

	        series: [{
	        	name: 'A',
	        	color: '#8ef8ff',
	        	data: generateArray(arrayLength, 50, 170),
	        }, {
	        	name: 'B',
	        	color: '#0088bc',
	        	data: generateArray(arrayLength, 50, 105),
	        }, {
	        	name: 'C',
	        	color: '#006799',
	        	data: generateArray(arrayLength, 40, 60),
	        }, {
	        	name: 'D',
	        	color: '#00c2e2',
	        	data: generateArray(arrayLength, 30, 75),
	        }]
	    });

	    var chart4 = new Highcharts.Chart({
	        chart: {
	            renderTo: 'container4',
	            type: 'column'
	        },

	        title: {
	        	text: 'Total No. Of interterence network',
	        },

	        xAxis: {
	        	title: {
	        		text: 'Teritorial Directions'
	        	},
	        },

	        yAxis: {
	        	title: {
	        		text: 'No. of clients'
	        	},
	        },

	        plotOptions: {
		        series: {
		            pointStart: 0,
		            pointInterval: 1,
		        },
		    },

	        series: [{
	        	name: 'A',
	        	color: '#8ef8ff',
	        	data: generateArray(arrayLength, 50, 175),

	        }, {
	        	name: 'B',
	        	color: '#0088bc',
	        	data: generateArray(arrayLength, 82, 108),

	        }, {
	        	name: 'C',
	        	color: '#006799',
	        	data: generateArray(arrayLength, 40, 60),

	        }, {
	        	name: 'D',
	        	color: '#00c2e2',
	        	data: generateArray(arrayLength, 30, 76),

	        }]
	    });

	    var chart5 = new Highcharts.Chart({
	        chart: {
	            renderTo: 'container5',
	            type: 'spline'
	        },

	        title: {
	        	text: 'HGw - RSS',
	        },

	        xAxis: {
	        	type: 'datetime'
	        },

	        yAxis: {
	        	title: {
	        		text: 'dBm'
	        	},
	        },

	        series: [{
		        name: 'Maximum',
		        data: generateArray(arrayLength, 88, 160),
		    }, {
		        name: 'Average',
		        data: generateArray(arrayLength, 55, 110),
		    }, {
		        name: 'Minimum',
		        data: generateArray(arrayLength, 10, 70),
		    }],
	    });

	    var chart6 = new Highcharts.Chart({
	        chart: {
	            renderTo: 'container6',
	            type: 'spline'
	        },

	        title: {
	        	text: 'HGw - Bit rate',
	        },

	        xAxis: {
	        	type: 'datetime'
	        },

	        yAxis: {
	        	title: {
	        		text: 'Mbps'
	        	},
	        },

	        series: [{
		        name: 'Max',
		        data: generateArray(arrayLength, 90, 160),
		    }, {
		        name: 'Average',
		        data: generateArray(arrayLength, 60, 130),
		    }, {
		        name: 'Min',
		        data: generateArray(arrayLength, 10, 70),
		    }],
	    });

	    var chart7 = new Highcharts.Chart({
	        chart: {
	            renderTo: 'container7',
	            type: 'line',
	        },

	        title: {
	        	text: 'HGw number of retransmission',
	        },

	        xAxis: {
	            type: 'datetime'
	        },

	        series: [{
	        	color: '#0088bc',
	        	name: 'Bytes',
	            data: generateArray(arrayLength, 103000, 175000),
	        }, {
	        	color: '#00c2e2',
	        	name: 'Retransmitted Bytes',
	        	data: generateArray(arrayLength, 1500, 95000),
	        }]
	    });

	    var chart8 = new Highcharts.Chart({
	        chart: {
	            renderTo: 'container8',
	            type: 'areaspline',
	        },

	        title: {
	        	text: 'HGw Number of clients',
	        },

	        xAxis: {
	            type: 'datetime'
	        },

	        yAxis: {
	        	title: {
	        		text: 'No. of clients'
	        	},
	        },

	        series: [{
	        	name: 'clients',
	        	color: '#c3fafe',
	        	data: generateArray(arrayLength, 1, 40),
	        }]
	    });

	    $('.customBtn').on('click', function() {
	    	$(this).closest('.chart').toggleClass('fullWidth');
	    	$(this).closest('.chart').highcharts().reflow();

	    	if ($(this).closest('.chart').siblings().hasClass('fullWidth')) {
	    		$(this).closest('.chart').siblings().removeClass('fullWidth');
	    		$(this).closest('.chart').siblings().highcharts().reflow();
	    	}
	    });
	}

});
