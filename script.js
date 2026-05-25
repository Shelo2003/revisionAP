// BASE DE DATOS

let datos = [];


// LINK CSV GOOGLE SHEETS

const urlCSV =
    "https://docs.google.com/spreadsheets/d/1AfGBnYtxl53AiGHP6yLyhJUgenAgs7_VSUghYbZYsaY/gviz/tq?tqx=out:csv&gid=1449869612";




// FILTRO ACTUAL

let filtroActual = "Pendiente";




// FILTRO FECHAS

let fechaInicio = "";

let fechaFin = "";




// CARGAR DATOS

cargarDatos();


// ACTUALIZAR CADA 20 SEGUNDOS

setInterval(cargarDatos, 20000);




// GUARDAR FECHAS

function aplicarFiltroFechas(){

    fechaInicio =
        document.getElementById("fechaInicio").value;

    fechaFin =
        document.getElementById("fechaFin").value;


    // RECARGAR TABLA ACTUAL

    if(filtroActual === "Pendiente"){

        mostrarPendientes();
    }

    else if(filtroActual === "Solucionado"){

        mostrarSolucionados();
    }

    else{

        mostrarSinGestionar();
    }
}




function cargarDatos(){

    Papa.parse(urlCSV, {

        download: true,

        header: true,

        skipEmptyLines: true,

        complete: function(resultado){

            // SOLO CASOS CON CODIGO

            datos = resultado.data.filter(item => {

                return String(
                    item["CÓDIGO"] || ""
                ).trim() !== "";
            });

            console.log("Datos cargados");

            actualizarContadores();


            // MANTENER FILTRO ACTUAL

            if(filtroActual === "Pendiente"){

                mostrarPendientes();
            }

            else if(filtroActual === "Solucionado"){

                mostrarSolucionados();
            }

            else{

                mostrarSinGestionar();
            }
        }
    });
}





// OBTENER ESTADO

function obtenerEstado(item){

    const fechaInformada =
        String(
            item["FECHA INFORMADA A RESPONSABLE"] || ""
        )
        .trim();


    const fechaSolucion =
        String(
            item["FECHA SOLUCIÓN CONTRATISTA AP"] || ""
        )
        .trim();


    const comentarioContratista =
        String(
            item["COMENTARIO CONTRATISTA AP"] || ""
        )
        .trim()
        .toLowerCase();



    // IGNORAR NO APLICA

    if(
        comentarioContratista === "no aplica"
    ){

        return "Ignorar";
    }



    // SOLUCIONADO

    if(
        fechaSolucion !== ""
    ){

        return "Solucionado";
    }



    // PENDIENTE

    if(
        fechaInformada !== ""
    ){

        return "Pendiente";
    }



    // SIN GESTIONAR

    return "Sin gestionar";
}





// FILTRAR POR FECHAS

function filtrarPorFecha(lista){

    // SI NO HAY FECHAS

    if(
        fechaInicio === "" &&
        fechaFin === ""
    ){

        return lista;
    }


    return lista.filter(item => {

        let fechaTexto = "";


        // ====================================
        // SOLUCIONADOS
        // FILTRAR POR FECHA SOLUCION
        // ====================================

        if(filtroActual === "Solucionado"){

            fechaTexto =
                item["FECHA SOLUCIÓN CONTRATISTA AP"] || "";
        }

        // ====================================
        // PENDIENTES
        // FILTRAR POR FECHA INFORMADA
        // ====================================

        else if(filtroActual === "Pendiente"){

            fechaTexto =
                item["FECHA INFORMADA A RESPONSABLE"] || "";
        }

        // ====================================
        // SIN GESTIONAR
        // FILTRAR POR FECHA INGRESO
        // ====================================

        else{

            fechaTexto =
                item["FECHA INGRESO"] || "";
        }


        if(!fechaTexto){

            return false;
        }


        // ELIMINAR HORA SI EXISTE

        const soloFecha =
            fechaTexto.split(" ")[0];


        const partes =
            soloFecha.split("/");


        if(partes.length !== 3){

            return false;
        }


        // FECHA DEL ITEM

        const fechaItem =
            new Date(
                Number(partes[2]),
                Number(partes[1]) - 1,
                Number(partes[0])
            );



        // FECHA INICIO

        if(fechaInicio !== ""){

            const partesInicio =
                fechaInicio.split("-");

            const inicio =
                new Date(
                    Number(partesInicio[0]),
                    Number(partesInicio[1]) - 1,
                    Number(partesInicio[2])
                );

            if(fechaItem < inicio){

                return false;
            }
        }



        // FECHA FIN

        if(fechaFin !== ""){

            const partesFin =
                fechaFin.split("-");

            const fin =
                new Date(
                    Number(partesFin[0]),
                    Number(partesFin[1]) - 1,
                    Number(partesFin[2]),
                    23,
                    59,
                    59
                );

            if(fechaItem > fin){

                return false;
            }
        }


        return true;
    });
}





