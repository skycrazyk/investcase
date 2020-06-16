import React, { FC } from 'react';
import { PageHeader, Button, Form, DatePicker, InputNumber } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
      rate: report.rate,
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

  const report = useSelector((state: State) =>
    reportsSelectors.selectById(state, routeParams.id)
  );

  const onFinish = (changedValues: any, allValues: any) => {
    const resolvedValues = formAdapter.serialize(allValues);

    dispatch(
      reportsActions.updateOne({
        id: routeParams.id,
        changes: resolvedValues,
      })
    );
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

      <Form
        form={form}
        name="report"
        initialValues={formAdapter.hidrate(report)}
        onFinishFailed={onFinishFailed}
        onValuesChange={onFinish}
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
      </Form>
    </>
  );
};

export default Report;
