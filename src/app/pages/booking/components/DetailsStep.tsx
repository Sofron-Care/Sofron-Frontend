import { Button, Input, Radio, Form } from "antd";
import { useAuth } from "../../../auth/AuthContext";

type Props = {
  details: string;
  firstVisit: boolean | null;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  onDetailsChange: (value: string) => void;
  onFirstVisitChange: (value: boolean) => void;

  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;

  onContinue: () => void;
};

export default function DetailsStep({
  details,
  firstVisit,

  firstName,
  lastName,
  email,
  phone,

  onDetailsChange,
  onFirstVisitChange,

  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange,

  onContinue,
}: Props) {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      onContinue();
    } catch {

    }
  };

  return (
    <div className="booking-panel">
      <h2 className="booking-panel__title">Additional details</h2>

      <Form form={form} layout="vertical" className="booking-details-form">
        {!isAuthenticated && (
          <div className="booking-details-form__section">
            <Form.Item
              label="First Name"
              name="firstName"
              initialValue={firstName}
              rules={[{ required: true, message: "First name is required" }]}
            >
              <Input onChange={(e) => onFirstNameChange(e.target.value)} />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              initialValue={lastName}
              rules={[{ required: true, message: "Last name is required" }]}
            >
              <Input onChange={(e) => onLastNameChange(e.target.value)} />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              initialValue={email}
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input onChange={(e) => onEmailChange(e.target.value)} />
            </Form.Item>

            <Form.Item
              label="Phone (optional)"
              name="phone"
              initialValue={phone}
            >
              <Input onChange={(e) => onPhoneChange(e.target.value)} />
            </Form.Item>
          </div>
        )}

        <Form.Item label="Notes (optional)">
          <Input.TextArea
            rows={5}
            value={details}
            onChange={(e) => onDetailsChange(e.target.value)}
            placeholder="Share anything the clinic should know before your visit"
          />
        </Form.Item>

        <Form.Item label="First time visit?">
          <Radio.Group
            value={firstVisit}
            onChange={(e) => onFirstVisitChange(e.target.value)}
          >
            <Radio value={true}>Yes</Radio>
            <Radio value={false}>No</Radio>
          </Radio.Group>
        </Form.Item>

        <Button type="primary" onClick={handleSubmit}>
          Continue
        </Button>
      </Form>
    </div>
  );
}
