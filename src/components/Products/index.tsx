import React, { FC, useCallback } from 'react';
import {
  Button,
  Input,
  Form,
  Select,
  Space,
  Divider,
  DatePicker,
  Table,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { nanoid } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import {
  productsActions,
  productsSelectors,
  productCurrencies,
  TProduct,
} from '../../store/products';
import PageHeader from '../PageHeader';
import style from './style.module.css';

const rules = {
  reuired: { required: true, message: 'Обязательное поле' },
};

const Products: FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const products = useSelector(productsSelectors.selectAll);

  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Тикер',
      dataIndex: 'ticker',
      key: 'ticker',
    },
    {
      title: 'Валюта покупки',
      dataIndex: 'currency',
      key: 'currency',
    },
    {
      title: 'Действия',
      key: 'action',
      render: (text: any, product: TProduct) => {
        return (
          <Space size="middle">
            {/* <Link to={`${routes.reports.path}/${report.id}`}>Изменить</Link>
            <a onClick={() => deleteReport(report.id)}>Удалить</a> */}
          </Space>
        );
      },
    },
  ];

  const onFinish = (values: any) => {
    // console.log(values);
    dispatch(productsActions.setAll(values.products));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <PageHeader extra={[<Button type="primary">Добавить продукт</Button>]} />
      <Table columns={columns} dataSource={products} pagination={false} />
      <Form
        form={form}
        name="products"
        initialValues={{ products }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.List name="products">
          {(products, { add, remove }) => {
            return (
              <div>
                {products.map((product) => (
                  <Space
                    key={product.key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="start"
                  >
                    <Form.Item
                      {...product}
                      name={[product.name, 'name']}
                      fieldKey={[product.fieldKey, 'name']}
                      rules={[rules.reuired]}
                    >
                      <Input placeholder="Название продукта" />
                    </Form.Item>

                    <Form.Item
                      {...product}
                      name={[product.name, 'ticker']}
                      fieldKey={[product.fieldKey, 'ticker']}
                      rules={[rules.reuired]}
                    >
                      <Input placeholder="Тикер" />
                    </Form.Item>

                    <Form.Item
                      {...product}
                      name={[product.name, 'currency']}
                      fieldKey={[product.fieldKey, 'currency']}
                      rules={[rules.reuired]}
                    >
                      <Select
                        style={{ minWidth: 90 }}
                        placeholder="Валюта покупки"
                      >
                        {Object.keys(productCurrencies).map((currencyKey) => (
                          <Select.Option key={currencyKey} value={currencyKey}>
                            {currencyKey.toUpperCase()}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <MinusCircleOutlined
                      className={style.deleteButton}
                      onClick={() => {
                        remove(product.name);
                      }}
                    />
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add({
                        id: nanoid(),
                      });
                    }}
                    block
                  >
                    <PlusOutlined /> Добавить продукт
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Products;
