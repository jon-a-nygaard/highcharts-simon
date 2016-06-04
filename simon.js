(function () {
	var H = Highcharts,
		seriesTypes = H.seriesTypes,
		plotOptions = H.getOptions().plotOptions,
		extend = H.extend,
		each = H.each,
		stableSort = H.stableSort;

	plotOptions.simon = H.merge(plotOptions.pie, {

	});
	seriesTypes.simon = H.extendClass(seriesTypes.pie, {
		init: function (chart, options) {
			var series = this,
				eventType,
				events,
				chartSeries = chart.series,
				sortByIndex = function (a, b) {
					return pick(a.options.index, a._i) - pick(b.options.index, b._i);
				};

			extend(series, {
				chart: chart,
				linkedSeries: []
			})
			series.options = options = series.setOptions(options); // merge with plotOptions

			// bind the axes
			series.bindAxes();

			// set some variables
			extend(series, {
				name: options.name,
				state: "",
				pointAttr: {},
				visible: options.visible !== false, // true by default
				selected: options.selected === true // false by default
			});

			// register event listeners
			events = options.events;
			for (eventType in events) {
				addEvent(series, eventType, events[eventType]);
			}
			if (
				(events && events.click) ||
				(options.point && options.point.events && options.point.events.click) ||
				options.allowPointSelect
			) {
				chart.runTrackerClick = true;
			}

			series.getColor();
			series.getSymbol();

			// Set the data
			each(series.parallelArrays, function (key) {
				series[key + 'Data'] = [];
			});
			series.setData([1, 1, 1, 1], false);

			// Mark cartesian
			if (series.isCartesian) {
				chart.hasCartesianSeries = true;
			}

			// Register it in the chart
			chartSeries.push(series);
			series._i = chartSeries.length - 1;

			// Sort series according to index option (#248, #1123, #2456)
			stableSort(chartSeries, sortByIndex);
			if (this.yAxis) {
				stableSort(this.yAxis.series, sortByIndex);
			}

			each(chartSeries, function (series, i) {
				series.index = i;
				series.name = series.name || 'Series ' + (i + 1);
			});
		}
	});
}());