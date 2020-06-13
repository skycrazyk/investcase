import React, { FC, useCallback } from 'react';
import { Button, Input, Form, Select, Space, Divider, DatePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { nanoid } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import {
  reportsSelectors,
  reportsActions,
  exchangeCurrencies,
  productCurrencies,
} from '../../store/reports';
import { productsSelectors } from '../../store/products';
import { getProducts } from '../../selectors';
import style from './style.module.css';

const rules = {
  reuired: { required: true, message: 'Обязательное поле' },
};

const prepareReports = {
  hidrate: (reports: ReturnType<typeof reportsSelectors.selectAll>) => {
    return reports.map((report) => {
      return {
        ...report,
        date: moment(report.date, 'YYYY-MM-DD'),
      };
    });
  },
  serialize: (values: any) =>
    values.reports.map((report: any) => ({
      ...report,
      date: report.date.format('YYYY-MM-DD'),
    })),
};

const ReportsItem: FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const reports = useSelector(reportsSelectors.selectAll);

  const onFinish = (values: any) => {
    const resolvedValues = prepareReports.serialize(values);
    dispatch(reportsActions.setAll(resolvedValues));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const getLastReport = useCallback(() => form.getFieldValue('reports')[0], [
    form,
  ]);

  const catalog = useSelector(productsSelectors.selectAll);

  return (
    <Form
      form={form}
      name="reports"
      initialValues={{ reports: prepareReports.hidrate(reports) }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.List name="reports">
        {(reports, { add, remove }) => {
          return (
            <div>
              {reports.map((report, reportIndex) => (
                <div key={report.key}>
                  {reportIndex > 0 && (
                    <Divider
                      orientation="left"
                      style={{ marginBottom: 40, marginTop: 40 }}
                    />
                  )}

                  <Space
                    style={{
                      display: 'flex',
                      marginBottom: 2,
                    }}
                    align="start"
                  >
                    <Form.Item
                      {...report}
                      name={[report.name, 'date']}
                      fieldKey={[report.fieldKey, 'date']}
                      rules={[rules.reuired]}
                    >
                      <DatePicker />
                    </Form.Item>

                    {Object.keys(exchangeCurrencies).map((currencyKey) => {
                      return (
                        <Form.Item
                          {...report}
                          name={[report.name, 'rate', currencyKey]}
                          fieldKey={[report.fieldKey, 'rate', currencyKey]}
                          rules={[rules.reuired]}
                        >
                          <Input placeholder={`Курс ${currencyKey}`} />
                        </Form.Item>
                      );
                    })}

                    <MinusCircleOutlined
                      className={style.deleteButton}
                      onClick={() => {
                        remove(report.name);
                      }}
                    />
                  </Space>

                  <Form.List name={[report.name, 'products']}>
                    {(products, { add: addProduct, remove: removeProduct }) => {
                      return (
                        <div style={{ marginLeft: 32 }}>
                          {products.map((product) => (
                            <Space
                              key={product.key}
                              style={{ display: 'flex', marginBottom: 8 }}
                              align="start"
                            >
                              <Form.Item
                                {...product}
                                name={[product.name, 'id']}
                                fieldKey={[product.fieldKey, 'id']}
                                rules={[rules.reuired]}
                              >
                                <Select
                                  placeholder="Выберите продукт"
                                  allowClear
                                >
                                  {catalog
                                    .map((catalogProduct) => {
                                      const selectedProducts = form.getFieldValue(
                                        'reports'
                                      )[reportIndex].products;

                                      const isUsed = selectedProducts.some(
                                        (product: any) =>
                                          product?.id === catalogProduct?.id
                                      );

                                      return {
                                        ...catalogProduct,
                                        disabled: isUsed,
                                      };
                                    })
                                    .sort((a, b) => {
                                      if (a.disabled && !b.disabled) {
                                        return 1;
                                      } else if (!a.disabled && b.disabled) {
                                        return -1;
                                      } else {
                                        return 0;
                                      }
                                    })
                                    .map((item) => (
                                      <Select.Option
                                        key={item.id}
                                        value={item.id}
                                        title={`${item.name} (${item.ticker})`}
                                        disabled={item.disabled}
                                      >
                                        {`${item.name} (${item.ticker})`}
                                      </Select.Option>
                                    ))}
                                </Select>
                              </Form.Item>

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
                                fieldKey={[
                                  product.fieldKey,
                                  'liquidationPrice',
                                ]}
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
                              </Form.Item>

                              <MinusCircleOutlined
                                className={style.deleteButton}
                                onClick={() => {
                                  removeProduct(product.name);
                                }}
                              />
                            </Space>
                          ))}

                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => {
                                addProduct();
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
                </div>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    console.log(getLastReport());
                    add({
                      ...getLastReport(),
                      id: nanoid(),
                    });
                  }}
                  block
                >
                  <PlusOutlined /> Добавить отчет
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
  );
};

export default ReportsItem;
