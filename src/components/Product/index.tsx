import React, { FC, useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { productCurrencies, TProduct } from '../../store/products';
import { rules } from '../../utils';

type ProductProps = {
  title: string;
  visible: boolean;
  onOk: (values: any) => void;
  onCancel: () => void;
  initialValues: Partial<TProduct>;
};

const Product: FC<ProductProps> = ({
  visible,
  onCancel,
  onOk,
  title,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible === true) {
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
            ]);

            onOk(values);
            onCancel();
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
        // TODO: initialValues для редактирования
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
      </Form>
    </Modal>
  );
};

export default Product;
