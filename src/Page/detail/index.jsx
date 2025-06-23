import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTeamInfo } from "../../api/football";

export const TeamDetail = () => {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const data = await getTeamInfo(teamId);
        setTeam(data);
      } catch (err) {
        setError("팀 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [teamId]);

  const getPositionBadge = (position) => {
    const map = {
      Goalkeeper: "bg-blue-100 text-blue-800",
      Defender: "bg-green-100 text-green-800",
      Midfielder: "bg-yellow-100 text-yellow-800",
      Attacker: "bg-red-100 text-red-800",
    };
    return map[position] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto mt-8 text-center py-16">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">팀 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!team) return null;

  return (
    <div className="max-w-5xl mx-auto mt-8">
      {/* 팀 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <img src={team.crest} alt={team.name} className="w-12 h-12" />
        <div>
          <h1 className="text-2xl font-bold">{team.name}</h1>
          <p className="text-gray-600">{team.venue} • {team.founded}년 창단</p>
        </div>
      </div>

      {/* 기본 정보 & 감독 */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">기본 정보</h2>
          <ul className="text-sm text-gray-700 space-y-1">
            <li><strong>약칭:</strong> {team.tla}</li>
            <li><strong>국가:</strong> {team.area.name}</li>
            <li><strong>주소:</strong> {team.address}</li>
            <li><strong>홈페이지:</strong> <a href={team.website} target="_blank" className="text-blue-600 underline">{team.website}</a></li>
            <li><strong>클럽 색상:</strong> {team.clubColors}</li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">감독</h2>
          <p className="text-sm text-gray-700">{team.coach?.name || '정보 없음'} ({team.coach?.nationality})</p>
          {team.coach?.contract && (
            <p className="text-xs text-gray-500 mt-1">
              계약 기간: {team.coach.contract.start} ~ {team.coach.contract.until}
            </p>
          )}
        </div>
      </div>

      {/* 선수단 프로필 카드 그리드 */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">선수단</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {team.squad.map((player) => (
            <div
              key={player.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex flex-col items-center text-center"
            >
              {/* 얼굴 아이콘 또는 이미지 */}
              <div className="w-20 h-20 mb-3 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                {player.photo ? (
                  <img
                    src={player.photo}
                    alt={player.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
              <h3 className="font-semibold text-lg text-gray-900 truncate w-full">{player.name}</h3>
              <span
                className={`mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getPositionBadge(player.position)}`}
              >
                {player.position || "정보 없음"}
              </span>
              <p className="mt-2 text-gray-600 text-sm">{player.nationality}</p>
              <p className="text-gray-500 text-xs">{player.dateOfBirth}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-500 text-right">
          총 {team.squad.length}명
        </p>
      </div>
    </div>
  );
};
