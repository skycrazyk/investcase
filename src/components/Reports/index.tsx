import React, { FC } from 'react';
import { Button, Input, Form, Select, Space, Divider, DatePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { nanoid } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import {
  reportsSelectors,
  reportsActions,
  currency,
} from '../../store/reports';
import style from './style.module.css';

const rules = {
  reuired: { required: true, message: 'Обязательное поле' },
};

const Reports: FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const reports = useSelector(reportsSelectors.selectAll);

  const onFinish = (values: any) => {
    // dispatch(reportsActions.addOne(values.groups));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      form={form}
      name="reports"
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

                    {Object.keys(currency).map((currencyKey) => {
                      return (
                        <Form.Item
                          {...report}
                          name={[report.name, `rate.${currencyKey}`]}
                          fieldKey={[report.fieldKey, `rate.${currencyKey}`]}
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

                  {/* <Form.List name={[group.name, 'values']}>
                    {(
                      groupValues,
                      { add: addGroupValue, remove: removeGroupValue }
                    ) => {
                      return (
                        <div style={{ marginLeft: 32 }}>
                          {groupValues.map((groupValue) => (
                            <Space
                              key={groupValue.key}
                              style={{ display: 'flex', marginBottom: 8 }}
                              align="start"
                            >
                              <Form.Item
                                {...groupValue}
                                name={[groupValue.name, 'name']}
                                fieldKey={[groupValue.fieldKey, 'name']}
                                rules={[rules.reuired]}
                              >
                                <Input placeholder="Значение" />
                              </Form.Item>

                              <MinusCircleOutlined
                                className={style.deleteButton}
                                onClick={() => {
                                  removeGroupValue(groupValue.name);
                                }}
                              />
                            </Space>
                          ))}

                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => {
                                addGroupValue({
                                  name: '',
                                  id: nanoid(),
                                });
                              }}
                              block
                            >
                              <PlusOutlined /> Добавить значение
                            </Button>
                          </Form.Item>
                        </div>
                      );
                    }}
                  </Form.List> */}
                </div>
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
                  <PlusOutlined /> Добавить группу
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
