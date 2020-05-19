import {
  Masset,
  Basset,
  MassetSubSubscription,
  Basket,
} from '../../graphql/generated';
import {
  TokenDetailsWithBalance,
  State as TokensState,
} from './TokensProvider';
import { ContractNames } from '../../types';

export interface BassetData
  extends Partial<
    Pick<
      Basset,
      'isTransferFeeCharged' | 'maxWeight' | 'ratio' | 'status' | 'vaultBalance'
    >
  > {
  address: string;
  token: Partial<TokenDetailsWithBalance>;
  overweight?: boolean;
}

export type BasketData = Partial<
  Pick<Basket, 'collateralisationRatio' | 'undergoingRecol' | 'failed'>
>;

export interface MassetData {
  bAssets: BassetData[];
  basket: BasketData;
  feeRate: Masset['feeRate'] | null;
  token: Partial<TokenDetailsWithBalance>;
  loading: boolean;
}

export interface State {
  [ContractNames.mUSD]: MassetData;
  // Other mAssets go here
}

export enum Actions {
  UpdateMassetData,
  UpdateTokens,
}

export type Action =
  | {
      type: Actions.UpdateMassetData;
      payload: { data: MassetSubSubscription | undefined; loading: boolean };
    }
  | { type: Actions.UpdateTokens; payload: TokensState };