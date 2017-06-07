        (function() {
            // var APPID = "09bf011b56073de6cff36d95fcc99f44"; //APPID from OpenWeatherMap.org
            // function init() {
                // tableau.initCallback();
            // }
            // function shutdown() {
                // tableau.shutdownCallback();
            // }
            //returns a URL for 5 day forecast for given city from the OpenWeatherMap API
            // function buildUrl(cityid) {
                // var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?id=' + encodeURIComponent(cityid.toString()) + "&cnt=5&units=imperial" + "&APPID=" + APPID;
                // return url;
            // }
            var myConnector = tableau.makeConnector();
            myConnector.init = function(initCallback) {
                initCallback();
                tableau.submit();
            };
			    
			    // myConnector.getColumnHeaders = function() {
                // setup field names and types to store weather data
                // var fieldNames = ['COUNTRY', 'CITY ID', 'CITY', 'DAYTEMP', 'MINTEMP', 'MAXTEMP', 'NIGHTTEMP', 'EVETEMP', 'MORNTEMP', 'PRESSURE', 'HUMIDITY', 'DATE', 'MAIN', 'DESCRIPTION', 'ICON', 'SPEED', 'DEGREES', 'CLOUD', 'LAT', 'LON'];
                // var fieldTypes = ['string', 'float', 'string', 'float', 'float', 'float', 'float', 'float', 'float', 'float', 'float', 'date', 'string', 'string', 'string', 'float', 'float', 'float', 'float', 'float'];
                // tableau.headersCallback(fieldNames, fieldTypes);
				// }
				myConnector.getSchema = function (schemaCallback) {
					var cols = [
						{ id : "CITY ID", alias : "CITY ID", columnRole: "dimension", dataType : tableau.dataTypeEnum.string },
						{ id : "DATE", alias : "DATE", dataType : tableau.dataTypeEnum.date },
						{ id : "CITY", alias : "CITY", columnRole: "dimension", dataType : tableau.dataTypeEnum.string },
						{ id : "DESCRIPTION", alias : "DESCRIPTION", columnRole: "dimension", dataType : tableau.dataTypeEnum.string },
						{ id : "ICON", alias : "ICON", columnRole: "dimension", dataType : tableau.dataTypeEnum.string },
						{ id : "CLOUD", alias : "CLOUD", columnRole: "measure", dataType : tableau.dataTypeEnum.float },
						{ id : "DEGREES", alias : "DEGREES", dataType : tableau.dataTypeEnum.float },
						{ id : "MAIN", alias : "MAIN", dataType : tableau.dataTypeEnum.string }
					];
				
					var tableInfo = {
						id : "WeatherFeed",
						alias : "5 Day Weather Forecast",
						columns : cols
					};
					
					schemaCallback([tableInfo]);
				};
				
				var lastRecordToken = '10';
				lastRecordToken = Number(lastRecordToken);
				
				myConnector.getData = function (table, doneCallback) {
				var cityid = '4172086';
				//build url to get data
                var connectionUrl = "http://api.openweathermap.org/data/2.5/forecast/daily/?id=4172086&units=imperial&appid=09bf011b56073de6cff36d95fcc99f44";
                var xhr = $.ajax({
                    url: connectionUrl,
                    dataType: 'json',
                    success: function(data) {
                        var toRet = [];
                        //make sure we don't output anything for null values
                        if (data.list) {
                            var list = data.list;
                            var city = data.city;
                            //for each result write entry
                            for (x = 0; x < list.length; x++) {
                                //tableau.log("weatherwebconnect - getTableData city=" + city.name);
                                entry = {
                                    //'COUNTRY': city.country,
                                    'CITY': city.name,
                                    'CITY ID': city.id,
                                    //'DAYTEMP': list[x].temp.day,
                                    //'MINTEMP': list[x].temp.min,
                                    //'MAXTEMP': list[x].temp.max,
                                    //'NIGHTTEMP': list[x].temp.night,
                                    //'EVETEMP': list[x].temp.eve,
                                    //'MORNTEMP': list[x].temp.morn,
                                    //'PRESSURE': list[x].pressure,
                                    //'HUMIDITY': list[x].humidity,
                                    'DATE': new Date(list[x].dt * 1000),
                                    'MAIN': list[x].weather[0].main,
                                    'DESCRIPTION': list[x].weather[0].description,
                                    'ICON': list[x].weather[0].icon,
                                    //'SPEED': list[x].speed,
                                    'DEGREES': list[x].deg,
                                    'CLOUD': list[x].clouds,
                                    //'LAT': city.coord.lat,
                                    //'LON': city.coord.lon
                                };
                                toRet.push(entry);
                            }
                            // Call back to tableau with the table data and the new record number (this is stored as a string)
                            lastRecordToken = lastRecordToken + 1;
                            tableau.dataCallback(toRet, lastRecordToken.toString(), true);
                        } else {
                            tableau.abortWithError("No results found for city id: ");
                        }
                    },
						
					
				});
					// $.getJSON("http://api.openweathermap.org/data/2.5/forecast/daily/?id=4172086&units=imperial&appid=09bf011b56073de6cff36d95fcc99f44"), function (json) {
						// console.log( "JSON Data: " + json.list[2].dt);
					// })
						// var feat = resp.features,
							// tabledata = [];
							
						//Iterate over the JSON object
						// for (var i = 0, len = feat.length; i < len; i++) {
							// tableData.push({
								// "city_id": feat[i].id,
								// "mag": feat[i].properties.mag,
								// "title": feat[i].properties.title,
								// "lon": feat[i].geometry.coordinates[0],
								// "lat": feat[i].geometry.coordinates[1]
							// });
						// }
					
				};
				
				tableau.registerConnector(myConnector);
				$(document).ready(function () {
					$("#submitButton").click(function () {
						tableau.connectionName = "Weather Data Feed";
						tableau.submit();
					});
				});
		})();
            // // myConnector.getColumnHeaders = function() {
                // //setup field names and types to store weather data
                // var fieldNames = ['COUNTRY', 'CITY ID', 'CITY', 'DAYTEMP', 'MINTEMP', 'MAXTEMP', 'NIGHTTEMP', 'EVETEMP', 'MORNTEMP', 'PRESSURE', 'HUMIDITY', 'DATE', 'MAIN', 'DESCRIPTION', 'ICON', 'SPEED', 'DEGREES', 'CLOUD', 'LAT', 'LON'];
                // var fieldTypes = ['string', 'float', 'string', 'float', 'float', 'float', 'float', 'float', 'float', 'float', 'float', 'date', 'string', 'string', 'string', 'float', 'float', 'float', 'float', 'float'];
                // tableau.headersCallback(fieldNames, fieldTypes);
            // }
            // myConnector.getTableData = function(lastRecordToken) {
                // if (!tableau) {
                    // alert("weatherwebconnect getColumnHeaders- tableau NOT defined!");
                    // return;
                // }
                // //tableau.log("weatherwebconnect - getTableData connectionData=" + tableau.connectionData);
                // //tableau.log("weatherwebconnect - getTableData lastRecordToken=" + lastRecordToken);
                // //country id selected by user
                // var country = "US";
                    // var cityids = [4172086, 4347778, 5786899, 4508722, 5506956];
                // //parse lastRecordNumer as Integer as Tableau stores this as a string
                // lastRecordToken = Number(lastRecordToken);
                // // Return if lastRecordToken is greater than or equal to the size of cityids list
                // if (lastRecordToken >= cityids.length) {
                    // //if (lastRecordToken > 10) { //test with 10 cities
                    // tableau.dataCallback([], lastRecordToken.toString(), false);
                    // return;
                // }
                // var cityid = cityids[lastRecordToken];
				// //build url to get data
                // var connectionUrl = buildUrl(cityid);
                // var xhr = $.ajax({
                    // url: connectionUrl,
                    // dataType: 'json',
                    // success: function(data) {
                        // var toRet = [];
                        // //make sure we don't output anything for null values
                        // if (data.list) {
                            // var list = data.list;
                            // var city = data.city;
                            // //for each result write entry
                            // for (x = 0; x < list.length; x++) {
                                // tableau.log("weatherwebconnect - getTableData city=" + city.name);
                                // entry = {
                                    // 'COUNTRY': city.country,
                                    // 'CITY': city.name,
                                    // 'CITY ID': city.id,
                                    // 'DAYTEMP': list[x].temp.day,
                                    // 'MINTEMP': list[x].temp.min,
                                    // 'MAXTEMP': list[x].temp.max,
                                    // 'NIGHTTEMP': list[x].temp.night,
                                    // 'EVETEMP': list[x].temp.eve,
                                    // 'MORNTEMP': list[x].temp.morn,
                                    // 'PRESSURE': list[x].pressure,
                                    // 'HUMIDITY': list[x].humidity,
                                    // 'DATE': new Date(list[x].dt * 1000),
                                    // 'MAIN': list[x].weather[0].main,
                                    // 'DESCRIPTION': list[x].weather[0].description,
                                    // 'ICON': list[x].weather[0].icon,
                                    // 'SPEED': list[x].speed,
                                    // 'DEGREES': list[x].deg,
                                    // 'CLOUD': list[x].clouds,
                                    // 'LAT': city.coord.lat,
                                    // 'LON': city.coord.lon
                                // };
                                // toRet.push(entry);
                            // }
                            // // Call back to tableau with the table data and the new record number (this is stored as a string)
                            // lastRecordToken = lastRecordToken + 1;
                            // tableau.dataCallback(toRet, lastRecordToken.toString(), true);
                        // } else {
                            // tableau.abortWithError("No results found for city id: " + cityid);
                        // }
                    // },
                    // error: function(xhr, ajaxOptions, thrownError) {
                        // // add something to the log and return an empty set if there was problem with the connection
                        // tableau.log("connection error: " + xhr.responseText + "\n" + thrownError);
                        // tableau.abortWithError("error connecting to the openweathermaps API data source");
                    // }
                // });
            // };
            // tableau.registerConnector(myConnector);
			// $(document).ready(function () {
    // $("#submitButton").click(function () {
        // tableau.connectionName = "USGS Earthquake Feed";
        // tableau.submit();
					// });
				// });