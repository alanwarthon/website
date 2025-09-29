<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST["nombre"];
    $apellido = $_POST["apellido"];
    $correo = $_POST["correo"];
    $mensaje = $_POST["mensaje"];

    $destinatario = "alanwarthon@gmail.com"; // Reemplaza con tu dirección de correo
    $asunto = "Mensaje de contacto de $nombre $apellido";
    $mensaje_correo = "Nombre: $nombre\n";
    $mensaje_correo .= "Apellido: $apellido\n";
    $mensaje_correo .= "Correo: $correo\n";
    $mensaje_correo .= "Mensaje:\n$mensaje\n";

    // Enviar el correo
    mail($destinatario, $asunto, $mensaje_correo);

    // Redirigir al usuario a una página de confirmación
    header("Location: confirmacion.html");
} else {
    // Si no se envió el formulario, redirigir a la página del formulario
    header("Location: index.html");
}
?>
