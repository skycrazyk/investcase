import React, { useRef, useEffect } from 'react';
import { Modal, Form, Select, InputNumber } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { cloneDeep } from 'lodash';
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
  name: string;
  initialValues?: any;
}

const ReportProduct: React.FC<ReportProductProps> = ({
  visible,
  onCancel,
  title,
  okText,
  productsCatalog,
  initialValues,
  name,
}) => {
  const [form] = Form.useForm();

  useResetFormOnCloseModal({
    form,
    visible,
  });

  useEffect(() => {
    if (initialValues) {
      form.resetFields();
    }
  }, [initialValues]);

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
        name={name}
        initialValues={cloneDeep(initialValues)}
      >
        <Form.Item
          name="id"
          fieldKey="id"
          rules={[rules.reuired]}
          label="Продукт"
        >
          <Select placeholder="Выберите продукт" allowClear>
            {productsCatalog.map((item) => (
              <Select.Option
                key={item.id}
                value={item.id}
                title={`${item.name} (${item.ticker})`}
              >
                {`${item.name} (${item.ticker})`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="count" rules={[rules.reuired]} label="Количество">
          <InputNumber placeholder="0" style={{ width: 150 }} min={1} />
        </Form.Item>

        <Form.Item
          label="Балансовая стоимость"
          name="balancePrice"
          rules={[rules.reuired]}
        >
          <InputNumber placeholder="0" style={{ width: 150 }} min={1} />
        </Form.Item>

        <Form.Item
          label="Ликвидационная стоимость"
          name="liquidationPrice"
          rules={[rules.reuired]}
        >
          <InputNumber placeholder="0" style={{ width: 150 }} min={1} />
        </Form.Item>

        <Form.Item name="payments" label="Дополнительные начисления">
          <InputNumber placeholder="0" style={{ width: 150 }} min={1} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReportProduct;
