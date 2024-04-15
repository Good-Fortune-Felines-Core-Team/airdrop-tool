import type { Contract } from 'near-api-js';
import type ITokenMethod from './ITokenMethod';

type ITokenContract = Contract & ITokenMethod;

export default ITokenContract;
