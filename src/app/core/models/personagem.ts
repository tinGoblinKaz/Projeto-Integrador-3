export interface Personagem {
  id: number;
  status: number;
  usuarioId: number;
  nome: string;
  classe: string;
  nivel: number;
  pontosVida: number;
  pontosMana: number;
  pontosSonho: number;
  sanidade: number;
  historia: string;
  imagem?: string;
}