import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Form, Input, Select } from 'antd';
import { Store } from 'rc-field-form/es/interface';
import { productCurrencies, TProduct } from '../../store/products';
import { groupsSelectors } from '../../store/groups';
import { rules } from '../../utils';

type ProductProps = {
  title: string;
  visible: boolean;
  onOk: (values: Store) => void;
  onCancel: () => void;
  initialValues?: Partial<TProduct>;
};

const Product: FC<ProductProps> = ({
  visible,
  onCancel,
  onOk,
  title,
  initialValues,
}) => {
  // const groupsCatalogEntities = useSelector(groupsSelectors.selectEntities);
  const groupsCatalog = useSelector(groupsSelectors.selectAll);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      title={title}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(() => {
            const values = form.getFieldsValue([
              'name',
              'ticker',
              'currency',
              'id',
              'groups',
            ]);

            console.log(values);

            onOk(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="product"
        initialValues={initialValues}
      >
        <Form.Item name="name" fieldKey="name" rules={[rules.reuired]}>
          <Input placeholder="Название продукта" />
        </Form.Item>

        <Form.Item name="ticker" fieldKey="ticker" rules={[rules.reuired]}>
          <Input placeholder="Тикер" />
        </Form.Item>

        <Form.Item name="currency" fieldKey="currency" rules={[rules.reuired]}>
          <Select style={{ minWidth: 90 }} placeholder="Валюта покупки">
            {Object.keys(productCurrencies).map((currencyKey) => (
              <Select.Option key={currencyKey} value={currencyKey}>
                {currencyKey.toUpperCase()}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* <Form.List name="groups">
          {(groups) => (
            <div>
              {groups.map((group) => {
                const currentGroup = groupsCatalogEntities[group.id];

                return (
                  <Form.Item {...group}>
                    <Select>{}</Select>
                  </Form.Item>
                );
              })}
            </div>
          )}
        </Form.List> */}

        {groupsCatalog.map((group, idx) => {
          return (
            <Form.Item
              name={['groups', idx]}
              fieldKey={['groups', idx]}
              rules={[rules.reuired]}
              normalize={(valueId, prevValue, prevValues) => ({
                id: group.id,
                valueId,
              })}
            >
              <Select style={{ minWidth: 90 }} placeholder={group.name}>
                {group.values.map((groupValue) => (
                  <Select.Option key={groupValue.id} value={groupValue.id}>
                    {groupValue.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          );
        })}
      </Form>
    </Modal>
  );
};

export default Product;
