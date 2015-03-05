window.onload = function() 
{
	//Para los archivos...
	//Cada cuanto se haráel conteo de la latencia...
	var MUESTRA_LATENCIA = 0;
	var tieneEncabezado = 0; //Para establecer si los archivos tendrán encabezados...
	var tipoExporta = 1; //Para indicar el tipo de archivo a exportar...
	datosCSV = [];
	var archivos = [
						{
							"input" : "agregate1", 
							"nombre" : "Agregate report Arquitectura 1"
						}, 
						{
							"input" : "latencies1", 
							"nombre" : "Latencies/CodesPerSecond Arquitectura 1"
						},
						{
							"input" : "agregate2", 
							"nombre" : "Agregate report Arquitectura 2"
						},
						{
							"input" : "latencies2", 
							"nombre" : "Latencies/CodesPerSecond Arquitectura 2"
						}
				   ];	
	var encabezadoUno = [	
						"arquitectura_uno",
						"arquitectura_dos",
					    "Estimulo_add_uno",
					    "Estimulo_get_uno",
					    "Estimulo_add_dos",
					    "Estimulo_get_dos",
					    "agregate_count_add_uno",
					    "agregate_count_get_uno",
					    "agregate_count_add_dos",
					    "agregate_count_get_dos",
					    "agregate_average_add_uno",
					    "agregate_average_get_uno",
					    "agregate_average_add_dos",
					    "agregate_average_get_dos",
					    "agregate_median_add_uno",
					    "agregate_median_get_uno",
					    "agregate_median_add_dos",
					    "agregate_median_get_dos",
					    "agregate_min_add_uno",
					    "agregate_min_get_uno",
					    "agregate_min_add_dos",
					    "agregate_min_get_dos",
					    "agregate_max_add_uno",
					    "agregate_max_get_uno",
					    "agregate_max_add_dos",
					    "agregate_max_get_dos",
					    "agregate_error_add_uno",
					    "agregate_error_get_uno",
					    "agregate_error_add_dos",
					    "agregate_error_get_dos",
					    "agregate_throughtput_add_uno",
					    "agregate_throughtput_get_uno",
					    "agregate_throughtput_add_dos",
					    "agregate_throughtput_get_dos", 
					    "latencia_promedio_add_uno",
					    "latencia_promedio_get_uno",
					    "latencia_promedio_add_dos",
					    "latencia_promedio_get_dos",
					    "threads_sin_error_add_uno",
					    "threads_sin_error_get_uno",
					    "threads_sin_error_add_dos",
					    "threads_sin_error_get_dos", 
					    "porcentaje_error_add_uno", 
					    "porcentaje_error_get_uno", 
					    "porcentaje_error_add_dos", 
					    "porcentaje_error_get_dos"
					];
	var encabezadoDos = ["TimeStamp",
						 "Latencias_Arquitectura_UNO_ADD",
						 "Latencias_Arquitectura_UNO_GET",
						 "Latencias_Arquitectura_DOS_ADD",
						 "Latencias_Arquitectura_DOS_GET",
						 "Errores_Arquitectura_UNO_ADD",
						 "Errores_Arquitectura_UNO_GET",
						 "Errores_Arquitectura_DOS_ADD",
						 "Errores_Arquitectura_DOS_GET"
						];
	//var mlatencia = nom_div("mlatencia");
	nom_div('procesa').addEventListener('click', function(e) 
	{
		MUESTRA_LATENCIA = Number(nom_div("mlatencia").value);
		tieneEncabezado = Number(nom_div("tencabeza").value);
		tipoExporta = Number(nom_div("exporta").value);
		datosCSV = [];
		var entra = false;
		var tipoArchivo = /text.*/;
		for(var i in archivos)
		{
			var file = nom_div(archivos[i].input);
			if(file.files.length === 0)
			{
				alert("Por favor seleccione el archivo para : " + archivos[i].nombre);
				entra = true;
				break;
			}
		}
		if(!entra)
		{
			abrirArchivos(0);
		}
	});

	var abrirArchivos = function(tipo)
	{
		var leerArchivo = new FileReader();
		leerArchivo.onload = function(e)
		{
			datosCSV.push(leerArchivo.result);
			tipo++;
			//console.log("Tpo es:" + tipo);
			if(tipo <= 3)
			{
				abrirArchivos(tipo);
			}			
			else
			{
				leerDatosCvs();
			}			
		}
		var file = nom_div(archivos[tipo].input);
		leerArchivo.readAsText(file.files[0]);
	};

	//Para leer los archivos de CSV...
	var leerDatosCvs = function()
	{
		var agregateReportUno = datosCSV[0].split("\n");
		var agregateReportDos = datosCSV[2].split("\n");
		var infoCsv = {
							encabezadoUno : "", 
							datosUno : "", 
							encabezadoDos : "", 
							datosDos : ""
					};
		var xmi = "<?xml version=\"1.0\" encoding=\"ASCII\"?>\n";
		xmi += "<csvDsl:ArchivoCsv xmi:version=\"2.0\" xmlns:xmi=\"http://www.omg.org/XMI\" xmlns:csvDsl=\"http://www.uniandes.edu/gramatica/CsvDsl\">\n";
		xmi += "<encabezado>\n";
		//Ya están los encabezados...
		for(var i in encabezadoUno)
		{
			xmi += "<caracteristica rotulo=\""+(encabezadoUno[i])+"\"/>\n";
			if(infoCsv.encabezadoUno != "")
			{
				infoCsv.encabezadoUno += ",";
			}
			infoCsv.encabezadoUno += encabezadoUno[i];
		}
		xmi += "</encabezado>\n";
		//Para poner los datos al encabezado...
		//Para el ADD...
		datosEncabezado = "<consolidado>\n";
		datosEncabezado += "<datos value=\"Arquitectura UNO\"/>\n<datos value=\"Arquitectura DOS\"/>\n";
		//Para csv...
		infoCsv.datosUno = "Arquitectura UNO,Arquitectura DOS,";
		agregateReports = [
						 	agregateReportUno[2].split(","), 
						 	agregateReportUno[1].split(","),
						 	agregateReportDos[2].split(","), 
						 	agregateReportDos[1].split(",")
						];
		//Para mostrar los estímulos...
		nomEstimulos = [
								[
									[
										agregateReports[0][0], 0, 0, 0, 0, 0, 0, 0, 0
									]
									, 
									[
										agregateReports[1][0], 0, 0, 0, 0, 0, 0, 0, 0
									]
								], 
								[
									[
										agregateReports[2][0], 0, 0, 0, 0, 0, 0, 0, 0
									],
									[ 
										agregateReports[3][0], 0, 0, 0, 0, 0, 0, 0, 0
									]
								]
							];
		//var numPruebas = agregateReports[0][1]; //La cantidad de pruebas...
		datosEncabezado += "<datos value=\""+(agregateReports[0][0])+" UNO\"/>\n<datos value=\""+((agregateReports[1][0]))+" UNO\"/>\n";
		datosEncabezado += "<datos value=\""+(agregateReports[2][0])+" DOS\"/>\n<datos value=\""+((agregateReports[3][0]))+" DOS\"/>\n";
		//Para csv...
		infoCsv.datosUno += agregateReports[0][0] + " UNO,"+agregateReports[1][0] + " UNO,";
		infoCsv.datosUno += agregateReports[2][0] + " DOS,"+agregateReports[3][0] + " DOS,";

		for(var i = 1; i < agregateReports[0].length; i++)
		{
			if(i != 4 && i != 9)
			{
				for(var c = 0; c < agregateReports.length; c++)
				{
					datosEncabezado += "<datos value=\""+(agregateReports[c][i])+"\"/>\n";
					//Para csv...
					infoCsv.datosUno += agregateReports[c][i] + ",";
				}
			}
		}
		//datosEncabezado += "</consolidado>\n"; //Para cerrar el enncabezado aunque falta el cálculo de promedios por cada una de los estómulos...
		//Para generar la seguno encabezado...
		var encabezado2 = "<encabezado2>\n";
		for(var i in encabezadoDos)
		{
			encabezado2 += "<caracteristica rotulo=\""+(encabezadoDos[i])+"\"/>\n";
			//Para el encabezado 02 CSV...
			if(infoCsv.encabezadoDos != "")
			{
				infoCsv.encabezadoDos += ",";
			}
			infoCsv.encabezadoDos += encabezadoDos[i];
		}
		encabezado2 += "</encabezado2>\n";
		//Traer los valores...		
		//El valor de la latencia se encuentra en 
		latenciasEs = [datosCSV[1].split("\n"), datosCSV[3].split("\n")];
		//var promLatencias = [0, 0, 0, 0]; //Guardará  los promedios de cada de uno de los estímulos... (add, get, add, get)
		//var iteEstimulos = [[[0, 0], [0, 0]]];

		latenciaMuestra = [];//Tiempo, estímulos...
		//var tieneEncabezado = false; //Para establecer si los archivos tendrán encabezados...
		for(var c = 0; c < 2; c++)
		{
			//var cont = 0;
			for(var i = tieneEncabezado ? 1 : 0; i < latenciasEs[c].length; i++)
			{
				//console.log("Valor de i es: " + i);
				var parte = latenciasEs[c][i].split(",");				
				//Buscar el tipo...
				for(d = 0; d < 2; d++)
				{
					if(parte[2] === nomEstimulos[c][d][0])
					{
						nomEstimulos[c][d][1] += Number(parte[11]);
						nomEstimulos[c][d][2]++;
						//Para las muestras de la gráfica...
						nomEstimulos[c][d][4] += Number(parte[11]);
						
						nomEstimulos[c][d][6]++;
						nomEstimulos[c][d][5]++;

						//Saber si no hay existido error, en este caso si la respuesta fue 200 (Ok)...
						if(Number(parte[3]) === 200) //Sin error...
						{
							nomEstimulos[c][d][7]++; // threads que fueron atendidos sin error...
						}
						else
						{
							nomEstimulos[c][d][8]++; //Número de errores obtenidos para un servicio de una arquitectura...
						}
						if(nomEstimulos[c][d][6] >= MUESTRA_LATENCIA)
						{
							var indice = 0;
							var existe = false;
							for(var a in latenciaMuestra)
							{
								if(latenciaMuestra[a][0] === nomEstimulos[c][d][5])
								{
									indice = a;
									existe = true;
									break;
								}
							}
							if(!existe)
							{
								latenciaMuestra.push([nomEstimulos[c][d][5], [0, 0], [0, 0], [0, 0], [0, 0]]);
								indice = latenciaMuestra.length - 1;
							}
							latenciaMuestra[indice][c + 1][d] =  +(Math.round(nomEstimulos[c][d][4] / MUESTRA_LATENCIA + "e+2")  + "e-2");
							latenciaMuestra[indice][c + 3][d] = nomEstimulos[c][d][8];
							nomEstimulos[c][d][8] = 0; //Reiniciar el conteo de número de errores...
							nomEstimulos[c][d][6] = 0;
							nomEstimulos[c][d][4] = 0;
						}
						break;
					}
				}
			}
		}
		//Para cálcular los promedios de latencia...
		var latenciasPromedio = "";
		var promedioThreads = "";
		var porcentajeError = "";

		var auxCsv = ["", "", ""];

		for(var i in nomEstimulos)
		{			
			for(c in nomEstimulos[i])
			{
				nomEstimulos[i][c][3] = nomEstimulos[i][c][1] / nomEstimulos[i][c][2];
				//Para las latencias promedio...				
				latenciasPromedio += "<datos value=\""+(nomEstimulos[i][c][3])+"\"/>\n";
				//CSV Promedio...
				if(auxCsv[0] != "")
				{
					auxCsv[0] += ",";
				}
				auxCsv[0] += nomEstimulos[i][c][3];
				//Para los errores de los hilos...
				promedioThreads += "<datos value=\""+(nomEstimulos[i][c][7])+"\"/>\n";
				//CSV Errores......
				if(auxCsv[1] != "")
				{
					auxCsv[1] += ",";
				}
				auxCsv[1] += nomEstimulos[i][c][7];
				//Para cálcular y guardar el porcentaje de error...
				var porcentaje = ((nomEstimulos[i][c][2] - nomEstimulos[i][c][7]) / nomEstimulos[i][c][2]) * 100;
				porcentajeError += "<datos value=\""+(porcentaje)+"\"/>\n";
				//CSV Errores......
				if(auxCsv[2] != "")
				{
					auxCsv[2] += ",";
				}
				auxCsv[2] += porcentaje;
			}
		}
		//Poner las latencias y los hilos (Threads)...
		datosEncabezado += latenciasPromedio + promedioThreads + porcentajeError;
		//Para el CSV
		infoCsv.datosUno += auxCsv[0] + "," + auxCsv[1] + "," + auxCsv[2];
		xmi += datosEncabezado + "</consolidado>\n";
		//Generar los datos del encabezado 2...
		var auxCsvDos = "";
		for(var i in latenciaMuestra)
		{
			auxCsvDos = "";
			encabezado2 += "<pruebas>\n";
			encabezado2 += "<datos value=\""+(latenciaMuestra[i][0])+"\"/>\n";
			//Para el CSV...
			//infoCsv.datosDos += latenciaMuestra[i][0] + ",";
			for(var c = 1; c <= 4; c++)
			{
				encabezado2 += "<datos value=\""+(latenciaMuestra[i][c][0])+"\"/>\n";
				encabezado2 += "<datos value=\""+(latenciaMuestra[i][c][1])+"\"/>\n";
				//Para el CSV...
				if(auxCsvDos != "")
				{
					auxCsvDos += ",";
				}
				auxCsvDos += latenciaMuestra[i][c][0] + "," + latenciaMuestra[i][c][1];
			}
			infoCsv.datosDos += latenciaMuestra[i][0] + "," + auxCsvDos + "\n";
			encabezado2 += "</pruebas>\n";
		}
		xmi += encabezado2 + "</csvDsl:ArchivoCsv>";
		//Para consolidar el archivo CSV...
		var csv = infoCsv.encabezadoUno + "\n" + infoCsv.datosUno + "\n";
		csv += infoCsv.encabezadoDos + "\n" + infoCsv.datosDos;
		if(!conEditor)
		{
			if(tipoExporta === 1)
			{
				nom_div("contenido").value = xmi;
			}
			else
			{
				nom_div("contenido").value = csv;
			}
		}
		else
		{
			if(tipoExporta === 1)
			{
				editor.setValue(xmi);
			}
			else
			{
				editor.setValue(csv);
			}
		}
	};
	nom_div('acerca').addEventListener('click', function(e) 
	{
		var txt = "Preprocesador CSV -XMI\n";
		txt += "Mejoramiento de la productividad: Automatización - 2015\n";
		txt += "Desarrollado por:\n";
		txt += "Jorge Humberto Rubiano Rojas\n";
		alert(txt); 
	});
	function nom_div(div)
	{
		return document.getElementById(div);
	}
};