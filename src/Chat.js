import './Chat.css';
import {useEffect, useState} from "react";
import {socket} from './socket';

let name = window.prompt("Ingrese su nombre");

function Chat() {

    const [mensajes, setMensajes] = useState([])

    useEffect(() => {

        socket.on('message', ({sender, message}) => {
            setMensajes([...mensajes, {sender, message}])
        })

        return () => {
            socket.off('message')
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

function ListaMensajes({mensajes}) {
    return (<div className="ListaMensajes">
        {mensajes.map((mensaje, index) => {
            return <Mensaje key={index} sender={mensaje.sender} message={mensaje.message}/>
        })}
    </div>);
}

function Mensaje({sender, message}) {
    return (<div className={sender === name ? "MensajePropio" : "MensajeAjeno"}>
        <h4>{sender}</h4>
        <p>{message}</p>
    </div>);
}


function Campo() {

    const [mensaje, setMensaje] = useState("");

    function enviar() {

        if (mensaje.trim() === "") {
            return;
        }

        socket.emit('message', {
            sender: name,
            message: mensaje.trim()
        })
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