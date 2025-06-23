import React, { useEffect, useState } from 'react';
import { getTopScorers, getAllLeagues, getLeagueInfo } from '../../api/football';
import { Toast } from '../../components/toast';

export const ManyGoal = () => {
  const [scorers, setScorers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState('BL1');
  const [leagues] = useState(getAllLeagues());

  
  const [toastShow, setToastShow] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    fetchScorers();
  }, [selectedLeague]);

  const fetchScorers = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getTopScorers(selectedLeague);
      console.log('득점왕 데이터:', data); // 디버깅용

      if (data && data.scorers) {
        const sortedScorers = data.scorers.sort((a, b) => b.goals - a.goals);
        setScorers(sortedScorers);
      } else {
        console.error('예상치 못한 데이터 구조:', data);
        setScorers([]);
      }
    } catch (error) {
      console.error('득점왕 데이터를 불러오는 중 오류 발생:', error);

      if (error.response?.status === 429) {
        setToastMsg('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
        setToastShow(true);
      } else {
        setError('득점왕 데이터를 불러오는데 실패했습니다.');
      }
      setScorers([]);
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-xl font-bold">{currentLeague.name} 득점왕</h2>
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <img
              src={currentLeague.crest}
              alt={currentLeague.name}
              className="w-8 h-8"
            />
            <div>
              <h2 className="text-xl font-bold">{currentLeague.name} 득점왕</h2>
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
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
          <button
            onClick={fetchScorers}
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
          <img
            src={currentLeague.crest}
            alt={currentLeague.name}
            className="w-8 h-8"
          />
          <div>
            <h2 className="text-xl font-bold">{currentLeague.name} 득점왕</h2>
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

      {scorers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center py-8 text-gray-500">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">데이터가 없습니다</p>
            <p className="text-sm text-gray-500">
              {currentLeague.name}의 득점 데이터를 찾을 수 없습니다.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                  <tr>
                    <th className="py-3 px-4 w-16 text-center">순위</th>
                    <th className="py-3 px-4 min-w-[200px]">선수</th>
                    <th className="py-3 px-4 min-w-[150px]">클럽</th>
                    <th className="py-3 px-4 text-center">경기</th>
                    <th className="py-3 px-4 text-center">골</th>
                    <th className="py-3 px-4 text-center">어시스트</th>
                  </tr>
                </thead>
                <tbody>
                  {scorers.map((scorer, index) => {
                    let rank = index + 1;
                    if (index > 0 && scorers[index - 1].goals === scorer.goals) {
                      let prevIndex = index - 1;
                      while (prevIndex >= 0 && scorers[prevIndex].goals === scorer.goals) {
                        prevIndex--;
                      }
                      rank = prevIndex + 2;
                    }

                    return (
                      <tr
                        key={scorer.player.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 text-center font-medium">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                              rank === 1
                                ? 'bg-yellow-100 text-yellow-800'
                                : rank === 2
                                ? 'bg-gray-100 text-gray-800'
                                : rank === 3
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-blue-50 text-blue-800'
                            }`}
                          >
                            {rank}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm font-medium">
                                {scorer.player.name.charAt(0)}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {scorer.player.name}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {scorer.player.position || scorer.player.section || '-'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={scorer.team.crest}
                              alt={scorer.team.name}
                              className="w-6 h-6 flex-shrink-0"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            <span className="text-gray-900 truncate">{scorer.team.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center text-gray-700">{scorer.playedMatches}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-800 rounded-full font-bold">
                            {scorer.goals}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-gray-700">
                          {scorer.assists ?? '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500 text-center">
            총 {scorers.length}명의 선수 • 득점 순으로 정렬
          </div>
        </>
      )}

      
      <Toast
        message={toastMsg}
        show={toastShow}
        onClose={() => setToastShow(false)}
        duration={4000}
      />
    </div>
  );
};
