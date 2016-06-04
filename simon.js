(function () {
	var H = Highcharts,
		seriesTypes = H.seriesTypes,
		plotOptions = H.getOptions().plotOptions,
		extend = H.extend,
		each = H.each,
		stableSort = H.stableSort;

	plotOptions.simon = H.merge(plotOptions.pie, {
		dataLabels: {
			enabled: false
		}
	});
	seriesTypes.simon = H.extendClass(seriesTypes.pie, {
		type: 'simon',
		init: function (chart, options) {
			var series = this,
				eventType,
				events,
				chartSeries = chart.series,
				index = chartSeries.length - 1,
				sortByIndex = function (a, b) {
					return pick(a.options.index, a._i) - pick(b.options.index, b._i);
				};

			series.chart = chart; // setOptions requires the attribute this.chart
			options = series.setOptions(options); // merge with plotOptions
			extend(series, {
				options: options,
				state: "",
				name: options.name || 'Series ' + (index + 1),
				index: index,
				linkedSeries: [],
				pointAttr: {},
				_i: index,
				visible: options.visible !== false, // true by default
				selected: options.selected === true // false by default
			});
			series.getColor();
			series.getSymbol();

			// Set the data
			each(series.parallelArrays, function (key) {
				series[key + 'Data'] = [];
			});
			series.setData([1, 1, 1, 1], false);

			// bind the axes
			series.bindAxes();

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

			// Register it in the chart
			chartSeries.push(series);
		}
	});
}());