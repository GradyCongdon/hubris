import _ from "lodash";
import heckSets from "./heckSets.json" with { type: "json" };
import type { APIMatch } from "@/app/types";
import { convertFromAPI } from "@/app/player/lib";

const _heckCode = "2EC3DCA33129F30";

export const FAKE_getPlayerMatch = () => {
  const _set = _.sample(heckSets) as APIMatch;
  const heck = {
      name: "heckscape",
      rCode: _heckCode,
      character: "Ky",
      characterShort: "KY"
  }
  return convertFromAPI(heck, [_set]);
}