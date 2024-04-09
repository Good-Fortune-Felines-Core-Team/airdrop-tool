import type { Contract } from "near-api-js";
import type TokenMethod from "./TokenMethod";

type TokenContract = Contract & TokenMethod;

export default TokenContract;
