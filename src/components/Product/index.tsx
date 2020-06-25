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
        <Form.Item
          label="Название продукта"
          name="name"
          fieldKey="name"
          rules={[rules.reuired]}
        >
          <Input placeholder="Введите название продукта" />
        </Form.Item>

        <Form.Item
          label="Тикер"
          name="ticker"
          fieldKey="ticker"
          rules={[rules.reuired]}
        >
          <Input placeholder="Введите тикер" />
        </Form.Item>

        <Form.Item
          label="Валюта покупки"
          name="currency"
          fieldKey="currency"
          rules={[rules.reuired]}
        >
          <Select placeholder="Выберите валюту покупки">
            {Object.keys(productCurrencies).map((currencyKey) => (
              <Select.Option key={currencyKey} value={currencyKey}>
                {currencyKey.toUpperCase()}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {groupsCatalog.map((group) => {
          return (
            <Form.Item
              label={group.name}
              name={['groups', group.id]}
              fieldKey={['groups', group.id]}
              // rules={[rules.reuired]}
            >
              <Select placeholder={group.name}>
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
