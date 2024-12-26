import {useEffect, useState} from "react";

import './Chat.css'; // Importamos el archivo de estilo CSS.
import {socket} from './socket'; // Importamos el cliente socket.


// Mostramos un prompt para obtener el nombre del usuario que luego será utilizado como autor de mensaje.
let nombre = window.prompt("Ingrese su nombre");


/**
 * Componente principal del chat.
 */
function Chat() {

    const [mensajes, setMensajes] = useState([])

    useEffect(() => {

        // Escuchamos el evento para recuperar los mensajes previos una vez cargado el componente Chat.
        socket.on('cargado', (mensajes) => {
            setMensajes(mensajes)
            // Ya no es necesario escuchar el evento.
            socket.off('cargado');
        })

        // Escuchamos el evento de cuando un nuevo mensaje es envíado.
        socket.on('mensaje', ({autor, contenido}) => {
            setMensajes([...mensajes, {autor, contenido}])
        })

        return () => {
            // En esta salida debemos también dejar de escuchar el evento de recibir un mensaje, ya que de lo contrario se duplicaría.
            socket.off('mensaje')
        }

    }, [mensajes])

    return (<div className="Chat">
        <h1>Chat</h1>
        <div className="Cuerpo">
            <ListaMensajes mensajes={mensajes}/>
            <Campo/>
        </div>
    </div>);
}


/**
 * Componente para la lista de mensajes.
 *
 * @param mensajes La lista de mensajes.
 */
function ListaMensajes({mensajes}) {
    return (<div className="ListaMensajes">
        {
            // Mapeamos los mensajes a un elemento 'Mensaje'
            mensajes.map((mensaje, index) => {
                return <Mensaje key={index} autor={mensaje.autor} contenido={mensaje.contenido}/>
            })
        }
    </div>);
}

/**
 * Componente para los mensajes.
 *
 * @param autor El autor del mensaje.
 * @param contenido El contenido del mensaje.
 */
function Mensaje({autor, contenido}) {
    // Diferenciamos según el nombre si el mensaje es nuestro, y con base en eso utilizamos una clase distinta.
    return (<div className={autor === nombre ? "MensajePropio" : "MensajeAjeno"}>
        <h4>{autor}</h4>
        <p>{contenido}</p>
    </div>);
}

/**
 * Componente para el campo de texto y el botón de envíar.
 */
function Campo() {

    const [mensaje, setMensaje] = useState("");

    // Función que será utilizada por el formulario al presionar el botón de envíar.
    function enviar() {

        // Si el mensaje está vacío se omite.
        if (mensaje.trim() === "") {
            return;
        }

        // Emitimos el evento que escuchará el servidor con el mensaje.
        socket.emit('mensaje', {
            autor: nombre,
            contenido: mensaje.trim()
        })

        // Limpiamos el <input>.
        setMensaje("");
    }

    return (<div className="Campo">
        <input type="text"
               placeholder="Escribe un mensaje..."
               onChange={e => setMensaje(e.target.value)}
               value={mensaje}
        />
        <button onClick={enviar}>Enviar</button>
    </div>);
}


export default Chat;