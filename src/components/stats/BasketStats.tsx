/* eslint-disable react/jsx-props-no-spreading */

import React, {
  ComponentProps,
  FC,
  ReactComponentElement,
  useMemo,
} from 'react';
import { VictoryBar } from 'victory-bar';
import { VictoryChart } from 'victory-chart';
import { VictoryStack } from 'victory-stack';
import { VictoryAxis } from 'victory-axis';
import {
  VictoryLabel,
  VictoryContainerProps,
  VictoryContainer,
} from 'victory-core';

import Skeleton from 'react-loading-skeleton/lib';
import { useDataState } from '../../context/DataProvider/DataProvider';
import { TokenIconSvg } from '../icons/TokenIcon';
import { DataState } from '../../context/DataProvider/types';
import { BigDecimal } from '../../web3/BigDecimal';

const TOKEN_COLORS = {
  mUSD: '#000',
  DAI: '#EEB345',
  USDT: '#26A17B',
  TUSD: '#002868',
  USDC: '#2775CA',
};

const TOKEN_HATCH_COLORS = {
  mUSD: '#000',
  DAI: '#e0c184',
  USDT: '#7dc6af',
  TUSD: '#a6bfe5',
  USDC: '#a7c0de',
};

interface Datum {
  symbol: string;
  basketShareAsPercentage: number;
  maxWeightAsPercentage: number;
}

const ICON_SIZE = 16;

const numericLabels = {
  fontFamily: `'DM Mono', monospace`,
  fontSize: 8,
  textAnchor: 'end',
};

const AxisLabel: FC<ComponentProps<typeof VictoryLabel>> = ({
  text,
  x,
  y,
  style,
  ...props
}) => (
  <g>
    <TokenIconSvg
      width={ICON_SIZE}
      height={ICON_SIZE}
      x={0}
      y={(y || 0) - ICON_SIZE / 2}
      symbol={text as string}
    />
    <VictoryLabel
      text={text}
      x={x}
      y={y}
      dx={16}
      style={{
        ...style,
        textAnchor: 'start',
        textShadow: `0 1px 2px ${
          TOKEN_COLORS[text as keyof typeof TOKEN_COLORS]
        }`,
      }}
      {...props}
    />
  </g>
);

const Hatch = ({
  symbol,
}: {
  symbol: keyof typeof TOKEN_HATCH_COLORS;
}): ReactComponentElement<'pattern'> => (
  <pattern
    id={`hatch-${symbol}`}
    patternUnits="userSpaceOnUse"
    patternTransform="rotate(45 0 0)"
    width="4"
    height="4"
  >
    <line
      x1="0"
      y1="0"
      x2="0"
      y2="4"
      style={{
        stroke: TOKEN_HATCH_COLORS[symbol],
        strokeWidth: 4,
      }}
    />
  </pattern>
);

const Container: FC<VictoryContainerProps> = ({ children, ...props }) => (
  <VictoryContainer {...props}>
    <Hatch symbol="DAI" />
    <Hatch symbol="USDT" />
    <Hatch symbol="USDC" />
    <Hatch symbol="TUSD" />
    <>{children}</>
  </VictoryContainer>
);

export const BasketStats: FC<{ simulation?: DataState }> = ({ simulation }) => {
  const dataState = useDataState();
  const bAssets = simulation?.bAssets || dataState?.bAssets || {};

  const data: Datum[] = useMemo(
    () =>
      bAssets
        ? Object.values(bAssets).map(({ basketShare, maxWeight, symbol }) => {
            const basketShareAsPercentage = basketShare.toPercent();
            const maxWeightAsPercentage = new BigDecimal(
              maxWeight,
              18,
            ).toPercent();

            // Get the remainder so that it can be stacked after the basket share
            const remainderMaxWeight =
              basketShareAsPercentage > maxWeightAsPercentage
                ? 0
                : maxWeightAsPercentage - basketShareAsPercentage;

            return {
              symbol: symbol as string,
              basketShareAsPercentage,
              maxWeightAsPercentage: remainderMaxWeight,
            };
          })
        : [],
    [bAssets],
  );

  return data.length > 0 ? (
    <VictoryChart
      containerComponent={<Container />}
      height={100}
      width={200}
      padding={{ left: 20, top: 16, bottom: 16, right: 40 }}
      animate
    >
      <VictoryStack horizontal>
        <VictoryBar
          style={{
            data: {
              fill: ({ datum: { symbol } }) =>
                TOKEN_COLORS[symbol as keyof typeof TOKEN_COLORS],
            },
            labels: numericLabels,
          }}
          labelComponent={<VictoryLabel x={185} />}
          labels={({ datum: { basketShareAsPercentage } }: { datum: Datum }) =>
            `${basketShareAsPercentage.toFixed(2)}%`
          }
          barRatio={1.8}
          data={data}
          x="symbol"
          y="basketShareAsPercentage"
        />
        <VictoryBar
          style={{
            data: {
              fill: ({ datum: { symbol } }) => `url(#hatch-${symbol})`,
            },
          }}
          labelComponent={<div />}
          barRatio={1.8}
          data={data}
          x="symbol"
          y="maxWeightAsPercentage"
        />
      </VictoryStack>
      <VictoryAxis
        tickLabelComponent={<AxisLabel />}
        style={{
          axis: { stroke: 'none' },
          tickLabels: {
            fontFamily: `'Poppins-Bold', sans-serif`,
            fontWeight: 'bold',
            fontSize: 12,
            fill: '#fff',
            textAnchor: 'start',
          },
        }}
      />
    </VictoryChart>
  ) : (
    <Skeleton height={132} />
  );
};
