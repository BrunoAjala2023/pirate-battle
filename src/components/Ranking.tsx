import { useQuery } from "@tanstack/react-query";
import { getRanking } from "../api/rankingApi";

export function Ranking() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["ranking"],
    queryFn: getRanking,
  });

  if (isLoading) {
    return <p>Carregando ranking...</p>;
  }

  if (isError) {
    return (
      <div>
        <p>
          Não foi possível carregar o ranking.
        </p>

        <button onClick={() => refetch()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="ranking">
      <h2>🏆 Ranking</h2>

      <div className="ranking-header">
        <span>#</span>
        <span>Jogador</span>
        <span>Pontos</span>
        <span>Tempo</span>
      </div>

      {data?.data.map((entry, index) => (
        <div
          className="ranking-row"
          key={entry.id}
        >
          <strong>
            {index + 1}
          </strong>

          <span>
            {entry.player}
          </span>

          <span>
            {entry.score}
          </span>

          <span>
            {entry.duration}s
          </span>
        </div>
      ))}
    </div>
  );
}