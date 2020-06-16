import React, { FC, useState } from 'react';
import { PageHeader, Button, Form, DatePicker, InputNumber } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { isEqual } from 'lodash';
import moment from 'moment';
import {
  reportsSelectors,
  exchangeCurrencies,
  reportsActions,
} from '../../store/reports';
import { State } from '../../store';
import routes from '../../routes';

const hidrate = (report: ReturnType<typeof reportsSelectors.selectById>) => {
  return (
    report && {
      ...report,
      date: moment(report.date, 'YYYY-MM-DD'),
    }
  );
};

const serialize = (report: any) => {
  return (
    report && {
      ...report,
      date: report.date.format('YYYY-MM-DD'),
    }
  );
};

const formAdapter = {
  hidrate,
  serialize,
};

const rules = {
  reuired: { required: true, message: 'Обязательное поле' },
};

const Report: FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const routeParams = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const showProductsModal = () => {
    setVisible(true);
  };

  const hideProductsModal = () => {
    setVisible(false);
  };

  const report = useSelector((state: State) =>
    reportsSelectors.selectById(state, routeParams.id)
  );

  const onFinish = (values: any) => {
    const resolvedValues = formAdapter.serialize(values);
    console.log(resolvedValues);
    // dispatch(
    //   reportsActions.updateOne({
    //     id: routeParams.id,
    //     changes: resolvedValues,
    //   })
    // );
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <PageHeader
        onBack={() => history.goBack()}
        title={routes.report.name}
        extra={[
          <Button type="primary" key="1">
            Добавить продукт
          </Button>,
        ]}
      />
      {/* TODO: https://ant.design/components/form/#components-form-demo-form-context */}
      <Form.Provider
        onFormFinish={(name, { values, forms }) => {
          if (name === 'product') {
            const { report } = forms;
            const products = report.getFieldValue('products') || [];
            report.setFieldsValue({ products: [...products, values] });
            setVisible(false);
          }
        }}
      >
        <Form
          form={form}
          name="report"
          initialValues={formAdapter.hidrate(report)}
          onFinishFailed={onFinishFailed}
          onFinish={onFinish}
        >
          <Form.Item
            name="date"
            fieldKey="date"
            key="date"
            rules={[rules.reuired]}
          >
            <DatePicker />
          </Form.Item>

          {Object.keys(exchangeCurrencies).map((currencyKey) => {
            return (
              <Form.Item
                {...report}
                name={['rate', currencyKey]}
                fieldKey={['rate', currencyKey]}
                key={['rate', currencyKey].join('.')}
                rules={[rules.reuired]}
              >
                <InputNumber placeholder={`Курс ${currencyKey}`} step="0.1" />
              </Form.Item>
            );
          })}

          <Form.Item
            label="Продукты"
            shouldUpdate={(prevValues, curValues) =>
              prevValues.users !== curValues.users
            }
          >
            {({ getFieldValue }) => {
              const users = getFieldValue('users') || [];
              return users.length ? (
                <ul>
                  {users.map((user, index) => (
                    <li key={index} className="user">
                      <Avatar icon={<UserOutlined />} />
                      {user.name} - {user.age}
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography.Text className="ant-form-text" type="secondary">
                  ( <SmileOutlined /> No user yet. )
                </Typography.Text>
              );
            }}
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" type="primary">
              Сохранить
            </Button>
            <Button htmlType="button" style={{ margin: '0 8px' }}>
              Добавить продукт
            </Button>
          </Form.Item>
        </Form>
      </Form.Provider>
    </>
  );
};

export default Report;
