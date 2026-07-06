export interface Habilidade {
  id: number;
  status: number;
  personagemId: number;
  nome: string;
  tipo: string;
  descricao: string;
  imagem?: string;
}