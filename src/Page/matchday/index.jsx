import { useEffect, useState } from "react";
import { getMatches, getAllLeagues, getLeagueInfo } from "../../api/football";

export const MatchDay = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('BL1');
  const [leagues] = useState(getAllLeagues());

  // 기본 날짜 설정 (오늘부터 2주 후까지)
  useEffect(() => {
    const today = new Date();
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(today.getDate() + 14);
    
    setDateFrom(today.toISOString().split('T')[0]);
    setDateTo(twoWeeksLater.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (dateFrom && dateTo) {
      fetchMatches();
    }
  }, [dateFrom, dateTo, selectedLeague]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // getBLMatches 대신 getMatches 사용하고 selectedLeague 전달
      const data = await getMatches(selectedLeague, dateFrom, dateTo);
      console.log('경기 일정 API 응답:', data);
      
      if (data && data.matches) {
        // 날짜순으로 정렬
        const sortedMatches = data.matches.sort((a, b) => 
          new Date(a.utcDate) - new Date(b.utcDate)
        );
        
        // MatchType 인터페이스에 맞게 데이터 변환
        const transformedMatches = sortedMatches.map(match => ({
          matchday: match.matchday,
          homeScore: match.score.fullTime.home,
          awayScore: match.score.fullTime.away,
          homeLogo: match.homeTeam.crest,
          awayLogo: match.awayTeam.crest,
          homeTeam: match.homeTeam.name,
          awayTeam: match.awayTeam.name,
          tableTime: match.utcDate,
        }));
        
        setMatches(transformedMatches);
      } else {
        setMatches([]); // 빈 배열로 설정
      }
    } catch (err) {
      console.error('경기 일정 API 호출 실패:', err);
      setError('경기 일정을 불러오는데 실패했습니다.');
      setMatches([]); // 에러 시에도 빈 배열로 설정
    } finally {
      setLoading(false);
    }
  };

  const formatMatchTime = (utcDate) => {
    const date = new Date(utcDate);
    const options = {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Seoul'
    };
    return date.toLocaleDateString('ko-KR', options);
  };

  const getMatchStatus = (match) => {
    if (match.homeScore !== null && match.awayScore !== null) {
      return 'finished';
    }
    const matchTime = new Date(match.tableTime);
    const now = new Date();
    return matchTime > now ? 'scheduled' : 'live';
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
          <h2 className="text-xl font-bold">{currentLeague.name} 경기 일정</h2>
        </div>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">경기 일정을 불러오는 중...</p>
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
              <h2 className="text-xl font-bold">{currentLeague.name} 경기 일정</h2>
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

        {/* 날짜 선택 필터 */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">시작일:</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">종료일:</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={fetchMatches}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              검색
            </button>
          </div>
        </div>

        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
          <button
            onClick={fetchMatches}
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
            <h2 className="text-xl font-bold">{currentLeague.name} 경기 일정</h2>
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

      {/* 날짜 선택 필터 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">시작일:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">종료일:</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={fetchMatches}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            검색
          </button>
        </div>
      </div>

      {/* 경기 일정 목록 */}
      <div className="space-y-4">
        {matches.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center py-8 text-gray-500">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4h6m-6 4h6m-6 4h6" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">경기가 없습니다</p>
              <p className="text-sm text-gray-500">
                선택한 기간({dateFrom} ~ {dateTo})에 {currentLeague.name} 경기가 없습니다.
              </p>
            </div>
          </div>
        ) : (
          matches.map((match, index) => {
            const status = getMatchStatus(match);
            
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-500">
                      {match.matchday}라운드
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatMatchTime(match.tableTime)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {/* 홈팀 */}
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={match.homeLogo}
                        alt={match.homeTeam}
                        className="w-8 h-8"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <span className="font-medium text-gray-900 truncate">
                        {match.homeTeam}
                      </span>
                    </div>

                    {/* 스코어 또는 상태 */}
                    <div className="flex items-center gap-4 mx-4">
                      {status === 'finished' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            {match.homeScore}
                          </span>
                          <span className="text-gray-400">-</span>
                          <span className="text-lg font-bold text-gray-900">
                            {match.awayScore}
                          </span>
                        </div>
                      ) : status === 'live' ? (
                        <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          LIVE
                        </div>
                      ) : (
                        <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          예정
                        </div>
                      )}
                    </div>

                    {/* 원정팀 */}
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      <span className="font-medium text-gray-900 truncate">
                        {match.awayTeam}
                      </span>
                      <img
                        src={match.awayLogo}
                        alt={match.awayTeam}
                        className="w-8 h-8"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 하단 정보 */}
      {matches.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          총 {matches.length}경기 • {dateFrom} ~ {dateTo}
        </div>
      )}
    </div>
  );
};

export default MatchDay;