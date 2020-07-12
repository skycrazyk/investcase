import { Dictionary } from '@reduxjs/toolkit';
import { TGroup, TValue } from '../store/groups';
import { TProductsGroups } from '../store/products';

export const nodeTypes = {
  group: 'group',
  products: 'products',
} as const;

// TODO: По идее надо как-то прокидывать тип из вне
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
 * Путь до текущей группы. Нужно для функционала сравнения
 */
export type TGroupPath = (string | null)[];

/**
 * Функция для модификации значения value в объекте типа TGroupNodeValue
 */
export interface ResolveGroupValue<P> {
  (groupValue: TGroupValue | undefined, products: P[], groupPath: TGroupPath):
    | TGroupValue
    | undefined;
}

export const isGroupNode = <T>(
  node: TGroupedProducts<T>
): node is TGroupNode<T> => {
  return node.type === nodeTypes.group;
};

/**
 * Формирурует дерево продуктов согласно списоку идентификаторов групп
 * @param productsGroupsIds Список идентификаторов групп для фильтрации
 * @param groupsEntities Каталог групп (по id)
 * @param productsCatalog Каталог продуктов
 */
const groupProducts = <P extends TMinimalProduct>(
  productsGroupsIds: TProductsGroups,
  groupsEntities: Dictionary<TGroup>,
  productsCatalog: P[],
  resolveGroupValue: ResolveGroupValue<P> = (groupValue) => groupValue,
  groupPath: TGroupPath = []
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

        const copyGroupPath = [...groupPath, groupValue.id];

        if (filteredProducts.length) {
          acc.push({
            value: resolveGroupValue(
              groupValue,
              filteredProducts,
              copyGroupPath
            ),
            child: groupProducts(
              copyProductsGroupsIds,
              groupsEntities,
              filteredProducts,
              resolveGroupValue,
              copyGroupPath
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

    const copyGroupPath = [...groupPath, null];

    // Продукты без значения в текущей группе собираются в отдельном узле
    const unfilteredChild = Boolean(unfilteredProducts.length) && {
      value: resolveGroupValue(undefined, unfilteredProducts, copyGroupPath),
      child: groupProducts(
        copyProductsGroupsIds,
        groupsEntities,
        unfilteredProducts,
        resolveGroupValue,
        copyGroupPath
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
