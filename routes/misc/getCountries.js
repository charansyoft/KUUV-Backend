import { countries } from "../../helpers/staticdata/countries.js";
import { response200 } from "../../responses/successResponses.js";

export default async function getCountries(req, res) {
  try {
    return response200(res, countries);
  } catch (err) {
    console.log(err);
  }
}
