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

const Reports: FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const reports = useSelector(reportsSelectors.selectAll);

  const onFinish = (values: any) => {
    const resolvedValues = values.reports.map((report: any) => ({
      ...report,
      date: report.date.format('YYYY-MM-DD'),
    }));

    dispatch(reportsActions.setAll(resolvedValues));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const getLastReport = useCallback(() => form.getFieldValue('reports')[0], [
    form,
  ]);

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
                                rules={[rules.reuired]}
                              >
                                <Input placeholder="Дивиденты" />
                              </Form.Item>

                              <Form.Item
                                {...product}
                                name={[product.name, 'currency']}
                                fieldKey={[product.fieldKey, 'currency']}
                                rules={[rules.reuired]}
                              >
                                <Select style={{ minWidth: 90 }}>
                                  {Object.keys(productCurrencies).map(
                                    (currencyKey) => (
                                      <Select.Option
                                        key={currencyKey}
                                        value={currencyKey}
                                      >
                                        {currencyKey.toUpperCase()}
                                      </Select.Option>
                                    )
                                  )}
                                </Select>
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
                                addProduct({
                                  ...getLastReport(),
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

export default Reports;
