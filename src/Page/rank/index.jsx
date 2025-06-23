import { useEffect, useState } from "react";
import { getStandings, getAllLeagues, getLeagueInfo } from "../../api/football";

export const TeamRanking = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState('BL1');
  const [leagues] = useState(getAllLeagues());

  useEffect(() => {
    fetchData();
  }, [selectedLeague]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getStandings(selectedLeague);
      console.log('API 응답:', data);
      
      if (data && data.standings && data.standings[0] && data.standings[0].table) {
        const table = data.standings[0].table;
        const sortedTeams = table.sort((a, b) => {
          if (b.points !== a.points) {
            return b.points - a.points;
          }
          return b.goalDifference - a.goalDifference;
        });
        setTeams(sortedTeams);
      } else {
        console.error('예상치 못한 데이터 구조:', data);
        setError('데이터 구조가 올바르지 않습니다.');
      }
    } catch (err) {
      console.error('API 호출 실패:', err);
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getPositionInfo = (position, leagueCode) => {
    // 리그별로 다른 규칙 적용
    switch (leagueCode) {
      case 'PL':
        if (position <= 4) {
          return {
            bgColor: 'bg-blue-50 border-l-4 border-blue-500',
            textColor: 'text-blue-700',
            description: 'UEFA 챔피언스리그',
          };
        } else if (position === 5) {
          return {
            bgColor: 'bg-green-50 border-l-4 border-green-500',
            textColor: 'text-green-700',
            description: 'UEFA 유로파리그',
          };
        } else if (position === 6) {
          return {
            bgColor: 'bg-yellow-50 border-l-4 border-yellow-500',
            textColor: 'text-yellow-700',
            description: 'UEFA 컨퍼런스리그',
          };
        } else if (position >= 18) {
          return {
            bgColor: 'bg-red-50 border-l-4 border-red-500',
            textColor: 'text-red-700',
            description: '강등권',
          };
        }
        break;
      case 'BL1':
        if (position <= 4) {
          return {
            bgColor: 'bg-blue-50 border-l-4 border-blue-500',
            textColor: 'text-blue-700',
            description: 'UEFA 챔피언스리그',
          };
        } else if (position === 5) {
          return {
            bgColor: 'bg-green-50 border-l-4 border-green-500',
            textColor: 'text-green-700',
            description: 'UEFA 유로파리그',
          };
        } else if (position === 6) {
          return {
            bgColor: 'bg-yellow-50 border-l-4 border-yellow-500',
            textColor: 'text-yellow-700',
            description: 'UEFA 컨퍼런스리그',
          };
        } else if (position >= 16) {
          return {
            bgColor: 'bg-orange-50 border-l-4 border-orange-500',
            textColor: 'text-orange-700',
            description: '강등 플레이오프',
          };
        } else if (position >= 17) {
          return {
            bgColor: 'bg-red-50 border-l-4 border-red-500',
            textColor: 'text-red-700',
            description: '강등권',
          };
        }
        break;
      case 'PD':
      case 'SA':
        if (position <= 4) {
          return {
            bgColor: 'bg-blue-50 border-l-4 border-blue-500',
            textColor: 'text-blue-700',
            description: 'UEFA 챔피언스리그',
          };
        } else if (position === 5) {
          return {
            bgColor: 'bg-green-50 border-l-4 border-green-500',
            textColor: 'text-green-700',
            description: 'UEFA 유로파리그',
          };
        } else if (position === 6) {
          return {
            bgColor: 'bg-yellow-50 border-l-4 border-yellow-500',
            textColor: 'text-yellow-700',
            description: 'UEFA 컨퍼런스리그',
          };
        } else if (position >= 18) {
          return {
            bgColor: 'bg-red-50 border-l-4 border-red-500',
            textColor: 'text-red-700',
            description: '강등권',
          };
        }
        break;
      case 'FL1':
        if (position <= 3) {
          return {
            bgColor: 'bg-blue-50 border-l-4 border-blue-500',
            textColor: 'text-blue-700',
            description: 'UEFA 챔피언스리그',
          };
        } else if (position === 4) {
          return {
            bgColor: 'bg-green-50 border-l-4 border-green-500',
            textColor: 'text-green-700',
            description: 'UEFA 유로파리그',
          };
        } else if (position === 5) {
          return {
            bgColor: 'bg-yellow-50 border-l-4 border-yellow-500',
            textColor: 'text-yellow-700',
            description: 'UEFA 컨퍼런스리그',
          };
        } else if (position >= 18) {
          return {
            bgColor: 'bg-red-50 border-l-4 border-red-500',
            textColor: 'text-red-700',
            description: '강등권',
          };
        }
        break;
    }
    
    return {
      bgColor: 'bg-white',
      textColor: 'text-gray-700',
      description: '',
    };
  };

  const currentLeague = getLeagueInfo(selectedLeague);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto mt-8">
        <div className="flex items-center gap-2 mb-6">
          <img
            src={currentLeague.crest}
            alt={currentLeague.name}
            className="w-6 h-6"
          />
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
          <img
            src={currentLeague.crest}
            alt={currentLeague.name}
            className="w-6 h-6"
          />
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
      {/* 헤더 및 리그 선택 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <img
            src={currentLeague.crest}
            alt={currentLeague.name}
            className="w-8 h-8"
          />
          <div>
            <h2 className="text-xl font-bold">{currentLeague.name}</h2>
            <p className="text-sm text-gray-600">{currentLeague.country}</p>
          </div>
        </div>
        
        {/* 리그 선택 드롭다운 */}
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

      {/* 범례 */}
      <div className="mb-4 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-600">챔피언스리그</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-600">유로파리그</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-gray-600">컨퍼런스리그</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-600">강등권</span>
        </div>
        {selectedLeague === 'BL1' && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span className="text-gray-600">플레이오프</span>
          </div>
        )}
      </div>

      {/* 순위표 */}
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
                const positionInfo = getPositionInfo(position, selectedLeague);
                
                return (
                  <tr 
                    key={team.team.id} 
                    className={`border-b hover:bg-gray-50 transition-colors ${positionInfo.bgColor}`}
                  >
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <span className={`font-bold ${positionInfo.textColor}`}>
                          {position}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={team.team.crest}
                          alt={team.team.name}
                          className="w-6 h-6 flex-shrink-0"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">{team.team.name}</div>
                          {positionInfo.description && (
                            <div className={`text-xs ${positionInfo.textColor} truncate`}>
                              {positionInfo.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-700">{team.playedGames}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 rounded text-xs font-medium">
                        {team.won}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                        {team.draw}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-800 rounded text-xs font-medium">
                        {team.lost}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-medium ${
                        team.goalDifference > 0 ? 'text-green-600' : 
                        team.goalDifference < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {team.goalDifference >= 0
                          ? `+${team.goalDifference}`
                          : team.goalDifference}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-bold">
                        {team.points}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 하단 정보 */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        총 {teams.length}개 팀 • 승점 순으로 정렬 • 승점이 같으면 득실차 순
      </div>
    </div>
  );
};