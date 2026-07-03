export interface Personagem {
  personagem_id: number;
  personagem_status: number;
  usuario_id: number;
  personagem_nome: string;
  personagem_classe: string;
  personagem_nivel: number;
  personagem_pontos_vida: number;
  personagem_pontos_mana: number;
  personagem_pontos_sonho: number;
  personagem_sanidade: number;
  personagem_historia: string;
  personagem_imagem?: string;
}
