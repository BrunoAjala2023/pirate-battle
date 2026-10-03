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
        <p>Não foi possível carregar o ranking.</p>

        <button onClick={() => refetch()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>🏆 Ranking</h2>

      {data?.data.map((entry, index) => (
        <div key={entry.id}>
          <strong>
            #{index + 1} {entry.player}
          </strong>

          <span>
            {" "}
            — {entry.score} pontos
          </span>
        </div>
      ))}
    </div>
  );
}