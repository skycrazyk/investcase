import { Dictionary } from '@reduxjs/toolkit';
import { TGroup, TValue } from '../store/groups';
import { TProduct, TProductsGroups } from '../store/products';

export const nodeTypes = {
  group: 'group',
  products: 'products',
} as const;

export type TGroupNodeValue = {
  value?: TValue;
  child: TGroupedProducts;
};

export type TGroupNode = {
  type: typeof nodeTypes.group;
  group: TGroup;
  values: TGroupNodeValue[];
};

export type TProductsNode = {
  type: typeof nodeTypes.products;
  products: TProduct[];
};

export type TGroupedProducts = TGroupNode | TProductsNode;

/**
 * Формирурует дерево продуктов согласно списоку идентификаторов групп
 * @param productsGroupsIds Список идентификаторов групп для фильтрации
 * @param groupsEntities Каталог групп (по id)
 * @param productsCatalog Каталог продуктов
 */
const groupProducts = (
  productsGroupsIds: TProductsGroups,
  groupsEntities: Dictionary<TGroup>,
  productsCatalog: TProduct[]
): TGroupedProducts => {
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
            value: groupValue,
            child: groupProducts(
              copyProductsGroupsIds,
              groupsEntities,
              filteredProducts
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
      value: undefined,
      child: groupProducts(
        copyProductsGroupsIds,
        groupsEntities,
        unfilteredProducts
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
