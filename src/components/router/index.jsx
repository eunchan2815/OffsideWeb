import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Rootlayout } from "../layout/Rootlayout";
import { TeamRanking } from "../../Page/rank";
import { ManyGoal } from "../../Page/manyGoal";
import { MatchDay } from "../../Page/matchday";
import { TeamDetail } from "../../Page/detail";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Rootlayout />}>
          <Route index element={<TeamRanking />} />
          <Route path="many-goal" element={<ManyGoal />} />
          <Route path="matchday" element={<MatchDay />} />
          <Route path="teams/:teamId" element={<TeamDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
