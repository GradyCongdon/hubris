import _ from "lodash";
import heckSets from "./heckSets.json" with { type: "json" };
import type { Match } from "@/app/types";
export const getSet = () => {
  return _.sample(heckSets) as Match;
}
