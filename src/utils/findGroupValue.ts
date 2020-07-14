import {
  TGroupPath,
  TMinimalProduct,
  TGroupedProducts,
  TGroupNodeValue,
  isGroupNode,
} from './groupProducts';

export default function findGroupValue<
  T extends TGroupedProducts<TMinimalProduct> = TGroupedProducts<
    TMinimalProduct
  >
>(
  groupedProducts: T,
  groupPath: TGroupPath
): TGroupNodeValue<TMinimalProduct> | undefined {
  if (isGroupNode(groupedProducts)) {
    const copyGroupPath = [...groupPath];
    const needGroupValueId = copyGroupPath.shift();

    let needGroupValue;

    if (needGroupValueId === undefined) {
      needGroupValue = undefined;
    } else if (typeof needGroupValueId === 'string') {
      needGroupValue = groupedProducts.values.find(
        (groupValue) => groupValue.value?.id === needGroupValueId
      );
    } else if (needGroupValueId === null) {
      needGroupValue = groupedProducts.values.find((groupValue) => {
        return (
          groupValue.value === undefined || groupValue.value?.id === undefined
        );
      });
    }

    if (needGroupValue) {
      if (copyGroupPath.length) {
        return findGroupValue(needGroupValue.child, copyGroupPath);
      } else {
        return needGroupValue;
      }
    } else {
      return needGroupValue;
    }
  } else {
    return undefined;
  }
}