// ACTUALIZAR CONTADORES

function actualizarContadores(){

    let pendientes = 0;

    let solucionados = 0;

    let sinGestionar = 0;


    datos.forEach(item => {

        const estado =
            obtenerEstado(item);


        if(estado === "Pendiente"){

            pendientes++;
        }

        else if(estado === "Solucionado"){

            solucionados++;
        }

        else if(estado === "Sin gestionar"){

            sinGestionar++;
        }
    });


    document.getElementById("contadorPendientes")
        .textContent = pendientes;

    document.getElementById("contadorSolucionados")
        .textContent = solucionados;

    document.getElementById("contadorSin")
        .textContent = sinGestionar;
}











// MOSTRAR PENDIENTES

function mostrarPendientes(){

    filtroActual = "Pendiente";


    let resultados =
        datos.filter(item =>
            obtenerEstado(item) === "Pendiente"
        );


    resultados =
        filtrarPorFecha(resultados);


    // TITULO CON CONTADOR

    document.getElementById("tituloTabla")
        .textContent =
        `Casos Pendientes (${resultados.length})`;


    crearTablaPendientes(resultados);
}





// MOSTRAR SOLUCIONADOS

function mostrarSolucionados(){

    filtroActual = "Solucionado";


    let resultados =
        datos.filter(item =>
            obtenerEstado(item) === "Solucionado"
        );


    resultados =
        filtrarPorFecha(resultados);


    // TITULO CON CONTADOR

    document.getElementById("tituloTabla")
        .textContent =
        `Casos Solucionados (${resultados.length})`;


    crearTablaSolucionados(resultados);
}





// MOSTRAR SIN GESTIONAR

function mostrarSinGestionar(){

    filtroActual = "Sin gestionar";


    let resultados =
        datos.filter(item =>
            obtenerEstado(item) === "Sin gestionar"
        );


    resultados =
        filtrarPorFecha(resultados);


    // TITULO CON CONTADOR

    document.getElementById("tituloTabla")
        .textContent =
        `Casos Sin Gestionar (${resultados.length})`;


    crearTablaSinGestionar(resultados);
}












// TABLA PENDIENTES

function crearTablaPendientes(resultados){

    const thead =
        document.getElementById("theadTabla");

    const tbody =
        document.getElementById("tbodyTabla");


    thead.innerHTML = `
        <tr>

            <th>Fecha</th>
            <th>Dirección</th>
            <th>N° Poste</th>
            <th>Descriptor</th>
            <th>Problemática</th>
            <th>Luminaria registrada</th>
            <th>Envío encargado AP</th>
            <th>Estado</th>

        </tr>
    `;


    tbody.innerHTML = "";


    resultados.forEach(item => {

        tbody.innerHTML += `
            <tr>

                <td>
                    ${convertirFecha(item["FECHA INGRESO"])}
                </td>

                <td>
                    ${item["DIRECCIÓN"] || ""}
                </td>

                <td>
                    ${item["N° POSTE"] || ""}
                </td>

                <td>
                    ${item["DESCRIPTOR"] || ""}
                </td>

                <td>
                    ${item["PROBLEMÁTICA"] || ""}
                </td>

                <td>
                    ${item["La luminaria registrada corresponde a::"] || ""}
                </td>

                <td>
                    ${item["FECHA INFORMADA A RESPONSABLE"] || ""}
                </td>

                <td class="estado-pendiente">
                    Pendiente
                </td>

            </tr>
        `;
    });
}





// TABLA SOLUCIONADOS

