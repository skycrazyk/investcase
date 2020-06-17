import React, { FC, useState } from 'react';
import {
  PageHeader,
  Button,
  Form,
  DatePicker,
  InputNumber,
  Typography,
  Table,
} from 'antd';
import { SmileOutlined, UserOutlined } from '@ant-design/icons';
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
import { productsSelectors } from '../../store/products';
import routes from '../../routes';
import { rules } from '../../utils';
import ReportProduct from '../ReportProduct';

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

const columns = [
  {
    title: 'Название',
    dataIndex: 'name',
    key: 'name',
  },
];

const Report: FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const routeParams = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const products = useSelector(productsSelectors.selectAll);

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
      <PageHeader onBack={() => history.goBack()} title={routes.report.name} />
      {/* TODO: https://ant.design/components/form/#components-form-demo-form-context */}
      <Form.Provider
        onFormFinish={(name, { values, forms }) => {
          if (name === 'product') {
            console.log(values);
            const { report } = forms;
            const products = report.getFieldValue('products') || [];
            // TODO: логика обновления
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
              !isEqual(prevValues.products, curValues.products)
            }
          >
            {({ getFieldValue }) => {
              const products = getFieldValue('products') || [];

              return products.length ? (
                <Table
                  columns={columns}
                  dataSource={products}
                  pagination={false}
                />
              ) : (
                <Typography.Text className="ant-form-text" type="secondary">
                  ( <SmileOutlined /> No products yet. )
                </Typography.Text>
              );
            }}
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" type="primary">
              Сохранить
            </Button>
            <Button
              htmlType="button"
              style={{ margin: '0 8px' }}
              onClick={showProductsModal}
            >
              Добавить продукт
            </Button>
          </Form.Item>
        </Form>

        <ReportProduct
          products={products}
          onCancel={hideProductsModal}
          okText="Ok"
          title="Добавить продукт"
          visible={visible}
        />
      </Form.Provider>
    </>
  );
};

export default Report;
