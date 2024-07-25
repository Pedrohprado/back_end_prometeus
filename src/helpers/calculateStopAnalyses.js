function calculateTest(datas) {
  let totalTempoInativoMs = 0;
  let motivoParada = null;
  let tempoInativoAcumulado = 0;
  let horaParada = null;
  let horaVolta = null;

  const resultados = [];
  // Percorre as entradas para calcular o tempo de inatividade
  for (const analysis of datas) {
    if (
      analysis.status === 'parado' &&
      ['falta de peças', 'manutenção', 'quebra'].includes(
        analysis.motivoDaParada
      )
    ) {
      // Se encontrar um motivo de parada válido, guarda a data e hora
      motivoParada = analysis.motivoDaParada;
      horaParada = new Date(analysis.createdAt);
    } else if (
      analysis.status === 'funcionando' &&
      motivoParada &&
      horaParada
    ) {
      // Se encontrar um estado ativo e houver um motivo de parada anterior
      horaVolta = new Date(analysis.createdAt);
      const tempoInativoMs = horaVolta - horaParada;
      totalTempoInativoMs += tempoInativoMs;
      tempoInativoAcumulado += tempoInativoMs;

      resultados.push({
        motivoParada,
        tempoInativoMin: +(tempoInativoAcumulado / (1000 * 60)).toFixed(1),
        dataDaParada: horaParada,
        dataDaVolta: horaVolta,
      });
      // Resetando para null para não contar o mesmo tempo de inatividade mais de uma vez
      motivoParada = null;
      horaParada = null;
      horaVolta = null;
      tempoInativoAcumulado = 0;
    }
  }

  return resultados;
}

module.exports = {
  calculateTest,
};
