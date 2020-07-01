import { Dictionary } from '@reduxjs/toolkit';
import { TGroup, TValue } from '../store/groups';
import { TProductsGroups } from '../store/products';

export const nodeTypes = {
  group: 'group',
  products: 'products',
} as const;

export type TGroupValue = TValue & {
  [key: string]: any;
};

export type TGroupNodeValue<P> = {
  value?: TGroupValue;
  child: TGroupedProducts<P>;
};

export type TGroupNode<P> = {
  type: typeof nodeTypes.group;
  group: TGroup;
  values: TGroupNodeValue<P>[];
};

export type TProductsNode<P> = {
  type: typeof nodeTypes.products;
  products: P[];
};

export type TGroupedProducts<P> = TGroupNode<P> | TProductsNode<P>;

/**
 * Минимальные требования к объекту продукт, чтобы его можно было группировать
 */
export type TMinimalProduct = { id: string; groups: { [key: string]: string } };

/**
 * Функция для модификации значения value в объекте типа TGroupNodeValue
 */
export interface ResolveGroupValue<P> {
  (groupValue: TGroupValue | undefined, products: P[]): TGroupValue | undefined;
}

/**
 * Формирурует дерево продуктов согласно списоку идентификаторов групп
 * @param productsGroupsIds Список идентификаторов групп для фильтрации
 * @param groupsEntities Каталог групп (по id)
 * @param productsCatalog Каталог продуктов
 */
const groupProducts = <
  P extends TMinimalProduct,
  V extends TGroupValue = TGroupValue
>(
  productsGroupsIds: TProductsGroups,
  groupsEntities: Dictionary<TGroup>,
  productsCatalog: P[],
  resolveGroupValue: ResolveGroupValue<P> = (groupValue) => groupValue
): TGroupedProducts<P> => {
  const copyProductsGroupsIds = [...productsGroupsIds];
  const currentGroupId = copyProductsGroupsIds.shift();
  const currentGroup = currentGroupId && groupsEntities[currentGroupId];

  if (currentGroup) {
    const filteredChildren = currentGroup.values.reduce<any[]>(
      (acc, groupValue) => {
        const filteredProducts = productsCatalog.filter(
          (product) => product.groups[currentGroup.id] === groupValue.id
        );

        if (filteredProducts.length) {
          acc.push({
            value: resolveGroupValue(groupValue, filteredProducts),
            child: groupProducts(
              copyProductsGroupsIds,
              groupsEntities,
              filteredProducts,
              resolveGroupValue
            ),
          });
        }

        return acc;
      },
      []
    );

    // Продукты без значения в текущей группе
    const unfilteredProducts = productsCatalog.filter((product) => {
      const thereIsUsedGroup = currentGroup.values.some(
        (groupValue) => product.groups[currentGroup.id] === groupValue.id
      );

      return thereIsUsedGroup === false;
    });

    // Продукты без значения в текущей группе собираются в отдельном узле
    const unfilteredChild = Boolean(unfilteredProducts.length) && {
      value: resolveGroupValue(undefined, unfilteredProducts),
      child: groupProducts(
        copyProductsGroupsIds,
        groupsEntities,
        unfilteredProducts,
        resolveGroupValue
      ),
    };

    return {
      type: nodeTypes.group,
      group: currentGroup,
      values: [
        ...filteredChildren,
        ...(unfilteredChild ? [unfilteredChild] : []),
      ],
    };
  } else {
    return {
      type: nodeTypes.products,
      products: productsCatalog,
    };
  }
};

export default groupProducts;
