
// BASE DE DATOS 

let datos = [];


// LINK CSV GOOGLE SHEETS

const urlCSV =
    "https://docs.google.com/spreadsheets/d/1AfGBnYtxl53AiGHP6yLyhJUgenAgs7_VSUghYbZYsaY/gviz/tq?tqx=out:csv&gid=1449869612";




// FILTRO ACTUAL

let filtroActual = "Pendiente";




// CARGAR DATOS

cargarDatos();


// ACTUALIZAR CADA 20 SEGUNDOS

setInterval(cargarDatos, 20000);




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



    
    // SOLUCIONADO

    if(
        fechaSolucion !== "" ||
        comentarioContratista === "no aplica"
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

        else{

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

    document.getElementById("tituloTabla")
        .textContent = "Casos Pendientes";


    const resultados =
        datos.filter(item =>
            obtenerEstado(item) === "Pendiente"
        );


    crearTablaPendientes(resultados);
}






// MOSTRAR SOLUCIONADOS


function mostrarSolucionados(){

    filtroActual = "Solucionado";

    document.getElementById("tituloTabla")
        .textContent = "Casos Solucionados";


    const resultados =
        datos.filter(item =>
            obtenerEstado(item) === "Solucionado"
        );


    crearTablaSolucionados(resultados);
}





// MOSTRAR SIN GESTIONAR


function mostrarSinGestionar(){

    filtroActual = "Sin gestionar";

    document.getElementById("tituloTabla")
        .textContent = "Casos Sin Gestionar";


    const resultados =
        datos.filter(item =>
            obtenerEstado(item) === "Sin gestionar"
        );


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
            <th>Estado</th>
            <th>Fecha Solución</th>

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

                <td class="estado-solucionado">
                    Solucionado
                </td>

                <td>
                    ${convertirFecha(item["FECHA SOLUCIÓN CONTRATISTA AP"])}
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


    // SI ES "No Aplica"

    if(
        String(fechaTexto)
        .trim()
        .toLowerCase() === "no aplica"
    ){

        return "No Aplica";
    }


    const partes =
        fechaTexto.split("/");


    if(partes.length === 3){

        const dia =
            partes[0].padStart(2, "0");

        const mes =
            partes[1].padStart(2, "0");

        const año =
            partes[2];

        return `${dia}-${mes}-${año}`;
    }

    return fechaTexto;
}









// ================================
// EXPORTAR PDF
// ================================

function exportarPDF(){

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a3"
    });






    // TITULO

    doc.setFontSize(18);

    doc.text(
        `Reporte ${filtroActual}`,
        14,
        15
    );






    // FECHA

    const fechaActual =
        new Date().toLocaleDateString("es-CL");


    doc.setFontSize(11);

    doc.text(
        `Fecha: ${fechaActual}`,
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