function crearTablaSolucionados(resultados){

    const thead =
        document.getElementById("theadTabla");

    const tbody =
        document.getElementById("tbodyTabla");


    thead.innerHTML = `
        <tr>

            <th>Fecha</th>
            <th>Dirección</th>
            <th>N° Poste</th>
            <th>Descriptor</th>
            <th>Problemática</th>
            <th>Luminaria registrada</th>
            <th>Envío encargado AP</th>
            <th>Fecha Solución</th>
            <th>Estado</th>

        </tr>
    `;


    tbody.innerHTML = "";


    resultados.forEach(item => {

        tbody.innerHTML += `
            <tr>

                <td>
                    ${convertirFecha(item["FECHA INGRESO"])}
                </td>

                <td>
                    ${item["DIRECCIÓN"] || ""}
                </td>

                <td>
                    ${item["N° POSTE"] || ""}
                </td>

                <td>
                    ${item["DESCRIPTOR"] || ""}
                </td>

                <td>
                    ${item["PROBLEMÁTICA"] || ""}
                </td>

                <td>
                    ${item["La luminaria registrada corresponde a::"] || ""}
                </td>

                <td>
                    ${item["FECHA INFORMADA A RESPONSABLE"] || ""}
                </td>

                <td>
                    ${convertirFecha(item["FECHA SOLUCIÓN CONTRATISTA AP"])}
                </td>

                <td class="estado-solucionado">
                    Solucionado
                </td>

            </tr>
        `;
    });
}





// TABLA SIN GESTIONAR

function crearTablaSinGestionar(resultados){

    const thead =
        document.getElementById("theadTabla");

    const tbody =
        document.getElementById("tbodyTabla");


    thead.innerHTML = `
        <tr>

            <th>Fecha</th>
            <th>Dirección</th>
            <th>N° Poste</th>
            <th>Descriptor</th>
            <th>Luminaria registrada</th>

        </tr>
    `;


    tbody.innerHTML = "";


    resultados.forEach(item => {

        tbody.innerHTML += `
            <tr>

                <td>
                    ${convertirFecha(item["FECHA INGRESO"])}
                </td>

                <td>
                    ${item["DIRECCIÓN"] || ""}
                </td>

                <td>
                    ${item["N° POSTE"] || ""}
                </td>

                <td>
                    ${item["DESCRIPTOR"] || ""}
                </td>

                <td>
                    ${item["La luminaria registrada corresponde a::"] || ""}
                </td>

            </tr>
        `;
    });
}









// CONVERTIR FECHA

function convertirFecha(fechaTexto){

    if(!fechaTexto){

        return "";
    }


    const soloFecha =
        fechaTexto.split(" ")[0];


    const partes =
        soloFecha.split("/");


    if(partes.length === 3){

        const dia =
            partes[0].padStart(2, "0");

        const mes =
            partes[1].padStart(2, "0");

        const año =
            partes[2];

        return `${dia}-${mes}-${año}`;
    }

    return soloFecha;
}









// EXPORTAR PDF

function exportarPDF(){

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a3"
    });





    // TOTAL FILTRADO

    const totalFiltrado =
        document.getElementById("tbodyTabla")
        .rows.length;





    // TITULO

    doc.setFontSize(18);

    doc.text(
        `Reporte ${filtroActual} (${totalFiltrado})`,
        14,
        15
    );





    // RANGO FECHAS

    doc.setFontSize(11);


    let textoFechas =
        "Total general de la base de datos";


    if(
        fechaInicio !== "" &&
        fechaFin !== ""
    ){

        const inicio =
            fechaInicio.split("-").reverse().join("-");

        const fin =
            fechaFin.split("-").reverse().join("-");

        textoFechas =
            `${inicio} al ${fin}`;
    }

    else if(fechaInicio !== ""){

        const inicio =
            fechaInicio.split("-").reverse().join("-");

        textoFechas =
            `Desde ${inicio}`;
    }

    else if(fechaFin !== ""){

        const fin =
            fechaFin.split("-").reverse().join("-");

        textoFechas =
            `Hasta ${fin}`;
    }


    doc.text(
        `Rango: ${textoFechas}`,
        14,
        25
    );









    // TABLA HTML

    doc.autoTable({

        html: "#tablaResultados",

        startY: 35,

        styles: {

            fontSize: 8,

            cellPadding: 3,

            halign: "center",

            valign: "middle",

            overflow: "linebreak"
        },

        headStyles: {

            fillColor: [11, 94, 215],

            textColor: [255, 255, 255],

            fontStyle: "bold"
        },

        alternateRowStyles: {

            fillColor: [245, 245, 245]
        }
    });









    // DESCARGAR

    doc.save(`${filtroActual}.pdf`);
}