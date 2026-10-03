import { useQuery } from "@tanstack/react-query";
import { getMatchHistory } from "../api/historyApi";

export function History() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["match-history"],
    queryFn: getMatchHistory,
  });

  if (isLoading) {
    return <p>Carregando histórico...</p>;
  }

  if (isError) {
    return (
      <div>
        <p>
          Não foi possível carregar o histórico.
        </p>

        <button onClick={() => refetch()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="history">
      <h2>📜 Histórico</h2>

      {data?.data.map((match) => (
        <div
          className="history-row"
          key={match.id}
        >
          <div>
            <strong>
              {match.result === "victory"
                ? "🏆 Vitória"
                : "☠️ Derrota"}
            </strong>

            <span>
              {match.score} pontos
            </span>
          </div>

          <span>
            {match.duration}s
          </span>
        </div>
      ))}
    </div>
  );
}