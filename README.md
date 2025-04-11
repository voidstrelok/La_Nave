# La Nave - Tomato Crate Cassette Player

Web App para escuchar cassettes :) 

Los cassettes son básicamente un .zip con los archivos ordenados de la siguiente manera:

    cassette.json
    NombreArchivo#1.mp3
    NombreArchivo#2.mp3
    NombreArchivo#3.mp3
    ...
El archivo `cassette.json` se arma de esta manera:

    {
	    "cassette": "NombrePodcast",    
	    "idCassette":1, //Correlativo    
	    "idPodcast":1, //Correlativo    
	    "episodios": [ 
					    {"idCapitulo": 1, "numeroCapitulo": 1, "file": "NombreArchivo#1.mp3"},
					    {"idCapitulo": 2, "numeroCapitulo": 2, "file": "NombreArchivo#2.mp3"},
					    //continua...    
					 ]
    
    }
   La idea es armar tu propio cassette.. o conseguir uno armado por algún amigo.

## Entrar a la nave
Para ingresar a la nave, se debe cargar por lo menos 1 cassette. Haz clic en el  botón `CARGAR` y espera a que se cargue.

> La acción de `CARGAR` en la página no sube nada al servidor. El cassette que se cargue, se copia al "cache" del navegador (específicamente en la IndexedDB). Por eso puede demorar. El sitio no aloja ni distribuye ningún archivo.

Al terminar de cargar el cassette, la página se actualizará y se habilitará el botón `ENTRAR`.

> Si algo no funciona o empieza a explotar todo, haz clic en `RESET`
    

## Cassete Player
La página es un simple reproductor de los audios que hayas subido. Cada capitulo dispone una caja de comentarios de Disqus, para comentar el capitulo y dejar sugerencias.


