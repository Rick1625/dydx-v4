import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { STRING_KEYS } from '@/constants/localization';
import { AppRoute, PortfolioRoute } from '@/constants/routes';

import { useBreakpoints, useStringGetter } from '@/hooks';

import { AttachedExpandingSection } from '@/components/ContentSection';
import { ContentSectionHeader } from '@/components/ContentSectionHeader';
import { PositionsTable, PositionsTableColumnKey } from '@/views/tables/PositionsTable';

import {
  calculateShouldRenderTriggersInPositionsTable,
} from '@/state/accountCalculators';

import { isTruthy } from '@/lib/isTruthy';
import { testFlags } from '@/lib/testFlags';

export const Positions = () => {
  const stringGetter = useStringGetter();
  const { isTablet, isNotTablet } = useBreakpoints();
  const navigate = useNavigate();

  const shouldRenderTriggers = useSelector(calculateShouldRenderTriggersInPositionsTable);
  // TODO: CT-503
  // const shouldRenderActions = useSelector(calculateShouldRenderActionsInPositionsTable);

  return (
    <AttachedExpandingSection>
      {isNotTablet && <ContentSectionHeader title={stringGetter({ key: STRING_KEYS.POSITIONS })} />}

      <PositionsTable
        columnKeys={
          isTablet
            ? [
                PositionsTableColumnKey.Details,
                PositionsTableColumnKey.IndexEntry,
                PositionsTableColumnKey.PnL,
              ]
            : [
                PositionsTableColumnKey.Market,
                PositionsTableColumnKey.Side,
                PositionsTableColumnKey.Size,
                PositionsTableColumnKey.Leverage,
                PositionsTableColumnKey.LiquidationAndOraclePrice,
                testFlags.isolatedMargin && PositionsTableColumnKey.Margin,
                PositionsTableColumnKey.UnrealizedPnl,
                PositionsTableColumnKey.RealizedPnl,
                PositionsTableColumnKey.AverageOpenAndClose,
                shouldRenderTriggers && PositionsTableColumnKey.Triggers,
                // TODO: CT-503 re-enable when close positions dialog is created
                // shouldRenderActions && PositionsTableColumnKey.Actions,
              ].filter(isTruthy)
        }
        currentRoute={`${AppRoute.Portfolio}/${PortfolioRoute.Positions}`}
        withOuterBorder={isNotTablet}
        navigateToOrders={() =>
          navigate(`${AppRoute.Portfolio}/${PortfolioRoute.Orders}`, {
            state: { from: AppRoute.Portfolio },
          })
        }
      />
    </AttachedExpandingSection>
  );
};
