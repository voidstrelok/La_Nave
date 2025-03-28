export interface CapituloDTO {
    d: number
    titulo: string
    descripcion: string
    umeroCapitulo: number
    idPodcast: number
    podcast: PodcastDTO
    refMusicales: RefMusicalDTO[]
  }
  
  export interface PodcastDTO {
    id: number
    nombre: string
  }
  
  export interface RefMusicalDTO {
    id: number
    titulo: string
    artista: string
    enlace: string
    idCapitulo: number
  }
  