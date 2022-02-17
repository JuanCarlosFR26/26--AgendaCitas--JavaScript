// Campos del formulario

const nombreInput = document.querySelector('#nombre');
const apellidosInput = document.querySelector('#apellidos');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// User Interface
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id) {
        this.citas = this.citas.filter( cita => cita.id !== id)
    }

    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita );
    }

}

class UI {

    imprimirAlerta(mensaje, tipo) {
        // Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // Agregar clase en base al tipo de error
        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        // Quitar la alerta después de 5 segundos
        setTimeout( ()=> {
            divMensaje.remove();
        }, 4000)
    }


    imprimirCitas({citas}) { // Podemos aplicasr destructuring en el parentesis con  {}

        this.limpiarHTML();
        
        citas.forEach( cita => {
            const { nombre, apellidos, telefono, fecha, hora, sintomas, id } = cita;
            
            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3'); // p-3 clase de bootstrap
            divCita.dataset.id = id;

            // Scripting de los elementos de la cita
            const nombreParrafo = document.createElement('h2');
            nombreParrafo.classList.add('card-title', 'font-weight-bolder');
            nombreParrafo.textContent = nombre;

            const apellidosParrafo = document.createElement('p');
            apellidosParrafo.innerHTML = `
                <span class="font-weight-bolder">Apellidos: </span>${apellidos}
            `;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
                <span class="font-weight-bolder">Teléfono: </span>${telefono}
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
                <span class="font-weight-bolder">Fecha: </span>${fecha}
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
                <span class="font-weight-bolder">Hora: </span>${hora}
            `;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
                <span class="font-weight-bolder">Síntomas: </span>${sintomas}
            `;

            // Botón para eliminar las citas
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

            btnEliminar.onclick = ()=> eliminarCita(id);

            // Botón para modificar las citas
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';
            btnEditar.onclick = () => cargarEdicion(cita);

            // Agregar los parragos al divCita
            divCita.appendChild(nombreParrafo);
            divCita.appendChild(apellidosParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            // Agregar las citas al HTML
            contenedorCitas.appendChild(divCita);

        })
    }

    limpiarHTML() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }
    }
}

const ui = new UI();
const administrarCitas = new Citas();


// Registrar eventos
evenetListeners();
function evenetListeners() {
    nombreInput.addEventListener('input', datosCita);
    apellidosInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita)
}


// Objeto con la información de la cita
const citaObj = {
    nombre: '',
    apellidos: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

// Agrega datos al objeto de cita
function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
}

// Valida y agrega una nueva cita a la clase de cita
function nuevaCita(e) {
    e.preventDefault();

    // Extraer la informacion del objeto de la cita
    const { nombre, apellidos, telefono, fecha, hora, sintomas } = citaObj;

    // Validar
    if(nombre === "" || apellidos === "" || telefono === "" || fecha === "" || hora === "" || sintomas === "") {
        ui.imprimirAlerta('Todos los campos son obilatorios', 'error');
        
        return;
    }

    if(editando) {
        ui.imprimirAlerta('Editado correctamente');

        // Pasar el objeto de la cita a edición
        administrarCitas.editarCita({...citaObj});

        // Regresar el texto de botón a su estado original
        formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

        // Quitar modo edicion
        editando = false;
    } else {
        // Generar id unico
        citaObj.id = Date.now();


        // Creando una nueva cita
        administrarCitas.agregarCita({...citaObj}); // Lo hacemos asi para mandar una copia y no toda la referencia del objeto 

        // Mensaje de agregado correctamente
        ui.imprimirAlerta('Se agregó correctamente')
    }

    

    // Reiniciar objeto
    reiniciarObjeto();

    // Reiniciar el formulario
    formulario.reset();

    // Mostrar el HTML
    ui.imprimirCitas(administrarCitas);

}

function reiniciarObjeto() {
    citaObj.nombre = '';
    citaObj.apellidos = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

// Eliminar cita
function eliminarCita(id) {
    //Eliminar la cita
    administrarCitas.eliminarCita(id);

    // Muestra un mensaje
    ui.imprimirAlerta('La cita se eliminó correctamente');

    // Refrescar las citas
    ui.imprimirCitas(administrarCitas);
}

// Carga los datos y el modo edición
function cargarEdicion(cita) {
    const { nombre, apellidos, telefono, fecha, hora, sintomas, id} = cita;

    // Llenar los inputs
    nombreInput.value = nombre;
    apellidosInput.value = apellidos;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // Llenar el objeto
    citaObj.nombre = nombre;
    citaObj.apellidos = apellidos;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;


    // Cambiar el texto del botón
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
    editando = true;
}