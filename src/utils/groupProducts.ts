import { Dictionary } from '@reduxjs/toolkit';
import { TGroup, TValue } from '../store/groups';
import { TProductsGroups } from '../store/products';

export const nodeTypes = {
  group: 'group',
  products: 'products',
} as const;

export type TGroupNodeValue<P, V = TValue> = {
  value?: V;
  child: TGroupedProducts<P, V>;
};

export type TGroupNode<P, V = TValue> = {
  type: typeof nodeTypes.group;
  group: TGroup;
  values: TGroupNodeValue<P, V>[];
};

export type TProductsNode<P> = {
  type: typeof nodeTypes.products;
  products: P[];
};

export type TGroupedProducts<P, V = TValue> =
  | TGroupNode<P, V>
  | TProductsNode<P>;

/**
 * Минимальные требования к объекту продукт, чтобы его можно было группировать
 */
export type TMinimalProduct = { id: string; groups: { [key: string]: string } };

/**
 * Функция для модификации значения value в объекте типа TGroupNodeValue
 */
export interface ResolveGroupValue<P, V> {
  (groupValue: TValue | undefined, products: P[]): V | TValue | undefined;
}

/**
 * Формирурует дерево продуктов согласно списоку идентификаторов групп
 * @param productsGroupsIds Список идентификаторов групп для фильтрации
 * @param groupsEntities Каталог групп (по id)
 * @param productsCatalog Каталог продуктов
 */
const groupProducts = <P extends TMinimalProduct, V extends TValue = TValue>(
  productsGroupsIds: TProductsGroups,
  groupsEntities: Dictionary<TGroup>,
  productsCatalog: P[],
  resolveGroupValue: ResolveGroupValue<P, V> = (groupValue) => groupValue
): TGroupedProducts<P, V> => {
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
