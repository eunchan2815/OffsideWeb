import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStandings, getAllLeagues, getLeagueInfo } from "../../api/football";
import { Toast } from "../../components/toast";

export const TeamRanking = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState("BL1");
  const [leagues] = useState(getAllLeagues());


  const [toastShow, setToastShow] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    fetchData();
  }, [selectedLeague]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStandings(selectedLeague);
      if (data && data.standings && data.standings[0] && data.standings[0].table) {
        const table = data.standings[0].table;
        const sortedTeams = table.sort((a, b) =>
          b.points !== a.points ? b.points - a.points : b.goalDifference - a.goalDifference
        );
        setTeams(sortedTeams);
      } else {
        setError("데이터 구조가 올바르지 않습니다.");
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setToastMsg("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
        setToastShow(true);
      } else {
        setError("데이터를 불러오는데 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getPositionInfo = (position, leagueCode) => {
    switch (leagueCode) {
      case "PL":
        if (position <= 4)
          return { bgColor: "bg-blue-50 border-l-4 border-blue-500", textColor: "text-blue-700", description: "챔피언스리그" };
        if (position === 5)
          return { bgColor: "bg-green-50 border-l-4 border-green-500", textColor: "text-green-700", description: "유로파리그" };
        if (position === 6)
          return { bgColor: "bg-yellow-50 border-l-4 border-yellow-500", textColor: "text-yellow-700", description: "컨퍼런스리그" };
        if (position >= 18)
          return { bgColor: "bg-red-50 border-l-4 border-red-500", textColor: "text-red-700", description: "강등권" };
        break;
      case "BL1":
        if (position <= 4)
          return { bgColor: "bg-blue-50 border-l-4 border-blue-500", textColor: "text-blue-700", description: "챔피언스리그" };
        if (position === 5)
          return { bgColor: "bg-green-50 border-l-4 border-green-500", textColor: "text-green-700", description: "유로파리그" };
        if (position === 6)
          return { bgColor: "bg-yellow-50 border-l-4 border-yellow-500", textColor: "text-yellow-700", description: "컨퍼런스리그" };
        if (position === 16)
          return { bgColor: "bg-orange-50 border-l-4 border-orange-500", textColor: "text-orange-700", description: "강등 플레이오프" };
        if (position >= 17)
          return { bgColor: "bg-red-50 border-l-4 border-red-500", textColor: "text-red-700", description: "강등권" };
        break;
      case "PD":
      case "SA":
        if (position <= 4)
          return { bgColor: "bg-blue-50 border-l-4 border-blue-500", textColor: "text-blue-700", description: "챔피언스리그" };
        if (position === 5)
          return { bgColor: "bg-green-50 border-l-4 border-green-500", textColor: "text-green-700", description: "유로파리그" };
        if (position === 6)
          return { bgColor: "bg-yellow-50 border-l-4 border-yellow-500", textColor: "text-yellow-700", description: "컨퍼런스리그" };
        if (position >= 18)
          return { bgColor: "bg-red-50 border-l-4 border-red-500", textColor: "text-red-700", description: "강등권" };
        break;
      case "FL1":
        if (position <= 3)
          return { bgColor: "bg-blue-50 border-l-4 border-blue-500", textColor: "text-blue-700", description: "챔피언스리그" };
        if (position === 4)
          return { bgColor: "bg-green-50 border-l-4 border-green-500", textColor: "text-green-700", description: "유로파리그" };
        if (position === 5)
          return { bgColor: "bg-yellow-50 border-l-4 border-yellow-500", textColor: "text-yellow-700", description: "컨퍼런스리그" };
        if (position >= 18)
          return { bgColor: "bg-red-50 border-l-4 border-red-500", textColor: "text-red-700", description: "강등권" };
        break;
    }
    return { bgColor: "bg-white", textColor: "text-gray-700", description: "" };
  };

  const currentLeague = getLeagueInfo(selectedLeague);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto mt-8">
        <div className="flex items-center gap-2 mb-6">
          <img src={currentLeague.crest} alt={currentLeague.name} className="w-6 h-6" />
          <h2 className="text-xl font-bold">{currentLeague.name}</h2>
        </div>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto mt-8">
        <div className="flex items-center gap-2 mb-6">
          <img src={currentLeague.crest} alt={currentLeague.name} className="w-6 h-6" />
          <h2 className="text-xl font-bold">{currentLeague.name}</h2>
        </div>
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <img src={currentLeague.crest} alt={currentLeague.name} className="w-8 h-8" />
          <div>
            <h2 className="text-xl font-bold">{currentLeague.name}</h2>
            <p className="text-sm text-gray-600">{currentLeague.country}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">리그 선택:</label>
          <select
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {leagues.map((league) => (
              <option key={league.code} value={league.code}>
                {league.name} ({league.country})
              </option>
            ))}
          </select>
        </div>
      </div>

      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b">
              <tr>
                <th className="py-3 px-4 w-16 text-center">순위</th>
                <th className="py-3 px-4 min-w-[200px]">클럽</th>
                <th className="py-3 px-4 text-center">경기</th>
                <th className="py-3 px-4 text-center">승</th>
                <th className="py-3 px-4 text-center">무</th>
                <th className="py-3 px-4 text-center">패</th>
                <th className="py-3 px-4 text-center">득실차</th>
                <th className="py-3 px-4 text-center font-bold">승점</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => {
                const position = index + 1;
                const info = getPositionInfo(position, selectedLeague);
                return (
                  <tr key={team.team.id} className={`border-b hover:bg-gray-50 ${info.bgColor}`}>
                    <td className={`py-3 px-4 text-center font-bold ${info.textColor}`}>{position}</td>
                    <td className="py-3 px-4">
                      <div
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-1 rounded"
                        onClick={() => navigate(`/teams/${team.team.id}`)}
                      >
                        <img
                          src={team.team.crest}
                          alt={team.team.name}
                          className="w-6 h-6"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">{team.team.name}</div>
                          {info.description && <div className={`text-xs ${info.textColor}`}>{info.description}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-700">{team.playedGames}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block bg-green-100 text-green-800 rounded px-2">{team.won}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block bg-yellow-100 text-yellow-800 rounded px-2">{team.draw}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block bg-red-100 text-red-800 rounded px-2">{team.lost}</span>
                    </td>
                    <td
                      className={`py-3 px-4 text-center font-medium ${
                        team.goalDifference > 0
                          ? "text-green-600"
                          : team.goalDifference < 0
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {team.goalDifference >= 0 ? `+${team.goalDifference}` : team.goalDifference}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 font-bold">{team.points}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        총 {teams.length}개 팀 • 승점 순으로 정렬 • 승점이 같으면 득실차 순
      </div>


      <Toast
        message={toastMsg}
        show={toastShow}
        onClose={() => setToastShow(false)}
        duration={4000}
      />
    </div>
  );
};
