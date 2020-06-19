import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Input, Radio, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { productsSelectors } from '../../store/products';
import { rules } from '../../utils';

const useResetFormOnCloseModal = ({
  form,
  visible,
}: {
  form: FormInstance;
  visible: any;
}) => {
  const prevVisibleRef = useRef();

  useEffect(() => {
    prevVisibleRef.current = visible;
  }, [visible]);

  const prevVisible = prevVisibleRef.current;

  useEffect(() => {
    if (!visible && prevVisible) {
      form.resetFields();
    }
  }, [visible]);
};

interface Values {
  title: string;
  description: string;
  modifier: string;
}

interface ReportProductProps {
  visible: boolean;
  onCancel: () => void;
  title: string;
  okText: string;
  productsCatalog: ReturnType<typeof productsSelectors['selectAll']>;
}

const ReportProduct: React.FC<ReportProductProps> = ({
  visible,
  onCancel,
  title,
  okText,
  productsCatalog,
}) => {
  const [form] = Form.useForm();

  useResetFormOnCloseModal({
    form,
    visible,
  });

  const onOk = () => {
    form.submit();
  };

  return (
    <Modal
      visible={visible}
      title={title}
      okText={okText}
      cancelText="Отмена"
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form
        form={form}
        layout="vertical"
        name="product"
        // TODO: initialValues в случае обновления
        // initialValues={{ modifier: 'public' }}
      >
        <Form.Item
          name="productId"
          fieldKey="productId"
          rules={[rules.reuired]}
        >
          <Select placeholder="Выберите продукт" allowClear>
            {
              // .map((catalogProduct) => {
              //   const selectedProducts = form.getFieldValue('reports')[
              //     reportIndex
              //   ].products;

              //   console.log(selectedProducts);

              //   const isUsed = selectedProducts.some(
              //     (product: any) => product?.id === catalogProduct?.id
              //   );

              //   return {
              //     ...catalogProduct,
              //     disabled: isUsed,
              //   };
              // })
              // .sort((a, b) => {
              //   if (a.disabled && !b.disabled) {
              //     return 1;
              //   } else if (!a.disabled && b.disabled) {
              //     return -1;
              //   } else {
              //     return 0;
              //   }
              // })
              productsCatalog.map((item) => (
                <Select.Option
                  key={item.id}
                  value={item.id}
                  title={`${item.name} (${item.ticker})`}
                  // disabled={item.disabled}s
                >
                  {`${item.name} (${item.ticker})`}
                </Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        {/* 
        <Form.Item
          {...product}
          name={[product.name, 'count']}
          fieldKey={[product.fieldKey, 'count']}
          rules={[rules.reuired]}
        >
          <Input placeholder="Количество" />
        </Form.Item>

        <Form.Item
          {...product}
          name={[product.name, 'liquidationPrice']}
          fieldKey={[product.fieldKey, 'liquidationPrice']}
          rules={[rules.reuired]}
        >
          <Input placeholder="Ликвидационная стоимость" />
        </Form.Item>

        <Form.Item
          {...product}
          name={[product.name, 'dividend']}
          fieldKey={[product.fieldKey, 'dividend']}
        >
          <Input placeholder="Дивиденты" />
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default ReportProduct;
