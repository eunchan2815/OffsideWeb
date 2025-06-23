import axios from "axios";
import { baseURL, key } from "../baseUrl"

const API = axios.create({
  baseURL: baseURL,
  headers: {
    "X-Auth-Token": key,
  }
})

// 리그 정보 상수
export const LEAGUES = {
  PL: {
    code: 'PL',
    name: 'Premier League',
    crest: 'https://crests.football-data.org/PL.png',
    country: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England'
  },
  BL1: {
    code: 'BL1',
    name: 'Bundesliga',
    crest: 'https://crests.football-data.org/BL1.png',
    country: '🇩🇪 Germany'
  },
  PD: {
    code: 'PD',
    name: 'La Liga',
    crest: 'https://crests.football-data.org/laliga.png',
    country: '🇪🇸 Spain'
  },
  SA: {
    code: 'SA',
    name: 'Serie A',
    crest: 'https://crests.football-data.org/SA.png',
    country: '🇮🇹 Italy'
  },
  FL1: {
    code: 'FL1',
    name: 'Ligue 1',
    crest: 'https://crests.football-data.org/FL1.png',
    country: '🇫🇷 France'
  }
};

// 순위표 조회 (다중 리그 지원)
export const getStandings = async (leagueCode = 'BL1') => {
  try {
    const res = await API.get(`/competitions/${leagueCode}/standings`);
    return res.data;
  } catch (error) {
    console.error(`${leagueCode} 순위표 API 호출 오류:`, error);
    throw error;
  }
};

// 득점왕 조회 (다중 리그 지원)
export const getTopScorers = async (leagueCode = 'BL1') => {
  try {
    const res = await API.get(`/competitions/${leagueCode}/scorers`);
    return res.data;
  } catch (error) {
    console.error(`${leagueCode} 득점왕 API 호출 오류:`, error);
    throw error;
  }
};

// 경기 일정 조회 (다중 리그 지원)
export const getMatches = async (leagueCode = 'BL1', dateFrom, dateTo) => {
  try {
    const params = new URLSearchParams();
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    
    const queryString = params.toString();
    const url = queryString 
      ? `/competitions/${leagueCode}/matches?${queryString}`
      : `/competitions/${leagueCode}/matches`;
    
    const res = await API.get(url);
    return res.data;
  } catch (error) {
    console.error(`${leagueCode} 경기 일정 API 호출 오류:`, error);
    throw error;
  }
};

// 모든 리그 정보 반환
export const getAllLeagues = () => {
  return Object.values(LEAGUES);
};

// 특정 리그 정보 반환
export const getLeagueInfo = (leagueCode) => {
  return LEAGUES[leagueCode] || LEAGUES.BL1;
};

// 하위 호환성을 위한 기존 함수들 (deprecated)
export const getPLStandings = async () => {
  console.warn('getPLStandings is deprecated. Use getStandings("PL") instead.');
  return getStandings('PL');
};

export const getManyGoalPlayer = async() => {
  console.warn('getManyGoalPlayer is deprecated. Use getTopScorers("BL1") instead.');
  return getTopScorers('BL1');
};

export const getBLMatches = async (dateFrom, dateTo) => {
  console.warn('getBLMatches is deprecated. Use getMatches("BL1", dateFrom, dateTo) instead.');
  return getMatches('BL1', dateFrom, dateTo);
};