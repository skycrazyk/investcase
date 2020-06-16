import React, { useState } from 'react';
import { Modal, Form, Input, Radio } from 'antd';

interface Values {
  title: string;
  description: string;
  modifier: string;
}

interface ReportProductProps {
  visible: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
  title: string;
  okText: string;
}

const ReportProduct: React.FC<ReportProductProps> = ({
  visible,
  onCreate,
  onCancel,
  title,
  okText,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title={title}
      okText={okText}
      cancelText="Отмена"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: 'public' }}
      >
        Hello
      </Form>
    </Modal>
  );
};

export default ReportProduct;

// const CollectionsPage = () => {
//   const [visible, setVisible] = useState(false);

//   const onCreate = values => {
//     console.log('Received values of form: ', values);
//     setVisible(false);
//   };

//   return (
//     <div>
//       <Button
//         type="primary"
//         onClick={() => {
//           setVisible(true);
//         }}
//       >
//         New Collection
//       </Button>
//       <CollectionCreateForm
//         visible={visible}
//         onCreate={onCreate}
//         onCancel={() => {
//           setVisible(false);
//         }}
//       />
//     </div>
//   );
// };
