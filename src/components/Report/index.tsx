import React, { FC, useState } from 'react';
import {
  PageHeader,
  Button,
  Form,
  DatePicker,
  InputNumber,
  Table,
  Space,
} from 'antd';
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
  const productsCatalog = useSelector(productsSelectors.selectAll);
  const productsCatalogEntities = useSelector(productsSelectors.selectEntities);

  const showProductsModal = () => {
    setVisible(true);
  };

  const hideProductsModal = () => {
    setVisible(false);
  };

  const report = useSelector((state: State) =>
    reportsSelectors.selectById(state, routeParams.id)
  );

  const onFinish = () => {
    const values = form.getFieldsValue(['products', 'rate', 'date']);
    const resolvedValues = formAdapter.serialize(values);

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
      <PageHeader onBack={() => history.goBack()} title={routes.report.name} />
      {/* TODO: https://ant.design/components/form/#components-form-demo-form-context */}
      <Form.Provider
        onFormFinish={(name, { values, forms }) => {
          if (name === 'product') {
            console.log(values);
            const { report } = forms;
            const products = report.getFieldValue('products') || [];
            // TODO: логика обновления
            report.setFieldsValue({
              products: [...products, { id: values.productId }],
            });

            hideProductsModal();
          }
        }}
      >
        <Form
          form={form}
          name="report"
          initialValues={formAdapter.hidrate(report)}
          onFinishFailed={onFinishFailed}
          onFinish={onFinish}
          layout="vertical"
        >
          <Space>
            <Form.Item
              label="Дата"
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
                  label={`Курс ${currencyKey.toUpperCase()}`}
                  name={['rate', currencyKey]}
                  fieldKey={['rate', currencyKey]}
                  key={['rate', currencyKey].join('.')}
                  rules={[rules.reuired]}
                >
                  <InputNumber placeholder={`Курс ${currencyKey}`} step="0.1" />
                </Form.Item>
              );
            })}
          </Space>

          <Form.Item
            shouldUpdate={(prevValues, curValues) =>
              !isEqual(prevValues.products, curValues.products)
            }
          >
            {({ getFieldValue }) => {
              const products = getFieldValue('products') || [];

              const dataSource = products.map((item: any) => ({
                ...item,
                name: productsCatalogEntities[item.id]?.['name'],
                key: item.id,
              }));

              return (
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  pagination={false}
                />
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
          productsCatalog={productsCatalog}
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
