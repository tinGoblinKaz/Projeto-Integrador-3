export interface Usuario {
  id: number;
  status: number;
  nome: string;
  email: string;
  senha?: string;
  dataCadastro?: string;
  imagem?: string;
}