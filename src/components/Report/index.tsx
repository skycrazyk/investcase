import React, { FC, useState, useEffect } from 'react';
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
import { isEqual, cloneDeep } from 'lodash';
import moment from 'moment';
import {
  reportsSelectors,
  exchangeCurrencies,
  reportsActions,
  TProduct,
} from '../../store/reports';
import { State } from '../../store';
import { productsSelectors } from '../../store/products';
import routes from '../../routes';
import { rules } from '../../utils';
import ReportProduct from '../ReportProduct';
import { FormInstance } from 'antd/lib/form';

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

const useModalActions = () => {
  const [visible, setVisible] = useState(false);

  const show = () => {
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  return {
    visible,
    setVisible,
    show,
    hide,
  };
};

const formsNames = {
  createProduct: 'createProduct',
  editProduct: 'editProduct',
  report: 'report',
} as const;

const useProductsCatalogForCreate = (
  productsCatalog: ReturnType<typeof productsSelectors.selectAll>,
  form: FormInstance,
  updateCondition: any[]
) => {
  const [productsCatalogForCreate, setProductsCatalogForCreate] = useState<
    ReturnType<typeof productsSelectors.selectAll>
  >([]);

  const productsInForm = form.getFieldValue('products');

  useEffect(() => {
    setProductsCatalogForCreate(
      productsCatalog.filter(
        (catalogProduct) =>
          !productsInForm?.some(
            (productInForm: any) => productInForm.id === catalogProduct.id
          )
      )
    );
  }, updateCondition);

  return productsCatalogForCreate;
};

const useProductsCatalogForEdit = (
  editableProduct: TProduct | undefined,
  productsCatalog: ReturnType<typeof productsSelectors.selectAll>,
  form: FormInstance,
  updateCondition: any[]
) => {
  const [productsCatalogForEdit, setProductsCatalogForEdit] = useState<
    ReturnType<typeof productsSelectors.selectAll>
  >([]);

  const productsInForm: TProduct[] = form.getFieldValue('products');

  const productsInFormWithOutEditable = productsInForm?.filter(
    (item) => item.id !== editableProduct?.id
  );

  useEffect(() => {
    setProductsCatalogForEdit(
      productsCatalog.filter(
        (catalogProduct) =>
          !productsInFormWithOutEditable?.some(
            (productInForm: any) => productInForm.id === catalogProduct.id
          )
      )
    );
  }, updateCondition);

  return productsCatalogForEdit;
};

const Report: FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const routeParams = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const createModal = useModalActions();
  const editModal = useModalActions();
  const productsCatalog = useSelector(productsSelectors.selectAll);
  const productsCatalogEntities = useSelector(productsSelectors.selectEntities);
  const [editableProduct, setEditableProduct] = useState<any>();

  const report = useSelector((state: State) =>
    reportsSelectors.selectById(state, routeParams.id)
  );

  const productsCatalogForCreate = useProductsCatalogForCreate(
    productsCatalog,
    form,
    [createModal.visible]
  );

  const productsCatalogForEdit = useProductsCatalogForEdit(
    editableProduct,
    productsCatalog,
    form,
    [editModal.visible]
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

  const deleteProduct = (id: string) => {
    // Создаем копию массива чтобы изменить кол-во элементов
    const currentProducts: { id: string }[] = [
      ...form.getFieldValue('products'),
    ];

    const index = currentProducts.findIndex((item) => item.id === id);
    currentProducts.splice(index, 1);
    form.setFieldsValue({ products: currentProducts });
  };

  const editProduct = (id: string) => {
    const products: { id: string }[] = form.getFieldValue('products');
    const product = products.find((item) => item.id === id);
    setEditableProduct(product);
    // editableProduct = product;
    editModal.show();
  };

  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Действия',
      key: 'action',
      render: (text: any, record: { id: string }) => {
        return (
          <Space size="middle">
            <a onClick={() => editProduct(record.id)}>Изменить</a>
            <a onClick={() => deleteProduct(record.id)}>Удалить</a>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader onBack={() => history.goBack()} title={routes.report.name} />
      <Form.Provider
        onFormFinish={(name, { values, forms }) => {
          if (name === formsNames.createProduct) {
            const { report } = forms;
            const products = report.getFieldValue('products') || [];

            report.setFieldsValue({
              products: [...products, values],
            });

            createModal.hide();
          }

          if (name === formsNames.editProduct) {
            const { report } = forms;
            const products = [...(report.getFieldValue('products') || [])];

            const index = products.findIndex(
              (item) => item.id === editableProduct.id
            );

            products.splice(index, 1, values);

            report.setFieldsValue({
              products,
            });

            editModal.hide();
          }
        }}
      >
        <Form
          form={form}
          name={formsNames.report}
          initialValues={formAdapter.hidrate(report)}
          onFinishFailed={onFinishFailed}
          onFinish={onFinish}
          layout="vertical"
        >
          <Space size="large">
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
              onClick={createModal.show}
            >
              Добавить продукт
            </Button>
          </Form.Item>
        </Form>

        <ReportProduct
          productsCatalog={productsCatalogForCreate}
          onCancel={createModal.hide}
          okText="Ok"
          title="Добавить продукт"
          visible={createModal.visible}
          name={formsNames.createProduct}
        />

        <ReportProduct
          productsCatalog={productsCatalogForEdit}
          initialValues={editableProduct}
          onCancel={editModal.hide}
          okText="Ok"
          title="Изменить продукт"
          visible={editModal.visible}
          name={formsNames.editProduct}
        />
      </Form.Provider>
    </>
  );
};

export default Report;
